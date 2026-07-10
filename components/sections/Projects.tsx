"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  textFaint: "rgba(178,213,229,0.35)",
  divider: "rgba(178,213,229,0.10)",
  hairline: "rgba(178,213,229,0.18)",
  chipBg: "rgba(126,195,226,0.08)",
  chipBorder: "rgba(178,213,229,0.16)",
  markBg: "rgba(126,195,226,0.10)",
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function Projects() {
  const reduce = useReducedMotion();

  return (
    <section
      id="projects"
      aria-label="Our projects"
      className="py-20 sm:py-28 relative bg-black/50"
      style={{ borderTop: `1px solid ${C.divider}` }}
    >
      <Container>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center text-center"
        >
          <h2
            className="font-sans text-[clamp(52px,5vw,72px)] font-bold tracking-[-0.02em] mb-[90px]"
            style={{ color: C.textPrimary }}
          >
            Our Projects
          </h2>

          {/* Placeholder – replace with project cards, grid, etc. */}
          <p
            className="font-sans text-[20px] max-w-2xl"
            style={{ color: C.textMuted }}
          >
            A showcase of our work and success stories. Coming soon.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}