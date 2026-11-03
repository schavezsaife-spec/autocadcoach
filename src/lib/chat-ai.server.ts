import {
  generateChatCompletion,
  GatewayError,
  RateLimitError,
  PaymentRequiredError,
  AuthenticationError,
  ConfigurationError,
  PermissionDeniedError,
  TimeoutError,
} from "@lovable.dev/ai-gateway";

export type ChatMsg = { role: "user" | "assistant"; content: string };

// The Lovable AI backup runs on the same server as Gemini (same process.env),
// so it works on every hostname this worker serves — lovable.app and the
// custom domain alike. One overall deadline covers primary + backup + response
// delivery; 25s keeps total waits bounded.
export const OVERALL_BUDGET_MS = 25_000;
export const BACKUP_BUDGET_MS = 12_000;
// Only retry a 5xx when at least this much of the overall budget is left
// (plus whatever the backup needs).
export const MIN_RETRY_MS = 8_000;

const BACKUP_MODEL = "google/gemini-3.8-flash";

export function isBackupConfigured(): boolean {
  return typeof process.env.LOVABLE_API_KEY === "string" && process.env.LOVABLE_API_KEY.length > 0;
}

const isTimeout = (err: unknown) =>
  err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");

const timeoutResponse = () =>
  Response.json({ error: "AutoCoach took too long — please try again." }, { status: 504 });
const snag = () =>
  Response.json({ error: "AutoCoach hit a snag — please try again." }, { status: 502 });

// Map backup failures to distinct statuses so configuration, authentication,
// rate-limit and credit problems are never reported as "busy" or "timed out".
function backupErrorResponse(err: unknown, reason: string, ms: number): Response {
  if (err instanceof RateLimitError) {
    console.error("[api/chat] backup rate_limited ms", ms, "reason", reason);
    return Response.json(
      { error: "AutoCoach is getting a lot of questions — try again shortly." },
      { status: 429 },
    );
  }
  if (err instanceof PaymentRequiredError) {
    console.error("[api/chat] backup payment_required ms", ms, "reason", reason);
    return Response.json(
      { error: "AutoCoach is out of credits right now — please try again later." },
      { status: 402 },
    );
  }
  if (
    err instanceof AuthenticationError ||
    err instanceof ConfigurationError ||
    err instanceof PermissionDeniedError
  ) {
    console.error("[api/chat] backup auth/config error", err.code, "ms", ms, "reason", reason);
    return Response.json({ error: "AutoCoach isn't configured yet." }, { status: 500 });
  }
  console.error(
    "[api/chat] backup failed",
    err instanceof GatewayError ? err.code : (err as Error)?.name,
    "ms",
    ms,
    "reason",
    reason,
  );
  // A backup timeout after a primary timeout really did run out of time; any
  // other backup failure is a snag, not a timeout.
  const timedOut = err instanceof TimeoutError || isTimeout(err);
  return reason === "timeout" && timedOut ? timeoutResponse() : snag();
}

export async function chatWithBackup(opts: {
  systemContent: string;
  messages: ChatMsg[];
  geminiKey: string;
  geminiModel: string;
  useBackup: boolean;
}): Promise<Response> {
  const { systemContent, messages, geminiKey, geminiModel, useBackup } = opts;
  const overallDeadline = Date.now() + OVERALL_BUDGET_MS;
  // When the backup may run, reserve time for it plus response delivery.
  const primaryBudget = useBackup
    ? OVERALL_BUDGET_MS - BACKUP_BUDGET_MS - 1_000
    : OVERALL_BUDGET_MS;

  const call = () =>
    fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${geminiKey}` },
      body: JSON.stringify({
        model: geminiModel,
        reasoning_effort: "low",
        messages: [{ role: "system", content: systemContent }, ...messages],
      }),
      // The signal also covers reading the body in res.json() below.
      signal: AbortSignal.timeout(primaryBudget),
    });

  const backup = async (reason: string): Promise<Response> => {
    const remaining = overallDeadline - Date.now();
    const budget = Math.min(BACKUP_BUDGET_MS, remaining - 500);
    if (budget < 2_000) {
      console.error("[api/chat] backup skipped — no time left, reason", reason);
      return reason === "timeout" ? timeoutResponse() : snag();
    }
    const started = Date.now();
    try {
      const out = await generateChatCompletion(
        {
          model: BACKUP_MODEL,
          reasoning_effort: "low",
          messages: [{ role: "system", content: systemContent }, ...messages],
        },
        { signal: AbortSignal.timeout(budget) },
      );
      const reply = out?.choices?.[0]?.message?.content;
      console.log("[api/chat] backup ms", Date.now() - started, "reason", reason);
      if (typeof reply !== "string" || !reply.trim()) {
        console.error("[api/chat] empty reply from backup");
        return reason === "timeout" ? timeoutResponse() : snag();
      }
      return Response.json({ reply });
    } catch (err) {
      return backupErrorResponse(err, reason, Date.now() - started);
    }
  };

  let res: Response | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    const started = Date.now();
    try {
      res = await call();
      console.log("[api/chat] gemini ms", Date.now() - started, "status", res.status);
      if (res.status === 503 && useBackup) return backup("503");
      if (res.status < 500) break;
      console.error("[api/chat] gemini server error", res.status, "attempt", attempt + 1);
    } catch (err) {
      if (isTimeout(err)) {
        console.error("[api/chat] gemini timeout, attempt", attempt + 1, "ms", Date.now() - started);
        // Budget is spent; never retry Gemini after a timeout.
        return useBackup ? backup("timeout") : timeoutResponse();
      }
      console.error("[api/chat] gemini network error, attempt", attempt + 1, (err as Error)?.name);
      res = undefined;
    }
    const reserve = useBackup ? BACKUP_BUDGET_MS + 1_000 : 0;
    if (attempt === 1 || overallDeadline - Date.now() < MIN_RETRY_MS + reserve)
      break; // no time left for a retry
    await new Promise((r) => setTimeout(r, 1000)); // brief backoff before retrying
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
    if (res.status === 404) console.error("[api/chat] model not found", geminiModel, errBody);
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
    // A timeout while parsing the body still gets the backup.
    if (isTimeout(err)) return useBackup ? backup("timeout") : timeoutResponse();
    return snag();
  }
}
