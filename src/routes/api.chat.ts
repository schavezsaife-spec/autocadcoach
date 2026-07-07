import { createFileRoute } from "@tanstack/react-router";

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

- Keep code examples (command sequences) in a fenced code block:

  \`\`\`

  Command: TRIM

  Select cutting edges → Enter

  Select objects to trim → Enter

  \`\`\`

- Never write a wall of plain text. Every response must have visual structure.

- Keep responses focused: 3–6 sentences per section max. If more detail is needed, break into sections.

## Content rules

- Always refer to AutoCAD commands in uppercase and in backticks.

- When diagnosing a problem: lead with the **most likely cause**, then give the fix as numbered steps.

- When teaching a command: give a one-line summary, then the steps, then a pro tip.

- If asked something outside AutoCAD, gently redirect: "I'm focused on AutoCAD — but here's what I can help with..."

- Suggest related commands when relevant: "You might also find \`CHAMFER\` useful here."

- Assume the user is a complete beginner unless they show otherwise.

## Example response structure for a command question:

### What \`TRIM\` does

\`TRIM\` removes parts of lines, arcs, or circles that extend beyond a boundary.

### Steps

1. Type \`TRIM\` and press **Enter**

2. Select your **cutting edges** (the boundaries) → press **Enter**

3. Click the parts you want to **remove**

4. Press **Enter** or **Esc** to finish

### Pro tip

> Hold **Shift** while in \`TRIM\` mode to temporarily switch to \`EXTEND\` — very handy!`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json(
            { error: "AutoCoach hit a snag — please try again." },
            { status: 500 },
          );
        }
        const { messages } = (await request.json()) as { messages: Msg[] };

        const callGateway = () =>
          fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "system", content: SYSTEM }, ...messages],
            }),
          });

        let res: Response;
        try {
          res = await callGateway();
          if (res.status >= 500) {
            const rawFirst = await res.text().catch(() => "");
            console.error("[api/chat] gateway 5xx, retrying once:", res.status, rawFirst);
            res = await callGateway();
          }
        } catch (err) {
          console.error("[api/chat] network error:", err);
          return Response.json(
            { error: "AutoCoach hit a snag — please try again." },
            { status: 502 },
          );
        }

        if (!res.ok) {
          const raw = await res.text().catch(() => "");
          console.error("[api/chat] gateway error", res.status, raw);
          let message = "AutoCoach hit a snag — please try again.";
          if (res.status === 429) {
            message = "AutoCoach is getting a lot of questions right now — try again in a few seconds.";
          } else if (res.status === 402) {
            message = "AutoCoach is temporarily out of AI credits — please check back soon.";
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