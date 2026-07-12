"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
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
}

const PHASES: Phase[] = [
  {
    navLabel: "Audit",
    title: "Workflow Audit",
    description:
      "We map your workflows before we write code. That surfaces the integrations, edge cases, and legacy constraints that shape what we build next.",
  },
  {
    navLabel: "Blueprint",
    title: "Execution Blueprint",
    description:
      "Every system touchpoint gets documented, sequenced, and risk-rated. Engineering effort goes to the highest-impact work first. Nothing gets built on assumptions.",
  },
  {
    navLabel: "Build",
    title: "Build & Testing",
    description:
      "Custom agents trained on your data and business logic. Human review checkpoints sit in every critical pipeline stage from day one.",
  },
  {
    navLabel: "Deploy",
    title: "Deploy & Optimization",
    description:
      "Changes ship in small, controlled increments with rollback built in. Users see no disruption while the new system beds in.",
  },
];

// ─────────────────────────────────────────────────────────────────
// PhaseBlock – two-column layout: text + image panel
// ─────────────────────────────────────────────────────────────────
function PhaseBlock({
  phase,
  index,
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

  // isLeft = text is on the left → image goes on the right
  const isLeft = index % 2 === 0;

  const PHASE_IMAGES = [
    "/images/workflow.jpeg",
    "/images/blueprint.jpeg",
    "/images/build.jpeg",
    "/images/deploy.jpeg",
  ];
  const imageSrc = PHASE_IMAGES[index % PHASE_IMAGES.length];

  // ── Image panel ──────────────────────────────────────────────────
  const ImagePanel = (
    <motion.div
      className="hidden md:block flex-shrink-0 w-[300px] lg:w-[340px] xl:w-[400px] self-stretch min-h-[260px] rounded-xl overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.96 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
    >
      <Image
        src={imageSrc}
        alt={`${phase.title} visual`}
        fill
        className="object-cover rounded-xl"
        sizes="(max-width: 768px) 0px, (max-width: 1280px) 340px, 400px"
      />
    </motion.div>
  );

  return (
    <div
      ref={ref}
      id={`phase-${index}`}
      className={cn(
        "phase-block relative min-h-[50vh] flex overflow-hidden rounded-2xl border border-[#7EC3E2]/20 bg-black/65",
        "px-6 md:px-10 lg:px-14 mr-4 py-10 md:py-14",
        "items-center gap-8 lg:gap-12",
        // text-left → image right; text-right → image left
        isLeft ? "flex-row" : "flex-row-reverse"
      )}
      style={{
        backgroundImage: `
          linear-gradient(rgba(126,195,226,${opacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(126,195,226,${opacity}) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    >
      {/* Animated top rule */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-[#7EC3E2]/30"
        initial={{ width: "0%" }}
        animate={{ width: inView ? "100%" : "0%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      {/* ── Text content ── */}
      <motion.div
        className={cn(
          "relative z-10 flex-1 min-w-0 space-y-5 select-text",
          isLeft ? "text-left" : "text-right"
        )}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: inView ? 1 : 0.18, y: inView ? 0 : 12 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3
          className={cn(
            "font-sans font-bold tracking-[-0.04em] leading-[0.95]",
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
      </motion.div>

      {/* ── Image / Placeholder (hidden on mobile) ── */}
      {ImagePanel}
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
      {/* Layout: nav + alternating phases */}
      <div className="w-full pl-12 pr-2 flex gap-20 relative max-md:pl-6">
        {/* Sticky nav */}
        <aside className="hidden min-[1100px]:flex flex-col w-[160px] shrink-0 sticky top-[160px] h-fit z-25 leading-none">
          <div className="font-mono text-[9px] tracking-[2px] uppercase text-[rgba(229,243,229,0.4)] font-bold mb-7">
            Execution Path
          </div>
          <nav className="flex flex-col">
            {PHASES.map((p, i) => (
              <button
                key={p.navLabel}
                onClick={() => scrollToPhase(i)}
                className={cn(
                  "flex items-center py-7 border-l-2 pl-5 cursor-pointer text-left transition-all duration-300 focus:outline-none",
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

        {/* Main content – flex column with gap */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
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
