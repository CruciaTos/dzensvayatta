"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

const PRINCIPLES = [
  {
    num: "I",
    title: "We don't replace your systems.",
    body: "The systems you've invested in — your ERP, your CRM, your finance stack — are not the problem. The gaps between them are. We build the intelligence layer that makes them work as one.",
  },
  {
    num: "II",
    title: "We scope everything before we build anything.",
    body: "Every engagement begins with a fixed-scope discovery. You get a documented integration map, a business-case model, and a clear technical plan — before a single line of production code is written.",
  },
  {
    num: "III",
    title: "Every decision is auditable.",
    body: "AI operating in mission-critical workflows requires the same governance standards as the workflows themselves. Every automated action is logged, attributable, and reversible. No black boxes.",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Our founding principles"
      className="py-[120px] bg-bg-secondary border-t border-border"
    >
      <Container>
        <FadeIn>
          <SectionIndex number="07" tag="Our Philosophy" className="mb-6" />
          <h2 className="font-serif text-display-3 font-normal text-stone-100 max-w-[560px]">
            How we think about this work.
          </h2>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-3 gap-[2px] mt-20 max-[900px]:grid-cols-1"
          staggerDelay={0.1}
          initialDelay={0.1}
        >
          {PRINCIPLES.map((p) => (
            <StaggerItem key={p.num}>
              <motion.article
                className="bg-bg-panel border border-border p-12 px-10 flex flex-col gap-8 transition-colors duration-300"
                whileHover={{ borderColor: "rgba(216,211,203,0.16)" }}
              >
                <span className="font-serif text-[48px] font-normal text-stone-600 leading-none tracking-[-0.02em]">
                  {p.num}
                </span>
                <div>
                  <h3 className="font-serif text-[20px] font-normal text-stone-100 leading-[1.3] tracking-[-0.01em] mb-4">
                    {p.title}
                  </h3>
                  <p className="font-sans text-[14px] font-light text-stone-400 leading-[1.7]">
                    {p.body}
                  </p>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}