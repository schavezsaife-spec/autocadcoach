import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { projects } from "@/lib/coach-data";
import { useLocalizedProject, useLocalizedLessonImages, useActiveLanguage } from "@/lib/i18n/content";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useCoach } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/coach/Lightbox";
import { ScreenshotCard } from "@/components/coach/ScreenshotCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getLocalizedImageSlot } from "@/lib/lesson-images";
import { CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";
import { GuestBanner, AuthRequiredAction } from "@/components/coach/AuthPrompt";
import { GuestContentGate } from "@/components/coach/GuestContentGate";
import { isProjectRestrictedForGuest } from "@/lib/access-config";
import { useProjectUnlocks } from "@/lib/use-project-unlocks";
import { ProjectLockDetails, ProjectStatusBadge } from "@/components/coach/ProjectUnlockStatus";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/$id")({
  head: ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    const url = `https://autocadcoach.lovable.app/projects/${params.id}`;
    const title = project ? `${project.title} — AutoCAD Coach` : i18n.t("meta:projectFallbackTitle");
    const description = project?.description ?? i18n.t("meta:projectFallbackDesc");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: project
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: project.title,
                description: project.description,
                url,
                inLanguage: "en",
                totalTime: project.time,
                image: project.coverImage ?? project.image,
                tool: [
                  { "@type": "HowToTool", name: "AutoCAD" },
                  ...project.skills.map((s) => ({ "@type": "HowToTool", name: s })),
                ],
                step: project.steps.map((s, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  name: `Step ${i + 1}`,
                  text: s,
                })),
              }),
            },
          ]
        : [],
    };
  },
  component: ProjectViewer,
});

function ProjectViewer() {
  const { id } = Route.useParams();
  const { state, completeProject, resetProject, hydrated, totalXp } = useCoach();
  const { unlockStateFor } = useProjectUnlocks();
  const { t } = useTranslation(["projects", "common", "gate"]);
  const [lightbox, setLightbox] = useState(false);
  const isAuthed = state.profile.isAuthenticated;
  const project = useLocalizedProject(id);
  const restricted = isProjectRestrictedForGuest(id, isAuthed);
  const projectImageKey = `project:${id}`;
  const lang = useActiveLanguage();
  // Same localized resolution as lessons: Spanish upload → English upload.
  const uploaded = useLocalizedLessonImages(projectImageKey);
  const finalUrl = uploaded.final;

  // Never flash protected content before the session is known.
  if (!hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 animate-pulse">
        <div className="h-6 w-40 rounded-lg bg-card border border-border" />
        <div className="h-10 w-3/4 rounded-lg bg-card border border-border" />
        <div className="h-64 rounded-2xl bg-card border border-border" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10">
        {t("projects:notFound")} <Link to="/projects" className="text-primary underline">{t("projects:backToProjects")}</Link>
      </div>
    );
  }

  const done = isAuthed && state.completedProjects.includes(project.id);
  const coverSrc = project.coverImage ?? project.image;
  const unlock = unlockStateFor(project.id);
  // Server-independent access check: a signed-in user cannot reach a locked
  // project body just by typing the URL. Always-available projects are exempt.
  const xpLocked = isAuthed && !unlock.alwaysAvailable && !unlock.unlocked;

  if (xpLocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{project.title}</h1>
        <div className="rounded-2xl bg-card border border-dashed border-border p-6 space-y-4 text-center">
          <Lock className="size-8 text-primary mx-auto" aria-hidden />
          <div className="font-semibold">{t("projects:lockedPageTitle")}</div>
          <p className="text-sm text-muted-foreground">{t("projects:lockedPageBody")}</p>
          <ProjectLockDetails unlock={unlock} currentXp={totalXp} className="text-left max-w-sm mx-auto" />
          <Button asChild variant="outline">
            <Link to="/projects">{t("projects:backToProjects")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/30 text-primary">{t(`projects:difficulty.${project.difficulty}`)}</Badge>
        <Badge variant="outline" className="border-border"><Clock className="size-3 mr-1" /> {project.time}</Badge>
        {isAuthed && <ProjectStatusBadge status={done ? "completed" : "available"} />}
        {isAuthed && (
          <span className="text-xs text-muted-foreground">
            {done ? t("projects:rewardXpEarned", { xp: unlock.rewardXP }) : t("projects:rewardXp", { xp: unlock.rewardXP })}
          </span>
        )}
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h1>
      <p className="text-muted-foreground">{project.description}</p>

      {!isAuthed && !restricted && <GuestBanner />}

      {restricted ? (
        <>
          <div className="rounded-2xl bg-card border border-border p-4 sm:p-5">
            <div className="font-semibold mb-3">{t("projects:skillsPracticed")}</div>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s) => (
                <Badge key={s} variant="outline" className="border-primary/30 text-primary">{s}</Badge>
              ))}
            </div>
          </div>
          <GuestContentGate type="project" isRestricted backHref="/projects" redirectTo={`/projects/${project.id}`}>
            <div className="space-y-6 pt-2">
              <img
                src={coverSrc}
                alt=""
                loading="lazy"
                decoding="async"
                width={1200}
                height={800}
                className="w-full h-64 object-cover rounded-2xl border border-border"
              />
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-5">
                <div className="font-semibold mb-3">{t("projects:buildSteps")}</div>
                <ol className="space-y-2 text-sm">
                  {project.steps.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="size-6 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold shrink-0">{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 h-40" />
            </div>
          </GuestContentGate>
        </>
      ) : (
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">{t("projects:tabs.details")}</TabsTrigger>
          <TabsTrigger value="final">{t("projects:tabs.final")}</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 mt-0">
          <button onClick={() => setLightbox(true)} className="block w-full rounded-2xl overflow-hidden border border-border group">
            <img src={coverSrc} alt={t("projects:referenceAlt", { title: project.title })} loading="lazy" decoding="async" width={1200} height={800} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
      </button>

          <div className="rounded-2xl bg-card border border-border p-4 sm:p-5">
        <div className="font-semibold mb-3">{t("projects:skillsPracticed")}</div>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((s) => (
            <Badge key={s} variant="outline" className="border-primary/30 text-primary">{s}</Badge>
          ))}
        </div>
      </div>

          <div className="rounded-2xl bg-card border border-border p-4 sm:p-5">
        <div className="font-semibold mb-3">{t("projects:buildSteps")}</div>
        <ol className="space-y-2 text-sm">
          {project.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="size-6 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold shrink-0">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

          {isAuthed ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  if (done) {
                    // Already completed: never award the reward XP twice.
                    toast.success(t("projects:markedComplete", { title: project.title }));
                    return;
                  }
                  completeProject(project.id);
                  toast.success(t("projects:completeToastXp", { title: project.title, xp: unlock.rewardXP }));
                }}
                className={cn(
                  "w-full sm:w-auto",
                  done
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                <CheckCircle2 className="size-4 mr-1" /> {t("projects:markProjectComplete")}
              </Button>
              {done && (
                <Button variant="outline" onClick={() => resetProject(project.id)} className="w-full sm:w-auto">
                  <RotateCcw className="size-4 mr-1" /> {t("common:reset")}
                </Button>
              )}
            </div>
          ) : (
            <AuthRequiredAction isAuthenticated={false} message={t("gate:projectCompleteMessage")} redirectTo={`/projects/${project.id}`}>
              {null}
            </AuthRequiredAction>
          )}
        </TabsContent>
        <TabsContent value="final" className="mt-0">
          <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 space-y-3">
            <div className="font-semibold">{t("projects:tabs.final")}</div>
            <ScreenshotCard
              src={finalUrl}
              alt={t("projects:finalResultAlt", { title: project.title })}
              lessonId={projectImageKey}
              slot={getLocalizedImageSlot("final", lang)}
              uploadable={isAuthed}
            />
            {!isAuthed && (
              <AuthRequiredAction isAuthenticated={false} message={t("gate:uploadMessage")} redirectTo={`/projects/${project.id}`}>
                {null}
              </AuthRequiredAction>
            )}
            {!finalUrl && (
              <p className="text-sm text-muted-foreground">
                {t("projects:uploadFinalPrompt")}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      )}

      {lightbox && !restricted && (
        <Lightbox src={coverSrc} alt={project.title} onClose={() => setLightbox(false)} />
      )}
    </div>
  );
}