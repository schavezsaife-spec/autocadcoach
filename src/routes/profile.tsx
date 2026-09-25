import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCoach } from "@/lib/coach-store";
import { useAuth } from "@/lib/auth-context";
import { lessons, projects } from "@/lib/coach-data";
import { Trophy, Flame, BookOpen, Wrench, Target, CheckCircle2, Camera, Trash2, AlertTriangle, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/components/coach/ProfileAvatar";
import { EditProfileForm } from "@/components/coach/EditProfileForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:profileTitle") },
      { name: "description", content: i18n.t("meta:profileDesc") },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: i18n.t("meta:profileTitle") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/profile" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/profile" }],
  }),
  component: ProfilePage,
});

const MAX_BYTES = 2 * 1024 * 1024; // 2MB

function ProfilePage() {
  const { state, set, totalXp, progressPct, hydrated, signOut } = useCoach();
  const { t } = useTranslation(["profile", "common", "nav"]);
  const navigate = useNavigate();
  const p = state.profile;
  const inputRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

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
      toast.error(t("profile:errPhotoImageOnly"));
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(t("profile:errPhotoTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set({ profile: { ...p, profileImage: reader.result as string } });
      toast.success(t("profile:photoUpdated"));
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    set({ profile: { ...p, profileImage: null } });
    toast(t("profile:photoRemoved"));
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try {
      const { error } = await supabase.rpc("delete_account");
      if (error) throw error;
      await signOut();
      toast.success(t("profile:accountDeleted"));
      navigate({ to: "/" });
    } catch {
      toast.error(t("profile:deleteFailed"));
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteInput("");
    }
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
              aria-label={t("profile:changeProfilePhotoAria")}
              className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="size-5 text-white" />
            </button>
            {/* Small camera badge always visible */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={t("profile:changeProfilePhotoAria")}
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
              {`${p.firstName} ${p.lastName}`.trim() || t("nav:defaultLearner")}
            </h1>
            <div className="text-sm text-muted-foreground truncate mt-0.5">{p.email}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success border border-success/30 px-3 py-1 text-xs font-semibold">
                <Trophy className="size-3" /> {t("profile:xpEarned", { xp: totalXp })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Flame className="size-3 text-success" /> {t("profile:dayStreak", { count: state.streak })}
              </span>
            </div>
            {/* Photo actions — only shown when a photo exists or as a subtle hint */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                {p.profileImage ? t("profile:changePhoto") : t("profile:uploadPhoto")}
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
                    {t("profile:removePhoto")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label={t("profile:totalXp")} value={totalXp} icon={Trophy} accent />
        <StatCard label={t("profile:lessons")} value={`${state.completedLessons.length}/${lessons.length}`} icon={BookOpen} />
        <StatCard label={t("profile:projects")} value={`${completedProjectsCount}/${projects.length}`} icon={Wrench} />
        <StatCard label={t("profile:progress")} value={`${progressPct}%`} icon={Target} />
      </div>

      {/* Account details */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">{t("profile:accountDetails")}</div>
        <EditProfileForm />
      </div>

      {/* Change password (email/password users only) */}
      <ChangePasswordCard />

      {/* Completed lessons */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">{t("profile:completedLessons")}</div>
          <span className="text-xs bg-success/15 text-success border border-success/30 rounded-full px-2.5 py-0.5 font-semibold">
            {state.completedLessons.length} / {lessons.length}
          </span>
        </div>
        {state.completedLessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("profile:nothingYet")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {state.completedLessons.map((id) => {
              const l = lessons.find((x) => x.id === id);
              return (
                l && (
                  <Badge key={id} className="bg-success/15 text-success border-success/30">
                    <CheckCircle2 className="size-3 mr-1" /> {l.title}
                  </Badge>
                )
              );
            })}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-destructive">{t("profile:deleteAccount")}</div>
          <p className="text-sm text-muted-foreground mt-1">{t("profile:deleteAccountBody")}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2 text-sm font-medium transition-colors"
        >
          <Trash2 className="size-4" />
          {t("profile:deleteAccount")}
        </button>
      </div>

      {/* Delete account confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="size-10 shrink-0 rounded-full bg-destructive/15 text-destructive grid place-items-center">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold">{t("profile:deleteConfirmTitle")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("profile:deleteConfirmSubtitle")}</p>
              </div>
            </div>

            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• {t("profile:deleteBullet1")}</li>
              <li>• {t("profile:deleteBullet2")}</li>
              <li>• {t("profile:deleteBullet3")}</li>
            </ul>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("profile:typeDeleteToConfirm")}</label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder={t("profile:typeDeleteHere")}
                className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowDeleteModal(false); setDeleteInput(""); }}
                disabled={deleting}
                className="flex-1 rounded-lg border border-border bg-card hover:bg-accent px-4 py-2 text-sm font-medium transition-colors"
              >
                {t("common:cancel")}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteInput !== "DELETE"}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium transition-colors"
              >
                {deleting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("profile:deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    {t("profile:deleteMyAccount")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangePasswordCard() {
  const { t } = useTranslation(["profile", "auth", "common"]);
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  // Only email/password accounts can change a password here; OAuth-only users
  // (e.g. Google) manage credentials with their provider.
  const isEmailUser =
    user?.app_metadata?.provider === "email" ||
    (user?.identities ?? []).some((id) => id.provider === "email");
  if (!user?.email || !isEmailUser) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) {
      toast.error(t("auth:errPasswordShort"));
      return;
    }
    if (next !== confirm) {
      toast.error(t("auth:errPasswordsMismatch"));
      return;
    }
    setSaving(true);
    try {
      // Verify the current password before allowing the change.
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user!.email!,
        password: current,
      });
      if (verifyError) {
        toast.error(t("profile:errCurrentPasswordWrong"));
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) throw error;
      toast.success(t("profile:passwordChanged"));
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      console.error("[profile] password change failed", err);
      toast.error(t("profile:passwordChangeFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center gap-2 font-semibold mb-1">
        <KeyRound className="size-4 text-primary" />
        {t("profile:changePassword")}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{t("profile:changePasswordBody")}</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentPw">{t("profile:currentPassword")}</Label>
          <div className="relative">
            <Input
              id="currentPw"
              type={show ? "text" : "password"}
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
              className="bg-secondary border-border pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-0 px-3 grid place-items-center text-muted-foreground hover:text-foreground"
              aria-label={show ? t("common:hidePassword") : t("common:showPassword")}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="newPw">{t("auth:newPassword")}</Label>
            <Input
              id="newPw"
              type={show ? "text" : "password"}
              required
              minLength={6}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPw">{t("auth:confirmNewPassword")}</Label>
            <Input
              id="confirmPw"
              type={show ? "text" : "password"}
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="bg-secondary border-border"
            />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
          {t("profile:changePassword")}
        </Button>
      </form>
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
        accent && "border-success/30",
      )}
    >
      {accent && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-success" />}
      <div
        className={cn(
          "size-8 rounded-lg grid place-items-center",
          accent ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">{label}</div>
      <div className="text-2xl font-bold leading-none">{value}</div>
    </div>
  );
}
