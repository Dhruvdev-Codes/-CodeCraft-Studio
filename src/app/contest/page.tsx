import Link from "next/link";
import { Trophy, Calendar, Clock, Award, ArrowRight } from "lucide-react";
import { connectDb } from "@/lib/db";
import { Contest } from "@/lib/models/Contest";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIProvider";
import { Button, Card, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ContestsPage() {
  await connectDb();
  const contests = await Contest.find({}).sort({ startTime: -1 }).lean();
  const now = new Date();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400 mb-3">
            <Trophy className="h-3.5 w-3.5" />
            Competitive Arena
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            CodeCraft Contests
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Compete in live timed algorithmic coding rounds, solve challenges, and climb the real-time leaderboard.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contests.map((c) => {
            const start = new Date(c.startTime);
            const end = new Date(c.endTime);
            const isLive = now >= start && now <= end;
            const isUpcoming = now < start;
            const isEnded = now > end;

            return (
              <Card key={c._id.toString()} className="flex flex-col overflow-hidden hover:border-violet-500/40 transition-colors">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {Math.round((end.getTime() - start.getTime()) / (1000 * 60))} Mins
                    </span>
                    <StatusBadge
                      status={
                        isLive ? "running" : isUpcoming ? "pending" : "accepted"
                      }
                    >
                      {isLive ? "LIVE NOW" : isUpcoming ? "UPCOMING" : "ENDED"}
                    </StatusBadge>
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                    {c.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-1">
                    {c.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {start.toLocaleDateString()}
                    </span>
                    <span>{c.problems?.length || 0} Problems</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-ink-800/60 p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <Link href={`/contest/${c.slug}`} className="flex-1">
                    <Button size="sm" className="w-full" variant={isLive ? "primary" : "outline"}>
                      {isLive ? "Enter Arena" : "View Details"}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/leaderboard?contestId=${c._id}`}>
                    <Button size="sm" variant="ghost">
                      <Award className="h-4 w-4" />
                    </Button>
                  </Link>
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