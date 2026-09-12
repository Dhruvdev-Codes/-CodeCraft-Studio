import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { Contest } from "@/lib/models/Contest";
import { Problem } from "@/lib/models/Problem";
import { getCurrentUser } from "@/lib/auth";

type Context = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    await connectDb();
    const idOrSlug = params.id;
    const query = mongoose.Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

    const contest = await Contest.findOne(query).populate("problems.problemId").lean();
    if (!contest) return NextResponse.json({ error: "Contest not found." }, { status: 404 });

    return NextResponse.json({ contest });
  } catch (error) {
    console.error("[api/contests/:id] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch contest." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      return NextResponse.json({ error: "Forbidden — developer access required." }, { status: 403 });
    }

    const body = await request.json();
    await connectDb();
    const contest = await Contest.findByIdAndUpdate(params.id, body, { new: true });
    if (!contest) return NextResponse.json({ error: "Contest not found." }, { status: 404 });
    return NextResponse.json({ contest });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contest." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      return NextResponse.json({ error: "Forbidden — developer access required." }, { status: 403 });
    }

    await connectDb();
    await Contest.findByIdAndDelete(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete contest." }, { status: 500 });
  }
}