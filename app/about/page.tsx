import { pageMetadata } from "@/lib/seo";
import { em } from "@/lib/rich";
import { SITE } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { FounderCards, PrincipleCards } from "@/components/sections/AboutSections";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { ScrollWords } from "@/components/motion/ScrollWords";

export const metadata = pageMetadata("/about");

/**
 * /about (§7.3; replaces the old Founders drawer). Traversal: the story's
 * स्वयत्ता stays pinned while the words ink in; the founders sit on reflective cards in a night band; the
 * principles flip; then the night CTA band.
 */
export default function AboutPage() {
  return (
    <>
      <h1 className="sr-only">A software &amp; AI studio, built on self-governance</h1>

      {/* Story: the word stays pinned while the paragraphs ink in. */}
      <section aria-labelledby="why-title" className="section bg-paper text-ink pt-32 md:pt-40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow className="mb-5">Our name</Eyebrow>
              <h2 id="why-title" className="text-display-m text-ink">
                Why
              </h2>
              <p lang="hi" className="deva mt-2 text-[clamp(4.5rem,11vw,9.5rem)] leading-[1.1] text-accent">
                स्वयत्ता
              </p>
              <p className="mt-3 font-mono text-meta uppercase text-ink-3">noun · self-governance</p>
            </div>
            <div className="flex flex-col gap-10 text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.45] tracking-[-0.01em] text-ink-2 lg:pt-24">
              <ScrollWords text="^स्वयत्ता^ means **self-governance**. It isn't a gimmick name; it's *the standard we hold our work to.*" />
              <ScrollWords text="We started as **two founders in Mumbai**, building for real businesses from day one: ~payroll for an accounts team, a CRM for wealth advisors, call handling for clinics.~" />
              <ScrollWords text="The standard is simple. *Systems that run on their own* and **keep improving after launch**, so your team spends its time on the work only people can do." />
            </div>
          </div>
        </Container>
      </section>

      {/* Founders on reflective cards, in a night band. */}
      <section aria-labelledby="founders-title" className="on-night bg-poster section relative overflow-hidden">
        <Container>
          <div className="mb-14 text-center">
            <Eyebrow tone="night" className="mb-5">
              The founders
            </Eyebrow>
            <MaskReveal id="founders-title" text={"Two founders,\n*one standard*"} className="text-display-l text-night-ink" />
            <p className="mx-auto mt-6 max-w-[48ch] text-body text-night-muted">
              {em("You talk to **the people who build your system**, from the first call to long after launch. ~Move your cursor over a card.~")}
            </p>
          </div>
          <FounderCards />
        </Container>
      </section>

      {/* Principles on flip cards. */}
      <section aria-labelledby="principles-title" className="section bg-paper text-ink">
        <Container>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow className="mb-5">How we work</Eyebrow>
              <MaskReveal id="principles-title" text={"Three things\n*we hold to*"} className="text-display-l text-ink" />
            </div>
            <p className="max-w-[32ch] text-small text-ink-3">Tap, click or drag a card to turn it over.</p>
          </div>
          <PrincipleCards />

          {/* Company facts */}
          <Reveal className="mt-20">
            <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line font-mono text-meta uppercase sm:grid-cols-3">
              {[
                ["Company", SITE.legalName],
                ["Based in", "Mumbai, India"],
                // [confirm] add the CIN once the incorporation certificate is issued
                ["Working with", "Businesses across India"],
              ].map(([k, v]) => (
                <div key={k} className="bg-paper p-6">
                  <dt className="text-ink-3">{k}</dt>
                  <dd className="mt-2 normal-case tracking-normal text-[15px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      <CTABand title={"Let's build\n*what's next.*"} />
    </>
  );
}
