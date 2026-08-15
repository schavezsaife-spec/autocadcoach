import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { lessons } from "@/lib/coach-data";
import { lessonsEs, richLessonsEs, mergeLesson } from "@/lib/coach-data.es";
import { useIsOwner } from "@/lib/owner";
import {
  useLessonImages,
  uploadLessonImage,
  clearLessonImage,
  reprocessLessonImages,
  getLocalizedImageSlot,
  LessonImageError,
  ACCEPTED_IMAGE_ACCEPT,
  type ReprocessResult,
  type SupportedLanguage,
} from "@/lib/lesson-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/coach/Lightbox";
import { SmartImage } from "@/components/coach/SmartImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, ImageIcon, ArrowLeft, Scissors, Loader2, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { useCoach } from "@/lib/coach-store";
import { GuestGate } from "@/components/coach/GuestGate";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lesson-editor")({
  head: () => ({
    meta: [
      { title: "Lesson image editor — AutoCAD Coach" },
      { name: "description", content: "Upload and manage official screenshots for each AutoCAD Coach lesson step." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Lesson image editor — AutoCAD Coach" },
      { property: "og:url", content: "https://autocadcoach.lovable.app/lesson-editor" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/lesson-editor" }],
  }),
  validateSearch: z.object({ lesson: z.string().optional() }),
  component: LessonEditor,
});

/** Editing language is local to the editor and never changes the site language. */
type EditorLanguage = SupportedLanguage;

type Slot = { key: string; label: string };

function LessonEditor() {
  const { state, authLoading } = useCoach();
  const { t } = useTranslation(["lessonEditor", "common"]);
  const isAuthed = state.profile.isAuthenticated;
  const isOwner = useIsOwner();
  // The editor is restricted to the single owner account, not to all admins.
  const adminCheck: "pending" | "yes" | "no" = authLoading ? "pending" : isOwner ? "yes" : "no";

  const search = Route.useSearch();
  const initial =
    search.lesson && lessons.some((l) => l.id === search.lesson) ? search.lesson : lessons[0]?.id ?? "";
  const [lessonId, setLessonId] = useState<string>(initial);
  const [editorLanguage, setEditorLanguage] = useState<EditorLanguage>("en");
  const images = useLessonImages(lessonId);

  const baseLesson = lessons.find((l) => l.id === lessonId);
  const hasEsTranslation = Boolean(lessonsEs[lessonId] || richLessonsEs[lessonId]);
  // Content context follows the editing language, never the site language.
  const lesson = useMemo(() => {
    if (!baseLesson) return undefined;
    if (editorLanguage === "en") return baseLesson;
    return mergeLesson(baseLesson, lessonsEs[baseLesson.id], richLessonsEs[baseLesson.id]);
  }, [baseLesson, editorLanguage]);

  // Slot list derives from the real lesson structure, so counts never include
  // image locations that do not exist.
  const slots: Slot[] = useMemo(() => {
    if (!lesson) return [];
    const list: Slot[] = [
      { key: "before", label: t("lessonEditor:beforeSlot") },
      { key: "after", label: t("lessonEditor:afterSlot") },
    ];
    if (lesson.rich) {
      if (lesson.rich.visualReference) {
        list.push({ key: "visual", label: t("lessonEditor:visualSlot") });
      }
      lesson.rich.detailedSteps.forEach((s, i) => {
        list.push({ key: `step:${i}`, label: t("lessonEditor:stepSlotTitled", { n: i + 1, title: s.title }) });
      });
    } else {
      lesson.steps.forEach((_text, i) => {
        list.push({ key: `step:${i}`, label: t("lessonEditor:stepSlot", { n: i + 1 }) });
      });
    }
    return list;
  }, [lesson, t]);

  const counts = useMemo(() => {
    const total = slots.length;
    const en = slots.filter((s) => images[getLocalizedImageSlot(s.key, "en")]).length;
    const es = slots.filter((s) => images[getLocalizedImageSlot(s.key, "es")]).length;
    return { total, en, es, enComplete: total > 0 && en >= total, esComplete: total > 0 && es >= total };
  }, [slots, images]);

  const status =
    counts.total === 0
      ? t("lessonEditor:statusNone")
      : counts.en === 0 && counts.es === 0
        ? t("lessonEditor:statusNone")
        : counts.enComplete && counts.esComplete
          ? t("lessonEditor:statusComplete")
          : !counts.enComplete && !counts.esComplete
            ? t("lessonEditor:statusBothIncomplete")
            : counts.enComplete
              ? t("lessonEditor:statusEsIncomplete")
              : t("lessonEditor:statusEnIncomplete");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("lessonEditor:title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("lessonEditor:subtitle")}</p>
        </div>
        {lesson && (
          <Button asChild variant="outline">
            <Link to="/lessons/$id" params={{ id: lesson.id }}>
              <ArrowLeft className="size-4 mr-1" /> {t("lessonEditor:openLesson")}
            </Link>
          </Button>
        )}
      </div>

      <GuestGate isAuthenticated={isAuthed} loading={authLoading}>
        {adminCheck === "pending" && (
          <div className="rounded-2xl bg-card border border-border p-6 text-sm text-muted-foreground">
            {t("lessonEditor:checkingPermissions")}
          </div>
        )}
        {adminCheck === "no" && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-2">
            <div className="font-semibold">{t("lessonEditor:adminOnly")}</div>
            <p className="text-sm text-muted-foreground">{t("lessonEditor:adminOnlyBody")}</p>
          </div>
        )}
        {adminCheck === "yes" && (
          <>
            <ReprocessPanel />

            <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <label htmlFor="lesson-picker" className="text-sm text-muted-foreground sm:w-32 shrink-0">
                {t("lessonEditor:editingLesson")}
              </label>
              <Select value={lessonId} onValueChange={setLessonId}>
                <SelectTrigger id="lesson-picker" className="w-full sm:max-w-md">
                  <SelectValue placeholder={t("lessonEditor:pickLesson")} />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {t("common:day")} {l.day} — {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sticky language toggle + per-language completion */}
            <div className="sticky top-2 z-20 rounded-2xl bg-card/95 supports-[backdrop-filter]:bg-card/80 backdrop-blur border border-border p-4 sm:p-5 space-y-3 shadow-lg shadow-black/20">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{t("lessonEditor:editingLanguage")}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("lessonEditor:editorLangHint")}</p>
                </div>
                <div
                  role="radiogroup"
                  aria-label={t("lessonEditor:editorLangAria")}
                  className="inline-flex shrink-0 rounded-full border border-border bg-secondary/40 p-1 self-start"
                >
                  {(["en", "es"] as const).map((lng) => {
                    const active = editorLanguage === lng;
                    return (
                      <button
                        key={lng}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-pressed={active}
                        onClick={() => setEditorLanguage(lng)}
                        className={cn(
                          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          active
                            ? "bg-primary text-primary-foreground shadow"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {lng === "en" ? t("lessonEditor:english") : t("lessonEditor:spanish")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2" aria-live="polite">
                <Badge variant={counts.enComplete ? "success" : "outline"} className={counts.enComplete ? undefined : "border-border"}>
                  {t("lessonEditor:countEn", { done: counts.en, total: counts.total })}
                </Badge>
                <Badge variant={counts.esComplete ? "success" : "outline"} className={counts.esComplete ? undefined : "border-border"}>
                  {t("lessonEditor:countEs", { done: counts.es, total: counts.total })}
                </Badge>
                <span className={counts.enComplete && counts.esComplete ? "text-xs text-success" : "text-xs text-muted-foreground"}>
                  {status}
                </span>
              </div>

              {editorLanguage === "es" && !hasEsTranslation && (
                <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border px-3 py-2">
                  <span className="font-medium text-foreground">{t("lessonEditor:missingTranslationBadge")}: </span>
                  {t("lessonEditor:missingTranslation")}
                </p>
              )}
            </div>

            {lesson && (
              <>
                <div className="rounded-2xl bg-card border border-border p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("lessonEditor:contentContext")} · {editorLanguage === "en" ? t("lessonEditor:english") : t("lessonEditor:spanish")}
                  </div>
                  <div className="mt-1 font-semibold">{lesson.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slots.map((slot) => (
                    <ImageSlotCard
                      // Remount per language so no in-flight UI state leaks across languages.
                      key={`${slot.key}:${editorLanguage}`}
                      lessonId={lesson.id}
                      slot={slot}
                      language={editorLanguage}
                      ownImage={images[getLocalizedImageSlot(slot.key, editorLanguage)]}
                      englishImage={images[getLocalizedImageSlot(slot.key, "en")]}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </GuestGate>
    </div>
  );
}

function ImageSlotCard({
  lessonId,
  slot,
  language,
  ownImage,
  englishImage,
}: {
  lessonId: string;
  slot: Slot;
  language: EditorLanguage;
  ownImage?: string;
  englishImage?: string;
}) {
  const { t } = useTranslation("lessonEditor");
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isEs = language === "es";
  const languageBadge = isEs ? t("spanishImageBadge") : t("englishImageBadge");
  // Only Spanish can fall back; English never displays a Spanish image.
  const usingFallback = isEs && !ownImage && Boolean(englishImage);
  const displaySrc = ownImage ?? (usingFallback ? englishImage : undefined);
  const alt = ownImage
    ? t(isEs ? "imageAltEs" : "imageAltEn", { label: slot.label })
    : t("imageAltFallback", { label: slot.label });

  const describeError = useCallback(
    (e: unknown, fallbackKey: "uploadError" | "removeError") => {
      if (e instanceof LessonImageError) return t(`errors.${e.code}`);
      return t(fallbackKey);
    },
    [t],
  );

  async function handleFile(file: File | undefined | null) {
    if (busy) return;
    if (!file) {
      setError(t("errors.emptyFile"));
      return;
    }
    // Capture the intended language/slot up front: the toggle may change while
    // the async upload is running.
    const uploadLanguage = language;
    const uploadSlot = getLocalizedImageSlot(slot.key, uploadLanguage);
    setBusy(true);
    setError(null);
    try {
      await uploadLessonImage(lessonId, uploadSlot, file);
      toast.success(t("uploadSuccess"));
    } catch (e) {
      const msg = describeError(e, "uploadError");
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
      uploadButtonRef.current?.focus();
    }
  }

  async function handleRemove() {
    if (busy) return;
    if (typeof window !== "undefined" && !window.confirm(t("confirmRemove"))) return;
    const removeSlot = getLocalizedImageSlot(slot.key, language);
    setBusy(true);
    setError(null);
    try {
      await clearLessonImage(lessonId, removeSlot);
      toast.success(t("removeSuccess"));
    } catch (e) {
      const msg = describeError(e, "removeError");
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
      uploadButtonRef.current?.focus();
    }
  }

  const inputId = `upload-${lessonId}-${slot.key}-${language}`.replace(/[^a-z0-9-]+/gi, "-");

  return (
    <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-3" aria-busy={busy}>
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-sm min-w-0">{slot.label}</div>
        <Badge variant="outline" className={cn("shrink-0 border-border", isEs && "text-primary border-primary/40")}>
          {languageBadge}
        </Badge>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "rounded-xl border border-dashed border-border bg-secondary/30 overflow-hidden transition-colors",
          dragging && "border-primary bg-primary/10",
        )}
      >
        {busy ? (
          <div className="aspect-video grid place-items-center" role="status" aria-live="polite">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
            <span className="sr-only">{t("uploadingStatus")}</span>
          </div>
        ) : displaySrc ? (
          <button
            type="button"
            onClick={() => setPreview(displaySrc)}
            className="group relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`${t("previewImage")} — ${slot.label}`}
          >
            <SmartImage
              src={displaySrc}
              alt={alt}
              wrapperClassName="w-full min-h-24 bg-black/40"
              className="block w-full h-auto"
            />
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-1 text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="size-3" aria-hidden /> {t("previewImage")}
            </span>
            {usingFallback && (
              <span className="absolute bottom-2 left-2 rounded-full bg-background/90 border border-border px-2 py-1 text-[10px] font-medium">
                {t("usingEnglishFallback")}
              </span>
            )}
          </button>
        ) : (
          <div className="aspect-video grid place-items-center p-4 text-center">
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <ImageIcon className="size-6" aria-hidden />
              <span className="font-medium text-foreground">
                {isEs ? t("noSpanishImage") : t("noEnglishImage")}
              </span>
              <span>{isEs ? t("noSpanishImageBody") : t("noEnglishImageBody")}</span>
              <span className="mt-1">{t("recommendedSize")}</span>
              <span>
                {t("supportedTypes")} · {t("maxSize")}
              </span>
              <span className="mt-1 opacity-80">{t("dropHint")}</span>
            </div>
          </div>
        )}
      </div>

      {isEs && (
        <p className="text-xs text-muted-foreground">
          {usingFallback ? `${t("usingEnglishFallback")} — ${t("spanishFallbackHint")}` : t("spanishFallbackHint")}
        </p>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <label htmlFor={inputId} className="sr-only">
          {isEs ? t("uploadSpanishImage") : t("uploadEnglishImage")}
        </label>
        <Button
          ref={uploadButtonRef}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label={`${slot.label} — ${ownImage ? t("replaceImage") : isEs ? t("uploadSpanishImage") : t("uploadEnglishImage")}`}
        >
          {busy ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Upload className="size-4 mr-1" />}
          {busy ? t("uploading") : ownImage ? t("replaceImage") : isEs ? t("uploadSpanishImage") : t("uploadEnglishImage")}
        </Button>
        {ownImage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            aria-label={`${slot.label} — ${t("removeImage")}`}
            onClick={handleRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4 mr-1" /> {t("removeImage")}
          </Button>
        )}
      </div>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        className="sr-only"
        disabled={busy}
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {preview && <Lightbox src={preview} alt={alt} onClose={() => setPreview(null)} />}
    </div>
  );
}

const REPROCESS_LESSON_IDS = ["interface", "line", "circle", "rectangle", "trim"];

function ReprocessPanel() {
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<ReprocessResult[] | null>(null);
  const { t } = useTranslation("lessonEditor");

  async function run() {
    setBusy(true);
    setResults(null);
    try {
      const out = await reprocessLessonImages(REPROCESS_LESSON_IDS);
      setResults(out);
      const trimmedCount = out.filter((r) => r.trimmed).length;
      toast.success(t("reprocessDone", { count: out.length, trimmed: trimmedCount }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("reprocessFailed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 space-y-3" aria-busy={busy}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm flex items-center gap-2">
            <Scissors className="size-4" /> {t("reprocessTitle")}
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            {t("reprocessDesc", { ids: REPROCESS_LESSON_IDS.map((id) => `"${id}"`).join(", ") })}
          </p>
        </div>
        <Button type="button" onClick={run} disabled={busy} variant="outline" size="sm">
          {busy ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Scissors className="size-4 mr-1" />}
          {busy ? t("reprocessing") : t("runReprocess")}
        </Button>
      </div>
      {results && (
        <ul className="text-xs font-mono space-y-0.5 max-h-56 overflow-auto rounded-md bg-secondary/40 p-2" aria-live="polite">
          {results.map((r, i) => (
            <li
              key={`${r.lessonId}-${r.slot}-${i}`}
              className={r.error ? "text-destructive" : r.trimmed ? "text-success" : "text-muted-foreground"}
            >
              {r.lessonId}/{r.slot}: {r.before[0]}×{r.before[1]} → {r.after[0]}×{r.after[1]}
              {r.trimmed ? ` ✓ ${t("trimmedLabel")}` : r.error ? ` ✕ ${r.error}` : ` – ${t("skippedLabel")}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
