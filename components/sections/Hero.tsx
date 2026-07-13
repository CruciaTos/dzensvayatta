"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { DotField } from "@/components/ui/DotField";

type TextPosition =
  | { preset: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" }
  | {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    preset?: never;
  };

interface HeroProps {
  textPosition?: TextPosition;
  className?: string;
}

const SVAYATTA_EN = "Svayatta";
const SVAYATTA_DEV = "स्वयत्ता";
const TOGGLE_INTERVAL_MS = 10_000;

type HeroDisplayState = "svayatta-en" | "svayatta-dev";
const HERO_STATES: HeroDisplayState[] = ["svayatta-en", "svayatta-dev"];

export function Hero({ className }: HeroProps) {
  const [stateIndex, setStateIndex] = useState(0);
  const displayState = HERO_STATES[stateIndex];
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const id = setInterval(
      () => setStateIndex((prev) => (prev + 1) % HERO_STATES.length),
      TOGGLE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const h1 = headlineRef.current;
    if (!section || !h1) return;

    const updateSize = () => {
      const size = window.getComputedStyle(h1).fontSize;
      section.style.setProperty("--h1-size", size);
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(h1);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Svayatta , intelligent workflow integration"
      className={`min-h-screen flex flex-col items-start justify-center relative overflow-hidden ${className ?? ""}`}
    >
      {/* ── 1. DotField ── */}
      <div className="absolute inset-0 z-20" aria-hidden="true">
        <DotField
          gap={30}
          radius={0.4}
          maxRadius={1}
          proximity={180}
          repelStrength={40}
          spring={0.06}
          damping={0.85}
          dotColor="rgba(178, 213, 229, 0.36)"
          activeColor="#B2D5E5"
        />
      </div>

      {/* ── 2. Text content ── */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 3rem)",
          maxWidth: "860px",
          padding: "2.5rem 2rem",
        }}
      >
        <div className="flex flex-col items-center text-center w-full">
          {/* Eyebrow */}
          <motion.p
            className="font-mono uppercase tracking-[0.22em]"
            style={{
              color: "white",
              fontSize: "clamp(10px, calc(var(--h1-size) * 0.065), 13px)",
              marginBottom: "clamp(1rem, calc(var(--h1-size) * 0.14), 2.5rem)",
            }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            WE BUILD.YOU SCALE
          </motion.p>

          {/* Headline – extra‑wide fixed container to completely eliminate layout shift */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              ref={headlineRef}
              className="font-zaslia m-0 p-0 select-none inline-flex items-center justify-center"
              style={{
                fontSize: "clamp(100px, 25vw, 250px)",
                fontWeight: 500,
                color: "#7ec3e2ff",
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
              aria-label="DZ Svayatta"
            >
              {/* Even wider container – plenty of room for Devanagari at 1.25em */}
              <div
                style={{
                  width: "clamp(500px, 80vw, 1000px)",   // ← increased a lot more
                  height: "1.25em",                       // matches the larger Devanagari size
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={displayState}
                    style={{
                      display: "inline-block",
                      textAlign: "center",
                      verticalAlign: "baseline",
                      fontSize: displayState === "svayatta-dev" ? "1.25em" : "1em",
                      fontWeight: displayState === "svayatta-dev" ? 300 : 500,
                      letterSpacing: displayState === "svayatta-dev" ? "-0.012em" : undefined,
                      lineHeight: 1,
                      fontFamily:
                        displayState === "svayatta-dev"
                          ? "var(--font-devanagari)"
                          : "var(--font-zaslia), sans-serif",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  >
                    {displayState === "svayatta-dev" ? SVAYATTA_DEV : SVAYATTA_EN}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>
          </motion.div>

          {/* Body paragraph */}
          <motion.p
            className="font-sans max-w-[720px] leading-[1.75]"
            style={{
              color: "white",
              fontWeight: 300,
              fontSize: "clamp(14px, calc(var(--h1-size) * 0.095), 18px)",
              marginTop: "clamp(1.5rem, calc(var(--h1-size) * 0.16), 3rem)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            We build the infrastructure behind how your business scales. Systems
            integration, workflow automation, and applied intelligence engineered for
            execution. As every industry adapts to AI, we help you lead instead of
            playing catch up.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex gap-3 flex-wrap justify-center"
            style={{
              marginTop: "clamp(2rem, calc(var(--h1-size) * 0.2), 4rem)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="/discovery"
              className="font-sans tracking-[0.08em] uppercase border transition-colors duration-200 pointer-events-auto"
              style={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.25)",
                backgroundColor: "transparent",
                fontWeight: 400,
                fontSize: "clamp(11px, calc(var(--h1-size) * 0.07), 14px)",
                padding: "clamp(0.5rem, calc(var(--h1-size) * 0.03), 0.85rem) clamp(1rem, calc(var(--h1-size) * 0.065), 1.6rem)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "rgba(255, 255, 255, 0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              }}
            >
              Request a Discovery Call
            </a>
            <a
              href="#services"
              className="font-sans tracking-[0.08em] uppercase transition-colors duration-200 pointer-events-auto"
              style={{
                color: "white",
                backgroundColor: "transparent",
                fontWeight: 400,
                fontSize: "clamp(11px, calc(var(--h1-size) * 0.07), 14px)",
                padding: "clamp(0.5rem, calc(var(--h1-size) * 0.03), 0.85rem) clamp(1rem, calc(var(--h1-size) * 0.065), 1.6rem)",
              }}
            >
              See What We Build →
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── 3. Noise grain ── */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{ opacity: 0.025 }}
        aria-hidden="true"
      />

      {/* ── 4. Top rule ── */}
      <div
        className="absolute left-0 right-0 h-px z-50"
        style={{ top: "64px", backgroundColor: "rgba(178, 213, 229, 0.1)" }}
        aria-hidden="true"
      />

      {/* ── 5. Vertical divider ── */}
      <motion.div
        className="absolute bottom-0 left-12 w-px z-50"
        style={{ height: "80px", backgroundColor: "rgba(178, 213, 229, 0.12)" }}
        aria-hidden="true"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── 6. Scroll indicator ── */}
      <motion.div
        className="absolute bottom-6 left-6 flex items-center gap-[10px] z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        aria-label=""
      >
        <div
          className="w-[5px] h-[5px] rounded-full animate-pulse"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          aria-hidden="true"
        />
        <span
          className="font-mono uppercase"
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "clamp(9px, calc(var(--h1-size) * 0.05), 11px)",
            letterSpacing: "0.16em",
          }}
        />
      </motion.div>
    </section>
  );
}