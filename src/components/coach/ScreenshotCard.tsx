import { useState } from "react";
import { Image as ImageIcon, Maximize2 } from "lucide-react";
import { Lightbox } from "@/components/coach/Lightbox";
import { cn } from "@/lib/utils";

/**
 * Renders an uploaded screenshot inside a lesson. No captions, no helper
 * text, no external links — just the image (or a clean empty placeholder).
 */
export function ScreenshotCard({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <figure
      className={cn(
        "group/screenshot relative w-full rounded-[20px] border border-border bg-secondary/40 overflow-hidden shadow-md shadow-black/30",
        className,
      )}
    >
      {src ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Enlarge: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="block w-full h-auto bg-black/40"
          />
          <span
            aria-hidden
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground opacity-0 group-hover/screenshot:opacity-100 transition-opacity"
          >
            <Maximize2 className="size-3" /> Enlarge
          </span>
        </button>
      ) : (
        <div className="w-full aspect-video grid place-items-center bg-secondary/30">
          <ImageIcon className="size-6 text-muted-foreground/60" aria-hidden />
        </div>
      )}

      {open && src && (
        <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />
      )}
    </figure>
  );
}