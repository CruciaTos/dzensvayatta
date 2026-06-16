"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── Design tokens (dark glass theme — intentionally separate from warm site palette) ──
const C = {
  bg: "#010B13",
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.65)",
  cardBg: "rgba(255,255,255,0.02)",
  cardBgHover: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(178,213,229,0.10)",
  cardBorderHover: "rgba(126,195,226,0.25)",
  divider: "rgba(178,213,229,0.10)",
  glowSpot: "rgba(126,195,226,0.07)",
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Data ────────────────────────────────────────────────────────────────────
interface MarketCard {
  title: string;
  description: string;
  hoverItems: string[];
}

const MARKET_CARDS: MarketCard[] = [
  {
    title: "Finance & Accounting",
    description: "Invoices, reconciliations, approvals, and reporting workflows slowed by manual review and disconnected systems.",
    hoverItems: ["Invoice matching", "Approval routing", "Reconciliation workflows", "Financial reporting"],
  },
  {
    title: "Sales & CRM Operations",
    description: "Lead management, follow-ups, pipeline updates, and customer workflows that fall between teams and tools.",
    hoverItems: ["Lead routing", "Follow-up automation", "CRM synchronization", "Pipeline visibility"],
  },
  {
    title: "Customer Support",
    description: "Ticket triage, response workflows, escalation handling, and knowledge management across support channels.",
    hoverItems: ["Ticket classification", "Response drafting", "Escalation workflows", "Knowledge retrieval"],
  },
  {
    title: "HR & People Operations",
    description: "Employee onboarding, payroll preparation, compliance tracking, and workforce administration processes.",
    hoverItems: ["Employee onboarding", "Payroll preparation", "Compliance tracking", "Internal requests"],
  },
  {
    title: "Operations & Supply Chain",
    description: "Order management, vendor coordination, inventory workflows, and operational exception handling.",
    hoverItems: ["Order tracking", "Vendor coordination", "Inventory visibility", "Exception handling"],
  },
  {
    title: "Data & Reporting",
    description: "Recurring reports, business intelligence workflows, data consolidation, and operational visibility systems.",
    hoverItems: ["Data aggregation", "Automated reporting", "KPI monitoring", "Anomaly detection"],
  },
];

// ── SpotlightCard ────────────────────────────────────────────────────────────
// Uses direct DOM mutation for spotlight tracking to avoid per-frame re-renders.
// Only border / bg / hover-items state causes React re-renders.

function SpotlightCard({ card, index }: { card: MarketCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });

  // Spotlight tracks cursor — direct DOM update, no state
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotRef.current.style.background =
      `radial-gradient(280px circle at ${x}px ${y}px, ${C.glowSpot} 0%, rgba(126,195,226,0.015) 45%, transparent 70%)`;
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Fade spotlight out by clearing background (transition handles opacity)
    if (spotRef.current) {
      spotRef.current.style.background = "transparent";
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.09, ease: EASE }}
      style={{
        position: "relative",
        backgroundColor: isHovered ? C.cardBgHover : C.cardBg,
        border: `1px solid ${isHovered ? C.cardBorderHover : C.cardBorder}`,
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "default",
        transition: "background-color 0.45s ease, border-color 0.45s ease",
        // Prevent cards from visually merging via independent backgrounds + gaps
        isolation: "isolate",
      }}
    >
      {/* ── Spotlight overlay — position updated via DOM ref ── */}
      <div
        ref={spotRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          // Transition only when leaving (not while tracking)
          transition: isHovered ? "none" : "background 0.5s ease",
          zIndex: 0,
        }}
      />

      {/* ── Card body ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(32px, 4.5vw, 56px)",
        }}
      >
        {/* Title — primary visual hero */}
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(20px, 1.9vw, 26px)",
            fontWeight: 600,
            color: C.textPrimary,
            letterSpacing: "-0.022em",
            lineHeight: "1.18",
            marginBottom: "15px",
          }}
        >
          {card.title}
        </h3>

        {/* Supporting sentence — secondary hierarchy */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13.5px",
            fontWeight: 300,
            color: C.textMuted,
            lineHeight: "1.76",
            margin: 0,
          }}
        >
          {card.description}
        </p>

        {/* ── Hover reveal: capability list ── */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="hover-items"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  marginTop: "26px",
                  paddingTop: "20px",
                  borderTop: `1px solid ${C.divider}`,
                }}
              >
                {card.hoverItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.055 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "5.5px 0",
                    }}
                  >
                    {/* Dot marker */}
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: C.accent,
                        flexShrink: 0,
                        opacity: 0.8,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        letterSpacing: "0.07em",
                        color: `rgba(178,213,229,0.72)`,
                        lineHeight: 1,
                      }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── TargetMarkets section ────────────────────────────────────────────────────
export function TargetMarkets() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section
      id="target-markets"
      aria-label="Target markets — operational functions DZen optimizes"
      style={{
        position: "relative",
        backgroundColor: C.bg,
        padding: "clamp(88px, 11vw, 144px) 0",
        overflow: "hidden",
      }}
    >
      {/* Ambient radial glow — restrained, top-center */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "420px",
          background: "radial-gradient(ellipse at center top, rgba(126,195,226,0.045) 0%, transparent 62%)",
          filter: "blur(1px)",
          pointerEvents: "none",
        }}
      />

      {/* Content wrapper */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 clamp(24px, 4.5vw, 48px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Section header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 22 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
          style={{ marginBottom: "clamp(52px, 8vw, 96px)" }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "26px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "28px",
                height: "1px",
                background: C.accent,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              Target Markets
            </span>
          </div>

          {/* Main heading */}
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(28px, 4.2vw, 54px)",
              fontWeight: 700,
              color: C.textPrimary,
              letterSpacing: "-0.026em",
              lineHeight: "1.1",
              marginBottom: "20px",
              maxWidth: "700px",
            }}
          >
            Built Around How Businesses Actually Operate
          </h2>

          {/* Subheading */}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 300,
              color: C.textMuted,
              lineHeight: "1.72",
              maxWidth: "540px",
              margin: 0,
            }}
          >
            We optimize the business functions where repetitive work, disconnected systems, and operational inefficiencies create measurable costs.
          </p>
        </motion.div>

        {/* ── Cards grid ──
             Desktop: 3 columns
             Tablet (≤900px): 2 columns
             Mobile (≤600px): 1 column */}
        <div
          className="tm-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",  // changed to 3 columns
            gap: "clamp(12px, 1.6vw, 22px)",
          }}
        >
          {MARKET_CARDS.map((card, i) => (
            <SpotlightCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .tm-grid {
            grid-template-columns: repeat(2, 1fr) !important;   /* 2 columns on tablets */
          }
        }
        @media (max-width: 600px) {
          .tm-grid {
            grid-template-columns: 1fr !important;              /* 1 column on phones */
          }
        }
      `}</style>
    </section>
  );
}