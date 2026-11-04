"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ElementType } from "react";
import { tokenize } from "./ScrollWords";

/**
 * A heading whose words rise out of a mask, one after another, when it
 * enters the viewport. Same markup as em(): *word* = italic serif, "\n" =
 * line break, ^word^ = Devanagari. Real text stays in the DOM for readers.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

interface MaskRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Play on mount instead of when scrolled into view (for page heroes). */
  immediate?: boolean;
}

export function MaskReveal({ text, as: Tag = "h2", className, id, delay = 0, immediate = false }: MaskRevealProps) {
  const reduce = useReducedMotion();
  // Watch the whole heading: the words themselves start clipped by their masks,
  // so an observer on them would never see them as on screen.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const show = immediate || inView;
  const lines = text.split("\n").map((line) => tokenize(line));
  let n = 0;

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((tokens, li) => (
        <span key={li} className="block">
          {tokens.map((t, wi) => {
            const i = n++;
            const cls = t.kind === "em" ? "em" : t.kind === "deva" ? "deva text-accent" : undefined;
            return (
              <span key={wi}>
                {/* The mask: words sit below the line and rise into it. Padding keeps descenders and italics unclipped. */}
                <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] pr-[0.06em] align-bottom">
                  <motion.span
                    className={`inline-block ${cls ?? ""}`}
                    lang={t.kind === "deva" ? "hi" : undefined}
                    initial={reduce ? false : { y: "110%", rotate: 4 }}
                    animate={show ? { y: "0%", rotate: 0 } : undefined}
                    transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
                  >
                    {t.word}
                  </motion.span>
                </span>{" "}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
