"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

/**
 * A paragraph whose words ink in one by one as it scrolls through the
 * viewport (faint → full), and fade back on the way up.
 *
 * Markup in `text`: *word* = italic serif emphasis, **word** = key phrase,
 * ~word~ = aside, ^word^ = Devanagari in accent.
 * Reduced motion: plain text at full strength.
 */

export type Kind = "plain" | "em" | "key" | "aside" | "deva";
export interface Token {
  word: string;
  kind: Kind;
}

export function tokenize(text: string): Token[] {
  const out: Token[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|~([^~]+)~|\^([^^]+)\^|([^\s*^~]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[1]) m[1].split(/\s+/).forEach((w) => out.push({ word: w, kind: "key" }));
    else if (m[2]) m[2].split(/\s+/).forEach((w) => out.push({ word: w, kind: "em" }));
    else if (m[3]) m[3].split(/\s+/).forEach((w) => out.push({ word: w, kind: "aside" }));
    else if (m[4]) out.push({ word: m[4], kind: "deva" });
    else out.push({ word: m[5], kind: "plain" });
  }
  // Glue trailing punctuation that followed a marker (e.g. "^स्वयत्ता^,") onto the word before.
  return out.reduce<Token[]>((acc, t) => {
    if (acc.length && /^[,.;:!?)]+$/.test(t.word)) acc[acc.length - 1] = { ...acc[acc.length - 1], word: acc[acc.length - 1].word + t.word };
    else acc.push(t);
    return acc;
  }, []);
}

const CLASS: Record<Kind, string> = {
  plain: "",
  em: "em",
  key: "key",
  aside: "aside",
  deva: "deva text-accent",
};

function Word({ token, progress, from, to }: { token: Token; progress: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(progress, [from, to], [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={CLASS[token.kind]} lang={token.kind === "deva" ? "hi" : undefined}>
        {token.word}
      </motion.span>{" "}
    </>
  );
}

export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.55"] });
  const tokens = tokenize(text);

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {tokens.map((t, i) => (
          <span key={i}>
            <span className={CLASS[t.kind]} lang={t.kind === "deva" ? "hi" : undefined}>
              {t.word}
            </span>{" "}
          </span>
        ))}
      </p>
    );
  }

  const n = tokens.length;
  return (
    <p ref={ref} className={className}>
      {tokens.map((t, i) => {
        const from = (i / n) * 0.85;
        return <Word key={i} token={t} progress={scrollYProgress} from={from} to={from + 0.15} />;
      })}
    </p>
  );
}
