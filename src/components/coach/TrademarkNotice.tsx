import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function TrademarkNotice({ className }: { className?: string }) {
  const { t } = useTranslation("common");
  return <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>{t("trademarkNotice")}</p>;
}

export function TrademarkFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-5 sm:px-6">
      <TrademarkNotice className="mx-auto max-w-4xl text-center" />
    </footer>
  );
}
