import Link from "next/link";
import {
  Code2,
  Trophy,
  Bot,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIProvider";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 grid-bg border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-500/30 bg-brand-50/80 dark:bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Interactive Courses · Cloud IDE · Sandboxed Judge · AI Coding Mentor
            </div>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Master the Craft of Code.
              <br />
              <span className="text-gradient">Learn. Code. Compete.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300">
              CodeCraft Studio is an all-in-one interactive platform. Learn programming from
              interactive lessons, practice against automated test suites in 6 languages, participate
              in live contests, and get unstuck with a context-aware AI mentor.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base font-semibold shadow-lg shadow-brand-600/30">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/problems">
                <Button variant="outline" size="lg" className="text-base font-semibold">
                  Browse Problems
                </Button>
              </Link>
              <Link href="/ide">
                <Button variant="ghost" size="lg" className="text-base font-semibold">
                  Open Cloud IDE →
                </Button>
              </Link>
            </div>

            {/* Feature highlights badge row */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Remote sandboxed judge
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 6 languages supported
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Context-aware AI assistant
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Live contest leaderboards
              </span>
            </div>
          </div>
        </section>

        {/* Feature pillars */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              Everything you need to become a top programmer
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Designed from the ground up for students, interview preppers, and competitive coders.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-brand-100 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Interactive Courses</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Step-by-step lessons in Python, JavaScript, Java, and C++ with integrated Monaco code editors and runnable examples.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Problem Arena</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Sharpen your skills with problems graded against both public sample tests and hidden edge-case suites.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Contest Arena</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Compete against peers in timed rounds. Live leaderboards compute real-time scores based on accuracy and speed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Mentor</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Get context-aware hints, algorithmic explanations, and bug localization without giving away direct answers.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-brand-600 via-violet-600 to-indigo-700 text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to write code that matters?</h2>
            <p className="mt-3 text-brand-100 max-w-xl mx-auto">
              Join students and engineers sharpening their problem solving skills today.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register">
                <Button variant="secondary" size="lg" className="font-semibold shadow-lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}