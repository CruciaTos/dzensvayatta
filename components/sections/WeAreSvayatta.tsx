"use client";

import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { em } from "@/lib/rich";
import { easeOutCubic, lerp, prefersReducedMotion, range } from "@/lib/motion";
import { MANIFESTO_TITLE, ManifestoBody, TYPED_LINE } from "@/components/sections/Manifesto";
import { ALL_WHITE, edgeGone, edgeMask, manifestoEdge, manifestoHandoff, setMask } from "@/lib/handoff";

/**
 * "We are Svayatta." The successor to the old "WE ARE DZEN" scramble, and the
 * way into the manifesto.
 *
 * A pinned scroll scene, scrubbed by the scroll (so it plays backwards too):
 *   1. "We", "are" and "Svayatta" decode letter by letter out of Devanagari glyphs.
 *   2. "We are" lifts away, the site's blurred footage fades in behind and
 *      "Svayatta." turns white (the same glass-over-video look as the live site).
 *   3. Zoom: the camera flies into the stem of the first "t" and steers the
 *      stem's left edge onto the split line. The white letter becomes the page
 *      on the right; the footage beside it becomes the panel on the left.
 *   4. Land: "Quality, with clarity." rises in the footage panel and the
 *      manifesto's first paragraph types itself out on the white, held still.
 *      Then the paragraphs scroll up (typing as they go) beside the pinned panel.
 *   5. Exit: once the last paragraph has typed, the panel tilts away to the
 *      top-left as you scroll (its foot first, clear of the carousel), with the
 *      stage still pinned, while Services rides up
 *      over it and fades in on the same white. The stage lets go only once it's
 *      all white, so its edge is never seen.
 * Below md there's no room for a split: the camera flies all the way into the
 * letter and the manifesto reads on the white.
 * Reduced motion: the white word on footage, then a still split, no pinning.
 */

const GLYPHS = "अआइईउऊएओकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह०१२३४५६७८९#%&*+=/<>";
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// Scroll windows (0–1 across the track) for each word's decode.
const WORDS = {
  we: { text: "We", from: 0.03, to: 0.09 },
  are: { text: "are", from: 0.09, to: 0.15 },
  name: { text: "Svayatta", from: 0.15, to: 0.31 },
} as const;

// Then "We are" leaves, the name settles, and the colours flip.
const SETTLE: [number, number] = [0.33, 0.43];
const FLIP: [number, number] = [0.34, 0.45];
// Then a short hold, and the fly-through.
const ZOOM: [number, number] = [0.5, 0.74];
// The letter grows at least this much (more if the screen needs it to fill).
const ZOOM_MAX = 60;
// The landing: from here to the end of the track the paragraphs hold still
// at the split while the first one types out.
const LAND = ZOOM[1];
// The heading rises in the panel.
const TITLE_LINES: [number, number][] = [
  [0.73, 0.79],
  [0.75, 0.81],
];
const EYEBROW: [number, number] = [0.74, 0.8];
// The white side's contents (on phones, the heading) fade in once they're in place.
const BODY: [number, number] = [LAND, LAND + 0.03];
// Then the first paragraph types itself out.
const FIRST_TYPE: [number, number] = [0.79, 0.98];
// Reduced motion shows this moment: white word on footage, before the zoom.
const STILL_P = 0.47;
// The footage panel's share of the width once the split lands (md and up).
const SPLIT = 0.4;
// The exit wipe runs across this much scroll (in screen heights), starting the
// moment the last paragraph has typed. A full screen, so a natural scroll
// lets you watch the edge tilt and blur rather than miss it in one flick.
const SWEEP = 1.2;
// The wipe's foot is past the left edge by this point of the wipe (0–1); the top follows.
const FOOT_OUT = 0.6;
// How far the foot swings out, in panel widths: higher turns the edge further.
const SPIN = 5;
// The manifesto has faded out by this point of the wipe (0–1).
const EXIT_FADE = 0.6;
// Half the soft band across the wipe's edge: this share of the width, at most FEATHER_MAX px.
const FEATHER = 0.28;
const FEATHER_MAX = 460;
// Accelerating ease, so the fly-through starts gently and rushes at the end.
const easeInCubic = (t: number) => t * t * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Ink → white (the paper colour) as the footage fades in.
const FROM_FG = [10, 18, 24];
const TO_FG = [255, 255, 255];
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(lerp(a[0], b[0], t))}, ${Math.round(lerp(a[1], b[1], t))}, ${Math.round(lerp(a[2], b[2], t))})`;

const STATE_HIDDEN = 0;
const STATE_SCRAMBLE = 1;
const STATE_SHOWN = 2;

interface CharSlot {
  real: HTMLSpanElement;
  glyph: HTMLSpanElement;
  start: number;
  end: number;
  state: number;
}

/** A glyph's solid stem, in px at the element's font size. `mid` is measured from the baseline (negative is above). */
interface Stem {
  left: number;
  right: number;
  mid: number;
  half: number;
}

/**
 * Finds the solid stem of a letter by drawing it large on a canvas: the
 * longest run of rows that are one identical bar. The DOM only knows the
 * character's box, and the zoom needs the stem's exact left edge, because
 * that edge becomes the split line.
 */
function measureStem(el: HTMLElement): Stem | null {
  const cs = getComputedStyle(el);
  const size = parseFloat(cs.fontSize);
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!size || !ctx) return null;
  const F = 1000;
  const k = F / size;
  const w = Math.ceil(F * 1.2);
  const h = Math.ceil(F * 1.3);
  const pad = Math.round(F * 0.2);
  const base = Math.round(F * 1.05);
  ctx.canvas.width = w;
  ctx.canvas.height = h;
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${F}px ${cs.fontFamily}`;
  ctx.fillText(el.textContent ?? "", pad, base);
  const data = ctx.getImageData(0, 0, w, h).data;
  const alpha = (x: number, y: number) => data[(y * w + x) * 4 + 3];

  // A row as one solid bar [left, right], or null when it's empty or in pieces.
  const bar = (y: number): [number, number] | null => {
    let l = -1;
    let r = -1;
    let pieces = 0;
    let inside = false;
    for (let x = 0; x < w; x++) {
      const on = alpha(x, y) > 127;
      if (on && !inside) {
        pieces++;
        if (l < 0) l = x;
      }
      if (on) r = x;
      inside = on;
    }
    return pieces === 1 ? [l, r] : null;
  };

  let best = { top: 0, len: 0 };
  let run = { top: 0, len: 0, l: -9, r: -9 };
  for (let y = 0; y < h; y++) {
    const b = bar(y);
    if (b && Math.abs(b[0] - run.l) <= 1 && Math.abs(b[1] - run.r) <= 1) run.len++;
    else run = b ? { top: y, len: 1, l: b[0], r: b[1] } : { top: y, len: 0, l: -9, r: -9 };
    if (run.len > best.len) best = { top: run.top, len: run.len };
  }
  if (best.len < 10) return null;

  // Sub-pixel edges from the anti-aliased columns, on the run's middle row.
  const y = best.top + (best.len >> 1);
  let j = 0;
  while (j < w - 1 && alpha(j, y) === 0) j++;
  let q = w - 1;
  while (q > 0 && alpha(q, y) === 0) q--;
  return {
    left: (j + 1 - alpha(j, y) / 255 - pad) / k,
    right: (q + alpha(q, y) / 255 - pad) / k,
    mid: (best.top + best.len / 2 - base) / k,
    half: best.len / 2 / k,
  };
}

function DecodeWord({
  text,
  from,
  to,
  register,
}: {
  text: string;
  from: number;
  to: number;
  register: (key: string, el: HTMLSpanElement | null, start: number, end: number) => void;
}) {
  const span = to - from;
  return (
    <span className="inline-flex whitespace-nowrap">
      {text.split("").map((c, i) => {
        const start = from + span * 0.7 * (i / text.length);
        const end = start + span * 0.3;
        return (
          <span key={i} className="relative inline-block" ref={(el) => register(`${text}-${i}`, el, start, end)}>
            <span data-real style={{ opacity: 0 }}>
              {c}
            </span>
            <span
              data-glyph
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-[0.55em] font-normal text-accent"
            />
          </span>
        );
      })}
    </span>
  );
}

// Heavy and tight, in title case. "We are" in Schibsted Grotesk, "Svayatta." in Host Grotesk.
const TOP_CLASS = "font-display text-[clamp(2.75rem,9vw,8.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em]";
const NAME_CLASS = "font-sans text-[clamp(3.75rem,18.5vw,18rem)] font-extrabold leading-[0.9] tracking-[-0.04em]";
// The manifesto heading in the footage panel.
const PANEL_TITLE_CLASS = "text-display-m md:text-[clamp(2rem,4vw,4rem)]";
// The site's container edge (Container: min(88vw, 1280px), centred), across a box `base` wide.
const gutter = (base: string) => `(${base} - min(88vw, 1280px)) / 2`;

export function WeAreSvayatta() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const footageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const exitP = useRef(0);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastParaRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const slots = useRef(new Map<string, CharSlot>());
  const lastP = useRef(0);
  // The stem's left edge at mid-stem: `ox/oy` in the name's own pixels,
  // `x0/y0` on the stage before any transform.
  const aim = useRef({ ox: 0, oy: 0, x0: 0, y0: 0, stemW: 1, half: 1 });
  // Where the split line lands, in px from the stage's left (0 below md).
  const split = useRef(0);
  const stillRef = useRef(false);
  const [still, setStill] = useState(false);

  const register = useCallback((key: string, el: HTMLSpanElement | null, start: number, end: number) => {
    if (!el) {
      slots.current.delete(key);
      return;
    }
    const real = el.querySelector<HTMLSpanElement>("[data-real]");
    const glyph = el.querySelector<HTMLSpanElement>("[data-glyph]");
    if (real && glyph) slots.current.set(key, { real, glyph, start, end, state: -1 });
  }, []);

  const apply = useCallback((p: number) => {
    lastP.current = p;
    // 1. Decode.
    slots.current.forEach((s) => {
      const next = p < s.start ? STATE_HIDDEN : p < s.end ? STATE_SCRAMBLE : STATE_SHOWN;
      if (next === s.state) return;
      s.state = next;
      s.real.style.opacity = next === STATE_SHOWN ? "1" : "0";
      s.glyph.textContent = next === STATE_SCRAMBLE ? randomGlyph() : "";
    });
    if (dotRef.current) dotRef.current.style.opacity = p >= WORDS.name.to ? "1" : "0";

    // 2. "We are" lifts away; the name rises into the middle and grows a touch.
    const settle = easeOutCubic(range(p, ...SETTLE));
    const stage = stageRef.current;
    const top = topRef.current;
    const name = nameRef.current;
    if (stage && top && name) {
      const lift = top.offsetHeight;
      top.style.opacity = String(1 - settle);
      top.style.transform = `translate3d(0, ${-lift * 0.6 * settle}px, 0)`;
      top.style.filter = settle > 0 && settle < 1 ? `blur(${settle * 6}px)` : "";

      // 3. The fly-through: a pure zoom, its scale growing exponentially (an
      // even speed that rushes at the end). It grows until the stem covers
      // everything right of the split line, top to bottom, and its one fixed
      // centre is chosen so the stem's left edge lands exactly on that line.
      const a = aim.current;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const B = split.current;
      const ys = a.y0 - lift * 0.5; // the stem's middle on screen, once settled
      const fill = Math.max((W - B) / a.stemW, Math.max(ys, H - ys) / a.half) * 1.2;
      const zmax = Math.max(ZOOM_MAX, fill / 1.05);
      const end = 1.05 * zmax;
      const cx = (end * a.x0 - B) / (end - 1);
      const scale = (1 + 0.05 * settle) * Math.pow(zmax, easeInCubic(range(p, ...ZOOM)));
      name.style.transformOrigin = `${cx - (a.x0 - a.ox)}px ${a.oy}px`;
      name.style.transform = `translate3d(0, ${-lift * 0.5 * settle}px, 0) scale(${scale})`;
      // The hand-off has no fade: the page side starts at the stem's edge and
      // switches on only once the stem fills everything right of that edge,
      // top to bottom, so it replaces white with the same white. At full zoom
      // the edge is the split line.
      const edge = cx + scale * (a.x0 - cx);
      const covered = edge + a.stemW * scale >= W && ys - a.half * scale <= 0 && ys + a.half * scale >= H;
      const page = pageRef.current;
      if (page) {
        if (p >= ZOOM[1] && B > 0) {
          // 5. The exit wipe: the split line tilts as it goes. Its foot swings out
          // to the left first, so the panel clears the bottom of the screen (where
          // the services carousel comes in) long before the top. What's left
          // is a wedge that falls away to the top-left.
          // The edge is soft: the panel blurs into the white across a band that
          // opens as the wipe starts (the landed split stays crisp), and the edge
          // overshoots so the band, too, ends up off the left of the screen.
          const v = exitP.current;
          const soft = Math.min(FEATHER_MAX, W * FEATHER);
          // The whole edge slides left while it spins, easing in and out so it
          // starts gently instead of lurching on the first bit of scroll.
          const top = B - (B + soft) * ((1 - Math.cos(v * Math.PI)) / 2);
          const e = {
            top,
            // The foot swings far past the left edge, so the edge turns well past
            // diagonal (a spin, not just a tilt). Never right of the top, so it
            // only ever leans one way.
            foot: Math.min(top, B - (SPIN * B + soft) * easeInOutCubic(range(v, 0, FOOT_OUT))),
            // Softens in step with the spin, so the blur and the turn start together.
            feather: soft * easeInOutCubic(range(v, 0, FOOT_OUT)),
            height: H,
          };
          page.style.left = "0px";
          setMask(page, edgeGone(e) ? "" : edgeMask(e, { left: 0, top: 0, width: W, height: H }));
          manifestoEdge.set(e);
        } else {
          page.style.left = `${p >= ZOOM[1] ? B : Math.max(B, edge)}px`;
          setMask(page, "");
        }
        page.style.opacity = covered ? "1" : "0";
      }
      // Once the page side has taken over, stop painting a 60× letter.
      name.style.visibility = covered && p >= ZOOM[1] ? "hidden" : "";
    }
    const chrome = 1 - range(p, ZOOM[0], ZOOM[0] + 0.08);
    stage?.querySelectorAll<HTMLElement>("[data-chrome]").forEach((el) => (el.style.opacity = String(chrome)));

    // The blurred footage fades in behind and the type turns white.
    const flip = easeOutCubic(range(p, ...FLIP));
    if (stage) stage.style.color = mix(FROM_FG, TO_FG, flip);
    if (footageRef.current) footageRef.current.style.opacity = String(flip);
    // Like the live site, the frame drifts down the clip as you scroll.
    if (videoRef.current) videoRef.current.style.objectPosition = `center ${20 + 60 * range(p, FLIP[0], 1)}%`;
    if (dotRef.current) dotRef.current.style.color = flip > 0.5 ? "inherit" : "";

    // 4. Land: the heading rises in the panel; on the white, the paragraphs are
    // already in place (they type themselves, see ManifestoBody).
    // The exit wipe passes over the heading; once it's covered, stop painting it.
    // The manifesto fades out with the wipe (heading and paragraphs), as Services fades in.
    const leave = 1 - easeInOutCubic(range(exitP.current, 0, EXIT_FADE));
    if (panelRef.current) {
      panelRef.current.style.visibility = exitP.current >= 1 ? "hidden" : "";
      panelRef.current.style.opacity = String(leave);
    }
    if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(0.7 * easeOutCubic(range(p, ...EYEBROW)));
    titleRefs.current.forEach((el, i) => {
      if (el) el.style.transform = `translate3d(0, ${110 * (1 - easeOutCubic(range(p, ...TITLE_LINES[i])))}%, 0)`;
    });
    if (bodyRef.current) bodyRef.current.style.opacity = stillRef.current ? "" : String(range(p, ...BODY) * leave);

    if (hintRef.current) hintRef.current.style.opacity = String(0.6 * (1 - range(p, 0, 0.06)));
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  }, []);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // The first paragraph types along the landing.
  const firstType = useTransform(scrollYProgress, FIRST_TYPE, [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!stillRef.current) apply(p);
  });

  // The moment the last paragraph has finished typing (its foot reaches the
  // typing line), the white page wipes left over the panel and becomes the
  // full-width background for the next section. Scrolling back up undoes it.
  // It follows the scroll: the panel shrinks off to the left as you go.
  const { scrollYProgress: exitProgress } = useScroll({
    target: lastParaRef,
    offset: [`end ${TYPED_LINE}`, `end ${TYPED_LINE - SWEEP}`],
  });
  // Shared with Services, which fades in along it.
  const wipe = manifestoHandoff;
  useMotionValueEvent(exitProgress, "change", (v) => {
    if (stillRef.current) return;
    wipe.set(v);
    exitP.current = v;
    apply(lastP.current);
  });

  // Aim the zoom at the stem of the first "t" ("Svayatta", index 5), measured untransformed.
  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const name = nameRef.current;
      const t = name?.firstElementChild?.children[5] as HTMLElement | undefined;
      const real = t?.querySelector<HTMLElement>("[data-real]");
      if (!stage || !name || !t || !real) return;
      const prev = name.style.transform;
      name.style.transform = "none";
      const s = stage.getBoundingClientRect();
      const n = name.getBoundingClientRect();
      const c = t.getBoundingClientRect();
      // The baseline: a zero-size box sitting on it.
      const marker = document.createElement("span");
      marker.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
      t.appendChild(marker);
      const baseline = marker.getBoundingClientRect().top;
      marker.remove();
      name.style.transform = prev;

      const stem = measureStem(real) ?? { left: c.width * 0.3, right: c.width * 0.55, mid: -c.height * 0.2, half: c.height * 0.1 };
      const ox = c.left - n.left + stem.left;
      const oy = baseline - n.top + stem.mid;
      aim.current = { ox, oy, x0: n.left - s.left + ox, y0: n.top - s.top + oy, stemW: stem.right - stem.left, half: stem.half };
      split.current = window.matchMedia("(min-width: 768px)").matches ? Math.round(stage.clientWidth * SPLIT) : 0;

      // Keep the stage pinned until the wipe is done, so the panel's bottom edge
      // never scrolls into view. The extra pinned scroll is taken back with a
      // negative margin: the next section rides up over the stage's last stretch
      // instead of waiting below it, so no blank white opens up.
      const tail = tailRef.current;
      const body = bodyRef.current;
      const last = lastParaRef.current;
      const section = sectionRef.current;
      if (tail && body && last && section) {
        const below = body.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom;
        const hold = split.current > 0 ? Math.max(0, Math.round((1 - TYPED_LINE + SWEEP) * stage.clientHeight - below)) : 0;
        tail.style.height = `${hold}px`;
        section.style.marginBottom = `${-hold}px`;
      }
      apply(lastP.current);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [apply]);

  // Reduced motion: the white word on footage, no pin and no zoom.
  useEffect(() => {
    if (prefersReducedMotion()) {
      stillRef.current = true;
      setStill(true);
      wipe.jump(1);
      manifestoEdge.jump(ALL_WHITE);
      apply(STILL_P);
    } else {
      exitP.current = exitProgress.get();
      wipe.jump(exitP.current);
      apply(scrollYProgress.get());
    }
    // Leaving the page: let Services show plainly wherever it's used next.
    return () => {
      wipe.jump(1);
      manifestoEdge.jump(ALL_WHITE);
    };
  }, [apply, exitProgress, scrollYProgress, wipe]);

  // Play the footage only while the section is on screen (poster frame under reduced motion).
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || still) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [still]);

  // Glyphs flicker while a letter is decoding (about 18 changes a second).
  useEffect(() => {
    if (still) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 55) {
        last = now;
        slots.current.forEach((s) => {
          if (s.state === STATE_SCRAMBLE) s.glyph.textContent = randomGlyph();
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still]);

  const titleLines = MANIFESTO_TITLE.split("\n");

  return (
    <section ref={sectionRef} id="who-we-are" aria-labelledby="we-are-title" className="relative">
      <h2 id="we-are-title" className="sr-only">
        We are Svayatta.
      </h2>

      <div
        ref={stageRef}
        aria-hidden="true"
        className={cn(
          "flex w-full flex-col items-center justify-center overflow-hidden bg-paper px-4 text-ink",
          still ? "relative min-h-[80svh] py-24" : "sticky top-0 h-[100svh]"
        )}
      >
        {/* The live site's background: hero footage, blurred, under a night gradient. */}
        <div ref={footageRef} className="pointer-events-none absolute inset-0 bg-night opacity-0">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-[12px] saturate-[1.3]"
            src="/videos/hero3.mp4"
            poster="/videos/hero3-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,26,61,0.4)_0%,rgba(6,26,61,0.6)_60%,rgba(6,26,61,0.85)_100%)]" />
        </div>

        {/* Corner meta, in the stage's current colour */}
        <div data-chrome className="pointer-events-none absolute inset-x-0 top-24 z-10 flex justify-between px-[clamp(16px,4vw,48px)] font-mono text-eyebrow uppercase opacity-60 md:top-28">
          <span>{"// "}Who we are</span>
          <span className="hidden sm:inline">Est. Mumbai</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div ref={topRef} className={cn(TOP_CLASS, "will-change-transform")}>
            <DecodeWord {...WORDS.we} register={register} />
            <span className="inline-block w-[0.25em]" />
            <DecodeWord {...WORDS.are} register={register} />
          </div>

          <div ref={nameRef} className={NAME_CLASS}>
            <DecodeWord {...WORDS.name} register={register} />
            <span ref={dotRef} className="ml-[0.03em] text-accent" style={{ opacity: 0 }}>
              .
            </span>
          </div>
        </div>

        {!still && (
          <>
            {/* The page side of the split: white, from the stem's edge (the split line at full zoom). */}
            <div ref={pageRef} className="pointer-events-none absolute inset-y-0 left-0 right-0 z-40 bg-paper opacity-0" />

            {/* The panel side: the manifesto heading rises in the footage (md and up). */}
            <div ref={panelRef} className="pointer-events-none absolute inset-0 z-30 hidden md:block [&_.em]:text-sky">
              <div
                className="absolute top-[30svh]"
                style={{ left: `calc(${gutter("100%")})`, width: `calc(${SPLIT * 100}% - ${gutter("100%")} - 2rem)` }}
              >
                {/* Above the heading, so the heading's first line sits level with the first paragraph. */}
                <p ref={eyebrowRef} className="absolute bottom-full mb-6 font-mono text-eyebrow uppercase opacity-0">
                  {"// "}Who we are
                </p>
                <p className={PANEL_TITLE_CLASS}>
                  {titleLines.map((line, i) => (
                    <span key={i} className="block overflow-hidden pb-[0.1em]">
                      <span
                        ref={(el) => {
                          titleRefs.current[i] = el;
                        }}
                        className="block translate-y-[110%]"
                      >
                        {em(line)}
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <p
              ref={hintRef}
              data-chrome
              className="absolute bottom-10 left-[clamp(16px,4vw,48px)] z-10 font-mono text-eyebrow uppercase"
            >
              Scroll
            </p>
            <div data-chrome className="absolute inset-x-[clamp(16px,4vw,48px)] bottom-6 z-10 h-px">
              <div className="absolute inset-0 bg-current opacity-15" />
              <div ref={barRef} className="relative h-full origin-left scale-x-0 bg-current" />
            </div>
          </>
        )}
      </div>

      {/* The manifesto scrolls over the pinned stage, on the white side of the split. */}
      <div className={cn("relative z-10", !still && "-mt-[100svh] [--track:420svh] md:[--track:500svh]")}>
        {/* The scene's scroll distance. */}
        <div ref={trackRef} aria-hidden="true" className={still ? "" : "h-[var(--track)]"} />
        {/* As the zoom ends the paragraphs sit 30% down the screen, level with the heading. They
            hold still there through the landing while the first one types, then scroll on. */}
        <div
          className="grid md:grid-cols-[2fr_3fr]"
          style={still ? undefined : { marginTop: `calc(30svh - var(--track) + ${LAND} * (var(--track) - 100svh))` }}
        >
          {still ? (
            <div aria-hidden="true" className="on-night hidden flex-col justify-center py-24 pr-8 md:flex" style={{ paddingLeft: `calc(${gutter("100vw")})` }}>
              <p className="mb-6 font-mono text-eyebrow uppercase opacity-70">{"// "}Who we are</p>
              <p className={PANEL_TITLE_CLASS}>{em(MANIFESTO_TITLE)}</p>
            </div>
          ) : (
            <div className="hidden md:block" />
          )}
          <div className="min-w-0">
            <div
              ref={bodyRef}
              className={cn(
                "min-h-[80svh] min-w-0 px-5 sm:px-[6vw] md:pl-[clamp(2rem,5vw,6rem)] md:pr-[calc((100vw_-_min(88vw,1280px))_/_2)]",
                still ? "py-24" : "sticky top-[30svh] pb-[24svh]"
              )}
            >
              <h2 id="manifesto-title" className="mb-10 text-display-m text-ink md:sr-only">
                {em(MANIFESTO_TITLE)}
              </h2>
              <ManifestoBody firstProgress={firstType} lastRef={lastParaRef} />
            </div>
            {/* The landing's scroll distance, over which the paragraphs stay stuck in place. */}
            {!still && <div aria-hidden="true" style={{ height: `calc(${+(1 - LAND).toFixed(3)} * (var(--track) - 100svh))` }} />}
          </div>
        </div>
        {/* The exit wipe's pinned scroll (sized in measure, and overlapped by the next section). */}
        {!still && <div ref={tailRef} aria-hidden="true" />}
      </div>
    </section>
  );
}
