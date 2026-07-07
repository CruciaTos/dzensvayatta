"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  textFaint: "rgba(178,213,229,0.4)",
  divider: "rgba(178,213,229,0.10)",
} as const;

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgTextY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      id="cta"
      ref={sectionRef}
      aria-label="Get started"
      className="py-24 sm:py-32 relative overflow-hidden bg-black/50"
      style={{ borderTop: `1px solid ${C.divider}` }}
    >
      <motion.div
        style={{ y: bgTextY }}
        className="absolute bottom-[-20px] right-[-20px] font-zaslia text-[clamp(100px,14vw,220px)] font-normal leading-none tracking-[-0.04em] pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <span style={{ color: "rgba(126,195,226,0.06)" }}>DZen</span>
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(126,195,226,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <FadeIn>
          <div className="max-w-[800px]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-px" style={{ backgroundColor: C.accent }} aria-hidden="true" />
              <span
                className="font-mono text-[10px] tracking-[0.16em] uppercase"
                style={{ color: C.accent }}
              >
                Start with a conversation
              </span>
            </div>

            <h2
              className="font-sans text-[clamp(40px,5.5vw,72px)] font-bold leading-[1.05] tracking-[-0.025em] mb-8"
              style={{ color: C.textPrimary }}
            >
              Ready to see what
              <br />
              <span style={{ color: C.accentSoft }}>we&apos;d build for you?</span>
            </h2>

            <p
              className="font-sans text-[17px] font-light leading-[1.7] max-w-[540px] mb-12"
              style={{ color: C.textMuted }}
            >
              Book a 45-minute discovery call. We&apos;ll walk through your current setup,
              point out the biggest wins, and tell you plainly what we&apos;d tackle first.
              No pressure to move forward.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/discovery"
                className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase px-7 py-[15px] border transition-colors duration-300 no-underline"
                style={{
                  color: C.textPrimary,
                  borderColor: "rgba(178,213,229,0.25)",
                  backgroundColor: "rgba(126,195,226,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = C.accent;
                  e.currentTarget.style.color = "#00080e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(126,195,226,0.08)";
                  e.currentTarget.style.color = C.textPrimary;
                }}
              >
                Schedule a discovery call
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Link>

              <Link
                href="#capabilities"
                className="font-mono text-[11px] tracking-[0.12em] uppercase px-2 py-[15px] transition-colors duration-200 no-underline"
                style={{ color: C.textFaint }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.accentSoft)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.textFaint)}
              >
                See how we work →
              </Link>
            </div>

            <p
              className="font-mono text-[10px] tracking-[0.1em] uppercase mt-10"
              style={{ color: C.textFaint }}
            >
              Briefings are confidential · NDA available on request
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
