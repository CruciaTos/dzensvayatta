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