"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Code2, Menu, Trophy, Bot, BookOpen, SquareTerminal, LayoutDashboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeProvider";
import { useAIContext } from "./AIProvider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/problems", label: "Problems", icon: SquareTerminal },
  { href: "/contest", label: "Contests", icon: Trophy },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { setOpen } = useAIContext();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isAdmin = session?.user?.role === "developer";
  const isPublic = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register");

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = isPublic ? [] : NAV_ITEMS;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-ink-900/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md shadow-brand-600/30">
              <Code2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              CodeCraft<span className="text-brand-600 dark:text-brand-400"> Studio</span>
            </span>
          </Link>
          {navItems.length > 0 && (
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const active =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bot className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            AI Mentor
          </button>
          <ThemeToggle />
          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          ) : session ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                </Link>
              )}
<div className="relative group">
                <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-sm font-semibold text-white">
                    {(session.user?.name || session.user?.email || "?").slice(0, 1).toUpperCase()}
                  </span>
                </button>
                <div className="absolute right-0 top-full z-50 mt-2 hidden w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-800 p-2 shadow-xl group-hover:block">
                  <div className="border-b border-slate-100 dark:border-slate-800 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {session.user?.name || "Student"}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{session.user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30"
              >
                Sign up free
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-900 px-4 py-3 md:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname.startsWith(item.href)
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-slate-600 dark:text-slate-300"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            {!session && (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-center text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-center text-sm font-medium text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}