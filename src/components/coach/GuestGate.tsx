import { Link } from "@tanstack/react-router";
import { Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface GuestGateProps {
  children: ReactNode;
  isAuthenticated: boolean;
  message?: string;
}

export function GuestGate({ children, isAuthenticated, message }: GuestGateProps) {
  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred placeholder content */}
      <div className="pointer-events-none select-none blur-sm opacity-60" aria-hidden>
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-start justify-center pt-16 px-4">
        <div className="max-w-sm w-full rounded-2xl bg-card/95 backdrop-blur border border-border p-6 text-center shadow-xl">
          <div className="mx-auto size-12 rounded-full bg-primary/15 text-primary grid place-items-center ring-1 ring-primary/30">
            <Lock className="size-5" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">Sign in to access this</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {message ?? "Create a free account to track your progress, earn XP, and interact with lessons."}
          </p>
          <Button asChild className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/auth">
              <LogIn className="size-4 mr-1.5" /> Sign in or create account
            </Link>
          </Button>
          <p className="mt-3 text-[11px] text-muted-foreground">Free — no credit card required</p>
        </div>
      </div>
    </div>
  );
}