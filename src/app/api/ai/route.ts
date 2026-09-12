import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required." }, { status: 400 });
    }

    const { stream } = await streamChat(messages, context);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("[api/ai] error:", error);
    const msg = error instanceof Error ? error.message : "AI generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}