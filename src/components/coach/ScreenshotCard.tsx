import { useState } from "react";
import { ExternalLink, Image as ImageIcon, Maximize2 } from "lucide-react";
import { Lightbox } from "@/components/coach/Lightbox";
import { cn } from "@/lib/utils";

/**
 * The single source of truth for how every annotated AutoCAD screenshot is
 * presented inside a lesson. Behaviour is identical across the app:
 *
 *   - card-width image, native aspect ratio (no crop)
 *   - 20px border radius + subtle shadow
 *   - native lazy loading + async decoding
 *   - click to open a full-screen Lightbox
 *   - when no image is mapped, show "Image coming soon" and surface the
 *     authoritative Autodesk docs link so the lesson still teaches.
 */
export function ScreenshotCard({
  src,
  alt,
  caption,
  sourceUrl,
  className,
}: {
  src?: string;
  alt: string;
  caption?: string;
  sourceUrl?: string;
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
        <div className="w-full aspect-video grid place-items-center bg-[repeating-linear-gradient(135deg,transparent_0_10px,color-mix(in_oklab,var(--muted)_25%,transparent)_10px_20px)] p-4 text-center">
          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <ImageIcon className="size-5" aria-hidden />
            <span className="uppercase tracking-wider">Image coming soon</span>
          </div>
        </div>
      )}
      {(caption || sourceUrl) && (
        <figcaption className="px-4 py-3 text-xs text-muted-foreground flex items-start gap-3 justify-between">
          {caption && <span className="leading-snug">{caption}</span>}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-primary hover:underline"
            >
              Autodesk docs <ExternalLink className="size-3" />
            </a>
          )}
        </figcaption>
      )}

      {open && src && (
        <Lightbox src={src} alt={alt} caption={caption} onClose={() => setOpen(false)} />
      )}
    </figure>
  );
}