import type { ErrorComponentProps } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CoachProvider } from "../lib/coach-store";
import { AuthProvider } from "../lib/auth-context";
import { AppShell } from "../components/coach/AppShell";
import { TrademarkFooter } from "../components/coach/TrademarkNotice";
import { Toaster } from "../components/ui/sonner";
import "../lib/i18n";
import i18n from "../lib/i18n";
import { useTranslation } from "react-i18next";

function NotFoundComponent() {
  const { t } = useTranslation("common");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("notFoundTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("notFoundBody")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const { t } = useTranslation("common");
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  // Replaces the whole root layout, so it carries its own trademark footer.
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("errorTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("errorBody")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("retry")}
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {t("goHome")}
            </a>
          </div>
        </div>
      </div>
      <TrademarkFooter />
    </>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const tagline = i18n.t("meta:siteTagline");
    const desc = i18n.t("meta:siteDescription");
    const title = `AutoCAD Coach — ${tagline}`;
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: desc },
      { name: "author", content: "AutoCAD Coach" },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "AutoCAD Coach" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = typeof i18n.language === "string" ? i18n.language.slice(0, 2) : "en";
  return (
    <html lang={lang} className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CoachProvider>
          <AppRouter />
          <Toaster />
        </CoachProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Routes that render WITHOUT the AppShell sidebar layout
const PUBLIC_ROUTES = ["/", "/trust"];

// Pages that render <TrademarkNotice /> themselves (in their own footer, or
// under the chat). Every other route gets <TrademarkFooter /> from AppRouter.
const ROUTES_WITH_OWN_NOTICE = ["/", "", "/trust", "/certification", "/chat"];

function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname === "" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
}

function AppRouter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = isPublicRoute(pathname);
  const showTrademarkFooter = !ROUTES_WITH_OWN_NOTICE.includes(pathname);

  // AppShell is ALWAYS mounted — never conditionally unmounted. Conditional
  // unmount causes a full remount flash every time you navigate between
  // public and app routes, so it is hidden with CSS instead.
  //
  // <Outlet /> must be rendered EXACTLY ONCE. Rendering it both inside the
  // hidden shell and outside it mounts every public page twice: duplicate
  // element ids, duplicate form submissions, and duplicate effects (auth
  // listeners, redirects, data fetches) all firing in parallel.
  return (
    <>
      {/* App shell — always in DOM, hidden on public routes */}
      <div className={isPublic ? "hidden" : "contents"}>
        <AppShell>
          {!isPublic && (
            // min-h-full keeps the trademark footer at the bottom of short pages
            <div className="flex min-h-full flex-col">
              <div key={pathname} className="route-transition flex-1">
                <Outlet />
              </div>
              {showTrademarkFooter && <TrademarkFooter />}
            </div>
          )}
        </AppShell>
      </div>

      {/* Public pages — rendered outside AppShell */}
      {isPublic && (
        <>
          <div key={pathname} className="route-transition">
            <Outlet />
          </div>
          {showTrademarkFooter && <TrademarkFooter />}
        </>
      )}
    </>
  );
}
