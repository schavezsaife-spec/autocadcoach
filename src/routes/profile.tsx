import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCoach } from "@/lib/coach-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { lessons } from "@/lib/coach-data";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AutoCAD Coach" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, set, totalXp, progressPct } = useCoach();

  if (state.profile.signedIn) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-6">
        <div className="rounded-2xl bg-card border border-border p-6 flex items-center gap-4">
          <div className="size-14 rounded-full bg-primary/15 text-primary grid place-items-center ring-1 ring-primary/30">
            <User className="size-6" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">{state.profile.name || "AutoCAD Learner"}</div>
            <div className="text-sm text-muted-foreground">{state.profile.email}</div>
          </div>
          <Button
            variant="outline"
            onClick={() => { set({ profile: { name: "", email: "", signedIn: false } }); toast("Signed out"); }}
          >
            <LogOut className="size-4 mr-1" /> Sign out
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="XP" value={totalXp} />
          <Stat label="Lessons" value={`${state.completedLessons.length}/${lessons.length}`} />
          <Stat label="Progress" value={`${progressPct}%`} />
        </div>

        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="font-semibold mb-3">Completed lessons</div>
          {state.completedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing yet — start your first lesson!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {state.completedLessons.map((id) => {
                const l = lessons.find((x) => x.id === id);
                return l && <Badge key={id} className="bg-primary/15 text-primary border-primary/30">{l.title}</Badge>;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome</h1>
      <p className="text-muted-foreground mb-6">Sign in to save your progress. (Stored locally for now.)</p>
      <Tabs defaultValue="signin">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin"><AuthForm mode="signin" /></TabsContent>
        <TabsContent value="signup"><AuthForm mode="signup" /></TabsContent>
      </Tabs>
    </div>
  );
}

function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const { set } = useCoach();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form
      className="space-y-4 mt-6 rounded-2xl bg-card border border-border p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        set({ profile: { name: name || email.split("@")[0], email, signedIn: true } });
        toast.success(mode === "signin" ? "Welcome back!" : "Account created!");
      }}
    >
      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sofia" className="bg-secondary border-border" />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary border-border" />
      </div>
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {mode === "signin" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}