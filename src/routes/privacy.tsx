import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/coach/Logo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AutoCAD Coach" },
      { name: "description", content: "How AutoCAD Coach collects, uses, and protects your personal data." },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 17, 2026">
      <Section title="1. Introduction">
        <p>
          AutoCAD Coach ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you use our platform at autocadcoach.lovable.app.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We collect the following categories of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account data:</strong> your name, email address, and profile photo when you register.</li>
          <li><strong>Usage data:</strong> lessons completed, XP earned, quiz results, and learning progress stored locally in your browser.</li>
          <li><strong>Technical data:</strong> browser type, device type, IP address, and pages visited, collected automatically via standard web logs.</li>
          <li><strong>Communications:</strong> messages you send to AutoCoach (our AI tutor) are processed in real time and are not permanently stored on our servers.</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide, operate, and maintain the AutoCAD Coach platform.</li>
          <li>To personalize your learning experience and track your progress.</li>
          <li>To communicate with you about your account or updates to our service.</li>
          <li>To improve our content, features, and AI tutor responses.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </Section>

      <Section title="4. Data Storage">
        <p>
          Your learning progress (completed lessons, XP, streak) is stored in your browser's local storage and is not
          transmitted to our servers unless you are signed in. Account information is stored securely via Supabase
          with encryption at rest.
        </p>
      </Section>

      <Section title="5. Third-Party Services">
        <p>We use the following third-party services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Supabase</strong> — authentication and database hosting.</li>
          <li><strong>Lovable AI Gateway</strong> — powers the AutoCoach AI tutor (messages are not stored).</li>
          <li><strong>Vercel / hosting provider</strong> — web hosting and CDN.</li>
        </ul>
        <p>Each provider has their own privacy policy and data handling practices.</p>
      </Section>

      <Section title="6. Cookies">
        <p>
          We use essential cookies for authentication session management. We do not use advertising or tracking
          cookies. See our <Link to="/cookies" className="underline hover:text-foreground">Cookie Policy</Link> for details.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Object to or restrict processing of your data.</li>
          <li>Data portability.</li>
        </ul>
        <p>To exercise these rights, contact us at the email below.</p>
      </Section>

      <Section title="8. Data Retention">
        <p>
          We retain your account data for as long as your account is active. You may delete your account at any time
          from your Profile page. Browser-stored progress data can be cleared at any time by clearing your browser's
          local storage.
        </p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>
          AutoCAD Coach is not directed at children under 13. We do not knowingly collect personal information from
          children under 13. If you believe a child has provided us with personal data, please contact us immediately.
        </p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by updating
          the "Last updated" date at the top of this page.
        </p>
      </Section>

      <Section title="11. Contact Us">
        <p>
          If you have questions about this Privacy Policy, please contact us at:{" "}
          <strong>support@autocadcoach.lovable.app</strong>
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
      {/* Minimal nav */}
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