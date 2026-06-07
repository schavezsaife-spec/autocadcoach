import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { lessons } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthGuard } from "@/lib/use-auth-guard";

export const Route = createFileRoute("/lessons")({
  head: () => ({ meta: [{ title: "Lessons — AutoCAD Coach" }] }),
  component: LessonsLayout,
});

function LessonsLayout() {
  const authed = useAuthGuard();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!authed) return null;
  const isList = pathname === "/lessons" || pathname === "/lessons/";
  if (!isList) return <Outlet />;
  return <LessonList />;
}

function LessonList() {
  const { state, isUnlocked } = useCoach();
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Lesson Path</h1>
        <p className="text-muted-foreground mt-1">Complete each lesson to unlock the next.</p>
      </header>
      <ol className="relative space-y-3 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-border">
        {lessons.map((l) => {
          const done = state.completedLessons.includes(l.id);
          const unlocked = isUnlocked(l.id);
          const cardCls = cn(
            "block rounded-2xl bg-card border border-border p-5 transition-all",
            unlocked ? "hover:border-primary/40" : "opacity-60 cursor-not-allowed"
          );
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-primary/30 text-primary">Day {l.day}</Badge>
                <Badge variant="outline" className="border-border">{l.xp} XP</Badge>
              </div>
              <div className="mt-2 font-semibold text-lg">{l.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{l.description}</div>
            </>
          );
          return (
            <li key={l.id} className="relative pl-16">
              <div className={cn(
                "absolute left-2 top-3 size-9 rounded-full grid place-items-center ring-4 ring-background",
                done ? "bg-primary text-primary-foreground" : unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {done ? <CheckCircle2 className="size-4" /> : unlocked ? <Sparkles className="size-4" /> : <Lock className="size-4" />}
              </div>
              {unlocked ? (
                <Link to="/lessons/$id" params={{ id: l.id }} className={cardCls}>{inner}</Link>
              ) : (
                <div className={cardCls} aria-disabled>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}