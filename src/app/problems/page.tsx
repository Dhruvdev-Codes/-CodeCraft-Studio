import Link from "next/link";
import { Code2, CheckCircle2, Search, Filter } from "lucide-react";
import { connectDb } from "@/lib/db";
import { Problem } from "@/lib/models/Problem";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIProvider";
import { Card, StatusBadge, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
  await connectDb();
  const problems = await Problem.find({}).select("-testCases").sort({ createdAt: -1 }).lean();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-3">
            <Code2 className="h-3.5 w-3.5" />
            Algorithm Arena
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Practice Problems
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Hone your data structure and algorithm skills across Python, JavaScript, TypeScript, C++, Java, and Go.
          </p>
        </div>

        {/* Problems list card */}
        <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          <div className="p-4 bg-slate-50 dark:bg-ink-950/60 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Title & Tags</span>
            <div className="flex items-center gap-12 pr-4">
              <span>Difficulty</span>
              <span>Action</span>
            </div>
          </div>

          {problems.map((prob) => (
            <div
              key={prob._id.toString()}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-ink-800/40 transition-colors"
            >
              <div className="space-y-1.5 min-w-0">
                <Link
                  href={`/problems/${prob.slug}`}
                  className="font-bold text-base text-slate-900 dark:text-white hover:text-brand-500 transition-colors"
                >
                  {prob.title}
                </Link>
                <div className="flex flex-wrap gap-1.5">
                  {(prob.tags || []).map((t: string) => (
                    <span
                      key={t}
                      className="rounded bg-slate-100 dark:bg-ink-800 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <StatusBadge
                  status={
                    prob.difficulty === "Easy"
                      ? "easy"
                      : prob.difficulty === "Medium"
                      ? "medium"
                      : "hard"
                  }
                >
                  {prob.difficulty}
                </StatusBadge>

                <Link href={`/problems/${prob.slug}`}>
                  <Button size="sm" variant="outline">
                    Solve
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </Card>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}