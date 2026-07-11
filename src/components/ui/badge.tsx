import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/40 bg-primary/15 text-primary shadow-[0_0_12px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)] hover:bg-primary/25",
        secondary:
          "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        success:
          "border-success/50 bg-success/20 text-success shadow-[0_0_14px_-4px_color-mix(in_oklab,var(--success)_70%,transparent)] hover:bg-success/30",
        outline: "border-primary/30 text-foreground/90 bg-card/40 backdrop-blur",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
