"use client";

import { useReducedMotion } from "motion/react";
import { em } from "@/lib/rich";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import ScrollExpand from "@/components/reactbits/ScrollExpand";
import AccordionGallery from "@/components/reactbits/AccordionGallery";

const SCREENS = [
  { image: "/images/Project_CruSam/Dashboard.png", label: "Dashboard", alt: "CruSam dashboard" },
  { image: "/images/Project_CruSam/SalaryEntry.jpeg", label: "Salary entry", alt: "CruSam salary entry screen" },
  { image: "/images/Project_CruSam/SAexpanded.jpeg", label: "Salary analytics", alt: "CruSam salary analytics" },
  { image: "/images/Project_CruSam/Invoice.jpeg", label: "Invoices", alt: "CruSam invoice screen" },
  { image: "/images/Project_CruSam/Voucher.jpeg", label: "Vouchers", alt: "CruSam voucher screen" },
  { image: "/images/Project_CruSam/MasterData.jpeg", label: "Master data", alt: "CruSam master data screen" },
];

const TAGS = ["Agentic AI assistant", "Encrypted local storage", "Self-updating app"];

/**
 * CruSam deep dive (on /projects/crusam): the dashboard opens from a card to the full
 * screen as you scroll (React Bits Scroll Expand), then its screens sit in an
 * Accordion Gallery you can hover through.
 */
export function WorkSpotlight() {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="work-spotlight-title" className="relative bg-paper text-ink">
      <Container className="section !pb-10 md:!pb-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <Eyebrow className="mb-5">Inside CruSam</Eyebrow>
            <h2 id="work-spotlight-title" className="text-display-l text-ink">
              {em("A closer look,\n*screen by screen.*")}
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="shrink-0">
            <PillButton href="/projects" variant="outline">
              All projects
            </PillButton>
          </Reveal>
        </div>
      </Container>

      <ScrollExpand
        useWindowScroll
        src="/images/Project_CruSam/Dashboard.png"
        alt="CruSam payroll and finance ERP dashboard"
        startWidth={64}
        startHeight={58}
        startRadius={18}
        endRadius={0}
        mediaZoom={1.12}
        scrollDistance={reduce ? 0 : 1.1}
        holdDistance={reduce ? 0 : 0.55}
        smoothing={0.08}
        overlayScrim={0.7}
        enabled={!reduce}
      >
        {/* A soft night vignette so the copy reads over the busy dashboard. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(6,26,61,0.88),rgba(6,26,61,0.55)_70%,rgba(6,26,61,0.35))]"
        />
        <div className="relative flex max-w-[760px] flex-col items-center gap-5 text-center md:gap-6 [&_.aside]:text-white/55 [&_.em]:text-sky [&_.key]:text-white">
          <Tag variant="status" tone="night">
            Live · Aarti Enterprises
          </Tag>
          <h3 className="text-display-l text-white">{em("CruSam\n*Payroll that runs itself.*")}</h3>
          <p className="max-w-[56ch] text-lead text-white/80">
            {em("One desktop platform for **employee records, salary processing, invoices and vouchers**, with *an AI assistant built in*. ~It replaced a pile of spreadsheets.~")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TAGS.map((t) => (
              <Tag key={t} variant="mono" tone="night">
                {t}
              </Tag>
            ))}
          </div>
          <PillButton href="/discovery" variant="light">
            Start a project like this
          </PillButton>
        </div>
      </ScrollExpand>

      <Container className="section !pt-12 md:!pt-16">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <Eyebrow>The screens</Eyebrow>
          <p className="hidden font-mono text-eyebrow uppercase text-ink-3 md:block">Hover to open a screen</p>
        </div>
        <Reveal>
          <div className="hidden md:block">
            <AccordionGallery
              items={SCREENS}
              height={460}
              gap={10}
              radius={16}
              expandRatio={0.62}
              accentColor="#6CB4F0"
              overlayColor="#061A3D"
              textColor="#ffffff"
              tilt={6}
            />
          </div>
          <div className="md:hidden">
            <AccordionGallery
              items={SCREENS.slice(0, 4)}
              orientation="vertical"
              trigger="click"
              height={520}
              gap={8}
              radius={14}
              expandRatio={0.6}
              accentColor="#6CB4F0"
              overlayColor="#061A3D"
              textColor="#ffffff"
              tilt={0}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
