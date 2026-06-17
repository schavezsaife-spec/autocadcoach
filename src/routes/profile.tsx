import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useCoach } from "@/lib/coach-store";
import { lessons, projects } from "@/lib/coach-data";
import { Trophy, Flame, BookOpen, Wrench, Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/components/coach/ProfileAvatar";
import { ProfileImageUploader } from "@/components/coach/ProfileImageUploader";
import { EditProfileForm } from "@/components/coach/EditProfileForm";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — AutoCAD Coach" },
      { name: "description", content: "Manage your AutoCAD Coach account, profile details, and learning preferences." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Profile — AutoCAD Coach" },
      { property: "og:url", content: "https://autocadcoach.lovable.app/profile" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/profile" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, set, totalXp, progressPct, hydrated } = useCoach();
  const navigate = useNavigate();
  const p = state.profile;

  // Wait for hydration before deciding to redirect to avoid flicker.
  useEffect(() => {
    if (hydrated && !p.isAuthenticated) {
      navigate({ to: "/auth" });
    }
  }, [hydrated, p.isAuthenticated, navigate]);

  if (!hydrated || !p.isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-4 animate-pulse">
        <div className="h-28 rounded-2xl bg-card border border-border" />
        <div className="h-40 rounded-2xl bg-card border border-border" />
        <div className="h-32 rounded-2xl bg-card border border-border" />
      </div>
    );
  }

  const completedProjectsCount = state.completedProjects.length;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 pb-24 md:pb-10 space-y-6">
      {/* Hero banner */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary blur-[80px] opacity-10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <ProfileAvatar image={p.profileImage} firstName={p.firstName} lastName={p.lastName} size="lg" />
            <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary ring-2 ring-background" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {`${p.firstName} ${p.lastName}`.trim() || "AutoCAD Learner"}
            </h1>
            <div className="text-sm text-muted-foreground truncate mt-0.5">{p.email}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary border border-primary/30 px-3 py-1 text-xs font-semibold">
                <Trophy className="size-3" /> {totalXp} XP earned
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Flame className="size-3 text-orange-400" /> {state.streak} day streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total XP" value={totalXp} icon={Trophy} accent />
        <StatCard label="Lessons" value={`${state.completedLessons.length}/${lessons.length}`} icon={BookOpen} />
        <StatCard label="Projects" value={`${completedProjectsCount}/${projects.length}`} icon={Wrench} />
        <StatCard label="Progress" value={`${progressPct}%`} icon={Target} />
      </div>

      {/* Two-column settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Profile photo</div>
          <ProfileImageUploader
            image={p.profileImage}
            firstName={p.firstName}
            lastName={p.lastName}
            onChange={(dataUrl) => set({ profile: { ...p, profileImage: dataUrl } })}
          />
        </div>
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Account details</div>
          <EditProfileForm />
        </div>
      </div>

      {/* Completed lessons */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Completed lessons</div>
          <span className="text-xs bg-primary/15 text-primary border border-primary/30 rounded-full px-2.5 py-0.5 font-semibold">
            {state.completedLessons.length} / {lessons.length}
          </span>
        </div>
        {state.completedLessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet — start your first lesson!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {state.completedLessons.map((id) => {
              const l = lessons.find((x) => x.id === id);
              return l && (
                <Badge key={id} className="bg-primary/15 text-primary border-primary/30">
                  <CheckCircle2 className="size-3 mr-1" /> {l.title}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}