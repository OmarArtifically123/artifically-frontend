import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const SAMPLE_COMPANIES = [
  "TechCorp",
  "Apex Finance",
  "Helios Labs",
  "Northwind Ops",
  "BlueOcean Retail",
];

const SAMPLE_SOURCES = ["CRM", "ERP", "Support Desk", "Billing", "Marketing"].map(
  (label) => `${label} stream`
);

const SAMPLE_DESTINATIONS = [
  "Slack",
  "Notion",
  "Salesforce",
  "ServiceNow",
  "HubSpot",
  "Teams",
];

const SAMPLE_FEATURES = [
  "Adaptive routing",
  "AI review gates",
  "Human-in-the-loop",
  "Autonomous follow-ups",
  "Multi-channel sync",
  "Compliance audit trail",
];

function hashCode(value) {
  const str = String(value ?? "automation");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickFromSeed(seed, list, offset = 0) {
  if (!list.length) return "";
  const index = Math.abs((seed + offset * 97) % list.length);
  return list[index];
}

function titleCase(value = "") {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalize(text) {
  return (text || "").toLowerCase();
}

function createSampleDataset(item, activeNeed) {
  const seed = hashCode(item.id || item.name);
  const tags = item.tags || [];
  const baseNeed = normalize(activeNeed);
  const contexts = [
    ...tags,
    pickFromSeed(seed, SAMPLE_SOURCES, 3),
    pickFromSeed(seed, SAMPLE_DESTINATIONS, 2),
  ]
    .filter(Boolean)
    .map((ctx) => titleCase(ctx));

  const baseContexts = contexts.length ? contexts : ["Workflow"];

  return new Array(6).fill(null).map((_, index) => {
    const ctx = baseContexts[(index + seed) % baseContexts.length] || "Workflow";
    const amount = 12 + ((seed + index * 13) % 48);
    const quality = 92 + ((seed + index * 17) % 6);
    const needLabel = baseNeed ? `${titleCase(baseNeed)} focus` : "Adaptive";
    return {
      id: `${item.id || item.name}-sample-${index}`,
      context: ctx,
      payload: `${amount} records processed`,
      confidence: `${quality}% quality score`,
      focus: needLabel,
    };
  });
}

function createFlowSteps(item, activeNeed) {
  const seed = hashCode(item.id || item.name);
  const primaryTag = titleCase(item.category || item.tags?.[0] || "Operations");
  const source = pickFromSeed(seed, SAMPLE_SOURCES, 1);
  const destination = pickFromSeed(seed, SAMPLE_DESTINATIONS, 4);
  const focus = activeNeed ? titleCase(activeNeed) : primaryTag;

  return [
    {
      id: "ingest",
      label: "Capture",
      summary: `Ingesting ${source}`,
      detail: `${Math.max(14, (seed % 70) + 14)} events/sec`,
    },
    {
      id: "orchestrate",
      label: "Understand",
      summary: `${focus} intelligence engine`,
      detail: `${pickFromSeed(seed, SAMPLE_FEATURES, 6)} engaged`,
    },
    {
      id: "act",
      label: "Automate",
      summary: `Syncing into ${destination}`,
      detail: `${pickFromSeed(seed, SAMPLE_DESTINATIONS, 8)} confirmation`,
    },
  ];
}

function createFeatureHighlights(item, activeNeed) {
  const highlights = item.highlights || item.capabilities || [];
  const tags = item.tags || [];
  const base = [
    ...highlights,
    ...tags.map((tag) => `${titleCase(tag)} automation`),
    pickFromSeed(hashCode(item.id), SAMPLE_FEATURES, 1),
  ].filter(Boolean);

  const deduped = [];
  base.forEach((feature) => {
    if (!deduped.some((entry) => normalize(entry) === normalize(feature))) {
      deduped.push(feature);
    }
  });

  if (activeNeed && !deduped.some((feature) => normalize(feature).includes(normalize(activeNeed)))) {
    deduped.unshift(`${titleCase(activeNeed)} insights spotlight`);
  }

  return deduped.slice(0, 4);
}

function createMetrics(item) {
  const seed = hashCode(item.id || item.name);
  const company = pickFromSeed(seed, SAMPLE_COMPANIES);
  const hoursSaved = 24 + (seed % 60);
  const satisfaction = 94 + (seed % 5);
  const conversionLift = 8 + (seed % 9);

  return {
    company,
    hoursSaved,
    satisfaction,
    conversionLift,
    statement: `Saved ${company} ${hoursSaved} hours this week`,
  };
}

function useIconPalette(icon) {
  const [palette, setPalette] = useState({
    primary: "rgba(99,102,241,0.65)",
    secondary: "rgba(14,165,233,0.45)",
    shadow: "rgba(15,23,42,0.45)",
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !icon) return;
    let frameId;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "64px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(icon, canvas.width / 2, canvas.height / 2 + 6);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let r = 0;
    let g = 0;
    let b = 0;
    let total = 0;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha < 32) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      total += 1;
    }

    if (!total) return;
    const avgR = Math.min(255, Math.round(r / total));
    const avgG = Math.min(255, Math.round(g / total));
    const avgB = Math.min(255, Math.round(b / total));

    const lighten = (value) => Math.min(255, Math.round(value + (255 - value) * 0.35));
    const darken = (value) => Math.max(0, Math.round(value * 0.55));

    frameId = requestAnimationFrame(() => {
      setPalette({
        primary: `rgba(${avgR}, ${avgG}, ${avgB}, 0.75)`,
        secondary: `rgba(${lighten(avgR)}, ${lighten(avgG)}, ${lighten(avgB)}, 0.35)`,
        shadow: `rgba(${darken(avgR)}, ${darken(avgG)}, ${darken(avgB)}, 0.55)`,
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [icon]);

  return palette;
}

export default function AutomationCard({
  item,
  onDemo,
  onBuy,
  activeNeed,
  matchStrength = 0,
  industryMatch = false,
  industryLabel,
  browsingMatch = false,
  onVote,
  voteCount = 0,
  predicted = false,
}) {
  const { darkMode } = useTheme();
  const palette = useIconPalette(item.icon);
  const [hovered, setHovered] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [streamIndex, setStreamIndex] = useState(0);

  const formatPrice = useMemo(
    () =>
      (price, currency = "USD") =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
        }).format(price),
    []
  );

  const metrics = useMemo(() => createMetrics(item), [item]);
  const simulationSteps = useMemo(() => createFlowSteps(item, activeNeed), [item, activeNeed]);
  const featureHighlights = useMemo(() => createFeatureHighlights(item, activeNeed), [item, activeNeed]);
  const sampleDataset = useMemo(() => createSampleDataset(item, activeNeed), [item, activeNeed]);

  useEffect(() => {
    if (typeof window === "undefined" || simulationSteps.length === 0) return undefined;
    setSimulationStep(0);
    const interval = window.setInterval(() => {
      setSimulationStep((prev) => (prev + 1) % simulationSteps.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [simulationSteps]);

  useEffect(() => {
    if (typeof window === "undefined" || sampleDataset.length === 0) return undefined;
    const interval = window.setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % sampleDataset.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [sampleDataset]);

  useEffect(() => {
    if (typeof window === "undefined" || simulationSteps.length === 0) return undefined;
    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.12;
        return next >= 1 ? 0 : next;
      });
    }, 220);

    return () => window.clearInterval(interval);
  }, [simulationSteps]);

  useEffect(() => {
    setProgress(0);
  }, [simulationStep]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!predicted) return undefined;
    if (hovered) return undefined;
    setHovered(true);
    const timeout = window.setTimeout(() => {
      setHovered(false);
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [predicted, hovered]);

  const activeStream = useMemo(() => {
    if (!sampleDataset.length) return [];
    const list = [];
    for (let i = 0; i < Math.min(4, sampleDataset.length); i += 1) {
      const index = (streamIndex + i) % sampleDataset.length;
      list.push(sampleDataset[index]);
    }
    return list;
  }, [sampleDataset, streamIndex]);

  const currentStep = simulationSteps[simulationStep] || simulationSteps[0];
  const progressPercent = Math.round(progress * 100);
  const intensity = Math.min(1, Math.max(0, matchStrength));

  return (
    <div
      className={`automation-card glass-panel${hovered ? " is-hovered" : ""}${
        intensity > 0.45 ? " is-priority" : ""
      }${predicted ? " is-psychic" : ""}`}
      data-glass="true"
      data-predicted={predicted}
      style={{
        position: "relative",
        display: "grid",
        gap: "1rem",
        padding: "1.9rem",
        borderRadius: "1.35rem",
        border: `1px solid ${darkMode ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.32)"}`,
        background: `linear-gradient(145deg, ${palette.secondary}, rgba(15,23,42,0.85))`,
        boxShadow: `0 25px 45px ${palette.shadow}`,
        color: darkMode ? "#e2e8f0" : "#1f2937",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="automation-card__pulse-ring" aria-hidden="true" />
      <div className="automation-card__header">
        <div
          className="automation-card__icon"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, rgba(255,255,255,0.12))`,
            boxShadow: `0 12px 25px ${palette.shadow}`,
          }}
        >
          {item.icon}
        </div>
        <div className="automation-card__price">
          {formatPrice(item.priceMonthly, item.currency)}/mo
        </div>
      </div>

      {(industryMatch || browsingMatch) && (
        <div className="automation-card__badge-tray">
          {industryMatch && industryLabel ? (
            <span className="automation-card__badge automation-card__badge--industry">
              Tailored for {industryLabel}
            </span>
          ) : null}
          {browsingMatch ? (
            <span className="automation-card__badge automation-card__badge--signal">
              Personalized pick
            </span>
          ) : null}
        </div>
      )}
      
      <div className="automation-card__title-group">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>

      <div className="automation-card__live-stat">
        <span className="automation-card__stat-icon" aria-hidden="true">
          ⚡
        </span>
        <span className="automation-card__stat-copy">{metrics.statement}</span>
      </div>

      <div className="automation-card__psychic" data-visible={predicted}>
        <span aria-hidden="true">🔮</span>
        <span>Marketplace senses you're about to open this.</span>
      </div>

      <div className="automation-card__flow" aria-label="Automation data flow visualization">
        <div className="automation-card__flow-track">
          {simulationSteps.map((step, index) => (
            <div
              key={step.id}
              className="automation-card__flow-node"
              data-active={index === simulationStep}
            >
              <span className="automation-card__flow-label">{step.label}</span>
              <span className="automation-card__flow-summary">{step.summary}</span>
            </div>
          ))}
        </div>
        <div
          className="automation-card__progress"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className="automation-card__progress-bar" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {featureHighlights.length > 0 && (
        <ul className="automation-card__features">
          {featureHighlights.map((feature) => (
            <li
              key={feature}
              className="automation-card__feature"
              data-highlight={
                activeNeed ? normalize(feature).includes(normalize(activeNeed)) : false
              }
              style={{
                transform: `scale(${1 + intensity * 0.04})`,
              }}
            >
              <span className="automation-card__feature-indicator" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {item.tags?.length > 0 && (
        <div className="automation-card__tags" aria-label="Automation tags">
          {item.tags.map((tag) => (
            <span
              className="automation-card__tag"
              key={tag}
              data-active={
                activeNeed ? normalize(tag).includes(normalize(activeNeed)) : false
              }
              style={{
                background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="automation-card__simulation" data-visible={hovered}>
        <header>
          <span className="automation-card__simulation-badge">Live preview</span>
          <div className="automation-card__simulation-step">
            <span>{currentStep?.summary}</span>
            {currentStep?.detail && (
              <span className="automation-card__simulation-detail">{currentStep.detail}</span>
            )}
          </div>
        </header>
        <ul>
          {activeStream.map((entry, index) => (
            <li key={entry.id} data-active={index === 0}>
              <span className="automation-card__simulation-context">{entry.context}</span>
              <span className="automation-card__simulation-payload">{entry.payload}</span>
              <span className="automation-card__simulation-meta">{entry.confidence}</span>
              <span className="automation-card__simulation-focus">{entry.focus}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="automation-card__actions">
        <button
          className="btn btn-secondary btn-small"
          data-magnetic="true"
          data-ripple="true"
          data-magnetic-strength="0.75"
          onClick={() => onDemo(item)}
        >
          Try Demo
        </button>
        <button
          className="btn btn-primary btn-small"
          data-magnetic="true"
          data-ripple="true"
          data-magnetic-strength="1.1"
          onClick={() => onBuy(item)}
        >
          Buy & Deploy
        </button>
      </div>

      <div className="automation-card__collab">
        <button
          type="button"
          className="automation-card__vote"
          onClick={() => {
            if (onVote) onVote(item);
          }}
        >
          <span aria-hidden="true">🗳️</span>
          <span>Vote to deploy</span>
        </button>
        <span className="automation-card__vote-count">{voteCount} team votes</span>
      </div>
    </div>
  );
}