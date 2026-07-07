"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import {
  ShieldIcon,
  ClockIcon,
  ArrowIcon,
  LockIcon,
  ChatIcon,
  MonitorIcon,
} from "@/components/ui/Icons";
import { SECURITY_PILLARS, SECURITY_COMPLIANCE_BADGES } from "@/lib/data";
import type { SecurityPillar } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield:  ShieldIcon,
  clock:   ClockIcon,
  arrow:   ArrowIcon,
  lock:    LockIcon,
  chat:    ChatIcon,
  monitor: MonitorIcon,
};

function Pillar({ icon, title, description, badge }: SecurityPillar) {
  const Icon = ICON_MAP[icon] ?? ShieldIcon;
  return (
    <motion.article
      className="bg-bg-panel border border-border p-8 px-9 grid grid-cols-[auto_1fr_auto] gap-6 items-start transition-colors duration-300"
      whileHover={{
        borderColor: "rgba(216,211,203,0.16)",
        backgroundColor: "#1E2024",
      }}
    >
      <div className="w-8 h-8 flex items-center justify-center border border-border-strong text-accent flex-shrink-0">
        <Icon />
      </div>

      <div>
        <h3 className="font-sans text-[15px] font-normal text-stone-100 mb-2 tracking-[-0.01em]">
          {title}
        </h3>
        <p className="font-sans text-[13px] font-light text-stone-400 leading-[1.6]">
          {description}
        </p>
      </div>

      <Badge variant="accent" className="flex-shrink-0 h-fit">
        {badge}
      </Badge>
    </motion.article>
  );
}

export function Security() {
  return (
    <section
      id="security"
      aria-label="Security and governance"
      className="py-[120px] bg-bg-primary border-t border-border"
    >
      <Container>
        <div className="grid grid-cols-[5fr_7fr] gap-[120px] items-start max-[900px]:grid-cols-1 max-[900px]:gap-16">
          {/* Statement column */}
          <FadeIn className="sticky top-[100px] max-[900px]:static">
            <SectionIndex number="08" tag="Security" className="mb-8" />

            <p className="font-serif text-[clamp(24px,2.5vw,34px)] font-normal text-stone-100 leading-[1.25] tracking-[-0.015em] mb-8">
              AI operating in mission-critical workflows requires a governance model as rigorous as the workflows themselves.
            </p>

            <p className="font-sans text-[14px] font-light text-stone-400 leading-[1.7]">
              We build every integration with enterprise security standards as a baseline, not an afterthought. Every automated decision is auditable, every access point is controlled, and every deployment is reversible.
            </p>

            <div className="mt-12 flex flex-wrap gap-[10px]" role="list" aria-label="Compliance certifications">
              {SECURITY_COMPLIANCE_BADGES.map((badge) => (
                <Badge key={badge} variant="muted">
                  {badge}
                </Badge>
              ))}
            </div>
          </FadeIn>

          {/* Pillars column */}
          <StaggerContainer className="flex flex-col gap-[2px]" staggerDelay={0.07}>
            {SECURITY_PILLARS.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Pillar {...pillar} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
}
