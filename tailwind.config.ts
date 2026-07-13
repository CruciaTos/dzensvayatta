import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Colors ───────────────────────────────────────────────
      // Matches the palette actually used across every section (was previously
      // a leftover warm beige/stone theme that nothing on the site rendered in).
      colors: {
        background: "#000b12",
        foreground: "#e5f3e5",

        // Sky-blue accent used for highlights, active states, and CTAs
        accent: {
          DEFAULT: "#7EC3E2",
          light: "#B2D5E5",
        },

        // Only the two shades actually referenced (SectionIndex, marquee heading)
        stone: {
          100: "#e5f3e5",
          500: "#7C93A0",
        },

        // Hairline dividers / card borders
        border: {
          DEFAULT: "rgba(178, 213, 229, 0.10)",
          strong: "rgba(126, 195, 226, 0.28)",
        },
      },

      // ─── Typography ───────────────────────────────────────────
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        zaslia: ["var(--font-zaslia)", "sans-serif"],
        devanagari: ["var(--font-devanagari)"],
      },
      fontSize: {
        "display-1": ["clamp(64px,8vw,120px)", { lineHeight: "0.93", letterSpacing: "-0.03em" }],
        "display-2": ["clamp(44px,5.5vw,80px)", { lineHeight: "0.98", letterSpacing: "-0.025em" }],
        "display-3": ["clamp(32px,4vw,56px)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "headline": ["clamp(20px,2.2vw,28px)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "body-lg": ["20px", { lineHeight: "1.75" }],
        "body": ["16px", { lineHeight: "1.75" }],
        "caption": ["12px", { lineHeight: "1", letterSpacing: "0.12em" }],
        "label": ["11px", { lineHeight: "1", letterSpacing: "0.14em" }],
      },

      // ─── Spacing ──────────────────────────────────────────────
      maxWidth: {
        content: "1280px",
        site: "1440px",
      },

      // ─── Animations ───────────────────────────────────────────
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        "marquee": "ticker 40s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in": "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },

      // ─── Transitions ──────────────────────────────────────────
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        "ease-in-out-expo": "cubic-bezier(0.45, 0, 0.55, 1)",
      },
    },
  },
  plugins: [],
};

export default config;