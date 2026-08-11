import { useTranslation } from "react-i18next";
import { Lock, CheckCircle2, Sparkles, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocalizedLessons } from "@/lib/i18n/content";
import type { ProjectUnlockState } from "@/lib/project-unlocks";
import { cn } from "@/lib/utils";

export function useLessonTitles(): (ids: string[]) => string[] {
  const lessons = useLocalizedLessons();
  return (ids) => ids.map((id) => lessons.find((l) => l.id === id)?.title ?? id);
}

/**
 * Reusable prerequisite checklist: shows the actual required lesson names with
 * a completed / not-completed marker. One source of truth for every surface.
 */
export function ProjectPrerequisites({
  requiredLessons,
  missingLessons,
  className,
}: {
  requiredLessons: string[];
  missingLessons: string[];
  className?: string;
}) {
  const { t } = useTranslation("projects");
  const titlesFor = useLessonTitles();
  if (requiredLessons.length === 0) return null;
  const titles = titlesFor(requiredLessons);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-xs font-medium text-muted-foreground">{t("requiredLessonsLabel")}</div>
      <ul className="space-y-0.5">
        {requiredLessons.map((id, i) => {
          const complete = !missingLessons.includes(id);
          return (
            <li key={id} className="flex items-center gap-1.5 text-xs leading-tight">
              {complete ? (
                <CheckCircle2 className="size-3 text-success shrink-0" aria-hidden />
              ) : (
                <Circle className="size-3 text-muted-foreground/70 shrink-0" aria-hidden />
              )}
              <span className={complete ? "text-foreground" : "text-muted-foreground"}>{titles[i]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export type ProjectStatus = "available" | "locked" | "newlyUnlocked" | "completed";

export function ProjectStatusBadge({ status, requiredXp }: { status: ProjectStatus; requiredXp?: number }) {
  const { t } = useTranslation("projects");
  if (status === "completed") {
    return (
      <Badge className="bg-success/20 text-success border-success/30">
        <CheckCircle2 className="size-3 mr-1" /> {t("status.completed")}
      </Badge>
    );
  }
  if (status === "newlyUnlocked") {
    return (
      <Badge className="bg-success/20 text-success border-success/30 animate-pulse">
        <Sparkles className="size-3 mr-1" /> {t("status.newlyUnlocked")}
      </Badge>
    );
  }
  if (status === "locked") {
    return (
      <Badge variant="outline" className="text-muted-foreground/80 border-dashed">
        <Lock className="size-3 mr-1" />
        {requiredXp ? t("lockedWithXp", { xp: requiredXp }) : t("status.locked")}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-primary/30 text-primary">
      {t("status.available")}
    </Badge>
  );
}

/**
 * XP progress bar + honest requirement messaging for an XP-gated project.
 * Never rendered for always-available projects.
 */
export function ProjectLockDetails({
  unlock,
  currentXp,
  className,
}: {
  unlock: ProjectUnlockState;
  currentXp: number;
  className?: string;
}) {
  const { t } = useTranslation("projects");
  if (unlock.alwaysAvailable || unlock.unlocked) return null;

  const pct = unlock.requiredXP > 0 ? Math.min(100, Math.round((currentXp / unlock.requiredXP) * 100)) : 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {t("xpProgress", { current: Math.min(currentXp, unlock.requiredXP), required: unlock.requiredXP })}
        </span>
        {!unlock.xpSatisfied ? (
          <span className="text-primary font-medium">{t("xpToUnlock", { count: unlock.xpRemaining })}</span>
        ) : (
          <span className="text-success font-medium inline-flex items-center gap-1">
            {t("xpRequirementComplete")} <CheckCircle2 className="size-3" />
          </span>
        )}
      </div>
      <Progress value={pct} className="h-1.5" trackClassName="bg-primary/15" indicatorClassName="bg-primary" />
      <ProjectPrerequisites requiredLessons={unlock.requiredLessons} missingLessons={unlock.missingLessons} />
      {unlock.lessonsSatisfied && unlock.requiredLessons.length > 0 && (
        <p className="text-xs text-success font-medium inline-flex items-center gap-1">
          {t("lessonRequirementsComplete")} <CheckCircle2 className="size-3" />
        </p>
      )}
    </div>
  );
}
