"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { easeOutCubic } from "@/lib/motion";
import { setHeroCovered } from "@/lib/heroCover";

interface HeroDepthProps {
  hero: ReactNode;
  /**
   * Drawn behind the hero, full-bleed and never scaled: as the hero settles
   * back, this still fills the screen out to its edges.
   */
  backdrop?: ReactNode;
  /** The sections that slide up over the hero, as one paper sheet. */
  children: ReactNode;
}

/**
 * Depth between the hero and the page: the hero stays pinned and settles back
 * (slightly smaller, rounded, dimmed) while the next sections slide over it
 * as a paper sheet with rounded top corners. Reduced motion keeps it still.
 */
export function HeroDepth({ hero, backdrop, children }: HeroDepthProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // 0 when the sheet's top is at the bottom of the viewport, 1 when it reaches the top.
  const { scrollYProgress } = useScroll({ target: sheetRef, offset: ["start end", "start start"] });

  // Leaving the page uncovers it, so the next visit starts animating.
  useEffect(() => () => setHeroCovered(false), []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const hero = heroRef.current;
    const shade = shadeRef.current;
    const pin = pinRef.current;
    if (!hero || !shade || !pin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const e = easeOutCubic(p);
    hero.style.transform = `translate3d(0, ${-3 * e}%, 0) scale(${1 - 0.07 * e})`;
    hero.style.borderRadius = `${28 * e}px`;
    shade.style.opacity = String(0.55 * e);
    // Fully covered: stop painting it (and let the hero video pause), and tell
    // its WebGL animations to stop drawing (they're still "on screen" underneath).
    pin.style.visibility = p >= 1 ? "hidden" : "visible";
    setHeroCovered(p >= 1);
  });

  return (
    <div className="relative">
      <div
        ref={pinRef}
        className="group/hero sticky top-0 z-0 h-[100svh] max-h-[960px] min-h-[640px] overflow-hidden bg-night"
      >
        {backdrop && <div className="absolute inset-0">{backdrop}</div>}
        <div ref={heroRef} className="relative h-full origin-top overflow-hidden will-change-transform">
          {hero}
        </div>
        <div ref={shadeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night opacity-0" />
      </div>
      <div
        ref={sheetRef}
        className="relative z-10 rounded-t-[28px] bg-paper shadow-[0_-28px_60px_-28px_rgba(6,26,61,0.5)]"
      >
        {children}
      </div>
    </div>
  );
}
