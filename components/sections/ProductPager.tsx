import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Previous / next product at the foot of each product page. Moving between
 * siblings swipes the page sideways (NavigationEffects + globals.css).
 * Large type that slides on hover, so the way on feels like part of the page.
 */

const PRODUCTS = [
  { href: "/projects/crusam", name: "CruSam", note: "Payroll & finance ERP" },
  { href: "/projects/growmont", name: "Growmont CRM", note: "Clients, sales & follow-ups" },
  { href: "/projects/growmont-pms", name: "Growmont PMS", note: "Fund analysis platform" },
];

export function ProductPager({ current }: { current: string }) {
  const i = PRODUCTS.findIndex((p) => p.href === current);
  const prev = PRODUCTS[(i - 1 + PRODUCTS.length) % PRODUCTS.length];
  const next = PRODUCTS[(i + 1) % PRODUCTS.length];

  return (
    <nav aria-label="More products" className="border-t border-line bg-paper text-ink">
      <div className="grid md:grid-cols-2">
        {[
          { item: prev, label: "Previous product", dir: "prev" as const },
          { item: next, label: "Next product", dir: "next" as const },
        ].map(({ item, label, dir }) => (
          <Link
            key={dir}
            href={item.href}
            data-vt-skip
            className={cn(
              "group relative flex flex-col gap-3 overflow-hidden px-[clamp(16px,4vw,48px)] py-12 transition-colors duration-[450ms] ease-expo hover:bg-ink hover:text-paper md:py-16",
              dir === "next" ? "md:items-end md:border-l md:border-line md:text-right" : "border-b border-line md:border-b-0"
            )}
          >
            <span className="font-mono text-meta uppercase text-ink-3 transition-colors duration-[450ms] group-hover:text-paper/60">
              {dir === "prev" ? "← " : ""}
              {label}
              {dir === "next" ? " →" : ""}
            </span>
            <span
              className={cn(
                "font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.03em] transition-transform duration-[450ms] ease-expo",
                dir === "next" ? "group-hover:-translate-x-3" : "group-hover:translate-x-3"
              )}
            >
              {item.name}
            </span>
            <span className="font-serif text-[17px] italic text-ink-3 transition-colors duration-[450ms] group-hover:text-paper/70">
              {item.note}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
