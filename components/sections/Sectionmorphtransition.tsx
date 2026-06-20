"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS — match CaseStudies card surface exactly
───────────────────────────────────────────────────────────────────────────── */
const DARK = "#0d0d0c";          // cardBg from CaseStudies
const BLUE_DIM = "rgba(178,213,229,0.07)";
const BLUE_BRIGHT = "rgba(126,195,226,0.68)";
const AMBER_DIM = "rgba(143,120,96,0.08)";
const SPRING = { stiffness: 50, damping: 16, restDelta: 0.0001 };

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED ATOMS
───────────────────────────────────────────────────────────────────────────── */

/** Faint 80px grid that bridges section boundaries */
function GridLines({ p }: { p: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `
          linear-gradient(${BLUE_DIM} 1px, transparent 1px),
          linear-gradient(90deg, ${BLUE_DIM} 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        opacity: useTransform(p, [0.03, 0.13, 0.73, 0.88], [0, 0.55, 0.55, 0]),
      }}
    />
  );
}

/** Single horizontal light-beam that sweeps across the seam */
function WipeLine({ p }: { p: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 1,
        pointerEvents: "none",
        background: `linear-gradient(90deg,
          transparent,
          ${BLUE_BRIGHT} 20%,
          rgba(178,213,229,0.88) 50%,
          ${BLUE_BRIGHT} 80%,
          transparent
        )`,
        opacity: useTransform(p, [0.08, 0.17, 0.70, 0.81], [0, 1, 1, 0]),
        scaleX: useTransform(p, [0.06, 0.21], [0, 1]),
        transformOrigin: "left",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANT A — CARD EXPAND  (Cases → Founding)

   Four dark rectangles positioned to echo the CaseStudies marquee grid.
   Each one expands staggered across the sticky 100 vh window, then a
   solid plate fades in as they merge — becoming the Founding bg.
───────────────────────────────────────────────────────────────────────────── */

interface CardDef { l: number; t: number; w: number; h: number }

/** Matches the card proportions visible in the CaseStudies marquee (4 up) */
const CARD_DEFS: CardDef[] = [
  { l: 0, t: 8, w: 25, h: 84 },
  { l: 25, t: 4, w: 25, h: 92 },
  { l: 50, t: 8, w: 25, h: 84 },
  { l: 75, t: 4, w: 25, h: 92 },
];

function ExpandCard({
  d,
  i,
  p,
}: {
  d: CardDef;
  i: number;
  p: MotionValue<number>;
}) {
  /* Left-to-right stagger: each card begins 40 ms later in scroll-space */
  const off = i * 0.042;
  const S = 0.27 + off;   // expansion start
  const E = S + 0.27;     // expansion end (each card ≈ 0.27 of progress)

  return (
    <motion.div
      style={{
        position: "absolute",
        left: useTransform(p, [S, E], [`${d.l}%`, "0%"]),
        top: useTransform(p, [S, E], [`${d.t}%`, "0%"]),
        width: useTransform(p, [S, E], [`${d.w}%`, "100%"]),
        height: useTransform(p, [S, E], [`${d.h}%`, "100%"]),
        backgroundColor: DARK,
        opacity: useTransform(p, [0.13, 0.23, 0.79, 0.93], [0, 1, 1, 0]),
        willChange: "left, top, width, height",
      }}
    >
      {/* Card border — dissolves as siblings merge */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          border: "1px solid rgba(178,213,229,0.10)",
          opacity: useTransform(p, [0.23, 0.50, 0.65], [1, 0.35, 0]),
        }}
      />
      {/* Dot-grid texture — fades out mid-expansion */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle, rgba(178,213,229,0.17) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: useTransform(p, [0.23, 0.47], [0.65, 0]),
        }}
      />
    </motion.div>
  );
}

function CardExpandOverlay({ p }: { p: MotionValue<number> }) {
  return (
    <>
      {CARD_DEFS.map((d, i) => (
        <ExpandCard key={i} d={d} i={i} p={p} />
      ))}

      {/* Merge plate — solid dark surface that takes over after expansion */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: DARK,
          pointerEvents: "none",
          opacity: useTransform(p, [0.57, 0.83], [0, 1]),
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANT B — GRID MORPH  (Founding → Capabilities)

   The warm amber grid of the Founding section cross-fades into the cooler
   blue grid of Capabilities. Three horizontal scan-lines mark the structural
   shift — referencing the 6-phase layout that follows.
───────────────────────────────────────────────────────────────────────────── */

function GridMorphOverlay({ p }: { p: MotionValue<number> }) {
  const op = useTransform(p, [0.10, 0.22, 0.70, 0.86], [0, 0.7, 0.7, 0]);

  return (
    <>
      {/* Amber grid — outgoing Founding tone */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(${AMBER_DIM} 1px, transparent 1px),
            linear-gradient(90deg, ${AMBER_DIM} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: op,
        }}
      />

      {/* Three structural scan-lines at phase positions */}
      {[22, 50, 78].map((y) => (
        <motion.div
          key={y}
          aria-hidden
          style={{
            position: "absolute",
            top: `${y}%`,
            left: 0,
            right: 0,
            height: 1,
            pointerEvents: "none",
            background: `linear-gradient(90deg,
              transparent,
              rgba(143,120,96,0.32) 30%,
              rgba(178,213,229,0.38) 50%,
              rgba(143,120,96,0.32) 70%,
              transparent
            )`,
            opacity: useTransform(p, [0.18, 0.30, 0.64, 0.80], [0, 0.9, 0.9, 0]),
            scaleX: useTransform(p, [0.14, 0.33], [0, 1]),
            transformOrigin: "center",
          }}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANT C — MARQUEE MORPH  (Integration → Target Markets)

   Six circles (echoing logo-ring proportions) morph from roundness into
   the rectangular card shapes of the Target Markets grid.
───────────────────────────────────────────────────────────────────────────── */

function MarqueeMorphOverlay({ p }: { p: MotionValue<number> }) {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((i + 0.5) / 6) * 100;
        return (
          <motion.div
            key={i}
            aria-hidden
            style={{
              position: "absolute",
              left: `${x}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              width: useTransform(p, [0.14, 0.60], ["44px", "26%"]),
              height: useTransform(p, [0.14, 0.60], ["44px", "70%"]),
              borderRadius: useTransform(p, [0.14, 0.54], ["50%", "0%"]),
              border: "1px solid rgba(178,213,229,0.12)",
              opacity: useTransform(
                p,
                [0.08, 0.18, 0.74, 0.88],
                [0, 0.55, 0.55, 0]
              ),
              backgroundColor: "rgba(178,213,229,0.016)",
            }}
          />
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT — SectionBridge
   Place directly between any two sections. Variant controls the animation.

   card-expand (180 vh):
     Sticky child (100 vh) pins for 80 vh of scroll. The remaining 80 vh
     are filled with a solid dark div so the video BG never shows through
     as the bridge scrolls past. FoundingPrinciples appears seamlessly
     below the dark fill — same color as the merge plate.

   grid-morph / marquee-morph / fade (55-28 vh):
     No sticky — absolute positioning. Animation plays during the short
     viewport crossing. Keeps extra scroll space to a minimum.
───────────────────────────────────────────────────────────────────────────── */

export type SectionBridgeVariant =
  | "card-expand"
  | "grid-morph"
  | "marquee-morph"
  | "fade";

interface SectionBridgeProps {
  variant?: SectionBridgeVariant;
  /** Override bridge height in vh (defaults per variant). */
  scrollHeight?: number;
}

export function SectionBridge({
  variant = "fade",
  scrollHeight,
}: SectionBridgeProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const p = useSpring(scrollYProgress, SPRING);

  const h =
    scrollHeight ??
    (variant === "card-expand"
      ? 180
      : variant === "grid-morph"
        ? 60
        : variant === "marquee-morph"
          ? 55
          : 28);

  const isCardExpand = variant === "card-expand";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "relative",
        height: `${h}vh`,
        overflow: "hidden",
        pointerEvents: "none",
        /* Always transparent: the merge plate + dark fill establish full
           opaque coverage on their own schedule. Forcing this opaque from
           frame one hid the GlobalVideoBackground the cards are meant to
           grow over, making the whole reveal invisible. */
        backgroundColor: "transparent",
      }}
    >
      {/* ── Dark fill (card-expand only) — rendered FIRST so it sits
          BEHIND the sticky overlay in paint order. It occupies the scroll
          space below the sticky child. Without the lower stacking order,
          this (being a later sibling) painted ON TOP of the sticky overlay
          and visibly clipped the bottom of the card animation throughout
          the entire pin, well before the cards had finished merging.
      ─────────────────────────────────────────────────────────────────── */}
      {isCardExpand && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${h - 100}vh`,   /* 180 - 100 = 80 vh fill */
            backgroundColor: DARK,
            zIndex: 0,
          }}
        >
          {/* Soft vignette at fill top so fill↔sticky join is imperceptible */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 120,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* ── Animated overlay ────────────────────────────────────────────── */}
      <div
        style={
          isCardExpand
            ? {
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "hidden",
              zIndex: 1, // stay above the dark fill for the whole pin
            }
            : {
              position: "absolute",
              inset: 0,
            }
        }
      >
        <GridLines p={p} />

        {isCardExpand && <CardExpandOverlay p={p} />}
        {variant === "grid-morph" && <GridMorphOverlay p={p} />}
        {variant === "marquee-morph" && <MarqueeMorphOverlay p={p} />}

        <WipeLine p={p} />
      </div>
    </div>
  );
}