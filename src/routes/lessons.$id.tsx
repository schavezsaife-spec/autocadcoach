import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { lessons, getLessonQuiz } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbox } from "@/components/coach/Lightbox";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, AlertCircle, Target, Trophy, RotateCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { GuestGate } from "@/components/coach/GuestGate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lessons/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${lessons.find((l) => l.id === params.id)?.title ?? "Lesson"} — AutoCAD Coach` }],
  }),
  component: LessonViewer,
});

function LessonViewer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { state, set, completeLesson, passLessonQuiz, isUnlocked } = useCoach();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isAuthed = state.profile.isAuthenticated;

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

  const quizQuestions = getLessonQuiz(lesson.id);
  const passed = !!state.lessonQuizPassed[lesson.id];

  const onComplete = () => {
    if (!passed) {
      toast.error("Finish the lesson quiz with a passing score first.");
      return;
    }
    const alreadyDone = state.completedLessons.includes(lesson.id);
    completeLesson(lesson.id);
    if (!alreadyDone) toast.success(`+${lesson.xp} XP — ${lesson.title} complete!`);
    if (next) navigate({ to: "/lessons/$id", params: { id: next.id } });
    else navigate({ to: "/dashboard" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="border-primary/30 text-primary">Day {lesson.day}</Badge>
        <Badge variant="outline" className="border-border">{lesson.tag}</Badge>
        <Badge variant="outline" className="border-border">{lesson.xp} XP</Badge>
        {done && <Badge className="bg-primary/20 text-primary border-primary/30"><CheckCircle2 className="size-3 mr-1" /> Completed</Badge>}
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{lesson.title}</h1>
      <p className="text-muted-foreground">{lesson.description}</p>

      <GuestGate isAuthenticated={isAuthed}>
      <button
        onClick={() => setLightboxOpen(true)}
        className="block w-full rounded-2xl overflow-hidden border border-border group"
        aria-label={`Enlarge image for ${lesson.title}`}
      >
        <img src={lesson.image} alt={`${lesson.title} reference`} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
      </button>

      <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 mt-6">
        <div className="flex items-center gap-2 text-primary font-semibold"><Target className="size-4" /> Objective</div>
        <p className="mt-2 text-sm">{lesson.objective}</p>
      </div>

      <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Step {step + 1} of {lesson.steps.length}</div>
          <div className="text-sm text-muted-foreground">{stepPct}%</div>
        </div>
        <Progress value={stepPct} className="h-1.5 mb-4" />
        <p className="text-base">{lesson.steps[step]}</p>
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-5">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} className="w-full sm:w-auto">
            <ArrowLeft className="size-4 mr-1" /> Previous
          </Button>
          <Button onClick={() => setStep(step + 1)} disabled={step === lesson.steps.length - 1} className="w-full sm:w-auto">
            Next <ArrowRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl bg-card border border-destructive/30 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-destructive font-semibold"><AlertCircle className="size-4" /> Common mistake</div>
          <p className="mt-2 text-sm">{lesson.mistake}</p>
        </div>
        <div className="rounded-2xl bg-card border border-primary/30 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-primary font-semibold"><Lightbulb className="size-4" /> Try this</div>
          <p className="mt-2 text-sm">{lesson.challenge}</p>
        </div>
      </div>

      {quizQuestions.length > 0 && (
        <LessonQuiz
          lessonId={lesson.id}
          questions={quizQuestions}
          passed={passed}
          onPass={() => passLessonQuiz(lesson.id)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 mt-6">
        <div className="flex flex-wrap gap-2">
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
        <Button
          onClick={onComplete}
          disabled={quizQuestions.length > 0 && !passed}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          title={quizQuestions.length > 0 && !passed ? "Pass the lesson quiz to complete" : undefined}
        >
          <CheckCircle2 className="size-4 mr-1" /> {done ? "Mark complete again" : "Mark lesson complete"}
        </Button>
      </div>
      </GuestGate>

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

type Q = ReturnType<typeof getLessonQuiz>[number];

function LessonQuiz({
  lessonId,
  questions,
  passed,
  onPass,
}: {
  lessonId: string;
  questions: Q[];
  passed: boolean;
  onPass: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const correctCount = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0,
  );
  const totalAnswered = Object.keys(revealed).length;
  const passingScore = Math.ceil(questions.length * 0.7);
  const allAnswered = totalAnswered === questions.length;
  const justPassed = allAnswered && correctCount >= passingScore;

  if (justPassed && !passed) onPass();

  const pick = (i: number, choice: number) => {
    if (revealed[i]) return;
    setAnswers((a) => ({ ...a, [i]: choice }));
    setRevealed((r) => ({ ...r, [i]: true }));
  };

  const retry = () => {
    setAnswers({});
    setRevealed({});
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 mt-6" id={`quiz-${lessonId}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 font-semibold">
          <Trophy className="size-4 text-primary" /> Lesson quiz
        </div>
        <div className="flex items-center gap-2">
          {passed && (
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <CheckCircle2 className="size-3 mr-1" /> Passed
            </Badge>
          )}
          <Badge variant="outline" className="border-border">
            {correctCount}/{questions.length} correct
          </Badge>
          {(allAnswered || passed) && (
            <Button variant="outline" size="sm" onClick={retry}>
              <RotateCcw className="size-3.5 mr-1" /> Retry
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Score at least {passingScore}/{questions.length} to unlock lesson completion.
      </p>
      <div className="space-y-4">
        {questions.map((q, i) => {
          const ans = answers[i];
          const isRevealed = !!revealed[i];
          return (
            <div key={i} className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="font-medium text-sm">{i + 1}. {q.q}</div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.choices.map((c, ci) => {
                  const picked = ans === ci;
                  const isAnswer = q.answer === ci;
                  return (
                    <button
                      key={ci}
                      onClick={() => pick(i, ci)}
                      disabled={isRevealed}
                      className={cn(
                        "text-left rounded-lg border px-3 py-2 text-sm transition-colors flex items-center justify-between gap-2",
                        !isRevealed && "border-border hover:border-primary/40 hover:bg-secondary",
                        isRevealed && isAnswer && "border-primary/40 bg-primary/10 text-primary",
                        isRevealed && picked && !isAnswer && "border-destructive/40 bg-destructive/10 text-destructive",
                      )}
                    >
                      <span>{c}</span>
                      {isRevealed && isAnswer && <CheckCircle2 className="size-4" />}
                      {isRevealed && picked && !isAnswer && <XCircle className="size-4" />}
                    </button>
                  );
                })}
              </div>
              {isRevealed && (
                <div className={cn(
                  "mt-3 rounded-lg px-3 py-2 text-xs",
                  ans === q.answer
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20",
                )}>
                  {ans === q.answer ? "Correct — " : "Not quite — "}{q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {allAnswered && (
        <div className={cn(
          "mt-4 rounded-lg px-3 py-2 text-sm",
          justPassed
            ? "bg-primary/10 text-primary border border-primary/30"
            : "bg-destructive/10 text-destructive border border-destructive/30",
        )}>
          {justPassed
            ? `Nice work — you scored ${correctCount}/${questions.length}. You can now mark this lesson complete.`
            : `You scored ${correctCount}/${questions.length}. Hit Retry and aim for ${passingScore}+.`}
        </div>
      )}
    </div>
  );
}