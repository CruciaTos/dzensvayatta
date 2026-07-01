"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";

const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  cardBg: "#0d0d0c",
  cardBorder: "rgba(178,213,229,0.10)",
  cardBorderHover: "rgba(126,195,226,0.28)",
  divider: "rgba(178,213,229,0.10)",
} as const;

const TESTIMONIALS = [
  {
    id: "1",
    quote:
      "They didn't just connect our systems — they gave us a single source of truth that our entire leadership team now trusts. The discovery phase alone saved us months.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "Meridian Logistics",
    avatar: "/avatars/sarah-chen.jpg",
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

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className="py-[120px] relative"
      style={{ borderTop: `1px solid ${C.divider}` }}
    >
      <Container>
        <FadeIn>
          <div className="flex items-center gap-[14px] mb-6">
            <div
              aria-hidden="true"
              className="w-7 h-px flex-shrink-0"
              style={{ backgroundColor: C.accent }}
            />
            <span
              className="font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: C.accent }}
            >
              Testimonials
            </span>
            <span
              className="font-mono text-[10px] tracking-widest"
              style={{ color: "rgba(178,213,229,0.35)" }}
            >
              07
            </span>
          </div>

          <h2
            className="font-sans text-[clamp(31px,4.2vw,56px)] font-bold tracking-[-0.026em] max-w-[620px]"
            style={{ color: C.textPrimary }}
          >
            Trusted by teams who run on interconnected systems.
          </h2>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] mt-20"
          staggerDelay={0.1}
          initialDelay={0.1}
        >
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.id}>
              <motion.blockquote
                className="group relative p-10 sm:p-12 flex flex-col justify-between gap-8 min-h-[280px] transition-colors duration-300"
                style={{
                  backgroundColor: C.cardBg,
                  border: `1px solid ${C.cardBorder}`,
                }}
                whileHover={{ borderColor: C.cardBorderHover }}
              >
                <span
                  className="absolute top-6 right-8 font-serif text-[120px] leading-none select-none pointer-events-none"
                  style={{ color: "rgba(178,213,229,0.06)" }}
                >
                  &ldquo;
                </span>

                <p
                  className="relative font-serif text-[16px] sm:text-[18px] font-light leading-relaxed"
                  style={{ color: C.textPrimary }}
                >
                  {t.quote}
                </p>

                <footer className="flex items-center gap-4 mt-auto">
                  {t.avatar && (
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden"
                      style={{
                        backgroundColor: "rgba(178,213,229,0.12)",
                        border: `1px solid ${C.cardBorder}`,
                      }}
                    >
                      <img
                        src={t.avatar}
                        alt={t.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <cite
                      className="block font-sans text-[14px] font-medium not-italic"
                      style={{ color: C.accentSoft }}
                    >
                      {t.author}
                    </cite>
                    <span
                      className="block font-sans text-[13px] font-light"
                      style={{ color: C.textMuted }}
                    >
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
