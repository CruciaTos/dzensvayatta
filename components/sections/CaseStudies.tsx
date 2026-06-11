"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";

const CASE_STUDIES = [
  {
    id: "01",
    tag: "Finance Operations",
    industry: "Professional Services",
    headline: "14 hours of manual invoice reconciliation — eliminated.",
    body: "A mid-market professional services firm was spending 14 hours per week manually matching invoices across their ERP and billing platform. We mapped the exact decision logic their team was applying, built an agent to replicate it, and deployed a pipeline that now handles 94% of cases autonomously — with a human review queue for the remaining 6%.",
    metrics: [
      { value: "94%", label: "Auto-resolution rate" },
      { value: "14h", label: "Saved per week" },
      { value: "3wk", label: "Time to production" },
    ],
  },
  {
    id: "02",
    tag: "Approval Routing",
    industry: "Operations",
    headline: "Cross-department approvals down from 4 days to 6 hours.",
    body: "An operations team was losing 4+ days on approvals that crossed three departments, each working in a different tool. We built an orchestration layer that read from their existing systems, routed tasks based on live context, and escalated only when human judgement was actually needed. No new tools. No workflow re-training.",
    metrics: [
      { value: "6h", label: "Avg. approval time (was 4d)" },
      { value: "3", label: "Systems connected" },
      { value: "0", label: "New tools adopted" },
    ],
  },
  {
    id: "03",
    tag: "Reporting Automation",
    industry: "Finance",
    headline: "Weekly finance reports — from 6 hours to 12 minutes.",
    body: "A finance team was manually assembling weekly reports from four data sources into a single deck, every Friday. We built a pipeline that pulls, transforms, and formats the report automatically. It runs on a schedule, flags anomalies before the team even opens it, and delivers a draft ready for final review.",
    metrics: [
      { value: "12min", label: "Report generation (was 6h)" },
      { value: "4", label: "Data sources unified" },
      { value: "100%", label: "On-schedule delivery" },
    ],
  },
];

function MetricBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-4 border border-border bg-bg-primary">
      <div className="font-serif text-[clamp(22px,2.5vw,32px)] font-normal text-accent leading-none tracking-[-0.02em]">
        {value}
      </div>
      <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-stone-500 leading-[1.5]">
        {label}
      </div>
    </div>
  );
}

function CaseStudyCard({
  study,
  index,
}: {
  study: (typeof CASE_STUDIES)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const isEven = index % 2 === 0;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="border border-border bg-bg-panel relative overflow-hidden group"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isEven
            ? "radial-gradient(ellipse at top left, rgba(143,120,96,0.05) 0%, transparent 60%)"
            : "radial-gradient(ellipse at top right, rgba(143,120,96,0.05) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="p-10 max-md:p-8 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent px-2 py-1 border border-accent/15 bg-accent/[0.15]">
              {study.tag}
            </span>
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-stone-500">
              {study.industry}
            </span>
          </div>
          <span className="font-mono text-[clamp(2rem,5vw,3.5rem)] font-light text-stone-600/30 leading-none select-none flex-shrink-0">
            {study.id}
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-serif text-[clamp(20px,2.2vw,28px)] font-normal text-stone-100 leading-[1.2] tracking-[-0.015em] mb-5 max-w-[560px]">
          {study.headline}
        </h3>

        {/* Body */}
        <p className="font-sans text-[14px] font-light text-stone-400 leading-[1.75] mb-8 max-w-[620px]">
          {study.body}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-[2px]">
          {study.metrics.map((m) => (
            <MetricBlock key={m.label} value={m.value} label={m.label} />
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="h-px bg-accent/30 origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.article>
  );
}

export function CaseStudies() {
  return (
    <section
      id="cases"
      aria-label="Case studies and results"
      className="py-[120px] bg-bg-secondary border-t border-border"
    >
      <Container>
        {/* Header */}
        <FadeIn>
          <div className="flex items-end justify-between mb-20 gap-12 max-md:flex-col max-md:items-start">
            <div>
              <SectionIndex number="04" tag="Results" className="mb-6" />
              <h2 className="font-serif text-display-3 font-normal text-stone-100">
                Outcomes, not promises.
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* Case study cards */}
        <div className="flex flex-col gap-[2px]">
          {CASE_STUDIES.map((study, i) => (
            <CaseStudyCard key={study.id} study={study} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <FadeIn delay={0.2}>
          <div className="flex items-center gap-6 mt-14 pt-10 border-t border-border flex-wrap">
            <div className="flex items-center gap-[10px]">
              <div className="w-[6px] h-[6px] bg-accent flex-shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone-500">
                All results from production deployments
              </span>
            </div>
            <div className="flex items-center gap-[10px]">
              <div className="w-[6px] h-[6px] bg-stone-500 flex-shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone-500">
                Client details anonymised by request
              </span>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}