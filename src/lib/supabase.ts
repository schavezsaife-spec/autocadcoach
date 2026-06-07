/**
 * Supabase client for AutoCAD Coach.
 *
 * This project is connected to Lovable Cloud, so the Supabase client lives at
 * `@/integrations/supabase/client` and is configured automatically from the
 * generated `.env`:
 *
 *   VITE_SUPABASE_URL=...
 *   VITE_SUPABASE_PUBLISHABLE_KEY=...   (publishable / anon key)
 *
 * If you ever wire this app to a self-hosted Supabase project, populate those
 * two variables in `.env`. The integration client throws a clear error if
 * either one is missing.
 *
 * Google sign-in is brokered through Lovable Cloud's managed Google OAuth
 * (see `@/integrations/lovable`). No extra dashboard configuration is needed
 * by default. To use your OWN Google OAuth credentials, open the Lovable
 * Cloud Backend dashboard → Auth Settings → Sign In Methods → Google.
 */
export { supabase } from "@/integrations/supabase/client";