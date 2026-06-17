import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/coach/Logo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — AutoCAD Coach" },
      { name: "description", content: "Terms and conditions for using the AutoCAD Coach platform." },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 17, 2026">
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using AutoCAD Coach ("the Service"), you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use the Service.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          AutoCAD Coach is an online learning platform providing AutoCAD lessons, projects, quizzes, and an
          AI-powered tutor. The Service is provided "as is" and is intended for educational purposes only.
        </p>
      </Section>

      <Section title="3. User Accounts">
        <ul className="list-disc pl-6 space-y-2">
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You are responsible for all activities that occur under your account.</li>
          <li>You must be at least 13 years of age to create an account.</li>
        </ul>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Service for any unlawful purpose or in violation of these Terms.</li>
          <li>Attempt to gain unauthorized access to any part of the Service.</li>
          <li>Use the AI tutor to generate content unrelated to AutoCAD learning.</li>
          <li>Scrape, copy, or redistribute our lesson content without permission.</li>
          <li>Impersonate any person or entity.</li>
        </ul>
      </Section>

      <Section title="5. Intellectual Property">
        <p>
          All content on AutoCAD Coach — including lessons, project files, illustrations, and the AutoCoach AI system
          prompt — is owned by AutoCAD Coach and protected by copyright. You may not reproduce or distribute any
          content without written permission.
        </p>
      </Section>

      <Section title="6. AI Tutor Disclaimer">
        <p>
          AutoCoach is powered by a large language model and is provided for educational assistance only. Responses
          may not always be accurate. Always verify critical technical information against official Autodesk
          documentation. We are not responsible for errors or omissions in AI-generated responses.
        </p>
      </Section>

      <Section title="7. Learning Progress">
        <p>
          Your learning progress is stored locally in your browser. We are not responsible for loss of progress data
          due to browser cache clearing, device changes, or technical issues.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, AutoCAD Coach shall not be liable for any indirect, incidental,
          special, or consequential damages arising from your use of the Service, including but not limited to loss
          of data or learning progress.
        </p>
      </Section>

      <Section title="9. Modifications to the Service">
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
          We may also update these Terms at any time. Continued use of the Service after changes constitutes
          acceptance of the new Terms.
        </p>
      </Section>

      <Section title="10. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising
          under these Terms shall be subject to the exclusive jurisdiction of the relevant courts.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For questions about these Terms, contact us at: <strong>support@autocadcoach.lovable.app</strong>
        </p>
      </Section>
    </LegalLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="font-semibold">AutoCAD Coach</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        </div>
        <div className="space-y-8">{children}</div>
      </main>

      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/cookies" className="hover:text-foreground">Cookies</Link>
          </div>
          <div>© {new Date().getFullYear()} AutoCAD Coach</div>
        </div>
      </footer>
    </div>
  );
}