"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// WebGL (ogl); loaded after the page is idle so it never delays the headline.
const MicroSlats = dynamic(() => import("@/components/reactbits/MicroSlats"), { ssr: false });

// The footer watermark's recipe: Fraunces (merged-outline cut), 39% of the
// width, 25% taller, slightly tight, nudged left to sit on centre.
const DZEN_MASK = {
  text: "DZEN",
  family: "var(--font-fraunces), serif",
  weight: 500,
  size: 0.39,
  scaleY: 1.25,
  letterSpacing: -0.02,
  shiftX: -0.02,
  // Soft borders: the letters fade into the slats rather than stopping hard.
  softness: 0.025,
};

/**
 * The hero's moving background until real footage exists ([asset] §H1):
 * React Bits "Micro Slats" in Svayatta blue on night, with a slow swell (no
 * cursor reaction). A "DZEN" hides in the slats, in the footer watermark's
 * font and proportions: slats inside its letters catch more of the swell, so
 * it surfaces only where the swell glows over it, or as a band of light sweeps
 * left to right every 7 seconds. Fades in once the browser is idle. Under reduced motion
 * it stays on the static gradient behind it.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => setReady(true);
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1800 })
      : window.setTimeout(start, 900);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setShown(true), 150);
    return () => window.clearTimeout(id);
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 transition-opacity duration-[1600ms] ease-expo",
        shown ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <MicroSlats
        preset="swell"
        color="#1E5BD6"
        glintColor="#6CB4F0"
        backgroundColor="#061A3D"
        slatWidth={9}
        slatHeight={24}
        gap={3}
        interactive={false}
        mask={DZEN_MASK}
        maskStrength={0.8}
        sweep={0.8}
        sweepPeriod={7}
        intro
        introDuration={1.6}
        className="size-full"
      />
    </div>
  );
}
