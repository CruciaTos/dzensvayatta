"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { PROCESS_STEPS } from "@/lib/data";
import type { ProcessStep } from "@/types";

function Step({ index, title, description, duration }: ProcessStep) {
  return (
    <motion.article
      className="p-10 px-8 pb-12 border-r border-b border-border relative transition-colors duration-300 cursor-default hover:bg-bg-panel"
      whileHover={{ backgroundColor: "#F7F1E8" }}
    >
      <div className="font-mono text-[32px] font-light text-stone-500 leading-none tracking-[-0.02em] mb-10">
        {index}
      </div>

      <h3 className="font-serif text-[22px] font-normal text-stone-100 mb-4 tracking-[-0.01em]">
        {title}
      </h3>

      <p className="font-sans text-[13px] font-light text-stone-400 leading-[1.7]">
        {description}
      </p>

      <span className="absolute bottom-6 right-6 font-mono text-[9px] tracking-[0.12em] uppercase text-stone-500">
        {duration}
      </span>
    </motion.article>
  );
}

export function Process() {
  return (
    <section
      id="process"
      aria-label="Engagement methodology"
      className="py-[120px] bg-bg-secondary border-t border-border"
    >
      <Container>
        <FadeIn>
          <SectionIndex number="06" tag="Engagement Model" className="mb-6" />
          <h2 className="font-serif text-display-3 font-normal text-stone-100 max-w-[640px]">
            A methodology built for
            <br />
            operational environments.
          </h2>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-5 border-t border-l border-border mt-20 max-[1100px]:grid-cols-3 max-[700px]:grid-cols-2"
          staggerDelay={0.08}
          initialDelay={0.1}
        >
          {PROCESS_STEPS.map((step) => (
            <StaggerItem key={step.index}>
              <Step {...step} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
