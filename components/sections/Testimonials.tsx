"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import ScrollReveal from "@/components/ScrollReveal";

const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.65)",
  textFaint: "rgba(178,213,229,0.35)",
  divider: "rgba(178,213,229,0.10)",
  hairline: "rgba(178,213,229,0.18)",
  thumbBg: "rgba(178,213,229,0.06)",
  chipBg: "rgba(126,195,226,0.08)",
  chipBorder: "rgba(178,213,229,0.16)",
  markBg: "rgba(126,195,226,0.10)",
} as const;

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  service: string;
  outcome: { value: string; label: string };
  avatar?: string;
  logo?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "bharat-aarti",
    quote:
      "\u201CWe don't have to think about the little things anymore. Everything just works the way it should.\u201D",
    author: "Mr. Bharat Boridkar",
    role: "Senior Accountant",
    company: "Aarti Enterprise",
    industry: "Professional Services",
    service: "Operations Automation",
    outcome: { value: "Full", label: "operational visibility" },
  },
  {
    id: "praful-thakre",
    quote:
      "\u201CDzen delivered scalable automation across our entire operation. The results are already visible across finance, logistics and delivery.\u201D",
    author: "Mr. Praful Thakre",
    role: "CEO",
    company: "Aarti Enterprise",
    industry: "Manufacturing",
    service: "Enterprise Automation",
    outcome: { value: "Company-wide", label: "operational alignment" },
  },
  {
    id: "rutuja-nilgunkar",
    quote:
      "\u201CThey built an AI voice assistant that answers calls, triages patients and schedules follow-ups automatically. It's the digital front desk our clinic needed.\u201D",
    author: "Dr. Rutuja Nilgunkar",
    role: "Physiotherapist & Clinic Owner",
    company: "Nilgunkar Clinic",
    industry: "Healthcare",
    service: "AI Patient Management",
    outcome: { value: "24/7", label: "call handling" },
  },
  {
    id: "neeta-save",
    quote:
      "\u201CPatients can now book appointments and get answers to common questions without waiting on hold. It took real pressure off our front desk.\u201D",
    author: "Dr. Neeta Save",
    role: "Clinic Owner & BHMS",
    company: "Aarogya Clinic",
    industry: "Healthcare",
    service: "Patient Engagement",
    outcome: { value: "Higher", label: "staff capacity" },
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function markOf(company: string) {
  return company
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const active = TESTIMONIALS[index];

  const quoteContainerRef = useRef<HTMLDivElement>(null);
  const isQuoteInView = useInView(quoteContainerRef, { once: true });

  function goTo(next: number) {
    const total = TESTIMONIALS.length;
    setIndex(((next % total) + total) % total);
  }

  const quoteText = active.quote;
  const startsWithQuote = quoteText.startsWith("\u201C");
  const endsWithQuote = quoteText.endsWith("\u201D");
  const mainText = startsWithQuote && endsWithQuote ? quoteText.slice(1, -1) : quoteText;

  const authorRoleText = `${active.role}, ${active.company}`;

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
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
            Don&apos;t Take Our Word For It
          </h2>

          {/* Quote block – increased fixed height to prevent layout shift */}
          <div
            ref={quoteContainerRef}
            className="h-[320px] sm:h-[280px] overflow-hidden flex items-center justify-center max-w-[1700px] px-4"
          >
            <AnimatePresence mode="wait">
              <div key={active.id} className="flex items-center justify-center text-center">
                {startsWithQuote && (
                  <motion.span
                    aria-hidden="true"
                    className="flex-shrink-0 self-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isQuoteInView ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      color: C.accent,
                      fontSize: "clamp(34px,3vw,44px)",
                      lineHeight: 1,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    &ldquo;
                  </motion.span>
                )}

                <ScrollReveal
                  key={active.id}
                  enableBlur={true}
                  baseOpacity={0}
                  baseRotation={0}
                  blurStrength={6}
                  containerClassName="inline m-0 p-0"
                  textClassName="text-[clamp(34px,3vw,44px)] font-normal leading-tight text-center inline m-0 p-0"
                  style={{ color: C.textPrimary, wordSpacing: "0.09em", fontFamily: "var(--font-sans)" }}
                >
                  {mainText}
                </ScrollReveal>

                {endsWithQuote && (
                  <motion.span
                    aria-hidden="true"
                    className="flex-shrink-0 self-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isQuoteInView ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      color: C.accent,
                      fontSize: "clamp(34px,3vw,44px)",
                      lineHeight: 1,
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    &rdquo;
                  </motion.span>
                )}
              </div>
            </AnimatePresence>
          </div>

          {/* Author block – fades in simultaneously with the quote */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: isQuoteInView ? 1 : 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-20 flex flex-col items-center"
            >
              <p className="font-sans text-[32px] font-bold mb-1" style={{ color: C.textPrimary }}>
                {active.author}
              </p>
              <p className="font-sans text-[20px] font-medium mt-0" style={{ color: C.accent }}>
                {authorRoleText}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls row – stays fixed in place */}
          <div className="mt-2 flex items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/60"
              style={{ border: `1px solid ${C.hairline}` }}
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke={C.accentSoft} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto max-w-full py-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TESTIMONIALS.map((t, i) => {
                const isActive = i === index;
                return (
                  <motion.button
                    key={t.id}
                    layout
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show testimonial from ${t.author} at ${t.company}`}
                    aria-current={isActive}
                    transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                    className="relative rounded-2xl overflow-visible flex-shrink-0 w-28 h-28 sm:w-40 sm:h-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/60"
                  >
                    <div
                      className="relative w-full h-full rounded-2xl overflow-hidden transition-shadow duration-500"
                      style={{
                        border: isActive ? `2px solid ${C.accent}` : `1px solid ${C.hairline}`,
                        boxShadow: isActive ? "0 8px 24px -8px rgba(126,195,226,0.35)" : "none",
                      }}
                    >
                      {t.avatar ? (
                        <Image
                          src={t.avatar}
                          alt={t.author}
                          fill
                          sizes="(min-width: 640px) 160px, 112px"
                          className="object-cover transition-all duration-500"
                          style={{ filter: isActive ? "none" : "grayscale(1) opacity(0.6)" }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center font-mono font-semibold transition-colors duration-500"
                          style={{
                            fontSize: "clamp(26px, 5vw, 34px)",
                            background: isActive
                              ? "radial-gradient(circle at 30% 20%, rgba(126,195,226,0.28), rgba(126,195,226,0.08))"
                              : C.thumbBg,
                            color: isActive ? C.accentSoft : C.textFaint,
                          }}
                        >
                          {initialsOf(t.author)}
                        </div>
                      )}
                    </div>

                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2 -right-2 rounded-lg flex items-center justify-center font-mono font-semibold transition-colors duration-500"
                      style={{
                        width: 28,
                        height: 28,
                        fontSize: 10,
                        backgroundColor: "#0a1420",
                        color: isActive ? C.accentSoft : C.textFaint,
                        border: `1px solid ${isActive ? C.accent : C.hairline}`,
                      }}
                    >
                      {markOf(t.company)}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/60"
              style={{ border: `1px solid ${C.hairline}` }}
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke={C.accentSoft} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}