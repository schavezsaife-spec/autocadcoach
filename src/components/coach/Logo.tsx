import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
};

const sizeMap = {
  sm: { box: "size-7", icon: 18, text: "text-sm" },
  md: { box: "size-9", icon: 22, text: "text-base" },
  lg: { box: "size-12", icon: 30, text: "text-xl" },
};

export function LogoMark({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const s = sizeMap[size];
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.32_0.07_255)] to-[oklch(0.20_0.05_255)] ring-1 ring-primary/40 shadow-[0_0_18px_-6px_oklch(0.82_0.14_210/0.6)] shrink-0",
        s.box,
        className,
      )}
      aria-hidden
    >
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Isometric cube — drafting / CAD inspired */}
        <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" stroke="currentColor" className="text-primary/30" strokeWidth="1" />
        <path d="M16 4 L28 10 L16 16 L4 10 Z" fill="currentColor" className="text-primary/25" />
        <path d="M16 16 L28 10 L28 22 L16 28 Z" fill="currentColor" className="text-primary/40" />
        <path d="M16 16 L4 10 L4 22 L16 28 Z" fill="currentColor" className="text-primary/15" />
        <path d="M16 16 L16 28" stroke="white" strokeOpacity="0.85" strokeWidth="1.25" />
        <path d="M16 16 L4 10" stroke="white" strokeOpacity="0.85" strokeWidth="1.25" />
        <path d="M16 16 L28 10" stroke="white" strokeOpacity="0.85" strokeWidth="1.25" />
        <circle cx="16" cy="16" r="1.4" fill="white" />
      </svg>
    </span>
  );
}

export function Logo({ className, iconOnly, size = "md", asLink = true }: Props) {
  const s = sizeMap[size];
  const inner = (
    <span className={cn("flex items-center gap-2 min-w-0", className)}>
      <LogoMark size={size} />
      {!iconOnly && (
        <span className={cn("font-semibold tracking-tight text-foreground truncate", s.text)}>
          AutoCAD <span className="text-primary">Coach</span>
        </span>
      )}
    </span>
  );
  if (!asLink) return inner;
  return (
    <Link to="/" className="flex items-center gap-2 min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
      {inner}
    </Link>
  );
}