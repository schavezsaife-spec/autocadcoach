import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogIn } from "lucide-react";
import { useCoach } from "@/lib/coach-store";
import { Logo } from "./Logo";

export function PublicNav() {
  const { state } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
        <Logo size="sm" />
        {isAuthed ? (
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90"
          >
            <LayoutDashboard className="size-4" /> Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90"
          >
            <LogIn className="size-4" /> Sign in
          </Link>
        )}
      </div>
    </header>
  );
}