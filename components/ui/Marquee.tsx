import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: ReactNode[];
  direction?: "left" | "right";
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
  /**
   * Classes for each item. Space items with padding (e.g. "pr-10"), not gap,
   * so the seam between the two copies matches the space between items.
   */
  itemClassName?: string;
}

/**
 * A CSS-only infinite strip. The track is rendered twice and slides by half
 * its width, so the loop has no seam. The copy is hidden from screen readers.
 * Under prefers-reduced-motion it stands still.
 */
export function Marquee({
  items,
  direction = "left",
  duration = 32,
  className,
  itemClassName,
}: MarqueeProps) {
  const track = (copy: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy || undefined}>
      {items.map((item, i) => (
        <li key={i} className={cn("shrink-0", itemClassName)}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("flex overflow-clip", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 motion-reduce:animate-none",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
