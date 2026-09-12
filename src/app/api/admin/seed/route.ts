import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "developer") {
      return NextResponse.json({ error: "Forbidden — developer role required." }, { status: 403 });
    }

    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/admin/seed] error:", error);
    return NextResponse.json({ error: "Seed execution failed." }, { status: 500 });
  }
}