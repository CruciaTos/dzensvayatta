import { em } from "@/lib/rich";
import { Container } from "@/components/ui/Container";
import { PillButton } from "@/components/ui/PillButton";
import { TextLink } from "@/components/ui/TextLink";

interface CTABandProps {
  eyebrow?: string;
  /** Rich string; rendered uppercase in the mega size. */
  title?: string;
  action?: { label: string; href: string };
  note?: string;
  /** Marks the heading as a SameBoxScene's shared title (data-sb-title). */
  sharedTitle?: boolean;
}

/** The night band that closes every page before the footer (§H10). */
export function CTABand(props: CTABandProps) {
  return (
    <section aria-labelledby="cta-band-title" className="on-night bg-poster relative overflow-hidden py-24 md:py-[140px]">
      <CTABandContent {...props} />
    </section>
  );
}

/**
 * The band's contents without its own section, for the home page's closing
 * "same box" scene, where a button's box grows into the band.
 * `sharedTitle` marks the heading so the scene can move its title into it.
 */
export function CTABandContent({
  eyebrow = "Ready to start?",
  title = "We build.\n*You scale.*",
  action = { label: "Start a project", href: "/discovery" },
  note = "30-minute call · NDA available on request",
  sharedTitle = false,
}: CTABandProps) {
  return (
    <Container className="flex flex-col items-center text-center">
      <p className="font-mono text-meta uppercase text-night-muted">{eyebrow}</p>

      <div className="mt-8 grid w-full items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
        <div className="hidden justify-self-start lg:block">
          <TextLink href="/discovery" tone="night" className="font-mono text-meta uppercase">
            Book a discovery call
          </TextLink>
        </div>
        <h2
          id="cta-band-title"
          data-sb-title={sharedTitle || undefined}
          className="text-mega uppercase text-night-ink"
        >
          {em(title)}
        </h2>
        <p className="hidden justify-self-end font-mono text-meta uppercase text-night-muted lg:block">
          Mumbai · Remote · India
        </p>
      </div>

      <PillButton href={action.href} variant="light" className="mt-12">
        {action.label}
      </PillButton>
      <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.12em] text-night-muted">{note}</p>
    </Container>
  );
}
