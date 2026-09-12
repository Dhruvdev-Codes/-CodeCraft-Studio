"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Play, Send, RotateCcw, ArrowLeft, Trophy, Terminal } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Button, Spinner, StatusBadge } from "@/components/ui";
import { LANGUAGES } from "@/lib/executor";
import type { LanguageId } from "@/types";

export default function ContestArenaPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [contest, setContest] = React.useState<any>(null);
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [language, setLanguage] = React.useState<LanguageId>("python");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [running, setRunning] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [runResult, setRunResult] = React.useState<any>(null);
  const [submissionResult, setSubmissionResult] = React.useState<any>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/contests/${slug}`);
        if (!res.ok) throw new Error("Contest not found");
        const json = await res.json();
        setContest(json.contest);
        const firstProb = json.contest.problems?.[0]?.problemId;
        if (firstProb?.starterCode?.[language]) {
          setCode(firstProb.starterCode[language]);
        }
      } catch (e) {
        console.error("Contest err:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const activeProblem = contest?.problems?.[selectedIdx]?.problemId;

  function switchProblem(idx: number) {
    setSelectedIdx(idx);
    setRunResult(null);
    setSubmissionResult(null);
    const prob = contest?.problems?.[idx]?.problemId;
    if (prob?.starterCode?.[language]) setCode(prob.starterCode[language]);
    else setCode("");
  }

  async function handleRun() {
    if (!activeProblem) return;
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          stdin: activeProblem.testCases?.[0]?.input || "",
        }),
      });
      const data = await res.json();
      setRunResult(data);
    } catch {
      setRunResult({ stdout: "", stderr: "Execution failed", executionTimeMs: 0 });
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    if (!activeProblem || !contest) return;
    setSubmitting(true);
    setSubmissionResult(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: activeProblem._id,
          contestId: contest._id,
          language,
          code,
        }),
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

  if (!contest) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-ink-900 text-white">
        <p>Contest not found.</p>
        <Link href="/contest" className="mt-4"><Button>Back to Contests</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <header className="h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/contest" className="text-xs font-semibold text-slate-500 hover:text-brand-500 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Contests
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm font-bold flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" /> {contest.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/leaderboard?contestId=${contest._id}`}>
            <Button variant="outline" size="sm">Scoreboard</Button>
          </Link>
      {/* Workspace Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem Details */}
        <div className="w-1/2 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-6 space-y-6">
          {activeProblem ? (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{activeProblem.title}</h1>
              <MarkdownViewer content={activeProblem.description} />
            </>
          ) : (
            <p className="text-slate-400">Select a problem above to start coding.</p>
          )}
        </div>

        {/* Right: Code Editor + Output */}
        <div className="w-1/2 flex flex-col bg-ink-950">
          <div className="h-12 shrink-0 border-b border-slate-800 px-4 flex items-center justify-between bg-ink-900">
            <select
              value={language}
              onChange={(e) => {
                const l = e.target.value as LanguageId;
                setLanguage(l);
                if (activeProblem?.starterCode?.[l]) setCode(activeProblem.starterCode[l]);
              }}
              aria-label="Programming language"
              className="bg-ink-800 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none"
            >
              {Object.entries(LANGUAGES).map(([k, lang]) => (
                <option key={k} value={k}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-h-[300px]">
            <CodeEditor value={code} onChange={setCode} language={language} height="100%" />
          </div>

          <div className="h-56 border-t border-slate-800 bg-ink-950 flex flex-col">
            <div className="h-9 shrink-0 border-b border-slate-800/80 px-4 flex items-center justify-between bg-ink-900/50">
              <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" /> CONSOLE & VERDICT
              </span>
              {submissionResult && (
                <StatusBadge status={submissionResult.submission?.status === "Accepted" ? "accepted" : "failed"}>
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
                    <span className="text-slate-400">Time: {submissionResult.submission?.executionTimeMs}ms</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    {submissionResult.caseResults?.map((res: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border ${
                          res.passed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                        }`}
                      >
                        <div className="font-bold text-[11px]">Test #{idx + 1} {res.hidden ? "(Hidden)" : ""}</div>
                        <div className="text-[10px] mt-0.5">{res.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!submissionResult && runResult && (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400">Time: {runResult.executionTimeMs}ms</div>
                  {runResult.stdout && <pre className="text-emerald-400 whitespace-pre-wrap">{runResult.stdout}</pre>}
                  {runResult.stderr && <pre className="text-rose-400 whitespace-pre-wrap">{runResult.stderr}</pre>}
                </div>
              )}

              {!submissionResult && !runResult && (
                <p className="text-slate-600">Run code against sample tests or submit for full evaluation.</p>
              )}
            </div>
          </div>
        </div>
      </div>
          <Button variant="outline" size="sm" onClick={handleRun} loading={running}>
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Run Sample
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={submitting}>
            <Send className="h-3.5 w-3.5 mr-1.5" /> Submit
          </Button>
        </div>
      </header>

      {/* Problem tabs */}
      <div className="h-10 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-ink-950 px-4 flex items-center gap-2">
        {contest.problems?.map((p: any, idx: number) => {
          const letter = String.fromCharCode(65 + idx);
          const active = idx === selectedIdx;
          return (
            <button
              key={idx}
              onClick={() => switchProblem(idx)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                active ? "bg-brand-600 text-white" : "text-slate-400 hover:bg-ink-800"
              }`}
            >
              {letter}. {p.problemId?.title || `Problem ${idx + 1}`} ({p.points} pts)
            </button>
          );
        })}
      </div>
    </div>
  );
}