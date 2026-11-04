import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  tone?: "light" | "night";
  /** Opens in a new tab. */
  external?: boolean;
  /** Trailing arrow: "→" (default), "↗" or none. */
  arrow?: "→" | "↗" | false;
  className?: string;
}

/** Underlined text link ending in an arrow that nudges on hover. */
export function TextLink({
  href,
  children,
  tone = "light",
  external,
  arrow = "→",
  className,
}: TextLinkProps) {
  const classes = cn(
    "group/link inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors duration-fast",
    tone === "night" ? "text-night-ink" : "text-ink",
    className
  );
  const content = (
    <>
      <span
        className={cn(
          "underline decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-fast",
          tone === "night"
            ? "decoration-night-line group-hover/link:decoration-night-ink"
            : "decoration-line-strong group-hover/link:decoration-ink"
        )}
      >
        {children}
      </span>
      {arrow && (
        <span
          aria-hidden="true"
          className="transition-transform duration-med ease-expo group-hover/link:translate-x-[3px]"
        >
          {arrow}
        </span>
      )}
    </>
  );

  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
