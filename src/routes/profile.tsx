import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useCoach } from "@/lib/coach-store";
import { lessons, projects } from "@/lib/coach-data";
import { Trophy, Flame, BookOpen, Wrench, Target, CheckCircle2, Camera, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/components/coach/ProfileAvatar";
import { EditProfileForm } from "@/components/coach/EditProfileForm";
import { toast } from "sonner";

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

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

function ProfilePage() {
  const { state, set, totalXp, progressPct, hydrated } = useCoach();
  const navigate = useNavigate();
  const p = state.profile;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hydrated && !p.isAuthenticated) {
      navigate({ to: "/auth" });
    }
  }, [hydrated, p.isAuthenticated, navigate]);

  if (!hydrated || !p.isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-4 animate-pulse">
        <div className="h-36 rounded-2xl bg-card border border-border" />
        <div className="h-24 rounded-2xl bg-card border border-border" />
        <div className="h-40 rounded-2xl bg-card border border-border" />
        <div className="h-32 rounded-2xl bg-card border border-border" />
      </div>
    );
  }

  const completedProjectsCount = state.completedProjects.length;

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set({ profile: { ...p, profileImage: reader.result as string } });
      toast.success("Profile photo updated");
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    set({ profile: { ...p, profileImage: null } });
    toast("Photo removed");
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 pb-24 md:pb-10 space-y-6">
      {/* Hero banner with inline avatar upload */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary blur-[80px] opacity-10 pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with camera overlay — clicking opens file picker */}
          <div className="relative group shrink-0">
            <ProfileAvatar image={p.profileImage} firstName={p.firstName} lastName={p.lastName} size="lg" />
            {/* Camera overlay button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Change profile photo"
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="size-5 text-white" />
            </button>
            {/* Small camera badge always visible */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary text-primary-foreground grid place-items-center ring-2 ring-background hover:bg-primary/90 transition-colors"
            >
              <Camera className="size-3.5" />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>

          {/* Name, email, badges */}
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
            {/* Photo actions — only shown when a photo exists or as a subtle hint */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                {p.profileImage ? "Change photo" : "Upload photo"}
              </button>
              {p.profileImage && (
                <>
                  <span className="text-border">·</span>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs text-destructive/70 hover:text-destructive transition-colors underline underline-offset-2"
                  >
                    <Trash2 className="size-3 inline mr-1" />
                    Remove
                  </button>
                </>
              )}
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

      {/* Account details */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Account details</div>
        <EditProfileForm />
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
              return (
                l && (
                  <Badge key={id} className="bg-primary/15 text-primary border-primary/30">
                    <CheckCircle2 className="size-3 mr-1" /> {l.title}
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

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border p-4 flex flex-col gap-2 relative overflow-hidden",
        accent && "border-primary/30",
      )}
    >
      {accent && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-primary" />}
      <div
        className={cn(
          "size-8 rounded-lg grid place-items-center",
          accent ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">{label}</div>
      <div className="text-2xl font-bold leading-none">{value}</div>
    </div>
  );
}
