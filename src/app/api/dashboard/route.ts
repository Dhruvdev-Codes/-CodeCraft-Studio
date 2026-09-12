import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Submission } from "@/lib/models/Submission";
import { Problem } from "@/lib/models/Problem";
import { Course } from "@/lib/models/Course";
import { Contest } from "@/lib/models/Contest";
import { getCurrentUser } from "@/lib/auth";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    await connectDb();

    // 1. Solved problems count
    const acceptedSubmissions = await Submission.find({
      userId: user.id,
      status: "Accepted",
    }).select("problemId executionTimeMs createdAt").lean();

    const uniqueSolvedIds = new Set(
      acceptedSubmissions.map((s) => s.problemId?.toString()).filter(Boolean)
    );

    // 2. Recent activity
    const recentSubmissions = await Submission.find({ userId: user.id })
      .populate("problemId", "title slug difficulty")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // 3. Overall counts
    const totalProblems = await Problem.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeContests = await Contest.find({
      endTime: { $gte: new Date() },
    })
      .sort({ startTime: 1 })
      .limit(3)
      .lean();

    return NextResponse.json({
      stats: {
        solvedCount: uniqueSolvedIds.size,
        totalProblems,
        totalCourses,
        submissionsCount: await Submission.countDocuments({ userId: user.id }),
      },
      recentSubmissions,
      activeContests,
    });
  } catch (error) {
    console.error("[api/dashboard] error:", error);
    return NextResponse.json({ error: "Failed to load dashboard." }, { status: 500 });
  }
}