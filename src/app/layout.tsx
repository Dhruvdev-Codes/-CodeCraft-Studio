import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "CodeCraft Studio — Learn. Code. Compete.",
    template: "%s · CodeCraft Studio",
  },
  description:
    "CodeCraft Studio is an interactive coding platform with a secure cloud IDE, multi-language courses, contest arena, live leaderboards, and an AI coding mentor.",
  keywords: [
    "coding platform",
    "online compiler",
    "learn to code",
    "coding contest",
    "AI tutor",
    "Python",
    "JavaScript",
    "Java",
    "C++",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}