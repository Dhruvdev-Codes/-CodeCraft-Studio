"use client";

import * as React from "react";
import { Bot, Send, Sparkles, X, Loader2 } from "lucide-react";
import type { AIContext, ChatMessage } from "@/types";

type AIContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeContext: AIContext | null;
  setActiveContext: (ctx: AIContext | null) => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  streaming: boolean;
};

const AIContext = React.createContext<AIContextValue | null>(null);

export function useAIContext() {
  const ctx = React.useContext(AIContext);
  if (!ctx) throw new Error("useAIContext must be used within AIProvider");
  return ctx;
}
export function useAI() {
  const ctx = useAIContext();
  return {
    ...ctx,
    setContext: ctx.setActiveContext,
    openDrawer: () => ctx.setOpen(true),
  };
}


export function AIProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const [activeContext, setActiveContext] = React.useState<AIContext | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm **CodeCraft AI** — your coding mentor. Ask me about programming concepts, debugging, algorithmic approaches, or contest strategy. I can also see the code in your active editor when you're working on a problem.",
    },
  ]);

  const sendMessage = React.useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = { role: "user", content };
      const updated = [...messages, userMessage];
      setMessages(updated);
      setStreaming(true);

      const placeholder: ChatMessage = { role: "assistant", content: "" };
      setMessages([...updated, placeholder]);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updated, context: activeContext }),
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          setMessages([
            ...updated,
            { role: "assistant", content: errText || "Failed to reach the AI service. Check that GEMINI_API_KEY is configured." },
          ]);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let sofar = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          sofar += decoder.decode(value, { stream: true });
          setMessages([...updated, { role: "assistant", content: sofar }]);
        }
      } catch (error) {
        setMessages([
          ...updated,
          { role: "assistant", content: "Something went wrong streaming the reply. Please try again." },
        ]);
      } finally {
        setStreaming(false);
      }
    },
    [activeContext, messages]
  );

  const value = React.useMemo(
    () => ({ open, setOpen, activeContext, setActiveContext, messages, sendMessage, streaming }),
    [open, activeContext, messages, sendMessage, streaming]
  );
  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}


  /** Floating chat drawer, mounted once per app layout. */
export function AIAssistant() {
  const { open, setOpen, messages, sendMessage, streaming, activeContext } = useAIContext();
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || streaming) return;
    setDraft("");
    await sendMessage(text);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open CodeCraft AI"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-600/40 hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 flex h-[540px] w-[400px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-ink-800 shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 bg-gradient-to-r from-brand-600 to-violet-600 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold leading-tight">CodeCraft AI</p>
                <p className="text-[11px] text-white/70">
                  {activeContext?.language
                    ? `Context: ${activeContext.language} · ${activeContext.page || "workspace"}`
                    : "General coding mentor"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/20" aria-label="Close AI">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md markdown-body"
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex items-center gap-1.5 text-slate-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <form onSubmit={handleSend} className="border-t border-slate-100 dark:border-slate-800 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask about code, concepts, or bugs…"
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-ink-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={streaming || !draft.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 transition-colors"
                aria-label="Send"
              >
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}