"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="DZen hero — Intelligent Workflow Integration"
      className="min-h-screen flex flex-col justify-end pt-16 relative overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] hero-grid-bg pointer-events-none"
        aria-hidden="true"
      />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] noise-overlay pointer-events-none"
        aria-hidden="true"
      />

      {/* Horizontal rule below nav */}
      <div
        className="absolute top-[120px] left-0 right-0 h-px bg-border"
        aria-hidden="true"
      />

      {/* Subtle radial glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(143,120,96,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 pb-[100px] max-md:pb-16">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-4 mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-12 h-px bg-accent" aria-hidden="true" />
          <span className="font-mono text-[11px] font-normal tracking-[0.16em] uppercase text-accent">
            DZen — Workflow Intelligence Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-serif text-display-1 font-normal leading-[0.95] tracking-[-0.02em] text-stone-100 mb-12"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Your systems
          <br />
          <em className="not-italic text-stone-400">already know</em>
          <br />
          the answer.
        </motion.h1>

        {/* Sub row */}
        <motion.div
          className="grid grid-cols-[5fr_1fr_4fr] gap-6 items-end border-t border-border pt-10 max-[900px]:grid-cols-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Description */}
          <p className="font-sans text-body-lg font-light text-stone-400 leading-[1.7] max-w-[480px]">
            We integrate AI into the operational fabric of your business — connecting the systems you already run, automating the decisions you already make, and delivering intelligence where it creates measurable value.
          </p>

          {/* Divider */}
          <div className="flex justify-center items-center max-[900px]:hidden" aria-hidden="true">
            <div className="w-px h-20 bg-border-strong" />
          </div>

          {/* CTA column */}
          <div className="flex flex-col gap-6 items-start">
            <div className="flex gap-3 flex-wrap">
              <Button as="a" href="#cta" variant="primary" size="md">
                Request a Discovery Call
              </Button>
              <Button as="a" href="#services" variant="ghost" size="md">
                See What We Build
              </Button>
            </div>

            <div className="flex items-center gap-[10px] text-stone-500" aria-label="Scroll to explore">
              <div
                className="w-[6px] h-[6px] bg-accent animate-pulse-dot"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase">
                Scroll to explore
              </span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}