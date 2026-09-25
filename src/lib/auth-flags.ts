/**
 * Centralized authentication feature flags.
 *
 * Temporarily disabled because Google authentication is not currently offered.
 * Set GOOGLE_AUTH_ENABLED to true (or VITE_GOOGLE_AUTH_ENABLED=true) to restore it.
 *
 * Temporarily disabled because authentication email delivery is unavailable.
 * Set AUTH_EMAILS_ENABLED to true only after email delivery is configured and tested.
 *
 * Password reset is decoupled from AUTH_EMAILS_ENABLED: it uses the default
 * Lovable Cloud auth email sender, so it works out of the box.
 * PASSWORD_RESET_ENABLED defaults to true; set VITE_PASSWORD_RESET_ENABLED=false
 * to switch it off.
 */
function flag(value: unknown, fallback: boolean) {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export const GOOGLE_AUTH_ENABLED = flag(import.meta.env.VITE_GOOGLE_AUTH_ENABLED, false);
export const AUTH_EMAILS_ENABLED = flag(import.meta.env.VITE_AUTH_EMAILS_ENABLED, false);
export const PASSWORD_RESET_ENABLED = flag(import.meta.env.VITE_PASSWORD_RESET_ENABLED, true);
