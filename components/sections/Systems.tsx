"use client";

import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { IntegrationLogoMarquee } from "@/components/sections/IntegrationMarquee";

export function Systems() {
  return (
    <section
      id="systems"
      aria-label="Systems we integrate"
      className="py-[120px] bg-bg-primary border-t border-border"
    >
      <Container>
        {/* Header */}
        <FadeIn className="mb-12">
          <SectionIndex number="04" tag="Integration Catalogue" className="mb-6" />
          <div className="flex items-end justify-between gap-12 max-md:flex-col">
            <h2 className="font-serif text-display-3 font-normal text-stone-100">
              Systems we connect.
            </h2>
          </div>
        </FadeIn>

        <div className="mb-20">
          <IntegrationLogoMarquee maxWidth={1200} />
        </div>
      </Container>
    </section>
  );
}