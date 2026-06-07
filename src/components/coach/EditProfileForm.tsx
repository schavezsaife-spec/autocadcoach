import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCoach } from "@/lib/coach-store";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";

export function EditProfileForm() {
  const { state, set } = useCoach();
  const p = state.profile;
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(p.firstName);
  const [lastName, setLastName] = useState(p.lastName);
  const [email, setEmail] = useState(p.email);

  function reset() {
    setFirstName(p.firstName);
    setLastName(p.lastName);
    setEmail(p.email);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      toast.error("First name and email are required");
      return;
    }
    // TODO: persist these changes to Supabase profiles table.
    set({
      profile: {
        ...p,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      },
    });
    toast.success("Profile updated");
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Account details</div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
            className="border-border"
          >
            <Pencil className="size-3.5 mr-1.5" /> Edit profile
          </Button>
        </div>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <Row label="First name" value={p.firstName || "—"} />
          <Row label="Last name" value={p.lastName || "—"} />
          <Row label="Email" value={p.email || "—"} />
          <Row
            label="Sign-in method"
            value={p.authProvider === "google" ? "Google" : "Email"}
          />
        </dl>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="rounded-2xl bg-card border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Edit profile</div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            reset();
            setEditing(false);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-secondary border-border" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-secondary border-border" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Save changes</Button>
        <Button type="button" variant="outline" className="border-border" onClick={() => { reset(); setEditing(false); }}>Cancel</Button>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium break-words">{value}</dd>
    </div>
  );
}