"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Play, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { Button, Spinner } from "@/components/ui";
import { useAI } from "@/components/AIProvider";
import type { LanguageId, ExecutionResult } from "@/types";

interface Lesson {
  title: string;
  slug: string;
  order: number;
  content: string;
  initialCode: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  language: LanguageId;
  lessons: Lesson[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;
  const lessonSlug = params.lessonSlug as string;

  const [course, setCourse] = React.useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = React.useState<Lesson | null>(null);
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [running, setRunning] = React.useState(false);
  const [output, setOutput] = React.useState<ExecutionResult | null>(null);

  const { setContext } = useAI();

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/courses/${courseSlug}`);
        if (!res.ok) throw new Error("Course not found");
        const json = await res.json();
        setCourse(json.course);

        const lesson = (json.course.lessons || []).find((l: Lesson) => l.slug === lessonSlug);
        if (lesson) {
          setCurrentLesson(lesson);
          setCode(lesson.initialCode || "");
        }
      } catch (e) {
        console.error("Lesson err:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseSlug, lessonSlug]);

  React.useEffect(() => {
    if (currentLesson && course) {
      setContext({
        code,
        language: course.language,
        problemDescription: `${course.title} - ${currentLesson.title}\n\n${currentLesson.content}`,
      });
    }
  }, [code, currentLesson, course, setContext]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-ink-900 text-white">
        <p>Lesson not found.</p>
        <Link href="/courses" className="mt-4"><Button>Back to Courses</Button></Link>
      </div>
    );
  }

  const lessonIndex = course.lessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;

  async function handleRun() {
    if (!course) return;
    setRunning(true);
    setOutput(null);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: course.language, code }),
      });
      const data = await res.json();
      setOutput(data);
    } catch {
      setOutput({ stdout: "", stderr: "Network error executing code.", executionTimeMs: 0, status: "Runtime Error" });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <header className="h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${course.slug}`} className="text-xs font-semibold text-slate-500 hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> {course.title}
          </Link>
      {/* Workspace Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Markdown */}
        <div className="w-1/2 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentLesson.title}
            </h1>
            <MarkdownViewer content={currentLesson.content} />
          </div>
        </div>

        {/* Right: Monaco Editor + Output Console */}
        <div className="w-1/2 flex flex-col bg-ink-950">
          <div className="h-12 shrink-0 border-b border-slate-800 px-4 flex items-center justify-between bg-ink-900">
            <span className="text-xs font-mono font-bold uppercase text-brand-400">
              {course.language}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onClick={() => setCode(currentLesson.initialCode)}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
              </Button>
              <Button size="sm" onClick={handleRun} loading={running}>
                <Play className="h-3.5 w-3.5 mr-1.5 fill-current" /> Run Code
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={course.language}
              height="100%"
            />
          </div>

          <div className="h-48 border-t border-slate-800 bg-ink-950 flex flex-col">
            <div className="h-8 shrink-0 border-b border-slate-800/80 px-3 flex items-center justify-between bg-ink-900/50">
              <span className="text-xs font-mono font-semibold text-slate-400">CONSOLE OUTPUT</span>
              {output && (
                <span className="text-[11px] font-mono text-slate-500">
                  {output.executionTimeMs}ms
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
              {!output && <p className="text-slate-600">Click &quot;Run Code&quot; to execute.</p>}
              {output?.stdout && <pre className="text-emerald-400 whitespace-pre-wrap">{output.stdout}</pre>}
              {output?.stderr && <pre className="text-rose-400 whitespace-pre-wrap">{output.stderr}</pre>}
            </div>
          </div>
        </div>
      </div>
          <span className="text-slate-700">/</span>
          <span className="text-xs font-bold">{lessonIndex + 1}. {currentLesson.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {prevLesson && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/courses/${course.slug}/${prevLesson.slug}`)}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Prev
            </Button>
          )}
          {nextLesson && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/courses/${course.slug}/${nextLesson.slug}`)}>
              Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </header>
    </div>
  );
}