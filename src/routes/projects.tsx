import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { projects } from "@/lib/coach-data";
import { useLocalizedProjects } from "@/lib/i18n/content";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useCoach } from "@/lib/coach-store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, Lock, Search } from "lucide-react";
import { GuestBanner } from "@/components/coach/AuthPrompt";
import { canGuestAccessProject, getProjectIndex } from "@/lib/access-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:projectsTitle") },
      { name: "description", content: i18n.t("meta:projectsDesc") },
      { property: "og:title", content: i18n.t("meta:projectsTitle") },
      { property: "og:description", content: i18n.t("meta:projectsDesc") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/projects" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/projects" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AutoCAD Coach Projects",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: projects.length,
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://autocadcoach.lovable.app/projects/${p.id}`,
            name: p.title,
          })),
        }),
      },
    ],
  }),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isList = pathname === "/projects" || pathname === "/projects/";
  if (!isList) return <Outlet />;
  return <ProjectList />;
}

function ProjectList() {
  const { state } = useCoach();
  const { t } = useTranslation(["projects", "common", "gate"]);
  const localized = useLocalizedProjects();
  const isAuthed = state.profile.isAuthenticated;

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | "Beginner" | "Easy" | "Medium">("All");
  const [sort, setSort] = useState<"default" | "time-asc" | "time-desc" | "alpha">("default");

  const filtered = useMemo(() => {
    let result = localized.filter((p) => {
      const qLower = q.toLowerCase();
      if (qLower) {
        const haystack = `${p.title} ${p.description} ${p.skills.join(" ")}`.toLowerCase();
        if (!haystack.includes(qLower)) return false;
      }
      if (difficulty !== "All" && p.difficulty !== difficulty) return false;
      return true;
    });

    if (sort === "time-asc") {
      result = [...result].sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));
    } else if (sort === "time-desc") {
      result = [...result].sort((a, b) => parseInt(b.time, 10) - parseInt(a.time, 10));
    } else if (sort === "alpha") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [q, difficulty, sort, localized]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {!isAuthed && <GuestBanner className="mb-6" />}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("projects:searchPlaceholder")}
                aria-label={t("projects:searchPlaceholder")}
                className="pl-9 bg-card border-border"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label={t("projects:sortDefault")}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
            >
              <option value="default">{t("projects:sortDefault")}</option>
              <option value="alpha">{t("projects:sortAlpha")}</option>
              <option value="time-asc">{t("projects:sortTimeAsc")}</option>
              <option value="time-desc">{t("projects:sortTimeDesc")}</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["All", "Beginner", "Easy", "Medium"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  difficulty === d
                    ? "bg-gradient-to-r from-primary to-success text-primary-foreground shadow-[0_0_16px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                    : "bg-card border border-primary/25 text-muted-foreground hover:text-foreground hover:border-primary/50"
                )}
              >
                {t(`projects:difficulty.${d}`)}
              </button>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">{t("projects:countLabel", { count: filtered.length })}</div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Search className="size-8 text-muted-foreground" />
            <p className="font-medium">{t("projects:noMatch")}</p>
            <button
              onClick={() => {
                setQ("");
                setDifficulty("All");
                setSort("default");
              }}
              className="text-primary text-sm underline"
            >
              {t("projects:clearFilters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((p) => {
              const done = isAuthed && state.completedProjects.includes(p.id);
              const guestFree = !isAuthed && canGuestAccessProject(getProjectIndex(p.id));
              const guestRestricted = !isAuthed && !guestFree;
              return (
                <Link
                  key={p.id}
                  to="/projects/$id"
                  params={{ id: p.id }}
                  className="rounded-2xl bg-card overflow-hidden border border-primary/25 ring-1 ring-primary/10 shadow-[0_0_24px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
                >
                  <img
                    src={p.coverImage ?? p.image}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={450}
                    className={cn("w-full h-36 sm:h-40 object-cover", guestRestricted && "blur-sm opacity-70")}
                  />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-primary/30 text-primary">{t(`projects:difficulty.${p.difficulty}`)}</Badge>
                      <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="size-3" /> {p.time}
                      </div>
                    </div>
                    <div className="mt-3 font-semibold">{p.title}</div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</div>
                    {guestFree && (
                      <Badge className="mt-3 bg-primary/15 text-primary border-primary/30">{t("gate:freePreview")}</Badge>
                    )}
                    {guestRestricted && (
                      <Badge variant="outline" className="mt-3 text-muted-foreground/80 border-dashed">
                        <Lock className="size-3 mr-1" /> {t("gate:accountRequired")}
                      </Badge>
                    )}
                    {done && (
                      <Badge className="mt-3 bg-success/20 text-success border-success/30">
                        <CheckCircle2 className="size-3 mr-1" /> {t("projects:built")}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
    </div>
  );
}