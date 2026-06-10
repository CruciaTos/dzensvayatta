"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { IntegrationLogoMarquee } from "@/components/sections/IntegrationMarquee";
import {
  RectGridIcon,
  ClockCircleIcon,
  EnvelopeIcon,
  BarChartIcon,
  LineChartIcon,
  LayersIcon,
} from "@/components/ui/Icons";
import { SYSTEM_CATEGORIES } from "@/lib/data";
import type { SystemCategory } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "rect-grid":   RectGridIcon,
  "clock-circle": ClockCircleIcon,
  "envelope":    EnvelopeIcon,
  "bar-chart":   BarChartIcon,
  "line-chart":  LineChartIcon,
  "layers":      LayersIcon,
};

function SystemCategoryCard({ icon, name, items }: SystemCategory) {
  const Icon = ICON_MAP[icon] ?? RectGridIcon;

  return (
    <motion.article
      className="bg-bg-panel border border-border p-10 px-9 transition-colors duration-300 cursor-default"
      whileHover={{ borderColor: "rgba(18,20,22,0.18)", backgroundColor: "#E6DAC9" }}
    >
      <div className="w-9 h-9 flex items-center justify-center border border-border-strong text-accent mb-6">
        <Icon />
      </div>

      <h3 className="font-sans text-[16px] font-normal text-stone-100 mb-4 tracking-[-0.01em]">
        {name}
      </h3>

      <ul className="flex flex-col gap-2 list-none" role="list">
        {items.map((item) => (
          <li
            key={item}
            className="font-sans text-[13px] font-light text-stone-400 flex items-center gap-[10px]"
          >
            <span
              className="w-[3px] h-[3px] bg-stone-500 flex-shrink-0 inline-block"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Systems() {
  return (
    <section
      id="systems"
      aria-label="Systems we integrate"
      className="py-[120px] bg-bg-primary border-t border-border"
    >
      <Container>
        {/* Header */}
        <FadeIn className="mb-12">
          <SectionIndex number="05" tag="Integration Catalogue" className="mb-6" />
          <div className="flex items-end justify-between gap-12 max-md:flex-col">
            <h2 className="font-serif text-display-3 font-normal text-stone-100">
              Systems we connect.
            </h2>
          </div>
          
        </FadeIn>

        <div className="mb-20">
          <IntegrationLogoMarquee maxWidth={1200} fade={30} />
        </div>

        {/* Systems grid */}
        <StaggerContainer
          className="grid grid-cols-3 gap-[2px] max-[900px]:grid-cols-2 max-[480px]:grid-cols-1"
          staggerDelay={0.08}
        >
          {SYSTEM_CATEGORIES.map((cat) => (
            <StaggerItem key={cat.name}>
              <SystemCategoryCard {...cat} />
            </StaggerItem>
          ))}
        </StaggerContainer>
        
      </Container>
    </section>
  );
}
