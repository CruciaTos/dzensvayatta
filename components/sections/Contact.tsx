import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { CONTACT_DETAILS } from "@/lib/data";

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="py-[120px] bg-bg-secondary border-t border-border relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top right, rgba(143,120,96,0.05) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-[5fr_7fr] gap-[120px] items-start max-[900px]:grid-cols-1 max-[900px]:gap-16">
          <FadeIn>
            <SectionIndex number="07" tag="Get In Touch" className="mb-8" />
            <h2 className="font-serif text-display-3 font-normal text-stone-100 leading-[1.1] mb-8 max-w-[420px]">
              Let&apos;s start the conversation.
            </h2>
            <p className="font-sans text-[14px] font-light text-stone-400 leading-[1.7] max-w-[420px] mb-10">
              Tell us what&apos;s slowing your team down. We&apos;ll respond within one business day with next steps. No sales deck, just a direct answer.
            </p>
            <Button as="a" href="mailto:hello@DZen.io" variant="primary" size="md">
              Send us a message →
            </Button>
          </FadeIn>

          <div className="grid grid-cols-2 gap-[2px] max-[600px]:grid-cols-1">
            {CONTACT_DETAILS.map((item) => (
              <div key={item.label} className="bg-bg-panel border border-border p-9 flex flex-col gap-3">
                <span className="font-mono text-[9px] tracking-[.14em] uppercase text-stone-500">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-sans text-[15px] font-normal text-stone-100 no-underline transition-colors duration-200 hover:text-accent"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="font-sans text-[15px] font-normal text-stone-100">
                    {item.value}
                  </span>
                )}
                {item.note && (
                  <span className="font-sans text-[12px] font-light text-stone-500">
                    {item.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
