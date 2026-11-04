import { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  tone?: "light" | "night";
  className?: string;
  as?: ElementType;
}

/** "// LABEL" in mono. */
export function Eyebrow({ children, tone = "light", className, as: Tag = "p" }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "font-mono text-eyebrow uppercase",
        tone === "night" ? "text-night-muted" : "text-ink-3",
        className
      )}
    >
      <span aria-hidden="true">{"// "}</span>
      {children}
    </Tag>
  );
}
