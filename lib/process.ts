import type { ProcessStep, Principle } from "@/types/content";

export const PROCESS_STEPS: ProcessStep[] = [
  {
    index: "01",
    label: "AUDIT",
    phase: "Discovery",
    title: "Workflow Audit",
    body: "We map how work actually moves through your business before writing any code: the tools, the edge cases, the legacy systems we have to respect.",
    outcome: "A process map, an integration list and a scoped estimate.",
  },
  {
    index: "02",
    label: "BLUEPRINT",
    phase: "Planning",
    title: "Execution Blueprint",
    body: "Every touchpoint documented, sequenced and risk-rated, with the highest-impact work first. Nothing built on assumptions.",
    outcome: "A sequenced plan with fixed milestones and a risk register.",
  },
  {
    index: "03",
    label: "BUILD",
    phase: "Engineering",
    title: "Build & Testing",
    body: "Built on your data and business rules, with human review at every critical step and a demo every week.",
    outcome: "Working software on your data, reviewed every week.",
  },
  {
    index: "04",
    label: "DEPLOY",
    phase: "Rollout",
    title: "Deploy & Optimise",
    body: "Small, controlled releases with rollback built in, training for your team and monitoring after go-live.",
    outcome: "A staged rollout, a trained team and ongoing support.",
  },
];

export const PRINCIPLES: Principle[] = [
  {
    title: "Clarity *before code*",
    body: "We document and sequence every touchpoint before writing a single line of software. When systems are designed around real workflows rather than assumptions, execution is fast and predictable.",
  },
  {
    title: "Systems that *outlast us*",
    body: "We build reliable infrastructure that eliminates traditional workflow redundancies and operates with self-governance. Your software should create lasting value and hold to its own standards long after launch day.",
  },
  {
    title: "Partners, *not projects*",
    body: "We grow by building alongside ambitious teams rather than delivering a one-off project and moving on. True operational leverage comes from systems that evolve as your business scales.",
  },
];

