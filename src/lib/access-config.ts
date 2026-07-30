import { lessons, projects } from "@/lib/coach-data";

/**
 * Single source of truth for how much content a signed-out visitor may open.
 * Every catalogue card, detail route and navigation control reads from here —
 * never from hard-coded numbers or lesson/project ids.
 */
export const GUEST_ACCESS_LIMITS = {
  lessons: 3,
  projects: 2,
} as const;

export function canGuestAccessLesson(index: number): boolean {
  return index >= 0 && index < GUEST_ACCESS_LIMITS.lessons;
}

export function canGuestAccessProject(index: number): boolean {
  return index >= 0 && index < GUEST_ACCESS_LIMITS.projects;
}

/** Canonical ordering comes from the data arrays, not from ids. */
export function getLessonIndex(id: string): number {
  return lessons.findIndex((l) => l.id === id);
}

export function getProjectIndex(id: string): number {
  return projects.findIndex((p) => p.id === id);
}

/**
 * Restricted = a guest may see the page context but not the protected body.
 * Unknown ids are not "restricted" — the route renders its own not-found state.
 */
export function isLessonRestrictedForGuest(id: string, isAuthenticated: boolean): boolean {
  if (isAuthenticated) return false;
  const idx = getLessonIndex(id);
  if (idx === -1) return false;
  return !canGuestAccessLesson(idx);
}

export function isProjectRestrictedForGuest(id: string, isAuthenticated: boolean): boolean {
  if (isAuthenticated) return false;
  const idx = getProjectIndex(id);
  if (idx === -1) return false;
  return !canGuestAccessProject(idx);
}

export const POST_AUTH_KEY = "acc:postAuthRedirect";

/** Only ever allow same-origin, absolute in-app paths. */
export function getSafeInternalRedirect(value: string | null | undefined): string {
  if (!value) return "/dashboard";
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/auth")) return "/dashboard";
  return value;
}