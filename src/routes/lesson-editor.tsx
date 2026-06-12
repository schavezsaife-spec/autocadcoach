import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { lessons } from "@/lib/coach-data";
import {
  useLessonImages,
  setLessonImage,
  clearLessonImage,
  readImageFile,
} from "@/lib/lesson-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, ImageIcon, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useCoach } from "@/lib/coach-store";
import { GuestGate } from "@/components/coach/GuestGate";

export const Route = createFileRoute("/lesson-editor")({
  head: () => ({ meta: [{ title: "Lesson image editor — AutoCAD Coach" }] }),
  component: LessonEditor,
});

type Slot = {
  key: string;
  label: string;
  caption?: string;
  sourceUrl?: string;
};

function LessonEditor() {
  const { state } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  const [lessonId, setLessonId] = useState<string>(lessons[0]?.id ?? "");
  const lesson = lessons.find((l) => l.id === lessonId);
  const images = useLessonImages(lessonId);

  const slots: Slot[] = useMemo(() => {
    if (!lesson) return [];
    const list: Slot[] = [
      { key: "beforeYouStart", label: "Before you start" },
      { key: "before", label: "Before vs After — Before" },
      { key: "after", label: "Before vs After — After" },
    ];
    if (lesson.rich) {
      if (lesson.rich.visualReference) {
        list.push({
          key: "visual",
          label: "Visual reference",
          caption: lesson.rich.visualReference.caption,
          sourceUrl: lesson.rich.visualReference.sourceUrl,
        });
      }
      lesson.rich.detailedSteps.forEach((s, i) => {
        list.push({
          key: `step:${i}`,
          label: `Step ${i + 1} — ${s.title}`,
          caption: s.screenshot.caption,
          sourceUrl: s.screenshot.sourceUrl,
        });
      });
    } else {
      lesson.steps.forEach((text, i) => {
        list.push({ key: `step:${i}`, label: `Step ${i + 1}`, caption: text });
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
            <Badge variant="outline" className="border-border self-start sm:self-auto">
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
      const url = await readImageFile(file);
      setLessonImage(lessonId, slot.key, url);
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
          {slot.caption && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{slot.caption}</p>
          )}
        </div>
        {slot.sourceUrl && (
          <a
            href={slot.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1 shrink-0"
          >
            Docs <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-border bg-secondary/30 overflow-hidden aspect-video grid place-items-center">
        {image ? (
          <img src={image} alt={slot.label} className="w-full h-full object-contain bg-black/40" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <ImageIcon className="size-5" aria-hidden />
            <span className="uppercase tracking-wider">No image yet</span>
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
              clearLessonImage(lessonId, slot.key);
              toast("Image removed");
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