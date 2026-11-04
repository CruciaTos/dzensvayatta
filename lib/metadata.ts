import type { Metadata } from "next";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://svayatta.in";

/** The site's title and name, kept from the original site: don't change. */
export const SITE_TITLE = "Dzen Svayatta - Quality with Clarity";
export const SITE_NAME = "DZen";

export const siteMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  verification: {
    google: "Z43gnpcBFpd17f-oAg8wk084P",
  },
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Custom software, AI agents and workflow automation for Indian businesses, from a Mumbai studio. Scoped with you, shipped in small steps.",
  keywords: [
    "custom software India",
    "AI agents",
    "WhatsApp automation",
    "payroll software",
    "ERP",
    "CRM",
    "workflow automation",
    "Mumbai software studio",
    "local-first software",
    "enterprise AI",
  ],
  authors: [{ name: "Svayatta" }], // Switch to "Svayatta Intelligence Private Limited" once incorporation completes
  creator: "Svayatta",
  publisher: "Svayatta",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description:
      "Custom software, AI agents and workflow automation for Indian businesses, from a Mumbai studio. Scoped with you, shipped in small steps.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "Custom software, AI agents and workflow automation for Indian businesses, from a Mumbai studio. Scoped with you, shipped in small steps.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Svayatta",
  legalName: "Svayatta Intelligence Private Limited", // [confirm once incorporated]
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  email: "info@svayatta.in",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "MH",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.linkedin.com/company/dzen-svayatta/",
    "https://instagram.com/dzensvayatta", // [confirm handle]
  ],
  founder: [
    {
      "@type": "Person",
      name: "Soham Boridkar",
      jobTitle: "Co-founder",
      // [confirm] add personal telephone only if founders want it public
    },
    {
      "@type": "Person",
      name: "Smit Mhatre",
      jobTitle: "Co-founder",
      // [confirm] add personal telephone only if founders want it public
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@svayatta.in",
    contactType: "customer service",
  },
};
