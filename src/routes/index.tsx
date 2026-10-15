import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Menu,
  MessageCircle,
  Sparkles,
  Target,
  Trophy,
  Twitter,
  Wrench,
  X,
  Youtube,
} from "lucide-react";
import { useCoach } from "@/lib/coach-store";
import { lessons } from "@/lib/coach-data";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/coach/Logo";
import { LegalModal, useLegal } from "@/components/coach/LegalModal";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { TrademarkNotice } from "@/components/coach/TrademarkNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:homeTitle") },
      { name: "description", content: i18n.t("meta:homeDesc") },
      { property: "og:title", content: i18n.t("meta:homeTitle") },
      { property: "og:description", content: i18n.t("meta:homeDesc") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/" },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c34db357-66a1-4d0b-9678-b9c5ec020b31/id-preview-5fb7824d--8632cfb9-7250-4303-8743-52e798c5ee97.lovable.app-1780874944187.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c34db357-66a1-4d0b-9678-b9c5ec020b31/id-preview-5fb7824d--8632cfb9-7250-4303-8743-52e798c5ee97.lovable.app-1780874944187.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "AutoCAD Coach",
          url: "https://autocadcoach.lovable.app",
          description: "Beginner-friendly, gamified AutoCAD lessons, projects, quizzes, and an AI tutor.",
          inLanguage: "en",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://autocadcoach.lovable.app/lessons?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AutoCAD Coach",
          url: "https://autocadcoach.lovable.app",
          logo: "https://autocadcoach.lovable.app/favicon.ico",
          description: "Learn AutoCAD step by step with guided lessons, hands-on projects, quizzes, and an AI tutor.",
        }),
      },
    ],
  }),
  component: Index,
});

const HERO_COMMANDS = ["LINE", "TRIM", "OFFSET", "EXTRUDE", "LAYERS", "HATCH", "MIRROR", "FILLET"];
const ALL_COMMANDS = [
  "LINE",
  "CIRCLE",
  "ARC",
  "TRIM",
  "EXTEND",
  "OFFSET",
  "MIRROR",
  "ROTATE",
  "SCALE",
  "MOVE",
  "COPY",
  "HATCH",
  "DIMENSION",
  "EXTRUDE",
  "FILLET",
  "CHAMFER",
  "UNION",
  "SUBTRACT",
  "ARRAY",
  "LAYER",
];

const PAGE_CSS = `
@keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInScale { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes glowPulse { 0%,100% { box-shadow: 0 0 24px oklch(0.82 0.14 210 / 0.30); } 50% { box-shadow: 0 0 48px oklch(0.82 0.14 210 / 0.60); } }
@keyframes orb1 { 0%,100% { transform: translate(0,0) scale(1); opacity: 0.18; } 50% { transform: translate(40px, -30px) scale(1.15); opacity: 0.28; } }
@keyframes orb2 { 0%,100% { transform: translate(0,0) scale(1); opacity: 0.15; } 50% { transform: translate(-30px, 40px) scale(1.1); opacity: 0.25; } }
@keyframes orb3 { 0%,100% { transform: translate(0,0) scale(1); opacity: 0.12; } 50% { transform: translate(20px, 20px) scale(1.2); opacity: 0.22; } }
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes badgePop { 0% { opacity: 0; transform: scale(0.8) translateY(8px); } 60% { transform: scale(1.05) translateY(-2px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes commandFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
.fade-up { animation: fadeInUp 800ms cubic-bezier(0.22,1,0.36,1) both; }
.fade-down { animation: fadeInDown 600ms cubic-bezier(0.22,1,0.36,1) both; }
.fade-scale { animation: fadeInScale 700ms cubic-bezier(0.22,1,0.36,1) both; }
.marquee-track { animation: marquee 30s linear infinite; }
.spin-slow { animation: spinSlow 6s linear infinite; }
.glow-pulse { animation: glowPulse 2.8s ease-in-out infinite; }
.orb-1 { animation: orb1 8s ease-in-out infinite; }
.orb-2 { animation: orb2 10s ease-in-out infinite; }
.orb-3 { animation: orb3 12s ease-in-out infinite; }
.badge-pop { animation: badgePop 600ms cubic-bezier(0.34,1.56,0.64,1) both; }
.shimmer-text {
  background: linear-gradient(90deg, oklch(0.97 0.01 240) 0%, oklch(0.82 0.14 210) 40%, oklch(0.65 0.18 220) 60%, oklch(0.97 0.01 240) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
  animation-delay: 1.5s;
}
.cmd-chip:nth-child(1) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 0s; }
.cmd-chip:nth-child(2) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 0.3s; }
.cmd-chip:nth-child(3) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 0.6s; }
.cmd-chip:nth-child(4) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 0.9s; }
.cmd-chip:nth-child(5) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 1.2s; }
.cmd-chip:nth-child(6) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 1.5s; }
.cmd-chip:nth-child(7) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 1.8s; }
.cmd-chip:nth-child(8) { animation: commandFloat 3s ease-in-out infinite; animation-delay: 2.1s; }
.cta-arrow { transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1); }
.cta-btn:hover .cta-arrow { transform: translateX(6px); }
`;

function Index() {
  const { state } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  const nextLesson = lessons.find((l) => !state.completedLessons.includes(l.id)) ?? lessons[0];
  const legal = useLegal();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <style>{PAGE_CSS}</style>
      <PublicNavbar isAuthed={isAuthed} />
      <Hero isAuthed={isAuthed} nextLessonId={nextLesson.id} />
      <Features />
      <HowItWorks />
      <CommandMarquee />
      <FinalCTA isAuthed={isAuthed} nextLessonId={nextLesson.id} />
      <Footer legal={legal} />
      <LegalModal open={legal.open} onClose={legal.close} />
    </div>
  );
}

function PublicNavbar({ isAuthed }: { isAuthed: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation(["landing", "nav", "common"]);
  return (
    <header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 fade-up"
      style={{ animationDuration: "400ms" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
        <Logo size="sm" />
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/lessons">{t("nav:lessons")}</NavLink>
          <NavLink to="/projects">{t("nav:projects")}</NavLink>
          <NavLink to="/chat">{t("nav:chat")}</NavLink>
          <div className="mx-2 h-5 w-px bg-border" />
          {isAuthed ? (
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/dashboard">{t("landing:dashboardArrow")}</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="sm" variant="outline" className="border-border">
                <Link to="/auth">{t("landing:signIn")}</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/auth">{t("landing:getStarted")}</Link>
              </Button>
            </>
          )}
        </nav>
        <button
          className="md:hidden rounded-md p-2 hover:bg-accent"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={t("common:toggleMenu")}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur px-4 py-3 flex flex-col gap-1">
          <MobileLink to="/lessons" onClick={() => setMobileOpen(false)}>
            {t("nav:lessons")}
          </MobileLink>
          <MobileLink to="/projects" onClick={() => setMobileOpen(false)}>
            {t("nav:projects")}
          </MobileLink>
          <MobileLink to="/chat" onClick={() => setMobileOpen(false)}>
            {t("nav:chat")}
          </MobileLink>
          {isAuthed ? (
            <MobileLink to="/dashboard" onClick={() => setMobileOpen(false)} highlight>
              {t("landing:dashboardArrow")}
            </MobileLink>
          ) : (
            <>
              <MobileLink to="/auth" onClick={() => setMobileOpen(false)}>
                {t("landing:signIn")}
              </MobileLink>
              <MobileLink to="/auth" onClick={() => setMobileOpen(false)} highlight>
                {t("landing:getStarted")}
              </MobileLink>
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
  to,
  children,
  onClick,
  highlight,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
}) {
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
  const { t } = useTranslation("landing");
  const primaryTo = isAuthed ? "/lessons/$id" : "/auth";
  return (
    <section className="relative min-h-[70vh] sm:min-h-[78vh] flex flex-col items-center justify-start text-center px-4 sm:px-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-30" style={{ background: "var(--gradient-hero)" }} aria-hidden />
      {/* Dot grid */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      {/* Animated orbs — more dynamic movement */}
      <div
        className="orb-1 absolute -top-20 -left-20 sm:-top-32 sm:-left-32 size-[240px] sm:size-[420px] rounded-full bg-primary blur-[120px] -z-20"
        aria-hidden
      />
      <div
        className="orb-2 absolute -bottom-20 -right-20 sm:-bottom-32 sm:-right-32 size-[260px] sm:size-[460px] rounded-full bg-indigo-500 blur-[120px] -z-20"
        aria-hidden
      />
      <div
        className="orb-3 absolute top-1/2 right-1/4 size-[160px] sm:size-[280px] rounded-full bg-violet-500 blur-[120px] -z-20"
        aria-hidden
      />
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden
      />

      <div className="relative max-w-3xl mx-auto pt-10 pb-20 md:pt-14 md:pb-24 w-full">
        {/* Badge */}
        <div
          className="badge-pop inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          style={{ animationDelay: "200ms" }}
        >
          <Sparkles className="size-3.5 spin-slow" /> {t("badge")}
        </div>
        {/* Headline */}
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05]">
          <span className="fade-up block" style={{ animationDelay: "400ms" }}>
            {t("heroLine1")}
          </span>
          <span className="fade-up shimmer-text block" style={{ animationDelay: "600ms" }}>
            {t("heroLine2")}
          </span>
        </h1>
        {/* Subheading */}
        <p
          className="fade-up mt-6 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground"
          style={{ animationDelay: "800ms" }}
        >
          {t("heroSub")}
        </p>

        {/* Floating command chips */}
        <div className="fade-up mt-8 overflow-x-auto py-3" style={{ animationDelay: "900ms" }}>
          <div className="flex gap-2 justify-start md:justify-center min-w-max px-1">
            {HERO_COMMANDS.map((c) => (
              <span
                key={c}
                className="cmd-chip font-mono text-xs rounded-md bg-card border border-border px-2.5 py-1 text-primary/80"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div
          className="fade-up mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          style={{ animationDelay: "1000ms" }}
        >
          <Button
            asChild
            size="lg"
            className="cta-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse"
          >
            {isAuthed ? (
              <Link to={primaryTo} params={{ id: nextLessonId }}>
                {t("ctaPrimaryAuthed")} <ArrowRight className="ml-1 size-4 cta-arrow" />
              </Link>
            ) : (
              <Link to="/auth">
                {t("ctaPrimary")} <ArrowRight className="ml-1 size-4 cta-arrow" />
              </Link>
            )}
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border bg-card/40 hover:bg-card">
            <Link to="/dashboard">{isAuthed ? t("ctaSecondaryAuthed") : t("ctaSecondary")}</Link>
          </Button>
        </div>
        {!isAuthed && (
          <p className="fade-up mt-4 max-w-xl mx-auto text-sm text-muted-foreground" style={{ animationDelay: "1050ms" }}>
            {t("ctaNote")}
          </p>
        )}

        {/* Social proof */}
        <div
          className="fade-up mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground"
          style={{ animationDelay: "1100ms" }}
        >
          <div className="flex -space-x-2">
            {[
              { i: "SC", c: "bg-primary/80" },
              { i: "RJ", c: "bg-indigo-500/80" },
              { i: "AM", c: "bg-violet-500/80" },
            ].map((a) => (
              <div
                key={a.i}
                className={cn(
                  "size-6 rounded-full ring-2 ring-background grid place-items-center text-[10px] font-semibold text-white",
                  a.c,
                )}
              >
                {a.i}
              </div>
            ))}
          </div>
          <span>{t("socialProof")}</span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useTranslation("landing");
  const items = [
    { icon: BookOpen, title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: Wrench, title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: Compass, title: t("feature3Title"), desc: t("feature3Desc") },
  ];
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{t("featuresKicker")}</div>
        <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
          {t("featuresHeadline1")}
          <br />
          {t("featuresHeadline2")}
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
              {t("learnMore")}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useTranslation("landing");
  const steps = [
    { n: 1, icon: Compass, title: t("how1Title"), desc: t("how1Desc") },
    { n: 2, icon: Target, title: t("how2Title"), desc: t("how2Desc") },
    { n: 3, icon: Trophy, title: t("how3Title"), desc: t("how3Desc") },
  ];
  return (
    <section className="bg-card/30 border-y border-border py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-3xl md:text-5xl font-bold tracking-tight">{t("howTitle")}</h2>
        <div className="relative mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          <div
            className="hidden md:block absolute top-6 left-[16%] right-[16%] border-t-2 border-dashed border-border"
            aria-hidden
          />
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
  const { t } = useTranslation("landing");
  const list = [...ALL_COMMANDS, ...ALL_COMMANDS];
  return (
    <section className="bg-background border-y border-border py-12 overflow-hidden">
      <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
        {t("marqueeKicker")}
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
  const { t } = useTranslation("landing");
  return (
    <section className="py-24 text-center relative overflow-hidden px-4 sm:px-6">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] rounded-full bg-primary blur-[160px] opacity-15 -z-10"
        aria-hidden
      />
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter">{t("finalTitle")}</h2>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto">{t("finalSub")}</p>
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg" className="cta-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-pulse">
          {isAuthed ? (
            <Link to="/lessons/$id" params={{ id: nextLessonId }}>
              {t("finalCta")} <ArrowRight className="ml-1 size-4 cta-arrow" />
            </Link>
          ) : (
            <Link to="/auth">
              {t("finalCta")} <ArrowRight className="ml-1 size-4 cta-arrow" />
            </Link>
          )}
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{t("finalDisclaimer")}</p>
    </section>
  );
}

function Footer({ legal }: { legal: ReturnType<typeof useLegal> }) {
  const { t } = useTranslation("landing");
  const { state, set } = useCoach();
  const currentLang = state.language;

  const legalLinkBase =
    "text-sm text-muted-foreground hover:text-foreground transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

  return (
    <footer className="border-t border-border bg-card py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LogoMark size="sm" />
              <span className="font-semibold">AutoCAD Coach</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("footerBrand")}</p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                <Youtube className="size-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
            <div>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                {t("footerStartLearning")} <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t("footerProduct")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/lessons"
                  className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  {t("nav:lessons", { ns: "nav" })}
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  {t("nav:projects", { ns: "nav" })}
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  {t("nav:chat", { ns: "nav" })}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t("footerAccount")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/auth"
                  className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  {t("signIn")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                >
                  {t("nav:dashboard", { ns: "nav" })}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t("footerLegal")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => legal.show("privacy")} className={legalLinkBase}>
                  {t("footerPrivacyPolicy")}
                </button>
              </li>
              <li>
                <button onClick={() => legal.show("terms")} className={legalLinkBase}>
                  {t("footerTermsOfService")}
                </button>
              </li>
              <li>
                <button onClick={() => legal.show("cookies")} className={legalLinkBase}>
                  {t("footerCookiePolicy")}
                </button>
              </li>
              <li>
                <button onClick={() => legal.show("trust")} className={legalLinkBase}>
                  {t("footerTrust")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>{t("footerCopyright", { year: new Date().getFullYear() })}</div>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-border bg-background/60 p-0.5">
              {(["en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => set({ language: lang })}
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    currentLang === lang
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={currentLang === lang}
                >
                  {lang}
                </button>
              ))}
            </div>
            <span className="text-[11px] tabular-nums">v1.0</span>
          </div>
        </div>
        <TrademarkNotice className="mt-6 text-center sm:text-left" />
      </div>
    </footer>
  );
}
