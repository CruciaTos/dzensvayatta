"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
interface DeliverableItem {
  icon: string;
  name: string;
  desc: string;
}

interface Phase {
  index: string;
  navLabel: string;
  tag: string;
  title: string;
  description: string;
  outcomeLabel: string;
  outcome: string;
  listLabel: string;
  items: DeliverableItem[];
}

// ── Data ───────────────────────────────────────────────────────────────────
const PHASES: Phase[] = [
  {
    index: "01",
    navLabel: "Audit",
    tag: "Workflow Audit",
    title: "Workflow Audit",
    description:
      "We embed ourselves in how your business actually operates — not how it's documented. Through team interviews, process shadowing, and systems analysis, we map every workflow, data flow, handoff, and manual touchpoint. No assumption goes untested. We surface the bottlenecks, redundancies, and repetitive dependencies that slow your team down and quietly erode margin.",
    outcomeLabel: "What you receive",
    outcome:
      "A complete, unambiguous picture of how your business currently operates — every workflow documented, every friction point named, and every manual dependency understood before a single line of automation is written.",
    listLabel: "Deliverables",
    items: [
      { icon: "users", name: "Stakeholder interviews", desc: "..." },
      { icon: "sitemap", name: "Workflow maps", desc: "..." },
      { icon: "activity", name: "Systems inventory", desc: "..." },
      { icon: "alert-triangle", name: "Bottleneck analysis", desc: "..." },
      { icon: "repeat", name: "Redundancy report", desc: "..." },
    ],
  },
  {
    index: "02",
    navLabel: "Blueprint",
    tag: "Blueprint & Solution Design",
    title: "Blueprint & Solution Design",
    description: "...",
    outcomeLabel: "What you receive",
    outcome: "...",
    listLabel: "Deliverables",
    items: [
      { icon: "sparkles", name: "Automation opportunities", desc: "..." },
      { icon: "cpu", name: "Architecture design", desc: "..." },
      { icon: "plug-connected", name: "Integration strategy", desc: "..." },
      { icon: "trending-up", name: "ROI projections", desc: "..." },
      { icon: "route", name: "Implementation roadmap", desc: "..." },
    ],
  },
  {
    index: "03",
    navLabel: "Prototype",
    tag: "Prototype Development",
    title: "Prototype Development",
    description: "...",
    outcomeLabel: "Timeline",
    outcome: "...",
    listLabel: "What we build",
    items: [
      { icon: "robot", name: "AI agents", desc: "..." },
      { icon: "arrows-transfer-down", name: "Workflow automation", desc: "..." },
      { icon: "git-branch", name: "Multi-agent systems", desc: "..." },
      { icon: "database", name: "Data pipelines", desc: "..." },
      { icon: "plug-connected", name: "CRM & ERP integrations", desc: "..." },
      { icon: "layout-dashboard", name: "Internal tooling", desc: "..." },
    ],
  },
  {
    index: "04",
    navLabel: "Deploy",
    tag: "Deploy & Continuously Optimize",
    title: "Deploy & Continuously Optimize",
    description: "...",
    outcomeLabel: "First gains",
    outcome: "...",
    listLabel: "How we operate",
    items: [
      { icon: "message-circle", name: "Client feedback loops", desc: "..." },
      { icon: "bolt", name: "Rapid iteration cycles", desc: "..." },
      { icon: "activity", name: "Performance monitoring", desc: "..." },
      { icon: "test-pipe", name: "Automated testing", desc: "..." },
      { icon: "shield-check", name: "Reliability engineering", desc: "..." },
    ],
  },
  {
    index: "05",
    navLabel: "Support",
    tag: "Ongoing Support & Optimization",
    title: "Ongoing Support & Optimization",
    description: "...",
    outcomeLabel: "Long-term value",
    outcome: "...",
    listLabel: "What we handle",
    items: [
      { icon: "shield-check", name: "System monitoring", desc: "..." },
      { icon: "wrench", name: "Maintenance & updates", desc: "..." },
      { icon: "sliders", name: "Workflow refinements", desc: "..." },
      { icon: "bell", name: "Incident response", desc: "..." },
      { icon: "file-analytics", name: "Performance reporting", desc: "..." },
    ],
  },
  {
    index: "06",
    navLabel: "Scale",
    tag: "Scale & Expand Operations",
    title: "Scale & Expand Operations",
    description: "...",
    outcomeLabel: "Strategic outcome",
    outcome: "...",
    listLabel: "What we expand",
    items: [
      { icon: "building", name: "Department expansion", desc: "..." },
      { icon: "copy", name: "Workflow replication", desc: "..." },
      { icon: "users-plus", name: "Headcount-free growth", desc: "..." },
      { icon: "sparkles", name: "New AI opportunities", desc: "..." },
      { icon: "layers", name: "Automation as infrastructure", desc: "..." },
    ],
  },
];

const ROI_STATS = [
  { value: "5", suffix: "d", label: "Audit to roadmap" },
  { value: "30", suffix: "d", label: "First operational gains" },
  { value: "60", suffix: "d", label: "Measurable ROI" },
  { value: "0", suffix: "", label: "Downtime deployments" },
];

// ── Design Tokens ──────────────────────────────────────────────────────────
const GOLD = "#8F7860";
const GOLD_DIM = "rgba(143,120,96,0.14)";
const GOLD_MID = "rgba(143,120,96,0.55)";
const INK_DIM = "rgba(18,20,22,0.36)";
const INK_FAINT = "rgba(18,20,22,0.12)";
const OFFWHITE = "#FAFAF8";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// ── Helpers ────────────────────────────────────────────────────────────────
function useScrollInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: threshold });
  const [playKey, setPlayKey] = useState(0);
  const prevInView = useRef(false);
  useEffect(() => {
    if (inView && !prevInView.current) setPlayKey((k) => k + 1);
    prevInView.current = inView;
  }, [inView]);
  return { ref, inView, playKey };
}

function useCountUp(target: number, inView: boolean, duration = 1.2) {
  const [display, setDisplay] = useState(0);
  const prevInView = useRef(false);
  useEffect(() => {
    if (inView && !prevInView.current) {
      let start: number | null = null;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
        else setDisplay(target);
      };
      requestAnimationFrame(step);
    }
    prevInView.current = inView;
  }, [inView, target, duration]);
  return display;
}

// ── Phase Visuals (unchanged) ──────────────────────────────────────────────
function AuditVisual({ inView }: { inView: boolean }) {
  const rows = [
    { name: "Payables workflow", score: 0.92 },
    { name: "Approval routing", score: 0.78 },
    { name: "Report generation", score: 0.65 },
    { name: "Data entry tasks", score: 0.41 },
    { name: "Invoice matching", score: 0.88 },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-3">
      <p className="font-mono text-[9px] tracking-[.14em] uppercase mb-1" style={{ color: GOLD_MID }}>Automation Potential Score</p>
      {rows.map((r, i) => (
        <motion.div key={r.name} className="flex items-center gap-3"
          initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: EASE_OUT }}>
          <span className="font-mono text-[9px] text-stone-500 w-4 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
          <div className="flex-1 h-[2px] rounded-full bg-ink/[.08] overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${GOLD}, rgba(143,120,96,0.5))`, transformOrigin: "left" }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: r.score } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.09, ease: EASE_OUT }} />
          </div>
          <span className="font-mono text-[9px] text-stone-400 whitespace-nowrap w-28 text-right truncate">{r.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

function BlueprintVisual({ inView }: { inView: boolean }) {
  const items = [
    { label: "Invoice matching", hours: 14, priority: "HIGH" },
    { label: "Approval routing", hours: 8, priority: "HIGH" },
    { label: "Report generation", hours: 6, priority: "MED" },
    { label: "Architecture", hours: null, priority: "DESIGN" },
  ];
  const maxHours = 14;
  return (
    <div className="p-5 h-full flex flex-col justify-center gap-2.5">
      <p className="font-mono text-[9px] tracking-[.14em] uppercase mb-1" style={{ color: GOLD_MID }}>Impact Ranking</p>
      {items.map((item, i) => (
        <motion.div key={item.label} initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease: EASE_OUT }}>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-[9px] text-stone-400 flex-1">{item.label}</span>
            <span className="font-mono text-[8px] px-1.5 py-px rounded-sm"
              style={{ color: item.priority === "HIGH" ? GOLD : item.priority === "DESIGN" ? "rgba(143,120,96,0.7)" : INK_DIM, backgroundColor: item.priority === "HIGH" ? GOLD_DIM : "rgba(18,20,22,0.04)" }}>
              {item.hours ? `${item.hours}h/wk` : item.priority}
            </span>
          </div>
          {item.hours && (
            <div className="h-[2px] bg-ink/[.08] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ background: item.priority === "HIGH" ? GOLD : "rgba(143,120,96,0.45)", transformOrigin: "left" }}
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: item.hours / maxHours } : {}}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: EASE_OUT }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function BuildVisual({ inView }: { inView: boolean }) {
  const layers = [
    { label: "AI Agents", sub: "Autonomous execution", opacity: 1.0 },
    { label: "Orchestration", sub: "Routing & coordination", opacity: 0.72 },
    { label: "Integrations", sub: "External system bridges", opacity: 0.48 },
    { label: "Data Layer", sub: "Storage & pipelines", opacity: 0.28 },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-2">
      <p className="font-mono text-[9px] tracking-[.14em] uppercase mb-1" style={{ color: GOLD_MID }}>Architecture Stack</p>
      {layers.map(({ label, sub, opacity }, i) => (
        <motion.div key={label} className="relative flex items-center gap-3 px-3 py-2.5 rounded-sm overflow-hidden"
          style={{ background: `rgba(143,120,96,${opacity * 0.055})` }}
          initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.12 + i * 0.1, ease: EASE_OUT }}>
          <div className="w-[2px] h-7 rounded-full flex-shrink-0" style={{ backgroundColor: `rgba(143,120,96,${opacity})` }} />
          <div>
            <div className="font-mono text-[10px] tracking-[.06em] uppercase" style={{ color: `rgba(143,120,96,${opacity})` }}>{label}</div>
            <div className="font-mono text-[8px] text-stone-500 mt-0.5">{sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DeployVisual({ inView }: { inView: boolean }) {
  const events = [
    { time: "09:14", event: "Deployment triggered", ok: true },
    { time: "09:15", event: "Tests passed (47/47)", ok: true },
    { time: "09:16", event: "Canary release 10%", ok: true },
    { time: "09:18", event: "Full rollout complete", ok: true },
    { time: "09:18", event: "Zero downtime confirmed", pulse: true },
  ];
  return (
    <div className="p-5 h-full flex flex-col justify-center gap-1.5 font-mono">
      <p className="text-[9px] tracking-[.14em] uppercase mb-2" style={{ color: GOLD_MID }}>Deployment Log</p>
      {events.map((e, i) => (
        <motion.div key={e.event} className="flex items-center gap-2.5 text-[10px]"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.2 + i * 0.13 }}>
          <span className="text-stone-500 w-9 flex-shrink-0 tabular-nums">{e.time}</span>
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0")}
            style={{ backgroundColor: e.ok || e.pulse ? GOLD : INK_FAINT, opacity: e.pulse ? 1 : 0.55 }} />
          <span className="text-stone-400">{e.event}</span>
        </motion.div>
      ))}
    </div>
  );
}

function SupportVisual({ inView }: { inView: boolean }) {
  const metrics = [
    { label: "Uptime", value: "99.97%", bar: 0.9997 },
    { label: "Avg. response", value: "1.2s", bar: 0.88 },
    { label: "Tasks / day", value: "3,840", bar: 0.76 },
    { label: "Error rate", value: "0.03%", bar: 0.03 },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-3.5">
      <p className="font-mono text-[9px] tracking-[.14em] uppercase mb-0.5" style={{ color: GOLD_MID }}>Live System Health</p>
      {metrics.map(({ label, value, bar }, i) => (
        <motion.div key={label} initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.12 + i * 0.1, ease: EASE_OUT }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] text-stone-400">{label}</span>
            <span className="font-mono text-[10px]" style={{ color: GOLD }}>{value}</span>
          </div>
          <div className="h-[2px] rounded-full bg-ink/[.08] overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: label === "Error rate" ? "rgba(143,120,96,0.35)" : `linear-gradient(90deg, ${GOLD}, rgba(143,120,96,0.5))`, transformOrigin: "left" }}
              initial={{ scaleX: 0 }} animate={inView ? { scaleX: bar } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.09, ease: EASE_OUT }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ScaleVisual({ inView }: { inView: boolean }) {
  const weeks = [
    { label: "Wk 1", v: 0.12 },
    { label: "Wk 4", v: 0.28 },
    { label: "Wk 8", v: 0.48 },
    { label: "Wk 12", v: 0.72 },
    { label: "Wk 16", v: 0.88 },
    { label: "Wk 20", v: 0.97 },
  ];
  return (
    <div className="p-6 h-full flex flex-col">
      <p className="font-mono text-[9px] tracking-[.14em] uppercase mb-3" style={{ color: GOLD_MID }}>Automation Coverage</p>
      <div className="flex items-end gap-2 flex-1 pb-1">
        {weeks.map(({ label, v }, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5 justify-end h-full">
            <motion.div className="w-full rounded-t-[2px]"
              style={{ height: `${v * 120}px`, background: `linear-gradient(to top, rgba(143,120,96,0.65), rgba(143,120,96,0.18))` }}
              initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: EASE_OUT, transformOrigin: "bottom" }} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {weeks.map(({ label }) => (
          <div key={label} className="flex-1 text-center font-mono text-[7.5px] text-stone-500">{label}</div>
        ))}
      </div>
    </div>
  );
}

function PhaseVisual({ index, inView }: { index: number; inView: boolean }) {
  const visuals = [AuditVisual, BlueprintVisual, BuildVisual, DeployVisual, SupportVisual, ScaleVisual];
  const V = visuals[index];
  return <V inView={inView} />;
}

// ── Phase Block (original, no pull props) ──────────────────────────────────
const PHASE_HOOKS: string[] = [
  "Map every workflow, bottleneck, and manual dependency before writing a single line of automation.",
  "Turn audit findings into a prioritized build plan tied to real business outcomes.",
  "Ship working AI agents into your existing tools — no rip-and-replace.",
  "Go live, then stay close. The first 30 days are the highest-leverage period.",
  "We monitor, maintain, and adapt your systems as your business evolves.",
  "Proven automations expand across departments. Capacity scales without headcount.",
];

function PhaseBlock({ phase, phaseIndex, onVisible }: { phase: Phase; phaseIndex: number; onVisible: (i: number) => void }) {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(phaseIndex); },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phaseIndex, onVisible]);

  const { ref: contentRef, inView: contentInView } = useScrollInView(0.15);
  const { ref: visualRef, inView: visualInView } = useScrollInView(0.25);
  const isEven = phaseIndex % 2 === 0;

  return (
    <div ref={blockRef} id={`phase-${phaseIndex}`} className="mb-24">
      <div className="mb-10 h-px w-full" style={{ background: INK_FAINT }} />

      <div className={cn("flex flex-col lg:flex-row gap-10 xl:gap-20 items-start", !isEven && "lg:flex-row-reverse")}>
        <div ref={contentRef} className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE_OUT }}>
            <p className="font-mono text-[8px] tracking-[.22em] uppercase mb-4" style={{ color: "rgba(143,120,96,0.75)" }}>
              Phase {phase.index}
            </p>
            <h3 className="text-[clamp(1.8rem,3.4vw,2.75rem)] font-bold tracking-[-0.03em] text-stone-100 leading-[1.07] mb-5">
              {phase.title}
            </h3>
            <p className="text-[14px] font-light leading-[1.75] max-w-[420px]" style={{ color: INK_DIM }}>
              {PHASE_HOOKS[phaseIndex]}
            </p>
            <div className="flex flex-wrap gap-2 mt-8">
              {phase.items.map((item) => (
                <span key={item.name}
                  className="font-mono text-[9.5px] tracking-[.06em] px-3 py-1.5 rounded-sm transition-colors duration-200"
                  style={{
                    border: "1px solid rgba(18,20,22,0.10)",
                    color: INK_DIM,
                    background: "rgba(250,250,248,0.55)",
                  }}>
                  {item.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div ref={visualRef} className="flex-shrink-0 w-full lg:w-[320px] xl:w-[360px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={contentInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE_OUT }}
            className="relative h-[230px] overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(250,250,248,0.86) 0%, rgba(239,230,216,0.62) 100%)",
              border: "1px solid rgba(18,20,22,0.10)",
            }}>
            <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-10"
              style={{ background: "linear-gradient(to top, rgba(239,230,216,0.85), transparent)" }} />
            <PhaseVisual index={phaseIndex} inView={visualInView} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Sticky Timeline Nav (unchanged) ────────────────────────────────────────
function TimelineNav({ activeIndex }: { activeIndex: number }) {
  const [progress, setProgress] = useState<number[]>(Array(PHASES.length - 1).fill(0));

  useEffect(() => {
    const handleScroll = () => {
      const newProgress = [...progress];
      for (let i = 0; i < PHASES.length - 1; i++) {
        const thisPhase = document.getElementById(`phase-${i}`);
        const nextPhase = document.getElementById(`phase-${i + 1}`);
        if (!thisPhase || !nextPhase) continue;
        const thisRect = thisPhase.getBoundingClientRect();
        const nextRect = nextPhase.getBoundingClientRect();
        const start = thisRect.bottom;
        const end = nextRect.top;
        const range = end - start;
        if (range <= 0) { newProgress[i] = 1; continue; }
        const triggerPoint = window.innerHeight * 0.6;
        const raw = (triggerPoint - nextRect.top) / range;
        newProgress[i] = Math.min(1, Math.max(0, raw));
      }
      setProgress(newProgress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {PHASES.map((phase, i) => {
        const isPast = i < activeIndex;
        const isActive = i === activeIndex;
        const connectorFill = i < activeIndex ? 1 : i === activeIndex ? (progress[i] ?? 0) : 0;

        return (
          <div key={phase.index} className="flex flex-col items-center">
            <a
              href={`#phase-${i}`}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
              onClick={(e) => { e.preventDefault(); document.getElementById(`phase-${i}`)?.scrollIntoView({ behavior: "smooth" }); }}
              aria-label={`Jump to Phase ${phase.index}: ${phase.navLabel}`}>
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500",
                  isPast ? "border-accent" : isActive ? "border-accent/60" : "border-ink/[.14] group-hover:border-ink/25"
                )}
                style={{ background: isPast ? GOLD_DIM : isActive ? "rgba(143,120,96,0.08)" : "transparent" }}>
                {isPast ? (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className={cn("font-mono text-[8px] transition-colors duration-300", isActive ? "text-accent" : "text-stone-500 group-hover:text-stone-400")}>
                    {phase.index}
                  </span>
                )}
              </div>
              <span className={cn(
                "font-mono text-[7px] tracking-[.1em] uppercase mt-1.5 transition-colors duration-300",
                isActive || isPast ? "text-accent" : "text-stone-500 group-hover:text-stone-400"
              )}>
                {phase.navLabel}
              </span>
            </a>

            {i < PHASES.length - 1 && (
              <div className="w-px h-16 my-1 relative overflow-hidden" style={{ background: INK_FAINT }}>
                <div className="absolute inset-x-0 bottom-0 transition-all duration-300" style={{ background: GOLD, height: `${connectorFill * 100}%` }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── ROI Section (unchanged) ────────────────────────────────────────────────
function AnimatedStat({ value, suffix, inView }: { value: string; suffix: string; inView: boolean }) {
  const num = parseInt(value, 10);
  const counted = useCountUp(num, inView, 1.4);
  const isZero = num === 0;
  return <span>{isZero ? "0" : counted}{suffix}</span>;
}

function ROISection() {
  const { ref, playKey, inView } = useScrollInView(0.2);
  return (
    <div ref={ref} className="mt-28 pt-14 pb-24" style={{ borderTop: "1px solid rgba(18,20,22,0.10)" }}>
      <motion.div key={playKey} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}>
        <div className="mb-10">
          <span className="font-mono text-[8.5px] tracking-[.2em] uppercase" style={{ color: "rgba(143,120,96,0.75)" }}>Outcomes</span>
          <h3 className="text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold tracking-[-0.025em] text-stone-100 leading-[1.08] mt-3">Results compound over time.</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(18,20,22,0.10)" }}>
          {ROI_STATS.map(({ value, suffix, label }, i) => (
            <motion.div key={label}
              className="flex flex-col gap-2.5 py-9 px-6"
              style={{ background: OFFWHITE }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.08, ease: EASE_OUT }}>
              <div className="text-[clamp(1.8rem,3.8vw,2.5rem)] font-bold tracking-[-0.04em] leading-none tabular-nums" style={{ color: GOLD }}>
                <AnimatedStat value={value} suffix={suffix} inView={inView} />
              </div>
              <div className="font-mono text-[8px] tracking-[.14em] uppercase text-stone-500 leading-[1.5]">{label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Scroll-lock hook ───────────────────────────────────────────────────────
function useScrollLockSection(
  containerRef: React.RefObject<HTMLDivElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.style.overflow = "hidden";
          container.style.overflowY = "auto";
          container.style.height = "100vh";
          container.style.position = "relative";
        } else {
          document.body.style.overflow = "";
          container.style.overflowY = "";
          container.style.height = "";
          container.style.position = "";
        }
      },
      { threshold: 0.9 }
    );

    observer.observe(container);

    let wheelDelta = 0;
    const wheelHandler = (e: WheelEvent) => { wheelDelta = e.deltaY; };
    const scrollHandler = () => {
      const scrolledToBottom = content.scrollHeight - content.scrollTop - content.clientHeight < 2;
      const scrolledToTop = content.scrollTop <= 0;
      if (scrolledToBottom && wheelDelta > 0) {
        document.body.style.overflow = "";
        container.style.overflowY = "";
      }
      if (scrolledToTop && wheelDelta < 0) {
        document.body.style.overflow = "";
        container.style.overflowY = "";
      }
    };

    window.addEventListener("wheel", wheelHandler, { passive: true });
    content.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      observer.disconnect();
      document.body.style.overflow = "";
      container.style.overflowY = "";
      container.style.height = "";
      container.style.position = "";
      window.removeEventListener("wheel", wheelHandler);
      content.removeEventListener("scroll", scrollHandler);
    };
  }, [containerRef, contentRef]);
}

// ── Main Component (with scroll snapping) ──────────────────────────────────
export function CapabilitiesSection() {
  const [activePhase, setActivePhase] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.2 });

  const handleVisible = useCallback((i: number) => setActivePhase(i), []);

  useScrollLockSection(sectionRef, contentRef);

  // Group phases into pairs
  const phasePairs = [];
  for (let i = 0; i < PHASES.length; i += 2) {
    phasePairs.push(PHASES.slice(i, i + 2));
  }

  return (
    <section ref={sectionRef} id="capabilities" className="relative bg-bg-primary border-t border-border">
      <style>{`#capabilities-scroll::-webkit-scrollbar { display: none; }`}</style>
      {/* Subtle background grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.012]"
        style={{
          backgroundImage: "linear-gradient(rgba(18,20,22,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(18,20,22,.5) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }} />

      {/* Ambient gold glow */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-[15%] w-[500px] h-[300px] opacity-[.025]"
        style={{ background: "radial-gradient(ellipse at center, rgba(143,120,96,1) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="flex h-full">
        {/* Static side nav */}
        <div className="hidden xl:flex flex-shrink-0 w-[100px] h-screen sticky top-0 items-start pt-24 px-2">
          <TimelineNav activeIndex={activePhase} />
        </div>

        {/* Scrollable content area with snap */}
        <div
          id="capabilities-scroll"
          ref={contentRef}
          className="flex-1 min-w-0 px-6 md:px-12 pt-28"
          style={{
            scrollSnapType: "y proximity",
            scrollBehavior: "smooth",
            overflowY: "auto",
            height: "100vh",
            scrollbarWidth: "none",          /* Firefox */
            msOverflowStyle: "none",         /* IE/Edge */
          }}
        >
          <div className="max-w-[1200px] mx-auto">
            {/* Section header – no snap */}
            <motion.div ref={headerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="mb-24 max-w-[520px]">
              <p className="font-mono text-[9px] tracking-[.2em] uppercase mb-5" style={{ color: GOLD }}>How We Work</p>
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.035em] text-stone-100 leading-[1.06] mb-5">
                From operational chaos<br />to automated clarity.
              </h2>
              <p className="text-[14px] font-light text-stone-400 leading-[1.85]">
                Six phases. Measurable ROI within 30–60 days.
              </p>
            </motion.div>

            {/* Phase pairs – each pair is a snap target */}
            {phasePairs.map((pair, pairIndex) => (
              <div
                key={pairIndex}
                style={{
                  scrollSnapAlign: "start",
                  scrollSnapStop: "always",
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingTop: "2rem",
                  paddingBottom: "2rem",
                }}
              >
                {pair.map((phase, idx) => (
                  <PhaseBlock
                    key={phase.index}
                    phase={phase}
                    phaseIndex={pairIndex * 2 + idx}
                    onVisible={handleVisible}
                  />
                ))}
              </div>
            ))}

            {/* ROI section – no snap */}
            <ROISection />
          </div>
        </div>
      </div>
    </section>
  );
}