"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Hero } from "@/components/sections/Hero";
import { TargetMarkets } from "@/components/sections/TargetMarkets";

const SCROLL_DISTANCE_VH = 120;

export function HeroSlideTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    restDelta: 0.0001,
  });

  const heroScale = useTransform(smoothProgress, [0, 0.85], [1, 0.96]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5, 0.85], [1, 0.7, 0]);
  const coverY = useTransform(smoothProgress, [0, 1], ["100vh", "0vh"]);
  const wipeLineOpacity = useTransform(smoothProgress, [0, 0.05, 0.88, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Sticky hero pin */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            height: "100%",
            transformOrigin: "center top",
            willChange: "transform, opacity",
          }}
        >
          <Hero />
        </motion.div>
      </div>

      {/* Scroll spacer — gives scroll room for the transition */}
      <div
        aria-hidden="true"
        style={{
          height: `${SCROLL_DISTANCE_VH}vh`,
          marginTop: `-100vh`,
          pointerEvents: "none",
        }}
      />

      {/* TargetMarkets slides up as a cover panel */}
      <motion.div
        style={{
          translateY: coverY,
          position: "relative",
          zIndex: 2,
          willChange: "transform",
        }}
      >
        {/* Wipe line — leading edge of the slide cover */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1.5px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(126,195,226,0.55) 20%, rgba(178,213,229,0.8) 50%, rgba(126,195,226,0.55) 80%, transparent 100%)",
            opacity: wipeLineOpacity,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        <TargetMarkets />
      </motion.div>
    </div>
  );
}