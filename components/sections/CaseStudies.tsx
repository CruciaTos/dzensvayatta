"use client";

import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export function CaseStudies() {
  return (
    <section
      id="cases"
      aria-label="Case studies and results"
      className="py-[120px] bg-bg-secondary border-t border-border"
    >
      <Container>
        {/* Header */}
        <FadeIn>
          <div className="flex items-end justify-between mb-20 gap-12 max-md:flex-col max-md:items-start">
            <div>
              <SectionIndex number="04" tag="Results" className="mb-6" />
              <h2 className="font-serif text-display-3 font-normal text-stone-100">
                Outcomes, not promises.
              </h2>
            </div>
          </div>
        </FadeIn>

        {/* First engagement panel */}
        <FadeIn delay={0.1}>
          <div className="border border-border bg-bg-panel p-16 max-md:p-10 relative overflow-hidden">
            {/* Subtle accent glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top left, rgba(143,120,96,0.04) 0%, transparent 55%)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-[720px]">
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent mb-8">
                Early Adopter Engagement
              </div>

              <h3 className="font-serif text-[clamp(26px,3vw,42px)] font-normal text-stone-100 leading-[1.15] tracking-[-0.015em] mb-8">
                We&apos;re selecting our first clients with the same rigour we apply to every deployment.
              </h3>

              <p className="font-sans text-[15px] font-light text-stone-400 leading-[1.75] mb-6">
                DZen is purpose-built for mid-market and enterprise operators who know their biggest efficiency gains are locked inside systems that don&apos;t talk to each other. We&apos;re not running pilots or proofs of concept — we&apos;re building production-grade integrations from day one.
              </p>

              <p className="font-sans text-[15px] font-light text-stone-400 leading-[1.75] mb-14">
                If your operations involve manual reconciliation, fragmented data across ERPs, CRMs, or finance tools, and a team spending time on work that should be automated — we want to talk. Early engagements receive our full founding-team attention and preferred commercial terms.
              </p>

              <div className="flex items-center gap-6 flex-wrap pt-10 border-t border-border">
                <Button as="a" href="#cta" variant="primary" size="md">
                  Start the conversation →
                </Button>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-stone-500">
                  Discovery briefing · No obligation · NDA available on request
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}