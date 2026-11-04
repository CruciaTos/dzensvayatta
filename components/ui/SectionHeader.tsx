import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { PillButton } from "./PillButton";

interface SectionHeaderProps {
  /** Shown as "// EYEBROW". */
  eyebrow?: string;
  /** Usually em("Products *we've shipped*"). */
  title: ReactNode;
  /** Outline pill aligned bottom-right. */
  action?: { label: string; href: string };
  description?: ReactNode;
  as?: "h1" | "h2";
  tone?: "light" | "night";
  /** id on the heading, for aria-labelledby on the section. */
  id?: string;
  className?: string;
}

/** The one section header used everywhere (§3): eyebrow, big heading, pill on the right. */
export function SectionHeader({
  eyebrow,
  title,
  action,
  description,
  as: Heading = "h2",
  tone = "light",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10 md:mb-12",
        className
      )}
    >
      <div className="max-w-[880px]">
        {eyebrow && (
          <Eyebrow tone={tone} className="mb-5">
            {eyebrow}
          </Eyebrow>
        )}
        <Heading id={id} className={cn("text-display-l", tone === "night" ? "text-night-ink" : "text-ink")}>
          {title}
        </Heading>
        {description && (
          <p className={cn("mt-5 max-w-[620px] text-body", tone === "night" ? "text-night-muted" : "text-ink-2")}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <PillButton href={action.href} variant="outline" tone={tone} className="shrink-0 self-start sm:self-auto">
          {action.label}
        </PillButton>
      )}
    </div>
  );
}
