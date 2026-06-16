import type { ReactNode } from "react";
import { Geist, DM_Serif_Display, IBM_Plex_Mono, Noto_Sans_Devanagari } from "next/font/google";
import localFont from "next/font/local";
import { siteMetadata, structuredData } from "@/lib/metadata";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

// ─── Font loading ─────────────────────────────────────────────────────────────
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
  display: "swap",
});

const zaslia = localFont({
  src: "../public/fonts/zaslia/Zaslia.otf",
  variable: "--font-zaslia",
  display: "swap",
});

const devanagariFont = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["300", "400", "500"],
  variable: "--font-devanagari",
  display: "swap",
});

// ─── Metadata export ──────────────────────────────────────────────────────────
export const metadata = siteMetadata;

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(
        geist.variable,
        dmSerifDisplay.variable,
        ibmPlexMono.variable,
        zaslia.variable,
        devanagariFont.variable,
        "font-sans"
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body className="bg-bg-primary text-stone-100 font-sans font-light leading-relaxed overflow-x-hidden antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}