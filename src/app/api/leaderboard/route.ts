import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { Submission } from "@/lib/models/Submission";
import { User } from "@/lib/models/User";
import { Problem } from "@/lib/models/Problem";
export const dynamic = "force-dynamic";


export async function GET(request: NextRequest) {
  try {
    const contestId = request.nextUrl.searchParams.get("contestId");
    await connectDb();

    const match: any = { status: "Accepted" };
    if (contestId && mongoose.Types.ObjectId.isValid(contestId)) {
      match.contestId = new mongoose.Types.ObjectId(contestId);
    }

    // Aggregate points per user
    const stats = await Submission.aggregate([
      { $match: match },
      {
        $group: {
          _id: { userId: "$userId", problemId: "$problemId" },
          bestTime: { $min: "$executionTimeMs" },
          firstAccepted: { $min: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$_id.userId",
          problemsSolved: { $sum: 1 },
          totalTimeMs: { $sum: "$bestTime" },
          lastSubmission: { $max: "$firstAccepted" },
        },
      },
      { $sort: { problemsSolved: -1, totalTimeMs: 1 } },
      { $limit: 100 },
    ]);

    // Populate user info
    const userIds = stats.map((s) => s._id);
    const users = await User.find({ _id: { $in: userIds } }).select("name email image").lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const leaderboard = stats.map((entry, index) => {
      const u = userMap.get(entry._id.toString());
      return {
        rank: index + 1,
        userId: entry._id,
        name: u?.name || "Anonymous",
        email: u?.email || "",
        problemsSolved: entry.problemsSolved,
        score: entry.problemsSolved * 100,
        totalTimeMs: entry.totalTimeMs,
        lastSubmission: entry.lastSubmission,
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("[api/leaderboard] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard." }, { status: 500 });
  }
}