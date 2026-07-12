import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { LogoOverlay } from "@/components/coach/LogoOverlay";

export function Lightbox({
  src, alt, onClose,
}: { src: string; alt: string; onClose: () => void }) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 rounded-full bg-card p-2 text-foreground hover:bg-accent"
      >
        <X className="size-5" />
      </button>
      <div
        ref={wrapRef}
        className="relative max-w-5xl w-full max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full max-h-[80vh] object-contain rounded-xl"
        />
        <LogoOverlay imgRef={imgRef} containerRef={wrapRef} />
      </div>
    </div>
  );
}