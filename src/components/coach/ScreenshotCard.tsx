import { useRef, useState } from "react";
import { Image as ImageIcon, Maximize2, Upload, Loader2 } from "lucide-react";
import { Lightbox } from "@/components/coach/Lightbox";
import { LogoOverlay } from "@/components/coach/LogoOverlay";
import { cn } from "@/lib/utils";
import { uploadLessonImage } from "@/lib/lesson-images";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

/**
 * Renders a lesson screenshot. When `lessonId` + `slot` are provided, a
 * temporary build-time upload control is shown so admins can attach or
 * replace the image directly from the lesson page. Images are always
 * displayed at a locked 16:9 aspect ratio.
 */
export function ScreenshotCard({
  src,
  alt,
  className,
  lessonId,
  slot,
  uploadable = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  lessonId?: string;
  slot?: string;
  uploadable?: boolean;
}) {
  const { t } = useTranslation("screenshot");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localSrc, setLocalSrc] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const canUpload = uploadable && Boolean(lessonId && slot);

  const onPick = async (file: File | null) => {
    if (!file || !lessonId || !slot) return;
    setUploading(true);
    try {
      const url = await uploadLessonImage(lessonId, slot, file);
      setLocalSrc(url);
      toast.success(t("screenshot:replace"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("screenshot:upload"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const displaySrc = localSrc ?? src;

  return (
    <figure
      className={cn(
        "group/screenshot relative w-full rounded-[20px] border border-border bg-secondary/40 overflow-hidden shadow-md shadow-black/30",
        className,
      )}
    >
      {displaySrc ? (
        <button
          type="button"
          ref={btnRef}
          onClick={() => setOpen(true)}
          className="block w-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary aspect-video"
            aria-label={t("enlargeAria", { alt })}
        >
          <img
            ref={imgRef}
            src={displaySrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain bg-black/40"
          />
          <LogoOverlay imgRef={imgRef} containerRef={btnRef} />
          <span
            aria-hidden
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/80 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground opacity-0 group-hover/screenshot:opacity-100 transition-opacity"
          >
              <Maximize2 className="size-3" /> {t("enlarge")}
          </span>
        </button>
      ) : (
        <div className="w-full aspect-video grid place-items-center bg-secondary/30">
          <ImageIcon className="size-6 text-muted-foreground/60" aria-hidden />
        </div>
      )}

      {canUpload && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={uploading}
            className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-background transition-colors disabled:opacity-60"
            aria-label={displaySrc ? t("replaceAria") : t("uploadAria")}
          >
            {uploading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Upload className="size-3" />
            )}
            {uploading ? t("uploading") : displaySrc ? t("replace") : t("upload")}
          </button>
        </>
      )}

      {open && displaySrc && (
        <Lightbox src={displaySrc} alt={alt} onClose={() => setOpen(false)} />
      )}
    </figure>
  );
}