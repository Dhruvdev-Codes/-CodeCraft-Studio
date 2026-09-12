import type { LanguageId, SubmissionStatus, TestCase } from "@/types";
import { normalizeOutput } from "./utils";

// ============================================================================
// Secure sandbox execution engine.
//
// Code never executes on the app server. It is shipped to a sandbox API that
// runs it inside isolated containers with strict CPU/memory/network limits.
// The default endpoint (`PISTON_API_URL`) is the public Piston API. For
// enterprise deployments, self-host Piston or Judge0 CE and point this URL at
// your instance — the interface below matches both.
// ============================================================================

export const LANGUAGES: Record<
  LanguageId,
  {
    name: string;
    piston: string;
    version: string;
    monaco: string;
    extension: string;
    color: string;
    template: string;
  }
> = {
  python: {
    name: "Python",
    piston: "python",
    version: "3.10.0",
    monaco: "python",
    extension: "py",
    color: "#3572A5",
    template: 'print("Hello, World!")',
  },
  javascript: {
    name: "JavaScript",
    piston: "javascript",
    version: "18.15.0",
    monaco: "javascript",
    extension: "js",
    color: "#f1e05a",
    template: 'console.log("Hello, World!");',
  },
  typescript: {
    name: "TypeScript",
    piston: "typescript",
    version: "5.0.3",
    monaco: "typescript",
    extension: "ts",
    color: "#3178c6",
    template: 'const msg: string = "Hello, World!";\nconsole.log(msg);',
  },

  java: {
    name: "Java",
    piston: "java",
    version: "15.0.2",
    monaco: "java",
    extension: "java",
    color: "#b07219",
    template: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
  },
  cpp: {
    name: "C++",
    piston: "c++",
    version: "10.2.0",
    monaco: "cpp",
    extension: "cpp",
    color: "#f34b7d",
    template: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`,
  },
  c: {
    name: "C",
    piston: "c",
    version: "10.2.0",
    monaco: "c",
    extension: "c",
    color: "#555555",
    template: `#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}`,
  },
  go: {
    name: "Go",
    piston: "go",
    version: "1.16.2",
    monaco: "go",
    extension: "go",
    color: "#00ADD8",
    template: `package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}`,
  },
};

export const LANGUAGE_IDS = Object.keys(LANGUAGES) as LanguageId[];
export const LANGUAGES_ARRAY = LANGUAGE_IDS.map((id) => ({ id, ...LANGUAGES[id] }));

export const DEFAULT_STARTERS: Record<LanguageId, string> = {
  python: 'print("Hello from Python!")\n',
  javascript: 'console.log("Hello from JavaScript!");\n',
  typescript: 'const greeting: string = "Hello from TypeScript!";\nconsole.log(greeting);\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}\n',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}\n',
};

const PISTON_URL = (process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston").replace(/\/$/, "");
const DEFAULT_TIMEOUT_MS = Number(process.env.SANDOX_TIMEOUT_MS || 5000);

interface PistonResult {
  language: string;
  version: string;
  run: { stdout: string; stderr: string; code: number; signal: string | null; output: string };
  compile?: { stdout: string; stderr: string; code: number; signal: string | null; output: string };
}

export interface ExecutionResult {
  status: SubmissionStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number;
  timedOut: boolean;
  executionTimeMs: number;
  memoryKb?: number;
}

let runtimeCache: Record<string, string[]> | null = null;

async function getRuntimes(): Promise<Record<string, string[]>> {
  if (runtimeCache) return runtimeCache;
  try {
    const res = await fetch(`${PISTON_URL}/runtimes`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as { language: string; version: string }[];
      runtimeCache = {};
      for (const r of data) {
        (runtimeCache[r.language] ||= []).push(r.version);
      }
    }
  } catch {
    // Fall back to hardcoded versions when the runtime catalogue is unreachable.
  }
  return runtimeCache || {};
}

async function resolveVersion(language: string, fallback: string): Promise<string> {
  try {
    const runtimes = await getRuntimes();
    const versions = runtimes[language];
    if (versions && versions.length > 0) {
      return versions[versions.length - 1];
    }
  } catch {
    // ignore
  }
  return fallback;
}

/**
 * Adjust source for language quirks. Piston names files `main.<ext>`; Java
 * requires the public class name to match. If no class is declared, wrap the
 * code in `public class Main` and name the file accordingly.
 */
function prepareSource(languageId: LanguageId, code: string): { filename: string; content: string } {
  const cfg = LANGUAGES[languageId];
  if (languageId === "java") {
    const trimmed = code.trim();
    const hasType = /\b(class|interface|enum)\b/.test(trimmed);
    const content = hasType ? code : `public class Main {\n${code}\n}`;
    return { filename: "Main.java", content };
  }
  return { filename: `main.${cfg.extension}`, content: code };
}

/** Execute a single piece of source with the given stdin. */
export async function execute(
  languageId: LanguageId,
  code: string,
  stdin = "",
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<ExecutionResult> {
  const cfg = LANGUAGES[languageId];
  const { filename, content } = prepareSource(languageId, code);
  const startedAt = Date.now();
  const timeoutSeconds = Math.max(1, Math.ceil(timeoutMs / 1000));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs + 15000);

  try {
    const res = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        language: cfg.piston,
        version: await resolveVersion(cfg.piston, cfg.version),
        files: [{ name: filename, content }],
        stdin: stdin || "",
        args: [],
        compile_timeout: timeoutSeconds,
        run_timeout: timeoutSeconds,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        status: "Runtime Error",
        stdout: "",
        stderr: `Sandbox API error ${res.status}: ${text.slice(0, 300)}`,
        compileOutput: "",
        exitCode: res.status,
        timedOut: false,
        executionTimeMs: Date.now() - startedAt,
      };
    }

    const data = (await res.json()) as PistonResult;
    const elapsed = Date.now() - startedAt;
    const compileFailed = data.compile !== undefined && data.compile.code !== 0;

    const timedOut =
      (data.run.signal && data.run.signal.includes("KILL")) ||
      data.run.code === 124 ||
      data.run.stderr.includes("timed out");

    let status: SubmissionStatus;
    if (compileFailed) status = "Compilation Error";
    else if (data.run.code === 0 && !timedOut) status = "Accepted";
    else if (timedOut || elapsed >= timeoutMs) status = "Time Limit Exceeded";
    else status = "Runtime Error";

    return {
      status,
      stdout: data.run.stdout || "",
      stderr: data.run.stderr || "",
      compileOutput: data.compile?.stderr || data.compile?.stdout || "",
      exitCode: data.run.code,
      timedOut,
      executionTimeMs: elapsed,
    };
  } catch (error) {
    return {
      status: "Time Limit Exceeded",
      stdout: "",
      stderr: error instanceof Error ? error.message : "Execution failed",
      compileOutput: "",
      exitCode: -1,
      timedOut: true,
      executionTimeMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Run one test case against the user's code and normalize the pass/fail verdict. */
export async function runSingleCase(
  languageId: LanguageId,
  code: string,
  testCase: TestCase,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<{
  passed: boolean;
  status: SubmissionStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
}> {
  const result = await execute(languageId, code, testCase.input, timeoutMs);
  const actual = normalizeOutput(result.stdout);
  const expected = normalizeOutput(testCase.expectedOutput);
  const passed = result.status === "Accepted" && actual === expected;

  let status = result.status;
  if (result.status === "Accepted" && !passed) status = "Wrong Answer";

  return {
    passed,
    status,
    stdout: actual,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    expectedOutput: expected,
    actualOutput: actual,
    executionTimeMs: result.executionTimeMs,
  };
}