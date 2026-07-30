import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

export function Lightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation("screenshot");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreRef.current = (document.activeElement as HTMLElement) ?? null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap: only the close button is focusable inside the dialog.
      const root = panelRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      restoreRef.current?.focus?.();
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={caption ?? alt ?? t("imageDialog")}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label={t("close")}
        className="absolute top-4 right-4 rounded-full bg-card p-2 text-foreground hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <X className="size-5" />
      </button>
      <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="w-full max-h-[80vh] object-contain rounded-xl" />
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>
        )}
      </figure>
    </div>,
    document.body,
  );
}
