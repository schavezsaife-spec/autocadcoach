import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCoach } from "./coach-store";

/**
 * Component-level auth guard: redirect to /auth if the user is not
 * authenticated. Returns `true` when the user IS authenticated so the
 * caller can decide whether to render anything.
 */
export function useAuthGuard(): boolean {
  const { state } = useCoach();
  const navigate = useNavigate();
  const authed = state.profile.isAuthenticated;
  useEffect(() => {
    if (!authed) navigate({ to: "/auth" });
  }, [authed, navigate]);
  return authed;
}