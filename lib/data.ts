import type { NavLink } from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "Platform",    href: "#hero"         },
  { label: "Services",    href: "#target-areas" },
  { label: "Methodology", href: "#capabilities" },
  { label: "Contact",     href: "#contact"      },
];

// "Projects" is a full standalone route (not a same-page anchor), so it's
// handled separately from NAV_LINKS in the Navbar component.
export const PROJECTS_LINK: NavLink = { label: "Projects", href: "/projects" };

// ─── Footer columns ───────────────────────────────────────────────────────────
// NOTE: still reads "DZen" in a couple of spots (email, LinkedIn label) —
// left as-is pending the brand-name decision, not touched by this cleanup.
export const FOOTER_LINKS = {
  Platform: [
    "Workflow Orchestrations",
    "Direct Integrations",
    "Governance Console",
    "System Map",
    "Integration Ticker",
  ],
  Methodology: [
    "The DZen Strategy",
    "Operational Discovery",
    "RFP Questionnaire",
    "Founders",
  ],
  Resources: [
    "Uptime Monitors",
    "Compliance Ledger",
    "Documentation Guides",
    "Client Portal",
  ],
  Contact: [
    "hello@DZen.io",
    "Briefing Booking",
    "DZen LinkedIn",
    "Briefing Configurator",
  ],
};