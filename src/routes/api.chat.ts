import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

type Msg = { role: "user" | "assistant" | "system"; content: string };

// gemini-2.5-flash is now limited to legacy users; Google recommends 3.8 Flash for new projects.
const GEMINI_MODEL = "gemini-3.8-flash";
const GEMINI_TIMEOUT_MS = 45_000;
const MAX_BODY_BYTES = 160 * 1024;
const MAX_MESSAGE_CHARS = 4_000;

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
        const snag = () =>
          Response.json({ error: "AutoCoach hit a snag — please try again." }, { status: 502 });
        const invalid = () => Response.json({ error: "Invalid request." }, { status: 400 });
        const tooLarge = () => Response.json({ error: "Message too long." }, { status: 413 });

        const declared = Number(request.headers.get("content-length") ?? "0");
        if (declared > MAX_BODY_BYTES) return tooLarge();
        let rawBody: string;
        try {
          rawBody = await request.text();
        } catch {
          return invalid();
        }
        if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) return tooLarge();
        let body: { messages?: Msg[]; language?: string };
        try {
          body = JSON.parse(rawBody);
        } catch {
          return invalid();
        }
        const messages = (Array.isArray(body?.messages) ? body.messages : [])
          .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
          .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }))
          .filter((m) => m.content.length > 0)
          .slice(-20);
        if (messages.length === 0 || messages[messages.length - 1].role !== "user") return invalid();
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
              model: GEMINI_MODEL,
              reasoning_effort: "low",
              messages: [{ role: "system", content: systemContent }, ...messages],
            }),
            signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
          });
        const isTimeout = (err: unknown) =>
          err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
        const timeoutResponse = () =>
          Response.json({ error: "AutoCoach took too long — please try again." }, { status: 504 });

        let res: Response | undefined;
        for (let attempt = 0; attempt < 2; attempt++) {
          const started = Date.now();
          try {
            res = await call();
            console.log("[api/chat] gemini ms", Date.now() - started, "status", res.status);
            if (res.status < 500) break;
            console.error("[api/chat] gemini server error", res.status, "attempt", attempt + 1);
          } catch (err) {
            if (isTimeout(err)) {
              console.error("[api/chat] gemini timeout, attempt", attempt + 1, "ms", Date.now() - started);
              return timeoutResponse(); // never retry a timeout
            } else {
              console.error("[api/chat] network error, attempt", attempt + 1, (err as Error)?.name);
              if (attempt === 1) return snag();
            }
            res = undefined;
          }
        }
        if (!res) return snag();
        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          if (res.status === 429) {
            console.error("[api/chat] gemini rate limited 429", errBody);
            return Response.json(
              { error: "AutoCoach is getting a lot of questions — try again shortly." },
              { status: 429 },
            );
          }
          if (res.status === 404) console.error("[api/chat] model not found", GEMINI_MODEL, errBody);
          else if (res.status === 400 || res.status === 401 || res.status === 403)
            console.error(`[api/chat] gemini rejected key or request ${res.status}`, errBody);
          else console.error("[api/chat] gemini error", res.status, errBody);
          return snag();
        }
        try {
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (typeof reply !== "string" || !reply.trim()) {
            console.error("[api/chat] empty reply from gemini");
            return snag();
          }
          return Response.json({ reply });
        } catch (err) {
          if (isTimeout(err)) return timeoutResponse();
          return snag();
        }
      },
    },
  },
});
