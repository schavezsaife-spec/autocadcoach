import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, LogIn, Sparkles, Trophy, Wrench } from "lucide-react";
import { useCoach } from "@/lib/coach-store";
import { lessons } from "@/lib/coach-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoCAD Coach — Learn AutoCAD step by step" },
      { name: "description", content: "Beginner-friendly, gamified AutoCAD lessons, projects, quizzes, and an AI tutor." },
    ],
  }),
  component: Index,
});

function Index() {
  const { state, completedLessonsNext } = useNextLesson();
  const nextId = completedLessonsNext;
  const continueLabel = state.completedLessons.length > 0 ? "Continue Lesson" : "Start Learning";
  const isAuthed = state.profile.isAuthenticated;

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden />

      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          <Sparkles className="size-3.5" /> Beginner-friendly CAD learning
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
          Learn AutoCAD,<br />
          <span className="text-primary">one command at a time.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          AutoCAD Coach turns engineering software into a step-by-step game. Master LINE, TRIM, LAYERS, EXTRUDE and more — with built-in projects and an AI tutor when you get stuck.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]">
            <Link to="/lessons/$id" params={{ id: nextId }}>
              {continueLabel} <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border bg-card/40 hover:bg-card">
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
          {!isAuthed && (
            <Button asChild size="lg" variant="outline" className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/15">
              <Link to="/auth">
                <LogIn className="mr-1.5 size-4" /> Sign in
              </Link>
            </Button>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-3 gap-4">
        <Feature icon={BookOpen} title="15 Lessons" desc="Sequential, locked progression with XP rewards." />
        <Feature icon={Wrench} title="6 Projects" desc="Build real CAD drawings from scratch." />
        <Feature icon={Trophy} title="Quiz + AI Coach" desc="Test yourself, then ask AutoCoach anything." />
      </section>
    </div>
  );
}

function useNextLesson() {
  const { state } = useCoach();
  const next = lessons.find((l) => !state.completedLessons.includes(l.id)) ?? lessons[0];
  return { state, completedLessonsNext: next.id };
}

function Feature({ icon: Icon, title, desc }: { icon: typeof BookOpen; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 hover:border-primary/40 transition-colors">
      <div className="size-10 rounded-lg bg-primary/15 text-primary grid place-items-center">
        <Icon className="size-5" />
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </div>
  );
}
