import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/coach/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getSafeInternalRedirect, POST_AUTH_KEY } from "@/lib/access-config";
import i18n from "@/lib/i18n";

export const Route = createFileRoute("/auth_/callback")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:authTitle") },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthCallbackPage,
});

/**
 * OAuth / email-confirmation landing page. Supabase writes the session from
 * the URL fragment asynchronously, so we wait for `loading` to settle and for
 * a session to appear before sending the user into the app.
 */
function AuthCallbackPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(["auth", "common"]);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (session?.user) {
      const stored = typeof window !== "undefined" ? sessionStorage.getItem(POST_AUTH_KEY) : null;
      if (typeof window !== "undefined") sessionStorage.removeItem(POST_AUTH_KEY);
      navigate({ to: getSafeInternalRedirect(stored) as "/dashboard", replace: true });
      return;
    }
    // No session yet — give Supabase a moment to parse the URL fragment.
    const handle = setTimeout(() => setTimedOut(true), 4000);
    return () => clearTimeout(handle);
  }, [loading, session, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <Logo size="md" />
        </div>
        <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-8 shadow-[var(--shadow-glow)]">
          {timedOut ? (
            <>
              <AlertCircle className="size-6 mx-auto text-destructive" aria-hidden />
              <h1 className="mt-3 text-lg font-semibold">{t("auth:callbackFailedTitle")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("auth:callbackFailedBody")}</p>
              <Button
                className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate({ to: "/auth", replace: true })}
              >
                {t("auth:backToSignIn")}
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="size-6 mx-auto animate-spin text-primary" aria-hidden />
              <h1 className="mt-3 text-lg font-semibold">{t("auth:callbackTitle")}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("auth:callbackBody")}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
