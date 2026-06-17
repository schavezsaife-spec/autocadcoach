import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, BookOpen, Wrench,
  User, Compass, LogIn, Menu, PanelLeftClose, PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCoach } from "@/lib/coach-store";
import { ProfileAvatar } from "./ProfileAvatar";
import { Logo } from "./Logo";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/lessons", icon: BookOpen, label: "Lessons" },
  { to: "/projects", icon: Wrench, label: "Projects" },
  { to: "/chat", icon: Compass, label: "AI Coach" },
  { to: "/profile", icon: User, label: "Profile" },
] as const;

const STORAGE_KEY = "sidebar_open";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage / detect mobile on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        setOpen(raw === "true");
      } else if (typeof window !== "undefined" && window.innerWidth < 768) {
        setOpen(false);
      }
    } catch {}
    setMounted(true);
  }, []);

  // Persist preference.
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEY, String(open)); } catch {}
  }, [open, mounted]);

  // Close mobile drawer on route change.
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 overflow-hidden",
          open ? "w-64" : "w-16"
        )}
      >
        <SidebarInner
          collapsed={!open}
          pathname={pathname}
          onToggle={() => setOpen((v) => !v)}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
            <SidebarInner
              collapsed={false}
              pathname={pathname}
              onToggle={() => setMobileOpen(false)}
              mobile
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-sidebar border-b border-sidebar-border px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 hover:bg-sidebar-accent"
          >
            <Menu className="size-5" />
          </button>
          <Logo size="sm" />
          <MobileAuthBadge />
        </header>

        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function SidebarInner({
  collapsed,
  pathname,
  onToggle,
  mobile,
}: {
  collapsed: boolean;
  pathname: string;
  onToggle: () => void;
  mobile?: boolean;
}) {
  return (
    <>
      {/* Brand + toggle */}
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border h-16",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {collapsed ? (
          <>
            <Link to="/" aria-label="AutoCAD Coach home"><LogoMark size="md" /></Link>
            <button
              onClick={onToggle}
              aria-label="Expand sidebar"
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          </>
        ) : (
          <>
            <Logo size="md" />
            <button
              onClick={onToggle}
              aria-label={mobile ? "Close menu" : "Collapse sidebar"}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            >
              <PanelLeftClose className="size-4" />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span
                className={cn(
                  "truncate transition-opacity",
                  collapsed && "opacity-0 w-0 overflow-hidden"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <UserFooter collapsed={collapsed} />
    </>
  );
}

function UserFooter({ collapsed }: { collapsed: boolean }) {
  const { state, signOut } = useCoach();
  const p = state.profile;
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate({ to: "/" });
  }

  if (!p.isAuthenticated) {
    return (
      <div className={cn("border-t border-sidebar-border", collapsed ? "p-2" : "p-3")}>
        <Link
          to="/auth"
          title={collapsed ? "Sign in" : undefined}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90",
            collapsed ? "h-10 w-10 mx-auto" : "px-3 py-2.5"
          )}
        >
          <LogIn className="size-4 shrink-0" />
          {!collapsed && <span>Sign in</span>}
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("border-t border-sidebar-border", collapsed ? "p-2 space-y-2" : "p-3 space-y-2")}>
      <Link
        to="/profile"
        title={collapsed ? `${p.firstName} ${p.lastName}`.trim() || "Profile" : undefined}
        className={cn(
          "flex items-center hover:bg-sidebar-accent transition-colors rounded-lg",
          collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 p-2.5"
        )}
      >
        <ProfileAvatar
          image={p.profileImage}
          firstName={p.firstName}
          lastName={p.lastName}
          size="sm"
        />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-sidebar-foreground truncate">
              {`${p.firstName} ${p.lastName}`.trim() || "AutoCAD Learner"}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">{p.email}</div>
          </div>
        )}
      </Link>
      <button
        onClick={handleLogout}
        title={collapsed ? "Log out" : undefined}
        className={cn(
          "flex items-center text-muted-foreground hover:text-destructive transition-colors rounded-lg",
          collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5 text-sm w-full"
        )}
      >
        <LogOut className="size-4 shrink-0" />
        {!collapsed && <span>Log out</span>}
      </button>
    </div>
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