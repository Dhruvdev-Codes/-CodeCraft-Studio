import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { getCurrentUser } from "@/lib/auth";

type Context = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const idOrSlug = params.id;
    await connectDb();

    const query = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const course = await Course.findOne(query).lean();
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error) {
    console.error("[api/courses/:id] GET error:", error);
    return NextResponse.json({ error: "Failed to load course." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (user.role !== "developer") {
      return NextResponse.json({ error: "Forbidden — developer access required." }, { status: 403 });
    }

    const body = await request.json();
    await connectDb();
    const course = await Course.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
    return NextResponse.json({ course });
  } catch (error) {
    console.error("[api/courses/:id] PUT error:", error);
    return NextResponse.json({ error: "Failed to update course." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (user.role !== "developer") {
      return NextResponse.json({ error: "Forbidden — developer access required." }, { status: 403 });
    }

    await connectDb();
    const deleted = await Course.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Course not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/courses/:id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete course." }, { status: 500 });
  }
}