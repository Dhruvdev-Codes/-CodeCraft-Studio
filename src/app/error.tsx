"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log runtime error to console for diagnostics
    console.error("[CodeCraft Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-lg">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-6">
          <AlertTriangle className="h-3.5 w-3.5" />
          Runtime Error Caught
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Something went wrong
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          An unexpected error occurred while loading this view. You can try refreshing the action or return to safety.
        </p>

        {error?.message && (
          <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-ink-800 text-xs font-mono text-rose-500 text-left overflow-x-auto max-h-32 border border-slate-200 dark:border-slate-700">
            {error.message}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
