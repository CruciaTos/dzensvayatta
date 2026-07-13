"use client";

import { useEffect, useState, useRef } from "react";

interface LenisLike {
  on: (event: "scroll", callback: (data: { scroll: number }) => void) => void;
  off: (event: "scroll", callback: (data: { scroll: number }) => void) => void;
}

export function GlobalVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion: skip autoplay entirely, fall back to the poster frame
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Pause playback while the tab isn't visible to save CPU/battery
  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else if (!reducedMotion) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [reducedMotion]);

  useEffect(() => {
    // ── Helper: calculate progress (0 → 1) ──
    const updateProgress = (y: number) => {
      const docHeight = document.body.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(1, Math.max(0, y / docHeight)));
    };

    // ── 1. Try to use Lenis (if your SmoothScroll is Lenis‑based) ──
    // Look for the global Lenis instance that most setups expose.
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    if (lenis && typeof lenis.on === "function") {
      const onLenisScroll = ({ scroll }: { scroll: number }) => updateProgress(scroll);
      lenis.on("scroll", onLenisScroll);
      return () => lenis.off("scroll", onLenisScroll);
    }

    // ── 2. Fallback to native scroll ──
    const handleScroll = () => updateProgress(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: "#000b12ff" }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay={!reducedMotion}
        muted
        loop={!reducedMotion}
        playsInline
        preload="auto"
        poster="/videos/hero3-poster.jpg"
        style={{
          // Dynamic vertical position: 0% = top of video, 100% = bottom
          objectPosition: `center ${scrollProgress * 100}%`,
        }}
      >
        <source src="/videos/hero3.mp4" type="video/mp4" />
      </video>

      {/* Glass overlay + grain (unchanged) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: "blur(12px) saturate(130%)",
          WebkitBackdropFilter: "blur(12px) saturate(130%)",
          background:
            "linear-gradient(180deg, rgba(1,11,19,0.4) 0%, rgba(1,11,19,0.65) 60%, rgba(1,11,19,0.9) 100%)",
        }}
      />
      <div
        className="absolute inset-0 noise-overlay mix-blend-overlay pointer-events-none"
        style={{ opacity: 0.025 }}
      />
    </div>
  );
}