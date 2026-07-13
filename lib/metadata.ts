import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://svayatta.in";

export const siteMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Dzen Svayatta - Quality with Clarity",
    template: "%s | DZen",
  },
  description:
    "We build the infrastructure behind how your business scales.",
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
    title: "Dzen Svayatta - Quality with Clarity",
    description:
      "We build the infrastructure behind how your business scales.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dzen Svayatta - Quality with Clarity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dzen Svayatta - Quality with Clarity",
    description:
      "WWe build the infrastructure behind how your business scales.",
    images: ["/og-image.png"],
    creator: "@DZenSvayatta_io",
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
  name: "DZenSvayatta",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "We build the infrastructure behind how your business scales.",
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
    email: "hello@svayatta.in",
    contactType: "customer service",
  },
  sameAs: ["https://linkedin.com/company/dzen-svayatta"],
};