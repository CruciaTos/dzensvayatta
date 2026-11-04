import type { ReactNode } from "react";
import type { Viewport } from "next";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteMetadata, structuredData } from "@/lib/metadata";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FooterReveal } from "@/components/motion/FooterReveal";
import { PageTransition } from "@/components/motion/PageTransition";
import { NavigationEffects } from "@/components/motion/NavigationEffects";
import { IntroLoader } from "@/components/motion/IntroLoader";
import { INTRO_SCRIPT } from "@/lib/intro";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

// Brand fonts: only from C:\Soham\Fonts (OFL licences in app/fonts). Nothing else.
// Host Grotesk: body text and uppercase meta labels (the `font-mono` token).
const sans = localFont({
  src: "./fonts/HostGrotesk-Variable.ttf",
  weight: "300 800",
  variable: "--font-sans",
  display: "swap",
});

// Schibsted Grotesk: headings and every display/title size.
const display = localFont({
  src: "./fonts/SchibstedGrotesk-Variable.ttf",
  weight: "400 900",
  variable: "--font-display",
  display: "swap",
});

// Fraunces Italic: the accent words only. Not preloaded (400KB).
const serif = localFont({
  src: "./fonts/Fraunces-Italic-Variable.ttf",
  weight: "100 900",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

// The footer's outlined DZEN watermark: Fraunces at the exact look it used
// (wght 500, opsz 144), as a static font with overlapping contours merged, so
// the outline stroke runs as one continuous line per letter. Only D, Z, E, N
// (3KB). Built from the variable Fraunces with fontTools (instancer, overlap
// removal). Not preloaded.
const serifUpright = localFont({
  src: "./fonts/Fraunces-DZEN-Watermark.ttf",
  weight: "500",
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

// Gotu (Ek Type): broad-nib Devanagari calligraphy for the hero's Marathi
// "स्वयत्ता". Cut down to that word's letters (15KB). Not preloaded: the hero
// loads it before drawing.
const marathi = localFont({
  src: "./fonts/Gotu-Svayatta.ttf",
  weight: "400",
  variable: "--font-marathi",
  display: "swap",
  preload: false,
});

export const metadata = siteMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={cn(
        sans.variable,
        display.variable,
        serif.variable,
        serifUpright.variable,
        marathi.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="bg-paper font-sans text-body text-ink antialiased overflow-x-clip">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-ink focus:px-5 focus:py-3 focus:text-button focus:text-paper"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <IntroLoader />
          <NavigationEffects />
          <Navbar />
          <PageTransition>
            {/* The footer slides up over the page's last screen. */}
            <FooterReveal footer={<Footer />}>{children}</FooterReveal>
          </PageTransition>
        </SmoothScroll>
        <SpeedInsights />
      </body>
    </html>
  );
}
