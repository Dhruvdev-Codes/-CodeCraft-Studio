"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CodeCraft Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Application Error</h1>
          <p className="mt-2 text-sm text-slate-400">
            A critical system error occurred. Please try reloading the page.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
