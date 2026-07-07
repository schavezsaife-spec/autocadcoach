import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCoach } from "@/lib/coach-store";
import { setAppLanguage, type AppLanguage } from "@/lib/i18n";
import { useTranslation } from "react-i18next";

type Variant = "sidebar" | "mobile";

export function LanguageToggle({
  variant,
  collapsed = false,
}: {
  variant: Variant;
  collapsed?: boolean;
}) {
  const { state, set } = useCoach();
  const { t } = useTranslation("common");
  const current: AppLanguage = state.language === "es" ? "es" : "en";
  const next: AppLanguage = current === "en" ? "es" : "en";

  const toggle = () => {
    set({ language: next });
    setAppLanguage(next);
  };

  const label = current.toUpperCase();
  const title = `${t("switchLanguage")} → ${next.toUpperCase()}`;

  if (variant === "mobile") {
    return (
      <button
        onClick={toggle}
        aria-label={title}
        className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Languages className="size-5" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={title}
      title={title}
      className={cn(
        "flex items-center gap-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors mx-2 mt-1",
        collapsed ? "justify-center h-10 w-10 mx-auto p-0" : "px-3 py-2 w-[calc(100%-1rem)]",
      )}
    >
      <Languages className="size-4 shrink-0" />
      {!collapsed && (
        <span className="flex-1 text-left">
          {t("language")} · <span className="font-semibold text-foreground">{label}</span>
        </span>
      )}
    </button>
  );
}