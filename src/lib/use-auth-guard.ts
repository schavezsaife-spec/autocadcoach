import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./auth-context";

/**
 * Component-level auth guard. Waits until the auth state has finished
 * loading before redirecting, so a signed-in user is never bounced to /auth
 * during session hydration (and no redirect loop can form).
 *
 * Returns "loading" | "authed" | "guest".
 */
export function useAuthStatus(): "loading" | "authed" | "guest" {
  const { session, loading } = useAuth();
  if (loading) return "loading";
  return session?.user ? "authed" : "guest";
}

export function useAuthGuard(): boolean {
  const status = useAuthStatus();
  const navigate = useNavigate();
  useEffect(() => {
    if (status === "guest") navigate({ to: "/auth", replace: true });
  }, [status, navigate]);
  return status === "authed";
}
