import type { Metadata } from "next";
import { plain } from "@/lib/rich";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://svayatta.in";

export interface RouteConfig {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  lastModified: string;
}

export const ROUTES: RouteConfig[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1.0,
    lastModified: "2026-11-03",
  },
  {
    path: "/projects",
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: "2026-11-03",
  },
  {
    path: "/projects/crusam",
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-11-03",
  },
  {
    path: "/projects/growmont",
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-11-03",
  },
  {
    path: "/projects/growmont-pms",
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: "2026-11-03",
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-11-03",
  },
  {
    path: "/services",
    changeFrequency: "weekly",
    priority: 0.9,
    lastModified: "2026-11-03",
  },
  {
    path: "/discovery",
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: "2026-11-03",
  },
  {
    path: "/privacy",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: "2026-11-03",
  },
  {
    path: "/terms",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: "2026-11-03",
  },
];

export const PAGE_SEO: Record<string, { title?: string; description: string }> = {
  "/": {
    description:
      "Custom software, AI agents and workflow automation for Indian businesses, from a Mumbai studio. Scoped with you, shipped in small steps.",
  },
  "/projects": {
    title: "Work",
    description:
      "Products in production: CruSam payroll ERP, Growmont CRM and more, built and supported by Svayatta.",
  },
  "/projects/crusam": {
    title: "CruSam: payroll & finance ERP",
    description:
      "How CruSam replaced spreadsheets at Aarti Enterprises with one platform for records, salaries, invoices and an AI assistant.",
  },
  "/projects/growmont": {
    title: "Growmont CRM: local-first CRM",
    description:
      "A local-first CRM keeping client records, sales, and follow-ups in sync across desktop and mobile, online and offline.",
  },
  "/projects/growmont-pms": {
    title: "Growmont PMS: fund analysis & scoring",
    description:
      "Fund analysis and scoring for wealth managers, turning twenty years of mutual fund data into risk metrics and peer rankings.",
  },
  "/about": {
    title: "About",
    description:
      "Svayatta is a software and AI studio from Mumbai. Meet the founders and the standard behind the name स्वयत्ता.",
  },
  "/services": {
    title: "Services",
    description:
      "AI agents, conversational AI, custom software & ERP, analytics, web and growth, built around how your business works.",
  },
  "/discovery": {
    title: "Book a discovery call",
    description:
      "A 30-minute call to understand your workflows and tell you plainly what we'd build first.",
  },
  "/privacy": {
    title: "Privacy policy",
    description:
      "How Svayatta collects, protects, and processes personal data under India's Digital Personal Data Protection Act.",
  },
  "/terms": {
    title: "Terms of use",
    description:
      "Terms and conditions for using the Svayatta website and exploring our software and services.",
  },
};

export function pageMetadata(path: string, overrides?: Metadata): Metadata {
  const seo = PAGE_SEO[path] ?? {
    description:
      "Custom software, AI agents and workflow automation for Indian businesses, from a Mumbai studio.",
  };
  const url = `${BASE_URL}${path === "/" ? "" : path}`;

  const defaultFullTitle =
    "Svayatta | Custom software, AI & automation for Indian businesses";
  const ogTitle = seo.title ? `${seo.title} · Svayatta` : defaultFullTitle;

  const base: Metadata = {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description: seo.description,
      url,
      siteName: "Svayatta",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: seo.title ? `${seo.title} · Svayatta` : "Svayatta",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: seo.description,
      images: ["/og-image.png"],
    },
  };

  return {
    ...base,
    ...overrides,
    openGraph: {
      ...base.openGraph,
      ...overrides?.openGraph,
    },
    twitter: {
      ...base.twitter,
      ...overrides?.twitter,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function softwareApplicationJsonLd({
  name,
  description,
  slug,
  operatingSystem,
  applicationCategory = "BusinessApplication",
}: {
  name: string;
  description: string;
  slug: string;
  operatingSystem?: string;
  applicationCategory?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${BASE_URL}/projects/${slug}`,
    applicationCategory,
    ...(operatingSystem ? { operatingSystem } : {}),
    author: {
      "@type": "Organization",
      name: "Svayatta",
      url: BASE_URL,
    },
  };
}

export function serviceJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: slug ? `${BASE_URL}/services/${slug}` : `${BASE_URL}/services`,
    provider: {
      "@type": "Organization",
      name: "Svayatta",
      url: BASE_URL,
    },
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: plain(item.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: plain(item.a),
      },
    })),
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Book a discovery call",
    url: `${BASE_URL}/discovery`,
    mainEntity: {
      "@type": "Organization",
      name: "Svayatta",
      url: BASE_URL,
      email: "info@svayatta.in",
    },
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Svayatta",
    url: `${BASE_URL}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "Svayatta",
      legalName: "Svayatta Intelligence Private Limited",
      url: BASE_URL,
      founder: [
        {
          "@type": "Person",
          name: "Soham Boridkar",
          jobTitle: "Co-founder",
        },
        {
          "@type": "Person",
          name: "Smit Mhatre",
          jobTitle: "Co-founder",
        },
      ],
    },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

