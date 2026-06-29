"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

// ── Design tokens (matching TargetMarkets) ─────────────────────────────────
const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  cardBg: "#0d0d0c",
  cardBgHover: "#141413",
  cardBorder: "rgba(178,213,229,0.10)",
  cardBorderHover: "rgba(126,195,226,0.28)",
  divider: "rgba(178,213,229,0.10)",
  glowSpot: "rgba(126,195,226,0.08)",
} as const;

interface Phase {
  navLabel: string;
  title: string;
  description: string;
  deliverables: string[];
}

const PHASES: Phase[] = [
  {
    navLabel: "Audit",
    title: "Workflow Audit",
    description:
      "We map your existing workflows before writing a single line of code — surfacing the integrations, edge cases, and legacy constraints that shape every decision that follows.",
    deliverables: [
      "Stakeholder shadow interviews",
      "Process bottleneck maps",
      "API version cataloging",
      "Data structure checks",
    ],
  },
  {
    navLabel: "Blueprint",
    title: "Execution Blueprint",
    description:
      "Every system touchpoint is documented, sequenced, and assigned a risk tier — so engineering effort flows to the highest-impact work first, with nothing built speculatively.",
    deliverables: [
      "Event sequence maps",
      "API contract outlines",
      "ROI priority models",
      "Data validation rules",
    ],
  },
  {
    navLabel: "Build",
    title: "Build & Testing",
    description:
      "Custom agents trained on your actual data and business logic — with human review checkpoints built into every critical pipeline stage from day one.",
    deliverables: [
      "Custom model fine-tuning",
      "Pipeline logic scripts",
      "CRM sync interfaces",
      "Human review lists",
    ],
  },
  {
    navLabel: "Deploy",
    title: "Deploy & Optimization",
    description:
      "Changes ship in controlled increments with automatic rollback conditions — your users see zero disruption while the new system settles.",
    deliverables: [
      "Canary release filters",
      "Reversible DB states",
      "Mock regression checks",
      "SLA logging monitors",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// PhaseBlock – alternates left / right alignment with breathing room
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
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px", once: false });

  const gridSizes = [20, 24, 28, 32];
  const gridOpacities = [0.03, 0.05, 0.04, 0.06];
  const size = gridSizes[index % gridSizes.length];
  const opacity = gridOpacities[index % gridOpacities.length];

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      id={`phase-${index}`}
      className={cn(
        "phase-block relative min-h-[50vh] flex flex-col justify-center overflow-hidden",
        // ── horizontal breathing room ──
        "px-6 md:px-12 lg:px-16",
        isLeft ? "items-start" : "items-end"
      )}
      style={{
        backgroundImage: `
          linear-gradient(rgba(126,195,226,${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(126,195,226,${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    >
      {/* Animated top rule – still spans full container width */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-[#7EC3E2]/30"
        initial={{ width: "0%" }}
        animate={{ width: inView ? "100%" : "0%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      {/* ── Content – left or right aligned within the padded area ── */}
      <motion.div
        className={cn(
          "relative z-10 w-full max-w-[900px] space-y-5 select-text",
          isLeft ? "mr-auto text-left" : "ml-auto text-right"
        )}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: inView ? 1 : 0.18, y: inView ? 0 : 12 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3
          className={cn(
            "font-sans font-bold tracking-[-0.04em] leading-[0.95] whitespace-nowrap",
            "text-[clamp(2.4rem,7vw,3.4rem)]",
            "md:text-[clamp(3.2rem,5.5vw,4.8rem)]",
            "text-[#e5f3e5]"
          )}
        >
          {phase.title}
        </h3>

        <p
          className={cn(
            "font-sans text-[15px] md:text-[16px] text-[rgba(229,243,229,0.65)] leading-[1.7] max-w-[520px]",
            isLeft ? "mr-auto" : "ml-auto"
          )}
        >
          {phase.description}
        </p>

        <div
          className={cn(
            "flex flex-wrap gap-2 pt-1",
            isLeft ? "justify-start" : "justify-end"
          )}
        >
          {phase.deliverables.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.28 + i * 0.07 }}
              className={cn(
                "font-mono text-[9.5px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-500",
                "max-md:text-[8.5px] max-md:px-2.5 max-md:py-1",
                "border-[#7EC3E2]/30 text-[#e5f3e5] bg-[#7EC3E2]/5"
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
// CapabilitiesSection
// ─────────────────────────────────────────────────────────────────
export function CapabilitiesSection() {
  const [activePhase, setActivePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const blocks = container.querySelectorAll<HTMLElement>(".phase-block");
      let current = 0;

      blocks.forEach((el, idx) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (
          top <= window.innerHeight * 0.45 &&
          bottom >= window.innerHeight * 0.35
        ) {
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
    document
      .getElementById(`phase-${idx}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      ref={containerRef}
      id="capabilities"
      aria-label="How We Operate"
      className="relative py-16 md:py-28 select-none"
      style={{
        borderTop: `1px solid ${C.divider}`,
        backgroundColor: "transparent",
      }}
    >
      {/* Watermarks */}
      <div
        aria-hidden
        className="absolute top-4 left-6 font-mono text-[7px] text-[#7EC3E2]/20 pointer-events-none z-10"
      >
        + SEQUENCE_FLOW_TERMINAL
      </div>
      <div
        aria-hidden
        className="absolute bottom-4 right-6 font-mono text-[7px] text-[#7EC3E2]/20 pointer-events-none"
      >
        REF_BLUEPRINT_9048
      </div>

      {/* Layout: nav + alternating phases */}
      <div className="w-full pl-12 pr-2 flex gap-20 relative max-md:pl-6">
        {/* Sticky nav */}
        <aside className="hidden min-[1100px]:flex flex-col w-[120px] shrink-0 sticky top-[180px] h-fit z-25 leading-none">
          <div className="font-mono text-[9px] tracking-[2px] uppercase text-[rgba(229,243,229,0.4)] font-bold mb-7">
            Execution Path
          </div>
          <nav className="flex flex-col">
            {PHASES.map((p, i) => (
              <button
                key={p.navLabel}
                onClick={() => scrollToPhase(i)}
                className={cn(
                  "flex items-center py-4 border-l-2 pl-4 cursor-pointer text-left transition-all duration-300 focus:outline-none",
                  activePhase === i
                    ? "border-[#7EC3E2] text-[#e5f3e5]"
                    : "border-[rgba(178,213,229,0.10)] text-[rgba(229,243,229,0.45)] hover:text-[rgba(229,243,229,0.8)] hover:border-[rgba(126,195,226,0.3)]"
                )}
              >
                <span className="font-mono text-[11px] tracking-widest uppercase">
                  {p.navLabel}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {PHASES.map((phase, i) => (
            <PhaseBlock
              key={phase.navLabel}
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