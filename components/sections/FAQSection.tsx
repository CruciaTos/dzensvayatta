import { em, plain } from "@/lib/rich";
import type { FaqItem } from "@/types/content";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

const WHATSAPP_HREF = "https://wa.me/919152035526";

interface FAQSectionProps {
  items: FaqItem[];
  eyebrow?: string;
  /** Rich string. */
  title?: string;
  action?: { label: string; href: string };
  id?: string;
  /** Emit FAQPage JSON-LD. Only one FAQPage per URL, so turn off for a second block. */
  jsonLd?: boolean;
}

/** Section header + accordion + FAQPage schema (§H9). */
export function FAQSection({
  items,
  eyebrow,
  title = "Frequently\n*asked*",
  action = { label: "Got questions?", href: WHATSAPP_HREF },
  id = "faq",
  jsonLd = true,
}: FAQSectionProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: plain(item.q),
      acceptedAnswer: { "@type": "Answer", text: plain(item.a) },
    })),
  };

  return (
    <Section id={id} aria-labelledby={`${id}-title`}>
      <SectionHeader id={`${id}-title`} eyebrow={eyebrow} title={em(title)} action={action} />
      <Accordion
        items={items.map((item) => ({
          q: em(item.q),
          short: item.short,
          a: <p>{em(item.a)}</p>,
        }))}
      />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      )}
    </Section>
  );
}
