"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { SectionIndex } from "../ui/SectionIndex";
import { cn } from "@/lib/utils";

interface DeliverableItem {
  name: string;
}

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
    deliverables: ["Stakeholder shadow interviews", "Process bottleneck maps", "API version cataloging", "Data structure checks"],
  },
  {
    index: "02",
    navLabel: "Blueprint",
    tag: "Blueprinting",
    title: "Prioritized Implementation Plan",
    deliverables: ["Event sequence maps", "API contract outlines", "ROI priority models", "Data validation rules"],
  },
  {
    index: "03",
    navLabel: "Build",
    tag: "Prototyping",
    title: "Autonomous Agent Core",
    deliverables: ["Custom model fine-tuning", "Pipeline logic scripts", "CRM sync interfaces", "Human review lists"],
  },
  {
    index: "04",
    navLabel: "Deploy",
    tag: "Zero-Downtime Releases",
    title: "Staged Production Rollins",
    deliverables: ["Canary release filters", "Reversible DB states", "Mock regression checks", "SLA logging monitors"],
  },
  {
    index: "05",
    navLabel: "Support",
    tag: "SLA Support",
    title: "Active Watchdog Refinements",
    deliverables: ["Silent error monitors", "Prompt drift tracking", "Latency priority checks", "Weekly health logs"],
  },
  {
    index: "06",
    navLabel: "Scale",
    tag: "Expansion Coverage",
    title: "Multi-Department Replication",
    deliverables: ["Additional silo adapters", "Parallel cron jobs", "Cross-office maps", "Scale optimizations"],
  },
];

// ── Inside Visualizers matching each active Phase ──────────────────────────
function AuditVisual({ inView }: { inView: boolean }) {
  const rows = [
    { name: "AP Ledger Checks", score: 0.94 },
    { name: "Field Reconciliation", score: 0.81 },
    { name: "Report Formatting", score: 0.62 },
    { name: "Manual HR Checks", score: 0.45 },
    { name: "Exception Routing", score: 0.89 },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-2 select-none font-mono">
      <div className="text-[10px] tracking-wider text-[#8F7860] uppercase font-bold mb-2">Automation Target Potentials</div>
      {rows.map((r, i) => (
        <div key={r.name} className="flex items-center gap-3">
          <span className="text-[10px] text-stone-600 w-5">{String(i + 1).padStart(2, "0")}</span>
          <div className="flex-1 h-1.5 rounded-full bg-stone-900 overflow-hidden">
            <motion.div 
              className="h-full bg-linear-to-r from-[#8F7860] to-[#c4a882] rounded-full"
              style={{ transformOrigin: "left" }}
              initial={{ scaleX: 0 }} 
              animate={inView ? { scaleX: r.score } : {}}
              transition={{ duration: 0.8, delay: i * 0.08 }} 
            />
          </div>
          <span className="text-[10px] text-stone-400 w-24 text-right truncate font-semibold">{r.name}</span>
        </div>
      ))}
    </div>
  );
}

function BlueprintVisual({ inView }: { inView: boolean }) {
  const items = [
    { label: "Accounts Balance Sync", hours: "92%", priority: "CRITICAL" },
    { label: "Approval Signatures", hours: "78%", priority: "HIGH" },
    { label: "Report Aggregations", hours: "54%", priority: "MEDIUM" },
    { label: "SLA Alert Syncs", hours: "85%", priority: "HIGH" },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-3 select-none font-mono">
      <div className="text-[10px] tracking-wider text-[#8F7860] uppercase font-bold mb-2">Priority Impact Mapping</div>
      {items.map((item, i) => (
        <motion.div 
          key={item.label} 
          initial={{ opacity: 0, y: 10 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="flex items-center justify-between border-b border-stone-900 pb-1.5"
        >
          <span className="text-[11px] text-stone-400 truncate max-w-[60%]">{item.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-stone-300 font-bold">{item.hours}</span>
            <span className="text-[8px] tracking-widest uppercase font-black bg-[#8F7860]/10 text-[#8F7860] px-1.5 py-0.5 rounded-[1px]">
              {item.priority}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function BuildVisual({ inView }: { inView: boolean }) {
  const layers = [
    { index: 4, name: "Verification UI", sub: "Interactive human signoff", op: 1 },
    { index: 3, name: "Autonomous Prompts", sub: "Decision checking engine", op: 0.8 },
    { index: 2, name: "Webhook Ingestion", sub: "Trigger data pipelines", op: 0.6 },
    { index: 1, name: "System Adapters", sub: "Direct ERP connection", op: 0.4 },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-2.5 font-mono select-none">
      <div className="text-[10px] tracking-wider text-[#8F7860] uppercase font-bold mb-2">Architectural Blueprint Stack</div>
      {layers.map((l, i) => (
        <motion.div 
          key={l.name} 
          className="flex items-center gap-3 p-2 border border-stone-900 bg-stone-950/45 rounded-[2px]"
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: `rgba(143,120,96, ${l.op})` }} />
          <div>
            <div className="text-[10px] font-bold text-stone-200 uppercase leading-none">{l.name}</div>
            <div className="text-[8px] text-stone-600 mt-0.5 leading-none">{l.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DeployVisual({ inView }: { inView: boolean }) {
  const entries = [
    { time: "16:20", text: "Ingesting NetSuite entities" },
    { time: "16:21", text: "Lint check successful (202 fields)" },
    { time: "16:21", text: "Mirror backup verified" },
    { time: "16:22", text: "Canary routing online (5% scope)" },
    { time: "16:23", text: "Deployment complete. Zero downtime." },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-2 font-mono select-none">
      <div className="text-[10px] tracking-wider text-[#8F7860] uppercase font-bold mb-2">Deployment Telemetry</div>
      {entries.map((entry, i) => (
        <motion.div 
          key={entry.text} 
          className="flex items-start gap-2.5 text-[10px]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: i * 0.1 }}
        >
          <span className="text-stone-600 font-bold tabular-nums">{entry.time}</span>
          <span className="text-stone-400 truncate">{entry.text}</span>
          {i === entries.length - 1 && (
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0 self-center animate-ping" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function SupportVisual({ inView }: { inView: boolean }) {
  const gauges = [
    { label: "Adapter Latency", val: "140ms", pct: 0.9 },
    { label: "Token Processing", val: "940/sec", pct: 0.72 },
    { label: "Audited Ledger Index", val: "542,880", pct: 0.98 },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-4 font-mono select-none">
      <div className="text-[10px] tracking-wider text-[#8F7860] uppercase font-bold mb-1">Live Pipeline Watchdogs</div>
      {gauges.map((g, i) => (
        <div key={g.label} className="space-y-1">
          <div className="flex justify-between text-[10px] text-stone-500 font-bold">
            <span>{g.label}</span>
            <span className="text-[#8F7860]">{g.val}</span>
          </div>
          <div className="w-full h-1 bg-stone-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-linear-to-r from-[#8F7860]/40 to-[#8F7860]"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: g.pct } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScaleVisual({ inView }: { inView: boolean }) {
  const steps = [30, 48, 62, 75, 89, 98];
  return (
    <div className="p-6 h-full flex flex-col justify-between font-mono select-none">
      <div className="text-[10px] tracking-wider text-[#8F7860] uppercase font-bold mb-2">Automated Process Dividends</div>
      <div className="flex-1 flex gap-2.5 items-end pb-2">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <motion.div 
              className="w-full bg-linear-to-t from-stone-900 to-[#8F7860]/30 border border-[#8F7860]/20 rounded-t-[1px]"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: step / 100 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              style={{ transformOrigin: "bottom", height: `${(step / 100) * 110}px` }}
            />
            <span className="text-[8px] text-stone-600 mt-2">M{i+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseVisual({ index, inView }: { index: number; inView: boolean }) {
  const components = [AuditVisual, BlueprintVisual, BuildVisual, DeployVisual, SupportVisual, ScaleVisual];
  const ActiveComponent = components[index];
  return <ActiveComponent inView={inView} />;
}

export function CapabilitiesSection() {
  const [activePhase, setActivePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const phaseElements = container.querySelectorAll(".phase-block");
      let currentIdx = 0;
      
      phaseElements.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        // Check if the block is near the scroll threshold
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.35) {
          currentIdx = idx;
        }
      });
      setActivePhase(currentIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (idx: number) => {
    const el = document.getElementById(`phase-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="capabilities"
      aria-label="How We Operate"
      className="relative bg-bg-primary border-t border-stone-900 py-24 select-none"
    >
      {/* Blueprint corner details */}
      <div aria-hidden className="absolute top-4 left-6 font-mono text-[7px] text-stone-700 pointer-events-none">+ SEQUENCE_FLOW_TERMINAL</div>
      <div aria-hidden className="absolute bottom-4 right-6 font-mono text-[7px] text-stone-700 pointer-events-none">REF_BLUEPRINT_9048</div>

      <div className="max-w-[1200px] mx-auto px-12 max-md:px-6 flex gap-12 relative">
        
        {/* Sticky side nav navigator (Visible on wide viewports) */}
        <div className="hidden min-[1100px]:flex flex-col w-[120px] shrink-0 sticky top-[180px] h-fit z-25 leading-none">
          <div className="font-mono text-[8px] tracking-[2px] uppercase text-stone-600 font-bold mb-6">Execution Path</div>
          
          <div className="flex flex-col self-start">
            {PHASES.map((p, i) => (
              <button
                key={p.index}
                onClick={() => handleNavClick(i)}
                className={cn(
                  "flex flex-col items-start gap-1 py-4 border-l-2 pl-4 cursor-pointer text-left focus:outline-none transition-all outline-none",
                  activePhase === i 
                    ? "border-[#8F7860] text-stone-100 font-bold" 
                    : "border-stone-900 text-stone-500 hover:text-stone-300 hover:border-stone-700"
                )}
              >
                <span className="font-mono text-[10px] tracking-widest">{p.index}</span>
                <span className="font-mono text-[8px] tracking-[1.5px] uppercase font-bold">{p.navLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phase content loop blocks */}
        <div className="flex-1 space-y-32">
          
          {/* Main Title Section */}
          <div className="max-w-xl">
            <SectionIndex number="03" tag="Methodology" className="mb-6" />
            <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-bold text-stone-100 leading-[1.08] tracking-[-0.035em] mb-6">
              From operational chaos<br />to automated clarity.
            </h2>
            <p className="font-sans text-[15px] font-normal text-stone-400 leading-relaxed">
              We deploy systems in six rigid milestones. There are no loose retainers or open-ended timelines. Success is mapped numerically from Day One.
            </p>
          </div>

          {/* Symmetrical Phase loops */}
          {PHASES.map((p, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={p.index}
                id={`phase-${i}`}
                className="phase-block border-t border-stone-900/60 pt-16 flex flex-col md:flex-row gap-10 items-stretch"
              >
                {/* Text Content block */}
                <div className={cn("flex-1 space-y-6 select-text", !isEven && "md:order-2")}>
                  <div className="font-mono text-[10px] tracking-[3px] uppercase text-[#8F7860] font-bold">
                    Phase {p.index} · {p.tag}
                  </div>
                  
                  <h3 className="font-serif text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold tracking-tight text-stone-100 leading-[1.1]">
                    {p.title}
                  </h3>

                  <p className="font-sans text-[14px] font-normal leading-relaxed text-stone-400 max-w-lg">
                    We establish rigid deliverables to ensure nothing is built speculatively. This structural discipline ensures your legacy interfaces remain undisturbed.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {p.deliverables.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[9px] tracking-wider font-semibold border border-stone-900 bg-stone-950/40 text-stone-400 px-3 py-1.5 rounded-[2px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Simulated visual feedback panel */}
                <div className={cn("w-full md:w-[320px] shrink-0 border border-stone-900 bg-stone-950/20 rounded-[2px] h-[240px] relative overflow-hidden", !isEven && "md:order-1")}>
                  {/* Watermark grid details */}
                  <div aria-hidden className="absolute top-2 left-2 font-mono text-[6px] text-stone-800 tracking-widest uppercase select-none">
                    DIAG_PANEL_REF_{p.index}
                  </div>
                  <div aria-hidden className="absolute inset-0 opacity-[0.05] hero-grid-bg" />
                  
                  {/* Direct visual elements */}
                  <PhaseVisual index={i} inView={activePhase === i} />
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
