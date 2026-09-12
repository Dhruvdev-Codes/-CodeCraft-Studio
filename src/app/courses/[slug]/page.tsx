import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, PlayCircle, ArrowLeft, ArrowRight, Layers, Clock } from "lucide-react";
import { connectDb } from "@/lib/db";
import { Course } from "@/lib/models/Course";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIProvider";
import { Button, Card, StatusBadge } from "@/components/ui";

interface Props {
  params: { slug: string };
}

export default async function CourseDetailPage({ params }: Props) {
  await connectDb();
  const course = await Course.findOne({ slug: params.slug }).lean();

  if (!course) {
    notFound();
  }

  const lessons = course.lessons || [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-500 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>

        {/* Header banner */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex gap-4">
              <span className="text-5xl select-none">{course.icon || "💻"}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
                    {course.language}
                  </span>
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
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {course.title}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 pt-1 max-w-2xl">
                  {course.description}
                </p>
              </div>
            </div>

            {lessons[0] && (
              <Link href={`/courses/${course.slug}/${lessons[0].slug}`} className="w-full sm:w-auto shrink-0">
                <Button size="lg" className="w-full">
                  Start Course <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Curriculum list */}
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-bold">Curriculum · {lessons.length} Lessons</h2>

          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <Card
                key={lesson.slug}
                className="p-5 flex items-center justify-between gap-4 hover:border-brand-500/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      Hands-on sandbox coding challenge
                    </p>
                  </div>
                </div>

                <Link href={`/courses/${course.slug}/${lesson.slug}`}>
                  <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
                    <PlayCircle className="h-4 w-4" />
                    Open Lesson
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}