import { lessons, projects } from "@/lib/coach-data";

/**
 * Centralized project unlock + reward configuration.
 *
 * `alwaysAvailable` projects are permanent exceptions: signed-in users can
 * always open them (no XP, no prerequisite lessons), and guests get them as
 * free previews. Every other project needs BOTH the XP threshold and all of
 * its prerequisite lessons.
 *
 * The shape is intentionally flexible so a future capstone can require
 * lessons, other projects and an XP level at once.
 */
export type ProjectUnlockRule = {
  /** Always open for signed-in users; also a guest preview. */
  alwaysAvailable?: boolean;
  preview?: boolean;
  requiredXP?: number;
  requiredLessons?: string[];
  /** Future capstone support: required completed projects. */
  requiredProjects?: string[];
  /** Future capstone support: require every lesson to be complete. */
  requiresAllLessons?: boolean;
  /** XP granted once, the first time the project is completed. */
  rewardXP: number;
};

export const PROJECT_UNLOCKS: Record<string, ProjectUnlockRule> = {
  keychain: { alwaysAvailable: true, preview: true, rewardXP: 100 },
  wheel: { alwaysAvailable: true, preview: true, rewardXP: 125 },
  "phone-stand": {
    requiredXP: 350,
    requiredLessons: ["rectangle", "trim", "move-copy"],
    rewardXP: 150,
  },
  "car-outline": {
    requiredXP: 550,
    requiredLessons: ["osnap", "layers"],
    rewardXP: 175,
  },
  room: {
    requiredXP: 750,
    requiredLessons: ["dim-text", "hatch"],
    rewardXP: 200,
  },
  bracket: {
    requiredXP: 950,
    requiredLessons: ["extrude", "offset-mirror", "fillet-chamfer"],
    rewardXP: 250,
  },
};

const FALLBACK_RULE: ProjectUnlockRule = { alwaysAvailable: true, preview: true, rewardXP: 100 };

export function getProjectRule(projectId: string): ProjectUnlockRule {
  return PROJECT_UNLOCKS[projectId] ?? FALLBACK_RULE;
}

export function isAlwaysAvailableProject(projectId: string): boolean {
  return getProjectRule(projectId).alwaysAvailable === true;
}

export function getProjectRewardXp(projectId: string): number {
  return getProjectRule(projectId).rewardXP;
}

/** XP earned by completing projects — part of the single XP total. */
export function projectRewardXp(completedProjects: string[]): number {
  return completedProjects.reduce((sum, id) => sum + getProjectRewardXp(id), 0);
}

export type UnlockProgress = {
  /** Total XP from the single, shared XP system. */
  xp: number;
  completedLessons: string[];
  completedProjects: string[];
};

export type ProjectUnlockState = {
  projectId: string;
  alwaysAvailable: boolean;
  unlocked: boolean;
  requiredXP: number;
  /** XP still needed (0 when satisfied). */
  xpRemaining: number;
  xpSatisfied: boolean;
  requiredLessons: string[];
  missingLessons: string[];
  lessonsSatisfied: boolean;
  rewardXP: number;
};

export function getProjectUnlockState(projectId: string, progress: UnlockProgress): ProjectUnlockState {
  const rule = getProjectRule(projectId);
  const requiredXP = rule.requiredXP ?? 0;
  const requiredLessons = rule.requiredLessons ?? [];
  const requiredProjects = rule.requiredProjects ?? [];

  if (rule.alwaysAvailable) {
    return {
      projectId,
      alwaysAvailable: true,
      unlocked: true,
      requiredXP: 0,
      xpRemaining: 0,
      xpSatisfied: true,
      requiredLessons: [],
      missingLessons: [],
      lessonsSatisfied: true,
      rewardXP: rule.rewardXP,
    };
  }

  const allLessonIds = rule.requiresAllLessons ? lessons.map((l) => l.id) : [];
  const lessonSet = Array.from(new Set([...requiredLessons, ...allLessonIds]));
  const missingLessons = lessonSet.filter((id) => !progress.completedLessons.includes(id));
  const missingProjects = requiredProjects.filter((id) => !progress.completedProjects.includes(id));
  const xpSatisfied = progress.xp >= requiredXP;
  const lessonsSatisfied = missingLessons.length === 0 && missingProjects.length === 0;

  return {
    projectId,
    alwaysAvailable: false,
    unlocked: xpSatisfied && lessonsSatisfied,
    requiredXP,
    xpRemaining: Math.max(0, requiredXP - progress.xp),
    xpSatisfied,
    requiredLessons: lessonSet,
    missingLessons,
    lessonsSatisfied,
    rewardXP: rule.rewardXP,
  };
}

/** One reusable predicate for every surface. */
export function isProjectUnlocked(projectId: string, progress: UnlockProgress): boolean {
  return getProjectUnlockState(projectId, progress).unlocked;
}

/**
 * The locked project the user is closest to unlocking (lowest XP requirement
 * first). Always-available projects are never suggested.
 */
export function getNextLockedProject(progress: UnlockProgress): ProjectUnlockState | null {
  const locked = projects
    .map((p) => getProjectUnlockState(p.id, progress))
    .filter((s) => !s.alwaysAvailable && !s.unlocked)
    .sort((a, b) => a.requiredXP - b.requiredXP);
  return locked[0] ?? null;
}
