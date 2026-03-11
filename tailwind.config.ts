import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          50:  "#f2f0eb", 100: "#e5e0d7", 200: "#ccc1af",
          300: "#b3a287", 400: "#9a835f", 500: "#7a6445",
          600: "#614f36", 700: "#493b28", 800: "#30271a",
          900: "#18130d", 950: "#0c0905",
        },
        signal: {
          50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0",
          300: "#86efac", 400: "#4ade80", 500: "#22c55e",
          600: "#16a34a", 700: "#15803d", 800: "#166534",
          900: "#14532d", 950: "#052e16",
        },
        canvas: { light: "#faf8f5", dark: "#0e0d0b" },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body:    ["var(--font-lora)", "Georgia", "serif"],
        mono:    ["var(--font-jetbrains)", "Fira Code", "monospace"],
        ui:      ["var(--font-syne)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        "display-sm": ["2.5rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-md": ["3.5rem",  { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["4.5rem",  { lineHeight: "1",    letterSpacing: "-0.04em" }],
      },
      maxWidth: { content: "1320px" },
      typography: (theme: (s: string) => string) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body":          theme("colors.ink.800"),
            "--tw-prose-headings":      theme("colors.ink.950"),
            "--tw-prose-links":         theme("colors.amber.700"),
            "--tw-prose-bold":          theme("colors.ink.900"),
            "--tw-prose-hr":            theme("colors.ink.200"),
            "--tw-prose-quotes":        theme("colors.ink.900"),
            "--tw-prose-quote-borders": theme("colors.amber.400"),
            "--tw-prose-code":          theme("colors.amber.800"),
            "--tw-prose-pre-bg":        theme("colors.ink.950"),
            fontFamily: "var(--font-lora)",
            fontSize: "1.0625rem",
            lineHeight: "1.8",
            a: {
              textDecoration: "underline",
              textDecorationColor: theme("colors.amber.400"),
              textUnderlineOffset: "3px",
              fontWeight: "500",
            },
            "h1,h2,h3,h4": { fontFamily: "var(--font-fraunces)", letterSpacing: "-0.02em" },
            "code::before": { content: '""' },
            "code::after":  { content: '""' },
            pre: { padding: "0", backgroundColor: "transparent" },
          },
        },
        invert: {
          css: {
            "--tw-prose-body":          theme("colors.ink.200"),
            "--tw-prose-headings":      theme("colors.ink.50"),
            "--tw-prose-links":         theme("colors.amber.400"),
            "--tw-prose-bold":          theme("colors.ink.100"),
            "--tw-prose-hr":            theme("colors.ink.700"),
            "--tw-prose-quotes":        theme("colors.ink.100"),
            "--tw-prose-quote-borders": theme("colors.amber.500"),
            "--tw-prose-code":          theme("colors.amber.300"),
          },
        },
      }),
      animation: {
        "fade-up":    "fadeUp 0.6s ease-out both",
        "fade-in":    "fadeIn 0.5s ease-out both",
        "slide-down": "slideDown 0.3s ease-out both",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideDown: { "0%": { opacity: "0", transform: "translateY(-8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

export default config;
