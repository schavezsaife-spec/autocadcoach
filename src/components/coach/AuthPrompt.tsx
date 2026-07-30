import { Link } from "@tanstack/react-router";
import { Sparkles, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { GUEST_ACCESS_LIMITS } from "@/lib/access-config";
import { cn } from "@/lib/utils";

/**
 * Compact, non-blocking banner shown to signed-out visitors on public
 * educational pages. It never hides or disables the content underneath.
 */
export function GuestBanner({ className }: { className?: string }) {
  const { t } = useTranslation("gate");
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center gap-3",
        className,
      )}
      role="note"
    >
      <div className="flex items-start gap-2 min-w-0 flex-1">
        <Sparkles className="size-4 text-primary mt-0.5 shrink-0" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm min-w-0">
            <span className="font-semibold">{t("guestBannerTitle")}</span>{" "}
            <span className="text-muted-foreground">
              {t("guestBannerMessage", {
                lessons: GUEST_ACCESS_LIMITS.lessons,
                projects: GUEST_ACCESS_LIMITS.projects,
              })}
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("lessonsAvailable", { count: GUEST_ACCESS_LIMITS.lessons })} ·{" "}
            {t("projectsAvailable", { count: GUEST_ACCESS_LIMITS.projects })}
          </p>
        </div>
      </div>
      <Button asChild size="sm" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
        <Link to="/auth">
          <LogIn className="size-4 mr-1.5" aria-hidden /> {t("signUpForFree")}
        </Link>
      </Button>
    </div>
  );
}

/**
 * Inline sign-up card rendered next to a restricted, state-changing action.
 * Content is never blurred — only the action itself is unavailable.
 */
export function AuthRequiredAction({
  isAuthenticated,
  message,
  children,
  className,
  redirectTo,
}: {
  isAuthenticated: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
  redirectTo?: string;
}) {
  const { t } = useTranslation("gate");
  if (isAuthenticated) return <>{children}</>;
  return (
    <div className={cn("rounded-2xl border border-border bg-card/60 p-4 flex flex-col sm:flex-row sm:items-center gap-3", className)}>
      <p className="text-sm text-muted-foreground min-w-0 flex-1">{message ?? t("saveProgressMessage")}</p>
      <Button asChild size="sm" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
        <Link to="/auth" search={redirectTo ? { redirect: redirectTo } : undefined}>
          <LogIn className="size-4 mr-1.5" aria-hidden /> {t("signUpForFree")}
        </Link>
      </Button>
    </div>
  );
}
