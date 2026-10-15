import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/coach/Logo";
import { TrademarkNotice } from "@/components/coach/TrademarkNotice";
import { Award, CheckCircle2, Target, BookOpen, ClipboardList, Clock } from "lucide-react";

const TITLE = "AutoCAD Certification Guide — Certified Professional Exam Roadmap";
const DESC =
  "A step-by-step study guide for the AutoCAD Certified Professional exam. Learn the requirements, exam objectives, and how AutoCAD Coach lessons map to each skill.";
const URL = "https://autocadcoach.lovable.app/certification";

export const Route = createFileRoute("/certification")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "AutoCAD Coach" },
          publisher: { "@type": "Organization", name: "AutoCAD Coach" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is the AutoCAD Certified Professional exam?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The AutoCAD Certified Professional exam is Autodesk's advanced certification, validating that you can use AutoCAD's drafting, modeling, annotation, and collaboration tools in a real production workflow.",
              },
            },
            {
              "@type": "Question",
              name: "How long does the AutoCAD Certified Professional exam take?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The exam is 120 minutes long and contains around 35 performance-based and multiple-choice questions inside a live AutoCAD environment.",
              },
            },
            {
              "@type": "Question",
              name: "How much experience do I need before taking it?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Autodesk recommends around 400 hours of hands-on AutoCAD experience. Working through the AutoCAD Coach lesson path plus the practice projects covers the core skills tested.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: CertificationPage,
});

const objectives: { area: string; skills: string[]; lessons: { id: string; label: string }[] }[] = [
  {
    area: "Drawing Setup & Interface",
    skills: ["Workspaces & ribbon", "Units, limits, and templates", "Navigation: pan, zoom, extents"],
    lessons: [{ id: "interface", label: "Interface + Navigation" }],
  },
  {
    area: "Drawing Objects",
    skills: ["LINE, POLYLINE, RECTANGLE", "CIRCLE, ARC", "Coordinate entry (absolute & relative)"],
    lessons: [
      { id: "line", label: "LINE command" },
      { id: "rectangle", label: "RECTANGLE command" },
      { id: "circle", label: "CIRCLE command" },
    ],
  },
  {
    area: "Precision Drafting",
    skills: ["Object snaps (OSNAP)", "Polar tracking & ortho", "Dynamic input"],
    lessons: [{ id: "osnap", label: "Object Snaps" }],
  },
  {
    area: "Modifying Objects",
    skills: ["MOVE, COPY, ROTATE", "TRIM, EXTEND, OFFSET", "MIRROR, FILLET, CHAMFER"],
    lessons: [
      { id: "movecopy", label: "MOVE + COPY" },
      { id: "trim", label: "TRIM command" },
    ],
  },
  {
    area: "Layers, Annotation & Output",
    skills: ["Layer states & properties", "Text, dimensions, hatch", "Layouts, viewports, plotting"],
    lessons: [],
  },
  {
    area: "3D Modeling",
    skills: ["EXTRUDE, PRESSPULL", "UNION, SUBTRACT, JOIN", "3D navigation & views"],
    lessons: [],
  },
];

function CertificationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="font-semibold">AutoCAD Coach</span>
          </Link>
          <Link to="/lessons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Start lessons →
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-14 sm:py-20 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-6">
              <Award className="size-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              AutoCAD Certification: The Complete Study Guide
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A practical roadmap to the <strong>AutoCAD Certified Professional</strong> exam — what it covers,
              how it's scored, and exactly which AutoCAD Coach lessons prepare you for each objective.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-12">
          <div className="max-w-4xl mx-auto grid gap-4 sm:grid-cols-3">
            {[
              { icon: Clock, label: "Exam length", value: "120 minutes" },
              { icon: ClipboardList, label: "Questions", value: "~35 tasks" },
              { icon: Target, label: "Passing score", value: "~70%" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="font-semibold">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-4xl mx-auto prose prose-invert prose-headings:font-semibold">
            <h2 className="text-2xl font-bold mt-8">Who this guide is for</h2>
            <p className="text-muted-foreground">
              This guide is for drafters, engineering students, architecture students, and career-changers who
              want an industry-recognized credential in AutoCAD. The Certified Professional exam is the
              advanced tier — it assumes you can already navigate the software and produce accurate 2D
              drawings.
            </p>

            <h2 className="text-2xl font-bold mt-10">What the exam covers</h2>
            <p className="text-muted-foreground">
              The AutoCAD Certified Professional exam is performance-based: you complete real tasks inside a
              live AutoCAD environment. Autodesk groups the tested skills into six broad areas. The table
              below maps each objective to the AutoCAD Coach lessons that build the underlying skill.
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-5xl mx-auto grid gap-5 sm:grid-cols-2">
            {objectives.map((o) => (
              <div key={o.area} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="size-4 text-primary" />
                  <h3 className="font-semibold">{o.area}</h3>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {o.skills.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-success mt-0.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                {o.lessons.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      Practice with
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {o.lessons.map((l) => (
                        <Link
                          key={l.id}
                          to="/lessons/$id"
                          params={{ id: l.id }}
                          className="text-xs rounded-md border border-primary/30 text-primary px-2.5 py-1 hover:bg-primary/10 transition-colors"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-2xl font-bold">A 4-week study plan</h2>
            <ol className="mt-4 space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Week 1 — Foundations.</strong> Interface, navigation,
                units, and basic drawing objects. Finish the first four AutoCAD Coach lessons and reproduce
                each example twice from scratch.
              </li>
              <li>
                <strong className="text-foreground">Week 2 — Precision & modification.</strong> Object snaps,
                polar tracking, TRIM / EXTEND / OFFSET, MOVE / COPY / MIRROR. Build one of the practice
                projects end-to-end without looking at the steps.
              </li>
              <li>
                <strong className="text-foreground">Week 3 — Annotation & output.</strong> Layers, text,
                dimensions, hatching, layouts, viewports, and plotting to PDF. Recreate a floor plan from a
                photo and produce a titled sheet.
              </li>
              <li>
                <strong className="text-foreground">Week 4 — 3D & mock exam.</strong> EXTRUDE, PRESSPULL,
                UNION, SUBTRACT, and JOIN. Sit an official Autodesk practice test under exam conditions
                (120 minutes, no notes) and re-drill any objective you missed.
              </li>
            </ol>

            <h2 className="text-2xl font-bold mt-10">Frequently asked questions</h2>
            <h3 className="font-semibold mt-6">How much does the exam cost?</h3>
            <p className="text-muted-foreground">
              Pricing varies by region and testing partner, but the Certified Professional exam is typically
              around USD $200. Students often qualify for discounted pricing via Autodesk's education program.
            </p>
            <h3 className="font-semibold mt-6">Where do I take the exam?</h3>
            <p className="text-muted-foreground">
              Exams are delivered through Certiport-authorized testing centers and via online proctoring.
              Register at certiport.pearsonvue.com and pick a delivery mode when you book.
            </p>
            <h3 className="font-semibold mt-6">Is the certification worth it?</h3>
            <p className="text-muted-foreground">
              For drafters, designers, and BIM technicians, yes — it's the most widely recognized proof of
              AutoCAD proficiency and often shows up as a preferred qualification on job listings for
              architectural, mechanical, and civil roles.
            </p>
          </div>
        </section>

        <section className="border-t border-border py-14 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold">Ready to start preparing?</h2>
            <p className="mt-3 text-muted-foreground">
              Work through the AutoCAD Coach lesson path — each lesson maps to a real exam objective and ends
              with a hands-on task.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/lessons"
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 font-medium hover:opacity-90 transition-opacity"
              >
                Start the lesson path
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-card transition-colors"
              >
                Practice with projects
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AutoCAD Coach
        </div>
        <TrademarkNotice className="max-w-4xl mx-auto mt-3 text-center" />
      </footer>
    </div>
  );
}