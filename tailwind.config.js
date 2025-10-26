import defaultTheme from "tailwindcss/defaultTheme";

const fontSans = ["var(--font-sans)", "Inter", ...defaultTheme.fontFamily.sans];
const fontMono = ["var(--font-mono)", ...defaultTheme.fontFamily.mono];

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./design-system/**/*.{js,ts,jsx,tsx}",
    "./features/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./marketing/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1920px",
    },
    extend: {
      fontFamily: {
        sans: fontSans,
        heading: ["var(--font-heading)", ...fontSans],
        mono: fontMono,
      },
      /**
       * Mobile-First Responsive Typography
       * Base sizes optimized for readability across all devices
       */
      fontSize: {
        // Body text - fluid scaling from mobile to desktop
        "body-xs": ["0.75rem", { lineHeight: "1.6", letterSpacing: "0.01em" }], // 12px
        "body-sm": ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.01em" }], // 14px
        "body-base": ["1rem", { lineHeight: "1.6", letterSpacing: "0" }], // 16px
        "body-lg": ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }], // 18px

        // Fluid responsive sizes using clamp()
        "fluid-sm": [
          "clamp(0.875rem, 0.8rem + 0.375vw, 1rem)",
          { lineHeight: "1.6" },
        ], // 14px → 16px
        "fluid-base": [
          "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
          { lineHeight: "1.5" },
        ], // 16px → 18px
        "fluid-lg": [
          "clamp(1.125rem, 1rem + 0.625vw, 1.5rem)",
          { lineHeight: "1.4" },
        ], // 18px → 24px

        // Headings - optimized mobile to desktop scaling
        "heading-sm": [
          "clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ], // 20px → 24px
        "heading-md": [
          "clamp(1.5rem, 1.3rem + 1vw, 2rem)",
          { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "700" },
        ], // 24px → 32px
        "heading-lg": [
          "clamp(2rem, 1.5rem + 2.5vw, 3rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ], // 32px → 48px
        "heading-xl": [
          "clamp(2.5rem, 2rem + 2.5vw, 3.75rem)",
          { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "800" },
        ], // 40px → 60px
        "heading-2xl": [
          "clamp(3rem, 2.5rem + 2.5vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" },
        ], // 48px → 72px
        "heading-3xl": [
          "clamp(3.5rem, 3rem + 2.5vw, 5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "900" },
        ], // 56px → 80px

        // Display text - hero sections
        "display-sm": [
          "clamp(2.5rem, 2rem + 2.5vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "900" },
        ], // 40px → 64px
        "display-md": [
          "clamp(3rem, 2.5rem + 2.5vw, 5rem)",
          { lineHeight: "1.05", letterSpacing: "-0.035em", fontWeight: "900" },
        ], // 48px → 80px
        "display-lg": [
          "clamp(4rem, 3rem + 5vw, 6rem)",
          { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "900" },
        ], // 64px → 96px
      },
      /**
       * Responsive Spacing Scale
       * Mobile-first spacing with proportional scaling
       */
      spacing: {
        18: "4.5rem", // 72px
        22: "5.5rem", // 88px
        26: "6.5rem", // 104px
        30: "7.5rem", // 120px
        // Fluid spacing
        "fluid-xs": "clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)", // 8px → 12px
        "fluid-sm": "clamp(0.75rem, 0.6rem + 0.75vw, 1rem)", // 12px → 16px
        "fluid-md": "clamp(1rem, 0.8rem + 1vw, 1.5rem)", // 16px → 24px
        "fluid-lg": "clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem)", // 24px → 40px
        "fluid-xl": "clamp(2rem, 1.5rem + 2.5vw, 3.5rem)", // 32px → 56px
        "fluid-2xl": "clamp(3rem, 2rem + 5vw, 5rem)", // 48px → 80px
      },
      /**
       * Line Height Scale for Responsive Typography
       */
      lineHeight: {
        "mobile-tight": "1.15",
        "mobile-snug": "1.25",
        "mobile-normal": "1.5",
        "mobile-relaxed": "1.6",
        "desktop-tight": "1.1",
        "desktop-snug": "1.2",
        "desktop-normal": "1.4",
        "desktop-relaxed": "1.5",
      },
      /**
       * Min Height for Touch Targets (WCAG 2.1 Level AAA)
       */
      minHeight: {
        touch: "48px", // Minimum touch target
        "touch-comfortable": "52px", // Comfortable touch target
        "touch-spacious": "56px", // Spacious touch target
      },
      /**
       * Min Width for Touch Targets
       */
      minWidth: {
        touch: "48px",
        "touch-comfortable": "52px",
        "touch-spacious": "56px",
      },
      colors: {
        /* Brand Colors - Theme-aware */
        brand: {
          primary: "var(--brand-primary)",
          'primary-hover': "var(--brand-primary-hover)",
          'primary-active': "var(--brand-primary-active)",
          secondary: "var(--brand-secondary)",
          accent: "var(--brand-accent)",
          glow: "var(--brand-glow)",
          energy: "var(--brand-energy)",
          muted: "var(--brand-muted)",
          depth: "var(--brand-depth)",
        },

        /* Background Colors */
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          elevated: "var(--bg-elevated)",
          card: "var(--bg-card)",
          overlay: "var(--bg-overlay)",
          inverse: "var(--bg-inverse)",
        },

        /* Surface Colors (alias for bg) */
        surface: {
          base: "var(--bg-primary)",
          raised: "var(--surface-raised)",
          elevated: "var(--bg-card)",
        },

        /* Text Colors */
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
          link: "var(--text-link)",
          'link-hover': "var(--text-link-hover)",
          'on-brand': "var(--text-on-brand)",
          disabled: "var(--text-disabled)",
        },

        /* Border Colors */
        border: {
          default: "var(--border-default)",
          strong: "var(--border-strong)",
          subtle: "var(--border-subtle)",
          focus: "var(--border-focus)",
          inverse: "var(--border-inverse)",
        },

        /* Interactive States */
        interactive: {
          hover: "var(--interactive-hover)",
          active: "var(--interactive-active)",
          focus: "var(--interactive-focus)",
          disabled: "var(--interactive-disabled)",
          'disabled-text': "var(--interactive-disabled-text)",
        },

        /* Status Colors */
        status: {
          success: "var(--status-success)",
          'success-bg': "var(--status-success-bg)",
          'success-border': "var(--status-success-border)",
          warning: "var(--status-warning)",
          'warning-bg': "var(--status-warning-bg)",
          'warning-border': "var(--status-warning-border)",
          error: "var(--status-error)",
          'error-bg': "var(--status-error-bg)",
          'error-border': "var(--status-error-border)",
          info: "var(--status-info)",
          'info-bg': "var(--status-info-bg)",
          'info-border': "var(--status-info-border)",
        },

        /* Legacy aliases for backward compatibility */
        accent: {
          soft: "var(--brand-secondary)",
          hot: "var(--brand-accent)",
        },
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        '2xl': "var(--shadow-2xl)",
        inner: "var(--shadow-inner)",
        glow: "var(--shadow-glow)",
        'glow-strong': "var(--shadow-glow-strong)",
        ambient: "var(--shadow-ambient)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        '2xl': "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      zIndex: {
        base: "var(--z-base)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        'modal-backdrop': "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
        notification: "var(--z-notification)",
      },
      backgroundImage: {
        'gradient-primary': "var(--gradient-primary)",
        'gradient-accent': "var(--gradient-accent)",
        'gradient-hero': "var(--gradient-hero)",
        'gradient-mesh': "var(--gradient-mesh)",
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