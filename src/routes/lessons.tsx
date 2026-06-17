import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { lessons } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GuestGate } from "@/components/coach/GuestGate";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lessons — AutoCAD Coach" },
      { name: "description", content: "Sequential AutoCAD lessons covering the interface, core commands, and modeling — unlock each as you progress." },
      { property: "og:title", content: "Lessons — AutoCAD Coach" },
      { property: "og:description", content: "Sequential AutoCAD lessons covering the interface, core commands, and modeling — unlock each as you progress." },
      { property: "og:url", content: "https://autocadcoach.lovable.app/lessons" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/lessons" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AutoCAD Coach Lessons",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: lessons.length,
          itemListElement: lessons.map((l, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://autocadcoach.lovable.app/lessons/${l.id}`,
            name: l.title,
          })),
        }),
      },
    ],
  }),
  component: LessonsLayout,
});

function LessonsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isList = pathname === "/lessons" || pathname === "/lessons/";
  if (!isList) return <Outlet />;
  return <LessonList />;
}

function LessonList() {
  const { state, isUnlocked } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <p className="mb-6 text-sm text-muted-foreground">Complete each lesson to unlock the next.</p>
      <GuestGate isAuthenticated={isAuthed}>
      <ol className="relative space-y-4 before:absolute before:left-5 sm:before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-border">
        {lessons.map((l) => {
          const done = state.completedLessons.includes(l.id);
          const unlocked = isUnlocked(l.id);
          const cardCls = cn(
            "block rounded-2xl bg-card border border-border p-4 sm:p-5 transition-all",
            unlocked ? "hover:border-primary/40" : "opacity-60 cursor-not-allowed"
          );
          const inner = (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary">Day {l.day}</Badge>
                <Badge variant="outline" className="border-border">{l.xp} XP</Badge>
              </div>
              <div className="mt-2 font-semibold text-lg">{l.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{l.description}</div>
            </>
          );
          return (
            <li key={l.id} className="relative pl-14 sm:pl-16">
              <div className={cn(
                "absolute left-1 top-4 size-10 rounded-full grid place-items-center ring-4 ring-background shadow-md",
                done ? "bg-primary text-primary-foreground shadow-primary/30" : unlocked ? "bg-primary/15 text-primary ring-primary/20" : "bg-muted text-muted-foreground"
              )}>
                {done ? <CheckCircle2 className="size-5" /> : unlocked ? <Sparkles className="size-5" /> : <Lock className="size-5" />}
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
      </GuestGate>
    </div>
  );
}