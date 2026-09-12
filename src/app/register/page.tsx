"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { signIn } from "next-auth/react";
import { Code2, AlertCircle } from "lucide-react";
import { Button, Card, Field, Input } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const signinRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signinRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start learning, building, and competing today
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
            <Field label="Full Name">
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
            </Field>

            <Field label="Email address">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@example.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" hint="Must be at least 8 characters">
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </Field>

            <Button type="submit" loading={loading} className="w-full">
              Create account
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Log in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}