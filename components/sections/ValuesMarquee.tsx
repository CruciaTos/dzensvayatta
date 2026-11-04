import { Fragment } from "react";
import { em } from "@/lib/rich";
import { Marquee } from "@/components/ui/Marquee";

const ROW_ONE = ["systems that *scale*", "systems that *think*", "systems that *last*", "systems that *run themselves*"];
const ROW_TWO = ["quality with *clarity*", "built in *Mumbai*", "made for *India*", "we build, you *scale*"];

function row(items: string[]) {
  return items.map((text) => (
    <Fragment key={text}>
      <span className="pr-8 md:pr-12">{em(text)}</span>
      <span aria-hidden="true" className="pr-8 text-line-strong md:pr-12">
        •
      </span>
    </Fragment>
  ));
}

/** Two slow rows in opposite directions (§H2). */
export function ValuesMarquee() {
  return (
    <section aria-label="What we stand for" className="border-b border-line py-12 md:py-[72px]">
      <p className="sr-only">
        Svayatta: systems that scale, think and last. Quality with clarity, built in Mumbai for India.
      </p>
      <div
        aria-hidden="true"
        className="flex flex-col gap-2 font-display text-[clamp(2.75rem,7vw,7.5rem)] font-normal leading-[1.08] tracking-[-0.03em] text-ink"
      >
        <Marquee items={row(ROW_ONE)} direction="left" duration={36} />
        <Marquee items={row(ROW_TWO)} direction="right" duration={36} />
      </div>
    </section>
  );
}
