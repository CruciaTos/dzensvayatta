import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProcessCardProps {
  index: string; // "01"
  label?: string; // "AUDIT" → chip reads "01 / AUDIT"
  phase?: string; // "Discovery", in italic serif on the right
  title: ReactNode;
  body: ReactNode;
  /** One-line deliverable under a dashed rule. Leave out for principle cards. */
  outcome?: string;
  headingAs?: "h3" | "h4";
  className?: string;
}

/** Bordered card for process steps and principles (§H7). */
export function ProcessCard({
  index,
  label,
  phase,
  title,
  body,
  outcome,
  headingAs: Heading = "h3",
  className,
}: ProcessCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between gap-8 rounded-card border border-line bg-paper px-[26px] py-7 transition-[transform,border-color,box-shadow] duration-med ease-expo hover:-translate-y-1 hover:border-ink hover:shadow-hover",
        outcome && "min-h-[320px]",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-chip bg-surface px-[9px] py-1 font-mono text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink">
            {index}
            {label && ` / ${label}`}
          </span>
          {phase && <span className="font-serif text-[19px] font-light italic text-ink-3">{phase}</span>}
        </div>
        <Heading className="mt-8 text-title-s text-ink">{title}</Heading>
        <p className="mt-3 text-small text-ink-2">{body}</p>
      </div>

      {outcome && (
        <div className="border-t border-dashed border-line-strong pt-3.5">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3">Outcome</p>
          <p className="mt-1.5 text-[13px] leading-snug text-ink">{outcome}</p>
        </div>
      )}
    </div>
  );
}
