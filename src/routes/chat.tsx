import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Compass, Send, User, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { troubleshooting } from "@/lib/coach-data";
import { GuestGate } from "@/components/coach/GuestGate";
import { useCoach } from "@/lib/coach-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AutoCoach — AutoCAD Coach" },
      {
        name: "description",
        content: "Ask the AutoCoach AI tutor any AutoCAD question and troubleshoot common command problems.",
      },
      { property: "og:title", content: "AutoCoach — AutoCAD Coach" },
      {
        property: "og:description",
        content: "Ask the AutoCoach AI tutor any AutoCAD question and troubleshoot common command problems.",
      },
      { property: "og:url", content: "https://autocadcoach.lovable.app/chat" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/chat" }],
  }),
  component: CoachPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How do I use TRIM?",
  "What is OFFSET used for?",
  "Why won't my EXTRUDE work?",
  "How do layers work?",
  "What's the difference between LINE and PLINE?",
  "How do I mirror an object?",
];

function CoachPage() {
  const { state } = useCoach();
  const isAuthed = state.profile.isAuthenticated;
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-4 md:py-6 pb-4 md:pb-0 flex flex-col min-h-[calc(100dvh-4rem)] md:min-h-0 md:h-dvh">
      

      <Tabs defaultValue="ask" className="flex-1 flex flex-col min-h-0">
        <TabsList className="self-start">
          <TabsTrigger value="ask">
            <Compass className="size-4 mr-1.5" /> Ask AutoCoach
          </TabsTrigger>
          <TabsTrigger value="troubleshoot">
            <Wrench className="size-4 mr-1.5" /> Troubleshoot
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ask" className="flex-1 min-h-0 mt-4">
          <GuestGate isAuthenticated={isAuthed} message="Sign in to chat with AutoCoach.">
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
    {
      role: "assistant",
      content: "Hi! I'm **AutoCoach**, your AutoCAD tutor. Ask me anything — TRIM, JOIN, EXTRUDE, LAYERS, you name it.",
    },
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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages: newMsgs }),
      });
      if (!res.ok) {
        const raw = await res.text().catch(() => "");
        console.error("[chat] request failed", res.status, raw);
        let message = "AutoCoach hit a snag — please try again.";
        if (res.status === 401) {
          message = "Please sign in to chat with AutoCoach.";
        } else if (res.status === 429) {
          message = "AutoCoach is getting a lot of questions — try again shortly.";
        } else if (res.status === 402) {
          message = "AutoCoach is temporarily out of AI credits.";
        }
        toast.error(message);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Sorry, I couldn't reach AutoCoach right now. Try again in a moment." },
        ]);
      } else {
        const data = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      console.error("[chat] network error", err);
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
            <div
              className={cn(
                "size-8 rounded-full grid place-items-center shrink-0",
                m.role === "assistant" ? "bg-primary/15 text-primary" : "bg-secondary text-foreground",
              )}
            >
              {m.role === "assistant" ? <Compass className="size-4" /> : <User className="size-4" />}
            </div>
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-sm max-w-[80%]",
                m.role === "assistant" ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground",
              )}
            >
              {m.role === "assistant" ? (
                <div
                  className="prose prose-sm prose-invert max-w-none
                  [&>p]:mb-2 [&>p:last-child]:mb-0
                  [&>ol]:mb-2 [&>ol]:pl-4 [&>ol>li]:mb-1
                  [&>ul]:mb-2 [&>ul]:pl-4 [&>ul>li]:mb-1
                  [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mt-3 [&>h3]:mb-1 [&>h3:first-child]:mt-0
                  [&>pre]:bg-background/60 [&>pre]:rounded-lg [&>pre]:p-3 [&>pre]:text-xs [&>pre]:overflow-x-auto [&>pre]:mb-2
                  [&>blockquote]:border-l-2 [&>blockquote]:border-primary/50 [&>blockquote]:pl-3 [&>blockquote]:text-muted-foreground [&>blockquote]:italic [&>blockquote]:mb-2
                  [&_code]:bg-background/60 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-primary [&_code]:text-xs [&_code]:font-mono
                  [&_strong]:text-foreground [&_strong]:font-semibold
                "
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="whitespace-pre-wrap">{m.content}</span>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-primary/15 text-primary grid place-items-center">
              <Compass className="size-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 text-sm bg-secondary text-muted-foreground flex items-center gap-2">
              <span className="inline-flex gap-1">
                <span
                  className="size-1.5 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="size-1.5 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="size-1.5 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
              AutoCoach is thinking…
            </div>
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
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AutoCoach…"
          aria-label="Ask AutoCoach"
          className="bg-card border-border"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
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
        <article
          key={t.title}
          className="rounded-2xl bg-card border border-border p-5 hover:border-primary/40 transition-colors"
        >
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
