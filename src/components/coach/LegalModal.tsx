import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Server, Eye, RefreshCw, Mail } from "lucide-react";

export type LegalPage = "privacy" | "terms" | "cookies" | "trust" | null;

interface LegalModalProps {
  open: LegalPage;
  onClose: () => void;
}

export function LegalModal({ open, onClose }: LegalModalProps) {
  return (
    <Sheet open={open !== null} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-2xl">
            {open === "privacy" && "Privacy Policy"}
            {open === "terms" && "Terms of Service"}
            {open === "cookies" && "Cookie Policy"}
            {open === "trust" && "Trust & Security"}
          </SheetTitle>
          <p className="text-xs text-muted-foreground">Last updated: 1 June 2025</p>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6 py-6">
          {open === "privacy" && <PrivacyContent />}
          {open === "terms" && <TermsContent />}
          {open === "cookies" && <CookiesContent />}
          {open === "trust" && <TrustContent />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function useLegal() {
  const [open, setOpen] = useState<LegalPage>(null);
  return {
    open,
    show: (page: LegalPage) => setOpen(page),
    close: () => setOpen(null),
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      <div className="text-sm text-muted-foreground space-y-2">{children}</div>
    </section>
  );
}

function PrivacyContent() {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        AutoCAD Coach is committed to protecting your privacy. This policy explains how we collect,
        use, and safeguard your information.
      </p>
      <Section title="Information We Collect">
        <ul className="list-disc pl-5 space-y-1">
          <li>Account data: name, email, and profile photo when you register.</li>
          <li>Usage data: lessons completed, XP earned, quiz results stored locally in your browser.</li>
          <li>Technical data: browser type, device type, IP address collected via standard web logs.</li>
          <li>AI conversations: messages to AutoCoach are processed in real time and not permanently stored.</li>
        </ul>
      </Section>
      <Section title="How We Use Your Information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To provide and maintain the AutoCAD Coach platform.</li>
          <li>To personalize your learning experience and track progress.</li>
          <li>To communicate with you about your account.</li>
          <li>To improve content, features, and AI tutor responses.</li>
        </ul>
      </Section>
      <Section title="Data Storage">
        <p>
          Your progress is stored in browser localStorage and not transmitted to our servers unless
          signed in. Account data is stored securely with encryption at rest.
        </p>
      </Section>
      <Section title="Third-Party Services">
        <ul className="list-disc pl-5 space-y-1">
          <li>Lovable Cloud — authentication and database.</li>
          <li>Lovable AI Gateway — powers AutoCoach (messages not stored).</li>
        </ul>
      </Section>
      <Section title="Your Rights">
        <p>
          You may access, correct, or delete your personal data at any time. Contact us at{" "}
          <a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a>.
        </p>
      </Section>
      <Section title="Contact">
        <p>Questions? Email us at <a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a>.</p>
      </Section>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        By using AutoCAD Coach you agree to these Terms. If you do not agree, please do not use the service.
      </p>
      <Section title="Service Description">
        <p>
          AutoCAD Coach provides AutoCAD lessons, projects, quizzes, and an AI tutor for educational
          purposes only.
        </p>
      </Section>
      <Section title="Your Account">
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide accurate information when registering.</li>
          <li>You are responsible for your account credentials and all activity under your account.</li>
          <li>You must be at least 13 years old to create an account.</li>
        </ul>
      </Section>
      <Section title="Acceptable Use">
        <ul className="list-disc pl-5 space-y-1">
          <li>Do not use the service for unlawful purposes.</li>
          <li>Do not attempt to gain unauthorized access to any part of the service.</li>
          <li>Do not scrape or redistribute lesson content without permission.</li>
        </ul>
      </Section>
      <Section title="Intellectual Property">
        <p>
          All content including lessons, projects, and the AutoCoach AI system is owned by AutoCAD
          Coach and protected by copyright.
        </p>
      </Section>
      <Section title="AI Disclaimer">
        <p>
          AutoCoach responses may not always be accurate. Verify critical information against
          official Autodesk documentation. We are not liable for AI errors.
        </p>
      </Section>
      <Section title="Limitation of Liability">
        <p>
          AutoCAD Coach is not liable for indirect, incidental, or consequential damages arising
          from use of the service.
        </p>
      </Section>
      <Section title="Contact">
        <p><a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a></p>
      </Section>
    </>
  );
}

function CookiesContent() {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        Cookies are small text files placed on your device. We use a minimal set.
      </p>
      <Section title="What We Use">
        <ul className="list-disc pl-5 space-y-1">
          <li>Authentication cookies: set when you sign in. Strictly necessary to keep you logged in.</li>
          <li>Preference storage: sidebar open/closed state in localStorage — never transmitted to our servers.</li>
        </ul>
      </Section>
      <Section title="What We Don't Use">
        <ul className="list-disc pl-5 space-y-1">
          <li>No advertising or tracking cookies.</li>
          <li>No analytics cookies (e.g. Google Analytics).</li>
          <li>No third-party marketing data sharing.</li>
        </ul>
      </Section>
      <Section title="Your Control">
        <p>
          You can control cookies in your browser settings. Disabling auth cookies will prevent you
          from staying signed in.
        </p>
      </Section>
      <Section title="Local Storage">
        <p>
          Learning progress is stored in localStorage on your device only. Clear it anytime via
          your browser's site data settings.
        </p>
      </Section>
      <Section title="Contact">
        <p><a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a></p>
      </Section>
    </>
  );
}

const TRUST_PILLARS = [
  { icon: Lock, title: "Authentication", body: "Accounts secured via managed auth. Passwords hashed with bcrypt. Session tokens stored in secure HTTP-only cookies." },
  { icon: Server, title: "Data Storage", body: "Account data in Postgres with encryption at rest. Learning progress stays in your browser's localStorage." },
  { icon: Shield, title: "Storage Security", body: "Lesson images use Row Level Security (RLS). Only verified admin accounts can modify course content." },
  { icon: Eye, title: "No Tracking", body: "No advertising trackers, no analytics, no data brokers. We do not sell your personal data." },
  { icon: RefreshCw, title: "AI Conversations", body: "AutoCoach messages are processed in real time and not stored on our servers." },
  { icon: Mail, title: "Security Reports", body: "Found a vulnerability? Email support@autocadcoach.lovable.app — we respond within 48 hours." },
];

function TrustContent() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TRUST_PILLARS.map((p) => (
        <div key={p.title} className="rounded-xl border border-border bg-card p-4">
          <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3">
            <p.icon className="size-4" />
          </div>
          <div className="font-semibold text-sm">{p.title}</div>
          <p className="mt-1 text-xs text-muted-foreground">{p.body}</p>
        </div>
      ))}
    </div>
  );
}