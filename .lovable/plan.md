## Scope

Full English/Spanish translation system across ~6,000 lines of UI + ~2,200 lines of lesson/project content. This is a large, multi-file change — I'll do it in one pass but want to confirm a few decisions before starting so I don't have to redo structural choices halfway through.

## Approach

### 1. Infrastructure
- Add `i18next` + `react-i18next` (idiomatic, works fine with TanStack Start; no SSR-specific config needed since we hydrate from `localStorage` on the client).
- `src/lib/i18n/index.ts` — init i18next with namespaces: `common, nav, auth, dashboard, lessons, projects, chat, profile, trust, lessonEditor, meta`.
- `src/lib/i18n/en.json` + `es.json` — one file per language, all namespaces inside.
- Initialize before `<RouterProvider>` in `src/router.tsx` / root shell.

### 2. Persistence & `<html lang>`
- Store language in `CoachState` (single source of truth, already persisted under `autocad-coach-state-v1`). Mirror to i18next on load and on toggle.
- Load order on boot: saved preference → `navigator.language` starts-with `es` → `en`.
- Update `<html lang>` in `__root.tsx` RootShell via a small effect that reads i18next's active language.

### 3. Sidebar + mobile toggle
- Add a `LanguageToggle` component (icon `Languages` from lucide-react + "EN"/"ES" label).
- Desktop: in `SidebarInner`, next to the collapse button, matching the collapsed/expanded pattern.
- Mobile: extra slot in the bottom nav bar, next to `MobileAuthBadge`.
- Click cycles EN ↔ ES, updates coach-store + i18next instantly, no reload.

### 4. Static UI strings
Replace hardcoded strings with `t("ns:key")` across:
`AppShell`, `GuestGate`, `index`, `auth`, `forgot-password`, `reset-password`, `dashboard`, `lessons(.$id)`, `projects(.$id)`, `chat`, `profile`, `trust`, `lesson-editor`, and every route's `head()` (title / description / og). `head()` reads i18next synchronously via `i18n.t(...)` (not the hook).

### 5. Lesson/project content
- Restructure: introduce a parallel `src/lib/coach-data.es.ts` keyed by the same `id`s, exporting `lessonsEs` / `projectsEs` with the same shape (only translatable fields: `title`, `description`, `steps`, `detailedSteps.*.text/title`, project `steps`, `skills` stays English as they're command names).
- Add helper `useLocalizedLesson(id)` / `useLocalizedProject(id)` in `src/lib/coach-data.ts` (or a new `src/lib/i18n/content.ts`) that merges English base with Spanish overrides field-by-field, so any missing ES field falls back cleanly.
- Translate lessons 1–3 + projects 1–2 as proof of concept; mark others with `// TODO: translate` comments; English fallback keeps them fully functional.
- Update every consumer (`lessons.tsx`, `lessons.$id.tsx`, `projects.tsx`, `projects.$id.tsx`, `dashboard.tsx`, `lesson-editor.tsx`) to read via the localized helper.

### 6. Verify
Manual click-through via Playwright: toggle to ES, walk Dashboard → Lessons → Lesson 1 → Projects → Project → Chat → Profile, screenshot each, confirm no stray English in chrome/nav. Reload page and confirm ES persists. Confirm `<html lang="es">`.

### 7. AI chat language (flagged, not silently changed)
The system prompt in `src/routes/api.chat.ts` is English-only. I'll pass the user's active language from the client and update the system prompt to `Respond in {language}` — this is a small change and matches the request. I'll call it out in the final summary.

## Decisions I'm making without asking

- **Library:** `react-i18next` (matches "or equivalent lightweight").
- **Persistence source of truth:** `CoachState` (avoids second localStorage key).
- **Content structure:** parallel `coach-data.es.ts` file (keeps the huge `coach-data.ts` readable).
- **Translation depth:** lessons 1–3 + projects 1–2 fully translated; rest fall back to English with TODO markers, per your explicit instruction not to block on all 17.
- **AI system prompt:** switch to user's language (per §6 you asked me to flag it — I'll flag it AND do it, since it's a two-line change and otherwise the ES experience feels broken).

## Files touched (approx)

- New: `src/lib/i18n/index.ts`, `en.json`, `es.json`, `src/lib/coach-data.es.ts`, `src/components/coach/LanguageToggle.tsx`
- Edited: `package.json` (deps), `src/router.tsx`, `src/lib/coach-store.tsx`, `src/routes/__root.tsx`, `src/components/coach/AppShell.tsx`, `GuestGate.tsx`, and all 14 route files listed above, plus `src/routes/api.chat.ts`.

## What I need from you

Confirm and I'll ship it in one pass. If you want a different split (e.g. inline `{en,es}` objects instead of a parallel file, or NO change to the AI system prompt), tell me now.
