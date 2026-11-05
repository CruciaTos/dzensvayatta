import Image from "next/image";
import { em } from "@/lib/rich";
import { cn } from "@/lib/utils";
import { PillButton } from "@/components/ui/PillButton";
import { TextLink } from "@/components/ui/TextLink";
import { HeroVideo } from "./HeroVideo";
import { HeroBackdrop } from "./HeroBackdrop";
import type { VeilWord } from "@/components/reactbits/DitherVeilWord";
import { HeroName } from "./HeroName";

type HeroMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster: string };

interface HeroProps {
  /**
   * Background photo or video. Without it the hero uses a calm night
   * gradient. // [asset] plan §H1: Mumbai dusk, founders at work, or a
   * licensed abstract night clip (AVIF poster ≤ 250KB, H.264 1080p ≤ 2.5MB).
   * The bottom-left 55% of the frame must stay calm so the headline reads.
   */
  media?: HeroMedia;
  /**
   * Leave the background out (photo, video or slats, and the readability
   * shade): the page draws <HeroBackground> itself, behind the hero, so it can
   * stay full-bleed while the hero settles back (HeroDepth's `backdrop`).
   */
  detachedBackground?: boolean;
}

/**
 * The hero's background: photo, video or the moving slats on the night
 * gradient, the film grain, and the shade that keeps the headline readable.
 */
export function HeroBackground({ media }: { media?: HeroMedia }) {
  return (
    <div className="on-night bg-poster absolute inset-0 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 scale-[1.02] transition-transform duration-[12000ms] ease-expo [@media(hover:hover)]:group-hover/hero:scale-[1.06]"
      >
        {media?.type === "image" && (
          <Image src={media.src} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        {media?.type === "video" && (
          <HeroVideo src={media.src} poster={media.poster} className="absolute inset-0 size-full object-cover" />
        )}
        {!media && (
          <>
            <div className="absolute inset-0 bg-night bg-[radial-gradient(ellipse_60%_55%_at_80%_12%,rgba(108,180,240,0.16),transparent_62%),radial-gradient(ellipse_55%_45%_at_96%_88%,rgba(11,92,130,0.28),transparent_70%),radial-gradient(ellipse_70%_60%_at_0%_100%,rgba(11,92,130,0.18),transparent_70%)]" />
            <HeroBackdrop />
          </>
        )}
      </div>
      {/* Keeps the headline readable over the photo, video or slats. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,26,61,0.45)_0%,rgba(6,26,61,0.15)_38%,rgba(6,26,61,0.70)_76%,rgba(6,26,61,0.94)_100%)]"
      />
    </div>
  );
}

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/dzen-svayatta/" },
  // [confirm] which Instagram handle stays
  { label: "Instagram", href: "https://instagram.com/dzensvayatta" },
];

const GUTTER = "px-[clamp(20px,4vw,64px)]";

// The name in English and in Marathi (Devanagari), swapped through a dithered veil.
const NAME_WORDS: VeilWord[] = [
  { text: "SVAYATTA", family: "var(--font-sans), sans-serif", weight: 800, letterSpacing: -0.04 },
  {
    // Gotu: broad-nib calligraphy (system Devanagari fonts as the fallback).
    text: "स्वयत्ता",
    family: "var(--font-marathi), 'Nirmala UI', 'Kohinoor Devanagari', 'Noto Sans Devanagari', Mangal, sans-serif",
    weight: 400,
    lang: "mr",
  },
];

/**
 * Full-bleed night hero (§H1): the name, big in the middle, is the only loud
 * thing. The offer (a small H1), two small CTAs and the meta bar sit quietly
 * along the bottom.
 */
export function Hero({ media, detachedBackground = false }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "on-night bg-poster group/hero relative isolate h-[100svh] min-h-[640px] max-h-[960px] overflow-hidden",
        // The background is drawn behind it: keep the poster's text colours, drop its paint and grain.
        detachedBackground && "bg-transparent bg-none after:hidden"
      )}
    >
      {!detachedBackground && <HeroBackground media={media} />}

      {/* The name, big in the middle: every few seconds it swaps between
          English and Marathi, a burst sweeping across and the letters
          dissolving through dither dots. */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center", GUTTER)}
      >
        <HeroName words={NAME_WORDS} inkOpacity={0.94} className="h-[min(19vw,34svh)] w-full" />
      </div>

      {/* Everything else stays small and quiet, on one line above the meta bar. */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-[76px] flex flex-col items-center gap-4 text-center md:bottom-[84px] md:flex-row md:justify-between md:text-left",
          GUTTER
        )}
      >
        <h1
          id="hero-title"
          className="animate-rise text-[clamp(1rem,1.4vw,1.25rem)] font-medium leading-snug tracking-[-0.01em] text-white/90"
        >
          {em("We build the systems *your business runs on.*")}
        </h1>
        <div className="animate-rise-fade flex items-center gap-5 [--rise-from:14px] [animation-delay:250ms]">
          <PillButton href="/discovery" variant="light" size="sm">
            Book a discovery call
          </PillButton>
          <TextLink href="/projects" tone="night" className="text-[13px]">
            See our work
          </TextLink>
        </div>
      </div>

      {/* Meta bar */}
      <div
        className={cn(
          "animate-rise-fade absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-night-line bg-[rgba(6,26,61,0.35)] py-[18px] font-mono text-[11px] uppercase tracking-[0.1em] text-white/70 backdrop-blur-[10px] [--rise-from:14px] [animation-delay:350ms] md:text-[12px]",
          GUTTER
        )}
      >
        <p>
          Software · AI · Automation studio <span aria-hidden="true">/</span>
          <span className="sr-only">,</span> Mumbai · India
        </p>
        <p className="hidden normal-case tracking-normal lg:block">
          <span lang="hi" className="deva text-[15px] text-sky">
            स्वयत्ता
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.1em]"> — self-governance</span>
        </p>
        <ul className="hidden items-center gap-5 sm:flex">
          <li aria-hidden="true">Follow</li>
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-fast hover:text-white"
              >
                {s.label} <span aria-hidden="true">+</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
