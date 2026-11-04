import type { MenuItem, DirectoryLink } from "@/types/content";

export const MENU_ITEMS: MenuItem[] = [
  {
    index: "01",
    label: "Home",
    labelEm: "Index",
    href: "/",
    preview: {
      image: "/og-image.png", // [asset] hero still for menu preview card
      alt: "Svayatta studio overview",
      tag: "SVAYATTA — STUDIO OVERVIEW",
      description: "Software, AI & automation from Mumbai",
    },
  },
  {
    index: "02",
    label: "About",
    labelEm: "Svayatta",
    href: "/about",
    preview: {
      image: "/og-image.png", // [asset] founders photo for menu preview card
      alt: "Svayatta founders and team",
      tag: "ABOUT — THE TEAM",
      description: "Two founders, one standard",
    },
  },
  {
    index: "03",
    label: "Services",
    labelEm: "What we build",
    href: "/services",
    preview: {
      image: "/og-image.png", // [asset] services illustration for menu preview card
      alt: "Svayatta services overview",
      tag: "SERVICES",
      description: "Six ways we help",
    },
  },
  {
    index: "04",
    label: "Work",
    labelEm: "Products & clients",
    href: "/projects",
    children: [
      { label: "CruSam", href: "/projects/crusam" },
      { label: "Growmont CRM", href: "/projects/growmont" },
      { label: "Growmont PMS", href: "/projects/growmont-pms" },
    ],
    preview: {
      image: "/images/Crusam_Mockups/Dashboard_MD.png",
      alt: "CruSam payroll & finance ERP dashboard",
      tag: "LIVE AT AARTI ENTERPRISES",
      description: "CruSam payroll & finance ERP",
    },
  },
  {
    index: "05",
    label: "Insights",
    labelEm: "Notes",
    href: "/insights",
    hidden: true,
    preview: {
      image: "/og-image.png", // [asset] insights cover image
      alt: "Svayatta insights and notes",
      tag: "NOTES",
      description: "Notes on software & AI",
    },
  },
  {
    index: "06",
    label: "Discovery",
    labelEm: "Call",
    href: "/discovery",
    preview: {
      image: "/og-image.png", // [asset] calendar and booking image
      alt: "Book a discovery call with Svayatta",
      tag: "30-MINUTE CALL",
      description: "Tell us about your business",
    },
  },
];

export const FOOTER_DIRECTORY: DirectoryLink[] = [
  { index: "01", label: "Home", href: "/" },
  { index: "02", label: "About", href: "/about" },
  { index: "03", label: "Services", href: "/services" },
  { index: "04", label: "Work", href: "/projects" },
  { index: "05", label: "Insights", href: "/insights", hidden: true },
  { index: "06", label: "Book a call", href: "/discovery" },
];

