import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM = `You are AutoCoach, an expert AutoCAD tutor built into AutoCAD Coach — a beginner-friendly learning platform. You are knowledgeable, encouraging, and precise.

## Your persona
- Speak like a patient, experienced CAD instructor — warm but efficient.
- Never condescending. Celebrate small wins ("Great question!", "That's a common one!").
- You know AutoCAD inside-out: 2D drafting, 3D modeling, layers, blocks, layouts, plotting, dynamic blocks, constraints, and all core commands.

## Formatting rules (CRITICAL — always follow these)
- Use **markdown** in every response. The UI renders it fully.
- For step-by-step instructions, always use a numbered list.
- For tips, warnings, or notes, use bullet points (- item).
- Wrap every AutoCAD command in backticks: \`TRIM\`, \`EXTRUDE\`, \`OFFSET\`, \`LAYER\`.
- Use **bold** for key terms and important warnings.
- Use ### headings to separate sections when the answer has multiple parts.
- Keep code examples (command sequences) in a fenced code block.
- Never write a wall of plain text. Every response must have visual structure.
- Keep responses focused: 3–6 sentences per section max.

## Content rules
- Always refer to AutoCAD commands in uppercase and in backticks.
- When diagnosing a problem: lead with the **most likely cause**, then give the fix as numbered steps.
- When teaching a command: give a one-line summary, then the steps, then a pro tip.
- If asked something outside AutoCAD, gently redirect.
- Suggest related commands when relevant.
- Assume the user is a complete beginner unless they show otherwise.`;

// In-memory rate limit: 15 req/min per authenticated user.
// Note: Cloudflare Workers are stateless — this is a best-effort per-instance limiter.
const RATE_LIMIT = 15;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(userId);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= RATE_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Verify Supabase session via Bearer token.
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return Response.json({ error: "Server misconfigured." }, { status: 500 });
        }
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        if (!token) {
          return Response.json(
            { error: "You need to be signed in to chat with AutoCoach." },
            { status: 401 },
          );
        }
        const authClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userErr } = await authClient.auth.getUser(token);
        if (userErr || !userData.user) {
          return Response.json(
            { error: "Session expired — please sign in again." },
            { status: 401 },
          );
        }

        // 2. Rate limit per user.
        const rl = checkRateLimit(userData.user.id);
        if (!rl.ok) {
          return Response.json(
            { error: "AutoCoach is getting a lot of questions — try again shortly." },
            { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
          );
        }

        // Providers in priority order: direct Gemini first, Lovable gateway as fallback.
        // Both speak the OpenAI chat-completions format.
        const providers: {
          name: string;
          url: string;
          headers: Record<string, string>;
          model: string;
        }[] = [];
        const geminiKey = process.env.GEMINI_API_KEY;
        if (geminiKey) {
          providers.push({
            name: "gemini",
            url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            headers: { Authorization: `Bearer ${geminiKey}` },
            model: "gemini-2.5-flash",
          });
        }
        const lovableKey = process.env.LOVABLE_API_KEY;
        if (lovableKey) {
          providers.push({
            name: "lovable",
            url: "https://ai.gateway.lovable.dev/v1/chat/completions",
            headers: { "Lovable-API-Key": lovableKey },
            model: "google/gemini-2.5-flash",
          });
        }
        if (providers.length === 0) {
          console.error("[api/chat] no AI provider configured (GEMINI_API_KEY / LOVABLE_API_KEY)");
          return Response.json(
            { error: "AutoCoach hit a snag — please try again." },
            { status: 500 },
          );
        }
        const body = (await request.json()) as { messages: Msg[]; language?: string };
        const messages = body.messages;
        const lang = body.language === "es" ? "es" : "en";
        const languageInstruction =
          lang === "es"
            ? "\n\n## Language\n- Respond in Spanish (español). Keep AutoCAD command names in uppercase English (e.g. `TRIM`, `EXTRUDE`). Translate all explanatory prose."
            : "\n\n## Language\n- Respond in English.";
        const systemContent = SYSTEM + languageInstruction;

        const callProvider = (p: (typeof providers)[number]) =>
          fetch(p.url, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...p.headers },
            body: JSON.stringify({
              model: p.model,
              messages: [{ role: "system", content: systemContent }, ...messages],
            }),
          });

        // Try each provider (retrying once on 5xx); fall through to the next on any failure.
        let res: Response | undefined;
        for (const p of providers) {
          try {
            res = await callProvider(p);
            if (res.status >= 500) {
              const rawFirst = await res.text().catch(() => "");
              console.error(`[api/chat] ${p.name} 5xx, retrying once:`, res.status, rawFirst);
              res = await callProvider(p);
            }
          } catch (err) {
            console.error(`[api/chat] ${p.name} network error:`, err);
            res = undefined;
            continue;
          }
          if (res.ok) break;
          const raw = await res.text().catch(() => "");
          console.error(`[api/chat] ${p.name} error`, res.status, raw);
        }

        if (!res) {
          return Response.json(
            { error: "AutoCoach hit a snag — please try again." },
            { status: 502 },
          );
        }

        if (!res.ok) {
          let message = "AutoCoach hit a snag — please try again.";
          if (res.status === 429) {
            message = "AutoCoach is getting a lot of questions — try again shortly.";
          } else if (res.status === 402) {
            message = "AutoCoach is temporarily out of AI credits.";
          }
          return Response.json({ error: message }, { status: res.status });
        }

        const data = await res.json();
        const reply: string = data?.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that.";
        return Response.json({ reply });
      },
    },
  },
});
