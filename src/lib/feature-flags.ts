/**
 * Centralized, reversible feature flags.
 *
 * GOOGLE_AUTH_ENABLED — Google OAuth ("Continue with Google") is temporarily
 * disabled. All Google sign-in code, the Supabase/Lovable provider wiring and
 * the /auth/callback route remain in place; flipping this flag back to `true`
 * (or setting VITE_GOOGLE_AUTH_ENABLED=true) restores the feature with no
 * other change.
 */
function envFlag(raw: unknown): boolean | undefined {
  if (raw === undefined || raw === null || raw === "") return undefined;
  const v = String(raw).toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return undefined;
}

export const GOOGLE_AUTH_ENABLED: boolean =
  envFlag(import.meta.env.VITE_GOOGLE_AUTH_ENABLED) ?? false;
