"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { easeOutCubic, prefersReducedMotion } from "@/lib/motion";

/**
 * A page hero that zooms out: it starts as a full-screen night panel, and as
 * you scroll it shrinks into a floating rounded card with paper showing
 * around it, then leaves upward. The reverse of the "same box" grow.
 * Optional blurred footage behind (the site's glass-over-video look).
 * Reduced motion: a plain night hero.
 */
export function ZoomOutHero({
  children,
  footage = false,
  className,
  "aria-labelledby": labelledBy,
}: {
  children: ReactNode;
  footage?: boolean;
  className?: string;
  "aria-labelledby"?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => setStill(prefersReducedMotion()), []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (still) return;
    const panel = panelRef.current;
    if (!panel) return;
    const e = easeOutCubic(p);
    const x = e * Math.max(16, window.innerWidth * 0.07);
    const y = e * window.innerHeight * 0.12;
    panel.style.clipPath = `inset(${y}px ${x}px ${y}px ${x}px round ${e * 32}px)`;
    if (contentRef.current) contentRef.current.style.transform = `scale(${1 - 0.1 * e})`;
    if (videoRef.current) videoRef.current.style.transform = `scale(${1.25 - 0.1 * e})`;
  });

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || still) return;
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? video.play().catch(() => {}) : video.pause()));
    io.observe(section);
    return () => io.disconnect();
  }, [still]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={labelledBy}
      className={cn("relative bg-paper", still ? "" : "h-[180vh]", className)}
    >
      <div className={cn("w-full", still ? "relative min-h-[80svh]" : "sticky top-0 h-[100svh]")}>
        <div ref={panelRef} className="on-night absolute inset-0 overflow-hidden will-change-[clip-path]">
          {footage && (
            <>
              <video
                ref={videoRef}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-125 object-cover blur-[14px] saturate-[1.3]"
                src="/videos/hero3.mp4"
                poster="/videos/hero3-poster.jpg"
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,26,61,0.45)_0%,rgba(6,26,61,0.65)_60%,rgba(6,26,61,0.9)_100%)]"
              />
            </>
          )}
          <div
            ref={contentRef}
            className="relative flex h-full flex-col items-center justify-center px-[clamp(16px,6vw,96px)] pt-16 text-center"
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
