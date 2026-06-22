import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { lessons, getLessonQuiz, type RichLesson } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { useLessonImages, type LessonImageMap } from "@/lib/lesson-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lightbox } from "@/components/coach/Lightbox";
import { ScreenshotCard } from "@/components/coach/ScreenshotCard";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, AlertCircle, Target, Trophy, RotateCcw, XCircle, BookOpen, Compass, MapPin, ListChecks, Image as ImageIcon, Wrench, Dumbbell, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { GuestGate } from "@/components/coach/GuestGate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lessons/$id")({
  head: ({ params }) => {
    const lesson = lessons.find((l) => l.id === params.id);
    const url = `https://autocadcoach.lovable.app/lessons/${params.id}`;
    const title = lesson ? `${lesson.title} — AutoCAD Coach` : "Lesson — AutoCAD Coach";
    const description = lesson?.description ?? "AutoCAD lesson on AutoCAD Coach.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: lesson
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LearningResource",
                name: lesson.title,
                headline: lesson.title,
                description: lesson.description,
                url,
                inLanguage: "en",
                educationalLevel: "Beginner",
                learningResourceType: "Lesson",
                teaches: lesson.tag,
                about: "AutoCAD",
                isPartOf: {
                  "@type": "Course",
                  name: "AutoCAD Coach",
                  url: "https://autocadcoach.lovable.app/lessons",
                },
                provider: {
                  "@type": "Organization",
                  name: "AutoCAD Coach",
                  url: "https://autocadcoach.lovable.app",
                },
              }),
            },
          ]
        : [],
    };
  },
  component: LessonViewer,
});

function LessonViewer() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { state, set, completeLesson, passLessonQuiz, isUnlocked } = useCoach();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isAuthed = state.profile.isAuthenticated;
  const uploadedImages = useLessonImages(id);

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
      <div className="max-w-2xl mx-auto p-10 pb-24 md:pb-10 text-center">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-24 md:pb-10 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="border-primary/30 text-primary">Day {lesson.day}</Badge>
        <Badge variant="outline" className="border-border">{lesson.tag}</Badge>
        <Badge variant="outline" className="border-border">{lesson.xp} XP</Badge>
        {done && <Badge className="bg-primary/20 text-primary border-primary/30"><CheckCircle2 className="size-3 mr-1" /> Completed</Badge>}
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{lesson.title}</h1>
      <p className="text-muted-foreground">{lesson.description}</p>

      <GuestGate isAuthenticated={isAuthed}>
      {lesson.rich ? (
        <RichLessonBody
          rich={lesson.rich}
          fallbackImage={lesson.image}
          uploaded={uploadedImages}
          onOpenLightbox={() => setLightboxOpen(true)}
          lessonId={lesson.id}
        />
      ) : (
        <LegacyLessonBody
          lesson={lesson}
          step={step}
          stepPct={stepPct}
          setStep={setStep}
          onOpenLightbox={() => setLightboxOpen(true)}
        />
      )}

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
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

function LegacyLessonBody({
  lesson,
  step,
  stepPct,
  setStep,
  onOpenLightbox,
}: {
  lesson: (typeof lessons)[number];
  step: number;
  stepPct: number;
  setStep: (n: number) => void;
  onOpenLightbox: () => void;
}) {
  const media = lesson.media;
  const heroSrc = media?.hero ?? lesson.image;
  return (
    <>
      <button
        onClick={onOpenLightbox}
        className="block w-full rounded-2xl overflow-hidden border border-border group"
        aria-label={`Enlarge image for ${lesson.title}`}
      >
        <img src={heroSrc} alt={`${lesson.title} reference`} className="w-full h-64 object-contain bg-secondary/40 group-hover:scale-[1.02] transition-transform" />
      </button>

      <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 mt-6">
        <div className="flex items-center gap-2 text-primary font-semibold"><Target className="size-4" /> Objective</div>
        <p className="mt-2 text-sm">{lesson.objective}</p>
      </div>

      {media?.action && (
        <div className="mt-6">
          <ScreenshotCard src={media.action.src} alt={media.action.caption} />
        </div>
      )}

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

      {(media?.before || media?.after) && (
        <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 mt-6">
          <div className="font-semibold mb-3">Before vs After</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {media.before && (
              <ScreenshotCard src={media.before.src} alt={media.before.caption} />
            )}
            {media.after && (
              <ScreenshotCard src={media.after.src} alt={media.after.caption} />
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="rounded-2xl bg-card border border-destructive/30 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-destructive font-semibold"><AlertCircle className="size-4" /> Common mistake</div>
          <p className="mt-2 text-sm">{lesson.mistake}</p>
          {media?.error && (
            <div className="mt-3">
              <ScreenshotCard src={media.error.src} alt={media.error.caption} />
            </div>
          )}
        </div>
        <div className="rounded-2xl bg-card border border-primary/30 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-primary font-semibold"><Lightbulb className="size-4" /> Try this</div>
          <p className="mt-2 text-sm">{lesson.challenge}</p>
        </div>
      </div>
    </>
  );
}

const SECTIONS = [
  { id: "objective", label: "Objective", icon: Target },
  { id: "what", label: "What it is", icon: BookOpen },
  { id: "why", label: "Why & when", icon: Compass },
  { id: "where", label: "Where to find it", icon: MapPin },
  { id: "vocab", label: "Vocabulary", icon: BookOpen },
  { id: "before", label: "Before you start", icon: ListChecks },
  { id: "steps", label: "Step-by-step", icon: ListChecks },
  { id: "visual", label: "Visual reference", icon: ImageIcon },
  { id: "mistakes", label: "Mistakes & fixes", icon: AlertCircle },
  { id: "troubleshooting", label: "Troubleshooting", icon: Wrench },
  { id: "practice", label: "Practice", icon: Dumbbell },
  { id: "pro", label: "Pro tips & related", icon: Sparkles },
];

function RichLessonBody({
  rich,
  fallbackImage,
  uploaded,
  onOpenLightbox,
  lessonId,
}: {
  rich: RichLesson;
  fallbackImage: string;
  uploaded: LessonImageMap;
  onOpenLightbox: () => void;
  lessonId: string;
}) {
  const hideVisual = lessonId === "interface";
  const sections = hideVisual ? SECTIONS.filter((s) => s.id !== "visual") : SECTIONS;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-8">
      {/* Anchored TOC */}
      <nav className="hidden lg:block sticky top-6 self-start text-sm">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">On this page</div>
        <ul className="space-y-1.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                <s.icon className="size-3.5 opacity-60" />
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-6 min-w-0">
        <Section id="objective" icon={Target} title="Learning objective" accent="primary">
          <p className="text-base leading-relaxed">{rich.learningObjective}</p>
        </Section>

        <Section id="what" icon={BookOpen} title={`What ${rich.commandName ?? "this"} is`}>
          <p className="text-sm leading-relaxed">{rich.whatItIs}</p>
        </Section>

        <Section id="why" icon={Compass} title="Why and when you use it">
          <p className="text-sm leading-relaxed">{rich.whyWhen}</p>
        </Section>

        <Section id="where" icon={MapPin} title="Where to find it in the AutoCAD interface">
          <dl className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-2 gap-x-4 text-sm">
            <dt className="text-muted-foreground">Ribbon</dt>
            <dd>{rich.whereToFind.ribbon}</dd>
            {rich.whereToFind.menu && (<>
              <dt className="text-muted-foreground">Menu</dt>
              <dd>{rich.whereToFind.menu}</dd>
            </>)}
            <dt className="text-muted-foreground">Command line</dt>
            <dd className="font-mono text-primary">{rich.whereToFind.commandLine}</dd>
            {rich.whereToFind.alias && (<>
              <dt className="text-muted-foreground">Alias / shortcut</dt>
              <dd className="font-mono text-primary">{rich.whereToFind.alias}</dd>
            </>)}
          </dl>
        </Section>

        <Section id="vocab" icon={BookOpen} title="Key vocabulary">
          <dl className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-3 gap-x-4 text-sm">
            {rich.vocab.map((v) => (
              <div key={v.term} className="contents">
                <dt className="font-semibold text-foreground">{v.term}</dt>
                <dd className="text-muted-foreground">{v.definition}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="before" icon={ListChecks} title="Before you start">
          <ul className="space-y-2 text-sm">
            {rich.beforeYouStart.map((b, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {uploaded.beforeYouStart && (
            <div className="mt-4">
              <ScreenshotCard
                src={uploaded.beforeYouStart}
                alt="Before you start — annotated AutoCAD screenshot"
                lessonId={lessonId}
                slot="beforeYouStart"
              />
            </div>
          )}
          {!uploaded.beforeYouStart && (
            <div className="mt-4">
              <ScreenshotCard
                alt="Before you start — annotated AutoCAD screenshot"
                lessonId={lessonId}
                slot="beforeYouStart"
              />
            </div>
          )}
        </Section>

        <Section id="steps" icon={ListChecks} title="Step-by-step instructions">
          <ol className="space-y-5">
            {rich.detailedSteps.map((s, i) => (
              <li key={i} className="rounded-xl border border-border bg-secondary/30 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center size-7 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{s.title}</div>
                    <p className="mt-1 text-sm">{s.instruction}</p>
                    <p className="mt-2 text-sm text-muted-foreground italic">{s.explanation}</p>
                    <ScreenshotSlot
                      shot={s.screenshot}
                      fallback={fallbackImage}
                      uploadedUrl={uploaded[`step:${i}`]}
                      lessonId={lessonId}
                      slot={`step:${i}`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {!hideVisual && (
        <Section id="visual" icon={ImageIcon} title="Visual reference">
          {rich.visualReference ? (
            <ScreenshotSlot
              shot={rich.visualReference}
              fallback={fallbackImage}
              uploadedUrl={uploaded.visual}
              onOpen={onOpenLightbox}
              large
              lessonId={lessonId}
              slot="visual"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No reference image required for this lesson.</p>
          )}
          {(uploaded.before || uploaded.after) && (
            <div className="mt-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Before vs After
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <BeforeAfter label="Before" src={uploaded.before} lessonId={lessonId} slot="before" />
                <BeforeAfter label="After" src={uploaded.after} lessonId={lessonId} slot="after" />
              </div>
            </div>
          )}
        </Section>
        )}

        <Section id="mistakes" icon={AlertCircle} title="Common mistakes & fixes" accent="destructive">
          <ul className="space-y-3 text-sm">
            {rich.commonMistakes.map((m, i) => (
              <li key={i} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <div className="font-medium text-destructive">{m.mistake}</div>
                <div className="mt-1 text-muted-foreground"><span className="text-foreground font-medium">Fix: </span>{m.fix}</div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="troubleshooting" icon={Wrench} title="Troubleshooting">
          <div className="space-y-3">
            {rich.troubleshooting.map((t, i) => (
              <details key={i} className="group rounded-lg border border-border bg-secondary/30 p-3 open:bg-secondary/50">
                <summary className="cursor-pointer font-medium text-sm flex items-center justify-between gap-2">
                  <span>{t.problem}</span>
                  <span className="text-xs text-muted-foreground group-open:hidden">Show</span>
                  <span className="text-xs text-muted-foreground hidden group-open:inline">Hide</span>
                </summary>
                <div className="mt-2 text-sm space-y-1">
                  <div><span className="text-muted-foreground">Cause: </span>{t.cause}</div>
                  <div><span className="text-muted-foreground">Fix: </span>{t.fix}</div>
                </div>
              </details>
            ))}
          </div>
        </Section>

        <Section id="practice" icon={Dumbbell} title="Practice exercise" accent="primary">
          <div className="font-semibold">{rich.practiceExercise.title}</div>
          <ol className="mt-3 space-y-2 text-sm list-decimal list-inside marker:text-primary">
            {rich.practiceExercise.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <span className="font-medium text-primary">Success looks like: </span>
            <span>{rich.practiceExercise.success}</span>
          </div>
        </Section>

        <Section id="pro" icon={Sparkles} title="Pro tips & related commands">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Pro tips</div>
              <ul className="space-y-2 text-sm">
                {rich.proTips.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <Lightbulb className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Related commands</div>
              <ul className="space-y-2 text-sm">
                {rich.relatedCommands.map((c) => (
                  <li key={c.name} className="rounded-lg border border-border bg-secondary/30 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-primary">{c.name}</span>
                      {c.alias && <span className="text-xs text-muted-foreground">({c.alias})</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.what}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  id,
  icon: Icon,
  title,
  accent = "default",
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent?: "default" | "primary" | "destructive";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 rounded-2xl border bg-card p-4 sm:p-6",
        accent === "primary" && "border-primary/30",
        accent === "destructive" && "border-destructive/30",
        accent === "default" && "border-border",
      )}
    >
      <h2 className={cn(
        "flex items-center gap-2 text-lg font-semibold mb-4",
        accent === "primary" && "text-primary",
        accent === "destructive" && "text-destructive",
      )}>
        <Icon className="size-5" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function ScreenshotSlot({
  shot,
  fallback,
  uploadedUrl,
  onOpen,
  large = false,
}: {
  shot: { imageUrl?: string };
  fallback: string;
  uploadedUrl?: string;
  onOpen?: () => void;
  large?: boolean;
}) {
  const src = uploadedUrl ?? shot.imageUrl;
  // `fallback`, `onOpen`, `large` are intentionally unused — ScreenshotCard
  // owns its own lightbox and sizes itself to the available card width.
  void fallback;
  void onOpen;
  void large;
  return (
    <div className="mt-3">
      <ScreenshotCard
        src={src}
        alt="Lesson screenshot"
      />
    </div>
  );
}

function BeforeAfter({ label, src }: { label: string; src?: string }) {
  return (
    <ScreenshotCard
      src={src}
      alt={`${label} — annotated AutoCAD screenshot`}
    />
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