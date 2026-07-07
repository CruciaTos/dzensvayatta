"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ── Design tokens (dark theme isolated to this section) ────────────────────
const C = {
  bg: "#000000",
  bgPanel: "#0A0A0A",
  bgCard: "#0F0F0F",
  border: "rgba(255,255,255,0.06)",
  borderHi: "rgba(255,255,255,0.12)",
  emerald: "#10B981",
  emeraldDim: "rgba(16,185,129,0.15)",
  emeraldGlow: "rgba(16,185,129,0.08)",
  cyan: "#06B6D4",
  violet: "#7C3AED",
  violetDim: "rgba(124,58,237,0.15)",
  white: "#FFFFFF",
  grey1: "rgba(255,255,255,0.85)",
  grey2: "rgba(255,255,255,0.45)",
  grey3: "rgba(255,255,255,0.22)",
  grey4: "rgba(255,255,255,0.08)",
  gridLine: "rgba(255,255,255,0.04)",
};

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Wire grid background ───────────────────────────────────────────────────
function GridBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(${C.gridLine} 1px, transparent 1px),
          linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

// ── Section eyebrow ────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div style={{ width: 28, height: 1, background: C.emerald }} />
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.emerald,
      }}>
        {children}
      </span>
    </div>
  );
}

// ── Component A: Before / After Benchmark Chart ────────────────────────────
const METRICS = [
  { label: "Audit Time", before: 82, after: 18 },
  { label: "Error Rate", before: 74, after: 12 },
  { label: "Manual Reports", before: 90, after: 10 },
  { label: "Process Bottlenecks", before: 68, after: 22 },
  { label: "Operational Costs", before: 60, after: 24 },
  { label: "Revenue Leakage", before: 55, after: 8 },
  { label: "Time Waste", before: 78, after: 16 },
];

function BenchmarkChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div ref={ref}>
      <Eyebrow>Before vs After</Eyebrow>
      <h3 style={{ color: C.white, fontSize: "clamp(20px,2.2vw,28px)", fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 32 }}>
        Optimization Intelligence That Creates<br />Measurable Growth
      </h3>
      <p style={{ color: C.grey2, fontSize: 13, lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
        Transform operational inefficiencies into quantifiable business gains through data-driven optimization, automation, and continuous process improvement.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Legend */}
        <div style={{ display: "flex", gap: 24, marginBottom: 4 }}>
          {[
            { color: C.grey3, label: "Before" },
            { color: C.emerald, label: "After" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
              <span style={{ color: C.grey2, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        {METRICS.map((m, i) => {
          const improvement = Math.round(((m.before - m.after) / m.before) * 100);
          const isHovered = hovered === i;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: EASE }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "10px 14px",
                borderRadius: 4,
                border: `1px solid ${isHovered ? C.borderHi : "transparent"}`,
                background: isHovered ? C.bgCard : "transparent",
                transition: "all 0.2s",
                cursor: "default",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{ color: C.grey1, fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>{m.label}</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 + 0.06 * i }}
                  style={{ color: C.emerald, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
                >
                  ↓ {improvement}%
                </motion.span>
              </div>

              {/* Before bar */}
              <div style={{ height: 4, background: C.grey4, borderRadius: 2, marginBottom: 4, overflow: "hidden" }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: m.before / 100 } : {}}
                  transition={{ duration: 0.7, delay: 0.15 + 0.07 * i, ease: EASE }}
                  style={{ height: "100%", background: C.grey3, transformOrigin: "left", borderRadius: 2 }}
                />
              </div>

              {/* After bar */}
              <div style={{ height: 4, background: C.grey4, borderRadius: 2, overflow: "hidden" }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: m.after / 100 } : {}}
                  transition={{ duration: 0.7, delay: 0.35 + 0.07 * i, ease: EASE }}
                  style={{
                    height: "100%",
                    background: `linear-gradient(90deg, ${C.emerald}, rgba(16,185,129,0.5))`,
                    transformOrigin: "left",
                    borderRadius: 2,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Component B: Process Flow ──────────────────────────────────────────────
const FLOW_BEFORE = ["Manual processes", "Repetitive tasks", "Slow reporting", "Human errors", "Resource wastage"];
const FLOW_AFTER = ["Automated workflows", "Faster decisions", "Real-time insights", "Reduced errors", "Higher productivity"];

function ProcessFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref}>
      <Eyebrow>Process Streamlining</Eyebrow>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, alignItems: "start" }}>
        {/* Before */}
        <div>
          <div style={{ color: C.grey2, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Current State</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FLOW_BEFORE.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * i, ease: EASE }}
                style={{
                  padding: "9px 14px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  color: C.grey2,
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  background: C.bgCard,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.grey3, flexShrink: 0 }} />
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34, gap: 6 }}>
          {FLOW_BEFORE.map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + 0.1 * i, ease: EASE }}
              style={{ width: 32, height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                <path d="M0 6H18M13 1L18 6L13 11" stroke={C.emerald} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* After */}
        <div>
          <div style={{ color: C.emerald, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Optimized State</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FLOW_AFTER.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + 0.1 * i, ease: EASE }}
                style={{
                  padding: "9px 14px",
                  border: `1px solid ${C.emeraldDim}`,
                  borderRadius: 4,
                  color: C.grey1,
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  background: C.emeraldGlow,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.emerald, flexShrink: 0 }} />
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component E: Butterfly / Tornado Comparison Chart ─────────────────────
const COMPARE_METRICS = [
  { label: "Audit Time", before: 82, after: 18, unit: "hrs/mo" },
  { label: "Error Rate", before: 74, after: 12, unit: "%" },
  { label: "Reports", before: 90, after: 10, unit: "% manual" },
  { label: "Turnover", before: 65, after: 20, unit: "%" },
  { label: "Cost Savings", before: 10, after: 78, unit: "% gain" },
];

function ComparisonChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div ref={ref}>
      <Eyebrow>Side-by-Side Impact</Eyebrow>
      <h3 style={{
        color: C.white,
        fontSize: "clamp(22px, 2.8vw, 50px)",
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        letterSpacing: "-0.02em",
        marginBottom: 28,
        lineHeight: 1.2,
      }}>
        Every metric, before & after.<br />
        <span style={{ color: C.grey2 }}>The contrast speaks for itself.</span>
      </h3>

      {/* Legend row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 20, height: 3, background: C.grey3, borderRadius: 2 }} />
          <span style={{ color: C.grey2, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Before</span>
        </div>
        <span style={{ color: C.grey3, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Metric</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.grey2, fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase" }}>After</span>
          <div style={{ width: 20, height: 3, background: C.emerald, borderRadius: 2 }} />
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {COMPARE_METRICS.map((m, i) => {
          const isHov = hovered === i;
          const beforePct = m.label === "Cost Savings" ? m.after : m.before;
          const afterPct = m.label === "Cost Savings" ? m.before : m.after;
          const improvement = Math.round(Math.abs(m.before - m.after));

          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * i, ease: EASE }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 1fr",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 6,
                background: isHov ? C.bgCard : "transparent",
                border: `1px solid ${isHov ? C.borderHi : "transparent"}`,
                transition: "all 0.2s",
                cursor: "default",
              }}
            >
              {/* LEFT bar (before) — grows rightward from centre */}
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
                {/* value label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + 0.06 * i }}
                  style={{ color: C.grey2, fontSize: 11, fontFamily: "var(--font-mono)", minWidth: 28, textAlign: "right" }}
                >
                  {m.before}{m.unit.includes("%") ? "%" : ""}
                </motion.span>
                {/* bar track */}
                <div style={{ flex: 1, height: 8, background: C.grey4, borderRadius: "2px 0 0 2px", overflow: "hidden", maxWidth: 140 }}>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: beforePct / 100 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + 0.07 * i, ease: EASE }}
                    style={{
                      height: "100%",
                      background: C.grey3,
                      transformOrigin: "right",
                      borderRadius: "2px 0 0 2px",
                      float: "right",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              {/* CENTER label */}
              <div style={{ textAlign: "center" }}>
                <div style={{ color: isHov ? C.white : C.grey1, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.04em", marginBottom: 2, transition: "color 0.2s" }}>
                  {m.label}
                </div>
                <AnimatePresence>
                  {isHov && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      style={{ color: C.emerald, fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
                    >
                      ↓ {improvement}pt
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT bar (after) — grows leftward from centre */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* bar track */}
                <div style={{ flex: 1, height: 8, background: C.grey4, borderRadius: "0 2px 2px 0", overflow: "hidden", maxWidth: 140 }}>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: afterPct / 100 } : {}}
                    transition={{ duration: 0.8, delay: 0.38 + 0.07 * i, ease: EASE }}
                    style={{
                      height: "100%",
                      background: `linear-gradient(90deg, ${C.emerald}, rgba(16,185,129,0.45))`,
                      transformOrigin: "left",
                      borderRadius: "0 2px 2px 0",
                      width: "100%",
                    }}
                  />
                </div>
                {/* value label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + 0.06 * i }}
                  style={{ color: C.emerald, fontSize: 11, fontFamily: "var(--font-mono)", minWidth: 28 }}
                >
                  {m.after}{m.unit.includes("%") ? "%" : ""}
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
        style={{
          marginTop: 20,
          padding: "12px 16px",
          borderRadius: 6,
          border: `1px solid ${C.emeraldDim}`,
          background: C.emeraldGlow,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ color: C.grey2, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
          AVG REDUCTION ACROSS ALL METRICS
        </span>
        <span style={{ color: C.emerald, fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 500, letterSpacing: "0.06em" }}>
          ↓ 74% inefficiency eliminated
        </span>
      </motion.div>
    </div>
  );
}

// ── Component C: Long-Term Impact Cascade ──────────────────────────────────
const CASCADE = [
  { value: "77", unit: "Hrs", label: "Saved / Month", sub: "" },
  { value: "3.5", unit: "Hrs", label: "Saved / Day", sub: "" },
  { value: "22", unit: "Days", label: "Working / Month", sub: "" },
  { value: "924", unit: "Hrs", label: "Saved / Year", sub: "" },
  { value: "115", unit: "Days", label: "Recovered", sub: "" },
];

function ImpactCascade() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref}>
      <Eyebrow>Long-Term Impact</Eyebrow>
      <div style={{ marginBottom: 28 }}>
        <div style={{ color: C.grey2, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>The Impact After One Year</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ color: C.white, fontSize: "clamp(48px,6vw,80px)", fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1 }}>
            77+
          </span>
          <span style={{ color: C.emerald, fontSize: 18, fontFamily: "var(--font-sans)", fontWeight: 300 }}>Hours Saved Every Month</span>
        </div>
      </div>

      {/* Sequential chain */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
        {CASCADE.map((node, i) => (
          <div key={node.label} style={{ display: "flex", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i, ease: EASE }}
              style={{
                padding: "12px 16px",
                border: `1px solid ${i === 0 ? C.emerald : C.border}`,
                borderRadius: 6,
                background: i === 0 ? C.emeraldGlow : C.bgCard,
                textAlign: "center",
                minWidth: 88,
              }}
            >
              <div style={{ color: i === 0 ? C.emerald : C.white, fontSize: "clamp(18px,2vw,26px)", fontFamily: "var(--font-serif)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1 }}>
                {node.value}
                <span style={{ fontSize: "0.55em", marginLeft: 2, color: C.grey2 }}>{node.unit}</span>
              </div>
              <div style={{ color: C.grey2, fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 5 }}>
                {node.label}
              </div>
            </motion.div>

            {i < CASCADE.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.15 * i + 0.3, ease: EASE }}
                style={{ width: 24, display: "flex", justifyContent: "center", transformOrigin: "left" }}
              >
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path d="M0 5H14M10 1L14 5L10 9" stroke={C.grey3} strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component D: Business Outcome Grid ─────────────────────────────────────
interface OutcomeCard {
  tag: string;
  tagColor: string;
  headline: string;
  value: string;
  unit?: string;
  body: string;
  viz?: "staircase" | "bars" | "roi";
}

const OUTCOME_CARDS: OutcomeCard[] = [
  {
    tag: "Inventory",
    tagColor: C.emerald,
    headline: "Annual Inventory Savings",
    value: "₹24,000",
    unit: "+",
    body: "Reduce excess inventory and unlock capital tied up in inefficient stock management.",
    viz: "staircase",
  },
  {
    tag: "Cash Flow",
    tagColor: C.cyan,
    headline: "More Cash Flow Released",
    value: "12",
    unit: "%",
    body: "Free working capital through optimized inventory and operational efficiency.",
    viz: "bars",
  },
  {
    tag: "Revenue",
    tagColor: C.violet,
    headline: "Revenue Growth",
    value: "7",
    unit: "%",
    body: "Improve business performance through better processes, data visibility, and decision-making.",
    viz: "bars",
  },
  {
    tag: "ROI",
    tagColor: C.emerald,
    headline: "Cost Savings & ROI",
    value: "₹1.58L",
    unit: "",
    body: "Investment: ₹30,000 · ₹13,500 saved / month · ₹1.58 lakh saved / year",
    viz: "roi",
  },
  {
    tag: "Efficiency",
    tagColor: C.cyan,
    headline: "Operational Efficiency",
    value: "30",
    unit: "%",
    body: "Through process automation, workflow optimization, better resource allocation, and faster reporting cycles.",
    viz: "staircase",
  },
];

function StaircaseViz({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {[0.25, 0.4, 0.55, 0.72, 0.88, 1.0].map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.06 * i, ease: EASE }}
          style={{
            width: 8,
            height: `${h * 100}%`,
            background: `${color}${i === 5 ? "FF" : "80"}`,
            borderRadius: "2px 2px 0 0",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

function BarsViz({ color }: { color: string }) {
  const bars = [0.4, 0.6, 0.5, 0.75, 0.65, 0.9, 0.8];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 * i, ease: EASE }}
          style={{
            width: 8,
            height: `${h * 100}%`,
            background: color,
            opacity: 0.5 + h * 0.5,
            borderRadius: "2px 2px 0 0",
            transformOrigin: "bottom",
          }}
        />
      ))}
    </div>
  );
}

function ROIViz() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: C.grey2, fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Invest</div>
        <div style={{ color: C.grey1, fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 500 }}>₹30K</div>
      </div>
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
        <path d="M0 7H26M20 2L26 7L20 12" stroke={C.emerald} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: C.grey2, fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Return</div>
        <div style={{ color: C.emerald, fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 500 }}>5.3×</div>
      </div>
    </div>
  );
}

function OutcomeCardComponent({ card, index }: { card: OutcomeCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 * index, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "24px 22px",
        border: `1px solid ${hovered ? C.borderHi : C.border}`,
        borderRadius: 8,
        background: hovered ? C.bgPanel : C.bgCard,
        transition: "all 0.25s",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Hover glow */}
      {hovered && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at top left, ${card.tagColor}08 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{
          color: card.tagColor,
          fontSize: 9,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          padding: "3px 8px",
          border: `1px solid ${card.tagColor}30`,
          borderRadius: 3,
          background: `${card.tagColor}10`,
        }}>
          {card.tag}
        </span>
        {card.viz === "staircase" && <StaircaseViz color={card.tagColor} />}
        {card.viz === "bars" && <BarsViz color={card.tagColor} />}
        {card.viz === "roi" && <ROIViz />}
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 6 }}>
        <span style={{
          color: C.white,
          fontSize: "clamp(28px,3.5vw,42px)",
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}>
          {card.value}
        </span>
        {card.unit && (
          <span style={{ color: card.tagColor, fontSize: "0.55em", fontFamily: "var(--font-serif)" }}>
            {card.unit}
          </span>
        )}
      </div>

      {/* Headline */}
      <div style={{ color: C.grey2, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        {card.headline}
      </div>

      {/* Body */}
      <p style={{ color: C.grey3, fontSize: 12, fontFamily: "var(--font-sans)", lineHeight: 1.65, fontWeight: 300 }}>
        {card.body}
      </p>

      {/* Bottom accent */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, ${card.tagColor}60, transparent)`,
          transformOrigin: "left",
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 + 0.1 * index, ease: EASE }}
      />
    </motion.div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function GrowthImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section
      ref={sectionRef}
      id="growth-impact"
      aria-label="Growth and impact metrics"
      style={{
        position: "relative",
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        overflow: "hidden",
        paddingBottom: 120,
      }}
    >
      {/* Wire grid */}
      <GridBackground />

      {/* Ambient glows */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: -100,
          left: "10%",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${C.emeraldGlow} 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          y: bgY,
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          right: "5%",
          width: 500,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
          y: bgY,
        }}
      />

      {/* ── Section header ────────────────────────── */}
      <div
        ref={headerRef}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "100px 48px 72px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Eyebrow>Growth & Impact</Eyebrow>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <h2 style={{
              color: C.white,
              fontSize: "clamp(32px,4.5vw,64px)",
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              margin: 0,
            }}>
              Optimization that creates<br />
              <span style={{ color: C.grey2 }}>measurable business gains.</span>
            </h2>
            <p style={{
              color: C.grey2,
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              lineHeight: 1.75,
              maxWidth: 380,
              margin: 0,
            }}>
              Transform operational inefficiencies into quantifiable results: tracked, measured, and continuously improved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Component A + B ───────────────────────── */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 48px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
      }}>
        <div style={{
          padding: "40px 36px",
          border: `1px solid ${C.border}`,
          background: C.bgPanel,
          borderRadius: "8px 0 0 8px",
        }}>
          <BenchmarkChart />
        </div>
        <div style={{
          padding: "40px 36px",
          border: `1px solid ${C.border}`,
          borderLeft: "none",
          background: C.bgPanel,
          borderRadius: "0 8px 8px 0",
        }}>
          <ProcessFlow />
        </div>
      </div>

      {/* ── Component E: Butterfly Comparison Chart ── */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 48px 80px",
      }}>
        <div style={{
          padding: "40px 36px",
          border: `1px solid ${C.border}`,
          background: C.bgPanel,
          borderRadius: 8,
        }}>
          <ComparisonChart />
        </div>
      </div>

      {/* ── Component C: Cascade ──────────────────── */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 48px 80px",
      }}>
        <div style={{
          padding: "40px 36px",
          border: `1px solid ${C.border}`,
          background: C.bgPanel,
          borderRadius: 8,
        }}>
          <ImpactCascade />
        </div>
      </div>

      {/* ── Component D: Outcome Grid ─────────────── */}
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 48px",
      }}>
        <div style={{ marginBottom: 28 }}>
          <Eyebrow>Business Outcomes</Eyebrow>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}>
          {OUTCOME_CARDS.slice(0, 3).map((card, i) => (
            <OutcomeCardComponent key={card.tag} card={card} index={i} />
          ))}
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          marginTop: 2,
        }}>
          {OUTCOME_CARDS.slice(3).map((card, i) => (
            <OutcomeCardComponent key={card.tag} card={card} index={i + 3} />
          ))}
        </div>
      </div>

      {/* ── Mobile responsive style override ─────── */}
      <style>{`
        @media (max-width: 900px) {
          #growth-impact [data-grid-ab] {
            grid-template-columns: 1fr !important;
          }
          #growth-impact [data-grid-ab] > div:last-child {
            border-left: 1px solid ${C.border} !important;
            border-radius: 0 0 8px 8px !important;
            border-top: none !important;
          }
          #growth-impact [data-grid-ab] > div:first-child {
            border-radius: 8px 8px 0 0 !important;
          }
          #growth-impact [data-grid-outcomes3] {
            grid-template-columns: 1fr !important;
          }
          #growth-impact [data-grid-outcomes2] {
            grid-template-columns: 1fr !important;
          }
          #growth-impact [data-header-row] {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
        @media (max-width: 600px) {
          #growth-impact [data-cascade-chain] {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          #growth-impact [data-process-grid] {
            grid-template-columns: 1fr !important;
          }
          #growth-impact [data-process-grid] > [data-arrow-col] {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}