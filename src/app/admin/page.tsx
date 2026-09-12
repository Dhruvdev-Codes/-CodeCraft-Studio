"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShieldCheck, Database, Plus, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button, Card, Field, Input, Spinner } from "@/components/ui";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [seeding, setSeeding] = React.useState(false);
  const [seedResult, setSeedResult] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<"Easy" | "Medium" | "Hard">("Easy");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [createMsg, setCreateMsg] = React.useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "developer") {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center text-center p-6">
          <ShieldCheck className="h-12 w-12 text-rose-500 mb-3" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">
            Developer role required for platform administration.
          </p>
          <Link href="/login" className="mt-6"><Button>Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  async function handleSeed() {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) setSeedResult(`Success! Seeded courses & problems.`);
      else setSeedResult(`Seed failed: ${data.error}`);
    } catch {
      setSeedResult("Network failure running seed.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" /> Developer Control Panel
          </div>
          <h1 className="text-3xl font-extrabold">Platform Administration</h1>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as <strong>{session.user.name}</strong> ({session.user.email}) · Role: <span className="font-mono text-brand-500">{session.user.role}</span>
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Database className="h-5 w-5 text-brand-500" /> Database Seeding
              </h2>
              <p className="text-xs text-slate-500">Resets or populates sample courses, problems, and contests.</p>
            </div>
        {/* Quick Add Problem */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-brand-500" /> Quick-Add Problem
          </h2>

          {createMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-xs font-medium text-emerald-600">
              {createMsg}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreating(true);
              setCreateMsg(null);
              try {
                const res = await fetch("/api/problems", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title,
                    slug,
                    difficulty,
                    description,
                    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                    testCases: [{ input: "1 2\n", expectedOutput: "3\n", hidden: false }],
                    starterCode: { python: "# solution\n", javascript: "// solution\n" },
                  }),
                });
                if (res.ok) {
                  setCreateMsg("Problem created successfully!");
                  setTitle("");
                  setSlug("");
                  setDescription("");
                } else {
                  const d = await res.json();
                  setCreateMsg(`Error: ${d.error}`);
                }
              } catch {
                setCreateMsg("Network error.");
              } finally {
                setCreating(false);
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title">
                <Input
                  required
                  placeholder="e.g. Reverse Linked List"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                  }}
                />
              </Field>
              <Field label="Slug">
                <Input required value={slug} onChange={(e) => setSlug(e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Difficulty">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  aria-label="Difficulty level"
                  className="w-full rounded-lg bg-slate-100 dark:bg-ink-800 border border-slate-700 px-3 py-2 text-sm"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </Field>
              <Field label="Tags (comma separated)">
                <Input placeholder="Array, Math" value={tags} onChange={(e) => setTags(e.target.value)} />
              </Field>
            </div>

            <Field label="Description (Markdown)">
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="### Problem Statement..."
                className="w-full rounded-lg bg-slate-100 dark:bg-ink-800 border border-slate-700 p-3 font-mono text-xs"
              />
            </Field>

            <Button type="submit" loading={creating}>Create Problem</Button>
          </form>
        </Card>
            <Button onClick={handleSeed} loading={seeding} variant="outline" size="sm">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Run Seeder
            </Button>
          </div>
          {seedResult && (
            <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-xs font-medium text-brand-600 dark:text-brand-300">
              {seedResult}
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}