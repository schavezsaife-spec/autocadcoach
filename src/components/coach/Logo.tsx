import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo-mark.png";

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
        "relative grid place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.32_0.07_255)] to-[oklch(0.20_0.05_255)] ring-1 ring-primary/40 shadow-[0_0_18px_-6px_oklch(0.82_0.14_210/0.6)] shrink-0 overflow-hidden",
        s.box,
        className,
      )}
      aria-hidden
    >
      <img
        src={logoMark}
        alt=""
        width={s.icon}
        height={s.icon}
        className="size-[78%] object-contain"
        draggable={false}
      />
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