import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Logo } from "@/components/coach/Logo";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:forgotTitle") },
      { name: "description", content: i18n.t("meta:forgotDesc") },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: i18n.t("meta:forgotTitle") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/forgot-password" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/forgot-password" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useTranslation(["auth", "common"]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("auth:errInvalidEmail"));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success(t("auth:toastResetLinkSent"));
    } catch (err) {
      const m = err instanceof Error ? err.message : t("auth:errResetFailed");
      setError(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-70" style={{ background: "var(--gradient-hero)" }} aria-hidden />
      <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden />

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-6 sm:p-8 shadow-[var(--shadow-glow)]">
          <h1 className="text-2xl font-bold tracking-tight">{t("auth:resetTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("auth:resetSubtitle")}</p>

          {sent ? (
            <div className="mt-6 rounded-lg border border-success/30 bg-success/10 p-4 text-sm">
              <div className="flex items-start gap-2 text-success">
                <CheckCircle2 className="size-4 mt-0.5" />
                <div>
                  <div className="font-medium">{t("auth:resetSent")}</div>
                  <p className="text-muted-foreground mt-1">{t("auth:resetSentBody", { email })}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="size-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("auth:emailAddress")}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-secondary border-border"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                {t("auth:sendResetLink")}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link to="/auth" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3.5" /> {t("auth:backToSignIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}