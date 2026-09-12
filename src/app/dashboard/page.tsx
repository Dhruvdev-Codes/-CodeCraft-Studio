"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Code2, Trophy, BookOpen, CheckCircle2, Activity, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIProvider";
import { Button, Card, Spinner, StatusBadge } from "@/components/ui";

interface DashboardData {
  stats: {
    solvedCount: number;
    totalProblems: number;
    totalCourses: number;
    submissionsCount: number;
  };
  recentSubmissions: Array<{
    _id: string;
    problemId?: {
      _id: string;
      title: string;
      slug: string;
      difficulty: "Easy" | "Medium" | "Hard";
    };
    language: string;
    status: string;
    createdAt: string;
    executionTimeMs: number;
  }>;
  activeContests: Array<{
    _id: string;
    title: string;
    slug: string;
    description: string;
    startTime: string;
    endTime: string;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Dashboard err:", e);
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") load();
    else if (status === "unauthenticated") setLoading(false);
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900">
        <Navbar />
        <div className="flex flex-1 items-center justify-center"><Spinner size="lg" /></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-bold">Sign in to view dashboard</h1>
          <div className="mt-4"><Link href="/login"><Button>Sign In</Button></Link></div>
        </div>
        <Footer />
      </div>
    );
  }

  const solvedPct =
    data?.stats.totalProblems && data.stats.totalProblems > 0
      ? Math.round((data.stats.solvedCount / data.stats.totalProblems) * 100)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, <span className="text-gradient">{session?.user?.name || "Coder"}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Here is your daily coding progress.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/problems"><Button>Solve Problems</Button></Link>
            <Link href="/courses"><Button variant="outline">Browse Courses</Button></Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Solved</p>
              <p className="text-2xl font-bold">{data?.stats.solvedCount ?? 0} / {data?.stats.totalProblems ?? 0}</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
        {/* Submissions & Contests Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Submissions</h2>
              <Link href="/problems" className="text-xs font-semibold text-brand-600 hover:underline">
                View all problems →
              </Link>
            </div>

            <Card className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
                data.recentSubmissions.map((s) => (
                  <div key={s._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {s.problemId ? (
                          <Link
                            href={`/problems/${s.problemId.slug}`}
                            className="font-semibold hover:text-brand-500 truncate"
                          >
                            {s.problemId.title}
                          </Link>
                        ) : (
                          <span className="font-semibold text-slate-500">Problem #{s._id.slice(-4)}</span>
                        )}
                        {s.problemId?.difficulty && (
                          <StatusBadge
                            status={
                              s.problemId.difficulty === "Easy"
                                ? "easy"
                                : s.problemId.difficulty === "Medium"
                                ? "medium"
                                : "hard"
                            }
                          >
                            {s.problemId.difficulty}
                          </StatusBadge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {s.language.toUpperCase()} · {s.executionTimeMs}ms · {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        s.status === "Accepted"
                          ? "accepted"
                          : s.status === "Pending"
                          ? "running"
                          : "failed"
                      }
                    >
                      {s.status}
                    </StatusBadge>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-slate-400">
                  No submissions yet. Start solving problems to track your progress!
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Active Contests</h2>
              <Link href="/contest" className="text-xs font-semibold text-brand-600 hover:underline">
                All Contests →
              </Link>
            </div>

            <div className="space-y-3">
              {data?.activeContests && data.activeContests.length > 0 ? (
                data.activeContests.map((c) => (
                  <Card key={c._id} className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
                      <Trophy className="h-4 w-4" />
                      <span>Arena</span>
                    </div>
                    <h3 className="font-bold">{c.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {new Date(c.startTime).toLocaleDateString()}
                      </span>
                      <Link href={`/contest/${c.slug}`}>
                        <Button size="sm" variant="outline">Enter Arena</Button>
                      </Link>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center text-sm text-slate-400">
                  No contests scheduled currently.
                </Card>
              )}
            </div>
          </div>
        </div>
              <p className="text-xs font-semibold uppercase text-slate-500">Rate</p>
              <p className="text-2xl font-bold">{solvedPct}%</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Courses</p>
              <p className="text-2xl font-bold">{data?.stats.totalCourses ?? 0}</p>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Submissions</p>
              <p className="text-2xl font-bold">{data?.stats.submissionsCount ?? 0}</p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}