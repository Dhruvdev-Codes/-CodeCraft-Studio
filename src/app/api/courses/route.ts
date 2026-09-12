import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDb();
    const courses = await Course.find({}).sort({ order: 1 }).lean();
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("[api/courses] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch courses." }, { status: 500 });
  }
}

/** Create a course (developer only). */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (user.role !== "developer") {
      return NextResponse.json({ error: "Forbidden — developer access required." }, { status: 403 });
    }

    const body = await request.json();
    if (!body.title || !body.slug || !body.description) {
      return NextResponse.json({ error: "title, slug, and description are required." }, { status: 400 });
    }

    await connectDb();
    const course = await Course.create({
      title: body.title,
      slug: body.slug,
      description: body.description,
      language: body.language || "python",
      difficulty: body.difficulty || "Beginner",
      icon: body.icon || "📚",
      order: body.order ?? 0,
      lessons: body.lessons || [],
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("[api/courses] POST error:", error);
    return NextResponse.json({ error: "Failed to create course." }, { status: 500 });
  }
}