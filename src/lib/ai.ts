import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIContext, ChatMessage } from "@/types";

// ============================================================================
// CodeCraft AI — multi-provider LLM layer.
// Gemini is preferred; Groq is used as a fast fallback. The active editor
// context (code, language, page, problem description) is injected so the AI
// can act as a context-aware mentor instead of a generic chatbot.
// ============================================================================

function buildSystemPrompt(context?: AIContext): string {
  const ctx = [
    "You are CodeCraft AI, the built-in coding mentor of CodeCraft Studio.",
    "You help students learn programming, debug code, understand CS concepts,",
    "and prepare for coding contests — in Python, Java, JavaScript, C++, C, and Go.",
    "Rules:",
    "- Never hand over a complete solution to a problem a student is currently solving.",
    "  Instead, guide with hints, analogies, minimal code sketches, and pointed questions.",
    "- If the student is NOT solving a problem, full working examples are welcome.",
    "- Be concise, structured, and friendly. Use short markdown (headings, bullets, code blocks).",
    "- When asked to debug, point to the exact lines at fault and explain the reasoning.",
  ].join("\n");

  if (!context) return ctx;

  const parts: string[] = [ctx];
  if (context.page) parts.push(`\nCurrent page: ${context.page}.`);
  if (context.language) parts.push(`\nActive editor language: ${context.language}.`);
  if (context.problemTitle) {
    parts.push(`\nActive problem: ${context.problemTitle}.`);
  }
  if (context.problemDescription) {
    parts.push(`\nProblem statement:\n${context.problemDescription.slice(0, 1500)}`);
  }
  if (context.code) {
    parts.push(`\nActive editor code:\n\`\`\`\n${context.code.slice(0, 4000)}\n\`\`\``);
  }
  return parts.join("\n");
}

function requireProvider(): "gemini" | "groq" | null {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GROQ_API_KEY) return "groq";
  return null;
}

async function streamGemini(messages: ChatMessage[], context?: AIContext): Promise<ReadableStream<Uint8Array>> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    systemInstruction: buildSystemPrompt(context),
  });

  const history = messages
    .slice(0, -1)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))
    .filter((m) => m.parts[0].text.trim().length > 0);

  const chat = model.startChat({ history });
  const last = messages[messages.length - 1];
  const result = await chat.sendMessageStream(last.content);

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (error) {
        console.error("[ai] gemini stream error", error);
        controller.enqueue(
          encoder.encode("\n\n_[The AI stream was interrupted. Please try again.]_")
        );
      }
      controller.close();
    },
  });
}

async function streamGroq(messages: ChatMessage[], context?: AIContext): Promise<ReadableStream<Uint8Array>> {
  const groqMessages = [
    { role: "system", content: buildSystemPrompt(context) },
    ...messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.4,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Groq request failed with status ${res.status}`);
  }

  const encoder = new TextEncoder();
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") break;
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // skip malformed chunk
            }
          }
        }
      } catch (error) {
        console.error("[ai] groq stream error", error);
      }
      controller.close();
    },
  });
}

/** Stream an AI reply for the given chat history + editor context. */
export async function streamChat(
  messages: ChatMessage[],
  context?: AIContext
): Promise<{ provider: string; stream: ReadableStream<Uint8Array> }> {
  const provider = requireProvider();
  if (provider === "gemini") {
    return { provider: "gemini", stream: await streamGemini(messages, context) };
  }
  if (provider === "groq") {
    return { provider: "groq", stream: await streamGroq(messages, context) };
  }
  throw new Error(
    "CodeCraft AI is not configured yet. Add GEMINI_API_KEY or GROQ_API_KEY to `.env.local`."
  );
}