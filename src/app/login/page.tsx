"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { signIn } from "next-auth/react";
import { Code2, AlertCircle } from "lucide-react";
import { Button, Card, Field, Input } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-ink-900 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md">
              <Code2 className="h-6 w-6" />
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              CodeCraft Studio
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to your account to continue coding
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email address">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>

            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Sign up free
            </Link>
          </div>
        </Card>
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