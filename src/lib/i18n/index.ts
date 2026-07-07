import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import es from "./es.json";

export type AppLanguage = "en" | "es";

export const SUPPORTED_LANGUAGES: AppLanguage[] = ["en", "es"];

function detectInitialLanguage(): AppLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const raw = localStorage.getItem("autocad-coach-state-v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.language === "es" || parsed?.language === "en") return parsed.language;
    }
  } catch {}
  const nav = navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("es")) return "es";
  return "en";
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: flatten(en),
        es: flatten(es),
      },
      lng: detectInitialLanguage(),
      fallbackLng: "en",
      defaultNS: "common",
      ns: ["common", "nav", "gate", "auth", "dashboard", "lessons", "projects", "chat", "profile", "trust", "lessonEditor", "meta"],
      interpolation: { escapeValue: false },
      returnObjects: true,
      returnNull: false,
    });
}

// Each top-level key in the JSON becomes an i18next namespace.
function flatten(bundle: Record<string, unknown>): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [ns, value] of Object.entries(bundle)) {
    out[ns] = value as Record<string, unknown>;
  }
  return out;
}

export function setAppLanguage(lang: AppLanguage) {
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
}

export default i18n;