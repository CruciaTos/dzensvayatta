import { pageMetadata } from "@/lib/seo";
import { em } from "@/lib/rich";
import { BUSINESS_FUNCTIONS } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CellGrid } from "@/components/ui/CellGrid";
import { Reveal } from "@/components/ui/Reveal";
import { CTABand } from "@/components/sections/CTABand";
import { ServicesIndex } from "@/components/sections/ServicesIndex";
import { MaskReveal } from "@/components/motion/MaskReveal";

export const metadata = pageMetadata("/services");

/**
 * /services (§7.4). Opens on the blue poster: a short title, then the services
 * as colour-coded cards beside their pinned group card. The business functions
 * invert on hover, and the page ends on the night CTA band.
 */
export default function ServicesPage() {
  return (
    <>
      {/* No overflow-hidden here: it would stop the group cards from sticking. */}
      <section aria-labelledby="services-title" className="section on-night bg-poster relative pt-32 md:pt-40">
        <Container>
          <header className="mb-14 grid gap-6 border-b border-white/15 pb-10 md:mb-20 md:pb-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
            <div>
              <Eyebrow tone="night" className="mb-5">
                Services
              </Eyebrow>
              <MaskReveal
                as="h1"
                id="services-title"
                immediate
                text={"Software, AI & automation\n*for how your business works.*"}
                className="max-w-[20ch] text-display-l text-night-ink"
              />
            </div>
            <p className="max-w-[44ch] text-lead text-night-muted lg:justify-self-end">
              {em("**Six things we build**, from AI agents to the payroll system underneath.")}
            </p>
          </header>

          <ServicesIndex />
        </Container>
      </section>

      <section aria-labelledby="where-title" className="section bg-surface text-ink">
        <Container>
          <div className="mb-10 md:mb-14">
            <Eyebrow className="mb-5">Where we help</Eyebrow>
            <MaskReveal id="where-title" text={"Across the\n*whole business*"} className="text-display-l text-ink" />
          </div>
          <CellGrid cols={3} className="bg-paper">
            {BUSINESS_FUNCTIONS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="group flex h-full min-h-[200px] flex-col justify-between p-7 transition-colors duration-[450ms] ease-expo hover:bg-ink hover:text-paper md:p-8">
                  <span className="font-mono text-meta text-ink-3 transition-colors duration-[450ms] group-hover:text-sky">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-title-m transition-transform duration-[450ms] ease-expo group-hover:translate-x-1.5">
                      {f.title}
                    </h3>
                    <p className="mt-2 font-serif text-[17px] italic text-ink-3 transition-colors duration-[450ms] group-hover:text-paper/75">
                      {f.example}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </CellGrid>
        </Container>
      </section>

      <CTABand title={"Not sure where\n*to start?*"} action={{ label: "Book a discovery call", href: "/discovery" }} />
    </>
  );
}
