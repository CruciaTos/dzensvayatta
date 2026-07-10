"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FOOTER_LINKS } from "@/lib/data";
import { siInstagram } from "simple-icons";

// LinkedIn was removed from simple-icons v16 — inline path used as placeholder
const siLinkedin = {
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

const ACCENT = "#7ec3e2ff";

function BrandIcon({ path, className }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function MagLink({
  strength = 0.18,
  className,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { strength?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px,${y}px)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <a ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} {...rest}>
      {children}
    </a>
  );
}

function MagButton({
  strength = 0.18,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { strength?: number }) {
  const ref = useRef<HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px,${y}px)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <button ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} {...rest}>
      {children}
    </button>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`footer-reveal ${className ?? ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <MagLink
      href={href}
      strength={0.05}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-baseline justify-between gap-6 py-6 border-b border-[rgba(178,213,229,0.10)] no-underline transition-colors duration-300 hover:border-[rgba(126,195,226,0.32)]"
    >
      <span className="[font-family:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase text-white/35 flex-shrink-0 transition-colors duration-300 group-hover:text-[#7ec3e2ff]">
        {label}
      </span>
      <span className="flex items-center gap-3 min-w-0">
        <span className="[font-family:var(--font-sans)] text-[clamp(1.25rem,3vw,2.25rem)] font-normal text-white/90 leading-tight tracking-[-0.01em] truncate transition-colors duration-300 group-hover:text-white">
          {value}
        </span>
        <span aria-hidden="true" className="flex-shrink-0 text-[#7ec3e2ff] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          ↗
        </span>
      </span>
    </MagLink>
  );
}

// ─── Watermark layers ────────────────────────────────────────────────────────

/** Always-visible outline watermark (behind everything, no blend). */
function GhostWatermark() {
  const textStyle: React.CSSProperties = {
    fontSize: "clamp(6rem, 50vw, 60rem)",
    letterSpacing: "-0.02em",
    lineHeight: 0.86,
    fontWeight: 500,
  };

  return (
    <span
      aria-hidden="true"
      className="block w-full text-center font-zaslia text-transparent [-webkit-text-stroke:0px_rgba(178,213,229,0.08)]"
      style={textStyle}
    >
      DZEN
    </span>
  );
}

/** Accent DZEN placed BELOW the content — bright cyan, only visible under the cursor via radial mask. */
function SpotlightAccent() {
  const textStyle: React.CSSProperties = {
    fontSize: "clamp(6rem, 50vw, 60rem)",
    letterSpacing: "-0.02em",
    lineHeight: 0.86,
    fontWeight: 500,
  };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-center justify-center"
    >
      <span
        className="block w-full text-center font-zaslia"
        style={{
          ...textStyle,
          color: ACCENT,
          WebkitMaskImage:
            "radial-gradient(circle 380px at var(--mx) var(--my), black 0%, black 55%, transparent 78%)",
          maskImage:
            "radial-gradient(circle 380px at var(--mx) var(--my), black 0%, black 55%, transparent 78%)",
        }}
      >
        DZEN
      </span>
    </div>
  );
}

// ─── Footer sections ─────────────────────────────────────────────────────────

function FooterCTA({ onStart }: { onStart: () => void }) {
  return (
    <Reveal className="grid grid-cols-[1.1fr_1fr] gap-20 pt-28 pb-20 max-[900px]:grid-cols-1 max-[900px]:gap-14 max-[900px]:pt-20">
      <div>
        <div className="flex items-center gap-3 mb-7">
          <span className="w-[5px] h-[5px] rounded-full bg-[#7ec3e2ff]" aria-hidden="true" />
          <span className="[font-family:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-[#7ec3e2ff]">Let&apos;s talk</span>
        </div>
        <h2 className="[font-family:var(--font-sans)] text-[clamp(2.1rem,4.6vw,3.6rem)] font-normal text-white leading-[1.06] tracking-[-0.02em] mb-10 max-w-[460px]">
          Your systems,
          <br />
          working <em className="not-italic text-white/45">together.</em>
        </h2>
        <MagButton
          strength={0.14}
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 border border-[rgba(178,213,229,0.25)] text-white/70 [font-family:var(--font-mono)] text-[11px] tracking-[0.12em] uppercase px-7 py-[15px] overflow-hidden transition-colors duration-300 hover:text-[#00080e]"
        >
          <span className="absolute inset-0 bg-[#7ec3e2ff] scale-x-0 origin-left transition-transform duration-[420ms] ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-x-100" />
          <span className="relative z-10">Start a discovery call</span>
          <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </MagButton>
      </div>

      <div className="flex flex-col">
        <ContactRow label="Svayatta" value="dzensvayatta@gmail.com" href="mailto:dzensvayatta@gmail.com" />
        <ContactRow label="WhatsApp" value="+91 91520 35526" href="https://wa.me/9152035526" external />
        <ContactRow label="WhatsApp" value="+91 91520 35527" href="https://wa.me/9152035527" external />
        <ContactRow label="WhatsApp" value="+91 70219 11997" href="https://wa.me/7021911997" external />
      </div>
    </Reveal>
  );
}

function FooterLinks({
  onLinkClick,
}: {
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, label: string) => void;
}) {
  // Exclude sections we no longer want
  const excludedSections = new Set(["Platform", "Resources", "Methodology", "Contact"]);
  const filteredEntries = Object.entries(FOOTER_LINKS).filter(
    ([title]) => !excludedSections.has(title)
  );

  return (
    <Reveal delay={80} className="flex flex-wrap items-start justify-between gap-12 py-16 border-t border-[rgba(178,213,229,0.08)]">
      <div className="flex flex-wrap gap-x-16 gap-y-10 flex-1 min-w-0">
        {filteredEntries.map(([title, links]) => (
          <div key={title} className="min-w-[140px]">
            <div className="[font-family:var(--font-mono)] text-[9px] tracking-[0.18em] uppercase text-white/30 mb-5">{title}</div>
            <ul className="list-none flex flex-col gap-[10px]" role="list">
              {links.map((link: string) => (
                <li key={link}>
                  <a
                    href="#"
                    onClick={(e) => onLinkClick(e, link)}
                    className="[font-family:var(--font-sans)] text-[13px] font-light text-white/55 no-underline transition-colors duration-200 hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 flex-shrink-0">
        <MagLink
          strength={0.1}
          href="https://www.linkedin.com/company/dzen-svayatta/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 no-underline"
        >
          <BrandIcon path={siLinkedin.path} className="w-3 h-3 text-white/35 transition-colors duration-200 group-hover:text-[#7ec3e2ff]" />
          <span className="[font-family:var(--font-mono)] text-[10px] tracking-[0.1em] uppercase text-white/55 transition-colors duration-200 group-hover:text-white">
            LinkedIn
          </span>
        </MagLink>
        <MagLink
          strength={0.1}
          href="https://instagram.com/wearedzen"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 no-underline"
        >
          <BrandIcon path={siInstagram.path} className="w-3 h-3 text-white/35 transition-colors duration-200 group-hover:text-[#7ec3e2ff]" />
          <span className="[font-family:var(--font-mono)] text-[10px] tracking-[0.1em] uppercase text-white/55 transition-colors duration-200 group-hover:text-white">
            @wearedzen
          </span>
        </MagLink>
        <MagLink
          strength={0.1}
          href="https://instagram.com/dzensvayatta"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 no-underline"
        >
          <BrandIcon path={siInstagram.path} className="w-3 h-3 text-white/35 transition-colors duration-200 group-hover:text-[#7ec3e2ff]" />
          <span className="[font-family:var(--font-mono)] text-[10px] tracking-[0.1em] uppercase text-white/55 transition-colors duration-200 group-hover:text-white">
            @dzensvayatta
          </span>
        </MagLink>
      </div>
    </Reveal>
  );
}

function FooterBottomBar() {
  return (
    <div className="flex items-center justify-center py-7 border-t border-[rgba(178,213,229,0.08)]">
      <span className="[font-family:var(--font-mono)] text-[10px] tracking-[0.06em] text-white/30">
        © 2026 DZen Intelligence
      </span>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mouse tracking → sets CSS variables for the spotlight mask + positions glow
  useEffect(() => {
    const footer = footerRef.current;
    const glow = glowRef.current;
    if (!footer || !glow) return;

    function onMove(e: MouseEvent) {
      const r = footer!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      glow!.style.left = `${x}px`;
      glow!.style.top = `${y}px`;
      glow!.style.opacity = "1";
      footer!.style.setProperty("--mx", `${x}px`);
      footer!.style.setProperty("--my", `${y}px`);
    }

    function onLeave() {
      glow!.style.opacity = "0";
      // Move mask off‑screen – removes the bright accent layer → content blend resets
      footer!.style.setProperty("--mx", "-9999px");
      footer!.style.setProperty("--my", "-9999px");
    }

    footer.addEventListener("mousemove", onMove);
    footer.addEventListener("mouseleave", onLeave);
    return () => {
      footer.removeEventListener("mousemove", onMove);
      footer.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    e.preventDefault();
    if (
      label.includes("Configurator") ||
      label.includes("RFP") ||
      label.includes("Audit") ||
      label.includes("Briefing Builder")
    ) {
      document.getElementById("briefing-builder")?.scrollIntoView({ behavior: "smooth" });
    } else if (
      label.includes("Briefing") ||
      label.includes("Booking") ||
      label.includes("Call") ||
      label.includes("Start a conversation")
    ) {
      document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#00080eff] border-t border-[rgba(178,213,229,0.10)] overflow-hidden"
      style={{ "--mx": "-9999px", "--my": "-9999px" } as React.CSSProperties}
    >
      {/* ── LAYER 0 : ghost DZEN outline (behind everything, no blend) ──── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        <GhostWatermark />
      </div>

      {/* ── LAYER 1 : accent DZEN (under content, bright cyan, masked) ──── */}
      <SpotlightAccent />

      {/* ── LAYER 2 : diffuse mouse glow ────────────────────────────────── */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-[2] w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle, rgba(126,195,226,0.049) 0%, transparent 70%)" }}
      />

      {/* ── LAYER 3 : all footer content (difference blend on the container) ── */}
      <div className="relative z-20 mix-blend-difference max-w-[1320px] mx-auto px-12 max-md:px-6">
        <FooterCTA onStart={() => router.push("/discovery")} />
        <FooterLinks onLinkClick={handleFooterLinkClick} />
        <FooterBottomBar />
      </div>

      <style>{`
        .footer-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.85s ease, transform 0.85s ease;
        }
        .footer-reveal.is-visible {
          opacity: 1;
          transform: none;
        }
      `}</style>
    </footer>
  );
}