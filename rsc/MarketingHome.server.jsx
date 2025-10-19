import React from "react";
import { BarChart3, Bell, Code2, Cog, Database, Lock, Mail, Users, Workflow } from "lucide-react";

const HEADLINE_WORDS = [
  { text: "Deploy" },
  { text: "Enterprise" },
  { text: "AI" },
  { text: "Automations", highlight: true },
  { text: "in" },
  { text: "Minutes" },
];

const HERO_STATS = [
  { label: "Automations", value: "12,500+" },
  { label: "Uptime", value: "98.6%" },
  { label: "ROI", value: "4.8x" },
];

const TRUST_SIGNALS = [
  "No credit card required",
  "Free 14-day trial",
  "Cancel anytime",
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

const PREVIEW_TILES = [
  {
    icon: Database,
    label: "Unified Data Lake",
    description: "Stream customer and ops data into one warehouse with automated schema mapping.",
  },
  {
    icon: BarChart3,
    label: "Executive Dashboards",
    description: "Broadcast KPI shifts to every region with adaptive alerting workflows.",
  },
  {
    icon: Mail,
    label: "Smart Outreach",
    description: "Trigger tailored nurture campaigns the second intent signals spike.",
  },
  {
    icon: Cog,
    label: "Ops Orchestration",
    description: "Automate hand-offs between systems and teams with zero manual routing.",
  },
  {
    icon: Users,
    label: "Agent Assist",
    description: "Serve frontline teams AI copilots that surface next-best actions instantly.",
  },
  {
    icon: Workflow,
    label: "Workflow Builder",
    description: "Drag-and-drop approvals, escalations, and QA into reusable playbooks.",
  },
  {
    icon: Code2,
    label: "API Automations",
    description: "Deploy serverless functions that connect every bespoke tool in minutes.",
  },
  {
    icon: Bell,
    label: "Incident Alerts",
    description: "Route critical incidents to the right owner with AI-prioritized severity.",
  },
  {
    icon: Lock,
    label: "Governance Guardrails",
    description: "Enforce SOC2-ready policies with full audit trails and role-based control.",
  },
];

const FLOATING_BADGES = [
  { id: "deploy", icon: "⚡", label: "Deploy in 5 min" },
  { id: "uptime", icon: "✓", label: "99.9% Uptime" },
  { id: "active", icon: "🚀", label: "10K+ Active" },
];

const ROI_TEAM_OPTIONS = [
  { label: "20", value: 20 },
  { label: "45", value: 45, defaultChecked: true },
  { label: "85", value: 85 },
];

const ROI_RATE_OPTIONS = [
  { label: "$45", value: 45 },
  { label: "$85", value: 85, defaultChecked: true },
  { label: "$140", value: 140 },
];

export default function MarketingHomeServer() {
  return (
    <section
      id="marketing-hero-static"
      className="page-hero page-hero--rsc"
      aria-labelledby="hero-headline-static"
      data-static="true"
    >
      <div className="page-hero__inner">
        <div className="page-hero__content" data-static="true">
          <span className="page-hero__eyebrow" data-static="true">
            <span className="page-hero__eyebrow-icon" aria-hidden="true">
              ⚡
            </span>
            <span>The Future of AI Automation</span>
          </span>
          <h1 id="hero-headline-static" className="page-hero__headline">
            {HEADLINE_WORDS.map((word) => (
              <span
                key={word.text}
                className={word.highlight ? "headline-word headline-word--gradient" : "headline-word"}
              >
                {word.text}
              </span>
            ))}
          </h1>
          <p className="page-hero__subheadline">
            Transform operations with battle-tested automations. No setup hell. No vendor lock-in. Just results.
          </p>
          <div className="cta-group" data-static="true">
            <a className="cta-primary" href="/signup" data-rsc-action="primary-cta">
              <span className="cta-primary__label">Start Free Trial</span>
            </a>
            <a className="cta-secondary" href="#product-preview" data-rsc-action="secondary-cta">
              <span className="cta-secondary__icon" aria-hidden="true">
                ▶
              </span>
              <span>Watch Demo</span>
            </a>
          </div>
          <div className="hero-trust-row" data-static="true">
            {TRUST_SIGNALS.map((signal) => (
              <span key={signal} className="trust-signal">
                <span className="trust-signal__icon" aria-hidden="true">
                  <span className="trust-signal__check">✓</span>
                </span>
                <span>{signal}</span>
              </span>
            ))}
          </div>
          <p className="hero-cta-context">
            European teams get dedicated onboarding slots and GDPR-ready templates out of the box.
          </p>
          <div className="hero-stats" role="list" data-static="true">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="hero-stat" role="listitem">
                <span className="hero-stat__value">{stat.value}</span>
                <span className="hero-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="trusted-by trusted-by--visible" aria-label="Trusted by leading teams" data-static="true">
            <p className="trusted-by__eyebrow">TRUSTED BY TEAMS SHIPPING AI IN PRODUCTION</p>
            <div className="trusted-by__logos" role="list">
              {HERO_LOGOS.map((logo, index) => (
                <span
                  key={logo}
                  role="listitem"
                  className="trusted-by__logo"
                  data-trusted-logo=""
                  style={{ "--trusted-index": index }}
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="page-hero__preview" id="product-preview" aria-hidden="true" data-static="true">
          <article className="preview-card" data-static="true">
            <span className="preview-card__chip">LIVE PRODUCT PREVIEW</span>
            <div className="preview-card__stage">
              <div className="preview-grid" data-static="true">
                {PREVIEW_TILES.map((tile, index) => {
                  const IconComponent = tile.icon;
                  return (
                    <button
                      key={tile.label}
                      type="button"
                      className="preview-grid__cell"
                      data-index={index}
                      aria-pressed={index === 0 ? "true" : "false"}
                      disabled
                    >
                      <IconComponent
                        size={32}
                        strokeWidth={1.6}
                        className="preview-grid__icon"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{tile.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="preview-card__tooltip" data-static="true">
                <span className="preview-card__tooltip-title">{PREVIEW_TILES[0].label}</span>
                <p>{PREVIEW_TILES[0].description}</p>
              </div>
            </div>
            <p className="preview-card__annotation hero-quote">
              "We launched our global support automation in under 2 hours. Artifically handled auth, routing, and reporting out of the box."
              <span className="hero-quote__author">— Elena Ruiz, VP Operations</span>
            </p>
          </article>
          {FLOATING_BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`preview-floating preview-floating--${badge.id}`}
              aria-hidden="true"
            >
              <span className="preview-floating__icon">{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </div>
      </div>
      <div className="page-hero__roi" aria-hidden="true">
        <section className="hero-roi" aria-label="Quick ROI estimator" data-static="true">
          <header>
            <p className="hero-roi__eyebrow">Estimate your first win</p>
            <h2>See how quickly Artifically pays for itself</h2>
          </header>
          <div className="hero-roi__grid">
            <fieldset className="hero-roi__options" aria-hidden="true">
              <legend>Team size</legend>
              <div role="radiogroup" aria-label="Team size">
                {ROI_TEAM_OPTIONS.map((option) => (
                  <label key={option.value} className="hero-roi__choice">
                    <input
                      type="radio"
                      name="hero-roi-team-static"
                      value={option.value}
                      defaultChecked={Boolean(option.defaultChecked)}
                      disabled
                    />
                    <span>{option.label} people</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="hero-roi__options" aria-hidden="true">
              <legend>Average hourly rate</legend>
              <div role="radiogroup" aria-label="Average hourly rate">
                {ROI_RATE_OPTIONS.map((option) => (
                  <label key={option.value} className="hero-roi__choice">
                    <input
                      type="radio"
                      name="hero-roi-rate-static"
                      value={option.value}
                      defaultChecked={Boolean(option.defaultChecked)}
                      disabled
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="hero-roi__result" role="status" aria-live="polite">
              <p className="hero-roi__label">Projected monthly savings</p>
              <p className="hero-roi__value">$326,000</p>
              <dl className="hero-roi__meta">
                <div>
                  <dt>Weekly hours reclaimed</dt>
                  <dd>640 hrs</dd>
                </div>
                <div>
                  <dt>Projected ROI</dt>
                  <dd>4.8x</dd>
                </div>
              </dl>
            </div>
          </div>
          <p className="hero-roi__footnote">
            Calculations update instantly—export the assumptions when you open the marketplace or share with finance.
          </p>
        </section>
      </div>
    </section>
  );
}