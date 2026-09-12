import Link from "next/link";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-white">
                <Code2 className="h-4 w-4" />
              </span>
              <span className="font-bold text-slate-900 dark:text-white">CodeCraft Studio</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Learn to code with interactive courses, practice in a secure cloud IDE, battle it out
              in contests, and get unstuck with a context-aware AI mentor.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Learn</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/courses" className="hover:text-brand-600">Courses</Link></li>
              <li><Link href="/problems" className="hover:text-brand-600">Problems</Link></li>
              <li><Link href="/contest" className="hover:text-brand-600">Contests</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/login" className="hover:text-brand-600">Log in</Link></li>
              <li><Link href="/register" className="hover:text-brand-600">Sign up</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-600">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} CodeCraft Studio. Built with Next.js, MongoDB & a whole lot
          of ☕. All code executes securely in remote sandboxes.
        </div>
      </div>
    </footer>
  );
}