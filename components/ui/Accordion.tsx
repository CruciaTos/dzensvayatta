"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  q: ReactNode;
  /** One-line answer shown under the question while closed. */
  short?: string;
  a: ReactNode;
}

// Closed rows alternate these (pale cobalt, pale violet: the poster's two glows).
const ROW_TINTS = ["bg-tint", "bg-[rgb(var(--violet-rgb)/0.14)]"];

function stableId(text: string) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `acc-${(h >>> 0).toString(36)}`;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Index open on first render; null for all closed. */
  defaultOpen?: number | null;
  headingAs?: "h3" | "h4";
  className?: string;
}

/**
 * One-open-at-a-time accordion (§H9). Each header is a real <button> with
 * aria-expanded/aria-controls; ↑ ↓ Home End move between headers. Closed
 * panels stay in the HTML (for crawlers) but are inert.
 *
 * Closed questions sit on rounded rows that alternate two pale tints from
 * the palette (cobalt, violet); the open one turns white, outlined.
 */
export function Accordion({ items, defaultOpen = 0, headingAs: Heading = "h3", className }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  // A stable id from the questions themselves. useId() shifted between server
  // and client under the experimental <ViewTransition> wrapper (hydration warning).
  const id = stableId(items.map((it, i) => (typeof it.q === "string" ? it.q : it.short ?? String(i))).join("|"));
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = items.length - 1;
    const target =
      e.key === "ArrowDown" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowUp" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    buttons.current[target]?.focus();
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${id}-q${i}`;
        const panelId = `${id}-a${i}`;
        return (
          <div
            key={i}
            className={cn(
              "rounded-card px-5 ring-1 ring-inset transition-[background-color,box-shadow] duration-med ease-expo md:px-8",
              isOpen ? "bg-paper ring-line" : cn("ring-transparent", ROW_TINTS[i % ROW_TINTS.length])
            )}
          >
            <Heading>
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group/acc flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
              >
                <span className="min-w-0">
                  <span className="block text-[clamp(1.25rem,2.2vw,1.9rem)] font-normal leading-[1.2] tracking-[-0.015em] text-ink">
                    {item.q}
                  </span>
                  {item.short && (
                    <span className="mt-2 block text-[15px] leading-snug text-ink-3">{item.short}</span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-med ease-expo md:size-16",
                    isOpen ? "rotate-90 bg-sky text-night" : "bg-ink text-paper group-hover/acc:bg-ink-2"
                  )}
                >
                  <ArrowUpRight className="size-5 md:size-6" strokeWidth={1.5} />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-med ease-expo",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-[760px] pb-8 text-[17px] leading-[1.65] text-ink-2">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
