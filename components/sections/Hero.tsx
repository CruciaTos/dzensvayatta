"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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

export function Hero({ textPosition = { preset: "center" }, className }: HeroProps) {
  const [isDevanagari, setIsDevanagari] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setIsDevanagari((prev) => !prev),
      TOGGLE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      aria-label="DZen hero — Intelligent Workflow Integration"
      className={`min-h-screen flex flex-col items-start justify-center relative overflow-hidden ${className ?? ""}`}
      style={{ backgroundColor: "#010b13" }}
    >
      {/* ── 1. Background video (behind everything) ────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        style={{
          objectPosition: "center 30%",
          transform: "scaleX(1.15)",
          transformOrigin: "center",
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ── 2. Full‑screen glassmorphism blur overlay ────────────────────
           Covers the entire image, giving a uniform frosted look.
           The built‑in gradient keeps the original darkening mood. */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        aria-hidden="true"
        style={{
          backdropFilter: "blur(12px) saturate(130%)",
          WebkitBackdropFilter: "blur(12px) saturate(130%)",
          background:
            "linear-gradient(180deg, rgba(1,11,19,0.4) 0%, rgba(1,11,19,0.65) 60%, rgba(1,11,19,0.9) 100%)",
        }}
      />

      {/* ── 3. DotField (interactive, above the glass) ──────────────────── */}
      <div className="absolute inset-0 z-20" aria-hidden="true">
        <DotField
          gap={60}
          radius={1.7}
          maxRadius={3}
          proximity={180}
          repelStrength={40}
          spring={0.06}
          damping={0.85}
          dotColor="rgba(178, 213, 229, 0.36)"
          activeColor="#B2D5E5"
        />
      </div>

      {/* ── 4. Text content (on top of everything, no background) ──────── */}
      <div
        className="absolute z-30"
        style={{
          top: "50%",
          left: "1.5rem",
          transform: "translateY(-50%)",
          width: "calc(100% - 3rem)",
          maxWidth: "860px",
          padding: "2.5rem 2rem",
        }}
      >
        <div className="flex flex-col items-start text-left w-full">
          {/* Eyebrow (decorative spacing placeholder) */}
          <motion.p
            className="font-mono uppercase tracking-[0.22em] text-[11px] mb-10"
            style={{ color: "white", letterSpacing: "0.22em" }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-zaslia m-0 p-0 leading-none select-none"
              style={{
                fontSize: "clamp(72px, 15vw, 192px)",
                fontWeight: 500,
                color: "#7ec3e2ff",
                letterSpacing: "-0.025em",
                lineHeight: 0.95,
              }}
              aria-label="DZEN Svayatta"
            >
              {"DZEN "}
              <span
                style={{
                  display: "inline-block",
                  minWidth: "4.8em",
                  textAlign: "left",
                  verticalAlign: "baseline",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isDevanagari ? "svayatta-dev" : "svayatta-en"}
                    className={isDevanagari ? "font-devanagari" : "font-zaslia"}
                    style={{
                      display: "inline-block",
                      verticalAlign: "baseline",
                      fontSize: isDevanagari ? "0.9em" : "1em",
                      fontWeight: isDevanagari ? 300 : 500,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  >
                    {isDevanagari ? SVAYATTA_DEV : SVAYATTA_EN}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          {/* Body paragraph */}
          <motion.p
            className="font-sans mt-10 max-w-[560px] leading-[1.75]"
            style={{
              fontSize: "17px",
              fontWeight: 300,
              color: "white",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            We integrate AI into the operational fabric of your business — connecting the systems you
            already run, automating the decisions you already make, and delivering intelligence where
            it creates measurable value.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex gap-3 mt-12 flex-wrap justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#cta"
              className="font-sans text-[13px] tracking-[0.08em] uppercase px-6 py-3 border transition-colors duration-200"
              style={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.25)",
                backgroundColor: "transparent",
                fontWeight: 400,
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
              className="font-sans text-[13px] tracking-[0.08em] uppercase px-6 py-3 transition-colors duration-200"
              style={{
                color: "white",
                backgroundColor: "transparent",
                fontWeight: 400,
              }}
            >
              See What We Build →
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── 5. Subtle noise grain (above everything, very low opacity) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{ opacity: 0.025 }}
        aria-hidden="true"
      />

      {/* ── 6. Top horizontal rule ──────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 h-px z-50"
        style={{ top: "64px", backgroundColor: "rgba(178, 213, 229, 0.1)" }}
        aria-hidden="true"
      />

      {/* ── 7. Vertical divider (bottom left) ──────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-12 w-px z-50"
        style={{ height: "80px", backgroundColor: "rgba(178, 213, 229, 0.12)" }}
        aria-hidden="true"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── 8. Scroll indicator (bottom left) ──────────────────────────── */}
      <motion.div
        className="absolute bottom-6 left-6 flex items-center gap-[10px] z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        aria-label="Scroll to explore"
      >
        <div
          className="w-[5px] h-[5px] rounded-full animate-pulse"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          aria-hidden="true"
        />
        <span
          className="font-mono text-[10px] tracking-[0.16em] uppercase"
          style={{ color: "rgba(255, 255, 255, 0.4)" }}
        >
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
}