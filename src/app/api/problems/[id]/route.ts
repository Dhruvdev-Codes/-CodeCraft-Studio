import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { Problem } from "@/lib/models/Problem";
import { getCurrentUser } from "@/lib/auth";

type Context = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    await connectDb();
    const idOrSlug = params.id;
    const query = mongoose.Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    const problem = await Problem.findOne(query).lean();
    if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });

    // Hide hidden test outputs and inputs from regular users
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      problem.testCases = (problem.testCases || []).map((t: any) =>
        t.hidden ? { hidden: true, input: "", expectedOutput: "" } : t
      );
    }
    return NextResponse.json({ problem });
  } catch (error) {
    console.error("[api/problems/:id] GET error:", error);
    return NextResponse.json({ error: "Failed to load problem." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    await connectDb();
    const problem = await Problem.findByIdAndUpdate(params.id, body, { new: true });
    if (!problem) return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    return NextResponse.json({ problem });
  } catch (error) {
    console.error("[api/problems/:id] PUT error:", error);
    return NextResponse.json({ error: "Failed to update problem." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDb();
    await Problem.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete problem." }, { status: 500 });
  }
}