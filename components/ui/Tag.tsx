import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { WorkStatus } from "@/types/content";

export type TagVariant = "tint" | "soft" | "mono" | "onImage" | "status";

interface TagProps {
  variant?: TagVariant;
  /** For variant="status": colours the dot. */
  status?: WorkStatus;
  tone?: "light" | "night";
  className?: string;
  children: ReactNode;
}

const DOT: Record<WorkStatus, string> = {
  live: "bg-success",
  "in-development": "bg-sky",
  pilot: "bg-sky",
};

export function Tag({ variant = "tint", status = "live", tone = "light", className, children }: TagProps) {
  const night = tone === "night";
  const styles: Record<TagVariant, string> = {
    tint: "rounded-pill bg-tint px-3 py-[5px] text-[12px] font-medium leading-none text-accent",
    soft: "rounded-pill border border-line bg-surface px-3 py-[5px] text-[12px] font-medium leading-none text-ink-2",
    mono: cn(
      "rounded-pill border px-2.5 py-[5px] font-mono text-[11.5px] uppercase leading-none tracking-[0.08em]",
      night ? "border-night-line text-night-ink" : "border-line text-ink-2"
    ),
    onImage:
      "rounded-pill bg-[rgba(6,26,61,0.8)] px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-[0.1em] text-white backdrop-blur-md",
    status: cn(
      "gap-2 rounded-pill border px-2.5 py-[5px] font-mono text-[11px] font-medium uppercase leading-none tracking-[0.1em]",
      night ? "border-night-line text-night-ink" : "border-line text-ink-2"
    ),
  };

  return (
    <span className={cn("inline-flex items-center whitespace-nowrap", styles[variant], className)}>
      {variant === "status" && (
        <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", DOT[status])} />
      )}
      {children}
    </span>
  );
}
