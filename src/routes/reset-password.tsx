import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/coach/Logo";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:resetTitle") },
      { name: "description", content: i18n.t("meta:resetDesc") },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: i18n.t("meta:resetTitle") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/reset-password" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/reset-password" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The form only opens when this page was reached via a genuine recovery
  // link: a PASSWORD_RECOVERY auth event, a hash token (type=recovery), or a
  // PKCE ?code= parameter. A plain signed-in user landing here is sent to
  // /profile instead; anyone else sees the "link invalid" state.
  useEffect(() => {
    let cancelled = false;
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const hash = window.location.hash;
    const hasRecoveryToken = hash.includes("type=recovery") || hash.includes("access_token");

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session && hasRecoveryToken)) {
        setReady(true);
      }
    });

    (async () => {
      if (code) {
        // PKCE recovery link: exchange the code for a recovery session.
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) setInvalid(true);
        else setReady(true);
        return;
      }
      if (hasRecoveryToken) {
        // Hash-token link: the client exchanges it automatically; the event
        // listener above flips `ready`. getSession covers the already-done case.
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session) setReady(true);
        return;
      }
      // No recovery hint in the URL at all.
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        navigate({ to: "/profile", replace: true });
      } else {
        setInvalid(true);
      }
    })();

    // If no recovery session materialises the link was bad or expired.
    const timer = setTimeout(() => {
      if (cancelled) return;
      setReady((r) => {
        if (!r) setInvalid(true);
        return r;
      });
    }, 6000);
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 6) {
      setError(t("auth:errPasswordShort"));
      return;
    }
    if (pw !== confirm) {
      setError(t("auth:errPasswordsMismatch"));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      toast.success(t("auth:toastPasswordUpdated"));
      // Force a fresh sign-in with the new password.
      await supabase.auth.signOut();
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      console.error("[auth] password update failed", err);
      const m = t("auth:errUpdateFailed");
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
          <h1 className="text-2xl font-bold tracking-tight">{t("auth:chooseNewPassword")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("auth:chooseNewPasswordSubtitle")}</p>

          {invalid && !ready ? (
            <div className="mt-6 space-y-4">
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{t("auth:resetLinkInvalid")}</span>
              </div>
              <Button
                type="button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate({ to: "/forgot-password" })}
              >
                {t("auth:requestNewLink")}
              </Button>
            </div>
          ) : !ready ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> {t("auth:verifyingLink")}
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
                <Label htmlFor="pw">{t("auth:newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="pw"
                    type={show ? "text" : "password"}
                    required
                    minLength={6}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="••••••••"
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
              <div className="space-y-1.5">
                <Label htmlFor="confirm">{t("auth:confirmNewPassword")}</Label>
                <Input
                  id="confirm"
                  type={show ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary border-border"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                {t("auth:updatePassword")}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center text-sm">
            <Link to="/auth" className="text-muted-foreground hover:text-foreground">{t("auth:backToSignIn")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
