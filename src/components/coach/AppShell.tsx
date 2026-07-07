import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, Wrench, Compass, LogIn, PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCoach } from "@/lib/coach-store";
import { ProfileAvatar } from "./ProfileAvatar";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "react-i18next";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, tKey: "dashboard" },
  { to: "/lessons", icon: BookOpen, tKey: "lessons" },
  { to: "/projects", icon: Wrench, tKey: "projects" },
  { to: "/chat", icon: Compass, tKey: "chat" },
] as const;

const STORAGE_KEY = "sidebar_open";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Hydrate sidebar state from localStorage, default to closed on mobile
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

  // Persist sidebar preference
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(open));
    } catch {}
  }, [open, mounted]);

  return (
    <div className="h-dvh flex w-full bg-background text-foreground overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 overflow-hidden h-dvh",
          open ? "w-64" : "w-16",
        )}
      >
        <SidebarInner collapsed={!open} pathname={pathname} onToggle={() => setOpen((v) => !v)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Page content */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex items-center justify-around h-16 px-2">
          <MobileNavItems pathname={pathname} />
          <LanguageToggle variant="mobile" />
          <MobileAuthBadge />
        </nav>
      </div>
    </div>
  );
}

function MobileNavItems({ pathname }: { pathname: string }) {
  const { t } = useTranslation("nav");
  return (
    <>
      {NAV.map(({ to, tKey, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            const label = t(tKey);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors text-xs font-medium",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "drop-shadow-[0_0_6px_currentColor]")} />
                <span>{label}</span>
              </Link>
            );
          })}
    </>
  );
}

function SidebarInner({
  collapsed,
  pathname,
  onToggle,
}: {
  collapsed: boolean;
  pathname: string;
  onToggle: () => void;
}) {
  const { t } = useTranslation("nav");
  return (
    <>
      {/* Collapse / expand toggle */}
      <button
        onClick={onToggle}
        aria-label={t("toggleSidebar")}
        title={collapsed ? t("expandSidebar") : t("collapseSidebar")}
        className={cn(
          "flex items-center gap-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors mx-2 mt-2",
          collapsed ? "justify-center h-10 w-10 mx-auto p-0" : "px-3 py-2 w-[calc(100%-1rem)]",
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4 shrink-0" />
        ) : (
          <>
            <PanelLeftClose className="size-4 shrink-0" />
            <span>{t("collapse")}</span>
          </>
        )}
      </button>

      {/* Language toggle — mirrors the collapse button treatment */}
      <LanguageToggle variant="sidebar" collapsed={collapsed} />

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, tKey, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          const label = t(tKey);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className={cn("truncate transition-opacity", collapsed && "opacity-0 w-0 overflow-hidden")}>
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
  const { t } = useTranslation("common");

  async function handleLogout() {
    await signOut();
    navigate({ to: "/" });
  }

  if (!p.isAuthenticated) {
    return (
      <div className={cn("border-t border-sidebar-border", collapsed ? "p-2" : "p-3")}>
        <Link
          to="/auth"
          title={collapsed ? t("signIn") : undefined}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90",
            collapsed ? "h-10 w-10 mx-auto" : "px-3 py-2.5",
          )}
        >
          <LogIn className="size-4 shrink-0" />
          {!collapsed && <span>{t("signIn")}</span>}
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
          collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 p-2.5",
        )}
      >
        <ProfileAvatar image={p.profileImage} firstName={p.firstName} lastName={p.lastName} size="sm" />
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
        title={collapsed ? t("signOut") : undefined}
        className={cn(
          "flex items-center text-muted-foreground hover:text-destructive transition-colors rounded-lg",
          collapsed ? "justify-center h-10 w-10 mx-auto" : "gap-3 px-3 py-2.5 text-sm w-full",
        )}
      >
        <LogOut className="size-4 shrink-0" />
        {!collapsed && <span>{t("signOut")}</span>}
      </button>
    </div>
  );
}

function MobileAuthBadge() {
  const { state } = useCoach();
  const p = state.profile;
  const { t: tc } = useTranslation("common");
  const { t: tn } = useTranslation("nav");
  if (!p.isAuthenticated) {
    return (
      <Link
        to="/auth"
        className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogIn className="size-5" />
        <span>{tc("signIn")}</span>
      </Link>
    );
  }
  return (
    <Link
      to="/profile"
      className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors"
    >
      <ProfileAvatar image={p.profileImage} firstName={p.firstName} lastName={p.lastName} size="sm" />
      <span className="text-xs text-muted-foreground">{tn("profile")}</span>
    </Link>
  );
}
