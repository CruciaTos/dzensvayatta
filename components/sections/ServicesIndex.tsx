"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { SERVICES, SERVICE_GROUPS } from "@/lib/services";
import { cn } from "@/lib/utils";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The /services index (§7.4): the three groups, each in its own colour from
 * the brand palette (sky, cobalt, violet). On the left a night card names the
 * group and stays pinned while its services pass; on the right each service is
 * a full card (what it is, its tagline, what it covers, a way to start),
 * washed in the group's colour. A link to /services#slug lands on that card
 * and lights it up for a moment.
 */

// Per group: the glow (as "r g b", for tints) and a deeper ink that reads on white.
const LOOK: Record<string, { tint: string; ink: string; name: string; blurb: string }> = {
  ai: {
    tint: "108 180 240",
    ink: "#2b78c9",
    name: "AI & Automation",
    blurb: "Agents, assistants and models that take routine work off your team.",
  },
  software: {
    tint: "30 91 214",
    ink: "#1e5bd6",
    name: "Software",
    blurb: "The systems your business runs on, built to last long after launch.",
  },
  growth: {
    tint: "126 120 212",
    ink: "#5d57c9",
    name: "Growth",
    blurb: "Getting found, and turning the people who find you into customers.",
  },
};

export function ServicesIndex() {
  const [lit, setLit] = useState<string | null>(null);

  // Arriving on /services#slug lights that card up for a moment.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const fromHash = () => {
      const slug = window.location.hash.slice(1);
      if (!SERVICES.some((s) => s.slug === slug)) return;
      setLit(slug);
      clearTimeout(timer);
      timer = setTimeout(() => setLit(null), 2200);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  return (
    <div className="flex flex-col gap-20 md:gap-28">
      {SERVICE_GROUPS.map((group) => {
        const look = LOOK[group.id];
        const items = SERVICES.filter((s) => s.group === group.id);
        const tint = { "--tint": look.tint, "--tint-ink": look.ink } as CSSProperties;
        return (
          <div key={group.id} style={tint} className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-10">
            {/* The group, pinned while its services pass. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="on-night bg-poster poster-deep relative flex min-h-[220px] ring-1 ring-white/15 shadow-[0_30px_60px_-30px_rgba(6,26,61,0.7)] flex-col justify-between overflow-hidden rounded-[24px] p-7 lg:min-h-[300px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(var(--tint)/0.75),transparent)]"
                />
                <p className="relative font-mono text-meta uppercase text-night-muted">({group.index})</p>
                <div className="relative mt-10">
                  <h2 className="font-display text-[clamp(1.9rem,2.6vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.025em] text-night-ink">
                    {look.name}
                  </h2>
                  <p className="mt-3 max-w-[30ch] text-small text-night-muted">{look.blurb}</p>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-night-muted">
                    {items.length} {items.length === 1 ? "service" : "services"}
                  </p>
                </div>
              </div>
            </div>

            <ul className="flex flex-col gap-5">
              {items.map((s, i) => (
                <li key={s.slug} id={s.slug} className="scroll-mt-32">
                  <Reveal delay={i * 0.06}>
                    <article
                      className={cn(
                        "group relative overflow-hidden rounded-[24px] border border-line bg-paper p-7 transition-[transform,box-shadow,border-color] duration-[450ms] ease-expo md:p-9",
                        "hover:-translate-y-1 hover:border-[rgb(var(--tint)/0.45)] hover:shadow-[0_28px_60px_-30px_rgb(var(--tint)/0.65)]",
                        lit === s.slug && "border-[rgb(var(--tint)/0.7)] shadow-[0_0_0_4px_rgb(var(--tint)/0.25)]"
                      )}
                    >
                      {/* The group's colour, washed into the corner. */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(var(--tint)/0.3),transparent)] transition-transform duration-700 ease-expo group-hover:scale-125"
                      />
                      {/* Big faint index. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-[0.18em] right-5 select-none font-display text-[clamp(7rem,13vw,11rem)] font-extrabold leading-none tracking-[-0.06em] text-[rgb(var(--tint)/0.1)]"
                      >
                        {s.index}
                      </span>

                      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
                        <div className="flex flex-col">
                          <p className="font-mono text-meta uppercase text-[color:var(--tint-ink)]">
                            {s.index} / {look.name}
                          </p>
                          <h3 className="mt-4 font-display text-[clamp(1.75rem,2.8vw,2.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink">
                            {s.title}
                          </h3>
                          <p className="mt-3 font-serif text-[18px] italic text-[color:var(--tint-ink)]">{s.tagline.join(" · ")}</p>
                          <p className="mt-4 max-w-[46ch] text-body text-ink-2">{s.summary}</p>
                          <div className="mt-8 lg:mt-auto lg:pt-8">
                            <PillButton href="/discovery" variant="dark">
                              Talk to us about this
                            </PillButton>
                          </div>
                        </div>

                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">What it covers</p>
                          <ul className="mt-4">
                            {s.painPoints.map((p, k) => (
                              <li
                                key={p}
                                className="flex items-baseline gap-4 border-t border-line py-3.5 text-[16px] leading-snug text-ink last:border-b"
                              >
                                <span className="font-mono text-[12px] text-[color:var(--tint-ink)]">
                                  {String(k + 1).padStart(2, "0")}
                                </span>
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
