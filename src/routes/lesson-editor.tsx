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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, ImageIcon, ArrowLeft, Scissors, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCoach } from "@/lib/coach-store";
import { GuestGate } from "@/components/coach/GuestGate";

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
      { key: "before", label: "Before vs After — Before" },
      { key: "after", label: "Before vs After — After" },
    ];
    if (lesson.rich) {
      if (lesson.rich.visualReference) {
        list.push({
          key: "visual",
          label: "Visual reference",
        });
      }
      lesson.rich.detailedSteps.forEach((s, i) => {
        list.push({
          key: `step:${i}`,
          label: `Step ${i + 1} — ${s.title}`,
        });
      });
    } else {
      lesson.steps.forEach((_text, i) => {
        list.push({ key: `step:${i}`, label: `Step ${i + 1}` });
      });
    }
    return list;
  }, [lesson]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Lesson image editor</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Upload annotated AutoCAD screenshots for each step. Images are saved to this browser and
            shown inside the lesson immediately.
          </p>
        </div>
        {lesson && (
          <Button asChild variant="outline">
            <Link to="/lessons/$id" params={{ id: lesson.id }}>
              <ArrowLeft className="size-4 mr-1" /> Open lesson
            </Link>
          </Button>
        )}
      </div>

      <GuestGate isAuthenticated={isAuthed}>
        {adminCheck === "pending" && (
          <div className="rounded-2xl bg-card border border-border p-6 text-sm text-muted-foreground">
            Checking permissions…
          </div>
        )}
        {adminCheck === "no" && (
          <div className="rounded-2xl bg-card border border-border p-6 space-y-2">
            <div className="font-semibold">Admins only</div>
            <p className="text-sm text-muted-foreground">
              This editor is restricted to AutoCAD Coach admins. If you think you should
              have access, contact the site owner.
            </p>
          </div>
        )}
        {adminCheck === "yes" && (
          <>
        <ReprocessPanel />
        <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm text-muted-foreground sm:w-32 shrink-0">Editing lesson</label>
          <Select value={lessonId} onValueChange={setLessonId}>
            <SelectTrigger className="w-full sm:max-w-md">
              <SelectValue placeholder="Pick a lesson" />
            </SelectTrigger>
            <SelectContent>
              {lessons.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  Day {l.day} — {l.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {lesson && (
            <Badge
              variant={
                slots.length > 0 && Object.keys(images).length >= slots.length
                  ? "success"
                  : "outline"
              }
              className={
                slots.length > 0 && Object.keys(images).length >= slots.length
                  ? "self-start sm:self-auto"
                  : "border-border self-start sm:self-auto"
              }
            >
              {Object.keys(images).length} / {slots.length} uploaded
            </Badge>
          )}
        </div>

        {lesson && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map((slot) => (
              <SlotCard
                key={slot.key}
                lessonId={lesson.id}
                slot={slot}
                image={images[slot.key]}
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

function SlotCard({
  lessonId,
  slot,
  image,
}: {
  lessonId: string;
  slot: Slot;
  image?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      await uploadLessonImage(lessonId, slot.key, file);
      toast.success(`${slot.label} updated`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not upload image");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm">{slot.label}</div>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-secondary/30 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={slot.label}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto bg-black/40"
          />
        ) : (
          <div className="aspect-video grid place-items-center">
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <ImageIcon className="size-5" aria-hidden />
              <span className="uppercase tracking-wider">No image yet</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <Upload className="size-4 mr-1" /> {image ? "Replace" : "Upload"}
        </Button>
        {image && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              clearLessonImage(lessonId, slot.key)
                .then(() => toast("Image removed"))
                .catch((e) =>
                  toast.error(e instanceof Error ? e.message : "Could not remove image"),
                );
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4 mr-1" /> Remove
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

  async function run() {
    setBusy(true);
    setResults(null);
    try {
      const out = await reprocessLessonImages(REPROCESS_LESSON_IDS);
      setResults(out);
      const trimmedCount = out.filter((r) => r.trimmed).length;
      toast.success(`Reprocessed ${out.length} image${out.length === 1 ? "" : "s"} — ${trimmedCount} trimmed`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reprocess failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm flex items-center gap-2">
            <Scissors className="size-4" /> Reprocess legacy screenshots
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            One-time migration: auto-trims empty margins from images already uploaded for
            lessons {REPROCESS_LESSON_IDS.map((id) => `"${id}"`).join(", ")}. Safe to run
            more than once — already-tight images are skipped.
          </p>
        </div>
        <Button type="button" onClick={run} disabled={busy} variant="outline" size="sm">
          {busy ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Scissors className="size-4 mr-1" />}
          {busy ? "Reprocessing…" : "Run reprocess"}
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
              {r.trimmed ? " ✓ trimmed" : r.error ? ` ✕ ${r.error}` : " – skipped"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}