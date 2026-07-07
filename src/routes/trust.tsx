import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/coach/Logo";
import { Shield, Lock, Server, Eye, RefreshCw, Mail } from "lucide-react";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust & Security — AutoCAD Coach" },
      { name: "description", content: "How AutoCAD Coach keeps your data safe, secure, and private." },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/trust" }],
  }),
  component: TrustPage,
});

const PILLARS = [
  {
    icon: Lock,
    title: "Authentication & Access",
    body: "All accounts are secured via Supabase Auth with email/password. Passwords are never stored in plain text — they are hashed using bcrypt. Session tokens are short-lived and stored in secure HTTP-only cookies.",
  },
  {
    icon: Server,
    title: "Data Storage",
    body: "Your account data is stored in a Supabase Postgres database with encryption at rest. Learning progress (XP, completed lessons, streak) is stored in your browser's localStorage and is never transmitted to our servers without your consent.",
  },
  {
    icon: Shield,
    title: "Storage Security",
    body: "Lesson images and screenshots are stored in Supabase Storage with Row Level Security (RLS) policies enforced. Only verified admin accounts can upload, modify, or delete course content. All other users have read-only access.",
  },
  {
    icon: Eye,
    title: "No Tracking",
    body: "We do not use advertising trackers, third-party analytics, or data brokers. We do not sell your personal data. The only third-party services we use are Supabase (database/auth) and Lovable AI Gateway (AI tutor).",
  },
  {
    icon: RefreshCw,
    title: "AI Conversations",
    body: "Messages sent to AutoCoach are processed in real time via the Lovable AI Gateway and are not stored on our servers. Your conversation history exists only in your browser session and is cleared when you leave the page.",
  },
  {
    icon: Mail,
    title: "Contact & Reports",
    body: "If you discover a security vulnerability or have concerns about your data, please contact us immediately at schavezsaife@gmail.com. We take all reports seriously and aim to respond within 48 hours.",
  },
];

function TrustPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="font-semibold">AutoCAD Coach</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-6">
              <Shield className="size-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Trust & Security</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We take security and privacy seriously. Here's exactly how AutoCAD Coach protects your data.
            </p>
          </div>
        </section>

        {/* Pillars grid */}
        <section className="pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                <div className="size-10 rounded-lg bg-success/15 text-success grid place-items-center mb-4">
                  <p.icon className="size-5" />
                </div>
                <h3 className="font-semibold text-base">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Legal links */}
        <section className="border-t border-border py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              For full details, read our legal documents:
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Privacy Policy</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Terms of Service</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Cookie Policy</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
            <span className="text-foreground font-medium">Trust</span>
          </div>
          <div>© {new Date().getFullYear()} AutoCAD Coach</div>
        </div>
      </footer>
    </div>
  );
}
