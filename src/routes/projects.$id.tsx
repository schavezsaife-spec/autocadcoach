import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { projects } from "@/lib/coach-data";
import { useLocalizedProject } from "@/lib/i18n/content";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useCoach } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/coach/Lightbox";
import { ScreenshotCard } from "@/components/coach/ScreenshotCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLessonImages } from "@/lib/lesson-images";
import { ArrowLeft, CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";
import { GuestGate } from "@/components/coach/GuestGate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/$id")({
  validateSearch: (search: Record<string, unknown>) => {
    const from = search.from;
    return { from: from === "projects" ? from : undefined };
  },
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
                image: project.image,
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
  const { state, completeProject, resetProject } = useCoach();
  const { t } = useTranslation(["projects", "common"]);
  const [lightbox, setLightbox] = useState(false);
  const isAuthed = state.profile.isAuthenticated;
  const project = useLocalizedProject(id);
  const projectImageKey = `project:${id}`;
  const uploaded = useLessonImages(projectImageKey);
  const finalUrl = uploaded.final;

  if (!project) {
    return (
      <div className="p-10">
        {t("projects:notFound")} <Link to="/projects" className="text-primary underline">{t("projects:backToProjects")}</Link>
      </div>
    );
  }

  const done = state.completedProjects.includes(project.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/30 text-primary">{t(`projects:difficulty.${project.difficulty}`)}</Badge>
        <Badge variant="outline" className="border-border"><Clock className="size-3 mr-1" /> {project.time}</Badge>
        {done && <Badge className="bg-success/20 text-success border-success/30"><CheckCircle2 className="size-3 mr-1" /> {t("projects:built")}</Badge>}
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h1>
      <p className="text-muted-foreground">{project.description}</p>

      <GuestGate isAuthenticated={isAuthed}>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">{t("projects:tabs.details")}</TabsTrigger>
          <TabsTrigger value="final">{t("projects:tabs.final")}</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 mt-0">
          <button onClick={() => setLightbox(true)} className="block w-full rounded-2xl overflow-hidden border border-border group">
            <img src={project.image} alt={t("projects:referenceAlt", { title: project.title })} loading="lazy" decoding="async" width={1200} height={800} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
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

          <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => { completeProject(project.id); toast.success(t("projects:markedComplete", { title: project.title })); }}
          className={cn(
            "w-full sm:w-auto",
            done
              ? "bg-success text-success-foreground hover:bg-success/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          <CheckCircle2 className="size-4 mr-1" /> {t("common:markComplete")}
        </Button>
        {done && (
          <Button variant="outline" onClick={() => resetProject(project.id)} className="w-full sm:w-auto">
            <RotateCcw className="size-4 mr-1" /> {t("common:reset")}
          </Button>
        )}
      </div>
        </TabsContent>
        <TabsContent value="final" className="mt-0">
          <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 space-y-3">
            <div className="font-semibold">{t("projects:tabs.final")}</div>
            <ScreenshotCard
              src={finalUrl}
              alt={t("projects:finalResultAlt", { title: project.title })}
              lessonId={projectImageKey}
              slot="final"
              uploadable
            />
            {!finalUrl && (
              <p className="text-sm text-muted-foreground">
                {t("projects:uploadFinalPrompt")}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      </GuestGate>

      {lightbox && (
        <Lightbox src={project.image} alt={project.title} onClose={() => setLightbox(false)} />
      )}
    </div>
  );
}