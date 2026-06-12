import { useEffect, useState } from "react";

/**
 * Local-only storage for annotated screenshot uploads. Each lesson keeps a
 * map of slot → data URL. The editor writes here, the lesson viewer reads.
 *
 * Slot keys:
 *   - `step:<index>`      annotated screenshot for a specific step
 *   - `visual`            main visual reference image
 *   - `beforeYouStart`    annotated "before you start" screenshot
 *   - `before` / `after`  the before vs after comparison
 */
const KEY = "autocad-coach-lesson-images-v1";

export type LessonImageMap = Record<string, string>;
export type AllLessonImages = Record<string, LessonImageMap>;

function read(): AllLessonImages {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AllLessonImages) : {};
  } catch {
    return {};
  }
}

function write(data: AllLessonImages) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("lesson-images-changed"));
  } catch {
    // ignore quota errors — the editor surfaces them via toast
  }
}

export function getLessonImages(lessonId: string): LessonImageMap {
  return read()[lessonId] ?? {};
}

export function setLessonImage(lessonId: string, slot: string, dataUrl: string) {
  const all = read();
  all[lessonId] = { ...(all[lessonId] ?? {}), [slot]: dataUrl };
  write(all);
}

export function clearLessonImage(lessonId: string, slot: string) {
  const all = read();
  if (!all[lessonId]) return;
  const { [slot]: _removed, ...rest } = all[lessonId];
  all[lessonId] = rest;
  write(all);
}

export function useLessonImages(lessonId: string): LessonImageMap {
  const [map, setMap] = useState<LessonImageMap>(() =>
    typeof window === "undefined" ? {} : getLessonImages(lessonId),
  );
  useEffect(() => {
    const refresh = () => setMap(getLessonImages(lessonId));
    refresh();
    window.addEventListener("lesson-images-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("lesson-images-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [lessonId]);
  return map;
}

const MAX_BYTES = 3 * 1024 * 1024; // 3MB per image

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file (PNG or JPG)."));
      return;
    }
    if (file.size > MAX_BYTES) {
      reject(new Error("Image must be under 3MB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}