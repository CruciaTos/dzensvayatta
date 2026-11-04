import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://svayatta.in";

interface BreadcrumbsProps {
  items: { name: string; href: string }[];
  tone?: "light" | "night";
  className?: string;
}

/** Mono breadcrumb trail plus BreadcrumbList JSON-LD. The last item is the current page. */
export function Breadcrumbs({ items, tone = "light", className }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href === "/" ? "" : item.href}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]",
          tone === "night" ? "text-night-muted" : "text-ink-3"
        )}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item.href}>
              {i > 0 && (
                <li aria-hidden="true" className="opacity-60">
                  /
                </li>
              )}
              <li>
                {last ? (
                  <span aria-current="page" className={tone === "night" ? "text-night-ink" : "text-ink"}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "transition-colors duration-fast",
                      tone === "night" ? "hover:text-night-ink" : "hover:text-ink"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </nav>
  );
}
