import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/coach/Logo";
import { Shield, Lock, Server, Eye, RefreshCw, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { TrademarkNotice } from "@/components/coach/TrademarkNotice";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:trustTitle") },
      { name: "description", content: i18n.t("meta:trustDesc") },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/trust" }],
  }),
  component: TrustPage,
});

function TrustPage() {
  const { t } = useTranslation(["trust", "common"]);
  const pillars = [
    { icon: Lock, title: t("trust:pillars.authTitle"), body: t("trust:pillars.authBody") },
    { icon: Server, title: t("trust:pillars.storageTitle"), body: t("trust:pillars.storageBody") },
    { icon: Shield, title: t("trust:pillars.assetsTitle"), body: t("trust:pillars.assetsBody") },
    { icon: Eye, title: t("trust:pillars.trackingTitle"), body: t("trust:pillars.trackingBody") },
    { icon: RefreshCw, title: t("trust:pillars.aiTitle"), body: t("trust:pillars.aiBody") },
    { icon: Mail, title: t("trust:pillars.contactTitle"), body: t("trust:pillars.contactBody") },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="font-semibold">AutoCAD Coach</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("common:backToHome")}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-6">
              <Shield className="size-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t("trust:title")}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t("trust:subtitle")}</p>
          </div>
        </section>

        <section className="pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
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

        <section className="border-t border-border py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">{t("trust:legalIntro")}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">{t("legal:privacyTitle", { ns: "legal" })}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{t("legal:termsTitle", { ns: "legal" })}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{t("legal:cookiesTitle", { ns: "legal" })}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{t("trust:footerPrivacy")}</span>
            <span>{t("trust:footerTerms")}</span>
            <span>{t("trust:footerCookies")}</span>
            <span className="text-foreground font-medium">{t("trust:footerTrust")}</span>
          </div>
          <div>© {new Date().getFullYear()} AutoCAD Coach</div>
        </div>
        <TrademarkNotice className="max-w-6xl mx-auto mt-4 text-center sm:text-left" />
      </footer>
    </div>
  );
}
