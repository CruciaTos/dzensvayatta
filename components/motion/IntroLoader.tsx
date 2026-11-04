"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT_CUBIC, LOOK_END, LOOK_START, range } from "@/lib/motion";
import SplitFlapText from "@/components/reactbits/SplitFlapText";
import { INTRO_STORAGE_KEY } from "@/lib/intro";

const FLAP_MS = 900; // letters settle, then a short hold
const MOVE_S = 0.32; // wordmark into the nav

/**
 * First visit to the home page, once per session (docs/redesign/MOTION.md §4).
 * The night screen flips "SVAYATTA" in letter by letter, then the wordmark
 * travels into the nav and becomes the nav's own wordmark while the screen
 * clears onto the night hero underneath (same colour, so the hand-over is
 * invisible). The hero's entrance waits for it.
 *
 * Whether it runs is decided before first paint by the inline script in
 * lib/intro.ts (INTRO_SCRIPT, run from app/layout.tsx), which sets <html data-intro="run">. CSS
 * hides this overlay otherwise. Skipped for reduced motion and crawlers, and
 * the inline script releases it after 4s if anything goes wrong.
 */
export function IntroLoader() {
  const [active, setActive] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro !== "run") {
      setActive(false);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const word = wordRef.current;
      const target = document.querySelector<HTMLElement>("[data-intro-wordmark]");
      if (!word || !target || cancelled) return finish();

      const a = word.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const s = b.height / a.height;
      const dx = b.left - a.left;
      const dy = b.top - a.top;

      // Let the hero start rising under the clearing screen.
      html.dataset.intro = "move";

      await animate(0, 1, {
        duration: MOVE_S,
        ease: EASE_OUT_CUBIC,
        onUpdate: (t) => {
          const look = range(t, LOOK_START, LOOK_END);
          word.style.transform = `translate3d(${dx * t}px, ${dy * t}px, 0) scale(${1 + (s - 1) * t})`;
          word.style.opacity = String(look);
          if (flapRef.current) {
            flapRef.current.style.opacity = String(1 - look);
            flapRef.current.style.transform = `translate3d(${dx * t}px, ${dy * t}px, 0) scale(${1 + (s - 1) * t})`;
          }
          if (bgRef.current) bgRef.current.style.opacity = String(1 - range(t, 0.2, 1));
          // The nav's real wordmark takes over on the last frame.
          target.style.opacity = t >= 0.999 ? "1" : "0";
        },
      });
      finish();
    }, FLAP_MS);

    function finish() {
      document.querySelector<HTMLElement>("[data-intro-wordmark]")?.style.removeProperty("opacity");
      html.dataset.intro = "done";
      if (!cancelled) setActive(false);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      id="sv-intro"
      aria-hidden="true"
      className="fixed inset-0 z-[60] items-center justify-center"
    >
      <div ref={bgRef} className="absolute inset-0 bg-night" />
      <div className="relative flex flex-col items-center">
        <span
          ref={wordRef}
          className="origin-top-left font-display text-[clamp(30px,6vw,56px)] font-semibold leading-none tracking-[0.2em] text-night-ink opacity-0"
        >
          SVAYATTA
        </span>
        <div ref={flapRef} className="absolute inset-0 flex origin-top-left items-center justify-center">
          <SplitFlapText
            text="SVAYATTA"
            padTo={8}
            loop={false}
            intro
            tileStyle="minimal"
            fontSize="clamp(30px,6vw,56px)"
            gap={2}
            flipDuration={0.06}
            stagger={0.04}
            flipsPerChar={5}
            charset="alpha"
            textColor="var(--night-ink)"
            tileColor="var(--night)"
            align="center"
          />
        </div>
      </div>
    </div>
  );
}
