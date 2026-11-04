"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatIstTime, isStudioOpen } from "@/lib/time";

interface LiveClockProps {
  tone?: "light" | "night";
  className?: string;
}

/**
 * Mono chip with the current IST time, e.g. "09:24 PM IST", and a dot that's
 * green during studio hours. The server renders a placeholder so the HTML
 * always matches; the real time fills in after hydration.
 */
export function LiveClock({ tone = "light", className }: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const open = now ? isStudioOpen(now) : false;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 font-mono text-meta uppercase",
        tone === "night" ? "border-night-line text-night-ink" : "border-line text-ink-2",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", open ? "bg-success" : "bg-ink-3")}
      />
      <time dateTime={now?.toISOString()} aria-live="off">
        {now ? formatIstTime(now) : "--:-- --"} IST
      </time>
    </span>
  );
}
