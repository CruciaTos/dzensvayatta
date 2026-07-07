"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { COMPARISON_ROWS } from "@/lib/data";
import type { ComparisonRow } from "@/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function ComparisonRowItem({ row, index }: { row: ComparisonRow; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-[1fr_2fr] gap-10 py-8 border-b border-border items-center max-md:grid-cols-1 max-md:gap-5"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE_OUT }}
    >
      <div>
        <h3 className="font-sans text-[15px] font-normal text-stone-100 tracking-[-0.01em] mb-1">
          {row.label}
        </h3>
        <span className="font-mono text-[9px] tracking-[.14em] uppercase text-accent">
          {row.improvement}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Before */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] tracking-[.12em] uppercase text-stone-500 w-20 flex-shrink-0">
            Before
          </span>
          <div className="flex-1 h-[6px] bg-ink/[.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-stone-500/40"
              style={{ transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: row.before.percent / 100 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + index * 0.05, ease: EASE_OUT }}
            />
          </div>
          <span className="font-mono text-[11px] text-stone-400 w-28 text-right flex-shrink-0">
            {row.before.value}
          </span>
        </div>

        {/* After */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] tracking-[.12em] uppercase text-accent w-20 flex-shrink-0">
            After
          </span>
          <div className="flex-1 h-[6px] bg-ink/[.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #8F7860, rgba(143,120,96,0.5))",
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: row.after.percent / 100 } : {}}
              transition={{ duration: 0.7, delay: 0.25 + index * 0.05, ease: EASE_OUT }}
            />
          </div>
          <span className="font-mono text-[11px] text-accent w-28 text-right flex-shrink-0">
            {row.after.value}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function OptimisationComparison() {
  return (
    <section
      id="optimisation"
      aria-label="Optimisation impact"
      className="py-[120px] bg-bg-primary border-t border-border"
    >
      <Container>
        <FadeIn>
          <div className="flex items-end justify-between mb-16 gap-12 max-md:flex-col max-md:items-start">
            <div>
              <SectionIndex number="06" tag="Optimisation Impact" className="mb-6" />
              <h2 className="font-serif text-display-3 font-normal text-stone-100 max-w-[620px]">
                Svayatta Impact !!
                <br />

              </h2>
            </div>
            <div className="max-w-[380px] flex-shrink-0">
              <p className="font-sans text-body font-light text-stone-400 leading-[1.7]">
                Real before-and-after figures from deployed automations: the same workflows, measured before and after the integration layer went live.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="border-t border-border">
          {COMPARISON_ROWS.map((row, i) => (
            <ComparisonRowItem key={row.label} row={row} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
