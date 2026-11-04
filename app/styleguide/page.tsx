// Temporary: renders every shared component in light and night tones.
// Delete before launch (plan §3 "Done when").
import type { Metadata } from "next";
import { em } from "@/lib/rich";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CellGrid } from "@/components/ui/CellGrid";
import { Container } from "@/components/ui/Container";
import { EditorialCard } from "@/components/ui/EditorialCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LiveClock } from "@/components/ui/LiveClock";
import { Marquee } from "@/components/ui/Marquee";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { PillButton } from "@/components/ui/PillButton";
import { ProcessCard } from "@/components/ui/ProcessCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { CTABand } from "@/components/sections/CTABand";
import { FAQSection } from "@/components/sections/FAQSection";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const TYPE_SCALE = [
  ["text-display-xl", "display-xl", "We build the systems\n*your business runs on.*"],
  ["text-display-l", "display-l", "Products *we've shipped*"],
  ["text-display-m", "display-m", "Quality,\n*with clarity.*"],
  ["text-mega uppercase", "mega", "We build.\n*You scale.*"],
  ["text-title-l", "title-l", "Custom Software & ERP"],
  ["text-title-m", "title-m", "CruSam *Payroll & finance ERP*"],
  ["text-title-s", "title-s", "Workflow Audit"],
  ["text-lead", "lead", "We build the systems underneath a business, for companies that have outgrown spreadsheets."],
  ["text-body", "body", "Scoped with you, shipped in small steps, supported after launch."],
  ["text-small text-ink-2", "small", "Clients, sales and follow-ups for an advisory team, in sync across desktop and phone."],
] as const;

const SWATCHES = [
  ["paper", "bg-paper"],
  ["surface", "bg-surface"],
  ["tint", "bg-tint"],
  ["ink", "bg-ink"],
  ["ink-2", "bg-ink-2"],
  ["ink-3", "bg-ink-3"],
  ["accent", "bg-accent"],
  ["sky", "bg-sky"],
  ["night", "bg-night"],
  ["success", "bg-success"],
  ["danger", "bg-danger"],
] as const;

const FAQ = [
  {
    q: "How much does a *custom system* cost?",
    short: "It depends on scope. You'll get a range after one call.",
    a: "We price per milestone, never as an open-ended hourly bill.",
  },
  {
    q: "How long does a *project* take?",
    short: "Weeks, not months, for a first version.",
    a: "The audit takes 1–2 weeks. A first usable version usually follows in 4–8 weeks.",
  },
];

function Label({ children }: { children: string }) {
  return <p className="mb-4 mt-14 font-mono text-meta uppercase text-ink-3 first:mt-0">{children}</p>;
}

export default function StyleguidePage() {
  return (
    <>
      <Section className="pt-40">
        <SectionHeader
          as="h1"
          eyebrow="Styleguide"
          title={em("Design *system*")}
          description="Every shared component, in light and night. Temporary page."
          action={{ label: "Back home", href: "/" }}
        />

        <Label>Colour</Label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-11">
          {SWATCHES.map(([name, cls]) => (
            <div key={name}>
              <div className={`h-16 rounded-media border border-line ${cls}`} />
              <p className="mt-2 font-mono text-[11px] text-ink-3">{name}</p>
            </div>
          ))}
        </div>

        <Label>Type scale</Label>
        <div className="space-y-8">
          {TYPE_SCALE.map(([cls, name, text]) => (
            <div key={name} className="grid gap-2 border-b border-line pb-6 md:grid-cols-[140px_1fr]">
              <p className="font-mono text-meta uppercase text-ink-3">{name}</p>
              <p className={cls}>{em(text)}</p>
            </div>
          ))}
          <div className="grid gap-2 md:grid-cols-[140px_1fr]">
            <p className="font-mono text-meta uppercase text-ink-3">eyebrow / meta</p>
            <div className="space-y-3">
              <Eyebrow>Selected work</Eyebrow>
              <p className="font-mono text-meta uppercase text-ink-3">28 Sep 2026 · 8 min read</p>
              <p className="text-title-l">
                Why <span className="deva text-accent">स्वयत्ता</span>
              </p>
            </div>
          </div>
        </div>

        <Label>Buttons and links</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillButton href="/discovery" variant="outline">Start a conversation</PillButton>
          <PillButton href="/discovery" variant="dark">Book a discovery call</PillButton>
          <PillButton href="/discovery" variant="outline" size="sm">See our work</PillButton>
          <PillButton variant="dark" icon={false}>Button, no icon</PillButton>
          <TextLink href="/projects">See our work</TextLink>
          <TextLink href="https://www.linkedin.com/company/dzen-svayatta/" external arrow="↗">LinkedIn</TextLink>
        </div>

        <Label>Arrow circles</Label>
        <div className="flex items-center gap-4">
          {(["filled", "outline", "sky", "paper", "night"] as const).map((v) => (
            <span key={v} className="group inline-flex cursor-pointer items-center gap-2 rounded-pill border border-line px-3 py-2">
              <ArrowCircle variant={v} size={28} />
              <span className="font-mono text-[11px] text-ink-3">{v}</span>
            </span>
          ))}
        </div>

        <Label>Tags</Label>
        <div className="flex flex-wrap items-center gap-3">
          <Tag variant="tint">Works Offline</Tag>
          <Tag variant="soft">Role-Based Access</Tag>
          <Tag variant="mono">Next.js</Tag>
          <Tag variant="status" status="live">Live · Aarti Enterprises</Tag>
          <Tag variant="status" status="in-development">In development</Tag>
          <span className="rounded-media bg-ink-3 p-3">
            <Tag variant="onImage">View case study ↗</Tag>
          </span>
          <LiveClock />
        </div>

        <Label>Breadcrumbs</Label>
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: "Custom Software & ERP", href: "/styleguide" },
          ]}
        />
      </Section>

      <Section tone="surface" aria-label="Cards">
        <SectionHeader eyebrow="Selected work" title={em("Products *we've shipped*")} action={{ label: "All work", href: "/projects" }} />
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          <Reveal>
            <EditorialCard
              href="/projects"
              media={{ src: "/images/Crusam_Mockups/Dashboard_MD.png", alt: "CruSam dashboard with salary and invoice summaries" }}
              index="01"
              category="ERP · Payroll & finance"
              status={{ kind: "live", label: "Live · 2026" }}
              title={em("CruSam *Payroll & finance ERP*")}
              description="Replaced scattered spreadsheets with one desktop platform for employee records, salary processing, invoices and vouchers."
              tags={["Agentic AI Assistant", "Encrypted Local Storage", "Self-Updating App"]}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <EditorialCard
              href="/projects"
              media={{ src: "/images/Crusam_Mockups/salaryentry-analytics.png", alt: "Salary analytics screen" }}
              index="02"
              category="Analytics · Fund research"
              status={{ kind: "in-development", label: "In development" }}
              title={em("Growmont PMS *Fund analysis & scoring*")}
              description="Fund analysis and scoring for wealth managers."
              tags={["Scoring", "Research"]}
            />
          </Reveal>
        </div>

        <Label>Process cards</Label>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {["Audit", "Blueprint", "Build", "Deploy"].map((step, i) => (
            <Reveal key={step} delay={i * 0.08}>
              <ProcessCard
                index={`0${i + 1}`}
                label={step.toUpperCase()}
                phase="Discovery"
                title="Workflow Audit"
                body="We map how work actually moves through your business before writing any code."
                outcome="A process map, an integration list and a scoped estimate."
              />
            </Reveal>
          ))}
        </div>

        <Label>Media frame (placeholder)</Label>
        <div className="grid max-w-md grid-cols-2 gap-4">
          <MediaFrame ratio="4/5">
            <span className="absolute inset-0 flex items-center justify-center text-display-m text-ink-3">SB</span>
          </MediaFrame>
          <MediaFrame ratio="4/5" src="/images/Testimonials/PrafulThakre.png" alt="Praful Thakre" sizes="200px" />
        </div>
      </Section>

      <Section aria-label="Cell grid">
        <SectionHeader eyebrow="What we build" title={em("Services *we offer*")} action={{ label: "All services", href: "/services" }} />
        <CellGrid cols={3}>
          {["Agentic AI Systems", "Conversational AI", "Machine Learning & Analytics"].map((t, i) => (
            <a
              key={t}
              href="#"
              className="group flex min-h-[260px] flex-col justify-between p-8 transition-colors duration-[450ms] ease-expo hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper"
            >
              <span className="flex items-center justify-between">
                <span className="font-mono text-[13px] text-ink-3 group-hover:text-paper/75">0{i + 1}</span>
                <ArrowCircle variant="outline" size={28} className="group-hover:border-sky group-hover:bg-sky group-hover:text-night" />
              </span>
              <span className="text-title-l">{t}</span>
            </a>
          ))}
        </CellGrid>
      </Section>

      <Section tone="night" padded={false} contained={false} className="py-16">
        <Marquee
          items={["systems that *scale*", "systems that *think*", "systems that *last*"].map((t) => (
            <span key={t} className="pr-12 text-[clamp(2.5rem,6vw,5rem)] font-normal">
              {em(t)} <span className="text-night-muted">•</span>
            </span>
          ))}
        />
        <Marquee
          direction="right"
          className="mt-4"
          items={["quality with *clarity*", "built in *Mumbai*", "made for *India*"].map((t) => (
            <span key={t} className="pr-12 text-[clamp(2.5rem,6vw,5rem)] font-normal">
              {em(t)} <span className="text-night-muted">•</span>
            </span>
          ))}
        />
        <Container className="mt-16">
          <SectionHeader
            tone="night"
            eyebrow="Night tone"
            title={em("Software that's\n*running today.*")}
            description="Products we've designed, built and support for real teams."
            action={{ label: "All work", href: "/projects" }}
          />
          <div className="flex flex-wrap items-center gap-4">
            <PillButton href="/discovery" variant="light">Book a discovery call</PillButton>
            <PillButton href="/discovery" variant="sky">Start a project</PillButton>
            <PillButton href="/projects" variant="outline" tone="night">All work</PillButton>
            <TextLink href="/projects" tone="night">See our work</TextLink>
            <Tag variant="mono" tone="night">Flutter</Tag>
            <Tag variant="status" status="live" tone="night">Live</Tag>
            <LiveClock tone="night" />
          </div>
          <Breadcrumbs
            tone="night"
            className="mt-8"
            items={[
              { name: "Home", href: "/" },
              { name: "Work", href: "/projects" },
            ]}
          />
        </Container>
      </Section>

      <Section aria-label="Accordion">
        <Accordion items={FAQ.map((f) => ({ q: em(f.q), short: f.short, a: <p>{f.a}</p> }))} />
      </Section>

      <FAQSection items={FAQ} jsonLd={false} />
      <CTABand />
    </>
  );
}
