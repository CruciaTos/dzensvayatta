"use client";

import React, { useEffect, useRef } from "react";
import { siInstagram } from "simple-icons";

// ── Design tokens (identical to TargetAreas, TargetMarkets, CaseStudies) ──
const C = {
  bg: "#000b12ff",
  accent: "#7EC3E2",
  accentSoft: "#B2D5E5",
  textPrimary: "#e5f3e5ff",
  textMuted: "rgba(204, 217, 207, 0.65)",
  cardBg: "#0d0d0cff",
  cardBgHover: "#141413ff",
  cardBorder: "rgba(178,213,229,0.10)",
  cardBorderHover: "rgba(126,195,226,0.28)",
  divider: "rgba(178,213,229,0.10)",
  glowSpot: "rgba(126,195,226,0.08)",
  glassBg: "rgba(9, 9, 9, 0.5)",
  glassHighlight: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(178,213,229,0.15)",
  glassShadow: "0 12px 40px rgba(0,0,0,0.2)",
} as const;

// LinkedIn placeholder path
const siLinkedin = {
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

const SPOTLIGHT_RADIUS = 500; // px

// ─── Brand icon (accepts style prop) ────────────────────────────────────────
function BrandIcon({
  path,
  className,
  style,
}: {
  path: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={style}
    >
      <path d={path} />
    </svg>
  );
}

// ─── Magnetic link ──────────────────────────────────────────────────────────
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
    <a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}

// ─── Reveal animation (accepts style prop) ──────────────────────────────────
function Reveal({
  children,
  className,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
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
    <div
      ref={ref}
      className={`footer-reveal ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

// ─── Watermark layers ───────────────────────────────────────────────────────
function GhostWatermark() {
  return (
    <span
      aria-hidden="true"
      className="block w-full text-center font-zaslia text-transparent ghost-shine"
      style={{
        WebkitTextStroke: "1px rgba(178,213,229,0.35)",
        fontSize: "clamp(6rem, 50vw, 60rem)",
        letterSpacing: "-0.02em",
        lineHeight: 0.86,
        fontWeight: 500,
        // Soft‑edged mask: fade‑in between 35‑45%, solid 45‑55%, fade‑out 55‑65%
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, transparent 35%, black 45%, black 55%, transparent 65%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, transparent 35%, black 45%, black 55%, transparent 65%, transparent 100%)",
        WebkitMaskSize: "200% 100%",
        maskSize: "200% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    >
      DZEN
    </span>
  );
}

function SpotlightAccent() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-center justify-center"
    >
      <span
        className="block w-full text-center font-zaslia"
        style={{
          fontSize: "clamp(6rem, 50vw, 60rem)",
          letterSpacing: "-0.02em",
          lineHeight: 0.86,
          fontWeight: 500,
          color: "#b2b2b2",
          WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at var(--mx) var(--my), black 0%, black 35%, transparent 75%)`,
          maskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at var(--mx) var(--my), black 0%, black 35%, transparent 75%)`,
        }}
      >
        DZEN
      </span>
    </div>
  );
}

function SpotlightAccentTint() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
      style={{
        backgroundColor: C.accent,
        mixBlendMode: "color",
        WebkitMaskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at var(--mx) var(--my), black 0%, black 35%, transparent 75%)`,
        maskImage: `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at var(--mx) var(--my), black 0%, black 35%, transparent 75%)`,
      }}
    />
  );
}

// ─── Footer sections ────────────────────────────────────────────────────────
function FooterCTA() {
  return (
    <Reveal className="pt-28 pb-12 max-[900px]:pt-20">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-7">
          <span
            className="w-[5px] h-[5px] rounded-full"
            style={{ backgroundColor: C.accent }}
            aria-hidden="true"
          />
          <span
            className="[font-family:var(--font-mono)] text-[11px] tracking-[0.2em] uppercase"
            style={{ color: C.accent }}
          >
            Let&apos;s talk
          </span>
        </div>
        <h2
          className="[font-family:var(--font-sans)] font-bold"
          style={{
            fontSize: "clamp(4rem, 8vw, 6rem)",
            color: C.textPrimary,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Quality through Clarity
          <br />
          Let&apos;s get{" "}
          <em className="not-italic" style={{ color: C.textMuted }}>
            working.
          </em>
        </h2>
      </div>
    </Reveal>
  );
}

function FooterLinks() {
  const contactLinks = [
    { label: "info@svayatta.in", href: "mailto:info@svayatta.in" },
    { label: "+91 91520 35526", href: "https://wa.me/9152035526", external: true },
    { label: "+91 91520 35527", href: "https://wa.me/9152035527", external: true },
  ];

  return (
    <Reveal
      delay={80}
      className="flex flex-wrap items-start justify-between gap-12 py-16"
    >
      {/* Social links – left */}
      <div className="flex flex-col gap-4 flex-shrink-0">
        <MagLink
          strength={0.1}
          href="https://www.linkedin.com/company/dzen-svayatta/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 no-underline"
        >
          <BrandIcon
            path={siLinkedin.path}
            className="w-[24px] h-[24px] transition-colors duration-200 group-hover:text-[#7ec3e2ff]"
            style={{ color: C.textMuted }}
          />
          <span
            className="[font-family:var(--font-mono)] text-[16px] tracking-[0.1em] uppercase transition-colors duration-200 relative top-[2px]"
            style={{ color: C.textMuted }}
          >
            DzenSvayatta
          </span>
        </MagLink>
        <MagLink
          strength={0.1}
          href="https://instagram.com/wearedzen"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 no-underline"
        >
          <BrandIcon
            path={siInstagram.path}
            className="w-[24px] h-[24px] transition-colors duration-200 group-hover:text-[#7ec3e2ff]"
            style={{ color: C.textMuted }}
          />
          <span
            className="[font-family:var(--font-mono)] text-[16px] tracking-[0.1em] uppercase transition-colors duration-200 relative top-[2px]"
            style={{ color: C.textMuted }}
          >
            @wearedzen
          </span>
        </MagLink>
        <MagLink
          strength={0.1}
          href="https://instagram.com/dzensvayatta"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 no-underline"
        >
          <BrandIcon
            path={siInstagram.path}
            className="w-[24px] h-[24px] transition-colors duration-200 group-hover:text-[#7ec3e2ff]"
            style={{ color: C.textMuted }}
          />
          <span
            className="[font-family:var(--font-mono)] text-[16px] tracking-[0.1em] uppercase transition-colors duration-200 relative top-[2px]"
            style={{ color: C.textMuted }}
          >
            @dzensvayatta
          </span>
        </MagLink>
      </div>

      {/* Contact column – right */}
      <div className="flex-shrink-0 min-w-[140px]">
        <ul className="list-none flex flex-col gap-[12px]" role="list">
          {contactLinks.map((item) => {
            const isEmail = item.label === "info@svayatta.in";
            return (
              <li key={item.label} className={isEmail ? "-mt-8" : ""}>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={
                    isEmail
                      ? "[font-family:var(--font-sans)] text-[60px] font-light no-underline transition-opacity duration-200 hover:opacity-80"
                      : "[font-family:var(--font-sans)] text-[24px] font-light no-underline transition-colors duration-200 block text-right"
                  }
                  style={
                    isEmail
                      ? { color: C.textPrimary }
                      : { color: C.textMuted }
                  }
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}

function FooterBottomBar() {
  return (
    <div
      className="flex items-center justify-center py-7"
      style={{ borderTop: `1px solid ${C.cardBorder}` }}
    >
      <span
        className="[font-family:var(--font-mono)] text-[10px] tracking-[0.06em]"
        style={{ color: C.textMuted }}
      >
        © 2026 Svayatta Intelligence
      </span>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: C.bg,
        borderTop: `1px solid ${C.cardBorder}`,
        "--mx": "-9999px",
        "--my": "-9999px",
      } as React.CSSProperties}
    >
      {/* LAYER 0: ghost DZEN outline – only a soft gradient sliver appears */}
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

      {/* LAYER 1: accent DZEN */}
      <SpotlightAccent />

      {/* LAYER 2: diffuse mouse glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-[2] w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(126,195,226,0.05) 0%, transparent 70%)",
        }}
      />

      {/* LAYER 3: footer content */}
      <div className="relative z-20 mix-blend-difference max-w-[1320px] mx-auto px-12 max-md:px-6">
        <FooterCTA />
        <FooterLinks />
        <FooterBottomBar />
      </div>

      {/* LAYER 4: re-tint to accent blue */}
      <SpotlightAccentTint />

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

        /* Smooth sweep from left to right – now reversed */
        @keyframes ghostShine {
          0% {
            mask-position: -20% 0;
            -webkit-mask-position: -20% 0;
          }
          100% {
            mask-position: 120% 0;
            -webkit-mask-position: 120% 0;
          }
        }

        .ghost-shine {
          animation: ghostShine 8s linear infinite;
          animation-direction: reverse; /* Sweep from left to right */
        }
      `}</style>
    </footer>
  );
}