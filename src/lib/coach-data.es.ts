// Spanish translations for lesson & project content, keyed by the same id
// as the English source in coach-data.ts. Any missing field falls back to
// English via the merge helper (getLocalizedLesson / getLocalizedProject).
// TODO: complete translations for remaining lessons/projects.

import type { Lesson, Project } from "./coach-data";

export type LessonEs = Partial<Pick<Lesson, "title" | "description" | "objective" | "steps" | "mistake" | "challenge" | "tag">>;
export type ProjectEs = Partial<Pick<Project, "title" | "description" | "steps"> & { difficulty?: Project["difficulty"] }>;

export const lessonsEs: Record<string, LessonEs> = {
  interface: {
    title: "Interfaz + Navegación",
    tag: "Básicos",
    description: "Familiarízate con el espacio de trabajo de AutoCAD.",
    objective: "Aprende la cinta, la línea de comandos y a hacer pan/zoom con confianza.",
    steps: [
      "Abre AutoCAD y crea un dibujo nuevo con la plantilla acad.dwt.",
      "Identifica la cinta, la línea de comandos, la barra de estado y el área de dibujo.",
      "Usa la rueda del ratón para ZOOM y arrástrala para PAN.",
      "Escribe Z, luego E y pulsa Enter para ZOOM EXTENTS.",
    ],
    mistake: "Hacer clic en iconos al azar de la cinta. Concéntrate en la línea de comandos — es tu mapa.",
    challenge: "Haz pan y zoom a las cuatro esquinas de un dibujo vacío en menos de 30 segundos.",
  },
  line: {
    title: "LINE (Línea)",
    tag: "Dibujo",
    description: "Dibuja tu primer segmento recto con coordenadas escritas.",
    objective: "Usa el comando LINE con una coordenada relativa escrita.",
    steps: [
      "Escribe LINE, pulsa Enter. Haz clic en un punto inicial.",
      "Escribe @100,0 y pulsa Enter para dibujar una línea horizontal de 100 unidades.",
      "Pulsa Enter otra vez para terminar el comando LINE.",
      "Guarda el archivo como Leccion02-LINE.dwg.",
    ],
    mistake: "Olvidar la @ antes de las coordenadas relativas.",
    challenge: "Dibuja un rectángulo de 200×100 usando solo LINE y la opción C (cerrar).",
  },
  circle: {
    title: "CIRCLE (Círculo)",
    tag: "Dibujo",
    description: "Dibuja un círculo preciso por centro y radio.",
    objective: "Usa el comando CIRCLE con un radio escrito.",
    steps: [
      "Escribe CIRCLE (o C) y pulsa Enter.",
      "Haz clic en un punto central del área de dibujo.",
      "Escribe 50 y pulsa Enter para el radio.",
      "Ejecuta LIST y haz clic en el círculo para verificar radio = 50.",
    ],
    mistake: "Estimar el radio con un clic en vez de escribir un número.",
    challenge: "Dibuja tres círculos concéntricos de radio 10, 30 y 50.",
  },
};

export const projectsEs: Record<string, ProjectEs> = {
  keychain: {
    title: "Llavero inicial",
    difficulty: "Beginner",
    description: "Construye tu primera forma 2D — un contorno simple de llavero.",
    steps: [
      "Dibuja un rectángulo de 60x25 con REC.",
      "Haz FILLET en todas las esquinas con radio 8.",
      "Añade un círculo de radio 4 cerca de un borde para el agujero de la anilla.",
      "Guarda como Llavero.dwg.",
    ],
  },
  wheel: {
    title: "Boceto de rueda",
    difficulty: "Easy",
    description: "Boceta una rueda usando círculos y ARRAY.",
    steps: [
      "Dibuja un círculo central de radio 50.",
      "Aplica OFFSET de 10 hacia afuera para la llanta.",
      "Haz un ARRAY polar de 6 círculos pequeños para los pernos.",
    ],
  },
};

// Merge English base with Spanish overrides, field by field.
export function mergeLesson(base: Lesson, es: LessonEs | undefined): Lesson {
  if (!es) return base;
  return {
    ...base,
    title: es.title ?? base.title,
    tag: es.tag ?? base.tag,
    description: es.description ?? base.description,
    objective: es.objective ?? base.objective,
    steps: es.steps ?? base.steps,
    mistake: es.mistake ?? base.mistake,
    challenge: es.challenge ?? base.challenge,
  };
}

export function mergeProject(base: Project, es: ProjectEs | undefined): Project {
  if (!es) return base;
  return {
    ...base,
    title: es.title ?? base.title,
    description: es.description ?? base.description,
    steps: es.steps ?? base.steps,
    difficulty: es.difficulty ?? base.difficulty,
  };
}