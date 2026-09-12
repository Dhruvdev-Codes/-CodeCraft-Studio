import { NextRequest, NextResponse } from "next/server";
import { execute, LANGUAGES } from "@/lib/executor";
import type { LanguageId } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { language, code, stdin } = await request.json();

    if (!language || !code) {
      return NextResponse.json({ error: "Language and code are required." }, { status: 400 });
    }

    if (!LANGUAGES[language as LanguageId]) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
    }

    const result = await execute(language as LanguageId, code, stdin || "");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/execute] error:", error);
    return NextResponse.json({ error: "Code execution failed." }, { status: 500 });
  }
}