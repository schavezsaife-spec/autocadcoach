import { useCallback, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "loading" | "loaded" | "error";

export type SmartImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "loading"> & {
  src?: string;
  alt: string;
  /**
   * Above-the-fold images decode eagerly and get `fetchpriority="high"` so the
   * browser starts them before lazy media further down the page. Everything
   * else stays lazy.
   */
  priority?: boolean;
  /** Classes for the wrapper that hosts the skeleton / error state. */
  wrapperClassName?: string;
  /** Rendered instead of the default icon when the image fails or is absent. */
  fallback?: React.ReactNode;
};

/**
 * An `<img>` that never shows a broken-image glyph and never pops in.
 *
 * - Renders a pulsing placeholder until the bitmap is actually decoded, then
 *   cross-fades the image in.
 * - A cached image is detected synchronously via the ref callback, so
 *   re-renders and back-navigation don't flash a skeleton.
 * - A failed load (expired signed URL, deleted Storage object, offline)
 *   degrades to a muted icon instead of the browser's broken image.
 */
export function SmartImage({
  src,
  alt,
  priority = false,
  className,
  wrapperClassName,
  fallback,
  onLoad,
  onError,
  style,
  ...rest
}: SmartImageProps) {
  // Status is tracked together with the src it describes, so swapping `src`
  // (language toggle, replaced upload) resets during render rather than in an
  // effect — no frame showing the previous image's state.
  const [state, setState] = useState<{ src?: string; status: Status; live: boolean }>({
    src,
    status: "loading",
    live: false,
  });
  const current = state.src === src ? state.status : "loading";
  // `live` flips in the ref callback, which only ever runs in the browser. Until
  // then the image renders fully opaque, so server-rendered HTML — and a page
  // whose hydration never completes — still shows its images.
  const fading = state.live && current !== "loaded";

  const attach = useCallback(
    (node: HTMLImageElement | null) => {
      if (!node) return;
      // Cache hit: the browser already has it, skip the skeleton entirely.
      const cached = node.complete && node.naturalWidth > 0;
      setState((prev) => {
        const status: Status = cached ? "loaded" : prev.src === src ? prev.status : "loading";
        if (prev.live && prev.src === src && prev.status === status) return prev;
        return { src, status, live: true };
      });
    },
    [src],
  );

  const failed = !src || current === "error";
  const showPlaceholder = failed || fading;

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {showPlaceholder && (
        // When the image failed, this box replaces it entirely, so it carries
        // the alt text — otherwise a screen reader would lose the content.
        // A decorative image (alt="") stays hidden, as does a live skeleton.
        <div
          {...(failed && alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
          className={cn(
            "absolute inset-0 grid place-items-center bg-secondary/30",
            !failed && "animate-pulse bg-primary/10",
          )}
        >
          {failed &&
            (fallback ?? <ImageOff className="size-6 text-muted-foreground/60" aria-hidden />)}
        </div>
      )}
      {src && !failed && (
        <img
          {...rest}
          ref={attach}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn("transition-opacity duration-300", className)}
          // Inline, not a class: callers legitimately set their own opacity
          // (dimmed locked cards, blurred guest previews) and tailwind-merge
          // would let that win over the fade. Once loaded we hand opacity back.
          style={fading ? { ...style, opacity: 0 } : style}
          onLoad={(e) => {
            setState({ src, status: "loaded", live: true });
            onLoad?.(e);
          }}
          onError={(e) => {
            setState({ src, status: "error", live: true });
            onError?.(e);
          }}
        />
      )}
    </div>
  );
}
