"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SERVICES } from "@/lib/data";
import type { Service } from "@/types";

function ServiceItem({ num, title, description, scope, duration }: Service) {
  return (
    <motion.article
      className="grid grid-cols-[auto_1fr_auto] items-start gap-6 py-10 border-b border-border relative cursor-default"
      initial={false}
      whileHover={{ paddingLeft: 16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-mono text-[10px] tracking-[0.1em] text-stone-500 pt-1 flex-shrink-0">
        {num}
      </span>

      <div>
        <h3 className="font-serif text-[24px] font-normal text-stone-100 mb-3 tracking-[-0.01em]">
          {title}
        </h3>
        <p className="font-sans text-[14px] font-light text-stone-400 leading-[1.7] max-w-[560px]">
          {description}
        </p>
        <div className="mt-4 flex gap-4 flex-wrap">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone-500">
            Scope: {scope}
          </span>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone-500">
            Duration: {duration}
          </span>
        </div>
      </div>

      <motion.div
        className="pt-1 text-stone-500"
        whileHover={{ color: "#8F7860", x: 4, y: -4 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <ArrowUpRight />
      </motion.div>
    </motion.article>
  );
}

export function Services() {
  return (
    <section
      id="services"
      aria-label="Services and capabilities"
      className="py-[120px] bg-bg-primary border-t border-border"
    >
      <Container>
        <div className="grid grid-cols-[4fr_8fr] gap-20 items-start max-[900px]:grid-cols-1">
          {/* Sticky sidebar */}
          <FadeIn className="sticky top-[100px] max-[900px]:static">
            <SectionIndex number="03" tag="Capabilities" className="mb-6" />
            <h2 className="font-serif text-display-3 font-normal text-stone-100 mb-8">
              What we deliver.
            </h2>
            <p className="font-sans text-body font-light text-stone-400 leading-[1.7] mb-12">
              Six structured practice areas. Each one a discrete engagement model with defined scope, deliverables, and success criteria. No open-ended retainers. No ambiguous project scope.
            </p>
            <Button as="a" href="/discovery" variant="primary" size="md">
              Discuss your requirements →
            </Button>
          </FadeIn>

          {/* Services list */}
          <StaggerContainer className="border-t border-border" staggerDelay={0.08}>
            {SERVICES.map((service) => (
              <StaggerItem key={service.num}>
                <ServiceItem {...service} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
}
