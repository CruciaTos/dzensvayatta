import Link from "next/link";
import type { Metadata } from "next";
import { em } from "@/lib/rich";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
  },
};

export default function NotFound() {
  return (
    <div className="relative min-h-[80svh] pt-40 pb-24 flex flex-col items-center justify-center text-center px-5 overflow-hidden">
      <h1 className="text-display-l font-light text-ink max-w-[700px] mb-8 leading-tight">
        {em("This page\n*doesn't exist.*")}
      </h1>

      <p className="text-body text-ink-2 max-w-[480px] mb-10">
        The link you followed may be broken or the page may have been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 text-body z-10">
        <Link
          href="/"
          className="text-ink hover:text-accent underline underline-offset-4 transition-colors"
        >
          Home →
        </Link>
        <Link
          href="/projects"
          className="text-ink hover:text-accent underline underline-offset-4 transition-colors"
        >
          Work →
        </Link>
        <Link
          href="/discovery"
          className="text-ink hover:text-accent underline underline-offset-4 transition-colors"
        >
          Book a call →
        </Link>
      </div>

      <div
        aria-hidden="true"
        className="font-deva text-ink pointer-events-none select-none absolute bottom-4 left-1/2 -translate-x-1/2 leading-none"
        style={{
          fontSize: "min(30vw, 260px)",
          opacity: 0.04,
        }}
      >
        स्वयत्ता
      </div>
    </div>
  );
}
