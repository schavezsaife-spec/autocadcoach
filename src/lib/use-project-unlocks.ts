import { useMemo } from "react";
import { useCoach } from "@/lib/coach-store";
import {
  getProjectUnlockState,
  getNextLockedProject,
  type ProjectUnlockState,
  type UnlockProgress,
} from "@/lib/project-unlocks";

/**
 * Single entry point for unlock state everywhere in the UI, built on the
 * existing XP + progress system (no second XP counter).
 */
export function useProjectUnlocks() {
  const { state, totalXp } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  const progress: UnlockProgress = useMemo(
    () => ({
      xp: isAuthed ? totalXp : 0,
      completedLessons: isAuthed ? state.completedLessons : [],
      completedProjects: isAuthed ? state.completedProjects : [],
    }),
    [isAuthed, totalXp, state.completedLessons, state.completedProjects],
  );

  return useMemo(
    () => ({
      progress,
      isAuthed,
      unlockStateFor: (projectId: string): ProjectUnlockState => getProjectUnlockState(projectId, progress),
      nextLockedProject: () => getNextLockedProject(progress),
    }),
    [progress, isAuthed],
  );
}
