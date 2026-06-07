import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { projects } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import { useAuthGuard } from "@/lib/use-auth-guard";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — AutoCAD Coach" }] }),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const authed = useAuthGuard();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!authed) return null;
  const isList = pathname === "/projects" || pathname === "/projects/";
  if (!isList) return <Outlet />;
  return <ProjectList />;
}

function ProjectList() {
  const { state } = useCoach();
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">Apply what you've learned with hands-on builds.</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => {
          const done = state.completedProjects.includes(p.id);
          return (
            <Link
              key={p.id}
              to="/projects/$id"
              params={{ id: p.id }}
              className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-all hover:-translate-y-0.5"
            >
              <img src={p.image} alt={p.title} className="w-full h-40 object-cover" />
              <div className="p-5">
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
    </div>
  );
}