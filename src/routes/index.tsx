import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, BookOpen, Compass, Menu, Sparkles, Target, Trophy, Wrench, X,
} from "lucide-react";
import { useCoach } from "@/lib/coach-store";
import { lessons } from "@/lib/coach-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoCAD Coach — Learn AutoCAD step by step" },
      { name: "description", content: "Beginner-friendly, gamified AutoCAD lessons, projects, quizzes, and an AI tutor." },
    ],
  }),
  component: Index,
});

const HERO_COMMANDS = ["LINE", "TRIM", "OFFSET", "EXTRUDE", "LAYERS", "HATCH", "MIRROR", "FILLET"];
const ALL_COMMANDS = [
  "LINE", "CIRCLE", "ARC", "TRIM", "EXTEND", "OFFSET", "MIRROR", "ROTATE",
  "SCALE", "MOVE", "COPY", "HATCH", "DIMENSION", "EXTRUDE", "FILLET",
  "CHAMFER", "UNION", "SUBTRACT", "ARRAY", "LAYER",
];

const PAGE_CSS = `
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes glowPulse { 0%,100% { box-shadow: 0 0 24px hsl(var(--primary) / 0.30); } 50% { box-shadow: 0 0 40px hsl(var(--primary) / 0.55); } }
.fade-up { animation: fadeInUp 700ms ease-out both; }
.marquee-track { animation: marquee 30s linear infinite; }
.spin-slow { animation: spinSlow 6s linear infinite; }
.glow-pulse { animation: glowPulse 2.8s ease-in-out infinite; }
.cta-arrow { transition: transform 200ms ease; }
.cta-btn:hover .cta-arrow { transform: translateX(4px); }
`;

function Index() {
  const { state } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  const nextLesson = lessons.find((l) => !state.completedLessons.includes(l.id)) ?? lessons[0];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <style>{PAGE_CSS}</style>
      <PublicNavbar isAuthed={isAuthed} />
      <Hero isAuthed={isAuthed} nextLessonId={nextLesson.id} />
      <Features />
      <HowItWorks />
      <CommandMarquee />
      <FinalCTA isAuthed={isAuthed} nextLessonId={nextLesson.id} />
      <Footer />
    </div>
  );
}

function PublicNavbar({ isAuthed }: { isAuthed: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 fade-up"
      style={{ animationDuration: "400ms" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/15 text-primary grid place-items-center ring-1 ring-primary/30">
            <Compass className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">AutoCAD Coach</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/lessons">Lessons</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/quiz">Quiz</NavLink>
          <div className="mx-2 h-5 w-px bg-border" />
          {isAuthed ? (
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/dashboard">Dashboard →</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="sm" variant="outline" className="border-border">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </nav>
        <button
          className="md:hidden rounded-md p-2 hover:bg-accent"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur px-4 py-3 flex flex-col gap-1">
          <MobileLink to="/lessons" onClick={() => setMobileOpen(false)}>Lessons</MobileLink>
          <MobileLink to="/projects" onClick={() => setMobileOpen(false)}>Projects</MobileLink>
          <MobileLink to="/quiz" onClick={() => setMobileOpen(false)}>Quiz</MobileLink>
          {isAuthed ? (
            <MobileLink to="/dashboard" onClick={() => setMobileOpen(false)} highlight>Dashboard →</MobileLink>
          ) : (
            <>
              <MobileLink to="/auth" onClick={() => setMobileOpen(false)}>Sign in</MobileLink>
              <MobileLink to="/auth" onClick={() => setMobileOpen(false)} highlight>Get started</MobileLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  to, children, onClick, highlight,
}: { to: string; children: React.ReactNode; onClick: () => void; highlight?: boolean }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 text-sm",
        highlight
          ? "bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          : "text-foreground hover:bg-accent",
      )}
    >
      {children}
    </Link>
  );
}

function Hero({ isAuthed, nextLessonId }: { isAuthed: boolean; nextLessonId: string }) {
  const primaryTo = isAuthed ? "/lessons/$id" : "/auth";
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 -z-30" style={{ background: "var(--gradient-hero)" }} aria-hidden />
      <div
        className="absolute inset-0 -z-20 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div className="absolute -top-32 -left-32 size-[420px] rounded-full bg-cyan-500 blur-[120px] opacity-20 animate-pulse" aria-hidden />
      <div className="absolute -bottom-32 -right-32 size-[460px] rounded-full bg-indigo-500 blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: "1.5s" }} aria-hidden />
      <div className="absolute top-1/2 right-1/4 size-[280px] rounded-full bg-violet-500 blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: "3s" }} aria-hidden />

      <div className="relative max-w-3xl mx-auto py-20 md:py-24 w-full">
        <div className="fade-up inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary" style={{ animationDelay: "200ms" }}>
          <Sparkles className="size-3.5 spin-slow" /> Beginner-friendly CAD learning
        </div>
        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
          <span className="fade-up block" style={{ animationDelay: "400ms" }}>Master AutoCAD</span>
          <span className="fade-up block text-primary" style={{ animationDelay: "600ms" }}>
            from zero to fluent.
          </span>
        </h1>
        <p className="fade-up mt-6 max-w-xl mx-auto text-lg text-muted-foreground" style={{ animationDelay: "800ms" }}>
          AutoCAD Coach turns engineering software into a step-by-step game. Lessons, projects, quizzes,
          and an AI tutor — all in one place.
        </p>

        {/* Command strip */}
        <div className="fade-up mt-8 overflow-x-auto" style={{ animationDelay: "900ms" }}>
          <div className="flex gap-2 justify-start md:justify-center min-w-max px-1">
            {HERO_COMMANDS.map((c) => (
              <span key={c} className="font-mono text-xs rounded-md bg-card border border-border px-2.5 py-1 text-primary/80">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="fade-up mt-8 flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: "1000ms" }}>
          <Button asChild size="lg" className="cta-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse">
            {isAuthed ? (
              <Link to={primaryTo} params={{ id: nextLessonId }}>
                Start Learning free <ArrowRight className="ml-1 size-4 cta-arrow" />
              </Link>
            ) : (
              <Link to="/auth">
                Start Learning free <ArrowRight className="ml-1 size-4 cta-arrow" />
              </Link>
            )}
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border bg-card/40 hover:bg-card">
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="fade-up mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground" style={{ animationDelay: "1100ms" }}>
          <div className="flex -space-x-2">
            {[
              { i: "SC", c: "bg-cyan-500/80" },
              { i: "RJ", c: "bg-indigo-500/80" },
              { i: "AM", c: "bg-violet-500/80" },
            ].map((a) => (
              <div
                key={a.i}
                className={cn("size-6 rounded-full ring-2 ring-background grid place-items-center text-[10px] font-semibold text-white", a.c)}
              >
                {a.i}
              </div>
            ))}
          </div>
          <span>Join learners mastering AutoCAD one command at a time.</span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: BookOpen, title: "15 Guided Lessons", desc: "Sequential lessons unlock as you progress. Each one ends with XP and a challenge." },
    { icon: Wrench, title: "6 Real Projects", desc: "Build real CAD drawings from scratch — mechanical, architectural, and 3D." },
    { icon: Compass, title: "AI Tutor + Quiz", desc: "Test yourself, then ask AutoCoach anything when you get stuck." },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Everything you need</div>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          Learn by doing,<br />not just watching.
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((f, i) => (
          <article
            key={f.title}
            className="fade-up rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group"
            style={{ animationDelay: `${100 + i * 150}ms` }}
          >
            <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:bg-primary/20 transition-colors">
              <f.icon className="size-5" />
            </div>
            <div className="mt-4 font-semibold text-lg">{f.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            <div className="mt-4 text-primary text-sm font-medium opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              Learn more →
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, icon: Compass, title: "Pick a lesson", desc: "Sequential lessons unlock as you progress." },
    { n: 2, icon: Target, title: "Follow the steps", desc: "Each lesson walks you through commands with objectives and tips." },
    { n: 3, icon: Trophy, title: "Build & earn XP", desc: "Complete projects, pass the quiz, climb the leaderboard." },
  ];
  return (
    <section className="bg-card/30 border-y border-border py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-3xl md:text-5xl font-bold tracking-tight">How AutoCAD Coach works</h2>
        <div className="relative mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          <div className="hidden md:block absolute top-6 left-[16%] right-[16%] border-t-2 border-dashed border-border" aria-hidden />
          {steps.map((s) => (
            <div key={s.n} className="relative text-center flex flex-col items-center">
              <div className="size-12 rounded-full bg-primary text-primary-foreground font-bold text-lg grid place-items-center ring-4 ring-background relative z-10">
                {s.n}
              </div>
              <div className="mt-5 inline-flex items-center gap-2 font-semibold">
                <s.icon className="size-4 text-primary" /> {s.title}
              </div>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommandMarquee() {
  const list = [...ALL_COMMANDS, ...ALL_COMMANDS];
  return (
    <section className="bg-background border-y border-border py-12 overflow-hidden">
      <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
        Commands you'll master
      </div>
      <div className="mt-6 overflow-hidden relative">
        <div className="marquee-track flex w-max">
          {list.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="font-mono text-sm bg-card border border-border rounded-lg px-3 py-1.5 mx-2 text-foreground whitespace-nowrap"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ isAuthed, nextLessonId }: { isAuthed: boolean; nextLessonId: string }) {
  return (
    <section className="py-24 text-center relative overflow-hidden px-4 sm:px-6">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] rounded-full bg-cyan-500 blur-[160px] opacity-15 -z-10" aria-hidden />
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Ready to start drawing?</h2>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto">
        Your first lesson is one click away.
      </p>
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg" className="cta-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse">
          {isAuthed ? (
            <Link to="/lessons/$id" params={{ id: nextLessonId }}>
              Begin your first lesson <ArrowRight className="ml-1 size-4 cta-arrow" />
            </Link>
          ) : (
            <Link to="/auth">
              Begin your first lesson <ArrowRight className="ml-1 size-4 cta-arrow" />
            </Link>
          )}
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        No sign-up required to explore — create an account to save progress.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary/15 text-primary grid place-items-center">
            <Compass className="size-3.5" />
          </div>
          <span className="font-semibold text-foreground">AutoCAD Coach</span>
          <span>— Learn AutoCAD by doing.</span>
        </div>
        <div>Built by <span className="text-foreground">Sofia Chavez Saife</span></div>
      </div>
    </footer>
  );
}

