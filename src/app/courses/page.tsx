import Link from "next/link";
import { BookOpen, Layers, ArrowRight } from "lucide-react";
import { connectDb } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIProvider";
import { Button, Card, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  await connectDb();
  const courses = await Course.find({}).sort({ order: 1 }).lean();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            Structured Learning Tracks
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Interactive Programming Courses
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Learn step-by-step with interactive coding sandboxes, automated checks, and rich explanations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const lessonCount = course.lessons?.length || 0;
            const firstLessonSlug = course.lessons?.[0]?.slug;

            return (
              <Card key={course._id.toString()} className="flex flex-col overflow-hidden hover:border-brand-500/40 transition-colors">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-4xl select-none">{course.icon || "💻"}</span>
                    <StatusBadge
                      status={
                        course.difficulty === "Beginner"
                          ? "easy"
                          : course.difficulty === "Intermediate"
                          ? "medium"
                          : "hard"
                      }
                    >
                      {course.difficulty}
                    </StatusBadge>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3 flex-1">
                    {course.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-wider">
                      <Layers className="h-4 w-4 text-brand-500" />
                      {course.language}
                    </span>
                    <span>{lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-ink-800/60 p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <Link href={`/courses/${course.slug}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Curriculum
                    </Button>
                  </Link>
                  {firstLessonSlug && (
                    <Link href={`/courses/${course.slug}/${firstLessonSlug}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Start <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}