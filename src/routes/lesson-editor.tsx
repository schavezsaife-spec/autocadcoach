import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { lessons } from "@/lib/coach-data";
import { supabase } from "@/integrations/supabase/client";
import {
  useLessonImages,
  uploadLessonImage,
  clearLessonImage,
  reprocessLessonImages,
  type ReprocessResult,
} from "@/lib/lesson-images";
import { ES_SUFFIX } from "@/lib/lesson-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, ImageIcon, ArrowLeft, Scissors, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCoach } from "@/lib/coach-store";
import { GuestGate } from "@/components/coach/GuestGate";
import { useTranslation } from "react-i18next";

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

type Slot = {
  key: string;
  label: string;
};

function LessonEditor() {
  const { state } = useCoach();
  const { t } = useTranslation(["lessonEditor", "common"]);
  const isAuthed = state.profile.isAuthenticated;
  const [adminCheck, setAdminCheck] = useState<"pending" | "yes" | "no">("pending");

  useEffect(() => {
    let active = true;
    if (!isAuthed) {
      setAdminCheck("no");
      return;
    }
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        if (active) setAdminCheck("no");
        return;
      }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: "admin",
      });
      if (!active) return;
      if (error) {
        console.error("[lesson-editor] role check failed", error);
        setAdminCheck("no");
      } else {
        setAdminCheck(data ? "yes" : "no");
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthed]);

  const search = Route.useSearch();
  const initial = search.lesson && lessons.some((l) => l.id === search.lesson)
    ? search.lesson
    : lessons[0]?.id ?? "";
  const [lessonId, setLessonId] = useState<string>(initial);
  const lesson = lessons.find((l) => l.id === lessonId);
  const images = useLessonImages(lessonId);

  const slots: Slot[] = useMemo(() => {
    if (!lesson) return [];
    const list: Slot[] = [
      { key: "before", label: t("lessonEditor:beforeSlot") },
      { key: "after", label: t("lessonEditor:afterSlot") },
    ];
    if (lesson.rich) {
      if (lesson.rich.visualReference) {
        list.push({
          key: "visual",
          label: t("lessonEditor:visualSlot"),
        });
      }
      lesson.rich.detailedSteps.forEach((s, i) => {
        list.push({
          key: `step:${i}`,
          label: t("lessonEditor:stepSlotTitled", { n: i + 1, title: s.title }),
        });
      });
    } else {
      lesson.steps.forEach((_text, i) => {
        list.push({ key: `step:${i}`, label: t("lessonEditor:stepSlot", { n: i + 1 }) });
      });
    }
    return list;
  }, [lesson, t]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("lessonEditor:title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("lessonEditor:subtitle")}
          </p>
        </div>
        {lesson && (
          <Button asChild variant="outline">
            <Link to="/lessons/$id" params={{ id: lesson.id }}>
              <ArrowLeft className="size-4 mr-1" /> {t("lessonEditor:openLesson")}
            </Link>
          </Button>
        )}
      </div>

      <GuestGate isAuthenticated={isAuthed}>
        {adminCheck === "pending" && (
          <div className="rounded-2xl bg-card border border-border p-6 text-sm text-muted-foreground">
            {t("lessonEditor:checkingPermissions")}
          </div>
        )}
        {adminCheck === "no" && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-2">
            <div className="font-semibold">{t("lessonEditor:adminOnly")}</div>
            <p className="text-sm text-muted-foreground">
              {t("lessonEditor:adminOnlyBody")}
            </p>
          </div>
        )}
        {adminCheck === "yes" && (
          <>
        <ReprocessPanel />
        <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm text-muted-foreground sm:w-32 shrink-0">{t("lessonEditor:editingLesson")}</label>
          <Select value={lessonId} onValueChange={setLessonId}>
            <SelectTrigger className="w-full sm:max-w-md">
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
          {lesson && (() => {
            const enUploaded = slots.filter((s) => images[s.key]).length;
            const esUploaded = slots.filter((s) => images[`${s.key}${ES_SUFFIX}`]).length;
            const enComplete = slots.length > 0 && enUploaded >= slots.length;
            const esComplete = slots.length > 0 && esUploaded >= slots.length;
            const status = enComplete && esComplete
              ? t("lessonEditor:statusComplete")
              : !enComplete && !esComplete
                ? t("lessonEditor:statusBothIncomplete")
                : enComplete
                  ? t("lessonEditor:statusEsIncomplete")
                  : t("lessonEditor:statusEnIncomplete");
            return (
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <Badge variant={enComplete ? "success" : "outline"} className={enComplete ? undefined : "border-border"}>
                  {t("lessonEditor:countEn", { done: enUploaded, total: slots.length })}
                </Badge>
                <Badge variant={esComplete ? "success" : "outline"} className={esComplete ? undefined : "border-border"}>
                  {t("lessonEditor:countEs", { done: esUploaded, total: slots.length })}
                </Badge>
                <span className={enComplete && esComplete ? "text-xs text-success" : "text-xs text-muted-foreground"}>
                  {status}
                </span>
              </div>
            );
          })()}
        </div>

        {lesson && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map((slot) => (
              <SlotPair
                key={slot.key}
                lessonId={lesson.id}
                slot={slot}
                enImage={images[slot.key]}
                esImage={images[`${slot.key}${ES_SUFFIX}`]}
              />
            ))}
          </div>
        )}
          </>
        )}
      </GuestGate>
    </div>
  );
}

function SlotPair({
  lessonId,
  slot,
  enImage,
  esImage,
}: {
  lessonId: string;
  slot: Slot;
  enImage?: string;
  esImage?: string;
}) {
  const { t } = useTranslation("lessonEditor");
  return (
    <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-4">
      <div className="font-semibold text-sm">{slot.label}</div>
      <ImageSlot
        lessonId={lessonId}
        slotKey={slot.key}
        label={t("englishImage")}
        image={enImage}
      />
      <ImageSlot
        lessonId={lessonId}
        slotKey={`${slot.key}${ES_SUFFIX}`}
        label={t("spanishImage")}
        image={esImage}
        emptyHint={!esImage ? t("spanishFallback") : undefined}
      />
    </div>
  );
}

function ImageSlot({
  lessonId,
  slotKey,
  label,
  image,
  emptyHint,
}: {
  lessonId: string;
  slotKey: string;
  label: string;
  image?: string;
  emptyHint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation("lessonEditor");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await uploadLessonImage(lessonId, slotKey, file);
      toast.success(t("slotUpdated", { label }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : t("couldNotUpload");
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-secondary/30 overflow-hidden">
        {busy ? (
          <div className="aspect-video grid place-items-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
            <span className="sr-only">{t("uploading")}</span>
          </div>
        ) : image ? (
          <img
            src={image}
            alt={label}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto bg-black/40"
          />
        ) : (
          <div className="aspect-video grid place-items-center">
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <ImageIcon className="size-5" aria-hidden />
              <span className="uppercase tracking-wider">{t("noImageYet")}</span>
            </div>
          </div>
        )}
      </div>
      {emptyHint && (
        <p className="text-xs text-muted-foreground">{emptyHint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label={`${label} — ${image ? t("replace") : t("upload")}`}
        >
          {busy ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Upload className="size-4 mr-1" />}
          {busy ? t("uploading") : image ? t("replace") : t("upload")}
        </Button>
        {image && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={busy}
            aria-label={`${label} — ${t("remove")}`}
            onClick={() => {
              clearLessonImage(lessonId, slotKey)
                .then(() => toast(t("imageRemoved")))
                .catch((e) =>
                  toast.error(e instanceof Error ? e.message : t("couldNotRemove")),
                );
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4 mr-1" /> {t("remove")}
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
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
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 space-y-3">
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
        <ul className="text-xs font-mono space-y-0.5 max-h-56 overflow-auto rounded-md bg-secondary/40 p-2">
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