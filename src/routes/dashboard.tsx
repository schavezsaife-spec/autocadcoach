import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCoach } from "@/lib/coach-store";
import { lessons } from "@/lib/coach-data";
import { useLocalizedLessons } from "@/lib/i18n/content";
import { Flame, Trophy, BookOpen, Wrench, CheckCircle2, Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { GuestGate } from "@/components/coach/GuestGate";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:dashboardTitle") },
      {
        name: "description",
        content: i18n.t("meta:dashboardDesc"),
      },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: i18n.t("meta:dashboardTitle") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/dashboard" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/dashboard" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { state, totalXp, progressPct, isUnlocked, hydrated } = useCoach();
  const { t } = useTranslation(["dashboard", "common"]);
  const [q, setQ] = useState("");
  const isAuthed = state.profile.isAuthenticated;
  const localizedLessons = useLocalizedLessons();

  const filtered = localizedLessons.filter(
    (l) => l.title.toLowerCase().includes(q.toLowerCase()) || l.tag.toLowerCase().includes(q.toLowerCase()),
  );

  // Show skeleton instantly while hydrating from localStorage.
  // Since hydrated flips synchronously from localStorage (not waiting
  // for Supabase), this skeleton only shows for ~1 frame on first load.
  if (!hydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-card border border-border" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border h-28" />
          ))}
        </div>
        <div className="rounded-2xl bg-card border border-border h-16" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8 animate-in fade-in duration-150">
      <GuestGate isAuthenticated={isAuthed}>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Stat icon={BookOpen} label={t("dashboard:lessons")} value={`${state.completedLessons.length}/${lessons.length}`} />
          <Stat icon={Trophy} label={t("dashboard:totalXp")} value={`${totalXp}`} accent />
          <Stat icon={Wrench} label={t("dashboard:projects")} value={`${state.completedProjects.length}`} />
          <Stat
            icon={Flame}
            label={t("dashboard:streak")}
            value={`${state.streak} ${t("dashboard:days", { count: state.streak })}`}
          />
        </div>

        {/* Progress bar */}
        <div className="rounded-2xl bg-card border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">{t("dashboard:overallProgress")}</div>
            <div className="text-sm text-muted-foreground">{progressPct}%</div>
          </div>
          <Progress
            value={progressPct}
            className="h-2"
            trackClassName="bg-success/20"
            indicatorClassName="bg-success"
          />
        </div>

        {/* Lessons grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-xl font-semibold">{t("dashboard:lessons")}</h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("dashboard:searchLessons")}
                aria-label={t("dashboard:searchLessons")}
                className="pl-9 bg-card border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filtered.map((l) => {
              const done = state.completedLessons.includes(l.id);
              const unlocked = isUnlocked(l.id);
              const cardCls = cn(
                "rounded-2xl bg-card border border-border p-4 sm:p-5 transition-all block",
                unlocked
                  ? "hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  : "opacity-40 cursor-not-allowed saturate-0",
              );
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {t("common:day")} {l.day}
                    </Badge>
                    {done ? (
                      <Badge className="bg-success/20 text-success border-success/30">
                        <CheckCircle2 className="size-3 mr-1" /> {t("dashboard:done")}
                      </Badge>
                    ) : !unlocked ? (
                      <Badge variant="outline" className="text-muted-foreground/60 border-dashed">
                        <Lock className="size-3 mr-1" /> {t("dashboard:completePrevious")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-border">
                        {l.xp} XP
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 font-semibold">{l.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{l.description}</div>
                </>
              );
              return unlocked ? (
                <Link key={l.id} to="/lessons/$id" params={{ id: l.id }} className={cardCls}>
                  {inner}
                </Link>
              ) : (
                <div key={l.id} className={cardCls} aria-disabled>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </GuestGate>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border p-5", accent && "ring-1 ring-success/30")}>
      <div
        className={cn(
          "size-9 rounded-lg grid place-items-center",
          accent ? "bg-success/20 text-success" : "bg-secondary text-foreground",
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="mt-3 text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
