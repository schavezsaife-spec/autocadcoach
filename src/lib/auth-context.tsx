import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import i18n from "@/lib/i18n";
import { AUTH_EMAILS_ENABLED, GOOGLE_AUTH_ENABLED } from "@/lib/auth-flags";

export type AuthProfile = {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  auth_provider: string | null;
};

/**
 * A friendly, translated error. Raw Supabase messages / codes are logged to the
 * console for developers but never surfaced in the UI.
 */
export class AuthError extends Error {}

export type AuthResult = { ok: boolean; error?: string; needsEmailConfirmation?: boolean };

type AuthCtx = {
  user: User | null;
  session: Session | null;
  profile: AuthProfile | null;
  /**
   * True only for users holding the 'admin' role in `public.user_roles`.
   * Client-side gating is for UI only — RLS on the tables/buckets is what
   * actually enforces this.
   */
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    meta: { firstName: string; lastName: string },
  ) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult & { redirected?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
};

const Ctx = createContext<AuthCtx | null>(null);

function tr(key: string) {
  return i18n.t(`auth:${key}`);
}

/** Map a raw Supabase auth error to a safe, user-facing message. */
function friendlyAuthError(err: unknown, context: "signin" | "signup" | "reset"): string {
  const raw = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: string } | null)?.code ?? "";
  const status = (err as { status?: number } | null)?.status;
  console.error(`[auth] ${context} failed`, { code, status, raw, err });

  const m = raw.toLowerCase();
  // Leaked-password protection (HIBP) rejects the signup with HTTP 422.
  if (code === "weak_password" || m.includes("known to be weak") || m.includes("pwned")) {
    return tr("errPasswordPwned");
  }
  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    code === "user_already_exists"
  ) {
    return tr("errEmailInUse");
  }
  if (m.includes("rate limit") || status === 429) return tr("errTooManyAttempts");
  if (m.includes("password") && m.includes("should be")) return tr("errPasswordShort");
  if (m.includes("failed to fetch") || m.includes("network")) return tr("errNetwork");
  // Neutral fallback: never reveal whether the account exists or which
  // provider it uses.
  return context === "signup" ? tr("errSignUpFailed") : tr("errBadCredentials");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const ensuredFor = useRef<string | null>(null);

  // ---- Session bootstrap + subscription (single source of truth) ----------
  useEffect(() => {
    let active = true;

    // Subscribe FIRST so no event fired during bootstrap is missed.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession) {
        setProfile(null);
        setIsAdmin(false);
        ensuredFor.current = null;
      }
      setLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) console.error("[auth] getSession failed", error);
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      })
      .catch((e) => console.error("[auth] getSession threw", e))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // ---- Profile: only after a real session exists; never blocks auth -------
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    if (ensuredFor.current === uid) return;
    ensuredFor.current = uid;

    let cancelled = false;
    (async () => {
      const authUser = session.user;
      try {
        const { data: existing, error } = await supabase
          .from("profiles")
          .select("id, email, first_name, last_name, avatar_url, auth_provider")
          .eq("id", uid)
          .maybeSingle();
        if (error) throw error;
        if (existing) {
          if (!cancelled) setProfile(existing as AuthProfile);
          return;
        }

        // The DB trigger normally creates this row. This idempotent upsert is
        // the safety net for accounts created before the trigger existed.
        const meta = (authUser.user_metadata ?? {}) as Record<string, string | undefined>;
        const full = meta.full_name ?? meta.name ?? "";
        const row = {
          id: uid,
          email: authUser.email ?? null,
          first_name: meta.first_name ?? meta.given_name ?? full.split(" ")[0] ?? "",
          last_name:
            meta.last_name ?? meta.family_name ?? full.split(" ").slice(1).join(" ") ?? "",
          avatar_url: meta.avatar_url ?? meta.picture ?? null,
          auth_provider: (authUser.app_metadata?.provider as string) ?? "email",
        };
        const { data: upserted, error: upErr } = await supabase
          .from("profiles")
          .upsert(row, { onConflict: "id" })
          .select("id, email, first_name, last_name, avatar_url, auth_provider")
          .maybeSingle();
        if (upErr) throw upErr;
        if (!cancelled && upserted) setProfile(upserted as AuthProfile);
      } catch (e) {
        // Optional data — a failure here must never block authentication.
        console.error("[auth] profile load/create failed", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // ---- Admin role: drives UI affordances only; RLS is the real gate ------
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) {
      setIsAdmin(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("has_role", {
          _user_id: uid,
          _role: "admin",
        });
        if (error) throw error;
        if (!cancelled) setIsAdmin(data === true);
      } catch (e) {
        // Fail closed: a lookup failure must never grant admin affordances.
        console.error("[auth] role load failed", e);
        if (!cancelled) setIsAdmin(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const signIn = useCallback<AuthCtx["signIn"]>(async (rawEmail, password) => {
    const email = rawEmail.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Provider-specific hints are intentionally not surfaced: while Google
      // auth is disabled, every failure gets the same neutral message.
      return { ok: false, error: friendlyAuthError(error, "signin") };
    }
    if (!data.session?.user) {
      console.error("[auth] signin returned no session", data);
      return { ok: false, error: tr("errBadCredentials") };
    }
    return { ok: true };
  }, []);

  const signUp = useCallback<AuthCtx["signUp"]>(async (rawEmail, password, meta) => {
    const email = rawEmail.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: meta.firstName.trim(), last_name: meta.lastName.trim() },
        // Confirmation links are only useful when email delivery is enabled.
        ...(AUTH_EMAILS_ENABLED
          ? { emailRedirectTo: `${window.location.origin}/auth/callback` }
          : {}),
      },
    });
    if (error) return { ok: false, error: friendlyAuthError(error, "signup") };

    // Supabase returns an obfuscated user with no identities when the email
    // already exists. Treat that as "already registered".
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      return { ok: false, error: tr("errEmailInUse") };
    }
    if (!data.session) {
      // Unconfirmed signup is NOT a completed login. With email delivery
      // unavailable we must not claim a confirmation email was sent.
      if (!AUTH_EMAILS_ENABLED) {
        console.warn("[auth] signup created no session and auth emails are disabled");
        return { ok: false, error: tr("errNoAutoActivation") };
      }
      return { ok: true, needsEmailConfirmation: true };
    }
    return { ok: true };
  }, []);

  const signInWithGoogle = useCallback<AuthCtx["signInWithGoogle"]>(async () => {
    // Temporarily disabled because Google authentication is not currently offered.
    // Set GOOGLE_AUTH_ENABLED to true to restore it.
    if (!GOOGLE_AUTH_ENABLED) {
      console.warn("Google authentication is currently disabled.");
      return { ok: false, error: tr("errAuthFailed") };
    }
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });
      if (result.error) {
        console.error("[auth] google sign-in failed", result.error);
        return { ok: false, error: tr("errGoogleFailed") };
      }
      if (result.redirected) return { ok: true, redirected: true };
      return { ok: true };
    } catch (e) {
      console.error("[auth] google sign-in threw", e);
      return { ok: false, error: tr("errGoogleFailed") };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("[auth] signOut failed", e);
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    ensuredFor.current = null;
  }, []);

  const resetPassword = useCallback<AuthCtx["resetPassword"]>(async (rawEmail) => {
    // Temporarily disabled because authentication email delivery is unavailable.
    // Set AUTH_EMAILS_ENABLED to true only after email delivery is configured.
    if (!AUTH_EMAILS_ENABLED) {
      console.warn("Authentication emails are currently disabled.");
      return { ok: false, error: tr("errEmailsUnavailable") };
    }
    const email = rawEmail.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { ok: false, error: friendlyAuthError(error, "reset") };
    return { ok: true };
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      session,
      profile,
      isAdmin,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      resetPassword,
    }),
    [user, session, profile, isAdmin, loading, signIn, signUp, signInWithGoogle, signOut, resetPassword],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
