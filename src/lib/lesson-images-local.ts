import { useEffect, useState } from "react";

/**
 * Local-only lesson screenshot store. Images are persisted to localStorage
 * as base64 data URLs under `lesson_img:<lessonId>:<slot>`. No network,
 * no auth, no RLS — this is a temporary build-time editing tool.
 */
const PREFIX = "lesson_img:";
const MAX_BYTES = 25 * 1024 * 1024;
const EVENT = "lesson-images-changed";

export type LessonImageMap = Record<string, string>;

function keyFor(lessonId: string, slot: string) {
  return `${PREFIX}${lessonId}:${slot}`;
}

function emitChange(lessonId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { lessonId } }));
}

export function getLessonImages(lessonId: string): LessonImageMap {
  if (typeof window === "undefined") return {};
  const prefix = `${PREFIX}${lessonId}:`;
  const map: LessonImageMap = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      const slot = k.slice(prefix.length);
      const val = localStorage.getItem(k);
      if (val) map[slot] = val;
    }
  } catch {
    /* ignore */
  }
  return map;
}

export function useLessonImages(lessonId: string): LessonImageMap {
  const [map, setMap] = useState<LessonImageMap>(() => getLessonImages(lessonId));
  useEffect(() => {
    setMap(getLessonImages(lessonId));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lessonId?: string } | undefined;
      if (!detail || detail.lessonId === lessonId) {
        setMap(getLessonImages(lessonId));
      }
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, [lessonId]);
  return map;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Unexpected file reader result."));
    };
    reader.readAsDataURL(file);
  });
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
  const dataUrl = await readAsDataUrl(file);
  try {
    localStorage.setItem(keyFor(lessonId, slot), dataUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/quota|exceeded/i.test(msg)) {
      throw new Error(
        "Browser storage is full — remove a previously uploaded image or use a smaller file.",
      );
    }
    throw new Error(msg || "Could not save image to browser storage.");
  }
  emitChange(lessonId);
  return dataUrl;
}

export async function clearLessonImage(lessonId: string, slot: string): Promise<void> {
  try {
    localStorage.removeItem(keyFor(lessonId, slot));
  } catch {
    /* ignore */
  }
  emitChange(lessonId);
}