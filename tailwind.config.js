import defaultTheme from "tailwindcss/defaultTheme";

const fontSans = ["var(--font-sans)", "Inter", ...defaultTheme.fontFamily.sans];
const fontMono = ["var(--font-mono)", ...defaultTheme.fontFamily.mono];

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./design-system/**/*.{js,ts,jsx,tsx}",
    "./marketing/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: fontSans,
        heading: ["var(--font-heading)", ...fontSans],
        mono: fontMono,
      },
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          glow: "var(--brand-glow)",
          energy: "var(--brand-energy)",
          muted: "var(--brand-muted)",
        },
        surface: {
          base: "var(--bg-primary)",
          elevated: "var(--bg-card)",
        },
        accent: {
          soft: "var(--accent-soft)",
          hot: "var(--accent-hot)",
        },
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        ambient: "var(--shadow-ambient)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      transitionDuration: {
        instant: "120ms",
      },
      transitionTimingFunction: {
        "out-cubic": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("supports-hover", "@media (hover: hover)");
      addVariant("supports-no-hover", "@media (hover: none)");
    },
  ],
};