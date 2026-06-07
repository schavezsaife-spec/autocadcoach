import { X } from "lucide-react";
import { useEffect } from "react";

export function Lightbox({
  src, alt, caption, onClose,
}: { src: string; alt: string; caption?: string; onClose: () => void }) {
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
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="w-full max-h-[80vh] object-contain rounded-xl" />
        {caption && <p className="mt-3 text-center text-sm text-muted-foreground">{caption}</p>}
      </div>
    </div>
  );
}