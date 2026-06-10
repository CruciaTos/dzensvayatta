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
      { icon: "users", name: "Stakeholder interviews", desc: "Structured sessions with the people doing the actual work, not just leadership" },
      { icon: "sitemap", name: "Workflow maps", desc: "Visual documentation of every process, system, and cross-team handoff" },
      { icon: "activity", name: "Systems inventory", desc: "Full audit of tools, integrations, and data flows currently in use" },
      { icon: "alert-triangle", name: "Bottleneck analysis", desc: "Ranked list of friction points, manual dependencies, and process failures" },
      { icon: "repeat", name: "Redundancy report", desc: "Duplicate work, re-entry tasks, and unnecessary manual steps identified" },
    ],
  },
  {
    index: "02",
    navLabel: "Blueprint",
    tag: "Blueprint & Solution Design",
    title: "Blueprint & Solution Design",
    description:
      "Audit findings become a precise implementation plan. We prioritize automation opportunities by impact and complexity, design the agent workflows and system architecture, and select the integrations that fit your existing stack. Every decision is tied back to a measurable business outcome — hours saved, error rates reduced, throughput increased.",
    outcomeLabel: "What you receive",
    outcome:
      "A detailed implementation blueprint with prioritized opportunities, architecture decisions, integration strategy, ROI projections, and a phased roadmap — everything needed to move into development with complete clarity.",
    listLabel: "Deliverables",
    items: [
      { icon: "sparkles", name: "Automation opportunities", desc: "Ranked by ROI potential and implementation complexity" },
      { icon: "cpu", name: "Architecture design", desc: "Agent topology, orchestration layers, and data flow specifications" },
      { icon: "plug-connected", name: "Integration strategy", desc: "Tool selection and connection plan mapped to your existing stack" },
      { icon: "trending-up", name: "ROI projections", desc: "Hours saved, cost reduction, and capacity unlocked per initiative" },
      { icon: "route", name: "Implementation roadmap", desc: "Phased delivery plan with milestones, priorities, and timelines" },
    ],
  },
  {
    index: "03",
    navLabel: "Prototype",
    tag: "Prototype Development",
    title: "Prototype Development",
    description:
      "We build. Starting from the highest-priority workflows in your blueprint, we develop AI agents, automation pipelines, and the integrations that connect them — all designed to slot into your existing tools, not replace them. Each prototype is scoped for rapid delivery so you can see real system behavior and give meaningful feedback before we move to full production.",
    outcomeLabel: "Timeline",
    outcome:
      "A working prototype of your highest-priority automations in 3–4 weeks, followed by structured feedback cycles and refinement before production deployment.",
    listLabel: "What we build",
    items: [
      { icon: "robot", name: "AI agents", desc: "Autonomous systems that execute operational tasks end-to-end without manual intervention" },
      { icon: "arrows-transfer-down", name: "Workflow automation", desc: "Multi-step business process orchestration across teams and systems" },
      { icon: "git-branch", name: "Multi-agent systems", desc: "Coordinated agents handling complex, branching, and conditional operations" },
      { icon: "database", name: "Data pipelines", desc: "Reliable movement, transformation, and routing of business-critical data" },
      { icon: "plug-connected", name: "CRM & ERP integrations", desc: "Native connections to your existing stack — no rip-and-replace required" },
      { icon: "layout-dashboard", name: "Internal tooling", desc: "Custom interfaces built precisely for how your team actually works" },
    ],
  },
  {
    index: "04",
    navLabel: "Deploy",
    tag: "Deploy & Continuously Optimize",
    title: "Deploy & Continuously Optimize",
    description:
      "We ship to production, then stay close. The first 30 days after deployment are where most automation projects fail — we treat them as the highest-leverage period of the engagement. Weekly feedback sessions, rapid iteration cycles, and real-time performance monitoring ensure every system improves on actual usage, not theoretical design.",
    outcomeLabel: "First gains",
    outcome:
      "Most clients see measurable operational improvements within the first few weeks of deployment. The system gets sharper every week.",
    listLabel: "How we operate",
    items: [
      { icon: "message-circle", name: "Client feedback loops", desc: "Structured weekly sessions to capture what's working, what's breaking, and what to improve" },
      { icon: "bolt", name: "Rapid iteration cycles", desc: "Changes scoped, built, and deployed in days — not multi-week sprints" },
      { icon: "activity", name: "Performance monitoring", desc: "Real-time observability across every running automation and agent workflow" },
      { icon: "test-pipe", name: "Automated testing", desc: "Every change validated in staging before it touches your production environment" },
      { icon: "shield-check", name: "Reliability engineering", desc: "Rollback protocols, failover logic, and zero-downtime deployment standards" },
    ],
  },
  {
    index: "05",
    navLabel: "Support",
    tag: "Ongoing Support & Optimization",
    title: "Ongoing Support & Optimization",
    description:
      "Once your automations are live and stable, we shift into a continuous support model. Through our ongoing plans, we handle monitoring, maintenance, and incremental workflow adjustments — keeping your systems reliable, current, and aligned with how your business actually evolves. You shouldn't need an internal AI team to keep the lights on.",
    outcomeLabel: "Long-term value",
    outcome:
      "A continuously maintained automation system backed by dedicated support — reliable, monitored, and adapted as your processes and tools change over time.",
    listLabel: "What we handle",
    items: [
      { icon: "shield-check", name: "System monitoring", desc: "24/7 observability across all live automations with proactive issue detection" },
      { icon: "wrench", name: "Maintenance & updates", desc: "Dependency updates, API changes, and workflow adjustments as platforms evolve" },
      { icon: "sliders", name: "Workflow refinements", desc: "Small process changes and logic updates without full rebuild cycles" },
      { icon: "bell", name: "Incident response", desc: "Fast triage and resolution when something breaks or behaves unexpectedly" },
      { icon: "file-analytics", name: "Performance reporting", desc: "Regular summaries of system health, efficiency gains, and optimization opportunities" },
    ],
  },
  {
    index: "06",
    navLabel: "Scale",
    tag: "Scale & Expand Operations",
    title: "Scale & Expand Operations",
    description:
      "Proven automations become the foundation for operational expansion. As your business grows, we extend coverage into new departments, replicate successful workflows across teams, and identify the next tier of AI opportunities — so your capacity scales without a proportional increase in headcount or overhead. Automation stops being a project and becomes infrastructure.",
    outcomeLabel: "Strategic outcome",
    outcome:
      "A scalable operational foundation where automation absorbs growth — new departments covered, more workflows running, and a compounding advantage over businesses still doing this manually.",
    listLabel: "What we expand",
    items: [
      { icon: "building", name: "Department expansion", desc: "Proven workflows replicated and adapted across finance, ops, HR, and sales" },
      { icon: "copy", name: "Workflow replication", desc: "High-performing automations extended to new teams without building from scratch" },
      { icon: "users-plus", name: "Headcount-free growth", desc: "Operational capacity scales with the business — not the org chart" },
      { icon: "sparkles", name: "New AI opportunities", desc: "Continuous identification of the next highest-leverage automation targets" },
      { icon: "layers", name: "Automation as infrastructure", desc: "Interconnected systems that compound in value as coverage expands" },
    ],
  },
];

const ROI_STATS = [
  { value: "5d", label: "Audit to roadmap" },
  { value: "30d", label: "First operational gains" },
  { value: "60d", label: "Measurable ROI" },
  { value: "0", label: "Downtime deployments" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function useScrollInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: threshold });
  const [playKey, setPlayKey] = useState(0);
  const prevInView = useRef(false);

  useEffect(() => {
    if (inView && !prevInView.current) {
      setPlayKey((k) => k + 1);
    }
    prevInView.current = inView;
  }, [inView]);

  return { ref, inView, playKey };
}

// ── Transition Graphics ────────────────────────────────────────────────────

function AuditToBlueprintGraphic() {
  const { ref, playKey } = useScrollInView(0.3);
  return (
    <div ref={ref} className="flex items-center justify-center py-2">
      <motion.div key={playKey} className="w-full flex justify-center">
        <svg width="520" height="72" viewBox="0 0 520 72" fill="none" className="max-w-full">
          {[
            { x: 60, label: "People", sub: "interviewed" },
            { x: 200, label: "Processes", sub: "mapped" },
            { x: 340, label: "Systems", sub: "inventoried" },
            { x: 460, label: "Blueprint", sub: "designed" },
          ].map(({ x, label, sub }, i) => (
            <g key={label}>
              <motion.circle cx={x} cy={36} r={20} fill="rgba(201,169,110,0.08)" stroke="rgba(201,169,110,0.35)" strokeWidth={1}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }} />
              <motion.text x={x} y={39} textAnchor="middle" fill="#c9a96e" fontSize={8} fontFamily="monospace" letterSpacing="0.07em"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.18 + 0.25 }}>{label.toUpperCase()}</motion.text>
              <motion.text x={x} y={62} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={7.5} fontFamily="monospace"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.18 + 0.35 }}>{sub}</motion.text>
              {i < 3 && (
                <motion.line x1={x + 21} y1={36} x2={x + 119} y2={36} stroke="rgba(201,169,110,0.25)" strokeWidth={1} strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.18 + 0.4 }} />
              )}
              {i < 3 && (
                <motion.polygon points={`${x + 118},31 ${x + 126},36 ${x + 118},41`} fill="rgba(201,169,110,0.4)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.18 + 0.7 }} />
              )}
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

function BlueprintToPrototypeGraphic() {
  const { ref, playKey } = useScrollInView(0.3);
  const nodes = [
    { x: 80, y: 20, label: "ROI MAP" },
    { x: 200, y: 48, label: "ARCH" },
    { x: 320, y: 20, label: "INTEGR." },
    { x: 440, y: 48, label: "ROADMAP" },
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [0, 2]];
  return (
    <div ref={ref} className="flex items-center justify-center py-2">
      <motion.div key={playKey} className="w-full flex justify-center">
        <svg width="520" height="88" viewBox="0 0 520 88" fill="none" className="max-w-full">
          {edges.map(([a, b], i) => {
            const na = nodes[a], nb = nodes[b];
            return (
              <motion.line key={i} x1={na.x} y1={na.y + 14} x2={nb.x} y2={nb.y + 14} stroke="rgba(201,169,110,0.2)" strokeWidth={1} strokeDasharray="3 5"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }} />
            );
          })}
          {nodes.map(({ x, y, label }, i) => (
            <g key={label}>
              <motion.rect x={x - 30} y={y} width={60} height={28} rx={3} fill="rgba(201,169,110,0.07)" stroke="rgba(201,169,110,0.3)" strokeWidth={1}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${x}px ${y + 14}px` }} />
              <motion.text x={x} y={y + 18} textAnchor="middle" fill="#c9a96e" fontSize={8} fontFamily="monospace" letterSpacing="0.08em"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.12 + 0.25 }}>{label}</motion.text>
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

function PrototypeToDeployGraphic() {
  const { ref, playKey } = useScrollInView(0.3);
  const layers = [
    { label: "AI Agents", color: "rgba(201,169,110,0.9)" },
    { label: "Orchestration", color: "rgba(201,169,110,0.65)" },
    { label: "Integrations", color: "rgba(201,169,110,0.4)" },
    { label: "Data Layer", color: "rgba(201,169,110,0.2)" },
  ];
  return (
    <div ref={ref} className="flex items-center justify-center py-2">
      <motion.div key={playKey} className="w-full flex justify-center">
        <svg width="520" height="88" viewBox="0 0 520 88" fill="none" className="max-w-full">
          {layers.map(({ label, color }, i) => (
            <g key={label}>
              <motion.rect x={80} y={8 + i * 18} width={360} height={14} rx={2} fill="rgba(201,169,110,0.05)" stroke="rgba(201,169,110,0.15)" strokeWidth={1}
                initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "80px center" }} />
              <motion.rect x={80} y={8 + i * 18} width={4} height={14} rx={1} fill={color}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.1 }} />
              <motion.text x={94} y={19 + i * 18} textAnchor="start" fill={color} fontSize={8} fontFamily="monospace" letterSpacing="0.09em"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}>{label.toUpperCase()}</motion.text>
              <motion.text x={430} y={19 + i * 18} textAnchor="end" fill="rgba(201,169,110,0.35)" fontSize={7.5} fontFamily="monospace"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.55 + i * 0.1 }}>LIVE</motion.text>
            </g>
          ))}
          <motion.text x={260} y={82} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={8} fontFamily="monospace" letterSpacing="0.1em"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}>PRODUCTION STACK — ALL LAYERS DEPLOYED</motion.text>
        </svg>
      </motion.div>
    </div>
  );
}

function DeployToSupportGraphic() {
  const { ref, playKey } = useScrollInView(0.3);
  const events = [
    { time: "09:14", label: "Deployment complete" },
    { time: "09:18", label: "Monitoring active" },
    { time: "09:45", label: "First task processed" },
    { time: "10:02", label: "Performance nominal" },
  ];
  return (
    <div ref={ref} className="flex items-center justify-center py-2">
      <motion.div key={playKey} className="w-full flex justify-center">
        <svg width="520" height="72" viewBox="0 0 520 72" fill="none" className="max-w-full">
          <motion.line x1={60} y1={36} x2={460} y2={36} stroke="rgba(201,169,110,0.1)" strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.1 }} />
          {events.map(({ time, label }, i) => {
            const x = 60 + i * (400 / 3);
            return (
              <g key={time}>
                <motion.circle cx={x} cy={36} r={4} fill="rgba(201,169,110,0.15)" stroke="rgba(201,169,110,0.5)" strokeWidth={1}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }} />
                <motion.text x={x} y={22} textAnchor="middle" fill="rgba(201,169,110,0.5)" fontSize={7.5} fontFamily="monospace"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.35 + i * 0.15 }}>{time}</motion.text>
                <motion.text x={x} y={56} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={7.5} fontFamily="monospace"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}>{label}</motion.text>
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}

function SupportToScaleGraphic() {
  const { ref, playKey } = useScrollInView(0.3);
  const branches = [
    { x: 360, y: 6, label: "Finance" },
    { x: 360, y: 30, label: "Sales" },
    { x: 360, y: 54, label: "HR" },
    { x: 360, y: 78, label: "Ops" },
  ];
  return (
    <div ref={ref} className="flex items-center justify-center py-2">
      <motion.div key={playKey} className="w-full flex justify-center">
        <svg width="520" height="96" viewBox="0 0 520 96" fill="none" className="max-w-full">
          <motion.rect x={100} y={34} width={80} height={28} rx={3} fill="rgba(201,169,110,0.1)" stroke="rgba(201,169,110,0.4)" strokeWidth={1}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: "140px 48px" }} />
          <motion.text x={140} y={51} textAnchor="middle" fill="#c9a96e" fontSize={8} fontFamily="monospace" letterSpacing="0.1em"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>CORE FLOW</motion.text>
          {branches.map(({ x, y, label }, i) => (
            <g key={label}>
              <motion.path d={`M180,48 C270,48 270,${y + 14} ${x},${y + 14}`} stroke="rgba(201,169,110,0.22)" strokeWidth={1} strokeDasharray="3 4" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.35 + i * 0.1 }} />
              <motion.rect x={x} y={y} width={72} height={28} rx={3} fill="rgba(201,169,110,0.06)" stroke="rgba(201,169,110,0.25)" strokeWidth={1}
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }} />
              <motion.text x={x + 36} y={y + 18} textAnchor="middle" fill="rgba(201,169,110,0.65)" fontSize={8} fontFamily="monospace" letterSpacing="0.08em"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.65 + i * 0.1 }}>{label.toUpperCase()}</motion.text>
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

const TRANSITION_GRAPHICS = [
  { label: "Audit → Blueprint", component: AuditToBlueprintGraphic },
  { label: "Blueprint → Build", component: BlueprintToPrototypeGraphic },
  { label: "Build → Deploy", component: PrototypeToDeployGraphic },
  { label: "Deploy → Support", component: DeployToSupportGraphic },
  { label: "Support → Scale", component: SupportToScaleGraphic },
];

function PhaseDivider({ index }: { index: number }) {
  const { ref, playKey } = useScrollInView(0.3);
  const GraphicComponent = TRANSITION_GRAPHICS[index].component;
  return (
    <div ref={ref} className="my-20 mx-auto max-w-[640px]">
      <motion.div key={playKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/[.05]" />
          <span className="font-mono text-[9px] tracking-[.16em] uppercase text-white/20">{TRANSITION_GRAPHICS[index].label}</span>
          <div className="flex-1 h-px bg-white/[.05]" />
        </div>
        <GraphicComponent />
      </motion.div>
    </div>
  );
}

function DeliverableCard({ item, index }: { item: DeliverableItem; index: number }) {
  const { ref, playKey } = useScrollInView(0.1);
  return (
    <div ref={ref}>
      <motion.div key={playKey} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: index * 0.065, ease: [0.22, 1, 0.36, 1] }}
        className="group flex items-start gap-4 px-5 py-5 border border-white/[.07] bg-white/[.01] hover:border-white/[.13] hover:bg-white/[.025] transition-all duration-300 cursor-default">
        <div>
          <div className="text-[12px] font-medium text-stone-200 mb-1.5">{item.name}</div>
          <div className="text-[11px] font-light text-white/30 leading-[1.65]">{item.desc}</div>
        </div>
      </motion.div>
    </div>
  );
}

function PhaseBlock({ phase, phaseIndex, onVisible }: { phase: Phase; phaseIndex: number; onVisible: (i: number) => void }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const isEven = phaseIndex % 2 === 0;

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

  const { ref: headerRef, playKey: headerKey } = useScrollInView(0.2);
  const { ref: bodyRef, playKey: bodyKey } = useScrollInView(0.15);
  const { ref: gridRef, playKey: gridKey } = useScrollInView(0.1);

  const ContentCol = (
    <div className="flex-1 min-w-0">
      <div ref={headerRef}>
        <motion.div key={headerKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mb-8">
          <span className="font-mono text-[clamp(3.5rem,9vw,6rem)] font-bold text-white/[.04] leading-none select-none block -mb-4 -ml-1">{phase.index}</span>
          <div className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[.16em] uppercase text-[#c9a96e] border border-[rgba(201,169,110,0.25)] px-2.5 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] opacity-70 animate-[pulse-dot_2s_ease-in-out_infinite]" /> Phase {phase.index}
          </div>
          <h3 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.025em] text-stone-100 leading-[1.08]">{phase.title}</h3>
        </motion.div>
      </div>
      <div ref={bodyRef}>
        <motion.div key={bodyKey} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">
          <p className="text-[15px] font-light text-stone-400 leading-[1.85] max-w-[520px]">{phase.description}</p>
          <div className="border border-[rgba(201,169,110,0.18)] bg-[rgba(201,169,110,0.04)] px-5 py-5 max-w-[420px]">
            <div className="font-mono text-[9px] tracking-[.14em] uppercase text-[#c9a96e] mb-2.5">{phase.outcomeLabel}</div>
            <p className="text-[13px] font-light text-stone-300 leading-[1.8]">{phase.outcome}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const VisualCol = (
    <div className="flex-shrink-0 w-full lg:w-[340px] xl:w-[380px]">
      <motion.div key={bodyKey} initial={{ opacity: 0, x: isEven ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[240px] border border-white/[.07] bg-[rgba(255,255,255,.015)] overflow-hidden">
        <PhaseVisual index={phaseIndex} inView={true} />
        <span className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-[rgba(201,169,110,0.25)]" />
        <span className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-[rgba(201,169,110,0.25)]" />
        <span className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-[rgba(201,169,110,0.25)]" />
        <span className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-[rgba(201,169,110,0.25)]" />
      </motion.div>
    </div>
  );

  return (
    <div ref={blockRef} id={`phase-${phaseIndex}`} className="mb-4">
      <div className={cn("flex flex-col lg:flex-row gap-10 xl:gap-16 items-start mb-12", !isEven && "lg:flex-row-reverse")}>
        {ContentCol}
        {VisualCol}
      </div>
      <div ref={gridRef}>
        <motion.div key={gridKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="font-mono text-[9px] tracking-[.16em] uppercase text-white/20 mb-5">{phase.listLabel}</motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {phase.items.map((item, i) => <DeliverableCard key={item.name} item={item} index={i} />)}
        </div>
      </div>
    </div>
  );
}

// ── Phase Visuals ─────────────────────────────────────────────────────────

function PhaseVisual({ index, inView }: { index: number; inView: boolean }) {
  const visuals = [AuditVisual, BlueprintVisual, BuildVisual, DeployVisual, SupportVisual, ScaleVisual];
  const V = visuals[index];
  return <V inView={inView} />;
}

function AuditVisual({ inView }: { inView: boolean }) {
  const rows = ["Payables workflow", "Approval routing", "Report generation", "Data entry tasks", "Invoice matching"];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-2.5">
      {rows.map((r, i) => (
        <motion.div key={r} className="flex items-center gap-3" initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}>
          <motion.span className="text-[#c9a96e] text-[9px] font-mono" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.45 + i * 0.08 }}>{String(i + 1).padStart(2, "0")}</motion.span>
          <div className="flex-1 h-px bg-white/[.07]" />
          <span className="text-[10px] font-light text-white/40 font-mono whitespace-nowrap">{r}</span>
          <motion.span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", i < 3 ? "bg-[#c9a96e]" : "bg-white/[.12]")} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }} />
        </motion.div>
      ))}
      <motion.div className="mt-3 font-mono text-[8px] tracking-[.1em] text-[rgba(201,169,110,0.5)]" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.9 }}>
        3 / 5 AUTOMATION CANDIDATES IDENTIFIED
      </motion.div>
    </div>
  );
}

function BlueprintVisual({ inView }: { inView: boolean }) {
  const items = [
    { label: "Opportunity #1", detail: "Invoice matching — 14 hrs/wk", priority: "HIGH" },
    { label: "Opportunity #2", detail: "Approval routing — 8 hrs/wk", priority: "HIGH" },
    { label: "Opportunity #3", detail: "Report generation — 6 hrs/wk", priority: "MED" },
    { label: "Architecture", detail: "3 agents · 2 pipelines", priority: "DESIGN" },
  ];
  return (
    <div className="p-5 h-full flex flex-col justify-center gap-2">
      {items.map((item, i) => (
        <motion.div key={item.label} className="flex items-center gap-3 px-3 py-2 border border-white/[.06] bg-white/[.02]"
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex-1">
            <div className="font-mono text-[9px] text-white/50 mb-0.5">{item.label}</div>
            <div className="font-mono text-[8px] text-white/25">{item.detail}</div>
          </div>
          <span className="font-mono text-[7px] tracking-[.1em] px-1.5 py-0.5 border"
            style={{ color: item.priority === "HIGH" ? "#c9a96e" : item.priority === "DESIGN" ? "rgba(201,169,110,0.5)" : "rgba(255,255,255,0.3)",
              borderColor: item.priority === "HIGH" ? "rgba(201,169,110,0.35)" : "rgba(255,255,255,0.1)" }}>{item.priority}</span>
        </motion.div>
      ))}
      <motion.div className="mt-2 font-mono text-[8px] tracking-[.1em] text-[rgba(201,169,110,0.45)]" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.65 }}>
        BLUEPRINT COMPLETE — READY TO BUILD
      </motion.div>
    </div>
  );
}

function BuildVisual({ inView }: { inView: boolean }) {
  const layers = [
    { label: "AI Agents", color: "rgba(201,169,110,0.9)" },
    { label: "Orchestration", color: "rgba(201,169,110,0.65)" },
    { label: "Integrations", color: "rgba(201,169,110,0.4)" },
    { label: "Data Layer", color: "rgba(201,169,110,0.2)" },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-2">
      {layers.map(({ label, color }, i) => (
        <motion.div key={label} className="flex items-center gap-3" initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}>
          <div className="w-[3px] h-7 flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="flex-1 h-7 flex items-center px-3 border border-white/[.06] bg-white/[.02]">
            <span className="font-mono text-[9px] tracking-[.1em] uppercase" style={{ color }}>{label}</span>
          </div>
        </motion.div>
      ))}
      <motion.div className="mt-2 font-mono text-[8px] tracking-[.1em] text-[rgba(201,169,110,0.4)]" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.75 }}>
        ARCHITECTURE STACK — 4 LAYERS
      </motion.div>
    </div>
  );
}

function DeployVisual({ inView }: { inView: boolean }) {
  const events = [
    { time: "09:14", event: "Deployment triggered", status: "ok" },
    { time: "09:15", event: "Tests passed (47/47)", status: "ok" },
    { time: "09:16", event: "Canary release 10%", status: "ok" },
    { time: "09:18", event: "Full rollout complete", status: "ok" },
    { time: "09:18", event: "Zero downtime confirmed", status: "pulse" },
  ];
  return (
    <div className="p-5 h-full flex flex-col justify-center gap-1.5 font-mono">
      {events.map((e, i) => (
        <motion.div key={e.event} className="flex items-center gap-2.5 text-[10px]" initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.25 + i * 0.12 }}>
          <span className="text-white/25 w-9 flex-shrink-0">{e.time}</span>
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", e.status === "pulse" ? "bg-[#c9a96e] animate-[pulse-dot_2s_ease-in-out_infinite]" : "bg-[#c9a96e] opacity-60")} />
          <span className="text-white/40">{e.event}</span>
        </motion.div>
      ))}
    </div>
  );
}

function SupportVisual({ inView }: { inView: boolean }) {
  const metrics = [
    { label: "Uptime", value: "99.97%", trend: "stable" },
    { label: "Avg. response", value: "1.2s", trend: "stable" },
    { label: "Tasks/day", value: "3,840", trend: "up" },
    { label: "Error rate", value: "0.03%", trend: "down" },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-center gap-3">
      {metrics.map(({ label, value, trend }, i) => (
        <motion.div key={label} className="flex items-center gap-4" initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}>
          <span className="font-mono text-[9px] text-white/30 w-28 flex-shrink-0">{label}</span>
          <div className="flex-1 h-px bg-white/[.05]" />
          <span className="font-mono text-[10px] text-[#c9a96e]">{value}</span>
          <span className="font-mono text-[8px] w-10 text-right"
            style={{ color: trend === "up" ? "rgba(201,169,110,0.6)" : trend === "down" ? "rgba(201,169,110,0.6)" : "rgba(255,255,255,0.2)" }}>
            {trend === "stable" ? "—" : trend === "up" ? "↑" : "↓"}
          </span>
        </motion.div>
      ))}
      <motion.div className="mt-3 font-mono text-[8px] tracking-[.1em] text-[rgba(201,169,110,0.4)]" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.75 }}>
        LIVE MONITORING — ALL SYSTEMS NOMINAL
      </motion.div>
    </div>
  );
}

function ScaleVisual({ inView }: { inView: boolean }) {
  const bars = [
    { label: "Wk 1", v: 0.12 },
    { label: "Wk 4", v: 0.28 },
    { label: "Wk 8", v: 0.48 },
    { label: "Wk 12", v: 0.72 },
    { label: "Wk 16", v: 0.88 },
    { label: "Wk 20", v: 0.97 },
  ];
  return (
    <div className="p-6 h-full flex flex-col justify-end gap-0">
      <div className="flex items-end gap-2 flex-1">
        {bars.map(({ label, v }, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1.5 justify-end h-full">
            <motion.div className="w-full bg-gradient-to-t from-[rgba(201,169,110,0.6)] to-[rgba(201,169,110,0.2)] relative"
              initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}} transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: `${v * 140}px`, transformOrigin: "bottom" }} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {bars.map(({ label }) => <div key={label} className="flex-1 text-center font-mono text-[7px] text-white/20">{label}</div>)}
      </div>
      <motion.div className="mt-2 font-mono text-[8px] tracking-[.1em] text-[rgba(201,169,110,0.45)]" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.9 }}>
        AUTOMATION COVERAGE — 20 WEEKS
      </motion.div>
    </div>
  );
}

// ── Sticky Timeline Nav (smaller, smooth progress) ─────────────────────────

function TimelineNav({ activeIndex, sectionRef }: { activeIndex: number; sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const navRef = useRef<HTMLDivElement>(null);
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
        if (range <= 0) {
          newProgress[i] = 1;
          continue;
        }
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
    <motion.div ref={navRef} className="flex flex-col items-center">
      {PHASES.map((phase, i) => {
        const isPast = i < activeIndex;
        const isActive = i === activeIndex;
        const connectorFill = i < activeIndex ? 1 : i === activeIndex ? progress[i] ?? 0 : 0;

        return (
          <div key={phase.index} className="flex flex-col items-center">
            <a href={`#phase-${i}`} className="relative z-10 flex flex-col items-center group focus:outline-none"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`phase-${i}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label={`Jump to Phase ${phase.index}: ${phase.navLabel}`}>
              <motion.div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500",
                isPast ? "bg-[#c9a96e] border-[#c9a96e]" : isActive ? "bg-[rgba(201,169,110,0.12)] border-[#c9a96e]" : "bg-transparent border-white/[.12] group-hover:border-white/25"
              )}
                animate={isActive ? { boxShadow: ["0 0 0px rgba(201,169,110,0)", "0 0 10px rgba(201,169,110,0.35)", "0 0 0px rgba(201,169,110,0)"] } : { boxShadow: "0 0 0px rgba(201,169,110,0)" }}
                transition={isActive ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : {}}>
                {isPast ? (
                  <motion.span className="text-[9px] text-[#0f0e0d] leading-none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>✓</motion.span>
                ) : (
                  <span className={cn("font-mono text-[8px] transition-colors duration-300", isActive ? "text-[#c9a96e]" : "text-white/20 group-hover:text-white/35")}>{phase.index}</span>
                )}
              </motion.div>
              <span className={cn("font-mono text-[7px] tracking-[.12em] uppercase mt-1.5 transition-colors duration-300", isActive || isPast ? "text-[#c9a96e]" : "text-white/20 group-hover:text-white/35")}>
                {phase.navLabel}
              </span>
            </a>
            {i < PHASES.length - 1 && (
              <div className="w-px h-16 my-1 bg-white/[.06] relative overflow-hidden">
                <motion.div className="absolute inset-x-0 bottom-0 bg-[#c9a96e]" style={{ height: `${connectorFill * 100}%` }} />
                {i === activeIndex && connectorFill > 0 && connectorFill < 1 && (
                  <motion.div className="absolute inset-x-0 w-px h-1.5 bg-[rgba(201,169,110,0.8)] left-0" style={{ bottom: `${connectorFill * 100}%` }} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

// ── ROI Section ────────────────────────────────────────────────────────────

function ROISection() {
  const { ref, playKey } = useScrollInView(0.2);
  return (
    <div ref={ref} className="mt-28 pt-16 border-t border-white/[.06] pb-20">
      <motion.div key={playKey} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mb-14">
          <p className="font-mono text-[9px] tracking-[.18em] uppercase text-[#c9a96e] mb-4">Outcomes</p>
          <h3 className="text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold tracking-[-0.025em] text-stone-100 leading-[1.1]">Results compound over time.</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[.06] border border-white/[.06] overflow-hidden">
          {ROI_STATS.map(({ value, label }, i) => (
            <motion.div key={label} className="bg-[#121416] py-10 px-6 flex flex-col gap-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
              <div className="text-[clamp(1.6rem,3.5vw,2.25rem)] font-bold text-[#c9a96e] tracking-[-0.03em] leading-none">{value}</div>
              <div className="font-mono text-[9px] tracking-[.12em] uppercase text-white/25 leading-[1.5]">{label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ── Scroll‑lock hook (native overflow) ─────────────────────────────────────

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

    // Release body scroll when hitting the boundaries
    let wheelDelta = 0;
    const wheelHandler = (e: WheelEvent) => {
      wheelDelta = e.deltaY;
    };
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

// ── Main Component ─────────────────────────────────────────────────────────

export function CapabilitiesSection() {
  const [activePhase, setActivePhase] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.2 });

  const handleVisible = useCallback((i: number) => setActivePhase(i), []);

  // Lock body scroll when section is in view
  useScrollLockSection(sectionRef, contentRef);

  return (
    <section ref={sectionRef} id="capabilities" className="relative bg-[#0f0e0d] border-t border-white/[.07]">
      {/* Background grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.016]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }} />

      <div className="flex h-full">
        {/* Static side nav – smaller, always visible */}
        <div className="hidden xl:flex flex-shrink-0 w-[100px] h-screen sticky top-0 items-start pt-24 px-2">
          <TimelineNav activeIndex={activePhase} sectionRef={sectionRef} />
        </div>

        {/* Scrollable content area (native overflow) */}
        <div ref={contentRef} className="flex-1 min-w-0 px-6 md:px-12 pt-28">
          <div className="max-w-[1280px] mx-auto">
            <motion.div ref={headerRef}
              initial={{ opacity: 0, y: 24 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mb-24 max-w-[640px]">
              <p className="font-mono text-[10px] tracking-[.18em] uppercase text-[#c9a96e] mb-5">How We Work</p>
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.03em] text-stone-100 leading-[1.08] mb-5">
                From operational chaos<br />to automated clarity.
              </h2>
              <p className="text-[15px] font-light text-stone-400 leading-[1.85]">
                A six-phase process that takes you from discovery to a continuously scaling AI system — delivering measurable ROI within 30–60 days.
              </p>
            </motion.div>

            {PHASES.map((phase, i) => (
              <div key={phase.index}>
                <PhaseBlock phase={phase} phaseIndex={i} onVisible={handleVisible} />
                {i < PHASES.length - 1 && <PhaseDivider index={i} />}
              </div>
            ))}

            <ROISection />
          </div>
        </div>
      </div>
    </section>
  );
}