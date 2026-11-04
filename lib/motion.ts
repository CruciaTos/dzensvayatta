// Motion tokens and helpers, ported from CruDoc's "same box" guideline
// (Svayatta-CruDoc/CruDoc/design/motion-transitions.md). Read
// docs/redesign/MOTION.md before building a transition.

/** One leg of a tap-driven transition: 250ms, easeOutCubic, no bounce. */
export const LEG_MS = 250;
export const LEG_S = LEG_MS / 1000;

/** easeOutCubic, for motion (`ease`) and CSS (`transition-timing-function`). */
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;
export const EASE_OUT_CUBIC_CSS = "cubic-bezier(0.33, 1, 0.68, 1)";

/** Look changes (e.g. a pill becoming a card) run over the middle of the motion. */
export const LOOK_START = 0.15;
export const LOOK_END = 0.85;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/** Maps t from [start, end] to [0, 1], clamped. */
export const range = (t: number, start: number, end: number) => clamp01((t - start) / (end - start));

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number; // corner radius in px
}

/** The box grows on all four sides from `a` to `b`. */
export const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  r: lerp(a.r, b.r, t),
});

/** A DOM rect relative to a container's top-left, as a Box. */
export function boxOf(el: Element, container: Element, r = 0): Box {
  const e = el.getBoundingClientRect();
  const c = container.getBoundingClientRect();
  return { x: e.left - c.left, y: e.top - c.top, w: e.width, h: e.height, r };
}

/**
 * The transform that draws an element laid out at `to` inside the box `at`,
 * scaled with it (never cut off). Use with transform-origin: 0 0.
 */
export function fitInto(to: Box, at: Box): string {
  const s = at.w / to.w;
  return `translate3d(${at.x - to.x}px, ${at.y - to.y}px, 0) scale(${s})`;
}

/** The transform that moves an element laid out at `to` so it sits exactly on `from`. */
export function flipFrom(from: Box, to: Box): string {
  const s = from.w / to.w;
  return `translate3d(${from.x - to.x}px, ${from.y - to.y}px, 0) scale(${s})`;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
