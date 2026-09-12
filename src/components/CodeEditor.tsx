"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import { LANGUAGES } from "@/lib/executor";
import type { LanguageId } from "@/types";

export function CodeEditor({
  language,
  value,
  onChange,
  height = "480px",
  readOnly = false,
  defaultValue,
}: {
  language: LanguageId;
  value: string;
  onChange?: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  defaultValue?: string;
}) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {LANGUAGES[language]?.name || language} — {language}
        </span>
      </div>
      <Editor
        height={height}
        language={LANGUAGES[language]?.monaco || "plaintext"}
        value={value}
        defaultValue={defaultValue}
        onChange={(v) => onChange?.(v ?? "")}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "var(--font-jetbrains), monospace",
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          readOnly,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
          scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        }}
      />
    </div>
  );
}