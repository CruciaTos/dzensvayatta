import type { Metadata } from "next";
import { em } from "@/lib/rich";
import { DISCOVERY_CALL_MINUTES } from "@/lib/discovery/time";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BookingCard } from "@/components/sections/discovery/BookingCard";

export const metadata: Metadata = {
  title: "Book a discovery call",
  description: `A ${DISCOVERY_CALL_MINUTES}-minute call to understand your workflows and tell you plainly what we'd build first.`,
  alternates: { canonical: "/discovery" },
};

export default function DiscoveryPage() {
  return (
    <>
      <section className="pb-14 pt-36 text-center md:pb-20 md:pt-44">
        <Container>
          <p className="inline-flex items-center gap-2 rounded-pill bg-tint px-3.5 py-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-accent">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            {DISCOVERY_CALL_MINUTES}-minute discovery call
          </p>
          <h1 className="mt-7 text-display-l text-ink">{em("Tell us about\n*your business.*")}</h1>
          <p className="mx-auto mt-6 max-w-[560px] text-body text-ink-2">
            {em("**Pick a time that suits you.** We'll look at your current setup and tell you *plainly* what we'd tackle first.")}
          </p>
        </Container>
      </section>

      <Section tone="surface" className="pt-12 md:pt-16">
        <BookingCard />
      </Section>
    </>
  );
}
