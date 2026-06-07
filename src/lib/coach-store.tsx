import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { lessons } from "./coach-data";

export type Profile = { name: string; email: string; signedIn: boolean };

export type CoachState = {
  completedLessons: string[];
  completedProjects: string[];
  selectedLesson: string | null;
  lessonStep: Record<string, number>;
  activeTab: string;
  quizAnswers: Record<number, number>;
  quizXp: number;
  profile: Profile;
  streak: number;
};

const DEFAULT: CoachState = {
  completedLessons: [],
  completedProjects: [],
  selectedLesson: null,
  lessonStep: {},
  activeTab: "home",
  quizAnswers: {},
  quizXp: 0,
  profile: { name: "", email: "", signedIn: false },
  streak: 1,
};

const KEY = "autocad-coach-state-v1";

type Ctx = {
  state: CoachState;
  set: (u: Partial<CoachState> | ((s: CoachState) => Partial<CoachState>)) => void;
  completeLesson: (id: string) => void;
  completeProject: (id: string) => void;
  resetProject: (id: string) => void;
  isUnlocked: (id: string) => boolean;
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

  const set: Ctx["set"] = (u) =>
    setState((s) => ({ ...s, ...(typeof u === "function" ? u(s) : u) }));

  const completeLesson = (id: string) =>
    setState((s) =>
      s.completedLessons.includes(id) ? s : { ...s, completedLessons: [...s.completedLessons, id] }
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
    ) + state.quizXp;

  const progressPct = Math.round((state.completedLessons.length / lessons.length) * 100);

  return (
    <CoachCtx.Provider
      value={{ state, set, completeLesson, completeProject, resetProject, isUnlocked, totalXp, progressPct }}
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