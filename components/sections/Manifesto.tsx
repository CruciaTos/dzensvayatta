import type { MotionValue } from "motion/react";
import type { Ref } from "react";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { TypeText } from "@/components/motion/TypeText";

/**
 * "Quality, with clarity." The studio in three paragraphs (§H3). It has no
 * section of its own: the "We are Svayatta" zoom lands on it, with the
 * heading in the footage panel and these paragraphs on the white side
 * (see WeAreSvayatta.tsx). The paragraphs type themselves out as you scroll.
 */
export const MANIFESTO_TITLE = "Quality,\n*with clarity.*";

// Importance: *serif* for the name and the promise, **key** for what we do and
// for whom, ~aside~ for supporting detail, plain for the connective tissue.
const PARAGRAPHS = [
  "*Svayatta* is a **software and AI studio** from Mumbai. We build **the systems underneath a business** ~(payroll and finance tools, CRMs, AI assistants and the automations that connect them)~ for companies that have **outgrown spreadsheets and WhatsApp groups**.",
  "Our name comes from ^स्वयत्ता^, *self-governance*. That's the standard we build to: **systems that run reliably on their own**, so your team spends its time on the work only people can do.",
  "We're **founders, not a sales team**. We scope honestly, ship in small steps, and **stay on after launch** to keep improving what we've built. ~We aren't the cheapest option.~ *We aim to be the one you can rely on.*",
];

// A paragraph finishes typing when its last line reaches this far down the screen (0–1).
export const TYPED_LINE = 0.25;

/**
 * The first paragraph types along `firstProgress` (the scene holds it still
 * while it types); the others type as they scroll up into the reading zone.
 * `lastRef` gets the last paragraph, so the scene can tell when typing is done.
 */
export function ManifestoBody({
  firstProgress,
  lastRef,
}: {
  firstProgress?: MotionValue<number>;
  lastRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="flex flex-col gap-8 text-[clamp(1.25rem,2.1vw,1.75rem)] font-normal leading-[1.45] tracking-[-0.01em] text-ink-2">
      {PARAGRAPHS.map((text, i) => (
        <div key={i} ref={i === PARAGRAPHS.length - 1 ? lastRef : undefined}>
          <TypeText
            text={text}
            progress={i === 0 ? firstProgress : undefined}
            offset={["start 0.45", `end ${TYPED_LINE}`]}
          />
        </div>
      ))}
      <Reveal delay={0.32}>
        <PillButton href="/discovery" variant="outline">
          Start a conversation
        </PillButton>
      </Reveal>
    </div>
  );
}
