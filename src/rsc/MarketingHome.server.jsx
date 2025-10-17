import React from "react";

const HERO_PREVIEW_IMAGE = "/images/hero-preview.jpg";
const HERO_PREVIEW_SOURCES = [
  { type: "image/avif", srcSet: "/images/hero-preview.avif" },
  { type: "image/webp", srcSet: "/images/hero-preview.webp" },
];
const HERO_PREVIEW_SIZES = "(max-width: 768px) 92vw, (max-width: 1280px) 60vw, 540px";
const HERO_PREVIEW_DIMENSIONS = { width: 1920, height: 1080 };

const HERO_STATS = [
  { label: "Automations", value: "12,500+" },
  { label: "Uptime", value: "98.6%" },
  { label: "ROI", value: "4.8x" },
];

const HERO_LOGOS = [
  "Northwind",
  "Aurora",
  "Nimbus",
  "Atlas",
  "Velocity",
  "Zenith",
  "Skyline",
  "Lumen",
];

export default function MarketingHomeServer() {
  return (
    <section className="page-hero page-hero--rsc" aria-labelledby="hero-headline-static" data-static="true">
      <div className="page-hero__inner">
        <div className="page-hero__content" data-static="true">
          <span className="page-hero__eyebrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2L13.89 8.11L20 10L13.89 11.89L12 18L10.11 11.89L4 10L10.11 8.11L12 2Z"
                fill="currentColor"
              />
            </svg>
            <span>The Future of AI Automation</span>
          </span>
          <h1 id="hero-headline-static" className="page-hero__headline">
            Deploy Enterprise AI <span className="gradient-text">Automations</span> in Minutes
          </h1>
          <p className="page-hero__subheadline">
            Transform operations with battle-tested automations. No setup hell. No vendor lock-in. Just results.
          </p>
          <div className="cta-group" data-static="true">
            <a className="cta-primary" href="/signup" data-rsc-action="primary-cta">
              Start Free Trial
            </a>
            <a className="cta-secondary" href="#product-preview" data-rsc-action="secondary-cta">
              Watch Demo → <span className="video-badge">2 min preview</span>
            </a>
          </div>
          <p className="hero-cta-context">
            European teams get dedicated onboarding slots and GDPR-ready templates out of the box.
          </p>
          <div className="hero-stats" role="list">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="hero-stat" role="listitem">
                <span className="hero-stat__value">{stat.value}</span>
                <span className="hero-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="trusted-by" aria-label="Trusted by leading teams">
            <span className="trusted-by__eyebrow">Trusted by teams shipping AI in production</span>
            <div className="trusted-by__logos">
              {HERO_LOGOS.map((logo) => (
                <span key={logo} className="trusted-by__logo">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="page-hero__preview" id="product-preview" aria-hidden="true">
          <article className="preview-card">
            <span className="preview-card__chip">Live product preview</span>
            <div className="preview-card__stage" role="presentation">
              <picture className="hero-preview__fallback">
                {HERO_PREVIEW_SOURCES.map((source) => (
                  <source key={source.type} {...source} sizes={HERO_PREVIEW_SIZES} />
                ))}
                <img
                  src={HERO_PREVIEW_IMAGE}
                  width={HERO_PREVIEW_DIMENSIONS.width}
                  height={HERO_PREVIEW_DIMENSIONS.height}
                  alt="Artifically automation workspace preview"
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  sizes={HERO_PREVIEW_SIZES}
                />
              </picture>
              <div className="product-preview" aria-hidden="true">
                <div className="product-preview__frame">
                  <div className="product-preview__surface" />
                </div>
                <div className="product-preview__glow" />
              </div>
            </div>
            <p className="preview-card__annotation hero-quote">
              "We launched our global support automation in under 2 hours. Artifically handled auth, routing, and reporting out of the box."
              <span className="hero-quote__author">— Elena Ruiz, VP Operations</span>
            </p>
          </article>
        </div>
      </div>
      <div className="page-hero__roi" aria-hidden="true">
        <div className="hero-roi hero-roi--static">
          <header>
            <span className="hero-roi__eyebrow">ROI snapshot</span>
            <h2>Teams realise value on day one</h2>
          </header>
          <div className="hero-roi__grid">
            <div>
              <p>Median deployment time</p>
              <strong>47 minutes</strong>
            </div>
            <div>
              <p>Average annual savings</p>
              <strong>$1.8M</strong>
            </div>
            <div>
              <p>Compliance ready playbooks</p>
              <strong>38 regions</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}