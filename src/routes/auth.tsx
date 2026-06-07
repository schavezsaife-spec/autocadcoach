import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCoach } from "@/lib/coach-store";
import { toast } from "sonner";
import { Compass, Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AutoCAD Coach" },
      { name: "description", content: "Create your account or sign in to AutoCAD Coach." },
    ],
  }),
  component: AuthPage,
});

type Mode = "signup" | "signin";

function AuthPage() {
  const { set } = useCoach();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function emailValid(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "signup" && !firstName.trim()) {
      toast.error("Please enter your first name");
      return;
    }
    if (!emailValid(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    // TODO: Replace with real Supabase auth.
    // signup: await supabase.auth.signUp({ email, password, options: { data: { first_name, last_name }, emailRedirectTo: window.location.origin } })
    // signin: await supabase.auth.signInWithPassword({ email, password })
    setTimeout(() => {
      set({
        profile: {
          firstName: firstName.trim() || email.split("@")[0],
          lastName: lastName.trim(),
          email: email.trim(),
          profileImage: null,
          authProvider: "email",
          isAuthenticated: true,
        },
      });
      toast.success(mode === "signup" ? "Account created!" : "Welcome back!");
      setLoading(false);
      navigate({ to: "/dashboard" });
    }, 400);
  }

  function handleGoogle() {
    setGoogleLoading(true);
    // TODO: Replace with real Google OAuth.
    // Lovable Cloud:
    //   import { lovable } from "@/integrations/lovable/index";
    //   await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    // Firebase:
    //   await signInWithPopup(auth, new GoogleAuthProvider());
    setTimeout(() => {
      set({
        profile: {
          firstName: "Google",
          lastName: "User",
          email: "google.user@example.com",
          profileImage: null,
          authProvider: "google",
          isAuthenticated: true,
        },
      });
      toast.success("Signed in with Google");
      setGoogleLoading(false);
      navigate({ to: "/dashboard" });
    }, 400);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="size-9 rounded-xl bg-primary/15 text-primary grid place-items-center ring-1 ring-primary/30">
            <Compass className="size-5" />
          </div>
          <span className="font-semibold tracking-tight">AutoCAD Coach</span>
        </Link>

        <div className="rounded-2xl bg-card/80 backdrop-blur border border-border p-6 sm:p-8 shadow-[var(--shadow-glow)]">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup"
              ? "Start learning AutoCAD — track XP, projects, and quizzes."
              : "Sign in to continue your learning streak."}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="mt-6 w-full border-border bg-secondary hover:bg-secondary/80"
          >
            {googleLoading ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <GoogleIcon className="size-4 mr-2" />
            )}
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              or {mode === "signup" ? "sign up" : "sign in"} with email
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sofia"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Chavez"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 grid place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]"
            >
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === "signup" ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Created by <span className="text-primary">Sofia Chavez Saife</span>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41 35.6 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}