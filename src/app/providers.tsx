"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AIProvider } from "@/components/AIProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AIProvider>{children}</AIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}