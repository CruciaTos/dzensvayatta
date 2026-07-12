import type { ReactNode } from "react";
import { Geist, DM_Serif_Display, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { siteMetadata, structuredData } from "@/lib/metadata";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SectionFlowProvider } from "@/components/providers/SectionFlow";
import { GlobalSilkBackground } from "@/components/ui/GlobalSilkBackground";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { GlobalVideoBackground } from "@/components/ui/GlobalVideoBackground";

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

const devanagariFont = localFont({
  src: "../public/fonts/RozhaOne-Regular.ttf",
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
      suppressHydrationWarning
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
      <body
        suppressHydrationWarning
        className="text-stone-100 font-sans font-light leading-relaxed overflow-x-hidden antialiased"
      >
        <SmoothScroll>
          <div className="relative min-h-screen">
            <GlobalVideoBackground />
            <SectionFlowProvider>
              <div className="relative z-10">{children}</div>
            </SectionFlowProvider>
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}