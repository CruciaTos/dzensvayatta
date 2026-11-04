"use client";

import ReflectiveCard from "@/components/reactbits/ReflectiveCard";
import FlipCard from "@/components/reactbits/FlipCard";
import { SITE } from "@/lib/site";
import { em } from "@/lib/rich";
import { Reveal } from "@/components/ui/Reveal";

/**
 * About page pieces that need the browser: the founders on React Bits
 * Reflective Cards (they mirror the site footage and tilt toward the cursor)
 * and the principles on Flip Cards (tap, click or drag to turn).
 */

export function FounderCards() {
  return (
    <div className="flex flex-wrap justify-center gap-10 md:gap-16">
      {SITE.founders.map((f, i) => {
        const [first, ...rest] = f.name.split(" ");
        return (
          <Reveal key={f.email} delay={i * 0.12}>
            <ReflectiveCard
              videoSrc="/videos/hero3.mp4"
              width="min(340px, 86vw)"
              height={470}
              radius={24}
              tint="#6CB4F0"
              grayscale={0.2}
              tiltStrength={10}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] [color:var(--rc-muted)]">
                  {/* [confirm] both founders' roles */}
                  <span>{f.role}</span>
                  <span>Mumbai</span>
                </div>
                <div className="mt-auto">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] [color:var(--rc-muted)]">
                    {String(i + 1).padStart(2, "0")} / Founder
                  </p>
                  <h3 className="mt-3 font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] [color:var(--rc-ink)]">
                    {first}
                    <br />
                    <em className="em [color:var(--rc-ink)]">{rest.join(" ")}</em>
                  </h3>
                  <div className="mt-6 flex flex-col gap-2 text-[14px]">
                    <a href={`mailto:${f.email}`} className="w-fit [color:var(--rc-ink)] hover:underline">
                      {f.email}
                    </a>
                    {f.linkedin && (
                      <a
                        href={f.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit [color:var(--rc-muted)] hover:[color:var(--rc-ink)]"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ReflectiveCard>
          </Reveal>
        );
      })}
    </div>
  );
}

const PRINCIPLES = [
  {
    title: "Clarity\n*before code*",
    body: "We map how work moves through your business before we build anything. No vague promises and no guesswork.",
  },
  {
    title: "Systems that\n*outlast us*",
    body: "We build systems designed to grow with you. They update themselves, back themselves up and keep running without us in the room.",
  },
  {
    title: "Partners,\n*not projects*",
    body: "We're not here to take a payment and move on. We stay after launch and keep improving what we've built.",
  },
];

export function PrincipleCards() {
  return (
    <div className="grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {PRINCIPLES.map((p, i) => (
        <Reveal key={p.title} delay={i * 0.08}>
          <FlipCard
            width={360}
            height={400}
            radius={22}
            background="#061A3D"
            color="#E9F1F5"
            shadowColor="#061A3D"
            shadowOpacity={0.3}
            ariaLabel={`Principle ${i + 1}. Flip for details.`}
            front={
              <div className="on-night flex h-full flex-col justify-between p-8">
                <span className="font-mono text-meta uppercase text-night-muted">
                  {String(i + 1).padStart(2, "0")} / Principle
                </span>
                <p className="font-display text-[clamp(2rem,3vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-night-ink">
                  {em(p.title)}
                </p>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-sky">Tap or drag to flip ↻</span>
              </div>
            }
            back={
              <div className="flex h-full flex-col justify-between bg-sky p-8 text-night">
                <span className="font-mono text-meta uppercase opacity-70">{String(i + 1).padStart(2, "0")} / Why</span>
                <p className="text-[clamp(1.25rem,1.8vw,1.5rem)] font-medium leading-[1.35] tracking-[-0.01em]">{p.body}</p>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">Flip back ↺</span>
              </div>
            }
          />
        </Reveal>
      ))}
    </div>
  );
}
