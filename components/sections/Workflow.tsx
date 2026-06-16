import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerContainer";
import {
  WORKFLOW_SOURCES,
  WORKFLOW_INTELLIGENCE,
  WORKFLOW_OUTPUTS,
} from "@/lib/data";
import type { WorkflowNode } from "@/types";

function WfNode({
  label,
  name,
  accent = false,
}: WorkflowNode & { accent?: boolean }) {
  return (
    <div
      className={[
        "flex flex-col justify-between p-7 px-8 border transition-colors duration-300 cursor-default",
        accent
          ? "bg-accent/[0.15] border-accent/30 hover:bg-accent/20"
          : "bg-bg-panel border-border hover:border-border-strong hover:bg-bg-tertiary",
      ].join(" ")}
    >
      <div
        className={[
          "font-mono text-[11px] tracking-[0.12em] uppercase mb-2",
          accent ? "text-accent" : "text-stone-500",
        ].join(" ")}
      >
        {label}
      </div>
      <div
        className={[
          "font-sans text-[15px] font-normal tracking-[-0.01em]",
          accent ? "text-accent-light" : "text-stone-100",
        ].join(" ")}
      >
        {name}
      </div>
    </div>
  );
}

export function Workflow() {
  return (
    <section
      id="workflow"
      aria-label="Workflow architecture"
      className="py-[120px] bg-bg-secondary border-t border-border"
    >
      <Container>
        {/* Header */}
        <FadeIn>
          <div className="flex items-start justify-between gap-12 mb-24 max-md:flex-col">
            <div>
              <SectionIndex number="02" tag="Workflow Architecture" className="mb-6" />
              <h2 className="font-serif text-display-3 font-normal text-stone-100">
                Every system you run,
                <br />
                working <em>as one</em>.
              </h2>
            </div>
            <div className="max-w-[360px] flex-shrink-0">
              <p className="font-sans text-body font-light text-stone-400 leading-[1.7]">

              </p>
            </div>
          </div>
        </FadeIn>

        {/* Diagram */}
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          {/* Row 1: Sources */}
          <StaggerContainer
            className="grid grid-cols-6 gap-[2px] mb-[2px] min-w-[600px]"
            staggerDelay={0.08}
          >
            {WORKFLOW_SOURCES.map((node) => (
              <StaggerItem key={node.name}>
                <WfNode {...node} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Connector label */}
          <FadeIn delay={0.3}>
            <div className="flex justify-center items-center gap-2 py-3">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-stone-500">
                Data Ingestion Layer
              </span>
              <svg width="160" height="2" viewBox="0 0 160 2" aria-hidden="true">
                <line x1="0" y1="1" x2="160" y2="1" stroke="rgba(216,211,203,0.16)" strokeDasharray="4 4" />
              </svg>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 0L12 6L6 12M0 6H12" stroke="#8F7860" strokeWidth="1.2" />
              </svg>
            </div>
          </FadeIn>

          {/* Row 2: AI Layer */}
          <FadeIn delay={0.2}>
            <div className="bg-accent/[0.15] border border-accent/30 flex flex-col p-9 px-10 mb-[2px] min-w-[600px]">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent mb-3">
                DZen Intelligence Layer
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {WORKFLOW_INTELLIGENCE.map((item, i) => (
                  <div key={item} className="flex items-center gap-4">
                    <span className="font-sans text-[13px] text-stone-300 px-4 py-2 border border-accent/20">
                      {item}
                    </span>
                    {i < WORKFLOW_INTELLIGENCE.length - 1 && (
                      <div className="w-4 h-px bg-accent/40" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Connector label */}
          <FadeIn delay={0.35}>
            <div className="flex justify-center items-center gap-2 py-3">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 0L12 6L6 12M0 6H12" stroke="#8F7860" strokeWidth="1.2" />
              </svg>
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-stone-500">
                Intelligent Output
              </span>
              <svg width="160" height="2" viewBox="0 0 160 2" aria-hidden="true">
                <line x1="0" y1="1" x2="160" y2="1" stroke="rgba(216,211,203,0.16)" strokeDasharray="4 4" />
              </svg>
            </div>
          </FadeIn>

          {/* Row 3: Outputs */}
          <StaggerContainer
            className="grid grid-cols-6 gap-[2px] min-w-[600px]"
            staggerDelay={0.08}
            initialDelay={0.1}
          >
            {WORKFLOW_OUTPUTS.map((node) => (
              <StaggerItem key={node.name}>
                <WfNode {...node} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Legend */}
        <FadeIn delay={0.1} className="flex gap-8 mt-16 pt-10 border-t border-border flex-wrap">
          {[
            { accent: false, label: "Existing systems — unchanged" },
            { accent: true, label: "DZen intelligence layer" },
            { accent: false, label: "Automated outputs — measurable outcomes" },
          ].map(({ accent, label }) => (
            <div key={label} className="flex items-center gap-[10px]">
              <div
                className={["w-[6px] h-[6px] flex-shrink-0", accent ? "bg-accent" : "bg-stone-500"].join(" ")}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone-500">
                {label}
              </span>
            </div>
          ))}
        </FadeIn>
      </Container>
    </section>
  );
}
