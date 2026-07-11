import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCoach } from "@/lib/coach-store";
import { supabase } from "@/lib/supabase";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/components/coach/Logo";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

/**
 * Setup checklist for the developer:
 *
 * 1. Configure Supabase env vars in `.env` (auto-filled by Lovable Cloud):
 *      VITE_SUPABASE_URL=
 *      VITE_SUPABASE_ANON_KEY=        (a.k.a. VITE_SUPABASE_PUBLISHABLE_KEY)
 *
 * 2. Enable Google in the Backend dashboard:
 *      Authentication → Providers → Google → enabled
 *    Lovable Cloud ships managed Google OAuth credentials out of the box,
 *    so no client ID / secret is required for development. To use your own
 *    Google credentials, override them under Auth Settings → Sign In Methods.
 */

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:authTitle") },
      { name: "description", content: i18n.t("meta:authDesc") },
      { property: "og:title", content: i18n.t("meta:authTitle") },
      { property: "og:description", content: i18n.t("meta:authDesc") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/auth" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/auth" }],
  }),
  component: AuthPage,
});

type Mode = "signup" | "signin";

function AuthPage() {
  const { state } = useCoach();
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If the user is already signed in (e.g. after a Google redirect), send them on.
  useEffect(() => {
    if (state.profile.isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [state.profile.isAuthenticated, navigate]);

  function emailValid(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (mode === "signup" && !firstName.trim()) {
      setErrorMsg(t("auth:errFirstNameRequired"));
      return;
    }
    if (!emailValid(email)) {
      setErrorMsg(t("auth:errInvalidEmail"));
      return;
    }
    if (password.length < 6) {
      setErrorMsg(t("auth:errPasswordShort"));
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success(t("auth:toastAccountCreatedCheckEmail"));
          setMode("signin");
          setPassword("");
          return;
        }
        toast.success(t("auth:toastAccountCreated"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success(t("auth:toastWelcomeBack"));
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth:errAuthFailed");
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      // Lovable Cloud's managed Google OAuth broker.
      // It calls supabase.auth.signInWithOAuth({ provider: "google" })
      // under the hood and then sets the Supabase session for us.
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return; // browser is navigating to Google
      toast.success(t("auth:toastSignedInGoogle"));
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("auth:errGoogleFailed");
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-6 sm:p-8 shadow-[var(--shadow-glow)]">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signup" ? t("auth:createAccount") : t("auth:signInTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup" ? t("auth:signUpSubtitle") : t("auth:signInSubtitle")}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="mt-6 w-full border-border bg-secondary hover:bg-secondary/80"
          >
            {googleLoading ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <GoogleIcon className="size-4 mr-2" />
            )}
            {t("auth:continueWithGoogle")}
          </Button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              {t("auth:or")} {mode === "signup" ? t("auth:createAccount") : t("auth:signInTitle")}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">{t("auth:firstName")}</Label>
                  <Input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t("auth:firstName")}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">{t("auth:lastName")}</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t("auth:lastName")}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("auth:email")}</Label>
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
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth:password")}</Label>
                {mode === "signin" && (
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    {t("auth:forgotPassword")}
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 grid place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? t("common:hidePassword") : t("common:showPassword")}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]"
            >
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === "signup" ? t("auth:createAccount") : t("auth:signInTitle")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? t("auth:haveAccount") : t("auth:noAccount")}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "signup" ? t("auth:signInTitle") : t("auth:createAccount")}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} AutoCAD Coach
        </p>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41 35.6 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}