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
      colors: {
        background: "#121416",   // ← added
        foreground: "#FAFAF8",   // ← added
        bg: {
          primary: "#121416",
          secondary: "#0A0B0D",
          tertiary: "#1C1E22",
          panel: "#191B1F",
        },
        beige: "#EFE6D8",
        offwhite: "#FAFAF8",
        ink: "#121416",
        stone: {
          100: "#F5F1EA",
          200: "#D9D4CC",
          300: "#B0A89B",
          400: "#968D7F",
          500: "#8F7860",
          600: "#6D6257",
        },
        accent: {
          DEFAULT: "#8F7860",
          light: "#A8947E",
          dim: "rgba(143, 120, 96, 0.15)",
        },
        border: {
          DEFAULT: "rgba(216, 211, 203, 0.10)",
          strong: "rgba(216, 211, 203, 0.18)",
        },
      },

      // ─── Typography ───────────────────────────────────────────
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        zaslia: ["var(--font-zaslia)", "sans-serif"],
        devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "sans-serif"],
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