// Hooks that return lesson/project content in the user's active language,
// falling back field-by-field to English when a Spanish translation is missing.

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { lessons as lessonsEn, projects as projectsEn, type Lesson, type Project } from "@/lib/coach-data";
import { lessonsEs, projectsEs, mergeLesson, mergeProject } from "@/lib/coach-data.es";

function activeLang(lng: string | undefined): "en" | "es" {
  return (lng ?? "en").startsWith("es") ? "es" : "en";
}

export function useLocalizedLessons(): Lesson[] {
  const { i18n } = useTranslation();
  const lang = activeLang(i18n.language);
  return useMemo(() => {
    if (lang === "en") return lessonsEn;
    return lessonsEn.map((l) => mergeLesson(l, lessonsEs[l.id]));
  }, [lang]);
}

export function useLocalizedLesson(id: string): Lesson | undefined {
  const list = useLocalizedLessons();
  return list.find((l) => l.id === id);
}

export function useLocalizedProjects(): Project[] {
  const { i18n } = useTranslation();
  const lang = activeLang(i18n.language);
  return useMemo(() => {
    if (lang === "en") return projectsEn;
    return projectsEn.map((p) => mergeProject(p, projectsEs[p.id]));
  }, [lang]);
}

export function useLocalizedProject(id: string): Project | undefined {
  const list = useLocalizedProjects();
  return list.find((p) => p.id === id);
}