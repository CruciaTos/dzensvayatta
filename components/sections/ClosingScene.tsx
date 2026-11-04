import { em } from "@/lib/rich";
import { SameBoxScene } from "@/components/motion/SameBoxScene";
import { CTABandContent } from "./CTABand";

const TITLE = "We build.\n*You scale.*";
const TITLE_CLASS = "text-mega uppercase text-night-ink";

/**
 * The home page's closing band as a "same box" scene: a small night card
 * saying "We build. You scale." grows into the full CTA band, and its words
 * grow into the band's headline. Elsewhere the plain <CTABand /> is used.
 */
export function ClosingScene() {
  return (
    <SameBoxScene
      aria-labelledby="cta-band-title"
      sourceClassName="h-[200px] w-[min(520px,86vw)]"
      sourceRadius={24}
      title={em(TITLE)}
      titleClassName={TITLE_CLASS}
      morphVh={80}
      holdVh={30}
      source={
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="font-mono text-meta uppercase text-night-muted">Ready to start?</p>
          <span data-sb-title-slot className="block" />
        </div>
      }
    >
      <div className="flex h-full flex-col justify-center py-16 md:py-24">
        <CTABandContent title={TITLE} sharedTitle />
      </div>
    </SameBoxScene>
  );
}
