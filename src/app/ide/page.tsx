"use client";

import * as React from "react";
import { Play, RotateCcw, Sparkles, Terminal, Download, Share2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui";
import { useAI } from "@/components/AIProvider";
import { LANGUAGES, DEFAULT_STARTERS } from "@/lib/executor";
import type { LanguageId, ExecutionResult } from "@/types";

export default function StandaloneIDEPage() {
  const [language, setLanguage] = React.useState<LanguageId>("python");
  const [code, setCode] = React.useState(DEFAULT_STARTERS.python);
  const [stdin, setStdin] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [output, setOutput] = React.useState<ExecutionResult | null>(null);

  const { setContext, openDrawer } = useAI();

  function handleLanguageChange(lang: LanguageId) {
    setLanguage(lang);
    setCode(DEFAULT_STARTERS[lang] || "");
  }

  React.useEffect(() => {
    setContext({
      code,
      language,
      problemDescription: "Standalone Cloud IDE Playground",
    });
  }, [code, language, setContext]);

  async function handleRun() {
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, stdin }),
      });
      const data = await res.json();
      setOutput(data);
    } catch {
      setOutput({
        stdout: "",
        stderr: "Network error executing code.",
        executionTimeMs: 0,
        status: "Runtime Error",
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      {/* Editor Sub-Header */}
      <div className="h-12 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
            aria-label="Select language"
            className="bg-slate-100 dark:bg-ink-800 text-slate-900 dark:text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-700 outline-none focus:border-brand-500"
          >
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCode(DEFAULT_STARTERS[language])}
            className="text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={openDrawer}
            className="text-brand-500 gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> Ask AI
          </Button>
          <Button size="sm" onClick={handleRun} loading={running}>
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Run Code
          </Button>
        </div>
      </div>

      {/* Main Workspace: Code (Left) + IO (Right) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/3 border-r border-slate-200 dark:border-slate-800 bg-ink-950">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            height="100%"
          />
        </div>

        {/* IO Panel */}
        <div className="w-1/3 flex flex-col bg-white dark:bg-ink-900">
          {/* Custom Stdin */}
          <div className="h-1/3 border-b border-slate-200 dark:border-slate-800 p-3 flex flex-col">
            <label className="text-xs font-mono font-semibold uppercase text-slate-500 mb-2">
              Standard Input (Stdin)
            </label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter program inputs here..."
              className="flex-1 w-full resize-none font-mono text-xs p-2 rounded-lg bg-slate-100 dark:bg-ink-950 border border-slate-200 dark:border-slate-800 outline-none focus:border-brand-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Console Stdout / Stderr */}
          <div className="flex-1 p-3 flex flex-col bg-slate-50 dark:bg-ink-950 overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
              <span className="text-xs font-mono font-semibold uppercase text-slate-500 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" /> Output Console
              </span>
              {output && (
                <span className="text-[11px] font-mono text-slate-400">
                  {output.executionTimeMs}ms
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs">
              {!output && <p className="text-slate-400">Run code to see stdout and stderr.</p>}
              {output?.stdout && (
                <pre className="text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">{output.stdout}</pre>
              )}
              {output?.stderr && (
                <pre className="text-rose-600 dark:text-rose-400 whitespace-pre-wrap">{output.stderr}</pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}