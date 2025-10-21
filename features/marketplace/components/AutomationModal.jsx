"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../../components/icons";
import { useFocusTrap } from "@/hooks/useFocusTrap";

function titleCase(value = "") {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export default function AutomationModal({
  item,
  onClose,
  featureHighlights,
  simulationSteps,
  sampleDataset,
  metrics,
  previewSummary,
  priceLabel,
  onDeploy,
  onDemo,
  modalId,
  descriptionId,
  returnFocusRef,
}) {
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const containerRef = useRef(null);
  const closeButtonRef = useRef(null);

  const handleRequestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    if (typeof window !== "undefined") {
      closeTimerRef.current = window.setTimeout(() => {
        onClose();
      }, 250);
    } else {
      onClose();
    }
  }, [closing, onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current && typeof window !== "undefined") {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useFocusTrap(!closing, containerRef, {
    initialFocusRef: closeButtonRef,
    onEscape: handleRequestClose,
    returnFocusRef,
  });

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const { body } = document;
    if (!body) return undefined;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  const overviewParagraphs = useMemo(() => {
    const primary = item?.longDescription || item?.description || item?.summary;
    const fallbackIntro = `${item.name} uses adaptive orchestration to keep your systems aligned without manual triage.`;
    const datasetEntry = sampleDataset?.[0];
    const detailSet = [
      primary || fallbackIntro,
      `Teams like ${metrics.company} reclaim roughly ${metrics.hoursSaved} hours every week while maintaining a ${metrics.satisfaction}% satisfaction score.`,
      datasetEntry
        ? `${datasetEntry.context} workflows move ${datasetEntry.payload} with ${datasetEntry.confidence} focused on ${datasetEntry.focus}.`
        : metrics.statement,
    ];
    return detailSet.filter(Boolean);
  }, [item, metrics, sampleDataset]);

  const featureList = useMemo(() => {
    if (Array.isArray(featureHighlights) && featureHighlights.length > 0) {
      return featureHighlights;
    }
    return [
      "Autonomous routing across every tool",
      "Built-in human review checkpoints",
      "Predictive insights for upcoming demand",
      "Enterprise-grade compliance logging",
    ];
  }, [featureHighlights]);

  const steps = useMemo(() => {
    if (Array.isArray(simulationSteps) && simulationSteps.length > 0) {
      return simulationSteps;
    }
    return [
      {
        id: "capture",
        label: "Capture",
        summary: "Ingest live data streams",
        detail: "Connect your core systems in seconds",
      },
      {
        id: "understand",
        label: "Understand",
        summary: "Classify and enrich every event",
        detail: "AI models surface the context your team needs",
      },
      {
        id: "automate",
        label: "Automate",
        summary: "Sync decisions across destinations",
        detail: "Trigger updates, alerts, and playbooks automatically",
      },
    ];
  }, [simulationSteps]);

  const integrationLogos = useMemo(() => {
    const entries = new Set();
    if (Array.isArray(item?.integrations?.sources)) {
      item.integrations.sources.forEach((value) => {
        if (value) entries.add(titleCase(value));
      });
    }
    if (Array.isArray(item?.integrations?.destinations)) {
      item.integrations.destinations.forEach((value) => {
        if (value) entries.add(titleCase(value));
      });
    }
    previewSummary?.sources?.forEach((value) => {
      if (value) entries.add(titleCase(value));
    });
    previewSummary?.destinations?.forEach((value) => {
      if (value) entries.add(titleCase(value));
    });
    return Array.from(entries).slice(0, 9);
  }, [item, previewSummary]);

  const detailReviews = useMemo(
    () => [
      {
        id: "sarah",
        quote: "This automation saved us 15 hours per week. Setup was incredibly smooth.",
        author: "— Sarah K., Operations Manager",
      },
      {
        id: "diego",
        quote: "Rollout took less than a day and our team visibility skyrocketed immediately.",
        author: "— Diego M., RevOps Lead",
      },
      {
        id: "lena",
        quote: "The predictive alerts keep our stakeholders ahead of incidents every time.",
        author: "— Lena P., Support Director",
      },
    ],
    [],
  );

  const stats = useMemo(
    () => [
      {
        label: "Deployments",
        value: item?.stats?.deployments || "12.4K",
      },
      {
        label: "Avg. Rating",
        value: item?.rating ? `${item.rating} ⭐` : "4.8 ⭐",
      },
      {
        label: "Setup Time",
        value: item?.setupTime || "5 minutes",
      },
    ],
    [item],
  );

  const billingNote = useMemo(() => {
    if (item?.billingNote) return item.billingNote;
    if (!item?.priceMonthly) return "No credit card required";
    return "Billed annually";
  }, [item]);

  const heroSources = previewSummary?.sources || [];
  const heroDestinations = previewSummary?.destinations || [];
  const heroFocus = previewSummary?.focus || `${item.name} Intelligence`;

  const priceDisplay = priceLabel ? `${priceLabel}/month` : "Free";

  const handlePrimaryClick = useCallback(
    (event) => {
      onDeploy?.(event);
    },
    [onDeploy],
  );

  const handleSecondaryClick = useCallback(
    (event) => {
      onDemo?.(event);
    },
    [onDemo],
  );

  const resolvedModalId = modalId ?? (item?.id ? `automation-modal-${item.id}` : "automation-modal");
  const resolvedDescriptionId =
    descriptionId ?? (item?.id ? `automation-modal-description-${item.id}` : "automation-modal-description");

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="automation-modal" data-state={closing ? "closing" : "open"}>
      <div className="automation-modal__backdrop" onClick={handleRequestClose} />
      <div
        className="automation-modal__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={item?.id ? `automation-modal-title-${item.id}` : undefined}
        aria-describedby={resolvedDescriptionId}
        id={resolvedModalId}
        ref={containerRef}
        tabIndex={-1}
      >
        <header className="automation-modal__header">
          <h2
            className="automation-modal__title"
            id={item?.id ? `automation-modal-title-${item.id}` : undefined}
          >
            {item.name}
          </h2>
          <button
            type="button"
            className="automation-modal__close"
            onClick={handleRequestClose}
            aria-label="Close automation details"
            ref={closeButtonRef}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="automation-modal__body">
          <div className="automation-modal__content">
            <div className="automation-modal__main">
              <div className="automation-modal__hero" aria-hidden="true">
                <div className="automation-modal__hero-overlay" />
                <div className="automation-modal__hero-inner">
                  <div className="automation-modal__hero-cluster">
                    {heroSources.map((source) => (
                      <span key={`source-${source}`} className="automation-modal__hero-chip">
                        {source}
                      </span>
                    ))}
                  </div>
                  <div className="automation-modal__hero-focus">{heroFocus}</div>
                  <div className="automation-modal__hero-cluster">
                    {heroDestinations.map((destination) => (
                      <span key={`destination-${destination}`} className="automation-modal__hero-chip">
                        {destination}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <section className="automation-modal__section">
                <h3 className="automation-modal__section-title">Overview</h3>
                {overviewParagraphs.map((paragraph, index) => (
                  <p
                    key={`overview-${index}`}
                    id={index === 0 ? resolvedDescriptionId : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </section>

              <section className="automation-modal__section">
                <h3 className="automation-modal__section-title">Key Features</h3>
                <ul className="automation-modal__feature-list">
                  {featureList.map((feature) => (
                    <li key={feature} className="automation-modal__feature-item">
                      <span className="automation-modal__feature-icon">
                        <Icon name="check" size={22} strokeWidth={2.4} />
                      </span>
                      <span className="automation-modal__feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="automation-modal__section">
                <h3 className="automation-modal__section-title">How It Works</h3>
                <ol className="automation-modal__steps">
                  {steps.map((step, index) => (
                    <li key={step.id || step.label} className="automation-modal__step">
                      <span className="automation-modal__step-index">{index + 1}</span>
                      <div className="automation-modal__step-copy">
                        <span className="automation-modal__step-title">{step.label}</span>
                        <span className="automation-modal__step-summary">{step.summary}</span>
                        {step.detail && (
                          <span className="automation-modal__step-detail">{step.detail}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="automation-modal__sidebar">
              <div className="automation-modal__price">{priceDisplay}</div>
              <div className="automation-modal__billing-note">{billingNote}</div>
              <button
                type="button"
                className="automation-modal__cta automation-modal__cta--primary"
                onClick={handlePrimaryClick}
              >
                Deploy Automation
              </button>
              <button
                type="button"
                className="automation-modal__cta automation-modal__cta--secondary"
                onClick={handleSecondaryClick}
              >
                Try Demo First
              </button>

              <div className="automation-modal__divider" />

              <div className="automation-modal__stats">
                <span className="automation-modal__sidebar-title">At a Glance</span>
                <ul className="automation-modal__stats-list">
                  {stats.map((stat) => (
                    <li key={stat.label} className="automation-modal__stat-row">
                      <span>{stat.label}</span>
                      <span>{stat.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="automation-modal__integrations">
                <span className="automation-modal__sidebar-title">Integrations</span>
                <div className="automation-modal__integration-grid">
                  {integrationLogos.map((entry) => (
                    <span key={entry} className="automation-modal__integration-chip">
                      {entry}
                    </span>
                  ))}
                </div>
              </div>

              <div className="automation-modal__reviews">
                <span className="automation-modal__sidebar-title">Recent Reviews</span>
                <ul className="automation-modal__review-list">
                  {detailReviews.map((review) => (
                    <li key={review.id} className="automation-modal__review">
                      <div className="automation-modal__review-stars">⭐⭐⭐⭐⭐</div>
                      <p>{review.quote}</p>
                      <span className="automation-modal__review-author">{review.author}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
