"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { SectionIndex } from "../ui/SectionIndex";
import { cn } from "@/lib/utils";

interface Phase {
  index: string;
  navLabel: string;
  tag: string;
  title: string;
  deliverables: string[];
}

const PHASES: Phase[] = [
  {
    index: "01",
    navLabel: "Audit",
    tag: "Workflow Audit",
    title: "System Discovery & Interviews",
    deliverables: [
      "Stakeholder shadow interviews",
      "Process bottleneck maps",
      "API version cataloging",
      "Data structure checks",
    ],
  },
  {
    index: "02",
    navLabel: "Blueprint",
    tag: "Blueprinting",
    title: "Prioritized Implementation Plan",
    deliverables: [
      "Event sequence maps",
      "API contract outlines",
      "ROI priority models",
      "Data validation rules",
    ],
  },
  {
    index: "03",
    navLabel: "Build",
    tag: "Prototyping",
    title: "Autonomous Agent Core",
    deliverables: [
      "Custom model fine-tuning",
      "Pipeline logic scripts",
      "CRM sync interfaces",
      "Human review lists",
    ],
  },
  {
    index: "04",
    navLabel: "Deploy",
    tag: "Zero-Downtime Releases",
    title: "Staged Production Rollouts",
    deliverables: [
      "Canary release filters",
      "Reversible DB states",
      "Mock regression checks",
      "SLA logging monitors",
    ],
  },
  {
    index: "05",
    navLabel: "Support",
    tag: "SLA Support",
    title: "Active Watchdog Refinements",
    deliverables: [
      "Silent error monitors",
      "Prompt drift tracking",
      "Latency priority checks",
      "Weekly health logs",
    ],
  },
  {
    index: "06",
    navLabel: "Scale",
    tag: "Expansion Coverage",
    title: "Multi-Department Replication",
    deliverables: [
      "Additional silo adapters",
      "Parallel cron jobs",
      "Cross-office maps",
      "Scale optimizations",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// PhaseBlock — individual phase row with scroll-driven animations
// ─────────────────────────────────────────────────────────────────
function PhaseBlock({
  phase,
  index,
  isActive,
}: {
  phase: Phase;
  index: number;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Drives content fade/slide
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px", once: false });

  // Drives the background number parallax — moves at a different rate than content
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div
      ref={ref}
      id={`phase-${index}`}
      className="phase-block relative py-20 overflow-hidden"
    >
      {/* Animated top rule — draws in from left on scroll entry */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-stone-800"
        initial={{ width: "0%" }}
        animate={{ width: inView ? "100%" : "0%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      {/* Parallax background number — independent scroll rate creates depth */}
      <motion.div
        style={{ y: numY, fontSize: "clamp(110px, 17vw, 210px)" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 font-mono font-black leading-none select-none pointer-events-none text-stone-950"
        aria-hidden
      >
        {phase.index}
      </motion.div>

      {/* Foreground content — fades and lifts into view */}
      <motion.div
        className="relative z-10 max-w-[56ch] space-y-7 select-text"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: inView ? 1 : 0.18, y: inView ? 0 : 12 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Phase label + tag */}
        <div className="flex items-center gap-3 font-mono text-[9px] tracking-[3px] uppercase leading-none">
          <span
            className={cn(
              "font-bold transition-colors duration-500",
              isActive ? "text-[#8F7860]" : "text-stone-600"
            )}
          >
            Phase {phase.index}
          </span>
          <span className="text-stone-800">·</span>
          <span className="text-stone-500 tracking-[2px] font-normal">{phase.tag}</span>
        </div>

        {/* Title — brightens when active */}
        <h3
          className={cn(
            "font-serif font-bold tracking-[-0.04em] leading-[0.97] transition-colors duration-700",
            "text-[clamp(2rem,3.8vw,3.4rem)]",
            isActive ? "text-stone-50" : "text-stone-400"
          )}
        >
          {phase.title}
        </h3>

        {/* Body */}
        <p className="font-sans text-[14px] text-stone-500 leading-relaxed max-w-lg">
          Rigid deliverables ensure nothing is built speculatively — keeping your
          legacy interfaces undisturbed throughout the entire deployment lifecycle.
        </p>

        {/* Deliverables — staggered reveal */}
        <div className="flex flex-wrap gap-2 pt-1">
          {phase.deliverables.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.28 + i * 0.07 }}
              className={cn(
                "font-mono text-[9px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-500",
                isActive
                  ? "border-[#8F7860]/30 text-stone-300 bg-[#8F7860]/5"
                  : "border-stone-900 text-stone-600"
              )}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CapabilitiesSection — main export
// ─────────────────────────────────────────────────────────────────
export function CapabilitiesSection() {
  const [activePhase, setActivePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll spy — tracks which phase block sits in the viewport sweet spot
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const blocks = container.querySelectorAll<HTMLElement>(".phase-block");
      let current = 0;

      blocks.forEach((el, idx) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= window.innerHeight * 0.45 && bottom >= window.innerHeight * 0.35) {
          current = idx;
        }
      });

      setActivePhase(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPhase = (idx: number) => {
    document.getElementById(`phase-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      ref={containerRef}
      id="capabilities"
      aria-label="How We Operate"
      className="relative bg-bg-primary border-t border-stone-900 py-24 select-none"
    >
      {/* Corner watermarks */}
      <div aria-hidden className="absolute top-4 left-6 font-mono text-[7px] text-stone-800 pointer-events-none">
        + SEQUENCE_FLOW_TERMINAL
      </div>
      <div aria-hidden className="absolute bottom-4 right-6 font-mono text-[7px] text-stone-800 pointer-events-none">
        REF_BLUEPRINT_9048
      </div>

      <div className="max-w-[1200px] mx-auto px-12 max-md:px-6 flex gap-16 relative">

        {/* ── Sticky side navigation ── */}
        <aside className="hidden min-[1100px]:flex flex-col w-[120px] shrink-0 sticky top-[180px] h-fit z-25 leading-none">
          <div className="font-mono text-[8px] tracking-[2px] uppercase text-stone-600 font-bold mb-6">
            Execution Path
          </div>
          <nav className="flex flex-col">
            {PHASES.map((p, i) => (
              <button
                key={p.index}
                onClick={() => scrollToPhase(i)}
                className={cn(
                  "flex flex-col items-start gap-1 py-4 border-l-2 pl-4 cursor-pointer text-left transition-all duration-300 focus:outline-none",
                  activePhase === i
                    ? "border-[#8F7860] text-stone-100"
                    : "border-stone-900 text-stone-500 hover:text-stone-300 hover:border-stone-700"
                )}
              >
                <span className="font-mono text-[10px] tracking-widest">{p.index}</span>
                <span className="font-mono text-[8px] tracking-[1.5px] uppercase font-bold">{p.navLabel}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Section header */}
          <div className="mb-28">
            <SectionIndex number="03" tag="Methodology" className="mb-8" />
            <h2 className="font-serif text-[clamp(3.2rem,7.5vw,7rem)] font-bold text-stone-100 leading-[0.95] tracking-[-0.04em] mb-8">
              From operational<br />chaos to automated<br />clarity.
            </h2>
            <p className="font-sans text-[14px] text-stone-500 leading-relaxed max-w-sm">
              Six rigid milestones — no loose retainers, no open-ended timelines.
              Success is mapped numerically from Day One.
            </p>
          </div>

          {/* Phase blocks */}
          {PHASES.map((phase, i) => (
            <PhaseBlock
              key={phase.index}
              phase={phase}
              index={i}
              isActive={activePhase === i}
            />
          ))}

        </div>
      </div>
    </section>
  );
}