import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { lessons } from "./coach-data";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  authProvider: "email" | "google" | null;
  isAuthenticated: boolean;
};

export type CoachState = {
  completedLessons: string[];
  completedProjects: string[];
  selectedLesson: string | null;
  lessonStep: Record<string, number>;
  activeTab: string;
  lessonQuizPassed: Record<string, boolean>;
  profile: Profile;
  streak: number;
};

const DEFAULT: CoachState = {
  completedLessons: [],
  completedProjects: [],
  selectedLesson: null,
  lessonStep: {},
  activeTab: "home",
  lessonQuizPassed: {},
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null,
    authProvider: null,
    isAuthenticated: false,
  },
  streak: 1,
};

const KEY = "autocad-coach-state-v1";

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

function computeStreak(previousStreak: number, lastActive: string | null, today: string): number {
  if (!lastActive) return 1;
  const delta = daysBetween(lastActive, today);
  if (delta === 0) return Math.max(previousStreak, 1);
  if (delta === 1) return previousStreak + 1;
  return 1; // missed a day
}

type Ctx = {
  state: CoachState;
  set: (u: Partial<CoachState> | ((s: CoachState) => Partial<CoachState>)) => void;
  completeLesson: (id: string) => void;
  passLessonQuiz: (id: string) => void;
  completeProject: (id: string) => void;
  resetProject: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  hydrated: boolean;
  signOut: () => Promise<void>;
  totalXp: number;
  progressPct: number;
};

const CoachCtx = createContext<Ctx | null>(null);

export function CoachProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CoachState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);

  // Hydrate from localStorage synchronously on mount.
  // setHydrated(true) fires immediately — no waiting for Supabase.
  // This means pages render from the localStorage snapshot instantly,
  // and auth state updates asynchronously without a skeleton flash.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever state changes (after hydration).
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state, hydrated]);

  // Sync auth state from Supabase as the source of truth for
  // isAuthenticated / email / firstName / lastName / authProvider.
  // XP, completed lessons, and profile image stay in localStorage.
  useEffect(() => {
    function applyUser(user: User | null) {
      setState((s) => {
        if (!user) {
          setRemoteUserId(null);
          if (
            !s.profile.isAuthenticated &&
            !s.profile.profileImage &&
            !s.profile.firstName &&
            !s.profile.lastName &&
            !s.profile.email
          ) {
            return s;
          }
          return {
            ...s,
            profile: { ...DEFAULT.profile },
            completedLessons: [],
            completedProjects: [],
            lessonStep: {},
            lessonQuizPassed: {},
            streak: 1,
          };
        }
        setRemoteUserId(user.id);
        const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
        const firstName =
          (meta.first_name as string) ||
          (meta.given_name as string) ||
          ((meta.full_name as string)?.split(" ")[0] ?? "") ||
          ((meta.name as string)?.split(" ")[0] ?? "") ||
          s.profile.firstName ||
          (user.email?.split("@")[0] ?? "");
        const lastName =
          (meta.last_name as string) ||
          (meta.family_name as string) ||
          ((meta.full_name as string)?.split(" ").slice(1).join(" ") ?? "") ||
          ((meta.name as string)?.split(" ").slice(1).join(" ") ?? "") ||
          s.profile.lastName ||
          "";
        const provider = (user.app_metadata?.provider as Profile["authProvider"]) ?? "email";
        return {
          ...s,
          profile: {
            ...s.profile,
            firstName,
            lastName,
            email: user.email ?? "",
            authProvider: provider === "google" ? "google" : "email",
            isAuthenticated: true,
          },
        };
      });
    }

    supabase.auth.getSession().then(({ data }) => applyUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Sync local progress → Supabase whenever the user signs in.
  // Remote wins on scalar fields; arrays union so nothing is lost.
  useEffect(() => {
    if (!remoteUserId || !hydrated) return;
    let cancelled = false;
    (async () => {
      const today = todayIso();
      const { data: existing, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", remoteUserId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[coach-store] failed to load progress", error);
        return;
      }

      if (!existing) {
        // First-time sync — seed remote with local progress.
        const streak = computeStreak(state.streak, null, today);
        const payload = {
          user_id: remoteUserId,
          completed_lessons: state.completedLessons,
          completed_projects: state.completedProjects,
          lesson_quiz_passed: state.lessonQuizPassed,
          last_active_date: today,
          streak,
        };
        const { error: insErr } = await supabase.from("user_progress").insert(payload);
        if (insErr) console.error("[coach-store] insert progress failed", insErr);
        if (!cancelled) setState((s) => ({ ...s, streak }));
        return;
      }

      // Merge: arrays union, quiz object merges, streak recomputed from last_active_date.
      const remoteLessons = (existing.completed_lessons as string[]) ?? [];
      const remoteProjects = (existing.completed_projects as string[]) ?? [];
      const remoteQuiz = (existing.lesson_quiz_passed as Record<string, boolean>) ?? {};
      const mergedLessons = Array.from(new Set([...remoteLessons, ...state.completedLessons]));
      const mergedProjects = Array.from(new Set([...remoteProjects, ...state.completedProjects]));
      const mergedQuiz = { ...state.lessonQuizPassed, ...remoteQuiz };
      const newStreak = computeStreak(existing.streak ?? 1, existing.last_active_date, today);

      if (!cancelled) {
        setState((s) => ({
          ...s,
          completedLessons: mergedLessons,
          completedProjects: mergedProjects,
          lessonQuizPassed: mergedQuiz,
          streak: newStreak,
        }));
      }

      const { error: upErr } = await supabase
        .from("user_progress")
        .update({
          completed_lessons: mergedLessons,
          completed_projects: mergedProjects,
          lesson_quiz_passed: mergedQuiz,
          last_active_date: today,
          streak: newStreak,
        })
        .eq("user_id", remoteUserId);
      if (upErr) console.error("[coach-store] update progress failed", upErr);
    })();
    return () => {
      cancelled = true;
    };
  }, [remoteUserId, hydrated]);

  // Push progress changes back to remote (fire-and-forget).
  useEffect(() => {
    if (!remoteUserId || !hydrated) return;
    const handle = setTimeout(() => {
      supabase
        .from("user_progress")
        .update({
          completed_lessons: state.completedLessons,
          completed_projects: state.completedProjects,
          lesson_quiz_passed: state.lessonQuizPassed,
          last_active_date: todayIso(),
          streak: state.streak,
        })
        .eq("user_id", remoteUserId)
        .then(({ error }) => {
          if (error) console.error("[coach-store] progress sync failed", error);
        });
    }, 400);
    return () => clearTimeout(handle);
  }, [
    remoteUserId,
    hydrated,
    state.completedLessons,
    state.completedProjects,
    state.lessonQuizPassed,
    state.streak,
  ]);

  const set: Ctx["set"] = (u) => setState((s) => ({ ...s, ...(typeof u === "function" ? u(s) : u) }));

  const completeLesson = (id: string) =>
    setState((s) => (s.completedLessons.includes(id) ? s : { ...s, completedLessons: [...s.completedLessons, id] }));

  const passLessonQuiz = (id: string) =>
    setState((s) => (s.lessonQuizPassed[id] ? s : { ...s, lessonQuizPassed: { ...s.lessonQuizPassed, [id]: true } }));

  const completeProject = (id: string) =>
    setState((s) => (s.completedProjects.includes(id) ? s : { ...s, completedProjects: [...s.completedProjects, id] }));

  const resetProject = (id: string) =>
    setState((s) => ({ ...s, completedProjects: s.completedProjects.filter((p) => p !== id) }));

  // Memoized — only recomputes when completedLessons changes, not on every render
  const isUnlocked = useMemo(
    () => (id: string) => {
      const idx = lessons.findIndex((l) => l.id === id);
      if (idx <= 0) return true;
      return state.completedLessons.includes(lessons[idx - 1].id);
    },
    [state.completedLessons],
  );

  // Memoized — expensive reduce over lesson array
  const totalXp = useMemo(
    () => state.completedLessons.reduce((sum, id) => sum + (lessons.find((l) => l.id === id)?.xp ?? 0), 0),
    [state.completedLessons],
  );

  // Memoized — simple but avoids recalc on unrelated state changes
  const progressPct = useMemo(
    () => Math.round((state.completedLessons.length / lessons.length) * 100),
    [state.completedLessons.length],
  );

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      localStorage.removeItem(KEY);
    } catch {}
    try {
      sessionStorage.clear();
    } catch {}
    setState({ ...DEFAULT });
  }

  return (
    <CoachCtx.Provider
      value={{
        state,
        set,
        completeLesson,
        passLessonQuiz,
        completeProject,
        resetProject,
        isUnlocked,
        hydrated,
        signOut,
        totalXp,
        progressPct,
      }}
    >
      {children}
    </CoachCtx.Provider>
  );
}

export function useCoach() {
  const ctx = useContext(CoachCtx);
  if (!ctx) throw new Error("useCoach must be used within CoachProvider");
  return ctx;
}
