import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { STATS } from "@/lib/data";

export default function FoundingPrinciples() {
  return (
    <section
      id="founding-principles"
      aria-label="Founding principles"
      className="relative py-[120px] bg-bg-primary border-t border-border overflow-hidden"
    >
      <Container>
        <FadeIn>
          <div className="flex items-start justify-between gap-12 mb-24 max-md:flex-col">
            <div>
              <SectionIndex number="02" tag="Founding Principles" className="mb-8" />
              <h2 className="font-serif text-display-3 font-normal text-stone-100 tracking-[-0.02em]">
                The operating principles
                <br />
                behind <em className="text-accent italic">every build</em>.
              </h2>
            </div>

            <div className="max-w-[440px] flex-shrink-0 mt-2">
              <p className="font-sans text-body font-light text-stone-400 leading-[1.75]">
                DZen is built around systems that stay reliable under pressure,
                improve workflows intelligently, preserve human authority, and
                scale without creating operational debt.
              </p>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-4 border-t border-l border-border/60 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1"
          staggerDelay={0.1}
          aria-label="DZen founding principles"
        >
          {STATS.map((principle, index) => (
            <StaggerItem key={principle.description}>
              <article className="group relative min-h-[280px] border-r border-b border-border/60 bg-bg-secondary p-10 transition-all duration-500 hover:bg-bg-panel hover:shadow-[0_0_40px_-12px_rgba(143,120,96,0.15)] hover:z-10">
                {/* Radial gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, rgba(143,120,96,0.12) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex h-full flex-col justify-between gap-12">
                  <div>
                    <div className="mb-10 flex items-center justify-between gap-6">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 group-hover:text-accent/80 transition-colors duration-500">
                        Principle {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(143,120,96,0.5)] group-hover:shadow-[0_0_18px_rgba(143,120,96,0.7)] transition-shadow duration-500"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="font-serif text-[clamp(38px,3.8vw,56px)] font-normal leading-[0.95] tracking-[-0.04em] text-stone-100 transition-colors duration-500">
                      {principle.value}
                      {principle.accent && (
                        <span className="text-accent">{principle.accent}</span>
                      )}
                    </h3>
                  </div>

                  <div>
                    <p className="mb-5 font-sans text-[14px] font-light leading-[1.7] text-stone-400 group-hover:text-stone-300 transition-colors duration-500">
                      {principle.label}
                    </p>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80 group-hover:text-accent transition-colors duration-500">
                      {principle.description}
                    </div>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}