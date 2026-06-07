import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { lessons } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbox } from "@/components/coach/Lightbox";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, AlertCircle, Target } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lessons/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${lessons.find((l) => l.id === params.id)?.title ?? "Lesson"} — AutoCAD Coach` }],
  }),
  component: LessonViewer,
});

function LessonViewer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { state, set, completeLesson, isUnlocked } = useCoach();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) {
    return (
      <div className="p-10">
        <p>Lesson not found.</p>
        <Link to="/lessons" className="text-primary underline">Back to lessons</Link>
      </div>
    );
  }

  if (!isUnlocked(lesson.id)) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-bold">This lesson is locked</h1>
        <p className="text-muted-foreground mt-2">Finish the previous lesson to unlock it.</p>
        <Button asChild className="mt-6"><Link to="/lessons">Back to path</Link></Button>
      </div>
    );
  }

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const step = state.lessonStep[lesson.id] ?? 0;
  const stepPct = Math.round(((step + 1) / lesson.steps.length) * 100);
  const done = state.completedLessons.includes(lesson.id);

  const setStep = (n: number) =>
    set((s) => ({ lessonStep: { ...s.lessonStep, [lesson.id]: Math.max(0, Math.min(lesson.steps.length - 1, n)) } }));

  const onComplete = () => {
    completeLesson(lesson.id);
    toast.success(`+${lesson.xp} XP — ${lesson.title} complete!`);
    if (next) navigate({ to: "/lessons/$id", params: { id: next.id } });
    else navigate({ to: "/dashboard" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="border-primary/30 text-primary">Day {lesson.day}</Badge>
        <Badge variant="outline" className="border-border">{lesson.tag}</Badge>
        <Badge variant="outline" className="border-border">{lesson.xp} XP</Badge>
        {done && <Badge className="bg-primary/20 text-primary border-primary/30"><CheckCircle2 className="size-3 mr-1" /> Completed</Badge>}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{lesson.title}</h1>
      <p className="text-muted-foreground">{lesson.description}</p>

      <button
        onClick={() => setLightboxOpen(true)}
        className="block w-full rounded-2xl overflow-hidden border border-border group"
        aria-label={`Enlarge image for ${lesson.title}`}
      >
        <img src={lesson.image} alt={`${lesson.title} reference`} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
      </button>

      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center gap-2 text-primary font-semibold"><Target className="size-4" /> Objective</div>
        <p className="mt-2 text-sm">{lesson.objective}</p>
      </div>

      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Step {step + 1} of {lesson.steps.length}</div>
          <div className="text-sm text-muted-foreground">{stepPct}%</div>
        </div>
        <Progress value={stepPct} className="h-1.5 mb-4" />
        <p className="text-base">{lesson.steps[step]}</p>
        <div className="flex justify-between mt-5">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ArrowLeft className="size-4 mr-1" /> Previous
          </Button>
          <Button onClick={() => setStep(step + 1)} disabled={step === lesson.steps.length - 1}>
            Next <ArrowRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card border border-destructive/30 p-5">
          <div className="flex items-center gap-2 text-destructive font-semibold"><AlertCircle className="size-4" /> Common mistake</div>
          <p className="mt-2 text-sm">{lesson.mistake}</p>
        </div>
        <div className="rounded-2xl bg-card border border-primary/30 p-5">
          <div className="flex items-center gap-2 text-primary font-semibold"><Lightbulb className="size-4" /> Try this</div>
          <p className="mt-2 text-sm">{lesson.challenge}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex gap-2">
          {prev && (
            <Button asChild variant="outline">
              <Link to="/lessons/$id" params={{ id: prev.id }}><ArrowLeft className="size-4 mr-1" /> {prev.title}</Link>
            </Button>
          )}
          {next && (
            <Button asChild variant="outline">
              <Link to="/lessons/$id" params={{ id: next.id }}>{next.title} <ArrowRight className="size-4 ml-1" /></Link>
            </Button>
          )}
        </div>
        <Button onClick={onComplete} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <CheckCircle2 className="size-4 mr-1" /> {done ? "Mark complete again" : "Mark complete"}
        </Button>
      </div>

      {lightboxOpen && (
        <Lightbox
          src={lesson.image}
          alt={`${lesson.title} reference image`}
          caption={lesson.title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}