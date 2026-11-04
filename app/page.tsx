import type { Viewport } from "next";
import { HOME_FAQ } from "@/lib/faq";
import { Hero } from "@/components/sections/Hero";
import { ValuesMarquee } from "@/components/sections/ValuesMarquee";
import { WeAreSvayatta } from "@/components/sections/WeAreSvayatta";
import { Process } from "@/components/sections/Process";
import { ServicesTrack } from "@/components/sections/ServicesTrack";
import { ClientVoices } from "@/components/sections/ClientVoices";
import { FAQSection } from "@/components/sections/FAQSection";
import { ClosingScene } from "@/components/sections/ClosingScene";
import { HeroDepth } from "@/components/motion/HeroDepth";

// Match the mobile browser bar to the night hero.
export const viewport: Viewport = {
  themeColor: "#061A3D",
};

// Section order: docs/redesign/02 §6. Motion: docs/redesign/MOTION.md.
// Antigravity sections are wired in as they land (see the comments).
export default function HomePage() {
  return (
    <>
      {/* Depth: the hero stays pinned and settles back while the paper sheet slides over it. */}
      <HeroDepth hero={<Hero />}>
        <ValuesMarquee />
        {/* Pinned scroll scene: "We are Svayatta" decodes, turns white on the footage, then the
            camera flies into the "t" and lands on the manifesto's split (panel left, page right). */}
        <WeAreSvayatta />
      </HeroDepth>

      {/* H4 <ClientCells />: Antigravity B2 */}
      {/* Products live on /projects only, not on the home scroll (owner, 4 Nov). */}
      {/* Services on React Bits' Flex Carousel: drag or flick the cards through a liquid lens.
          It fades in as the manifesto's panel wipes to white, so the two read as one page. */}
      <ServicesTrack handoff />

      {/* Same box: a small night card grows into the process stage. */}
      <Process />

      {/* Stacked cards: each testimonial slides over the last, which recedes. */}
      <ClientVoices />

      <FAQSection items={HOME_FAQ} />

      {/* Same box: "We build. You scale." grows into the closing band. */}
      <ClosingScene />
    </>
  );
}
