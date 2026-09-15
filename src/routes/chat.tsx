import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Compass, Send, User, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocalizedTroubleshooting } from "@/lib/i18n/content";
import { GuestGate } from "@/components/coach/GuestGate";
import { useCoach } from "@/lib/coach-store";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: i18n.t("meta:chatTitle") },
      { name: "description", content: i18n.t("meta:chatDesc") },
      { property: "og:title", content: i18n.t("meta:chatTitle") },
      { property: "og:description", content: i18n.t("meta:chatDesc") },
      { property: "og:url", content: "https://autocadcoach.lovable.app/chat" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://autocadcoach.lovable.app/chat" }],
  }),
  component: CoachPage,
});

type Msg = { role: "user" | "assistant"; content: string };

/**
 * The transcript lives in sessionStorage because Radix unmounts the inactive
 * tab: switching to Troubleshoot and back — or leaving /chat — would otherwise
 * drop every message. Scoped per user so a second sign-in on the same browser
 * never inherits someone else's conversation, and session- (not local-)
 * storage so it dies with the browser tab.
 */
const CHAT_STORAGE_PREFIX = "autocadcoach:chat:";

function chatStorageKey(userId: string | undefined) {
  return `${CHAT_STORAGE_PREFIX}${userId ?? "anon"}`;
}

function readStoredMessages(key: string): Msg[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const msgs = parsed.filter(
      (m): m is Msg =>
        typeof m === "object" &&
        m !== null &&
        ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
        typeof (m as Msg).content === "string",
    );
    return msgs.length ? msgs : null;
  } catch {
    // Corrupt or unavailable storage is not worth breaking the page over.
    return null;
  }
}

function CoachPage() {
  const { state, authLoading } = useCoach();
  const { t } = useTranslation(["chat", "gate"]);
  const isAuthed = state.profile.isAuthenticated;
  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-4 md:py-6 pb-6 md:pb-8 flex flex-col min-h-[calc(100dvh-4rem)] md:min-h-0 md:h-dvh" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
      

      <Tabs defaultValue="ask" className="flex-1 flex flex-col min-h-0">
        <TabsList className="self-start">
          <TabsTrigger value="ask">
            <Compass className="size-4 mr-1.5" /> {t("chat:askTab")}
          </TabsTrigger>
          <TabsTrigger value="troubleshoot">
            <Wrench className="size-4 mr-1.5" /> {t("chat:troubleshootTab")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ask" className="flex-1 min-h-0 mt-4">
          <GuestGate isAuthenticated={isAuthed} loading={authLoading} message={t("gate:chatMessage")}>
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
  const { t, i18n: i18nHook } = useTranslation("chat");
  const rawSuggestions = t("suggestions", { returnObjects: true }) as unknown;
  const suggestions: string[] = Array.isArray(rawSuggestions) ? (rawSuggestions as string[]) : [];
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: t("greeting"),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const storageKey = chatStorageKey(user?.id);
  // Hydration happens in an effect, not the useState initializer, so the
  // server-rendered markup and the first client render still agree.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredMessages(storageKey);
    if (stored) setMessages(stored);
    setHydrated(true);
  }, [storageKey]);

  // Persist only after hydration, or the initial greeting would overwrite the
  // saved transcript before we've had a chance to read it back.
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (messages.length <= 1) sessionStorage.removeItem(storageKey);
      else sessionStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // Storage full or blocked (private mode): the chat still works in memory.
    }
  }, [messages, hydrated, storageKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Refresh the initial greeting when language toggles before first message.
  useEffect(() => {
    setMessages((m) => (m.length === 1 && m[0].role === "assistant" ? [{ role: "assistant", content: t("greeting") }] : m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18nHook.language]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const newMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const payload = JSON.stringify({
        messages: newMsgs,
        language: i18nHook.language?.startsWith("es") ? "es" : "en",
      });
      const post = (token: string | undefined) =>
        fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: payload,
        });

      const { data: sessionData } = await supabase.auth.getSession();
      let res = await post(sessionData.session?.access_token);
      // A stale/expired access token on a freshly loaded tab returns 401 even
      // though the user is signed in — refresh once and retry before giving up.
      if (res.status === 401) {
        const { data: refreshed } = await supabase.auth.refreshSession();
        const freshToken = refreshed.session?.access_token;
        if (freshToken) res = await post(freshToken);
      }
      if (!res.ok) {
        const raw = await res.text().catch(() => "");
        console.error("[chat] request failed", res.status, raw);
        let message = t("errGeneric");
        if (res.status === 401) {
          message = t("errSignIn");
        } else if (res.status === 429) {
          message = t("errRate");
        } else if (res.status === 402) {
          message = t("errCredits");
        }
        toast.error(message);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: t("errReply") },
        ]);
      } else {
        const data = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      console.error("[chat] network error", err);
      toast.error(t("errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full pb-2">
      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-2xl bg-card border border-primary/25 ring-1 ring-primary/10 shadow-[0_0_28px_-14px_color-mix(in_oklab,var(--primary)_60%,transparent)] p-4 pb-8 space-y-4">
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
              {t("thinking")}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {suggestions.map((s: string) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="text-xs rounded-full border border-border bg-card hover:border-primary/40 px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
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
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="bg-card border-primary/30 focus-visible:border-primary/60"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-primary to-success text-primary-foreground hover:opacity-90 shadow-[0_0_18px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

function TroubleshootGrid() {
  const { t: tc } = useTranslation("chat");
  const troubleshooting = useLocalizedTroubleshooting();
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {troubleshooting.map((t) => (
        <article
          key={t.title}
          className="rounded-2xl bg-card border border-primary/25 ring-1 ring-primary/10 shadow-[0_0_20px_-12px_color-mix(in_oklab,var(--primary)_55%,transparent)] p-5 hover:border-primary/50 hover:shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-all"
        >
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" />
            <h2 className="font-semibold text-foreground">{t.title}</h2>
          </div>
          <div className="mt-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{tc("cause")}</div>
            <p className="text-sm mt-1">{t.cause}</p>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-success">
              <Wrench className="size-3" /> {tc("fix")}
            </div>
            <p className="text-sm mt-1">{t.fix}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
