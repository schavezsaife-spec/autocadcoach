import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

/**
 * The single authenticated account allowed to use the lesson image
 * "Replace" / upload controls. This is intentionally narrower than the
 * `admin` role: other admins must NOT be able to replace images.
 * Backend RLS on `public.lesson_images` and the `lesson-screenshots`
 * bucket enforces the same rule — the UI check is only an affordance.
 */
export const OWNER_USER_ID = "64e4bf0f-ddf0-4e00-945a-b2949a47e789";

export function isOwnerId(id: string | null | undefined): boolean {
  return id === OWNER_USER_ID;
}

/** True only when the signed-in user is the owner account. */
export function useIsOwner(): boolean {
  const { user } = useAuth();
  return isOwnerId(user?.id);
}

/**
 * Runtime guard for image write actions. Verifies the *authenticated*
 * user id (not UI state) before any upload / replace / delete runs.
 */
export async function assertOwner(action: string): Promise<void> {
  const { data } = await supabase.auth.getUser();
  if (!isOwnerId(data.user?.id)) {
    console.warn(`Unauthorized image ${action} attempt.`);
    throw new Error("unauthorized");
  }
}
