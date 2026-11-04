// Shared content shapes for the redesign. Data lives in lib/*.ts, components
// read it. Any string typed `Rich` may wrap italic-serif words in *asterisks*
// and use "\n" for a line break; render it with em() from lib/rich.tsx.

export type Rich = string;

export interface Media {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// ─── Site ───────────────────────────────────────────────────────────────────
export interface SiteConfig {
  name: string; // "Svayatta"
  legalName: string; // "Svayatta Intelligence Private Limited"
  cin: string | null; // null until issued
  url: string; // "https://svayatta.in"
  city: string; // "Mumbai"
  email: string; // "info@svayatta.in"
  founders: { name: string; role: string; email: string; linkedin?: string }[];
  whatsapp: {
    display: string; // "+91 93215 59182"
    e164: string; // "919321559182"
    href: string; // "https://wa.me/919321559182"
    chatHref: string; // same, with the prefilled ?text=
  };
  socials: { label: string; href: string }[];
  hours: { open: string; close: string; timeZone: string; label: string };
  callMinutes: number;
}

// ─── Navigation ─────────────────────────────────────────────────────────────
export interface MenuItem {
  index: string; // "01"
  label: string; // "Home"
  labelEm: string; // "Index"
  href: string;
  hasServices?: boolean; // opens the services sub-panel instead of navigating
  hidden?: boolean; // e.g. Insights until it exists
  children?: { label: string; href: string }[]; // sub-pages listed under the item in the menu
  preview: { image: string; alt: string; tag: string; description: string };
}

export interface DirectoryLink {
  index: string;
  label: string;
  href: string;
  hidden?: boolean;
}

// ─── Services ───────────────────────────────────────────────────────────────
export type ServiceGroupId = "ai" | "software" | "growth";

export interface ServiceGroup {
  id: ServiceGroupId;
  index: string; // "01"
  label: string; // "AI & AUTOMATION"
}

export interface Service {
  slug: string;
  index: string; // "01"
  title: string;
  group: ServiceGroupId;
  tagline: string[]; // shown joined with " · "
  summary: string; // ≤ 90 chars
  painPoints: string[];
  href: string; // "/services" until detail pages exist
}

export interface BusinessFunction {
  title: string;
  example: string;
}

// ─── Work / products ────────────────────────────────────────────────────────
export type WorkStatus = "live" | "in-development" | "pilot";
export type WorkFilter = "erp-finance" | "crm" | "healthcare" | "ai";

export interface WorkChapter {
  label: string; // "01 / THE PROBLEM"
  title: Rich; // "Spreadsheets *everywhere*"
  body: string;
  delivered: string; // "DELIVERED: …" chip text, without the prefix
  image?: Media;
}

export interface WorkItem {
  slug: string;
  index: string; // "01"
  name: string; // "CruSam"
  title: Rich; // card title: "CruSam *Payroll & finance ERP*"
  headline: Rich; // case-study H1: "CruSam\n*Payroll that runs itself.*"
  category: string; // "ERP · PAYROLL & FINANCE"
  platform?: string; // "WINDOWS DESKTOP"
  filters: WorkFilter[];
  status: WorkStatus;
  statusLabel: string; // "LIVE · AARTI ENTERPRISES"
  client?: string;
  clientLogo?: Media;
  year: number;
  description: string; // card copy, about 2 lines
  intro: string; // case-study intro, 2–3 sentences
  tags: string[]; // 3 chips on cards
  tech: string[]; // mono chips
  cover: Media;
  chapters: WorkChapter[];
  gallery: (Media & { caption: string })[];
  testimonialId?: string; // id in lib/testimonials.ts
  stats: { label: string; value: string }[]; // real numbers only
  cta: { label: string; kind: "demo" | "download" | "pilot" };
  published: boolean;
}

// ─── Process, principles, FAQ, testimonials ─────────────────────────────────
export interface ProcessStep {
  index: string; // "01"
  label: string; // "AUDIT"
  phase: string; // "Discovery"
  title: string;
  body: string;
  outcome: string;
}

export interface Principle {
  title: Rich;
  body: string;
}

export interface FaqItem {
  q: Rich;
  short: string;
  a: string;
  needsConfirm?: boolean; // a policy only the founders can confirm
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: Rich;
  avatar: string;
  logo?: string;
  outcome?: string;
  consentConfirmed: boolean;
}
