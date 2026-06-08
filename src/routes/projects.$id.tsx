import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { projects } from "@/lib/coach-data";
import { useCoach } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/coach/Lightbox";
import { CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { toast } from "sonner";
import { GuestGate } from "@/components/coach/GuestGate";

export const Route = createFileRoute("/projects/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${projects.find((p) => p.id === params.id)?.title ?? "Project"} — AutoCAD Coach` }],
  }),
  component: ProjectViewer,
});

function ProjectViewer() {
  const { id } = Route.useParams();
  const { state, completeProject, resetProject } = useCoach();
  const [lightbox, setLightbox] = useState(false);
  const isAuthed = state.profile.isAuthenticated;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="p-10">
        Project not found. <Link to="/projects" className="text-primary underline">Back</Link>
      </div>
    );
  }

  const done = state.completedProjects.includes(project.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-primary/30 text-primary">{project.difficulty}</Badge>
        <Badge variant="outline" className="border-border"><Clock className="size-3 mr-1" /> {project.time}</Badge>
        {done && <Badge className="bg-primary/20 text-primary border-primary/30"><CheckCircle2 className="size-3 mr-1" /> Built</Badge>}
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h1>
      <p className="text-muted-foreground">{project.description}</p>

      <GuestGate isAuthenticated={isAuthed}>
      <button onClick={() => setLightbox(true)} className="block w-full rounded-2xl overflow-hidden border border-border group">
        <img src={project.image} alt={`${project.title} reference`} className="w-full h-64 object-cover group-hover:scale-105 transition-transform" />
      </button>

      <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 mt-6">
        <div className="font-semibold mb-3">Skills practiced</div>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((s) => (
            <Badge key={s} variant="outline" className="border-primary/30 text-primary">{s}</Badge>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 mt-6">
        <div className="font-semibold mb-3">Build steps</div>
        <ol className="space-y-2 text-sm">
          {project.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="size-6 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold shrink-0">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          onClick={() => { completeProject(project.id); toast.success(`Nice build! ${project.title} marked complete.`); }}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <CheckCircle2 className="size-4 mr-1" /> Mark complete
        </Button>
        {done && (
          <Button variant="outline" onClick={() => resetProject(project.id)} className="w-full sm:w-auto">
            <RotateCcw className="size-4 mr-1" /> Reset
          </Button>
        )}
      </div>
      </GuestGate>

      {lightbox && (
        <Lightbox src={project.image} alt={project.title} caption={project.title} onClose={() => setLightbox(false)} />
      )}
    </div>
  );
}