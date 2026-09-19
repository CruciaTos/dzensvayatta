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
export const PROJECTS_LINK: NavLink = { label: "Products", href: "/projects" };

// Rendered as a hover dropdown under "Projects" in the Navbar, each item
// linking to its own dedicated project screen.
export const PROJECTS_SUBLINKS: NavLink[] = [
  {
    label: "CruSam",
    href: "/projects",
    description: "Unified ERP for records, payroll and finance.",
    badge: "Live",
    badgeTone: "live",
  },
  {
    label: "Growmont",
    href: "/projects/growmont",
    description: "A growth platform built to bring clarity to scale.",
    badge: "In Dev",
    badgeTone: "wip",
  },
];
