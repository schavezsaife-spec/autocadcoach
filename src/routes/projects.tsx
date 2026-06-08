import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { projects } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import { GuestGate } from "@/components/coach/GuestGate";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — AutoCAD Coach" }] }),
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
  const isAuthed = state.profile.isAuthenticated;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">Apply what you've learned with hands-on builds.</p>
      </header>
      <GuestGate isAuthenticated={isAuthed}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {projects.map((p) => {
          const done = state.completedProjects.includes(p.id);
          return (
            <Link
              key={p.id}
              to="/projects/$id"
              params={{ id: p.id }}
              className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-0.5"
            >
              <img src={p.image} alt={p.title} className="w-full h-36 sm:h-40 object-cover" />
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-primary/30 text-primary">{p.difficulty}</Badge>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="size-3" /> {p.time}
                  </div>
                </div>
                <div className="mt-3 font-semibold">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</div>
                {done && (
                  <Badge className="mt-3 bg-primary/20 text-primary border-primary/30">
                    <CheckCircle2 className="size-3 mr-1" /> Built
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      </GuestGate>
    </div>
  );
}