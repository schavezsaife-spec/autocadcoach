import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  OperationFailedError,
  PaymentRequiredError,
  RateLimitError,
  AuthenticationError,
  TimeoutError,
} from "@lovable.dev/ai-gateway";

vi.mock("@lovable.dev/ai-gateway", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lovable.dev/ai-gateway")>();
  return { ...actual, generateChatCompletion: vi.fn() };
});

import { generateChatCompletion } from "@lovable.dev/ai-gateway";
import { chatWithBackup, isBackupConfigured, OVERALL_BUDGET_MS, BACKUP_BUDGET_MS } from "./chat-ai.server";

const genMock = vi.mocked(generateChatCompletion);

const timeoutErr = () => Object.assign(new Error("The operation was aborted"), { name: "TimeoutError" });
const okReply = (content = "Hello!") =>
  ({ choices: [{ message: { content } }] }) as unknown as Awaited<ReturnType<typeof generateChatCompletion>>;

const geminiResponse = (
  status: number,
  body: unknown,
  overrides: Partial<{ json: () => Promise<unknown> }> = {},
) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: String(status),
    json: overrides.json ?? (async () => body),
    text: async () => JSON.stringify(body),
  }) as unknown as Response;

const OPTS = {
  systemContent: "sys",
  messages: [{ role: "user" as const, content: "hi" }],
  geminiKey: "k",
  geminiModel: "gemini-3.8-flash",
};

beforeEach(() => {
  vi.unstubAllGlobals();
  genMock.mockReset();
  process.env.LOVABLE_API_KEY = "test-key";
});

describe("chatWithBackup", () => {
  it("primary success → no backup, returns Gemini reply", async () => {
    const fetchMock = vi.fn().mockResolvedValue(geminiResponse(200, { choices: [{ message: { content: "Hi!" } }] }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reply: "Hi!" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(genMock).not.toHaveBeenCalled();
  });

  it("primary timeout before headers → backup runs and answers", async () => {
    const fetchMock = vi.fn().mockRejectedValue(timeoutErr());
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockResolvedValue(okReply());
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reply: "Hello!" });
    expect(fetchMock).toHaveBeenCalledTimes(1); // no retry after a timeout
    expect(genMock).toHaveBeenCalledTimes(1);
  });

  it("primary timeout during body parsing → backup runs and answers", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(geminiResponse(200, {}, { json: async () => { throw timeoutErr(); } }));
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockResolvedValue(okReply());
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reply: "Hello!" });
    expect(genMock).toHaveBeenCalledTimes(1);
  });

  it("primary 503 → backup runs (hostname-independent: selection is env-based)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(geminiResponse(503, { error: "high demand" }));
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockResolvedValue(okReply("From backup"));
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reply: "From backup" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("primary timeout + backup generic failure → 502 snag, sanitized log", async () => {
    const fetchMock = vi.fn().mockRejectedValue(timeoutErr());
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockRejectedValue(new OperationFailedError("boom"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "AutoCoach hit a snag — please try again." });
    errSpy.mockRestore();
  });

  it("primary timeout + backup timeout → 504 took too long", async () => {
    const fetchMock = vi.fn().mockRejectedValue(timeoutErr());
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockRejectedValue(new TimeoutError("backup timed out"));
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(504);
    expect(await res.json()).toEqual({ error: "AutoCoach took too long — please try again." });
  });

  it("backup payment_required → 402 credits message", async () => {
    const fetchMock = vi.fn().mockRejectedValue(timeoutErr());
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockRejectedValue(new PaymentRequiredError("no credits"));
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(402);
    const body = await res.json();
    expect(body.error).toMatch(/credits/i);
    expect(body.error).not.toMatch(/snag|too long/);
  });

  it("backup rate_limited → 429 busy message", async () => {
    const fetchMock = vi.fn().mockRejectedValue(timeoutErr());
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockRejectedValue(new RateLimitError("slow down"));
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toMatch(/questions/i);
  });

  it("backup authentication error → 500 not configured (not 'busy')", async () => {
    const fetchMock = vi.fn().mockRejectedValue(timeoutErr());
    vi.stubGlobal("fetch", fetchMock);
    genMock.mockRejectedValue(new AuthenticationError("bad key"));
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "AutoCoach isn't configured yet." });
  });

  it("backup disabled → 503 retries once then 502; backup never called", async () => {
    delete process.env.LOVABLE_API_KEY;
    const fetchMock = vi.fn().mockResolvedValue(geminiResponse(503, { error: "high demand" }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await chatWithBackup({ ...OPTS, useBackup: isBackupConfigured() });
    expect(res.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(2); // one retry for 5xx, as before
    expect(genMock).not.toHaveBeenCalled();
  });

  it("gemini 429 → 429 busy message, no backup", async () => {
    const fetchMock = vi.fn().mockResolvedValue(geminiResponse(429, { error: "quota" }));
    vi.stubGlobal("fetch", fetchMock);
    const res = await chatWithBackup({ ...OPTS, useBackup: true });
    expect(res.status).toBe(429);
    expect(genMock).not.toHaveBeenCalled();
  });

  it("time budgets leave room for the backup inside one overall deadline", () => {
    expect(BACKUP_BUDGET_MS).toBeLessThan(OVERALL_BUDGET_MS);
    expect(OVERALL_BUDGET_MS - BACKUP_BUDGET_MS).toBeGreaterThanOrEqual(10_000);
  });
});
