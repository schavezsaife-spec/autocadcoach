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
const MAX_BYTES = 25 * 1024 * 1024; // 25MB — preserves original resolution

export type LessonImageMap = Record<string, string>;

type Row = { lesson_id: string; slot: string; url: string; storage_path: string | null };

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

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${lessonId}/${safeSlotPath(slot)}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
  if (upErr) throw new Error(upErr.message);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = pub.publicUrl;

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