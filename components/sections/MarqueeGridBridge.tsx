"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────
// MarqueeGridBridge
//
// Sits between <IntegrationMarquee /> and <TargetMarkets />.
// As the user scrolls through it, the marquee's circular logo row settles
// and dissolves while a 3-column grid skeleton — matching TargetMarkets'
// exact column structure — fades in underneath it. By the time the user
// reaches TargetMarkets, the grid already feels like it was always there;
// the cards just fade up inside a structure the marquee quietly revealed.
// ─────────────────────────────────────────────────────────────────────────

const C = {
  accent: "#7EC3E2",
  cardBg: "rgba(255,255,255,0.02)",
  cardBorder: "rgba(178,213,229,0.10)",
  cardBorderHi: "rgba(126,195,226,0.28)",
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

// Mirrors the 6 TargetMarkets cards' column placement (3 cols x 2 rows)
// just enough to suggest the grid that's about to appear.
const GHOST_CELLS = Array.from({ length: 6 });

export function MarqueeGridBridge() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Marquee settles: scales down slightly and fades as we scroll through.
  const marqueeOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const marqueeScale = useTransform(scrollYProgress, [0.1, 0.6], [1, 0.94]);
  const marqueeBlur = useTransform(scrollYProgress, [0.3, 0.6], [0, 6]);
  const marqueeFilter = useTransform(marqueeBlur, (v) => `blur(${v}px)`);

  // Ghost grid: drawn in underneath, as if it had been there all along.
  const gridOpacity = useTransform(scrollYProgress, [0.25, 0.55, 0.85, 1], [0, 1, 1, 0]);
  const gridScale = useTransform(scrollYProgress, [0.25, 0.55], [0.985, 1]);

  // Connecting vertical thread that draws downward, visually stitching
  // the marquee row to the grid above it.
  const threadHeight = useTransform(scrollYProgress, [0.15, 0.55], ["0%", "100%"]);
  const threadOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.7, 0.9], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative overflow-hidden"
      style={{ height: "clamp(280px, 38vh, 420px)" }}
    >
      {/* ── Connecting thread ── */}
      <motion.div
        className="absolute left-1/2 top-0 w-px -translate-x-1/2"
        style={{
          height: threadHeight,
          opacity: threadOpacity,
          background: `linear-gradient(to bottom, transparent, ${C.accent}55, transparent)`,
        }}
      />

      {/* ── Settling marquee echo (a faded row of dots standing in for
           the logo row above, giving the eye something to release) ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: marqueeOpacity, scale: marqueeScale, filter: marqueeFilter }}
      >
        <div className="flex items-center gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: i === 4 ? 14 : 8,
                height: i === 4 ? 14 : 8,
                background:
                  i === 4 ? C.accent : "rgba(178,213,229,0.28)",
                boxShadow: i === 4 ? `0 0 18px ${C.accent}66` : "none",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Ghost grid — same 3-column structure as TargetMarkets ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{ opacity: gridOpacity, scale: gridScale }}
      >
        <div
          className="grid w-full max-w-[1200px]"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(10px, 1.4vw, 18px)",
          }}
        >
          {GHOST_CELLS.map((_, i) => {
            // Center cell (the one beneath the "anchor" dot) reads as the
            // seam where the marquee handed off — slightly brighter.
            const isSeam = i === 1;
            return (
              <motion.div
                key={i}
                initial={false}
                style={{
                  height: "clamp(64px, 9vw, 96px)",
                  border: `1px solid ${isSeam ? C.cardBorderHi : C.cardBorder}`,
                  background: C.cardBg,
                  transition: `border-color 0.6s ${EASE.join(",")}`,
                }}
              />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}