import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Contest } from "@/lib/models/Contest";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDb();
    const contests = await Contest.find({}).sort({ startTime: -1 }).lean();
    return NextResponse.json({ contests });
  } catch (error) {
    console.error("[api/contests] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch contests." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      return NextResponse.json({ error: "Forbidden — developer access required." }, { status: 403 });
    }

    const body = await request.json();
    await connectDb();
    const contest = await Contest.create(body);
    return NextResponse.json({ contest }, { status: 201 });
  } catch (error) {
    console.error("[api/contests] POST error:", error);
    return NextResponse.json({ error: "Failed to create contest." }, { status: 500 });
  }
}