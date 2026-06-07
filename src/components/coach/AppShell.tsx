import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, LayoutDashboard, BookOpen, Wrench, ClipboardCheck,
  User, AlertTriangle, MessageCircle, Menu, X, Compass, LogIn,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCoach } from "@/lib/coach-store";
import { ProfileAvatar } from "./ProfileAvatar";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/lessons", label: "Lessons", icon: BookOpen },
  { to: "/projects", label: "Projects", icon: Wrench },
  { to: "/quiz", label: "Quiz", icon: ClipboardCheck },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/troubleshoot", label: "Troubleshoot", icon: AlertTriangle },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Auth page renders standalone (no sidebar/header).
  if (pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <BrandHeader />
        <NavList pathname={pathname} onClick={() => {}} />
        <UserFooter />
        <FooterCredit />
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/20 text-primary grid place-items-center">
              <Compass className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">AutoCAD Coach</span>
          </div>
          <div className="flex items-center gap-2">
            <MobileAuthBadge />
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 hover:bg-sidebar-accent"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-background/80" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
              <div className="flex items-center justify-between p-4">
                <BrandHeader compact />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-2 hover:bg-sidebar-accent">
                  <X className="size-5" />
                </button>
              </div>
              <NavList pathname={pathname} onClick={() => setOpen(false)} />
              <UserFooter onNavigate={() => setOpen(false)} />
              <FooterCredit />
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function BrandHeader({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", compact ? "" : "p-5 border-b border-sidebar-border")}>
      <div className="size-10 rounded-xl bg-primary/15 text-primary grid place-items-center ring-1 ring-primary/30">
        <Compass className="size-5" />
      </div>
      <div>
        <div className="font-semibold tracking-tight text-sidebar-foreground">AutoCAD Coach</div>
        <div className="text-[11px] text-muted-foreground">Learn CAD, level up.</div>
      </div>
    </div>
  );
}

function NavList({ pathname, onClick }: { pathname: string; onClick: () => void }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function FooterCredit() {
  return (
    <div className="p-4 border-t border-sidebar-border text-[11px] text-muted-foreground">
      Created by <span className="text-primary font-medium">Sofia Chavez Saife</span>
    </div>
  );
}

function UserFooter({ onNavigate }: { onNavigate?: () => void }) {
  const { state } = useCoach();
  const p = state.profile;

  if (!p.isAuthenticated) {
    return (
      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/auth"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90"
        >
          <LogIn className="size-4" /> Sign in
        </Link>
      </div>
    );
  }

  return (
    <Link
      to="/profile"
      onClick={onNavigate}
      className="flex items-center gap-3 p-3 border-t border-sidebar-border hover:bg-sidebar-accent transition-colors"
    >
      <ProfileAvatar
        image={p.profileImage}
        firstName={p.firstName}
        lastName={p.lastName}
        size="md"
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-sidebar-foreground truncate">
          {`${p.firstName} ${p.lastName}`.trim() || "AutoCAD Learner"}
        </div>
        <div className="text-[11px] text-muted-foreground truncate">{p.email}</div>
      </div>
    </Link>
  );
}

function MobileAuthBadge() {
  const { state } = useCoach();
  const p = state.profile;
  if (!p.isAuthenticated) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2.5 py-1.5 text-xs font-medium hover:bg-primary/90"
      >
        <LogIn className="size-3.5" /> Sign in
      </Link>
    );
  }
  return (
    <Link to="/profile" aria-label="View profile">
      <ProfileAvatar
        image={p.profileImage}
        firstName={p.firstName}
        lastName={p.lastName}
        size="sm"
      />
    </Link>
  );
}