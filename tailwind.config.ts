import type { Config } from "tailwindcss";

// Design tokens for the light editorial redesign (docs/redesign/02 §2).
// Colours are CSS variables defined in app/globals.css.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // rgb(var(--x-rgb) / <alpha-value>) so opacity modifiers work: text-paper/75.
      colors: {
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        tint: "rgb(var(--tint-rgb) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          2: "rgb(var(--ink-2-rgb) / <alpha-value>)",
          3: "rgb(var(--ink-3-rgb) / <alpha-value>)",
        },
        line: {
          soft: "var(--line-soft)",
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        sky: "rgb(var(--sky-rgb) / <alpha-value>)",
        haze: "rgb(var(--haze-rgb) / <alpha-value>)",
        violet: "rgb(var(--violet-rgb) / <alpha-value>)",
        night: {
          DEFAULT: "rgb(var(--night-rgb) / <alpha-value>)",
          ink: "rgb(var(--night-ink-rgb) / <alpha-value>)",
          muted: "rgb(var(--night-muted-rgb) / <alpha-value>)",
          line: "var(--night-line)",
        },
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
      },

      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        // Not a monospace face any more: uppercase meta labels in Host Grotesk
        // (tabular figures). The name stays so existing classes keep working.
        mono: ["var(--font-sans)", "system-ui", "sans-serif"],
        // No brand font covers Devanagari: स्वयत्ता uses the visitor's own.
        deva: ["Nirmala UI", "Kohinoor Devanagari", "Noto Sans Devanagari", "Mangal", "sans-serif"],
      },

      // [size, { lineHeight, letterSpacing, fontWeight }]; see §2.2.
      fontSize: {
        "display-xl": ["clamp(2.5rem, 5.4vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "600" }],
        "display-l": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "600" }],
        "display-m": ["clamp(2rem, 3.6vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "500" }],
        mega: ["clamp(2.75rem, 6.5vw, 5.75rem)", { lineHeight: "0.98", letterSpacing: "-0.03em", fontWeight: "700" }],
        "title-l": ["clamp(1.625rem, 2.6vw, 2.4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "500" }],
        "title-m": ["clamp(1.375rem, 2vw, 1.8rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "title-s": ["clamp(1.125rem, 1.4vw, 1.25rem)", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        lead: ["clamp(1.125rem, 1.6vw, 1.4rem)", { lineHeight: "1.6", fontWeight: "300" }],
        body: ["clamp(1rem, 1.2vw, 1.0625rem)", { lineHeight: "1.65", fontWeight: "400" }],
        small: ["clamp(0.875rem, 1vw, 0.90625rem)", { lineHeight: "1.6", fontWeight: "400" }],
        eyebrow: ["clamp(0.6875rem, 0.9vw, 0.75rem)", { lineHeight: "1", letterSpacing: "0.14em", fontWeight: "600" }],
        meta: ["clamp(0.6875rem, 0.9vw, 0.75rem)", { lineHeight: "1.3", letterSpacing: "0.12em", fontWeight: "500" }],
        button: ["0.875rem", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "500" }],
      },

      borderRadius: {
        pill: "999px",
        island: "14px",
        card: "16px",
        media: "12px",
        chip: "4px",
      },

      boxShadow: {
        hover: "0 16px 36px -12px rgba(10, 18, 24, 0.12)",
      },

      maxWidth: {
        content: "1280px",
      },

      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "200ms",
        med: "320ms",
        slow: "700ms",
        reveal: "1000ms",
      },

      keyframes: {
        "marquee-left": {
          from: { transform: "translate3d(0, 0, 0)" },
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
        "marquee-right": {
          from: { transform: "translate3d(-50%, 0, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        "marquee-left": "marquee-left 32s linear infinite",
        "marquee-right": "marquee-right 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
