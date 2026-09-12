import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Problem, ProblemDoc } from "@/lib/models/Problem";
import { getCurrentUser } from "@/lib/auth";

/** Returns the list of problems (omits testCases list for lightweight loading). */
export async function GET() {
  try {
    await connectDb();
    const problems = await Problem.find({})
      .select("-testCases")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ problems });
  } catch (error) {
    console.error("[api/problems] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch problems." }, { status: 500 });
  }
}

/** Create a new problem (developer only). */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    await connectDb();
    const problem = await Problem.create(body);
    return NextResponse.json({ problem }, { status: 201 });
  } catch (error) {
    console.error("[api/problems] POST error:", error);
    return NextResponse.json({ error: "Failed to create problem." }, { status: 500 });
  }
}