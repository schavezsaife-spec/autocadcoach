import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM = `You are AutoCoach, a friendly tutor for absolute beginners learning AutoCAD.
Rules:
- Answer in simple, encouraging language.
- Be concise: use short paragraphs and numbered steps when helpful.
- Refer to AutoCAD commands in CAPS (e.g., TRIM, JOIN, EXTRUDE, OFFSET, LAYERS).
- If the user has a problem, explain the likely cause first, then the fix.
- Avoid jargon. Assume the learner is brand new.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const { messages } = (await request.json()) as { messages: Msg[] };

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: SYSTEM }, ...messages],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          if (res.status === 429) return new Response("Rate limited. Try again in a moment.", { status: 429 });
          if (res.status === 402) return new Response("AI credits exhausted. Add credits in workspace billing.", { status: 402 });
          return new Response(text || "AI error", { status: res.status });
        }

        const data = await res.json();
        const reply: string = data?.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that.";
        return Response.json({ reply });
      },
    },
  },
});