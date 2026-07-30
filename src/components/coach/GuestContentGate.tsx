import { Link } from "@tanstack/react-router";
import { Lock, LogIn, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { GUEST_ACCESS_LIMITS } from "@/lib/access-config";
import { cn } from "@/lib/utils";

export type GuestContentGateProps = {
  type: "lesson" | "project";
  children: React.ReactNode;
  isRestricted: boolean;
  /** Where "back to free lessons/projects" points. */
  backHref: "/lessons" | "/projects";
  /** In-app path to return to after signing up / signing in. */
  redirectTo?: string;
  className?: string;
};

/**
 * Wraps the protected region of a lesson/project detail page. When the visitor
 * is allowed in, children render untouched. When restricted, children are
 * blurred, made non-interactive and hidden from assistive tech, and a readable
 * sign-up card is placed over them.
 *
 * Blur is presentation only — callers must also avoid mounting protected
 * actions (uploads, quizzes, completion, lightboxes) for restricted guests.
 */
export function GuestContentGate({
  type,
  children,
  isRestricted,
  backHref,
  redirectTo,
  className,
}: GuestContentGateProps) {
  if (!isRestricted) return <>{children}</>;

  return (
    <section className={cn("relative", className)}>
      <div
        className="pointer-events-none select-none blur-md opacity-60 transition"
        aria-hidden="true"
        // Keep restricted content out of the tab order entirely.
        inert
      >
        {children}
      </div>

      <div className="absolute inset-x-0 top-4 sm:top-8 z-10 flex justify-center px-3 sm:px-4">
        <SignupGateCard type={type} backHref={backHref} redirectTo={redirectTo} />
      </div>
    </section>
  );
}

export function SignupGateCard({
  type,
  backHref,
  redirectTo,
}: {
  type: "lesson" | "project";
  backHref: "/lessons" | "/projects";
  redirectTo?: string;
}) {
  const { t } = useTranslation("gate");
  const search = redirectTo ? { redirect: redirectTo } : undefined;
  const limit = type === "lesson" ? GUEST_ACCESS_LIMITS.lessons : GUEST_ACCESS_LIMITS.projects;

  return (
    <div className="w-full max-w-md rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-sm p-5 sm:p-6 text-center shadow-[0_0_40px_-12px_color-mix(in_oklab,var(--primary)_70%,transparent)]">
      <div className="mx-auto size-11 rounded-xl grid place-items-center bg-gradient-to-br from-primary/25 to-success/20 text-primary ring-1 ring-primary/30">
        <Lock className="size-5" aria-hidden />
      </div>
      <h2 className="mt-3 text-lg sm:text-xl font-bold tracking-tight">
        {t(type === "lesson" ? "lessonGateHeading" : "projectGateHeading")}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t(type === "lesson" ? "lessonGateBody" : "projectGateBody", { count: limit })}
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link to="/auth" search={search}>
            <Sparkles className="size-4 mr-1.5" aria-hidden /> {t("signUpForFree")}
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-border">
          <Link to="/auth" search={search}>
            <LogIn className="size-4 mr-1.5" aria-hidden /> {t("signIn")}
          </Link>
        </Button>
      </div>
      <Link
        to={backHref}
        className="mt-4 inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        {t(type === "lesson" ? "backToFreeLessons" : "backToFreeProjects")}
      </Link>
    </div>
  );
}