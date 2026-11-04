"use client";

import { useMotionValueEvent, useScroll, type MotionValue } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A paragraph that types itself out, letter by letter, as you scroll, with a
 * caret at the typing point (solid while typing, blinking when you pause).
 * Scrolling back un-types it.
 *
 * It types along its own trip through the viewport, or along `progress`
 * (0–1) when a scene drives it. The untyped rest is laid out but hidden, so
 * lines never reflow while typing.
 *
 * Markup in `text`: *word* = italic serif emphasis, **word** = key phrase,
 * ~word~ = aside, ^word^ = Devanagari in accent.
 * Screen readers get the whole text at once. Reduced motion: the full text, no caret.
 */

type Kind = "plain" | "em" | "key" | "aside" | "deva";
interface Segment {
  kind: Kind;
  chars: string[];
}

const CLASS: Record<Kind, string | undefined> = {
  plain: undefined,
  em: "em",
  key: "key",
  aside: "aside",
  deva: "deva text-accent",
};

// Split by grapheme so Devanagari clusters (स्व, त्ता) type as one letter each.
const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const graphemes = (s: string) => (segmenter ? Array.from(segmenter.segment(s), (g) => g.segment) : Array.from(s));

function parse(text: string): Segment[] {
  const out: Segment[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|~([^~]+)~|\^([^^]+)\^|([^*^~]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[1]) out.push({ kind: "key", chars: graphemes(m[1]) });
    else if (m[2]) out.push({ kind: "em", chars: graphemes(m[2]) });
    else if (m[3]) out.push({ kind: "aside", chars: graphemes(m[3]) });
    else if (m[4]) out.push({ kind: "deva", chars: graphemes(m[4]) });
    else out.push({ kind: "plain", chars: graphemes(m[5]) });
  }
  return out;
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

interface Part {
  shown: HTMLSpanElement;
  rest: HTMLSpanElement;
  caret: HTMLSpanElement;
  chars: string[];
}

export function TypeText({
  text,
  progress,
  offset = ["start 0.85", "end 0.6"],
  className,
}: {
  text: string;
  /** Drives the typing (0–1) instead of the paragraph's own scroll. */
  progress?: MotionValue<number>;
  offset?: ScrollOffset;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const segments = useMemo(() => parse(text), [text]);
  const total = useMemo(() => segments.reduce((n, s) => n + s.chars.length, 0), [segments]);
  const parts = useRef<Part[]>([]);
  const typed = useRef(-1);
  const still = useRef(false);
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { scrollYProgress } = useScroll({ target: ref, offset });
  const source = progress ?? scrollYProgress;

  const update = (v: number) => {
    const n = Math.round(Math.min(1, Math.max(0, v)) * total);
    if (n === typed.current) return;
    typed.current = n;
    let left = n;
    let caretAt = -1;
    parts.current.forEach((p, i) => {
      const k = Math.min(p.chars.length, Math.max(0, left));
      left -= p.chars.length;
      p.shown.textContent = p.chars.slice(0, k).join("");
      p.rest.textContent = p.chars.slice(k).join("");
      if (caretAt < 0 && k < p.chars.length) caretAt = i;
    });
    // The caret sits at the typing point while there's something typed and something left.
    parts.current.forEach((p, i) => {
      const on = !still.current && n > 0 && n < total && i === caretAt;
      p.caret.style.display = on ? "" : "none";
      if (on) {
        // Solid while typing; it starts blinking again once you stop.
        p.caret.style.animation = "none";
        clearTimeout(idle.current);
        idle.current = setTimeout(() => (p.caret.style.animation = ""), 500);
      }
    });
  };

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    parts.current = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-seg]")).map((el, i) => ({
      shown: el.querySelector<HTMLSpanElement>("[data-shown]")!,
      rest: el.querySelector<HTMLSpanElement>("[data-rest]")!,
      caret: el.querySelector<HTMLSpanElement>("[data-caret]")!,
      chars: segments[i].chars,
    }));
    typed.current = -1;
    still.current = prefersReducedMotion();
    update(still.current ? 1 : source.get());
    return () => clearTimeout(idle.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, source]);

  useMotionValueEvent(source, "change", (v) => {
    if (!still.current) update(v);
  });

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text.replace(/[*^~]/g, "")}</span>
      <span aria-hidden="true">
        {segments.map((s, i) => (
          <span key={i} data-seg className={CLASS[s.kind]} lang={s.kind === "deva" ? "hi" : undefined}>
            <span data-shown />
            <span data-caret className="type-caret" style={{ display: "none" }} />
            <span data-rest className="invisible">
              {s.chars.join("")}
            </span>
          </span>
        ))}
      </span>
    </p>
  );
}
