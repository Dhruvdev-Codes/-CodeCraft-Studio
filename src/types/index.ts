// Shared type definitions used across the CodeCraft Studio codebase.

export type LanguageId = "python" | "javascript" | "typescript" | "java" | "cpp" | "c" | "go";
export type Role = "student" | "developer";
export type Difficulty = "Easy" | "Medium" | "Hard" | "Beginner" | "Intermediate" | "Advanced";

export type SubmissionStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Time Limit Exceeded"
  | "Runtime Error"
  | "Compilation Error"
  | "Pending";

export interface ExecutionResult {
  status: SubmissionStatus;
  stdout: string;
  stderr: string;
  compileOutput?: string;
  exitCode?: number;
  timedOut?: boolean;
  executionTimeMs: number;
  memoryKb?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface CourseLesson {
  _id?: string;
  title: string;
  slug: string;
  order: number;
  duration: string;
  content: string;
  code?: string;
  language?: LanguageId;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  language: LanguageId;
  difficulty: Difficulty;
  icon: string;
  order: number;
  lessons: CourseLesson[];
  createdAt: string;
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  languages: LanguageId[];
  points: number;
  starterCode: Partial<Record<LanguageId, string>>;
  testCases: TestCase[];
  tags: string[];
  createdAt: string;
}

export interface Submission {
  _id: string;
  userId: string;
  problemId?: string;
  contestId?: string;
  code: string;
  language: LanguageId;
  status: SubmissionStatus;
  executionTimeMs: number;
  memoryKb?: number;
  publicPassed: number;
  publicTotal: number;
  hiddenPassed: number;
  hiddenTotal: number;
  createdAt: string;
}

export interface ContestEntry {
  problemId: string;
  points: number;
}

export interface Contest {
  _id: string;
  title: string;
  slug: string;
  description: string;
  startTime: string;
  endTime: string;
  problems: ContestEntry[];
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface TestResult {
  passed: boolean;
  status: SubmissionStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  executionTimeMs: number;
  memoryKb?: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  hidden: boolean;
}

export interface AIContext {
  page?: string;
  language?: LanguageId;
  code?: string;
  problemTitle?: string;
  problemDescription?: string;
}