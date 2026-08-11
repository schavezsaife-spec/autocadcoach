import { useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  image: string | null;
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-28 text-2xl",
};

export function ProfileAvatar({ image, firstName, lastName, size = "md", className }: Props) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "";
  // A dead avatar URL (expired signed link, deleted upload) must degrade to
  // initials, not to the browser's broken-image glyph. Tracked with the src it
  // describes so a newly uploaded photo isn't suppressed by an old failure.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(image) && failedSrc !== image;

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden bg-primary/15 text-primary grid place-items-center ring-1 ring-primary/30 font-semibold shrink-0",
        sizes[size],
        className
      )}
      aria-label="Profile avatar"
    >
      {showImage ? (
        <img
          src={image!}
          alt="Profile"
          decoding="async"
          className="w-full h-full object-cover"
          onError={() => setFailedSrc(image)}
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className="size-1/2" />
      )}
    </div>
  );
}