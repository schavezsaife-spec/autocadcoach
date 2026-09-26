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
        const SUPABASE_URL = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY =
          process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
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

        const key = process.env.GEMINI_API_KEY;
        if (!key) {
          console.error("[api/chat] GEMINI_API_KEY not set");
          return Response.json({ error: "AutoCoach isn't configured yet." }, { status: 500 });
        }
        let body: { messages?: Msg[]; language?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }
        const messages = (Array.isArray(body.messages) ? body.messages : [])
          .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
          .slice(-20);
        const lang = body.language === "es" ? "es" : "en";
        const systemContent =
          SYSTEM +
          (lang === "es"
            ? "\n\n## Language\n- Respond in Spanish (español). Keep AutoCAD command names in uppercase English (e.g. `TRIM`, `EXTRUDE`). Translate all explanatory prose."
            : "\n\n## Language\n- Respond in English.");
        const call = () =>
          fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
            body: JSON.stringify({
              model: "gemini-2.5-flash",
              messages: [{ role: "system", content: systemContent }, ...messages],
            }),
          });
        let res: Response;
        try {
          res = await call();
          if (res.status >= 500) res = await call();
        } catch (err) {
          console.error("[api/chat] network error:", err);
          return Response.json({ error: "AutoCoach hit a snag — please try again." }, { status: 502 });
        }
        if (!res.ok) {
          console.error("[api/chat] gemini error", res.status, await res.text().catch(() => ""));
          if (res.status === 429)
            return Response.json(
              { error: "AutoCoach is getting a lot of questions — try again shortly." },
              { status: 429 },
            );
          return Response.json({ error: "AutoCoach hit a snag — please try again." }, { status: 502 });
        }
        try {
          const data = await res.json();
          return Response.json({
            reply: data?.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that.",
          });
        } catch {
          return Response.json({ error: "AutoCoach hit a snag — please try again." }, { status: 502 });
        }
      },
    },
  },
});
