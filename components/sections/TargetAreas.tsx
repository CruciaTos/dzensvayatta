"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── Design tokens ──────────────────────────────────────────────────────────────
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
  glassHighlight: "rgba(255, 255, 255, 1)",
  glassBorder: "rgba(178,213,229,0.15)",
  glassShadow: "0 12px 40px rgba(0,0,0,0.2)",
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const TRANSITION = `0.42s cubic-bezier(0.22,1,0.36,1)`;

// ── Data ───────────────────────────────────────────────────────────────────────
interface TargetArea {
  id: string;
  title: string;
  description: string;
  painPoints: string[];
}

const TARGET_AREAS: TargetArea[] = [
  {
    id: "agentic",
    title: "Agentic AI Systems",
    description:
      "AI agents that take on real tasks across your tools and workflows, with clear handoffs when a human needs to step in.",
    painPoints: [
      "Multi-Agent Orchestration",
      "Enterprise Tool Integration",
      "Continuous Learning Loops",
      "ROI-Driven Automation",
    ],
  },
  {
    id: "ml-analytics",
    title: "Machine Learning & Analytics",
    description:
      "Models and reporting built on your data so your team can see what is happening and respond before small issues grow.",
    painPoints: [
      "Predictive Modeling & Forecasting",
      "NLP & Document Intelligence",
      "Anomaly Detection & Risk Signals",
      "Executive Dashboards ",
    ],
  },
  {
    id: "app-build",
    title: "Custom Applications",
    description:
      "Internal tools and customer-facing products, scoped, built, and maintained so they hold up after launch day.",
    painPoints: [
      "Full-Stack Product Engineering",
      "API-First Architecture",
      "Cloud-Native Deployment",
      "QA Automation & CI/CD Pipelines",
    ],
  },
  {
    id: "chatbot",
    title: "Conversational AI",
    description:
      "Chat and voice assistants for support, booking, and common questions, connected to the systems your team already runs.",
    painPoints: [
      "24/7 Intelligent Support Automation",
      "Natural Language Understanding",
      "CRM & Scheduling Integration",
      "Omnichannel Deployment",
    ],
  },
  {
    id: "website",
    title: "Web & Digital Presence",
    description:
      "Fast sites for portfolios, product pages, and full brand builds that are straightforward to update as you grow.",
    painPoints: [
      "Responsive UX Design",
      "SEO & Core Web Vitals",
      "Headless CMS Implementation",
      "E-Commerce & Payment Integration",
    ],
  },
  {
    id: "media-marketing",
    title: "Content & Growth Marketing",
    description:
      "Video, design, and campaign work shaped by what your audience responds to, not templates pulled off a shelf.",
    painPoints: [
      "Brand Strategy & Positioning",
      "Social & Performance Content",
      "Professional Video Production",
      "Attribution & ROI Analytics",
    ],
  },
];

function getColumnSiblingId(id: string): string | null {
  const pairs: Record<string, string> = {
    agentic: "chatbot",
    chatbot: "agentic",
    "ml-analytics": "website",
    website: "ml-analytics",
    "app-build": "media-marketing",
    "media-marketing": "app-build",
  };
  return pairs[id] ?? null;
}

// ── SpotlightCard ──────────────────────────────────────────────────────────────
interface CardProps {
  area: TargetArea;
  index: number;
  isHovered: boolean;
  isCompressed: boolean;
  onEnter: (id: string) => void;
  onLeave: () => void;
}

function SpotlightCard({ area, index, isHovered, isCompressed, onEnter, onLeave }: CardProps) {
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
    onLeave();
    if (spotRef.current) spotRef.current.style.background = "transparent";
  }, [onLeave]);

  // Unified border + background + top-line feedback
  const isActive = isHovered;
  const borderColor = isActive ? C.cardBorderHover : C.cardBorder;
  const backgroundColor = isActive ? C.cardBgHover : C.cardBg;
  const topLineColor = isActive ? `${C.accent}55` : `${C.accent}18`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onEnter(area.id)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, delay: index * 0.35, ease: EASE }}
      style={{
        flexGrow: isHovered ? 1.36 : isCompressed ? 0.64 : 1,
        flexShrink: 0,
        flexBasis: 0,
        minHeight: 0,
        transition: `flex-grow ${TRANSITION}, border-color 0.35s ease, background-color 0.35s ease`,
        position: "relative",
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "default",
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={spotRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          transition: "background 0.5s ease",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${topLineColor}, transparent)`,
          transition: `background ${TRANSITION}`,
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(28px, 3vw, 40px)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(26px, 2.5vw, 34px)",
            fontWeight: 400,
            color: C.textPrimary,
            letterSpacing: "-0.022em",
            lineHeight: "1.15",
            marginBottom: "14px",
            flexShrink: 0,
          }}
        >
          {area.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            fontWeight: 300,
            color: C.textMuted,
            lineHeight: "1.72",
            margin: 0,
            flexShrink: 0,
          }}
        >
          {area.description}
        </p>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              key={`expand-${area.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              style={{
                marginTop: "20px",
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: "1px",
                  backgroundColor: C.divider,
                  marginBottom: "14px",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, overflow: "hidden" }}>
                {area.painPoints.map((point, i) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: 0.05 + i * 0.06,
                      ease: EASE,
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "6px 0",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: C.accent,
                        flexShrink: 0,
                        opacity: 0.85,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "14px",
                        letterSpacing: "0.07em",
                        color: "rgba(178,213,229,0.75)",
                        lineHeight: 1,
                      }}
                    >
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCompressed && (
            <motion.div
              key={`compress-${area.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: "auto",
                paddingTop: "8px",
                display: "flex",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: `rgba(178,213,229,${0.12 + i * 0.05})`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── CardColumn ─────────────────────────────────────────────────────────────────
interface ColumnProps {
  areas: TargetArea[];
  indices: number[];
  hoveredId: string | null;
  onEnter: (id: string) => void;
  onLeave: () => void;
}

function CardColumn({ areas, indices, hoveredId, onEnter, onLeave }: ColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(12px, 1.6vw, 20px)",
        height: "100%",
      }}
    >
      {areas.map((area, i) => {
        const siblingId = getColumnSiblingId(area.id);
        const isHovered = hoveredId === area.id;
        const isCompressed = hoveredId !== null && siblingId === hoveredId;
        return (
          <SpotlightCard
            key={area.id}
            area={area}
            index={indices[i]}
            isHovered={isHovered}
            isCompressed={isCompressed}
            onEnter={onEnter}
            onLeave={onLeave}
          />
        );
      })}
    </div>
  );
}

// ── TargetAreas ────────────────────────────────────────────────────────────────
export function TargetAreas() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleEnter = useCallback((id: string) => setHoveredId(id), []);
  const handleLeave = useCallback(() => setHoveredId(null), []);

  const columns = [
    { areas: [TARGET_AREAS[0], TARGET_AREAS[3]], indices: [0, 3] },
    { areas: [TARGET_AREAS[1], TARGET_AREAS[4]], indices: [1, 4] },
    { areas: [TARGET_AREAS[2], TARGET_AREAS[5]], indices: [2, 5] },
  ];

  return (
    <section
      id="target-areas"
      aria-label="Intelligent systems and digital solutions we build"
      style={{
        position: "relative",
        backgroundColor: "transparent",
        padding: "clamp(88px, 11vw, 144px) 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(178,213,229,0.10)",
      }}
    >
      {/* background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "420px",
          background:
            "radial-gradient(ellipse at center top, rgba(126,195,226,0.045) 0%, transparent 62%)",
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
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
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

          <div
            style={{
              position: "relative",
              zIndex: 4,
              padding: "clamp(56px, 7vw, 96px) clamp(40px, 5vw, 72px)",
            }}
          >
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 22 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE }}
              style={{ marginBottom: "clamp(52px, 8vw, 80px)" }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(52px, 5vw, 72px)",
                  fontWeight: 700,
                  color: C.textPrimary,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.1",
                  marginBottom: 0,
                  maxWidth: "800px",
                }}
              >
                Our Expertise
              </h2>
            </motion.div>

            <div
              className="ta-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(12px, 1.6vw, 20px)",
                height: "clamp(600px, 66vh, 780px)",
              }}
            >
              {columns.map((col, ci) => (
                <CardColumn
                  key={ci}
                  areas={col.areas}
                  indices={col.indices}
                  hoveredId={hoveredId}
                  onEnter={handleEnter}
                  onLeave={handleLeave}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ta-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            height: auto !important;
          }
        }
        @media (max-width: 600px) {
          .ta-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
        }
      `}</style>
    </section>
  );
}