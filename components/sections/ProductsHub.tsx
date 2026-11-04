"use client";

import Image from "next/image";
import Link from "next/link";
import { em } from "@/lib/rich";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { ArrowCircle } from "@/components/ui/ArrowCircle";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import {
  CRUSAM_PROJECT,
  GROWMONT_CRM_PROJECT,
  GROWMONT_PMS_PROJECT,
  type Project,
} from "@/components/sections/ProjectsShowcase";

interface HubEntry {
  project: Project;
  href: string;
  /** A real screenshot; without one the card draws the product's mockup. */
  cover?: { src: string; alt: string };
}

const ENTRIES: HubEntry[] = [
  {
    project: CRUSAM_PROJECT,
    href: "/projects/crusam",
    cover: { src: "/images/Project_CruSam/Dashboard.png", alt: "CruSam payroll and finance dashboard" },
  },
  { project: GROWMONT_CRM_PROJECT, href: "/projects/growmont" },
  { project: GROWMONT_PMS_PROJECT, href: "/projects/growmont-pms" },
];

function Media({ entry }: { entry: HubEntry }) {
  const first = entry.project.slides[0];
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-media bg-night">
      {entry.cover ? (
        <Image
          src={entry.cover.src}
          alt={entry.cover.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover transition-transform duration-slow ease-expo group-hover:scale-[1.03]"
        />
      ) : typeof first === "string" ? (
        <Image src={first} alt={`${entry.project.name} screen`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
      ) : (
        <div className="absolute inset-0 transition-transform duration-slow ease-expo group-hover:scale-[1.03]">
          <DeviceMockup slide={first} />
        </div>
      )}
    </div>
  );
}

/** /projects: the work hub. One large card per product, each opening its own page. */
export function ProductsHub() {
  return (
    <>
      <section aria-labelledby="work-title" className="pb-12 pt-40 md:pb-16 md:pt-48">
        <Container>
          <Reveal>
            <Eyebrow className="mb-5">Work</Eyebrow>
            <h1 id="work-title" className="text-display-l text-ink">
              {em("Software that's\n*running today.*")}
            </h1>
            <p className="mt-6 max-w-[56ch] text-lead text-ink-2">
              {em("**Products we've built and still support**, for businesses that *run on them every day*.")}
            </p>
          </Reveal>
        </Container>
      </section>

      <section aria-label="Products" className="pb-24 md:pb-32">
        <Container>
          <ul className="flex flex-col gap-8 md:gap-10">
            {ENTRIES.map((entry, i) => {
              const p = entry.project;
              const live = p.status === "Live";
              return (
                <li key={entry.href}>
                  <Reveal delay={i * 0.06}>
                    <Link
                      href={entry.href}
                      className="group grid gap-6 rounded-card border border-line bg-paper p-4 transition-[border-color,box-shadow] duration-med ease-expo hover:border-line-strong hover:shadow-hover md:p-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12"
                    >
                      <div data-vt-media className="min-w-0">
                        <Media entry={entry} />
                      </div>
                      <div className="flex min-w-0 flex-col gap-4 px-1 pb-2 lg:pr-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-meta text-ink-3">{p.id}</span>
                          <Tag variant="status" status={live ? "live" : "in-development"}>
                            {p.tag.trim().replace(" - ", " · ")}
                          </Tag>
                        </div>
                        <h2 className="text-title-l text-ink">{p.name}</h2>
                        <p className="font-mono text-meta uppercase text-ink-3">{p.domain}</p>
                        <p className="text-body text-ink-2">{p.headline}</p>
                        <div className="flex flex-wrap gap-2">
                          {p.stack.slice(0, 3).map((s) => (
                            <Tag key={s} variant="soft">
                              {s}
                            </Tag>
                          ))}
                        </div>
                        <span className="mt-2 inline-flex items-center gap-3 text-button text-ink">
                          Open {p.name}
                          <ArrowCircle />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <Reveal className="mt-16 flex flex-col items-center gap-5 text-center">
            <p className="font-mono text-eyebrow uppercase text-ink-3">More products coming soon</p>
            <PillButton href="/discovery" variant="outline">
              Start your own project
            </PillButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
