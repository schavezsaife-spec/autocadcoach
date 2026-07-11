import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Server, Eye, RefreshCw, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export type LegalPage = "privacy" | "terms" | "cookies" | "trust" | null;

interface LegalModalProps {
  open: LegalPage;
  onClose: () => void;
}

export function LegalModal({ open, onClose }: LegalModalProps) {
  const { t } = useTranslation("legal");
  const title =
    open === "privacy" ? t("privacyTitle") :
    open === "terms" ? t("termsTitle") :
    open === "cookies" ? t("cookiesTitle") :
    open === "trust" ? t("trustTitle") : "";
  return (
    <Sheet open={open !== null} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-2xl">{title}</SheetTitle>
          <p className="text-xs text-muted-foreground">{t("lastUpdated")}</p>
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
  const { t } = useTranslation("legal");
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">{t("privacyIntro")}</p>
      <Section title={t("sectionInfoWeCollect")}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("privacyCollect1")}</li>
          <li>{t("privacyCollect2")}</li>
          <li>{t("privacyCollect3")}</li>
          <li>{t("privacyCollect4")}</li>
        </ul>
      </Section>
      <Section title={t("sectionHowWeUse")}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("privacyUse1")}</li>
          <li>{t("privacyUse2")}</li>
          <li>{t("privacyUse3")}</li>
          <li>{t("privacyUse4")}</li>
        </ul>
      </Section>
      <Section title={t("sectionDataStorage")}>
        <p>{t("privacyStorageBody")}</p>
      </Section>
      <Section title={t("sectionThirdParty")}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("privacyThird1")}</li>
          <li>{t("privacyThird2")}</li>
        </ul>
      </Section>
      <Section title={t("sectionYourRights")}>
        <p>
          {t("privacyRights")}
          <a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a>.
        </p>
      </Section>
      <Section title={t("sectionContact")}>
        <p>{t("privacyContact")}<a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a>.</p>
      </Section>
    </>
  );
}

function TermsContent() {
  const { t } = useTranslation("legal");
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">{t("termsIntro")}</p>
      <Section title={t("termsServiceTitle")}>
        <p>{t("termsServiceBody")}</p>
      </Section>
      <Section title={t("termsAccountTitle")}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("termsAccount1")}</li>
          <li>{t("termsAccount2")}</li>
          <li>{t("termsAccount3")}</li>
        </ul>
      </Section>
      <Section title={t("termsUseTitle")}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("termsUse1")}</li>
          <li>{t("termsUse2")}</li>
          <li>{t("termsUse3")}</li>
        </ul>
      </Section>
      <Section title={t("termsIpTitle")}>
        <p>{t("termsIpBody")}</p>
      </Section>
      <Section title={t("termsAiTitle")}>
        <p>{t("termsAiBody")}</p>
      </Section>
      <Section title={t("termsLiabilityTitle")}>
        <p>{t("termsLiabilityBody")}</p>
      </Section>
      <Section title={t("sectionContact")}>
        <p><a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a></p>
      </Section>
    </>
  );
}

function CookiesContent() {
  const { t } = useTranslation("legal");
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">{t("cookiesIntro")}</p>
      <Section title={t("cookiesUseTitle")}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("cookiesUse1")}</li>
          <li>{t("cookiesUse2")}</li>
        </ul>
      </Section>
      <Section title={t("cookiesDontTitle")}>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("cookiesDont1")}</li>
          <li>{t("cookiesDont2")}</li>
          <li>{t("cookiesDont3")}</li>
        </ul>
      </Section>
      <Section title={t("cookiesControlTitle")}>
        <p>{t("cookiesControlBody")}</p>
      </Section>
      <Section title={t("cookiesLocalTitle")}>
        <p>{t("cookiesLocalBody")}</p>
      </Section>
      <Section title={t("sectionContact")}>
        <p><a href="mailto:schavezsaife@gmail.com" className="text-primary hover:underline"><strong>schavezsaife@gmail.com</strong></a></p>
      </Section>
    </>
  );
}

function TrustContent() {
  const { t } = useTranslation("legal");
  const pillars = [
    { icon: Lock, title: t("trustAuthTitle"), body: t("trustAuthBody") },
    { icon: Server, title: t("trustStorageTitle"), body: t("trustStorageBody") },
    { icon: Shield, title: t("trustAssetsTitle"), body: t("trustAssetsBody") },
    { icon: Eye, title: t("trustTrackingTitle"), body: t("trustTrackingBody") },
    { icon: RefreshCw, title: t("trustAiTitle"), body: t("trustAiBody") },
    { icon: Mail, title: t("trustReportsTitle"), body: t("trustReportsBody") },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pillars.map((p) => (
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
