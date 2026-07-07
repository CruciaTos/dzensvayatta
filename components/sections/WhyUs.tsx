"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const C = {
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5",
  textMuted: "rgba(229,243,229,0.68)",
  textFaint: "rgba(178,213,229,0.4)",
  divider: "rgba(178,213,229,0.10)",
  textMutedDark: "rgba(229,243,229,0.18)",
} as const;

const PARAGRAPHS: string[] = [
  "We are a team of founders, young, ambitious, and genuinely passionate about what we do. We are not interested in selling you a product, taking your payment, and moving on to the next client. We are here to help you scale: your workflows, the systems underneath everything, your marketing, your social presence. Whatever the case, we can help.",
  "Everything we do comes back to one thing: clarity. No vague promises. No guesswork. We don't try to be the right fit for everyone, just for people who value clarity, execution, and growth. We are for you if you are here to scale.",
  "There might be someone cheaper out there. There won't always be someone this invested and reliable. We build systems designed to grow with you, and we keep improving them as your business evolves. In the next few years, every industry will need to make peace with AI or risk being left behind. We'd rather help you get ahead now.",
];

// ── Word-level scroll highlight ──────────────────────────────────────────────
type Segment = { type: "word"; text: string } | { type: "break" };
const LINE_BREAK_PHRASE = "We are for you if you are here to scale.";

function toWordSegments(chunk: string): Segment[] {
  return chunk
    .split(/\s+/)
    .filter(Boolean)
    .map((text): Segment => ({ type: "word", text }));
}

function buildSegments(text: string, index: number): Segment[] {
  if (index !== 1) return toWordSegments(text);

  const [before, after] = text.split(LINE_BREAK_PHRASE);
  return [
    ...toWordSegments(before ?? ""),
    { type: "break" },
    ...toWordSegments(LINE_BREAK_PHRASE),
    ...(after ? toWordSegments(after) : []),
  ];
}

function renderSegments(segments: Segment[]): ReactNode[] {
  const nodes: ReactNode[] = [];

  segments.forEach((segment, i) => {
    if (segment.type === "break") {
      nodes.push(<br key={`br-${i}`} />);
      return;
    }

    // Inter‑word space (not after a break)
    if (i > 0 && segments[i - 1]?.type === "word") {
      nodes.push(" ");
    }

    nodes.push(
      <span
        key={`w-${i}`}
        className="scroll-word"
        style={{ color: C.textMutedDark }}
      >
        {segment.text}
      </span>
    );
  });

  return nodes;
}

function ScrollHighlightParagraph({
  text,
  className,
  index,
  setRef,
}: {
  text: string;
  className?: string;
  index: number;
  setRef: (el: HTMLParagraphElement | null) => void;
}) {
  const segments = buildSegments(text, index);

  return (
    <p ref={setRef} className={className} style={{ color: C.textMuted }}>
      <span style={{ color: C.textMuted }}>“</span>
      {renderSegments(segments)}
      <span style={{ color: C.textMuted }}>”</span>
    </p>
  );
}

// ── WhyUs section ────────────────────────────────────────────────────────────
export function WhyUs() {
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      paragraphRefs.current.forEach((el) => {
        if (!el) return;

        const words = Array.from(
          el.querySelectorAll<HTMLSpanElement>(".scroll-word")
        );
        if (!words.length) return;

        if (prefersReducedMotion) {
          gsap.set(words, { color: C.textMuted });
          return;
        }

        gsap.to(words, {
          color: C.textMuted,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 55%",
            scrub: true,
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-us"
      aria-label="Why choose DZen"
      className="py-24 md:py-36"
      style={{ borderTop: `1px solid ${C.divider}` }}
    >
      <Container>
        <div className="flex flex-col items-center text-center w-full mx-auto">
          <FadeIn className="flex items-center gap-3 mb-8">
            <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ backgroundColor: C.accent }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-[11px] tracking-[0.2em] uppercase"
              style={{ color: C.accent }}
            >
              Who We Are
            </span>
          </FadeIn>

          <FadeIn delay={0.06}>
            <h2
              className="font-sans text-[clamp(42px,7vw,84px)] font-bold tracking-[-0.025em] leading-[1.02] mb-6 whitespace-nowrap"
              style={{ color: C.textPrimary }}
            >
              We Build.You Scale.
            </h2>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p
              className="font-sans text-[13px] md:text-[14px] font-semibold tracking-[0.1em] uppercase mb-16"
              style={{ color: C.accentSoft }}
            >
              Quality is clarity. Clarity is growth.
            </p>
          </FadeIn>

          <div className="flex flex-col gap-12 md:gap-14 w-full">
            {PARAGRAPHS.map((p, i) => (
              <ScrollHighlightParagraph
                key={i}
                text={p}
                index={i}
                setRef={(el) => {
                  paragraphRefs.current[i] = el;
                }}
                className="font-sans text-[22px] md:text-[24px] leading-[1.85] font-light"
              />
            ))}
          </div>

          <FadeIn delay={0.5} className="mt-16">
            <Link
              href="/discovery"
              className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase pb-1 border-b transition-colors duration-300"
              style={{ color: C.accentSoft, borderColor: "rgba(178,213,229,0.25)" }}
            >
              Start a conversation
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}