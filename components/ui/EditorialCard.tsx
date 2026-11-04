import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Media, WorkStatus } from "@/types/content";
import { MediaFrame, type MediaRatio } from "./MediaFrame";
import { Tag } from "./Tag";

interface EditorialCardProps {
  href: string;
  media: Media;
  index: string; // "01"
  category: string; // "ERP · PAYROLL & FINANCE"
  status?: { kind: WorkStatus; label: string };
  title: ReactNode; // em("CruSam *Payroll & finance ERP*")
  description: string;
  tags?: string[];
  ratio?: MediaRatio;
  /** Label of the pill that fades up over the image on hover. */
  hoverLabel?: string;
  headingAs?: "h2" | "h3";
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/** Work card: media, mono meta line, title, two-line description, tags (§H5). */
export function EditorialCard({
  href,
  media,
  index,
  category,
  status,
  title,
  description,
  tags = [],
  ratio = "16/10",
  hoverLabel = "View case study ↗",
  headingAs: Heading = "h3",
  priority,
  sizes = "(min-width: 768px) 44vw, 100vw",
  className,
}: EditorialCardProps) {
  return (
    <article className={cn("group relative", className)}>
      {/* data-vt-media: this media grows into the case-study hero on click (docs/redesign/MOTION.md §3). */}
      <div data-vt-media>
        <MediaFrame
          src={media.src}
          alt={media.alt}
          ratio={ratio}
          zoom
          priority={priority}
          sizes={sizes}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 translate-y-1.5 opacity-0 transition-[opacity,transform] duration-med ease-expo group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:hidden"
          >
            <Tag variant="onImage">{hoverLabel}</Tag>
          </span>
        </MediaFrame>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-b border-line pb-1.5 font-mono text-meta uppercase text-ink-3">
        <span className="flex min-w-0 items-center gap-3">
          <span className="font-semibold text-ink">{index}</span>
          <span className="truncate">{category}</span>
        </span>
        {status && (
          <Tag variant="status" status={status.kind} className="shrink-0 border-0 px-0">
            {status.label}
          </Tag>
        )}
      </div>

      <Heading className="mt-4 text-title-m text-ink">
        {/* The whole card is clickable through this link's ::after overlay. */}
        <Link
          href={href}
          className="after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
        >
          {title}
        </Link>
      </Heading>
      <p className="mt-2 line-clamp-2 text-small text-ink-2">{description}</p>

      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <Tag variant="tint">{tag}</Tag>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
