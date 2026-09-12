import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Submission } from "@/lib/models/Submission";
import { Problem } from "@/lib/models/Problem";
import { getCurrentUser } from "@/lib/auth";
import { runSingleCase } from "@/lib/executor";
import type { LanguageId, SubmissionStatus } from "@/types";
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const problemId = searchParams.get("problemId");
    const contestId = searchParams.get("contestId");

    await connectDb();
    const filter: any = { userId: user.id };
    if (problemId) filter.problemId = problemId;
    if (contestId) filter.contestId = contestId;

    const submissions = await Submission.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("[api/submissions] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const body = await request.json();
    const { problemId, contestId, language, code } = body;

    if (!problemId || !language || !code) {
      return NextResponse.json({ error: "problemId, language, and code are required." }, { status: 400 });
    }

    await connectDb();
    const problem = await Problem.findById(problemId);
    if (!problem) return NextResponse.json({ error: "Problem not found." }, { status: 404 });

    const testCases = problem.testCases || [];
    let overallStatus: SubmissionStatus = "Accepted";
    let maxTimeMs = 0;
    let publicPassed = 0;
    let publicTotal = 0;
    let hiddenPassed = 0;
    let hiddenTotal = 0;

    const caseResults = [];

    for (const tc of testCases) {
      if (tc.hidden) hiddenTotal++;
      else publicTotal++;

      const res = await runSingleCase(language as LanguageId, code, tc);
      if (res.executionTimeMs > maxTimeMs) maxTimeMs = res.executionTimeMs;

      if (res.passed) {
        if (tc.hidden) hiddenPassed++;
        else publicPassed++;
      } else if (overallStatus === "Accepted") {
        overallStatus = res.status;
      }

      caseResults.push({
        passed: res.passed,
        status: res.status,
        hidden: tc.hidden,
        executionTimeMs: res.executionTimeMs,
        stdout: tc.hidden ? "" : res.stdout,
        stderr: tc.hidden ? "" : res.stderr,
        expectedOutput: tc.hidden ? "" : res.expectedOutput,
        actualOutput: tc.hidden ? "" : res.actualOutput,
      });
    }

    const submission = await Submission.create({
      userId: user.id,
      problemId: problem._id,
      contestId: contestId || undefined,
      code,
      language,
      status: overallStatus,
      executionTimeMs: maxTimeMs,
      publicPassed,
      publicTotal,
      hiddenPassed,
      hiddenTotal,
    });

    return NextResponse.json({
      submission,
      caseResults,
    });
  } catch (error) {
    console.error("[api/submissions] POST error:", error);
    return NextResponse.json({ error: "Submission processing failed." }, { status: 500 });
  }
}