"use client";

import React, { useEffect, useRef } from "react";
import { FOOTER_LINKS } from "@/lib/data";

// ── Magnetic link sub-component with optional custom click handler ──────────
function MagLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.22;
    el.style.transform = `translate(${x}px,${y}px)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="
        relative inline-block font-sans text-[12px] font-light text-white/60 no-underline
        transition-colors duration-200 hover:text-white
        after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
        after:h-px after:w-0 after:bg-[#7ec3e2ff]
        after:transition-[width] after:duration-300 after:ease-[cubic-bezier(.65,0,.35,1)]
        hover:after:w-full
      "
    >
      {children}
    </a>
  );
}

// ── Main footer component ────────────────────────────────────────────────────
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  // ── Cursor orb + marquee lighting effect ───────────────────────────────────
  useEffect(() => {
    const footer = footerRef.current;
    const orb = orbRef.current;
    if (!footer || !orb) return;

    function onMove(e: MouseEvent) {
      orb!.style.left = `${e.clientX}px`;
      orb!.style.top = `${e.clientY}px`;
      orb!.style.opacity = "1";

      const items = footer!.querySelectorAll<HTMLElement>(".marquee-item");
      items.forEach((el) => {
        const b = el.getBoundingClientRect();
        const cx = b.left + b.width / 2;
        const cy = b.top + b.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        el.classList.toggle("lit", dist < 260);
      });
    }

    function onLeave() {
      orb!.style.opacity = "0";
      footer!.querySelectorAll(".marquee-item").forEach((el) => el.classList.remove("lit"));
    }

    footer.addEventListener("mousemove", onMove);
    footer.addEventListener("mouseleave", onLeave);
    return () => {
      footer.removeEventListener("mousemove", onMove);
      footer.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Scroll‑triggered fade‑up animation ─────────────────────────────────────
  useEffect(() => {
    const els = footerRef.current?.querySelectorAll<HTMLElement>(".fade-up") ?? [];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Legacy footer‑link click handler (scrolls to relevant sections) ───────
  const handleFooterLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string
  ) => {
    if (
      label.includes("Configurator") ||
      label.includes("RFP") ||
      label.includes("Audit") ||
      label.includes("Briefing Builder")
    ) {
      e.preventDefault();
      document.getElementById("briefing-builder")?.scrollIntoView({ behavior: "smooth" });
    } else if (
      label.includes("Briefing") ||
      label.includes("Booking") ||
      label.includes("Call") ||
      label.includes("Start a conversation")
    ) {
      e.preventDefault();
      document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
    } else if (label.includes("About") || label.includes("Founders")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ── Floating light‑blue orb (fixed, follows cursor) ── */}
      <div
        ref={orbRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-0 w-[320px] h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-400"
        style={{
          background:
            "radial-gradient(circle, rgba(178,213,229,0.10) 0%, transparent 70%)",
        }}
      />

      <footer
        ref={footerRef}
        className="relative bg-[#010b13] border-t border-[rgba(178,213,229,0.1)] overflow-hidden"
      >
        {/* ── CTA strip ────────────────────────────────────── */}
        <div className="fade-up text-center px-6 py-20 border-b border-[rgba(178,213,229,0.1)]">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white mb-6">
            Ready to connect your stack?
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-serif font-normal tracking-[-0.025em] text-white leading-[1.1] mb-8">
            Your systems,
            <br />
            working together.
          </h2>
          <button
            onClick={() =>
              document
                .getElementById("briefing-builder")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group relative inline-flex items-center gap-2.5 border border-[rgba(178,213,229,0.25)] text-white/60 font-mono text-[11px] tracking-[0.1em] uppercase px-7 py-[14px] overflow-hidden transition-[color,border-color] duration-300 hover:text-white hover:border-[#7ec3e2ff]"
          >
            <span className="absolute inset-0 bg-[#7ec3e2ff] scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-x-100" />
            <span className="relative z-10">Configure Operational RFP</span>
            <span
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>

        {/* ── Link grid ────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-0 px-12 py-16 border-b border-[rgba(178,213,229,0.1)] max-[1100px]:grid-cols-2 max-[1100px]:gap-10 max-[1100px]:px-6 max-[600px]:grid-cols-1">
          {Object.entries(FOOTER_LINKS).map(([title, links], colIdx) => (
            <div
              key={title}
              className="fade-up px-6"
              style={{ transitionDelay: `${(colIdx + 1) * 80}ms` }}
            >
              <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/60 font-bold mb-5">
                {title}
              </div>
              <ul className="list-none flex flex-col gap-2" role="list">
                {links.map((link: string) => (
                  <li key={link}>
                    <MagLink
                      href="#"
                      onClick={(e) => handleFooterLinkClick(e, link)}
                    >
                      {link}
                    </MagLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div className="flex items-center justify-between px-12 py-6 flex-wrap gap-4 max-[600px]:px-6 max-[600px]:flex-col max-[600px]:items-start">
          <span className="font-mono text-[10px] tracking-[0.08em] text-white/60 select-text">
            © 2026 DZen Operational Systems. All rights secured.
          </span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Security Standards"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="font-mono text-[10px] tracking-[0.08em] text-white/60 no-underline transition-colors duration-200 hover:text-white"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>

        {/* ── Marquee (subtle lit state now white) ─────────── */}
        <div
          aria-hidden="true"
          className="border-t border-[rgba(178,213,229,0.1)] overflow-hidden py-10 cursor-default select-none"
        >
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(4)].flatMap((_, i) =>
              ["DZen", "Workflow", "Integration", "Enterprise"].map((word) => (
                <span
                  key={`${i}-${word}`}
                  className="marquee-item text-[clamp(5rem,10vw,8rem)] font-bold tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_rgba(178,213,229,0.14)] px-10 transition-all duration-300 [&.lit]:text-white/40 [&.lit]:[-webkit-text-stroke:0px_transparent]"
                >
                  {word}
                </span>
              ))
            )}
          </div>
        </div>
      </footer>

      {/* ── Global animations (marquee + fade‑up) ────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
        }
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: none;
        }
      `}</style>
    </>
  );
}