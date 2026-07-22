// Hooks that return lesson/project/quiz/troubleshooting content in the
// user's active language, falling back field-by-field to English when a
// Spanish translation is missing.

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  lessons as lessonsEn,
  projects as projectsEn,
  lessonQuizzes as lessonQuizzesEn,
  troubleshooting as troubleshootingEn,
  type Lesson,
  type Project,
  type LessonQuizQ,
  type TroubleshootItem,
} from "@/lib/coach-data";
import {
  lessonsEs,
  projectsEs,
  richLessonsEs,
  lessonQuizzesEs,
  troubleshootingEs,
  mergeLesson,
  mergeProject,
  mergeQuiz,
} from "@/lib/coach-data.es";
import { useLessonImages, pickLocalizedImages, type LessonImageMap } from "@/lib/lesson-images";

function activeLang(lng: string | undefined): "en" | "es" {
  return (lng ?? "en").startsWith("es") ? "es" : "en";
}

export function useActiveLanguage(): "en" | "es" {
  const { i18n } = useTranslation();
  return activeLang(i18n.language);
}

export function useLocalizedLessons(): Lesson[] {
  const lang = useActiveLanguage();
  return useMemo(() => {
    if (lang === "en") return lessonsEn;
    return lessonsEn.map((l) => mergeLesson(l, lessonsEs[l.id], richLessonsEs[l.id]));
  }, [lang]);
}

export function useLocalizedLesson(id: string): Lesson | undefined {
  const list = useLocalizedLessons();
  return list.find((l) => l.id === id);
}

export function useLocalizedProjects(): Project[] {
  const lang = useActiveLanguage();
  return useMemo(() => {
    if (lang === "en") return projectsEn;
    return projectsEn.map((p) => mergeProject(p, projectsEs[p.id]));
  }, [lang]);
}

export function useLocalizedProject(id: string): Project | undefined {
  const list = useLocalizedProjects();
  return list.find((p) => p.id === id);
}

export function useLocalizedLessonQuiz(id: string): LessonQuizQ[] {
  const lang = useActiveLanguage();
  return useMemo(() => {
    const base = lessonQuizzesEn[id] ?? [];
    if (lang === "en") return base;
    return mergeQuiz(base, lessonQuizzesEs[id]);
  }, [lang, id]);
}

export function useLocalizedTroubleshooting(): TroubleshootItem[] {
  const lang = useActiveLanguage();
  return useMemo(() => {
    if (lang === "en") return troubleshootingEn;
    return troubleshootingEn.map((t, i) => {
      const es = troubleshootingEs[i];
      if (!es) return t;
      return {
        title: es.title ?? t.title,
        cause: es.cause ?? t.cause,
        fix: es.fix ?? t.fix,
      };
    });
  }, [lang]);
}

/**
 * Language-aware view of the uploaded lesson image map. Base slot keys
 * (`step:0`, `visual`, `before`, …) resolve to the Spanish upload when the
 * active language is Spanish AND a Spanish image exists; otherwise they
 * transparently fall back to the English image.
 */
export function useLocalizedLessonImages(lessonId: string): LessonImageMap {
  const lang = useActiveLanguage();
  const raw = useLessonImages(lessonId);
  return useMemo(() => pickLocalizedImages(raw, lang), [raw, lang]);
}
