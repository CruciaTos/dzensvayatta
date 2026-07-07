import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://DZen.io";

export const siteMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "DZen — Intelligent Workflow Integration",
    template: "%s | DZen",
  },
  description:
    "DZen integrates AI into how your business runs: connecting your existing systems, automating the work your team already does, and delivering results you can measure.",
  keywords: [
    "workflow integration",
    "enterprise AI",
    "process automation",
    "ERP integration",
    "CRM orchestration",
    "operational intelligence",
    "business automation",
  ],
  authors: [{ name: "DZen, Inc." }],
  creator: "DZen, Inc.",
  publisher: "DZen, Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "DZen",
    title: "DZen — Intelligent Workflow Integration",
    description:
      "We build AI into how your business runs: connecting your existing systems and automating the work your team already does.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DZen — Intelligent Workflow Integration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DZen — Intelligent Workflow Integration",
    description:
      "We integrate AI into the operational fabric of your business. Your systems, working together.",
    images: ["/og-image.png"],
    creator: "@DZen_io",
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DZen",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "Intelligent workflow integration for mid-market and enterprise businesses.",
  founder: [
    {
      "@type": "Person",
      name: "Soham Boridkar",
      telephone: "+919321559182",
    },
    {
      "@type": "Person",
      name: "Smit Mhatre",
      telephone: "+919324976982",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@DZen.io",
    contactType: "customer service",
  },
  sameAs: ["https://linkedin.com/company/DZen"],
};