import React from "react";

const HEADLINE_WIDTHS = ["9ch", "21ch", "8ch", "24ch", "7ch", "14ch"];
const SUBHEAD_WIDTHS = ["38ch", "32ch"];
const CTA_WIDTHS = ["18ch", "15ch"];
const TRUST_WIDTHS = ["20ch", "18ch", "16ch"];
const STAT_WIDTHS = [
  { value: "14ch", label: "10ch" },
  { value: "12ch", label: "11ch" },
  { value: "11ch", label: "9ch" },
];
const LOGO_WIDTHS = ["9ch", "8ch", "9ch", "7ch", "8ch", "9ch", "8ch", "7ch"];
const FLOATING_WIDTHS = ["12ch", "11ch", "10ch"];
const ROI_OPTION_WIDTHS = [
  ["12ch", "10ch", "11ch"],
  ["11ch", "9ch", "10ch"],
];
const ROI_META_WIDTHS = ["18ch", "14ch"];

export default function MarketingHomeServer() {
  return (
    <section
      id="marketing-hero-static"
      className="page-hero page-hero--shell"
      aria-labelledby="hero-headline-static"
      data-static="true"
    >
      <div className="hero-background hero-background--placeholder" aria-hidden="true" />
      <h1 id="hero-headline-static" className="sr-only">
        Loading hero experience
      </h1>
      <div className="page-hero__inner hero-shell" aria-hidden="true" data-static="true">
        <div className="page-hero__content hero-shell__content">
          <div className="hero-shell__eyebrow">
            <span className="hero-shell__surface hero-shell__icon" />
            <span className="hero-shell__line hero-shell__eyebrow-text" style={{ width: "22ch" }} />
          </div>
          <div className="hero-shell__headline">
            {HEADLINE_WIDTHS.map((width, index) => (
              <span
                key={`headline-${index}`}
                className="hero-shell__line hero-shell__headline-line"
                style={{ width }}
              />
            ))}
          </div>
          <div className="hero-shell__subheadline">
            {SUBHEAD_WIDTHS.map((width, index) => (
              <span key={`subheadline-${index}`} className="hero-shell__line hero-shell__text-line" style={{ width }} />
            ))}
          </div>
          <div className="hero-shell__cta">
            {CTA_WIDTHS.map((width, index) => (
              <span key={`cta-${index}`} className="hero-shell__surface hero-shell__cta-button" style={{ width }} />
            ))}
          </div>
          <div className="hero-shell__trust">
            {TRUST_WIDTHS.map((width, index) => (
              <span key={`trust-${index}`} className="hero-shell__surface hero-shell__trust-pill" style={{ width }} />
            ))}
          </div>
          <div className="hero-shell__stats" role="presentation">
            {STAT_WIDTHS.map((dimensions, index) => (
              <div key={`stat-${index}`} className="hero-shell__surface hero-shell__stat">
                <span className="hero-shell__line hero-shell__stat-value" style={{ width: dimensions.value }} />
                <span className="hero-shell__line hero-shell__stat-label" style={{ width: dimensions.label }} />
              </div>
            ))}
          </div>
          <div className="hero-shell__logos" role="presentation">
            {LOGO_WIDTHS.map((width, index) => (
              <span key={`logo-${index}`} className="hero-shell__surface hero-shell__logo" style={{ width }} />
            ))}
          </div>
        </div>
        <div className="page-hero__preview hero-shell__preview" aria-hidden="true" data-static="true">
          <article className="hero-shell__surface hero-shell__preview-card">
            <span className="hero-shell__surface hero-shell__preview-chip" style={{ width: "16ch" }} />
            <div className="hero-shell__preview-grid">
              {Array.from({ length: 9 }).map((_, index) => (
                <span key={`preview-cell-${index}`} className="hero-shell__surface hero-shell__preview-cell" />
              ))}
            </div>
            <div className="hero-shell__preview-tooltip">
              <span className="hero-shell__line hero-shell__tooltip-title" style={{ width: "20ch" }} />
              <span className="hero-shell__line hero-shell__tooltip-body" style={{ width: "28ch" }} />
            </div>
            <div className="hero-shell__quote">
              <span className="hero-shell__line hero-shell__quote-line" style={{ width: "34ch" }} />
              <span className="hero-shell__line hero-shell__quote-line" style={{ width: "22ch" }} />
            </div>
          </article>
          <div className="hero-shell__floating">
            {FLOATING_WIDTHS.map((width, index) => (
              <span key={`floating-${index}`} className="hero-shell__surface hero-shell__floating-badge" style={{ width }} />
            ))}
          </div>
        </div>
      </div>
      <div className="page-hero__roi hero-shell__roi" aria-hidden="true" data-static="true">
        <section className="hero-roi hero-roi--shell">
          <header>
            <span className="hero-shell__line hero-shell__roi-eyebrow" style={{ width: "18ch" }} />
            <span className="hero-shell__line hero-shell__roi-title" style={{ width: "36ch" }} />
          </header>
          <div className="hero-roi__grid hero-roi__grid--shell">
            {ROI_OPTION_WIDTHS.map((options, fieldIndex) => (
              <div key={`roi-options-${fieldIndex}`} className="hero-roi__options hero-roi__options--shell">
                <span className="hero-shell__line hero-shell__roi-legend" style={{ width: "16ch" }} />
                <div className="hero-shell__roi-choices">
                  {options.map((width, index) => (
                    <span key={`roi-choice-${fieldIndex}-${index}`} className="hero-shell__surface hero-shell__roi-choice" style={{ width }} />
                  ))}
                </div>
              </div>
            ))}
            <div className="hero-roi__result hero-roi__result--shell">
              <span className="hero-shell__line hero-shell__roi-label" style={{ width: "20ch" }} />
              <span className="hero-shell__line hero-shell__roi-value" style={{ width: "24ch" }} />
              <div className="hero-shell__roi-meta">
                {ROI_META_WIDTHS.map((width, index) => (
                  <span key={`roi-meta-${index}`} className="hero-shell__line hero-shell__roi-meta-line" style={{ width }} />
                ))}
              </div>
            </div>
          </div>
          <span className="hero-shell__line hero-shell__roi-footnote" style={{ width: "44ch" }} />
        </section>
      </div>
    </section>
  );
}