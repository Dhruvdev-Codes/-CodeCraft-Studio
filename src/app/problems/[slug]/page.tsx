"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Play, Send, RotateCcw, ArrowLeft, Sparkles, Terminal } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Button, Spinner, StatusBadge } from "@/components/ui";
import { useAI } from "@/components/AIProvider";
import { LANGUAGES } from "@/lib/executor";
import type { LanguageId } from "@/types";

export default function ProblemArenaPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [problem, setProblem] = React.useState<any>(null);
  const [language, setLanguage] = React.useState<LanguageId>("python");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [running, setRunning] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [runResult, setRunResult] = React.useState<{ stdout: string; stderr: string; time: number } | null>(null);
  const [submissionResult, setSubmissionResult] = React.useState<any>(null);

  const { setContext, openDrawer } = useAI();

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/problems/${slug}`);
        if (!res.ok) throw new Error("Problem not found");
        const json = await res.json();
        setProblem(json.problem);
        setCode(json.problem.starterCode?.[language] || "");
      } catch (e) {
        console.error("Problem err:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function handleLanguageChange(newLang: LanguageId) {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  }

  React.useEffect(() => {
    if (problem) {
      setContext({
        code,
        language,
        problemDescription: `${problem.title}\n\nDifficulty: ${problem.difficulty}\n\n${problem.description}`,
      });
    }
  }, [code, language, problem, setContext]);

  async function handleRun() {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          stdin: problem.testCases?.[0]?.input || "",
        }),
      });
      const data = await res.json();
      setRunResult({ stdout: data.stdout || "", stderr: data.stderr || "", time: data.executionTimeMs || 0 });
    } catch {
      setRunResult({ stdout: "", stderr: "Execution failed.", time: 0 });
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    if (!problem) return;
    setSubmitting(true);
    setSubmissionResult(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem._id, language, code }),
      });
      const data = await res.json();
      setSubmissionResult(data);
    } catch {
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-ink-900 text-white">
        <p>Problem not found.</p>
        <Link href="/problems" className="mt-4"><Button>Back to Problems</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <header className="h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/problems" className="text-xs font-semibold text-slate-500 hover:text-brand-500 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Problems
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm font-bold">{problem.title}</span>
      {/* Split Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem Details */}
        <div className="w-1/2 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {problem.title}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {(problem.tags || []).map((t: string) => (
                <span
                  key={t}
                  className="rounded bg-slate-100 dark:bg-ink-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400 font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <MarkdownViewer content={problem.description} />
        </div>

        {/* Right: Code Editor & Results */}
        <div className="w-1/2 flex flex-col bg-ink-950">
          <div className="h-12 shrink-0 border-b border-slate-800 px-4 flex items-center justify-between bg-ink-900">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
              aria-label="Programming language"
              className="bg-ink-800 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none focus:border-brand-500"
            >
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <option key={key} value={key}>{lang.name}</option>
              ))}
            </select>

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white text-xs"
              onClick={() => {
                if (problem.starterCode?.[language]) setCode(problem.starterCode[language]);
              }}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
          </div>

          <div className="flex-1 min-h-[300px]">
            <CodeEditor value={code} onChange={setCode} language={language} height="100%" />
          </div>

          {/* Verdict Console */}
          <div className="h-56 border-t border-slate-800 bg-ink-950 flex flex-col">
            <div className="h-9 shrink-0 border-b border-slate-800/80 px-4 flex items-center justify-between bg-ink-900/50">
              <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" /> CONSOLE & VERDICT
              </span>
              {submissionResult && (
                <StatusBadge
                  status={
                    submissionResult.submission?.status === "Accepted"
                      ? "accepted"
                      : "failed"
                  }
                >
                  {submissionResult.submission?.status}
                </StatusBadge>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
              {submissionResult && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-bold text-slate-200">
                      Passed: {submissionResult.submission?.publicPassed + submissionResult.submission?.hiddenPassed} /{" "}
                      {submissionResult.submission?.publicTotal + submissionResult.submission?.hiddenTotal} Cases
                    </span>
                    <span className="text-slate-400">
                      Time: {submissionResult.submission?.executionTimeMs}ms
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {submissionResult.caseResults?.map((res: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border ${
                          res.passed
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        <div className="font-bold text-[11px]">
                          Test #{idx + 1} {res.hidden ? "(Hidden)" : ""}
                        </div>
                        <div className="text-[10px] mt-0.5">{res.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!submissionResult && runResult && (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400">Time: {runResult.time}ms</div>
                  {runResult.stdout && <pre className="text-emerald-400 whitespace-pre-wrap">{runResult.stdout}</pre>}
                  {runResult.stderr && <pre className="text-rose-400 whitespace-pre-wrap">{runResult.stderr}</pre>}
                </div>
              )}

              {!submissionResult && !runResult && (
                <p className="text-slate-600">Run sample or Submit to evaluate against hidden tests.</p>
              )}
            </div>
          </div>
        </div>
      </div>
          <StatusBadge status={problem.difficulty === "Easy" ? "easy" : problem.difficulty === "Medium" ? "medium" : "hard"}>
            {problem.difficulty}
          </StatusBadge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={openDrawer} className="text-brand-500 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> AI Mentor
          </Button>
          <Button variant="outline" size="sm" onClick={handleRun} loading={running}>
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Run Sample
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={submitting}>
            <Send className="h-3.5 w-3.5 mr-1.5" /> Submit
          </Button>
        </div>
      </header>
    </div>
  );
}