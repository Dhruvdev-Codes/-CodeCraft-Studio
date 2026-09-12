import * as React from "react";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Button                                                               */
/* ------------------------------------------------------------------ */
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/30",
  secondary:
    "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900",
  outline:
    "border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 bg-transparent",
  ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300",
  danger: "bg-rose-600 hover:bg-rose-700 text-white",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-ink-800 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-100 dark:border-slate-800">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form controls                                                        */
/* ------------------------------------------------------------------ */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-ink-900 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Badge                                                                */
/* ------------------------------------------------------------------ */
type BadgeTone = "green" | "red" | "amber" | "blue" | "slate" | "violet" | "brand";

const badgeTones: Record<BadgeTone, string> = {
  green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  red: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
  blue: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  brand: "bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400",
};

export function Badge({
  tone = "slate",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Maps a submission status to a badge tone. */
export function statusTone(status: string): BadgeTone {
  switch (status) {
    case "Accepted":
      return "green";
    case "Wrong Answer":
      return "red";
    case "Time Limit Exceeded":
      return "amber";
    case "Runtime Error":
    case "Compilation Error":
      return "red";
    default:
      return "slate";
  }
}

/** Maps a difficulty to a badge tone. */
export function difficultyTone(difficulty: string): BadgeTone {
  switch (difficulty) {
    case "Beginner":
      return "green";
    case "Intermediate":
      return "amber";
    case "Advanced":
      return "red";
    default:
      return "slate";
  }
}
export function StatusBadge({
  status,
  children,
  className,
}: {
  status: "easy" | "medium" | "hard" | "accepted" | "failed" | "running" | "pending";
  children?: React.ReactNode;
  className?: string;
}) {
  const toneMap: Record<string, BadgeTone> = {
    easy: "green",
    medium: "amber",
    hard: "red",
    accepted: "green",
    failed: "red",
    running: "blue",
    pending: "amber",
  };
  return (
    <Badge tone={toneMap[status] || "slate"} className={className}>
      {children || status}
    </Badge>
  );
}


/* ------------------------------------------------------------------ */
/* Spinner / Empty state                                                */
/* ------------------------------------------------------------------ */
export function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-7 w-7";
  return (
    <div className={cn("flex items-center justify-center py-6", className)}>
      <Loader2 className={cn("animate-spin text-brand-600 dark:text-brand-400", sizeClass)} />
    </div>
  );
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                                */
/* ------------------------------------------------------------------ */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "relative w-full rounded-2xl bg-white dark:bg-ink-800 border border-slate-200 dark:border-slate-700 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-ink-800/95 backdrop-blur px-5 py-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Table                                                                */
/* ------------------------------------------------------------------ */
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/60",
        className
      )}
    >
      {children}
    </td>
  );
}