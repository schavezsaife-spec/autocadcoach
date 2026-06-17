import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/coach/Logo";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — AutoCAD Coach" },
      { name: "description", content: "How AutoCAD Coach uses cookies and similar technologies." },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="June 17, 2026">
      <Section title="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device by a website when you visit it. They are widely used to
          make websites work efficiently and to provide information to the site owner.
        </p>
      </Section>

      <Section title="2. Cookies We Use">
        <p>AutoCAD Coach uses a minimal set of cookies:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Authentication cookies:</strong> Set by Supabase when you sign in. These are strictly necessary
            to keep you logged in across page navigations. They expire when you sign out or after a set session duration.
          </li>
          <li>
            <strong>Preference cookies:</strong> We store your sidebar open/closed preference in localStorage (not a
            cookie technically, but similar in purpose). This is never transmitted to our servers.
          </li>
        </ul>
      </Section>

      <Section title="3. What We Don't Use">
        <ul className="list-disc pl-6 space-y-2">
          <li>We do not use advertising or tracking cookies.</li>
          <li>We do not use analytics cookies (e.g. Google Analytics).</li>
          <li>We do not sell or share cookie data with third parties for marketing.</li>
        </ul>
      </Section>

      <Section title="4. Third-Party Cookies">
        <p>
          Supabase, our authentication provider, may set its own cookies as part of the sign-in flow. These are
          governed by Supabase's privacy policy and are strictly necessary for authentication to function.
        </p>
      </Section>

      <Section title="5. Managing Cookies">
        <p>You can control and delete cookies through your browser settings:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
          <li><strong>Firefox:</strong> Options → Privacy &amp; Security → Cookies</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
        </ul>
        <p>Note: disabling authentication cookies will prevent you from staying signed in to AutoCAD Coach.</p>
      </Section>

      <Section title="6. Local Storage">
        <p>
          In addition to cookies, we use browser localStorage to store your learning progress (completed lessons, XP,
          streak) and UI preferences. This data stays on your device and is never transmitted to our servers unless
          you are signed in. You can clear this data at any time by clearing your browser's site data.
        </p>
      </Section>

      <Section title="7. Updates to This Policy">
        <p>
          We may update this Cookie Policy from time to time. Any changes will be reflected by updating the "Last
          updated" date above.
        </p>
      </Section>

      <Section title="8. Contact">
        <p>
          Questions about our use of cookies? Contact us at: <strong>support@autocadcoach.lovable.app</strong>
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