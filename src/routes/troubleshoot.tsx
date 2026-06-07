import { createFileRoute } from "@tanstack/react-router";
import { troubleshooting } from "@/lib/coach-data";
import { AlertTriangle, Wrench } from "lucide-react";

export const Route = createFileRoute("/troubleshoot")({
  head: () => ({ meta: [{ title: "Troubleshoot — AutoCAD Coach" }] }),
  component: TroubleshootPage,
});

function TroubleshootPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Troubleshooting</h1>
        <p className="text-muted-foreground mt-1">Fixes for the most common beginner roadblocks.</p>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        {troubleshooting.map((t) => (
          <article key={t.title} className="rounded-2xl bg-card border border-border p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-4" />
              <h2 className="font-semibold text-foreground">{t.title}</h2>
            </div>
            <div className="mt-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Cause</div>
              <p className="text-sm mt-1">{t.cause}</p>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-primary">
                <Wrench className="size-3" /> Fix
              </div>
              <p className="text-sm mt-1">{t.fix}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}