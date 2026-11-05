"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { boxOf, easeOutCubic, flipFrom, lerpBox, range, type Box } from "@/lib/motion";

type Tone = "night" | "surface" | "paper";

const TONE: Record<Tone, string> = {
  night: "on-night bg-poster",
  surface: "bg-surface text-ink",
  paper: "bg-paper text-ink",
};

interface SameBoxSceneProps {
  /**
   * What the small box shows before it grows: a teaser card or a button.
   * Put an element with `data-sb-title-slot` in it to mark where the shared
   * title starts. It fades out over the first quarter of the motion.
   */
  source: ReactNode;
  /** Size of the box at rest, e.g. "h-[220px] w-[min(620px,86vw)]". */
  sourceClassName: string;
  /** Corner radius of the box at rest, px. */
  sourceRadius?: number;
  /** Vertical alignment of the source box in the viewport before growing. */
  sourceAlign?: "center" | "start";
  /**
   * The shared title: drawn once, it moves and scales from the slot in
   * `source` to the element marked `data-sb-title` inside `children`.
   */
  title?: ReactNode;
  /** Classes for the moving title (the destination heading's classes). */
  titleClassName?: string;
  /** Look of the box and the stage. Source and stage share it: one box. */
  tone?: Tone;
  /** Gap between the stage and the viewport edges at the end, px ("depth"). */
  inset?: number;
  /** Stage corner radius at the end, px. */
  radius?: number;
  /** Scroll distance for the growth, in viewport heights. */
  morphVh?: number;
  /** Scroll distance the finished stage stays pinned, in viewport heights. */
  holdVh?: number;
  /**
   * Start growing as soon as the small box's centre reaches the centre of the
   * screen (before the scene pins), and grow outward around that centre at an
   * even pace, so the box never drifts. Off: it grows once the scene pins.
   */
  growFromCentre?: boolean;
  /**
   * After the hold, the stage keeps growing until it fills the whole screen
   * (no inset, no rounded corners), so the section that follows can carry on
   * the same background. Also drops the frame padding on small screens.
   */
  expandToFull?: boolean;
  /** Scroll distance for that final expansion, in viewport heights. */
  expandVh?: number;
  /** Destination content, laid out inside the stage. */
  children: ReactNode;
  className?: string;
  stageClassName?: string;
  id?: string;
  "aria-labelledby"?: string;
}

type Mode = "static" | "scroll";

// By this point of the motion the moving title has joined the stage content
// (which starts fading in at 0.55).
const TITLE_LOCK = 0.55;
// Where a box with sourceAlign="start" rests below the frame's top (md:pt-10); scroll mode is lg and up.
const START_PAD = 40;
// Even pace with soft ends (growFromCentre): no rush at the start, no crawl at the end.
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * The "same box" scroll transition (docs/redesign/MOTION.md): a box at the
 * end of one section grows on all four sides into the background card of the
 * next one, and its title moves into place. The last frame is the stage at
 * rest; scrolling back plays the same motion in reverse.
 *
 * Desktop only. On small screens, with reduced motion, or when the stage
 * content is taller than the viewport, it renders as a plain section.
 */
export function SameBoxScene({
  source,
  sourceClassName,
  sourceRadius = 20,
  sourceAlign = "center",
  title,
  titleClassName,
  tone = "night",
  inset = 12,
  radius = 28,
  morphVh = 90,
  holdVh = 35,
  growFromCentre = false,
  expandToFull = false,
  expandVh = 40,
  children,
  className,
  stageClassName,
  id,
  "aria-labelledby": labelledBy,
}: SameBoxSceneProps) {
  const [mode, setMode] = useState<Mode>("static");
  const sceneRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);

  const geo = useRef<{ rest: Box; stage: Box; full: Box; titleFrom?: Box; titleTo?: Box } | null>(null);
  const tRef = useRef(0);
  // Progress of the final expansion to full screen (0 = stage at rest).
  const uRef = useRef(0);
  const extraVh = expandToFull ? expandVh : 0;

  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end end"] });

  const apply = useCallback(
    (t: number, u = 0) => {
      const g = geo.current;
      const box = boxRef.current;
      const content = contentRef.current;
      if (!g || !box || !content) return;
      const ease = growFromCentre ? easeInOutSine : easeOutCubic;
      const grown = lerpBox(g.rest, g.stage, ease(t));
      const b = u > 0 ? lerpBox(g.stage, g.full, easeInOutSine(u)) : grown;

      box.style.left = `${b.x}px`;
      box.style.top = `${b.y}px`;
      box.style.width = `${b.w}px`;
      box.style.height = `${b.h}px`;
      box.style.borderRadius = `${b.r}px`;
      // Once it opens out to full screen, its background is held to the screen so
      // the next section can carry on the identical (fixed) background with no seam.
      box.style.backgroundAttachment = u > 0 ? "fixed" : "";

      if (sourceRef.current) {
        const o = 1 - range(t, 0, 0.25);
        sourceRef.current.style.opacity = String(o);
        sourceRef.current.style.visibility = o === 0 ? "hidden" : "visible";
      }

      // Destination content is scaled with the box (never cut off) and fades
      // in once the box is mostly open.
      // (Never scaled up past its laid-out size: past the stage it stays centred.)
      const s = Math.min(1, b.w / g.stage.w, b.h / g.stage.h);
      const dx = (b.w - g.stage.w * s) / 2;
      const dy = (b.h - g.stage.h * s) / 2;
      content.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${s})`;
      const o = range(t, 0.55, 0.95);
      content.style.opacity = String(o);
      content.style.visibility = o === 0 ? "hidden" : "visible";

      // One title: the clone carries it until the last frame, where the real
      // heading (same place, same size) takes over. It leaves the slot in the
      // small box and, before the stage's content fades in, locks onto where
      // the real heading sits inside the growing stage, so from then on it
      // moves in step with the rest of the content and the hand-off is exact.
      const real = content.querySelector<HTMLElement>("[data-sb-title]");
      if (cloneRef.current && g.titleFrom && g.titleTo) {
        const done = t >= 0.999;
        const inStage: Box = {
          x: b.x + dx + (g.titleTo.x - g.stage.x) * s,
          y: b.y + dy + (g.titleTo.y - g.stage.y) * s,
          w: g.titleTo.w * s,
          h: g.titleTo.h * s,
          r: 0,
        };
        const at = lerpBox(g.titleFrom, inStage, ease(range(t, 0, TITLE_LOCK)));
        cloneRef.current.style.transform = flipFrom(at, g.titleTo);
        cloneRef.current.style.visibility = done ? "hidden" : "visible";
        if (real) real.style.visibility = done ? "visible" : "hidden";
      }
    },
    [growFromCentre]
  );

  const measure = useCallback(() => {
    const frame = frameRef.current;
    const rest = restRef.current;
    const box = boxRef.current;
    const content = contentRef.current;
    if (!frame || !rest || !box || !content) return false;

    const W = frame.clientWidth;
    const H = frame.clientHeight;
    const stage: Box = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2, r: radius };

    content.style.width = `${stage.w}px`;
    content.style.height = "auto";
    const natural = content.scrollHeight;
    if (natural > stage.h) return false; // doesn't fit: fall back to a plain section
    content.style.height = `${stage.h}px`;

    const restBox = boxOf(rest, frame, sourceRadius);
    geo.current = { rest: restBox, stage, full: { x: 0, y: 0, w: W, h: H, r: 0 } };
    // Growing from the centre: the box rests in the middle of the frame, and the
    // scene is pulled up so the box still sits where it would at the top
    // (START_PAD down). The frame then pins exactly when the box's centre meets
    // the screen's, and the box grows in place from there.
    if (growFromCentre && sceneRef.current) {
      sceneRef.current.style.marginTop = `${-Math.max(0, restBox.y - START_PAD)}px`;
    }

    // Title end: lay out the last frame and read the real heading.
    const real = content.querySelector<HTMLElement>("[data-sb-title]");
    const clone = cloneRef.current;
    if (real && clone) {
      apply(1);
      content.style.transform = "none";
      const titleTo = boxOf(real, frame);
      clone.style.left = `${titleTo.x}px`;
      clone.style.top = `${titleTo.y}px`;
      clone.style.width = `${titleTo.w}px`;
      // Same line layout as the heading (it may be centred), so lines don't shift at the hand-off.
      clone.style.textAlign = getComputedStyle(real).textAlign;

      // Title start: size the slot to the title at 45%, then lay out the first frame.
      apply(0);
      const slot = sourceRef.current?.querySelector<HTMLElement>("[data-sb-title-slot]");
      if (slot) {
        slot.style.width = `${titleTo.w * 0.45}px`;
        slot.style.height = `${titleTo.h * 0.45}px`;
        geo.current = { ...geo.current, titleFrom: boxOf(slot, frame), titleTo };
      }
    }
    apply(tRef.current, uRef.current);
    return true;
  }, [apply, growFromCentre, inset, radius, sourceRadius]);
  // Decide the mode after hydration (the server always renders "static").
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(wide.matches && !still.matches ? "scroll" : "static");
    decide();
    wide.addEventListener("change", decide);
    still.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      still.removeEventListener("change", decide);
    };
  }, []);

  useLayoutEffect(() => {
    if (mode !== "scroll") return;
    const frame = frameRef.current;
    if (!frame) return;
    const run = () => {
      if (!measure()) setMode("static");
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(frame);
    document.fonts?.ready.then(run).catch(() => {});
    return () => ro.disconnect();
  }, [mode, measure]);

  // Clear every inline style when leaving scroll mode, so the static layout is clean.
  useLayoutEffect(() => {
    if (mode !== "static") return;
    for (const el of [boxRef.current, contentRef.current, sourceRef.current]) el?.removeAttribute("style");
    sceneRef.current?.style.removeProperty("margin-top");
    contentRef.current
      ?.querySelector<HTMLElement>("[data-sb-title]")
      ?.style.removeProperty("visibility");
  }, [mode]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (mode !== "scroll") return;
    const travelled = p * (morphVh + holdVh + extraVh);
    const t = Math.min(1, travelled / morphVh);
    const u = extraVh > 0 ? Math.min(1, Math.max(0, (travelled - morphVh - holdVh) / extraVh)) : 0;
    tRef.current = t;
    uRef.current = u;
    apply(t, u);
  });

  const scroll = mode === "scroll";

  return (
    <section
      ref={sceneRef}
      id={id}
      aria-labelledby={labelledBy}
      data-mode={mode}
      className={cn(
        "relative",
        !scroll && !expandToFull && "px-3 py-3",
        // Pulled up over the previous section's foot: drawn above it, and see-through outside the box.
        scroll && growFromCentre && "pointer-events-none z-30",
        className
      )}
      style={scroll ? { height: `${100 + morphVh + holdVh + extraVh}vh` } : undefined}
    >
      <div ref={frameRef} className={cn(scroll ? "sticky top-0 h-screen overflow-hidden" : "relative")}>
        {/* Where the box sits at rest, before it grows (measured, never seen). */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 flex justify-center",
            sourceAlign === "start" && !growFromCentre ? "items-start pt-6 md:pt-10" : "items-center",
            !scroll && "hidden"
          )}
        >
          <div ref={restRef} className={sourceClassName} />
        </div>

        {/* The box: one element from first frame to last. */}
        <div
          ref={boxRef}
          className={cn(
            TONE[tone],
            "overflow-hidden",
            scroll ? "pointer-events-auto absolute left-0 top-0 will-change-[width,height,left,top]" : cn("relative", expandToFull ? "[background-attachment:fixed]" : "rounded-[28px]"),
            stageClassName
          )}
        >
          {scroll && (
            <div ref={sourceRef} className="absolute inset-0 flex items-center justify-center">
              {source}
            </div>
          )}
          <div
            ref={contentRef}
            className={cn(scroll ? "absolute left-0 top-0 origin-top-left" : "relative")}
          >
            {children}
          </div>
        </div>

        {/* The moving title (scroll mode only). */}
        {scroll && title && (
          <div
            ref={cloneRef}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute origin-top-left",
              // It's drawn outside the box, so give its serif words the box's colour rule (pale sky on the night gradient).
              tone === "night" && "[&_.em]:text-[var(--sky-pale)]",
              titleClassName
            )}
          >
            {title}
          </div>
        )}
      </div>
    </section>
  );
}
