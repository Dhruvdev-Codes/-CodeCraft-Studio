import Link from "next/link";
import { Compass, BookOpen, Code2, Play, Home, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-500/30 bg-brand-50/80 dark:bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 mb-6 backdrop-blur">
            <Compass className="h-3.5 w-3.5 animate-spin" />
            404 · Page Not Found
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Lost in the <span className="text-gradient">Codebase?</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            The page or resource you are looking for does not exist, was moved, or is under construction.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button size="lg" className="gap-2 shadow-lg shadow-brand-600/30">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/ide">
              <Button variant="ghost" size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Open Cloud IDE
              </Button>
            </Link>
          </div>

          {/* Helpful Navigation Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link
              href="/problems"
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 p-4 transition-all hover:border-brand-500/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      Problem Arena
                    </h3>
                    <p className="text-xs text-slate-500">Practice coding challenges</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>

            <Link
              href="/contest"
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 p-4 transition-all hover:border-brand-500/50 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">
                      Contest Arena
                    </h3>
                    <p className="text-xs text-slate-500">Join live competitions</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
