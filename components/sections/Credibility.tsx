import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import { STATS } from "@/lib/data";

export function Credibility() {
  return (
    <section
      id="credibility"
      aria-label="Our standards and approach"
      className="py-[120px] bg-bg-primary"
    >
      <Container>
        {/* Section header */}
        <FadeIn>
          <div className="flex items-start justify-between gap-12 mb-20 max-md:flex-col">
            <div>
              <SectionIndex number="01" tag="Built to a Standard" className="mb-6" />
              <h2 className="font-serif text-display-3 font-normal text-stone-100">
                The principles every
                <br />
                engagement is built on.
              </h2>
            </div>
            <div className="max-w-[380px] flex-shrink-0">
              <p className="font-sans text-body font-light text-stone-400 leading-[1.7]" />
            </div>
          </div>
        </FadeIn>

        {/* Principles grid */}
        <StaggerContainer
          className="grid grid-cols-4 auto-rows-fr border-t border-l border-border max-[900px]:grid-cols-2 max-[480px]:grid-cols-1"
          staggerDelay={0.1}
          aria-label="Engagement principles"
        >
          {STATS.map((stat, i) => (
            <StaggerItem key={stat.description}>
              <article className="p-12 px-10 border-r border-b border-border relative overflow-hidden transition-colors duration-300 hover:bg-bg-tertiary group h-full flex flex-col">
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at top left, rgba(143,120,96,0.04) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                {/* Watermark index */}
                <div
                  className="absolute top-[-10px] right-[-8px] font-serif text-[120px] font-normal leading-none pointer-events-none select-none"
                  style={{ color: "rgba(143,120,96,0.07)" }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-serif text-[clamp(44px,5vw,72px)] font-normal leading-none tracking-[-0.02em] text-stone-100 mb-3">
                  {stat.value}
                  <span className="text-accent">{stat.accent}</span>
                </div>
                <div className="font-sans text-[15px] font-normal text-stone-400 leading-[1.6] mb-6">
                  {stat.label}
                </div>
                <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent px-2 py-1 border border-accent/20 bg-accent/[0.08] w-fit mt-auto">
                  {stat.description}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}