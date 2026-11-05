"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type MouseEvent } from "react";
import { TESTIMONIALS } from "@/lib/testimonials";
import type { Testimonial } from "@/types/content";
import { em } from "@/lib/rich";
import { cn } from "@/lib/utils";
import { CLIENT_VOICES_ID } from "@/lib/anchors";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskReveal } from "@/components/motion/MaskReveal";

/**
 * Client voices (§H8) as a stack of cards. Each card pins a little lower than
 * the last; as the next one slides over it, the cards underneath shrink back
 * and dim, so the stack reads as real depth. Cards tilt toward the cursor.
 */

// Alternating tones give the stack rhythm as it builds.
const TONES = [
  "bg-paper text-ink border border-line",
  "bg-tint text-ink",
  "on-night",
  "bg-surface text-ink border border-line",
];

const N = TESTIMONIALS.length;

function Card({ t, i, progress }: { t: Testimonial; i: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const night = TONES[i % TONES.length] === "on-night";
  // Cards further down the stack end smaller and darker.
  const scale = useTransform(progress, [i / N, 1], [1, 1 - (N - 1 - i) * 0.045]);
  const shade = useTransform(progress, [i / N, 1], [0, (N - 1 - i) * 0.14]);
  const tiltRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  return (
    <div className="sticky [perspective:1400px]" style={{ top: `calc(96px + ${i * 22}px)` }}>
      <motion.div style={reduce ? undefined : { scale }} className="origin-top">
        <div
          ref={tiltRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={cn(
            "relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[24px] p-7 transition-transform duration-300 ease-out md:h-[min(68vh,540px)] md:p-12",
            TONES[i % TONES.length],
            // The section is on the poster gradient, which pales serif words; on the light cards they stay cobalt.
            !night && "[&_.em]:text-accent"
          )}
        >
          {/* Big quote mark */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -top-6 right-6 select-none font-serif text-[16rem] leading-none md:right-12",
              night ? "text-sky/15" : "text-accent/10"
            )}
          >
            &ldquo;
          </span>

          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <span className={cn("font-mono text-meta uppercase", night ? "text-night-muted" : "text-ink-3")}>
              {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            {t.outcome && (
              <span
                className={cn(
                  "rounded-pill px-3 py-[6px] text-[12px] font-medium leading-none",
                  night ? "bg-sky/15 text-sky" : "bg-paper/70 text-accent"
                )}
              >
                {t.outcome}
              </span>
            )}
          </div>

          <blockquote
            className={cn(
              "relative my-8 max-w-[34ch] font-display text-[clamp(1.5rem,2.7vw,2.5rem)] font-normal leading-[1.22] tracking-[-0.02em]",
              night && "em-inherit"
            )}
          >
            {em(t.quote)}
          </blockquote>

          <div className="relative flex items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface">
                <Image src={t.avatar} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <div>
                <p className="text-[16px] font-semibold">{t.name}</p>
                <p className={cn("text-[14px]", night ? "text-night-muted" : "text-ink-3")}>
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
            {t.logo && (
              <span className={cn("relative hidden h-8 w-20 sm:block", night && "rounded-md bg-paper/90")}>
                <Image src={t.logo} alt={`${t.company} logo`} fill sizes="80px" className="object-contain p-1" />
              </span>
            )}
          </div>

          {/* Darkens as later cards stack on top */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              style={{ opacity: shade }}
              className="pointer-events-none absolute inset-0 bg-night"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ClientVoices({ overBackdrop = false }: { overBackdrop?: boolean }) {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    // On the poster blue. `overBackdrop`: it carries on from the full-screen
    // process stage, whose blue stays pinned behind it (SameBoxScene's
    // backdrop) while the cards scroll over, so it paints no background itself.
    <section
      id={CLIENT_VOICES_ID}
      aria-labelledby="voices-title"
      className={cn("section on-night bg-poster relative", overBackdrop && "bg-transparent bg-none after:hidden")}
    >
      <Container>
        <div className="mb-10 md:mb-14">
          <Eyebrow tone="night" className="mb-5">
            Client voices
          </Eyebrow>
          <MaskReveal id="voices-title" text={"In their\n*own words*"} className="text-display-l text-night-ink" />
        </div>

        {/* [confirm] written consent from each person for name, photo and quote */}
        <div ref={stackRef} className="relative flex flex-col gap-[18vh] pb-[6vh]">
          {TESTIMONIALS.map((t, i) => (
            <Card key={t.id} t={t} i={i} progress={scrollYProgress} />
          ))}
        </div>
      </Container>
    </section>
  );
}
