import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import es from "./es.json";

export type AppLanguage = "en" | "es";

export const SUPPORTED_LANGUAGES: AppLanguage[] = ["en", "es"];

// Always start with English during SSR/hydration so the server and client render
// identical markup. The user's saved/browser language is applied client-side after
// hydration by CoachProvider, avoiding React hydration mismatches.
function initialLanguage(): AppLanguage {
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
      lng: initialLanguage(),
      fallbackLng: "en",
      defaultNS: "common",
      ns: ["common", "nav", "gate", "auth", "dashboard", "lessons", "projects", "chat", "profile", "trust", "lessonEditor", "screenshot", "landing", "legal", "meta"],
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