"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FadeIn } from "@/components/ui/FadeIn";

/* ─────────────────────────────────────────────────────────────────────────────
   LOGO SOURCES
   ─────────────────────────────────────────────────────────────────────────────
   • SI(slug)  → Simple Icons CDN (mono SVGs — coloured via fill injection)
   • DV(name)  → Devicons CDN    (full-colour SVGs — rendered as-is)
   • Inline    → SVG string      (for brands missing from both CDNs)

   ✅ TO SWAP IN YOUR OWN FILES
      Set  src: "/logos/brand.svg"  and  colorize: false  for full-colour images.
      Set  src: "/logos/brand.svg"  and  monoColor: "#hex"  for mono/black logos.
───────────────────────────────────────────────────────────────────────────── */

const SI  = (slug: string) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
const DV  = (name: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;

/* ── Inline SVGs for brands not in SI or DV ─────────────────────────────── */

// LinkedIn — official in-wordmark icon
const LINKEDIN_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="#0A66C2"/><path d="M15.5 20h-5v13h5V20zm-2.5-2.3a2.9 2.9 0 110-5.8 2.9 2.9 0 010 5.8zM37 33h-5v-6.5c0-1.6-.6-2.7-2-2.7-1.2 0-1.8.8-2.1 1.6-.1.3-.1.7-.1 1V33h-5s.1-14 0-14h5v2.1a5 5 0 014.5-2.5c3.3 0 5.7 2.1 5.7 6.7V33z" fill="white"/></svg>`;

// Slack — official 4-colour hashtag logo
const SLACK_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 30a4 4 0 010-8h4v4a4 4 0 01-4 4z" fill="#E01E5A"/><path d="M26 13a4 4 0 010 8h-4v-4a4 4 0 014-4z" fill="#36C5F0"/><path d="M35 26a4 4 0 010 8h-4v-4a4 4 0 014-4z" fill="#2EB67D"/><path d="M22 35a4 4 0 010 8v-4h-4a4 4 0 010-8h4v4z" fill="#ECB22E"/><path d="M22 22h4v4h-4z" fill="#1D1C1D"/><rect x="18" y="18" width="4" height="4" rx="0" fill="#E01E5A"/><rect x="26" y="18" width="4" height="4" rx="0" fill="#36C5F0"/><rect x="26" y="26" width="4" height="4" rx="0" fill="#2EB67D"/><rect x="18" y="26" width="4" height="4" rx="0" fill="#ECB22E"/></svg>`;

// OpenAI
const OPENAI_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="10" fill="#000"/><path d="M37.5 20.5c.9-2.5.6-5.3-.9-7.6-2.3-3.5-6.5-5.3-10.6-4.4C24.8 6.7 22.3 5 19.5 5c-4.1 0-7.7 2.8-8.8 6.8-2.6.5-4.8 2.1-6.1 4.4-2.3 3.9-1.8 8.9 1.3 12.3-.9 2.5-.6 5.3.9 7.6 2.3 3.5 6.5 5.3 10.6 4.4 1.3 1.8 3.8 3.5 6.6 3.5 4.1 0 7.7-2.8 8.8-6.8 2.6-.5 4.8-2.1 6.1-4.4 2.3-4 1.8-8.9-1.4-12.3zM24 41.5c-1.8 0-3.4-.6-4.7-1.7l.2-.1 7.8-4.5c.4-.2.6-.6.6-1V23.8l3.3 1.9v9.1c0 3.7-3.2 6.7-7.2 6.7zM7.3 34.2c-.9-1.6-1.2-3.4-.9-5.2l.2.1 7.8 4.5c.4.2.8.2 1.2 0l9.4-5.4v3.8L17.4 36c-3.2 1.9-7.3.7-10.1-1.8zm-1.6-14.4c.9-1.5 2.3-2.7 3.9-3.4v9.3c0 .4.2.8.6 1l9.4 5.4-3.3 1.9-7.6-4.4C6 26.6 4.8 22.4 5.7 19.8zm27.8 11.5l-9.4-5.4 3.3-1.9 7.6 4.4c3.2 1.8 4.4 5.8 2.8 9-.9 1.5-2.3 2.7-3.9 3.4v-9.3c0-.5-.2-.9-.4-1.2zm3.2-5.4l-.2-.1-7.8-4.5c-.4-.2-.8-.2-1.2 0L18.1 27v-3.8l7.6-4.4c3.2-1.8 7.3-.7 10.1 1.8.9 1.6 1.2 3.4.9 5.2h-.9zM15.4 25.1l-3.3-1.9v-9.1c0-3.7 3.2-6.7 7.2-6.7 1.8 0 3.4.6 4.7 1.7l-.2.1-7.8 4.5c-.4.2-.6.6-.6 1v10.4zm1.8-3.8l4-2.3 4 2.2v4.4l-4 2.3-4-2.3v-4.3z" fill="white"/></svg>`;

// Microsoft 365 (4-colour Windows tile style)
const M365_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4"  y="4"  width="18" height="18" fill="#F25022"/><rect x="26" y="4"  width="18" height="18" fill="#7FBA00"/><rect x="4"  y="26" width="18" height="18" fill="#00A4EF"/><rect x="26" y="26" width="18" height="18" fill="#FFB900"/></svg>`;

// Google Workspace (4-colour G)
const GOOGLE_WS_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11.3a9.7 9.7 0 01-4.2 6.3v5.3h6.8C41.8 36 44 30.7 44 24.5z" fill="#4285F4"/><path d="M24 45c5.7 0 10.5-1.9 14-5.1l-6.8-5.3c-1.9 1.3-4.3 2-7.2 2-5.5 0-10.2-3.7-11.9-8.7H5.2v5.5C8.7 40.7 15.9 45 24 45z" fill="#34A853"/><path d="M12.1 27.9A13.3 13.3 0 0111.4 24c0-1.4.2-2.7.6-4l-6.8-5.4A22 22 0 002 24c0 3.6.9 7 2.4 10l7.7-6.1z" fill="#FBBC05"/><path d="M24 10.3c3.1 0 5.9 1.1 8.1 3.1l6-6C34.4 4 29.6 2 24 2 15.9 2 8.7 6.3 5.2 13L12 18.3c1.7-5 6.4-8 12-8z" fill="#EA4335"/></svg>`;

// Monday.com (3 coloured circles)
const MONDAY_SVG = `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#FF3750"/><circle cx="40" cy="20" r="18" fill="#FFCB00"/><circle cx="60" cy="20" r="18" fill="#00CA72"/></svg>`;

// Workday (sun / arc mark)
const WORKDAY_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="10" fill="#F5B700"/><path d="M24 6v4M24 38v4M6 24h4M38 24h4M10.3 10.3l2.8 2.8M34.9 34.9l2.8 2.8M10.3 37.7l2.8-2.8M34.9 13.1l2.8-2.8" stroke="#F5B700" stroke-width="3" stroke-linecap="round"/></svg>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Logo registry
───────────────────────────────────────────────────────────────────────────── */

interface LogoEntry {
  id: string;
  label: string;
  /** CDN URL (SI / DV) or omit if using inlineSvg */
  src?: string;
  /** Raw SVG string for brands not in any CDN */
  inlineSvg?: string;
  /** Hex colour to inject as fill into a mono (black) Simple Icons SVG */
  monoColor?: string;
}

const LOGOS: LogoEntry[] = [
  // ── Social & messaging ─────────────────────────────────────────────────
  { id: "instagram",  label: "Instagram",        src: SI("instagram"),    monoColor: "#E1306C" },
  { id: "whatsapp",   label: "WhatsApp",         src: SI("whatsapp"),     monoColor: "#25D366" },
  { id: "telegram",   label: "Telegram",         src: SI("telegram"),     monoColor: "#26A5E4" },
  { id: "x",          label: "X (Twitter)",      src: SI("x"),            monoColor: "#ffffff" },
  { id: "youtube",    label: "YouTube",          src: SI("youtube"),      monoColor: "#FF0000" },
  { id: "tiktok",     label: "TikTok",           src: SI("tiktok"),       monoColor: "#ffffff" },
  { id: "linkedin",   label: "LinkedIn",         inlineSvg: LINKEDIN_SVG },
  // ── AI & automation ────────────────────────────────────────────────────
  { id: "openai",     label: "OpenAI",           inlineSvg: OPENAI_SVG },
  { id: "zapier",     label: "Zapier",           src: SI("zapier"),       monoColor: "#FF4A00" },
  // ── Productivity ───────────────────────────────────────────────────────
  { id: "slack",      label: "Slack",            inlineSvg: SLACK_SVG },
  { id: "teams",      label: "Microsoft Teams",  src: SI("microsoftteams"),  monoColor: "#6264A7" },
  { id: "notion",     label: "Notion",           src: SI("notion"),       monoColor: "#ffffff" },
  { id: "gmail",      label: "Gmail",            src: SI("gmail"),        monoColor: "#EA4335" },
  { id: "google",     label: "Google Workspace", inlineSvg: GOOGLE_WS_SVG },
  { id: "m365",       label: "Microsoft 365",    inlineSvg: M365_SVG },
  { id: "asana",      label: "Asana",            src: SI("asana"),        monoColor: "#F06A6A" },
  { id: "monday",     label: "monday.com",       inlineSvg: MONDAY_SVG },
  { id: "atlassian",  label: "Atlassian",        src: SI("atlassian"),    monoColor: "#0052CC" },
  { id: "confluence", label: "Confluence",       src: SI("confluence"),   monoColor: "#0052CC" },
  // ── CRM & sales ────────────────────────────────────────────────────────
  { id: "salesforce", label: "Salesforce",       src: SI("salesforce"),   monoColor: "#00A1E0" },
  { id: "hubspot",    label: "HubSpot",          src: SI("hubspot"),      monoColor: "#FF7A59" },
  // ── Payments & e-commerce ──────────────────────────────────────────────
  { id: "stripe",     label: "Stripe",           src: SI("stripe"),       monoColor: "#635BFF" },
  { id: "shopify",    label: "Shopify",          src: SI("shopify"),      monoColor: "#96BF48" },
  { id: "quickbooks", label: "QuickBooks",       src: SI("quickbooks"),   monoColor: "#2CA01C" },
  // ── Data & analytics ───────────────────────────────────────────────────
  { id: "snowflake",  label: "Snowflake",        src: SI("snowflake"),    monoColor: "#29B5E8" },
  { id: "databricks", label: "Databricks",       src: SI("databricks"),   monoColor: "#FF3621" },
  { id: "tableau",    label: "Tableau",          src: SI("tableau"),      monoColor: "#E8762D" },
  { id: "powerbi",    label: "Power BI",         src: SI("powerbi"),      monoColor: "#F2C811" },
  { id: "postgresql", label: "PostgreSQL",       src: DV("postgresql") },
  // ── Enterprise ─────────────────────────────────────────────────────────
  { id: "sap",        label: "SAP",              src: SI("sap"),          monoColor: "#0070F2" },
  { id: "workday",    label: "Workday",          inlineSvg: WORKDAY_SVG },
  { id: "retool",     label: "Retool",           src: SI("retool"),       monoColor: "#3D3D3D" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   LogoImg
   ────────────────────────────────────────────────────────────────────────────
   Three render paths:
   1. inlineSvg  → dangerouslySetInnerHTML (full-colour, no fetch)
   2. src + monoColor → fetch SVG text, inject fill="#hex", render as data-URI
   3. src only   → plain <img> (Devicons full-colour)
───────────────────────────────────────────────────────────────────────────── */

function LogoImg({ logo }: { logo: LogoEntry }) {
  const [coloured, setColoured] = useState<string | null>(null);

  useEffect(() => {
    if (!logo.src || !logo.monoColor) return;
    let cancelled = false;

    fetch(logo.src)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        const filled = text.replace(/<svg /, `<svg fill="${logo.monoColor}" `);
        setColoured(
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(filled)
        );
      })
      .catch(() => {
        if (!cancelled) setColoured(logo.src ?? null);
      });

    return () => { cancelled = true; };
  }, [logo.src, logo.monoColor]);

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    userSelect: "none",
  };

  // Path 1 — inline SVG (no fetch needed, full-colour)
  if (logo.inlineSvg) {
    return (
      <div
        aria-label={logo.label}
        style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        dangerouslySetInnerHTML={{ __html: logo.inlineSvg }}
      />
    );
  }

  // Path 2 — mono SVG with injected colour
  if (logo.monoColor) {
    const src = coloured ?? logo.src;
    return src ? <img src={src} alt={logo.label} draggable={false} style={imgStyle} /> : null;
  }

  // Path 3 — full-colour CDN image
  return logo.src ? (
    <img src={logo.src} alt={logo.label} draggable={false} style={imgStyle} />
  ) : null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Marquee animation
───────────────────────────────────────────────────────────────────────────── */

const MARQUEE_STYLES = `
  @keyframes dzen-marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(calc(-100% / 3)); }
  }
  @media (prefers-reduced-motion: reduce) {
    .dzen-marquee-track { animation: none !important; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   MarqueeTrack
───────────────────────────────────────────────────────────────────────────── */

function MarqueeTrack() {
  const set = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="group overflow-hidden">
      <div
        className="dzen-marquee-track flex w-max items-center group-hover:[animation-play-state:paused]"
        style={{ animation: "dzen-marquee 80s linear infinite", willChange: "transform" }}
      >
        {set.map((logo, i) => (
          <div
            key={`${logo.id}-${i}`}
            className="flex-shrink-0 flex flex-col items-center justify-center gap-2"
            style={{ padding: "0 28px", minWidth: "88px" }}
            title={logo.label}
            aria-label={logo.label}
          >
            <div
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LogoImg logo={logo} />
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--color-text-secondary, #9ca3af)",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
              }}
            >
              {logo.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IntegrationLogoMarquee — public API unchanged
───────────────────────────────────────────────────────────────────────────── */

interface IntegrationLogoMarqueeProps {
  maxWidth?: number | string;
  bleed?: number;
  fade?: number;
}

export function IntegrationLogoMarquee({
  maxWidth = "100%",
  bleed = 0,
  fade = 12,
}: IntegrationLogoMarqueeProps) {
  const safeBleed = Math.max(0, bleed);
  const safeFade  = Math.min(Math.max(fade, 0), 49);
  const resolvedMaxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  return (
    <>
      <style>{MARQUEE_STYLES}</style>
      <Container className="overflow-visible !px-0">
        <div
          className="relative overflow-hidden py-4"
          style={{
            width: `calc(100% + ${safeBleed * 2}px)`,
            maxWidth: `calc(${resolvedMaxWidth} + ${safeBleed * 2}px)`,
            marginLeft: `-${safeBleed}px`,
            marginRight: `-${safeBleed}px`,
            marginInline: safeBleed === 0 ? "auto" : undefined,
            WebkitMaskImage: `linear-gradient(to right, transparent, black ${safeFade}%, black ${100 - safeFade}%, transparent)`,
            maskImage: `linear-gradient(to right, transparent, black ${safeFade}%, black ${100 - safeFade}%, transparent)`,
          }}
        >
          <MarqueeTrack />
        </div>
      </Container>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page section — unchanged
───────────────────────────────────────────────────────────────────────────── */

export function IntegrationMarquee() {
  return (
    <section
      id="integrations"
      aria-label="Systems we connect"
      className="py-[100px] bg-bg-secondary border-t border-border overflow-hidden"
    >
      <Container className="mb-14">
        <FadeIn>
          <SectionIndex number="05" tag="Integration Catalogue" className="mb-4" />
          <p className="font-sans text-body font-light text-stone-400 leading-[1.7] max-w-[440px]">
            Pre-built connectors across every major platform — from social and AI tools to enterprise data.
          </p>
        </FadeIn>
      </Container>

      <IntegrationLogoMarquee />
    </section>
  );
}