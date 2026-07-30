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
import { GuestBanner } from "@/components/coach/AuthPrompt";

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
  const { t } = useTranslation(["dashboard", "common", "gate"]);
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
        {!isAuthed && <GuestBanner />}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Stat icon={BookOpen} label={t("dashboard:lessons")} value={`${isAuthed ? state.completedLessons.length : 0}/${lessons.length}`} />
          <Stat icon={Trophy} label={t("dashboard:totalXp")} value={`${isAuthed ? totalXp : 0}`} />
          <Stat icon={Wrench} label={t("dashboard:projects")} value={`${isAuthed ? state.completedProjects.length : 0}`} />
          <Stat
            icon={Flame}
            label={t("dashboard:streak")}
            value={`${isAuthed ? state.streak : 0} ${t("dashboard:days", { count: isAuthed ? state.streak : 0 })}`}
          />
        </div>

        {/* Progress bar */}
        <div className="rounded-2xl bg-card border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">{t("dashboard:overallProgress")}</div>
            <div className="text-sm text-muted-foreground">{isAuthed ? progressPct : 0}%</div>
          </div>
          <Progress
            value={isAuthed ? progressPct : 0}
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
              const done = isAuthed && state.completedLessons.includes(l.id);
              const unlocked = isUnlocked(l.id);
              const canOpen = !isAuthed || unlocked;
              const cardCls = cn(
                "rounded-2xl bg-card border border-border p-4 sm:p-5 transition-all block",
                canOpen
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
                    ) : !isAuthed ? (
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        {t("gate:previewBadge")}
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
              return canOpen ? (
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
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card p-5 border border-primary/25",
        "ring-1 ring-primary/15 shadow-[0_0_24px_-10px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
        "transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)]",
      )}
    >
      <div className="size-9 rounded-lg grid place-items-center bg-gradient-to-br from-primary/25 to-success/20 text-primary ring-1 ring-primary/30">
        <Icon className="size-4" />
      </div>
      <div className="mt-3 text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
