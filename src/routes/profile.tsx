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
  const { state, set, totalXp, progressPct, hydrated, signOut } = useCoach();
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

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
      <div className="rounded-2xl bg-card border border-border p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <ProfileAvatar
          image={p.profileImage}
          firstName={p.firstName}
          lastName={p.lastName}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xl truncate">
            {`${p.firstName} ${p.lastName}`.trim() || "AutoCAD Learner"}
          </div>
          <div className="text-sm text-muted-foreground truncate">{p.email}</div>
          <div className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
            <Trophy className="size-3.5" /> {totalXp} XP earned
          </div>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="border-border">
          <LogOut className="size-4 mr-2" /> Sign out
        </Button>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <div className="font-semibold mb-4">Profile photo</div>
        <ProfileImageUploader
          image={p.profileImage}
          firstName={p.firstName}
          lastName={p.lastName}
          onChange={(dataUrl) => set({ profile: { ...p, profileImage: dataUrl } })}
        />
      </div>

      <EditProfileForm />

      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="XP" value={totalXp} />
        <Stat label="Lessons" value={`${state.completedLessons.length}/${lessons.length}`} />
        <Stat label="Projects" value={`${completedProjectsCount}/${projects.length}`} />
        <Stat label="Progress" value={`${progressPct}%`} />
      </div>

      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="font-semibold mb-3">Completed lessons</div>
        {state.completedLessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet — start your first lesson!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {state.completedLessons.map((id) => {
              const l = lessons.find((x) => x.id === id);
              return (
                l && (
                  <Badge key={id} className="bg-primary/15 text-primary border-primary/30">
                    {l.title}
                  </Badge>
                )
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