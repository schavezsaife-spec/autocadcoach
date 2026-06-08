import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Compass, Send, User, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { troubleshooting } from "@/lib/coach-data";
import { GuestGate } from "@/components/coach/GuestGate";
import { useCoach } from "@/lib/coach-store";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AutoCoach — AutoCAD Coach" }] }),
  component: CoachPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Why is TRIM not working?",
  "How do I use JOIN?",
  "Why won't EXTRUDE work?",
  "What are layers for?",
];

function CoachPage() {
  const { state } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-3.5rem)]">
      <header className="mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/15 text-primary grid place-items-center ring-1 ring-primary/30">
            <Compass className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AutoCoach</h1>
            <p className="text-sm text-muted-foreground">Your AutoCAD tutor &amp; fix-it guide.</p>
          </div>
        </div>
      </header>

      <Tabs defaultValue="ask" className="flex-1 flex flex-col min-h-0">
        <TabsList className="self-start">
          <TabsTrigger value="ask"><Compass className="size-4 mr-1.5" /> Ask AutoCoach</TabsTrigger>
          <TabsTrigger value="troubleshoot"><Wrench className="size-4 mr-1.5" /> Troubleshoot</TabsTrigger>
        </TabsList>
        <TabsContent value="ask" className="flex-1 min-h-0 mt-4">
          <GuestGate isAuthenticated={isAuthed} message="Sign in to chat with AutoCoach and save your conversations.">
            <AskAutoCoach />
          </GuestGate>
        </TabsContent>
        <TabsContent value="troubleshoot" className="flex-1 min-h-0 mt-4 overflow-y-auto">
          <TroubleshootGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AskAutoCoach() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm **AutoCoach**, your AutoCAD tutor. Ask me anything — TRIM, JOIN, EXTRUDE, LAYERS, you name it." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const newMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      if (!res.ok) {
        const errText = await res.text();
        toast.error(errText || "AutoCoach is unavailable.");
        setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't reach AutoCoach right now. Try again in a moment." }]);
      } else {
        const data = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-2xl bg-card border border-border p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
            <div className={cn(
              "size-8 rounded-full grid place-items-center shrink-0",
              m.role === "assistant" ? "bg-primary/15 text-primary" : "bg-secondary text-foreground"
            )}>
              {m.role === "assistant" ? <Compass className="size-4" /> : <User className="size-4" />}
            </div>
            <div className={cn(
              "rounded-2xl px-4 py-2.5 text-sm max-w-[80%] whitespace-pre-wrap",
              m.role === "assistant" ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/15 text-primary grid place-items-center"><Compass className="size-4" /></div>
            <div className="rounded-2xl px-4 py-2.5 text-sm bg-secondary text-muted-foreground">AutoCoach is thinking…</div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="text-xs rounded-full border border-border bg-card hover:border-primary/40 px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); send(input); }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AutoCoach…"
          className="bg-card border-border"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

function TroubleshootGrid() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {troubleshooting.map((t) => (
        <article key={t.title} className="rounded-2xl bg-card border border-border p-5 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" />
            <h2 className="font-semibold text-foreground">{t.title}</h2>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Cause</div>
            <p className="text-sm mt-1">{t.cause}</p>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-primary">
              <Wrench className="size-3" /> Fix
            </div>
            <p className="text-sm mt-1">{t.fix}</p>
          </div>
        </article>
      ))}
    </div>
  );
}