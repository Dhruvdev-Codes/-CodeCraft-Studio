"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { signIn } from "next-auth/react";
import {
  Code2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Terminal,
  Trophy,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { Button, Field, Input } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const justRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("codecraft_remembered_email");
      if (savedEmail) setEmail(savedEmail);
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (rememberMe) localStorage.setItem("codecraft_remembered_email", email);
      else localStorage.removeItem("codecraft_remembered_email");
    } catch {}

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (!res || res.error) {
        setError(res?.error || "Invalid email or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(type: "student" | "admin") {
    if (type === "student") {
      setEmail("student@codecraft.dev");
      setPassword("StudentPass123!");
    } else {
      setEmail("admin@codecraft.dev");
      setPassword("ChangeMe123!");
    }
    setError(null);
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-white selection:bg-brand-500 selection:text-white">
      {/* Left Column: Visual Showcase */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-ink-950 via-slate-900 to-brand-950/40 border-r border-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/25">
              <Code2 className="h-6 w-6" />
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              CodeCraft <span className="text-brand-400">Studio</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 my-auto space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            Next-Gen Interactive Engineering Platform
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Code, Learn & Compete in a Sandboxed Multi-Language Cloud.
          </h2>

          <div className="rounded-xl border border-slate-700/60 bg-ink-950/80 p-4 font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-slate-400 font-sans text-xs">two_sum.py</span>
              </div>
              <span className="text-emerald-400 font-sans text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Accepted (12ms)
              </span>
            </div>
            <p className="text-brand-400">def <span className="text-violet-300">twoSum</span>(nums, target):</p>
            <p className="pl-4 text-slate-300">lookup = &#123;&#125;</p>
            <p className="pl-4 text-slate-300">for i, num in enumerate(nums):</p>
            <p className="pl-8 text-slate-300">diff = target - num</p>
            <p className="pl-8 text-slate-300">if diff in lookup: return [lookup[diff], i]</p>
            <p className="pl-8 text-slate-300">lookup[num] = i</p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Terminal className="h-4 w-4 text-brand-400" />
              <span>6 Languages</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Live Contests</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Cpu className="h-4 w-4 text-violet-400" />
              <span>AI Coding Tutor</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} CodeCraft Studio. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md">
                <Code2 className="h-6 w-6" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                CodeCraft Studio
              </span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Sign in to resume your lessons, problems, and contests.
            </p>
          </div>

          {justRegistered && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Account created successfully! Please sign in.</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Fill Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">Quick Demo Access:</span>
              <span className="text-[11px] text-slate-500">1-click fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("student")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
              >
                <span>👨💻</span> Demo Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
              >
                <span>⚡</span> Demo Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email address">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-brand-500/20"
                />
                <span>Remember me</span>
              </label>
              <Link href="/register" className="text-brand-400 hover:underline">
                Create new account?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center h-10">
              <span>Sign in to CodeCraft</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Social Logins */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl })}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-brand-400 hover:text-brand-300 hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center bg-ink-900"><div className="animate-spin h-6 w-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>}>
      <LoginForm />
    </React.Suspense>
  );
}