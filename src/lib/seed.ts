/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "./db";
import { User } from "./models/User";
import { Course } from "./models/Course";
import { Problem } from "./models/Problem";
import { Contest } from "./models/Contest";
import { SEED_COURSES } from "./seed/courseData";
import { SEED_PROBLEMS } from "./seed/problemData";

/**
 * Seeds the platform with:
 *  - a Developer/Admin account (role: developer)
 *  - the interactive course catalog
 *  - the coding problem arena (public + hidden test suites)
 *  - an upcoming practice contest
 *
 * Idempotent: existing documents are matched by slug and updated, so the
 * script can be re-run safely at any time.
 *
 * Usage: npm run seed
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@codecraft.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

async function seedAdmin() {
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`\u2714 Admin user already exists: ${ADMIN_EMAIL}`);
    return;
  }
  await User.create({
    name: "Platform Admin",
    email: ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
    role: "developer",
    provider: "credentials",
  });
  console.log(`\u2714 Created developer (admin) account: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

async function seedCourses() {
  for (const course of SEED_COURSES) {
    const existing = await Course.findOne({ slug: course.slug });
    if (existing) {
      existing.set(course);
      await existing.save();
      console.log(`\u2714 Updated course: ${course.title} (${course.lessons.length} lessons)`);
    } else {
      await Course.create(course);
      console.log(`\u2714 Created course: ${course.title} (${course.lessons.length} lessons)`);
    }
  }
}

async function seedProblems() {
  for (const problem of SEED_PROBLEMS) {
    const existing = await Problem.findOne({ slug: problem.slug });
    if (existing) {
      existing.set(problem);
      await existing.save();
      const hidden = problem.testCases.filter((t) => t.hidden).length;
      console.log(
        `\u2714 Updated problem: ${problem.title} (${problem.points}pts, ${hidden} hidden tests)`
      );
    } else {
      await Problem.create(problem);
      const hidden = problem.testCases.filter((t) => t.hidden).length;
      console.log(
        `\u2714 Created problem: ${problem.title} (${problem.points}pts, ${hidden} hidden tests)`
      );
    }
  }
}

async function seedContest() {
  const slugs = ["hello-world", "sum-of-two", "fizzbuzz", "nth-fibonacci"];
  const pointsBySlug: Record<string, number> = {
    "hello-world": 10,
    "sum-of-two": 20,
    fizzbuzz: 30,
    "nth-fibonacci": 40,
  };

  const problems = await Problem.find({ slug: { $in: slugs } });
  const entries = problems.map((p) => ({
    problemId: p._id,
    points: pointsBySlug[p.slug] || 10,
  }));

  const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // tomorrow
  const endTime = new Date(Date.now() + 26 * 60 * 60 * 1000); // 2h window

  const existing = await Contest.findOne({ slug: "practice-sprint-1" });
  const payload = {
    title: "Practice Sprint #1",
    slug: "practice-sprint-1",
    description:
      "A gentle 2-hour sprint to build your contest stamina. Four problems, public AND hidden test suites, live leaderboard.",
    startTime,
    endTime,
    problems: entries,
  };

  if (existing) {
    existing.set(payload);
    await existing.save();
  } else {
    await Contest.create(payload);
  }
  console.log(`\u2714 Seeded contest: Practice Sprint #1 (starts ${startTime.toLocaleString()})`);
}

export async function seedDatabase() {
  await connectDb();
  await seedAdmin();
  await seedCourses();
  await seedProblems();
  await seedContest();
  return { ok: true, message: "Seed completed successfully" };
}

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await seedDatabase();
    console.log("\n\u2728 Seed complete. Run `npm run dev` to start CodeCraft Studio.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}