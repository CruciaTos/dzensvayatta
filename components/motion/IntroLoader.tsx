"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { range } from "@/lib/motion";
import type { VeilWordElement } from "@/components/reactbits/DitherVeilWord";
import { INTRO_STORAGE_KEY } from "@/lib/intro";

const STAGE_WAIT_MS = 3000; // give up waiting for the hero's name (fonts, WebGL) after this
const FLIP_MS = 90; // one flap
const FLIPS = 12; // random letters shown before each real one
const STAGGER_MS = 100; // between letters
const FLAP_HOLD_MS = 2400; // flap start → move start (the flip itself takes ~1.9s)
const MOVE_MS = 1600; // grows onto the hero's name
const MIN_TOTAL_MS = 4000; // the whole intro, from navigation start, is never shorter than this
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Slot = { x0: number; x1: number; seq: (string | null)[] };

/**
 * First visit to the home page, once per session (docs/redesign/MOTION.md §4).
 *
 * A match cut into the hero. The night screen flips "SVAYATTA" in letter by
 * letter, but in the hero name's own typeface and letter positions, drawn on a
 * canvas the size of the hero's name box and scaled down to sit small in the
 * middle of the screen. When the letters settle the canvas holds the hero
 * name's exact bitmap; it then grows (a pure scale, so nothing changes shape)
 * onto the real name while the screen clears onto the night hero underneath.
 * The canvas lands on the hero's box pixel for pixel, and in the same frame
 * the screen goes the real name appears: there is nothing to see change.
 * The whole thing takes at least 4s.
 *
 * Whether it runs is decided before first paint by the inline script in
 * lib/intro.ts (INTRO_SCRIPT, run from app/layout.tsx), which sets <html data-intro="run">. CSS
 * hides this overlay otherwise. Skipped for reduced motion and crawlers, and
 * the inline script releases it after 10s if anything goes wrong.
 */
export function IntroLoader() {
  const [active, setActive] = useState(true);
  const bgRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLCanvasElement>(null);

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
    let raf = 0;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    function finish() {
      html.dataset.intro = "done";
      if (!cancelled) setActive(false);
    }

    // Without the hero's name (no WebGL, say) just clear the screen.
    async function fadeOut() {
      await animate(1, 0, {
        duration: 0.5,
        onUpdate: (v) => {
          if (bgRef.current) bgRef.current.style.opacity = String(v);
        },
      });
      finish();
    }

    function waitForHero(): Promise<VeilWordElement | null> {
      return new Promise((resolve) => {
        const started = performance.now();
        const poll = () => {
          if (cancelled) return resolve(null);
          const hero = document.querySelector<VeilWordElement>("[data-veil-word]");
          if (hero?.veilSource && hero.veilSet && hero.veilSource.width > 0) return resolve(hero);
          if (performance.now() - started > STAGE_WAIT_MS) return resolve(null);
          later(poll, 40);
        };
        poll();
      });
    }

    async function run() {
      const hero = await waitForHero();
      const stage = stageRef.current;
      if (cancelled) return;
      const ctx = stage?.getContext("2d");
      if (!hero || !stage || !ctx) return void fadeOut();

      const flapStart = performance.now();
      const src = hero.veilSource!;
      const set = hero.veilSet!;
      const alpha = Number(hero.dataset.inkOpacity) || 1;
      const inkCss = Number(hero.dataset.inkWidth) || hero.getBoundingClientRect().width * 0.98;

      // The stage is the hero name's box: same bitmap size, same CSS size.
      stage.width = src.width;
      stage.height = src.height;
      const W = stage.width;
      const H = stage.height;
      const box0 = hero.getBoundingClientRect();
      stage.style.width = `${box0.width}px`;
      stage.style.height = `${box0.height}px`;
      stage.style.opacity = String(alpha);

      // Small at the middle of the screen to start, then grown onto the hero.
      const startInk = Math.min(Math.max(window.innerWidth * 0.36, 240), 420);
      const k0 = Math.min(1, startInk / inkCss);
      const fx = window.innerWidth / 2;
      const fy = window.innerHeight / 2;
      let bw = box0.width;
      let bh = box0.height;
      const place = (cx: number, cy: number, k: number) => {
        stage.style.transform = `translate3d(${cx - bw / 2}px, ${cy - bh / 2}px, 0) scale(${k})`;
      };
      place(fx, fy, k0);

      // One slot per letter, cut at the gaps between the hero name's letters.
      const measure = document.createElement("canvas").getContext("2d")!;
      measure.font = set.font;
      measure.letterSpacing = set.letterSpacing;
      const gap = parseFloat(set.letterSpacing) || 0;
      const n = set.text.length;
      const cuts = [0];
      for (let i = 1; i < n; i++) {
        const x = Math.round(set.x + measure.measureText(set.text.slice(0, i)).width + gap / 2);
        cuts.push(Math.min(W, Math.max(cuts[i - 1], x)));
      }
      cuts.push(W);
      const slots: Slot[] = [];
      for (let i = 0; i < n; i++) {
        const seq: (string | null)[] = [null];
        let prev = set.text[i];
        for (let j = 0; j < FLIPS; j++) {
          let ch = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          while (ch === prev || ch === set.text[i]) ch = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          seq.push(ch);
          prev = ch;
        }
        seq.push(set.text[i]); // the real letter, drawn from the hero's bitmap
        slots.push({ x0: cuts[i], x1: cuts[i + 1], seq });
      }
      const mid = H / 2;

      // A letter's top or bottom half in a slot, squashed about the hinge by sy.
      const half = (slot: Slot, step: number, which: "top" | "bottom", sy: number, dim = 1) => {
        const ch = slot.seq[step];
        if (ch === null) return;
        ctx.save();
        ctx.beginPath();
        ctx.rect(slot.x0, which === "top" ? 0 : mid, slot.x1 - slot.x0, which === "top" ? mid : H - mid);
        ctx.clip();
        ctx.translate(0, mid);
        ctx.scale(1, sy);
        ctx.translate(0, -mid);
        ctx.globalAlpha = dim;
        if (step === slot.seq.length - 1) {
          ctx.drawImage(src, slot.x0, 0, slot.x1 - slot.x0, H, slot.x0, 0, slot.x1 - slot.x0, H);
        } else {
          ctx.fillStyle = "#fff";
          ctx.font = set.font;
          ctx.letterSpacing = "0px";
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.fillText(ch, (slot.x0 + slot.x1) / 2, set.y);
        }
        ctx.restore();
      };

      const lastEnd = (n - 1) * STAGGER_MS + (FLIPS + 1) * FLIP_MS;
      const frame = (now: number) => {
        raf = 0;
        if (cancelled) return;
        const elapsed = now - flapStart;
        ctx.clearRect(0, 0, W, H);
        slots.forEach((slot, i) => {
          const local = elapsed - i * STAGGER_MS;
          if (local < 0) return;
          const steps = slot.seq.length - 1;
          const k = Math.floor(local / FLIP_MS);
          if (k >= steps) {
            half(slot, steps, "top", 1);
            half(slot, steps, "bottom", 1);
            return;
          }
          const p = (local - k * FLIP_MS) / FLIP_MS;
          // New letter's top and old letter's bottom wait underneath; the flap folds over them.
          half(slot, k + 1, "top", 1);
          half(slot, k, "bottom", 1);
          const dim = 1 - 0.4 * Math.sin(p * Math.PI);
          if (p < 0.5) half(slot, k, "top", 1 - 2 * p, dim);
          else half(slot, k + 1, "bottom", 2 * p - 1, dim);
        });
        if (elapsed < lastEnd) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      // Hold, then grow onto the hero's name. Never before MIN_TOTAL_MS - MOVE_MS.
      const moveAt = Math.max(flapStart + FLAP_HOLD_MS, MIN_TOTAL_MS - MOVE_MS);
      later(async () => {
        if (cancelled) return;
        cancelAnimationFrame(raf);
        raf = 0;
        // Settled: the stage holds the hero name's bitmap, whole.
        const box = hero.getBoundingClientRect();
        if (src.width !== W || src.height !== H) {
          stage.width = src.width;
          stage.height = src.height;
        } else {
          ctx.clearRect(0, 0, W, H);
        }
        ctx.drawImage(src, 0, 0);
        stage.style.width = `${box.width}px`;
        stage.style.height = `${box.height}px`;
        bw = box.width;
        bh = box.height;
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;

        // Let the hero's text start rising under the clearing screen. Its name stays blank until the cut.
        html.dataset.intro = "move";

        await animate(0, 1, {
          duration: MOVE_MS / 1000,
          ease: EASE_IN_OUT,
          onUpdate: (t) => {
            place(fx + (cx - fx) * t, fy + (cy - fy) * t, k0 + (1 - k0) * t);
            if (bgRef.current) bgRef.current.style.opacity = String(1 - range(t, 0.15, 0.9));
          },
        });
        // Exactly on the hero's name. The hero draws it, whole, in the same frame the screen goes.
        stage.style.transform = `translate3d(${box.left}px, ${box.top}px, 0)`;
        finish();
      }, moveAt - performance.now());
    }
    void run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (!active) return null;

  return (
    <div id="sv-intro" aria-hidden="true" className="fixed inset-0 z-[60] items-center justify-center">
      <div ref={bgRef} className="absolute inset-0 bg-night" />
      {/* The hero name's box, redrawn with the flip and then its own bitmap. Sized when the intro starts. */}
      <canvas ref={stageRef} className="absolute left-0 top-0 origin-center" />
    </div>
  );
}
