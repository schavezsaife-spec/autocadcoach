import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Permanent storage for annotated lesson screenshots. Uploads go to the
 * `lesson-screenshots` Storage bucket at their original resolution; the
 * resulting URL is saved to the `public.lesson_images` table so every
 * visitor sees the same official screenshot for each lesson slot.
 *
 * Slot keys:
 *   - `step:<index>`      annotated screenshot for a specific step
 *   - `visual`            main visual reference image
 *   - `before` / `after`  the before vs after comparison
 */
const BUCKET = "lesson-screenshots";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // ~10 years
const MAX_BYTES = 25 * 1024 * 1024; // 25MB — preserves original resolution

export type LessonImageMap = Record<string, string>;

// Language-aware slot naming: an English image lives at the base slot (e.g.
// `step:0`, `visual`, `before`). Its Spanish counterpart lives at
// `<slot>:es`. Storing them as separate rows means uploading a Spanish
// image never overwrites the English one, and existing rows keep working
// as English by default.
export const ES_SUFFIX = ":es";

export function localizedSlot(slot: string, lang: "en" | "es"): string {
  return lang === "es" ? `${slot}${ES_SUFFIX}` : slot;
}

/**
 * Return a slot→url map where each base slot resolves to the image for the
 * requested language, falling back to the English image when the Spanish
 * one is missing. Also preserves the raw `<slot>:es` keys so callers that
 * want to inspect the Spanish upload directly (e.g. the editor) still can.
 */
export function pickLocalizedImages(map: LessonImageMap, lang: "en" | "es"): LessonImageMap {
  if (lang === "en") return map;
  const out: LessonImageMap = { ...map };
  for (const [key, url] of Object.entries(map)) {
    if (key.endsWith(ES_SUFFIX)) continue;
    const es = map[`${key}${ES_SUFFIX}`];
    if (es) out[key] = es;
  }
  return out;
}

type Row = { lesson_id: string; slot: string; url: string; storage_path: string | null };

// -----------------------------------------------------------------------------
// Auto-trim uniform margins (e.g. dark letterbox baked into a PNG) before upload
// -----------------------------------------------------------------------------

const TRIM_TOLERANCE = 10; // per-channel RGB tolerance
const TRIM_MAX_FRACTION = 0.4; // safety net: never trim more than 40% of a dim

function isNearBg(r: number, g: number, b: number, a: number, br: number, bg: number, bb: number, ba: number) {
  // Treat fully-transparent pixels as background too.
  if (a === 0 && ba === 0) return true;
  return (
    Math.abs(r - br) <= TRIM_TOLERANCE &&
    Math.abs(g - bg) <= TRIM_TOLERANCE &&
    Math.abs(b - bb) <= TRIM_TOLERANCE &&
    Math.abs(a - ba) <= TRIM_TOLERANCE
  );
}

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

type TrimResult = {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  trimmed: boolean;
};

async function trimCanvas(img: HTMLImageElement, mime: string): Promise<TrimResult> {
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D unavailable");
  ctx.drawImage(img, 0, 0);

  let data: ImageData;
  try {
    data = ctx.getImageData(0, 0, W, H);
  } catch {
    // CORS-tainted; can't read pixels — skip trim.
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, mime));
    if (!blob) throw new Error("Canvas export failed");
    return { blob, width: W, height: H, originalWidth: W, originalHeight: H, trimmed: false };
  }
  const px = data.data;
  const idx = (x: number, y: number) => (y * W + x) * 4;

  // Sample background from the four corners; use the median-ish (average) as bg.
  const corners = [
    [0, 0],
    [W - 1, 0],
    [0, H - 1],
    [W - 1, H - 1],
  ] as const;
  let br = 0, bgc = 0, bb = 0, ba = 0;
  for (const [x, y] of corners) {
    const i = idx(x, y);
    br += px[i]; bgc += px[i + 1]; bb += px[i + 2]; ba += px[i + 3];
  }
  br = Math.round(br / 4); bgc = Math.round(bgc / 4); bb = Math.round(bb / 4); ba = Math.round(ba / 4);

  const rowIsBg = (y: number) => {
    for (let x = 0; x < W; x++) {
      const i = idx(x, y);
      if (!isNearBg(px[i], px[i + 1], px[i + 2], px[i + 3], br, bgc, bb, ba)) return false;
    }
    return true;
  };
  const colIsBg = (x: number) => {
    for (let y = 0; y < H; y++) {
      const i = idx(x, y);
      if (!isNearBg(px[i], px[i + 1], px[i + 2], px[i + 3], br, bgc, bb, ba)) return false;
    }
    return true;
  };

  let top = 0;
  while (top < H && rowIsBg(top)) top++;
  let bottom = H - 1;
  while (bottom > top && rowIsBg(bottom)) bottom--;
  let left = 0;
  while (left < W && colIsBg(left)) left++;
  let right = W - 1;
  while (right > left && colIsBg(right)) right--;

  const newW = right - left + 1;
  const newH = bottom - top + 1;

  // Safety net: skip trim if it would remove too much (likely false positive).
  if (
    newW <= 0 ||
    newH <= 0 ||
    newW < W * (1 - TRIM_MAX_FRACTION) ||
    newH < H * (1 - TRIM_MAX_FRACTION) ||
    (newW === W && newH === H)
  ) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, mime));
    if (!blob) throw new Error("Canvas export failed");
    return {
      blob,
      width: W,
      height: H,
      originalWidth: W,
      originalHeight: H,
      trimmed: false,
    };
  }

  const out = document.createElement("canvas");
  out.width = newW;
  out.height = newH;
  const octx = out.getContext("2d");
  if (!octx) throw new Error("Canvas 2D unavailable");
  octx.drawImage(canvas, left, top, newW, newH, 0, 0, newW, newH);
  const quality = mime === "image/jpeg" ? 0.95 : undefined;
  const blob = await new Promise<Blob | null>((r) => out.toBlob(r, mime, quality));
  if (!blob) throw new Error("Canvas export failed");
  return { blob, width: newW, height: newH, originalWidth: W, originalHeight: H, trimmed: true };
}

export async function autoTrimImageFile(file: File): Promise<{ file: File; trimmed: boolean; before: [number, number]; after: [number, number] }> {
  try {
    const img = await loadImageFromBlob(file);
    const mime = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
    const result = await trimCanvas(img, mime);
    if (!result.trimmed) {
      return { file, trimmed: false, before: [result.originalWidth, result.originalHeight], after: [result.width, result.height] };
    }
    const ext = mime === "image/jpeg" ? "jpg" : "png";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const trimmed = new File([result.blob], `${baseName}.trimmed.${ext}`, { type: mime });
    return { file: trimmed, trimmed: true, before: [result.originalWidth, result.originalHeight], after: [result.width, result.height] };
  } catch (err) {
    console.warn("[lesson-images] auto-trim failed, uploading original", err);
    return { file, trimmed: false, before: [0, 0], after: [0, 0] };
  }
}

export async function autoTrimImageFromUrl(url: string): Promise<{ blob: Blob; mime: string; before: [number, number]; after: [number, number]; trimmed: boolean }> {
  const img = await loadImageFromUrl(url);
  // Infer mime from url path
  const lower = url.split("?")[0].toLowerCase();
  const mime = lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "image/jpeg" : "image/png";
  const result = await trimCanvas(img, mime);
  return { blob: result.blob, mime, before: [result.originalWidth, result.originalHeight], after: [result.width, result.height], trimmed: result.trimmed };
}

// -----------------------------------------------------------------------------

// In-memory cache keyed by lessonId so navigating between lessons feels instant.
const cache = new Map<string, LessonImageMap>();
const pathCache = new Map<string, Map<string, string | null>>();
const inflight = new Map<string, Promise<LessonImageMap>>();

function emitChange(lessonId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("lesson-images-changed", { detail: { lessonId } }),
  );
}

async function fetchLessonImages(lessonId: string): Promise<LessonImageMap> {
  const existing = inflight.get(lessonId);
  if (existing) return existing;
  const promise = (async () => {
    const { data, error } = await supabase
      .from("lesson_images")
      .select("lesson_id, slot, url, storage_path")
      .eq("lesson_id", lessonId);
    if (error) {
      console.error("[lesson-images] fetch failed", error);
      return {};
    }
    const map: LessonImageMap = {};
    const paths = new Map<string, string | null>();
    for (const row of (data ?? []) as Row[]) {
      map[row.slot] = row.url;
      paths.set(row.slot, row.storage_path);
    }
    cache.set(lessonId, map);
    pathCache.set(lessonId, paths);
    return map;
  })();
  inflight.set(lessonId, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(lessonId);
  }
}

export function getLessonImages(lessonId: string): LessonImageMap {
  return cache.get(lessonId) ?? {};
}

export function useLessonImages(lessonId: string): LessonImageMap {
  const [map, setMap] = useState<LessonImageMap>(() => getLessonImages(lessonId));
  useEffect(() => {
    let active = true;
    setMap(getLessonImages(lessonId));
    fetchLessonImages(lessonId).then((m) => {
      if (active) setMap({ ...m });
    });
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lessonId?: string } | undefined;
      if (!detail || detail.lessonId === lessonId) {
        setMap({ ...getLessonImages(lessonId) });
      }
    };
    window.addEventListener("lesson-images-changed", onChange);
    return () => {
      active = false;
      window.removeEventListener("lesson-images-changed", onChange);
    };
  }, [lessonId]);
  return map;
}

function safeSlotPath(slot: string) {
  return slot.replace(/[^a-z0-9_-]+/gi, "_");
}

export async function uploadLessonImage(
  lessonId: string,
  slot: string,
  file: File,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (PNG, JPG, or WebP).");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be under 25MB.");
  }

  // Auto-trim uniform margins baked into the source image.
  const trimmed = await autoTrimImageFile(file);
  const uploadFile = trimmed.file;
  if (trimmed.trimmed) {
    console.info(
      `[lesson-images] trimmed ${lessonId}/${slot}: ${trimmed.before[0]}x${trimmed.before[1]} → ${trimmed.after[0]}x${trimmed.after[1]}`,
    );
  }

  const ext = uploadFile.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${lessonId}/${safeSlotPath(slot)}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, uploadFile, { cacheControl: "31536000", upsert: false, contentType: uploadFile.type });
  if (upErr) throw new Error(upErr.message);

  const { data: signed, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signErr || !signed?.signedUrl) {
    throw new Error(signErr?.message ?? "Could not generate image URL.");
  }
  const url = signed.signedUrl;

  // Remember the old storage path so we can clean it up after the upsert.
  const previousPath = pathCache.get(lessonId)?.get(slot) ?? null;

  const { error: dbErr } = await supabase
    .from("lesson_images")
    .upsert(
      { lesson_id: lessonId, slot, url, storage_path: path, updated_at: new Date().toISOString() },
      { onConflict: "lesson_id,slot" },
    );
  if (dbErr) {
    // Roll back the upload so we don't orphan a file.
    await supabase.storage.from(BUCKET).remove([path]).catch(() => undefined);
    throw new Error(dbErr.message);
  }

  // Update caches and notify listeners immediately.
  const next = { ...(cache.get(lessonId) ?? {}), [slot]: url };
  cache.set(lessonId, next);
  const paths = pathCache.get(lessonId) ?? new Map<string, string | null>();
  paths.set(slot, path);
  pathCache.set(lessonId, paths);
  emitChange(lessonId);

  if (previousPath && previousPath !== path) {
    supabase.storage.from(BUCKET).remove([previousPath]).catch(() => undefined);
  }

  return url;
}

export async function clearLessonImage(lessonId: string, slot: string): Promise<void> {
  const previousPath = pathCache.get(lessonId)?.get(slot) ?? null;

  const { error } = await supabase
    .from("lesson_images")
    .delete()
    .eq("lesson_id", lessonId)
    .eq("slot", slot);
  if (error) throw new Error(error.message);

  if (previousPath) {
    supabase.storage.from(BUCKET).remove([previousPath]).catch(() => undefined);
  }

  const current = { ...(cache.get(lessonId) ?? {}) };
  delete current[slot];
  cache.set(lessonId, current);
  const paths = pathCache.get(lessonId);
  if (paths) paths.delete(slot);
  emitChange(lessonId);
}

// -----------------------------------------------------------------------------
// One-time migration: re-trim already-uploaded lesson images in place.
// -----------------------------------------------------------------------------

export type ReprocessResult = {
  lessonId: string;
  slot: string;
  before: [number, number];
  after: [number, number];
  trimmed: boolean;
  skipped?: string;
  error?: string;
};

export async function reprocessLessonImages(lessonIds: string[]): Promise<ReprocessResult[]> {
  const { data, error } = await supabase
    .from("lesson_images")
    .select("lesson_id, slot, url, storage_path")
    .in("lesson_id", lessonIds);
  if (error) throw new Error(error.message);

  const results: ReprocessResult[] = [];
  for (const row of (data ?? []) as Row[]) {
    try {
      const trim = await autoTrimImageFromUrl(row.url);
      if (!trim.trimmed) {
        results.push({
          lessonId: row.lesson_id,
          slot: row.slot,
          before: trim.before,
          after: trim.after,
          trimmed: false,
          skipped: "already tight",
        });
        console.info(
          `[lesson-images] reprocess skip ${row.lesson_id}/${row.slot}: ${trim.before[0]}x${trim.before[1]} (no trim needed)`,
        );
        continue;
      }

      const ext = trim.mime === "image/jpeg" ? "jpg" : "png";
      const newPath = `${row.lesson_id}/${safeSlotPath(row.slot)}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(newPath, trim.blob, {
          cacheControl: "31536000",
          upsert: false,
          contentType: trim.mime,
        });
      if (upErr) throw new Error(upErr.message);

      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(newPath, SIGNED_URL_TTL);
      if (signErr || !signed?.signedUrl) {
        await supabase.storage.from(BUCKET).remove([newPath]).catch(() => undefined);
        throw new Error(signErr?.message ?? "Could not sign URL");
      }

      const { error: dbErr } = await supabase
        .from("lesson_images")
        .upsert(
          {
            lesson_id: row.lesson_id,
            slot: row.slot,
            url: signed.signedUrl,
            storage_path: newPath,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "lesson_id,slot" },
        );
      if (dbErr) {
        await supabase.storage.from(BUCKET).remove([newPath]).catch(() => undefined);
        throw new Error(dbErr.message);
      }

      // Update caches
      const next = { ...(cache.get(row.lesson_id) ?? {}), [row.slot]: signed.signedUrl };
      cache.set(row.lesson_id, next);
      const paths = pathCache.get(row.lesson_id) ?? new Map<string, string | null>();
      paths.set(row.slot, newPath);
      pathCache.set(row.lesson_id, paths);
      emitChange(row.lesson_id);

      if (row.storage_path && row.storage_path !== newPath) {
        supabase.storage.from(BUCKET).remove([row.storage_path]).catch(() => undefined);
      }

      console.info(
        `[lesson-images] reprocess ${row.lesson_id}/${row.slot}: ${trim.before[0]}x${trim.before[1]} → ${trim.after[0]}x${trim.after[1]}`,
      );
      results.push({
        lessonId: row.lesson_id,
        slot: row.slot,
        before: trim.before,
        after: trim.after,
        trimmed: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[lesson-images] reprocess failed ${row.lesson_id}/${row.slot}`, err);
      results.push({
        lessonId: row.lesson_id,
        slot: row.slot,
        before: [0, 0],
        after: [0, 0],
        trimmed: false,
        error: message,
      });
    }
  }
  return results;
}