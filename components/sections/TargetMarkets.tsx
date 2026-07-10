"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ── Design tokens ────────────────────────────────────────────────────────────
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

const EASE = [0.22, 1, 0.36, 1] as const;
const TRANSITION = `0.42s cubic-bezier(0.22,1,0.36,1)`;

// ── Data ─────────────────────────────────────────────────────────────────────
interface MarketCard {
  id: string;
  title: string;
}

const MARKET_CARDS: MarketCard[] = [
  { id: "finance", title: "Financial Operations" },
  { id: "sales", title: "Revenue Operations" },
  { id: "support", title: "Customer Experience" },
  { id: "hr", title: "People & Talent" },
  { id: "ops", title: "Operations & Logistics" },
  { id: "data", title: "Business Intelligence" },
];

// ── SpotlightCard ──────────────────────────────────────────────────────────────
interface CardProps {
  card: MarketCard;
  index: number;
}

function SpotlightCard({ card, index }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, ${C.glowSpot} 0%, rgba(126,195,226,0.012) 50%, transparent 72%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.background = "transparent";
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay: index * 0.35, ease: EASE }}
      style={{
        flex: 1,
        minHeight: 0,
        transition: `border-color 0.35s ease, background-color 0.35s ease`,
        position: "relative",
        backgroundColor: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "default",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div ref={spotRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", transition: "background 0.5s ease", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: `linear-gradient(90deg, transparent, ${C.accent}18, transparent)`, zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 1, padding: "clamp(22px, 2.8vw, 36px)", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
        <h3 style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(26px, 2.5vw, 34px)",
          fontWeight: 400,
          color: C.textPrimary,
          letterSpacing: "-0.022em",
          lineHeight: "1.15",
          margin: 0,
        }}>
          {card.title}
        </h3>
      </div>
    </motion.div>
  );
}

// ── CardColumn ─────────────────────────────────────────────────────────────────
interface ColumnProps {
  cards: MarketCard[];
  indices: number[];
}

function CardColumn({ cards, indices }: ColumnProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.2vw, 14px)", height: "100%" }}>
      {cards.map((card, i) => (
        <SpotlightCard key={card.id} card={card} index={indices[i]} />
      ))}
    </div>
  );
}

// ── TargetMarkets ──────────────────────────────────────────────────────────────
export function TargetMarkets() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  const columns = [
    { cards: [MARKET_CARDS[0], MARKET_CARDS[3]], indices: [0, 3] },
    { cards: [MARKET_CARDS[1], MARKET_CARDS[4]], indices: [1, 4] },
    { cards: [MARKET_CARDS[2], MARKET_CARDS[5]], indices: [2, 5] },
  ];

  return (
    <section
      id="target-markets"
      aria-label="Business functions DZen optimizes with AI"
      style={{
        position: "relative",
        backgroundColor: "transparent",
        padding: "clamp(88px, 11vw, 144px) 0",
        overflow: "hidden",
      }}
    >
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

      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(12px, 1.5vw, 24px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: "40px",
            overflow: "hidden",
            boxShadow: C.glassShadow,
            border: "1px solid rgba(126,195,226,0.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: C.glassBg,
              backdropFilter: "blur(80px)",
              WebkitBackdropFilter: "blur(80px)",
              zIndex: 0,
            }}
          />

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

          <div style={{ position: "relative", zIndex: 4, padding: "clamp(56px, 7vw, 96px) clamp(40px, 5vw, 72px)" }}>
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 22 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE }}
              style={{ marginBottom: "clamp(52px, 8vw, 80px)" }}
            >
              <h2 style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(52px, 5vw, 72px)",
                fontWeight: 700,
                color: C.textPrimary,
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
                marginBottom: 0,
                maxWidth: "800px",
              }}>
                Business Functions We Transform
              </h2>
            </motion.div>

            <div
              className="tm-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(10px, 1.4vw, 18px)",
                height: "clamp(360px, 42vh, 480px)",
              }}
            >
              {columns.map((col, ci) => (
                <CardColumn key={ci} cards={col.cards} indices={col.indices} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tm-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            height: auto !important;
          }
        }
        @media (max-width: 600px) {
          .tm-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
