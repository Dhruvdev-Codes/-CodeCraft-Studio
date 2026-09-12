"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Trophy, Medal, Award, UserCheck, Flame } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIProvider";
import { Card, Spinner } from "@/components/ui";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  problemsSolved: number;
  score: number;
  totalTimeMs: number;
}

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const contestId = searchParams.get("contestId");

  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const url = contestId
          ? `/api/leaderboard?contestId=${contestId}`
          : `/api/leaderboard`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (e) {
        console.error("Leaderboard err:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contestId]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">
            <Trophy className="h-3.5 w-3.5" />
            {contestId ? "Contest Scoreboard" : "Global Ranking"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Leaderboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Top performing engineers ranked by problems solved and execution efficiency.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-ink-950/60 grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="col-span-2 sm:col-span-1">Rank</span>
              <span className="col-span-6 sm:col-span-7">Developer</span>
              <span className="col-span-2 text-center">Solved</span>
              <span className="col-span-2 text-right">Score</span>
            </div>

            {leaderboard.length > 0 ? (
              leaderboard.map((u) => {
                const isTop1 = u.rank === 1;
                const isTop2 = u.rank === 2;
                const isTop3 = u.rank === 3;

                return (
                  <div
                    key={u.userId}
                    className={`p-4 grid grid-cols-12 items-center text-sm ${
                      isTop1 ? "bg-amber-500/5 font-semibold" : ""
                    }`}
                  >
                    <div className="col-span-2 sm:col-span-1 flex items-center">
                      {isTop1 ? (
                        <span className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          1
                        </span>
                      ) : isTop2 ? (
                        <span className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                      ) : isTop3 ? (
                        <span className="h-6 w-6 rounded-full bg-amber-700/60 text-white flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono pl-1.5">{u.rank}</span>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-7 flex items-center gap-3 min-w-0 pr-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {u.problemsSolved}
                    </div>

                    <div className="col-span-2 text-right font-mono font-bold text-brand-600 dark:text-brand-400">
                      {u.score} pts
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-sm text-slate-400">
                No submissions recorded yet for this leaderboard. Be the first to solve!
              </div>
            )}
          </Card>
        )}
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center bg-ink-900"><Spinner size="lg" /></div>}>
      <LeaderboardContent />
    </React.Suspense>
  );
}