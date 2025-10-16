import { useMemo } from "react";
import tokens from "../styles/tokens.json";
import ThemeToggle from "../components/ThemeToggle";
import ContrastToggle from "../components/ContrastToggle";
import { Icon } from "../components/icons";

const BRAND_SETS = tokens.color?.brandSets ?? {};
const SPACING_TOKENS = tokens.spacing ?? {};
const TYPOGRAPHY_TOKENS = tokens.typography ?? {};

function ColorSwatch({ name, value, description }) {
  return (
    <div className="design-token-card" aria-label={`${name} ${description ?? "color"}`}>
      <div className="design-token-card__swatch" style={{ background: value }} />
      <div className="design-token-card__meta">
        <strong>{name}</strong>
        <span>{value}</span>
        {description ? <small>{description}</small> : null}
      </div>
    </div>
  );
}

function ThemePreview() {
  return (
    <div className="theme-preview" aria-label="Theme comparison">
      <div className="theme-preview__panel" data-theme="light">
        <header>
          <span className="theme-preview__chip">Light</span>
          <p>Elegant glass surfaces, warm gradients, and crisp typography.</p>
        </header>
        <div className="theme-preview__content">
          <Icon name="sparkles" size={20} />
          <span>Adaptive layout</span>
        </div>
      </div>
      <div className="theme-preview__panel" data-theme="dark">
        <header>
          <span className="theme-preview__chip">Dark</span>
          <p>High contrast UI tuned for focus in low-light control rooms.</p>
        </header>
        <div className="theme-preview__content">
          <Icon name="robot" size={20} />
          <span>Immersive workflows</span>
        </div>
      </div>
      <div className="theme-preview__panel" data-contrast="high">
        <header>
          <span className="theme-preview__chip">High contrast</span>
          <p>Accessible palette for extreme clarity and compliance reviews.</p>
        </header>
        <div className="theme-preview__content">
          <Icon name="contrast" size={20} />
          <span>Accessibility ready</span>
        </div>
      </div>
    </div>
  );
}

export default function DesignSystem() {
  const spacingEntries = useMemo(() => Object.entries(SPACING_TOKENS), []);
  const typographySizes = useMemo(() => Object.entries(TYPOGRAPHY_TOKENS.size ?? {}), []);

  return (
    <main className="design-system" data-animate-root>
      <header className="design-system__header">
        <div>
          <h1>Design System</h1>
          <p>
            Centralized tokens power our product across light, dark, and high-contrast modes. Explore the live palette,
            typography, and spacing scales backing every surface.
          </p>
        </div>
        <div className="design-system__toggles">
          <ContrastToggle label="Toggle high contrast preview" />
          <ThemeToggle label="Toggle theme preview" />
        </div>
      </header>

      <section aria-labelledby="design-colors">
        <div className="design-system__section-header">
          <h2 id="design-colors">Multi-brand palette</h2>
          <p>Wide-gamut color tokens adapt across brand expressions and P3 capable displays.</p>
        </div>
        <div className="design-token-grid">
          {Object.entries(BRAND_SETS).map(([brand, values]) => (
            <article key={brand} className="design-token-collection">
              <h3>{brand.charAt(0).toUpperCase() + brand.slice(1)}</h3>
              <div className="design-token-collection__swatches">
                <ColorSwatch name="Primary" value={values.primary} description="sRGB" />
                {values.primaryP3 ? (
                  <ColorSwatch name="Primary P3" value={values.primaryP3} description="P3" />
                ) : null}
                <ColorSwatch name="Accent" value={values.accent} description="Accent" />
                {values.accentP3 ? (
                  <ColorSwatch name="Accent P3" value={values.accentP3} description="P3" />
                ) : null}
                <ColorSwatch name="Success" value={values.success} description="Success" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="design-theme-preview">
        <div className="design-system__section-header">
          <h2 id="design-theme-preview">Theme adaptability</h2>
          <p>Preview the interface system rendered in light, dark, and high-contrast modes.</p>
        </div>
        <ThemePreview />
      </section>

      <section aria-labelledby="design-spacing">
        <div className="design-system__section-header">
          <h2 id="design-spacing">Spacing scale</h2>
          <p>Fluid spacing tokens keep layouts consistent across breakpoints.</p>
        </div>
        <div className="design-token-grid design-token-grid--spacing">
          {spacingEntries.map(([token, value]) => (
            <div key={token} className="design-token-card">
              <div className="design-token-card__swatch design-token-card__swatch--spacing" style={{ height: `calc(${value})` }} />
              <div className="design-token-card__meta">
                <strong>{token}</strong>
                <span>{value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="design-typography">
        <div className="design-system__section-header">
          <h2 id="design-typography">Typography</h2>
          <p>Responsive type sizes defined with <code>clamp()</code> ensure readability everywhere.</p>
        </div>
        <div className="design-token-grid design-token-grid--typography">
          {typographySizes.map(([token, value]) => (
            <div key={token} className="design-token-card">
              <div className="design-token-card__meta">
                <strong>{token}</strong>
                <span>{value}</span>
              </div>
              <div className="design-token-card__preview" style={{ fontSize: `calc(${value})` }}>
                A a
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="design-tokens-raw">
        <div className="design-system__section-header">
          <h2 id="design-tokens-raw">Raw tokens</h2>
          <p>Tokens are sourced from <code>src/styles/tokens.json</code> and applied globally as CSS custom properties.</p>
        </div>
        <pre className="design-token-json" role="presentation">
          {JSON.stringify({ color: tokens.color, spacing: tokens.spacing, typography: tokens.typography }, null, 2)}
        </pre>
      </section>
    </main>
  );
}