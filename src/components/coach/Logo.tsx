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
  sm: { box: "size-7", icon: 28, text: "text-sm", tag: "text-[7px]" },
  md: { box: "size-9", icon: 36, text: "text-base", tag: "text-[8px]" },
  lg: { box: "size-12", icon: 48, text: "text-xl", tag: "text-[10px]" },
};

export function LogoMark({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const s = sizeMap[size];
  return (
    <img
      src={logoMark}
      alt=""
      width={s.icon}
      height={s.icon}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: s.icon, height: s.icon, filter: "var(--shadow-logo-glow)" }}
      draggable={false}
      aria-hidden
    />
  );
}

export function Logo({ className, iconOnly, size = "md", asLink = true }: Props) {
  const s = sizeMap[size];
  const inner = (
    <span className={cn("flex items-center gap-2 min-w-0", className)}>
      <LogoMark size={size} />
      {!iconOnly && (
        <span className="flex flex-col leading-none min-w-0">
          <span className={cn("font-semibold tracking-tight text-foreground truncate", s.text)}>
            AutoCAD <span className="text-primary">Coach</span>
          </span>
          <span
            className={cn(
              "mt-1 font-medium uppercase tracking-[0.18em] text-muted-foreground/80 truncate",
              s.tag,
            )}
          >
            Learn. Practice. Succeed.
          </span>
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