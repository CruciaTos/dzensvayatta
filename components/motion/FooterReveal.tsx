"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { easeOutCubic, prefersReducedMotion } from "@/lib/motion";

/**
 * The footer arrives as an overlay from below: once the page's last screen
 * reaches the bottom of the viewport it holds still and dims, and the footer
 * slides up over it as a sheet with rounded top corners. The mirror of
 * HeroDepth at the top of the home page.
 *
 * How it holds: <main> is sticky with a negative top (viewport height minus
 * its own height), so it sticks exactly when its bottom meets the viewport's
 * bottom and stays there while the footer scrolls over it.
 * Reduced motion: the footer simply follows the page.
 */
export function FooterReveal({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => setStill(prefersReducedMotion()), []);

  // Stick when main's bottom meets the viewport's bottom (never lower than its own place on short pages).
  useEffect(() => {
    const main = mainRef.current;
    if (!main || still) return;
    const fit = () => (main.style.top = `${Math.min(0, window.innerHeight - main.offsetHeight)}px`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(main);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
      main.style.top = "";
    };
  }, [still]);

  // 0 when the footer's top enters at the bottom, 1 at the end of the page.
  const { scrollYProgress } = useScroll({ target: footRef, offset: ["start end", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const shade = shadeRef.current;
    if (!shade || still) return;
    // Dim only. Never transform <main>: scenes inside it measure their boxes,
    // and a scaled page makes those measurements wrong.
    shade.style.opacity = String(0.6 * easeOutCubic(p));
  });

  return (
    <div className="relative">
      <main id="main-content" ref={mainRef} className={still ? undefined : "sticky"}>
        {children}
      </main>
      {!still && <div ref={shadeRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] bg-black opacity-0" />}
      <div
        ref={footRef}
        className={
          still
            ? undefined
            : "relative z-10 overflow-hidden rounded-t-[28px] shadow-[0_-28px_60px_-28px_rgba(0,0,0,0.55)]"
        }
      >
        {footer}
      </div>
    </div>
  );
}
