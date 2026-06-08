import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    }
  }, [state, hydrated]);

  // Sync auth state from Supabase as the source of truth for
  // isAuthenticated / email / firstName / lastName / authProvider.
  // XP, completed lessons, and the profile image stay in localStorage.
  useEffect(() => {
    function applyUser(user: User | null) {
      setState((s) => {
        if (!user) {
          // Fully clear all personal state when no Supabase session exists.
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
          };
        }
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
        const provider =
          (user.app_metadata?.provider as Profile["authProvider"]) ?? "email";
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

  const set: Ctx["set"] = (u) =>
    setState((s) => ({ ...s, ...(typeof u === "function" ? u(s) : u) }));

  const completeLesson = (id: string) =>
    setState((s) =>
      s.completedLessons.includes(id) ? s : { ...s, completedLessons: [...s.completedLessons, id] }
    );

  const passLessonQuiz = (id: string) =>
    setState((s) =>
      s.lessonQuizPassed[id] ? s : { ...s, lessonQuizPassed: { ...s.lessonQuizPassed, [id]: true } }
    );

  const completeProject = (id: string) =>
    setState((s) =>
      s.completedProjects.includes(id) ? s : { ...s, completedProjects: [...s.completedProjects, id] }
    );

  const resetProject = (id: string) =>
    setState((s) => ({ ...s, completedProjects: s.completedProjects.filter((p) => p !== id) }));

  const isUnlocked = (id: string) => {
    const idx = lessons.findIndex((l) => l.id === id);
    if (idx <= 0) return true;
    return state.completedLessons.includes(lessons[idx - 1].id);
  };

  const totalXp =
    state.completedLessons.reduce(
      (sum, id) => sum + (lessons.find((l) => l.id === id)?.xp ?? 0),
      0
    );

  const progressPct = Math.round((state.completedLessons.length / lessons.length) * 100);

  async function signOut() {
    // Sign out from Supabase first so the onAuthStateChange listener also fires.
    try { await supabase.auth.signOut(); } catch {}
    // Wipe everything locally — no traces of the previous user.
    try { localStorage.removeItem(KEY); } catch {}
    try { sessionStorage.clear(); } catch {}
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