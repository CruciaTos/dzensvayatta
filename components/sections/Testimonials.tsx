"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

// ----------------------------------------------------------------------
// DATA – add, remove, or reorder testimonials at any time.
// ----------------------------------------------------------------------
const TESTIMONIALS = [
  {
    id: "1",
    quote:
      "They didn’t just connect our systems — they gave us a single source of truth that our entire leadership team now trusts. The discovery phase alone saved us months.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "Meridian Logistics",
    avatar: "/avatars/sarah-chen.jpg", // optional – remove the <img> block if you don't have one
  },
  {
    id: "2",
    quote:
      "We went from seven disconnected tools to one unified workflow. The audit trail they built into every automated decision is exactly what our compliance team needed.",
    author: "Marcus Okafor",
    role: "CTO",
    company: "Resonant Health",
    avatar: "/avatars/marcus-okafor.jpg",
  },
];

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------
export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className="py-[120px] bg-bg-secondary border-t border-border"
    >
      <Container>
        {/* Section heading */}
        <FadeIn>
          <SectionIndex number="07" tag="Testimonials" className="mb-6" />
          <h2 className="font-serif text-display-3 font-normal text-stone-100 max-w-[620px]">
            Trusted by teams who run on interconnected systems.
          </h2>
        </FadeIn>

        {/* Cards grid – automatically adjusts to 2 or 3 columns */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] mt-20"
          staggerDelay={0.1}
          initialDelay={0.1}
        >
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.id}>
              <motion.blockquote
                className="group relative bg-bg-panel border border-border p-10 sm:p-12 flex flex-col justify-between gap-8 transition-colors duration-300"
                whileHover={{ borderColor: "rgba(216,211,203,0.16)" }}
              >
                {/* Decorative quote mark */}
                <span className="absolute top-6 right-8 font-serif text-[120px] leading-none text-stone-800 select-none pointer-events-none">
                  &ldquo;
                </span>

                {/* Quote */}
                <p className="relative font-serif text-[16px] sm:text-[18px] font-light text-stone-200 leading-relaxed">
                  {t.quote}
                </p>

                {/* Author */}
                <footer className="flex items-center gap-4 mt-auto">
                  {t.avatar && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-stone-800 overflow-hidden">
                      <img
                        src={t.avatar}
                        alt={t.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <cite className="block font-sans text-[14px] font-medium not-italic text-stone-100">
                      {t.author}
                    </cite>
                    <span className="block font-sans text-[13px] font-light text-stone-500">
                      {t.role}, {t.company}
                    </span>
                  </div>
                </footer>
              </motion.blockquote>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}