"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

/* ── Design tokens (identical to TargetAreas & TargetMarkets) ── */
const C = {
  bg: "#000b12ff",
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5ff",
  textMuted: "rgba(229,243,229,0.65)",
  cardBg: "#0d0d0cff",
  cardBgHover: "#141413ff",
  cardBorder: "rgba(178,213,229,0.10)",
  cardBorderHover: "rgba(126,195,226,0.28)",
  divider: "rgba(178,213,229,0.10)",
  glowSpot: "rgba(126,195,226,0.08)",
  glassBg: "rgba(9, 9, 9, 0.5)",
  glassHighlight: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(178,213,229,0.15)",
  glassShadow: "0 12px 40px rgba(0,0,0,0.2)",
} as const;

const SPRING = "cubic-bezier(0.22,1,0.36,1)";

/* ── Data ── */
interface CaseMetric { value: string; label: string }
interface RealCase {
  id: string; org: string; tag: string; domain: string;
  headline: string; body: string; metrics: CaseMetric[];
  accent: string; source: string;
}

const CASES: RealCase[] = [
  {
    id: "01", org: "BMC Mumbai", tag: "Municipal AI Enforcement",
    domain: "Infrastructure · Governance",
    headline: "₹19.25 Cr in contractor penalties recovered via AI site monitoring.",
    body: "AI flagged image reuse, missing videos, and code mismatches that manual audits missed. Penalties were deducted straight from contractor bills.",
    metrics: [{ value: "₹19.25Cr", label: "Penalties enforced" }, { value: "Real-time", label: "AI site monitoring" }, { value: "Zero", label: "Manual audit reliance" }],
    accent: "#B2D5E5", source: "Hindustan Times — June 2025"
  },
  {
    id: "02", org: "Kerala Police", tag: "Law Enforcement AI",
    domain: "Public Safety · Child Protection",
    headline: "India's first AI system tracks CSAM perpetrators across the dark web.",
    body: "Katalyst cross-references victim signatures in hours instead of weeks, which speeds up identification and intervention.",
    metrics: [{ value: "#1", label: "First in India" }, { value: "Hours", label: "vs. Weeks (manual)" }, { value: "Katalyst", label: "AI tool deployed" }],
    accent: "#7ec3e2", source: "The News Minute — 2025"
  },
  {
    id: "03", org: "FTITTP · Indian Airports", tag: "Biometric AI Systems",
    domain: "Border Control · Government",
    headline: "Airport immigration: 30 minutes down to 15 seconds with AI biometrics.",
    body: "Travellers skip the officer queue. Facial recognition and fingerprint scanners clear them in 15 seconds against government databases.",
    metrics: [{ value: "15s", label: "Clearance time" }, { value: "120×", label: "Faster than manual" }, { value: "FTITTP", label: "Govt. programme" }],
    accent: "#5aabce", source: "NDTV Travel — 2025"
  },
  {
    id: "04", org: "Bengaluru Traffic Police", tag: "AI Public Shaming",
    domain: "Traffic Enforcement · Smart City",
    headline: "AI-powered billboard shames drivers with pending challans in real time.",
    body: "A digital board on MG Road displays vehicle photos, registration numbers, and pending fine amounts. Updated live from traffic databases, it uses public accountability to nudge violators into paying their dues.",
    metrics: [{ value: "Real-time", label: "Challan updates" }, { value: "Public", label: "Display board" }, { value: "MG Road", label: "Pilot location" }],
    accent: "#6fc5e0", source: "NDTV Auto — 2026"
  }
];

/* ── Marquee card – now uses unified tokens ── */
function MarqueeExpandingCard({
  c,
  isExpanded,
  onHover,
}: {
  c: RealCase;
  isExpanded: boolean;
  onHover: (id: string | null) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHover(c.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        flex: isExpanded ? "0 0 clamp(360px, 42vw, 500px)" : "0 0 clamp(280px, 35vw, 360px)",
        transition: `flex 0.65s ${SPRING}, border-color 0.45s ease`,
        position: "relative",
        overflow: "hidden",
        backgroundColor: C.cardBg,                       // ← unified card background
        border: `1px solid ${isExpanded ? C.cardBorderHover : C.cardBorder}`, // ← unified border
        borderRadius: "16px",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Dot‑grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.4,
          backgroundImage: "radial-gradient(circle, rgba(178,213,229,0.9) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Ghost number */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: isExpanded ? "-36px" : "-18px",
          right: "-4px",
          fontSize: isExpanded ? "clamp(140px,16vw,260px)" : "clamp(110px,12vw,200px)",
          color: "rgba(178,213,229,0.018)",               // unchanged ghost colour
          fontFamily: "serif",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          pointerEvents: "none",
          userSelect: "none",
          transition: `all 0.65s ${SPRING}`,
        }}
      >
        {c.id}
      </div>
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          backgroundColor: isExpanded ? c.accent : `${c.accent}40`,
          transition: "background-color 0.45s ease",
        }}
      />
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: isExpanded ? 1 : 0.35,
          transition: "opacity 0.55s ease",
          background: `radial-gradient(ellipse at top left, ${c.accent}0D 0%, transparent 58%)`,
        }}
      />
      {/* Inner content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: isExpanded ? "48px 40px 72px 48px" : "24px 24px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "flex-start",
          transition: `padding 0.65s ${SPRING}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: isExpanded ? "24px" : "16px",
            flexWrap: "wrap",
            transition: `margin-bottom 0.65s ${SPRING}`,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "12.5px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#a9bdf8ff",
              opacity: isExpanded ? 1 : 0,
              transition: "opacity 0.35s ease",
              whiteSpace: "nowrap",
            }}
          >
            {c.domain}
          </span>
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: "13px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a9bdf8ff",
            marginBottom: "12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {c.org}
        </div>
        <h3
          className="font-sans"
          style={{
            fontSize: isExpanded ? "clamp(19px, 2.2vw, 34px)" : "clamp(32px, 4.2vw, 52px)",
            fontWeight: 600,
            color: C.textPrimary,                    // ← unified headline colour
            lineHeight: 1.15,
            letterSpacing: "-0.022em",
            margin: 0,
            transition: `font-size 0.65s ${SPRING}`,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: isExpanded ? "unset" : 5,
            WebkitBoxOrient: "vertical",
          }}
        >
          {c.headline}
        </h3>
        <div
          style={{
            flex: isExpanded ? 1 : "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            opacity: isExpanded ? 1 : 0,
            pointerEvents: isExpanded ? "auto" : "none",
            transition: `opacity 0.45s ease ${isExpanded ? "0.28s" : "0s"}, max-height 0.65s ${SPRING}`,
            maxHeight: isExpanded ? "1000px" : "0px",
            overflow: "hidden",
            marginTop: isExpanded ? "24px" : "0px",
          }}
        >
          <div
            style={{
              height: "1px",
              backgroundColor: C.divider,           // ← unified divider
              marginBottom: "24px",
              transform: isExpanded ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: `transform 0.5s ${SPRING} ${isExpanded ? "0.32s" : "0s"}`,
            }}
          />
          <p
            className="font-sans"
            style={{
              fontSize: "17px",
              fontWeight: 300,
              color: "#a9bdf8ff",
              lineHeight: 1.75,
              marginBottom: "28px",
            }}
          >
            {c.body}
          </p>
        </div>
      </div>
      {/* Source */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "16px 24px 16px 48px",
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? "auto" : "none",
          transition: `opacity 0.45s ease ${isExpanded ? "0.28s" : "0s"}`,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "12px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#a9bdf8ff",
          }}
        >
          Source: {c.source}
        </span>
      </div>
      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          height: "2px",
          backgroundColor: c.accent,
          opacity: isExpanded ? 0.55 : 0.12,
          transformOrigin: "left",
          transform: `scaleX(${isExpanded ? 1 : 0.32})`,
          transition: `opacity 0.4s ease, transform 0.65s ${SPRING}`,
        }}
      />
    </div>
  );
}

/* ── Main section – glass container & heading now match TargetAreas ── */
export function CaseStudies() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleHover = (id: string | null) => {
    setActiveId(id);
  };

  return (
    <section
      id="cases"
      aria-label="Real-world AI deployments"
      style={{
        position: "relative",
        padding: "clamp(88px, 11vw, 144px) 0",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(12px, 1.5vw, 24px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Glass container – identical to TargetAreas */}
        <div
          style={{
            position: "relative",
            borderRadius: "40px",
            overflow: "hidden",
            boxShadow: C.glassShadow,
            border: "1px solid rgba(126,195,226,0.2)",
          }}
        >
          {/* Dark semi‑transparent blur layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: C.glassBg,
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              zIndex: 0,
            }}
          />

          {/* Grid lines */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              backgroundImage: `
                linear-gradient(rgba(178,213,229,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(178,213,229,0.06) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 4, padding: "clamp(56px, 7vw, 96px) clamp(40px, 5vw, 72px)" }}>
            <FadeIn>
              <div className="flex items-end justify-between mb-8 gap-12 max-md:flex-col max-md:items-start">
                <div>
                  <h2
                    className="font-sans font-bold"
                    style={{
                      fontSize: "clamp(52px, 5vw, 72px)",     // ← unified heading size
                      fontWeight: 700,
                      color: C.textPrimary,                   // ← unified heading colour
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    Think AI is still far away?
                    <br />
                    <em className="not-italic" style={{ color: C.textMuted }}>
                      Think again.
                    </em>
                  </h2>
                </div>
                <div className="max-w-[400px] flex-shrink-0">
                  <p
                    className="font-sans text-body font-light leading-[1.7]"
                    style={{ color: C.textMuted }}
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div
                className="marquee-container"
                style={{
                  height: "clamp(550px, 60vh, 760px)",
                  overflow: "hidden",
                  width: "100%",
                  marginTop: "40px",
                }}
              >
                <style>{`
                  @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .marquee-track {
                    display: flex;
                    gap: 16px;
                    height: 100%;
                    animation: marquee-scroll 30s linear infinite;
                  }
                  .marquee-container:hover .marquee-track {
                    animation-play-state: paused;
                  }
                `}</style>

                <div className="marquee-track">
                  {CASES.map((c) => (
                    <MarqueeExpandingCard
                      key={c.id}
                      c={c}
                      isExpanded={activeId === c.id}
                      onHover={handleHover}
                    />
                  ))}
                  {CASES.map((c) => (
                    <MarqueeExpandingCard
                      key={`dup-${c.id}`}
                      c={c}
                      isExpanded={activeId === c.id}
                      onHover={handleHover}
                    />
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}