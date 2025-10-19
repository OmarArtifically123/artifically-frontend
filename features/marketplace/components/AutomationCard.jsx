"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "../../../context/ThemeContext";
import useMicroInteractions from "../../../hooks/useMicroInteractions";
import { space } from "../../../styles/spacing";
import Button from "../../../components/ui/Button";
import { Icon } from "../../../components/icons";

const AutomationModal = dynamic(() => import("./AutomationModal"), {
  ssr: false,
});

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

const compactCurrencyFormatters = new Map();
const TAU = Math.PI * 2;

function formatCompactCurrency(value, currency = "USD") {
  if (!Number.isFinite(value)) return "$0";
  const key = currency || "USD";
  let formatter = compactCurrencyFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: key,
      notation: "compact",
      maximumFractionDigits: 1,
    });
    compactCurrencyFormatters.set(key, formatter);
  }
  return formatter.format(value);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString();
}

function hashCode(value) {
  const str = String(value ?? "automation");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function createSeededRandom(seed = Date.now()) {
  let state = Math.max(1, Math.floor(seed) % 2147483647);
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
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

function createPreviewGraph(item, activeNeed) {
  const seed = hashCode(item.id || item.name);
  const tagSources = Array.isArray(item?.integrations?.sources)
    ? item.integrations.sources.filter(Boolean)
    : SAMPLE_SOURCES;
  const tagDestinations = Array.isArray(item?.integrations?.destinations)
    ? item.integrations.destinations.filter(Boolean)
    : SAMPLE_DESTINATIONS;

  const sources = [
    titleCase(pickFromSeed(seed + 17, tagSources, 4)),
    titleCase(pickFromSeed(seed + 29, tagSources, 6)),
  ].filter(Boolean);

  const destinations = [
    titleCase(pickFromSeed(seed + 43, tagDestinations, 3)),
    titleCase(pickFromSeed(seed + 61, tagDestinations, 7)),
  ].filter(Boolean);

  const focusLabel = activeNeed
    ? `${titleCase(activeNeed)} intelligence`
    : titleCase(item.category || item.tags?.[0] || "Adaptive automation");

  const nodes = [
    ...sources.map((label, index) => ({
      id: `source-${index}`,
      label,
      role: "source",
    })),
    {
      id: "core",
      label: focusLabel,
      role: "core",
    },
    ...destinations.map((label, index) => ({
      id: `destination-${index}`,
      label,
      role: "destination",
    })),
  ];

  const edges = [
    ...sources.map((_, index) => ({
      id: `edge-source-${index}`,
      from: `source-${index}`,
      to: "core",
    })),
    ...destinations.map((_, index) => ({
      id: `edge-core-${index}`,
      from: "core",
      to: `destination-${index}`,
    })),
  ];

  const roiMultiple = Number(item?.roi) && Number.isFinite(Number(item.roi)) ? Number(item.roi) : 3.4;
  const deployments = Number(item?.deploymentsPerWeek) && Number.isFinite(Number(item.deploymentsPerWeek))
    ? Number(item.deploymentsPerWeek)
    : 18 + (seed % 14);
  const hoursSaved = Number(item?.hoursSavedWeekly) && Number.isFinite(Number(item.hoursSavedWeekly))
    ? Number(item.hoursSavedWeekly)
    : 240 + (seed % 80) * 3;

  const baselineSavings = Math.max(3500, (deployments * roiMultiple * 180) + hoursSaved * 45);
  const roiVelocity = Math.max(950, baselineSavings * 0.18);
  const eventsPerMinute = Math.max(90, 40 + (seed % 110));

  return {
    seed,
    nodes,
    edges,
    metrics: {
      baselineSavings,
      roiVelocity,
      eventsPerMinute,
    },
    summary: {
      sources,
      destinations,
      focus: focusLabel,
    },
  };
}

function groupByRole(nodes = []) {
  return nodes.reduce((acc, node) => {
    const role = node.role || "other";
    if (!acc[role]) acc[role] = [];
    acc[role].push(node);
    return acc;
  }, {});
}

function computeGraphLayout(nodes = [], width, height) {
  const grouped = groupByRole(nodes);
  const layout = new Map();
  const columns = [
    { role: "source", x: Math.max(24, width * 0.14) },
    { role: "core", x: width * 0.5 },
    { role: "destination", x: Math.min(width - 24, width * 0.86) },
  ];

  columns.forEach(({ role, x }) => {
    const list = grouped[role] || [];
    const spacing = height / (list.length + 1);
    list.forEach((node, index) => {
      layout.set(node.id, {
        x,
        y: spacing * (index + 1),
      });
    });
  });

  nodes.forEach((node, index) => {
    if (!layout.has(node.id)) {
      layout.set(node.id, {
        x: width * ((index + 1) / (nodes.length + 1)),
        y: height * 0.5,
      });
    }
  });

  return layout;
}

function cubicBezierPoint(t, p0, p1, p2, p3) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const a = mt2 * mt;
  const b = 3 * mt2 * t;
  const c = 3 * mt * t2;
  const d = t * t2;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

function drawLivePreview(canvas, container, graph, frame, darkMode) {
  if (!canvas || !container) return;
  const width = Math.max(10, container.clientWidth || 0);
  const height = Math.max(10, container.clientHeight || 0);
  const ratio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.save();
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);

  const layout = computeGraphLayout(graph.nodes, width, height);
  const flowMap = new Map((frame?.flows || []).map((flow) => [flow.id, flow]));
  const nodeMap = new Map((frame?.nodes || []).map((node) => [node.id, node]));

  graph.edges.forEach((edge, index) => {
    const from = layout.get(edge.from);
    const to = layout.get(edge.to);
    if (!from || !to) return;

    const offset = (index % 2 === 0 ? -1 : 1) * 20;
    const ctrl1 = { x: from.x + (to.x - from.x) * 0.4, y: from.y + offset };
    const ctrl2 = { x: from.x + (to.x - from.x) * 0.6, y: to.y - offset };
    const flow = flowMap.get(edge.id);
    const intensity = flow ? flow.intensity : 0.3;
    const active = flow ? flow.active : false;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, to.x, to.y);
    ctx.lineWidth = active ? 3 + intensity * 2 : 2 + intensity * 1.2;
    ctx.strokeStyle = active
      ? darkMode
        ? `rgba(165, 180, 252, ${0.7 + intensity * 0.2})`
        : `rgba(99, 102, 241, ${0.65 + intensity * 0.25})`
      : darkMode
        ? `rgba(148, 163, 184, ${0.25 + intensity * 0.2})`
        : `rgba(79, 70, 229, ${0.25 + intensity * 0.18})`;
    ctx.stroke();

    if (flow) {
      const point = cubicBezierPoint(flow.progress, from, ctrl1, ctrl2, to);
      const sparkRadius = active ? 5.5 : 4;
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, sparkRadius * 2.5);
      const sparkColor = darkMode ? "rgba(165, 180, 252, 0.9)" : "rgba(99, 102, 241, 0.95)";
      gradient.addColorStop(0, sparkColor);
      gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, sparkRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  graph.nodes.forEach((node) => {
    const pos = layout.get(node.id);
    if (!pos) return;
    const state = nodeMap.get(node.id);
    const baseRadius = node.role === "core" ? 18 : 12;
    const pulse = state ? state.pulse : 1;
    const radius = baseRadius + (pulse - 1) * (node.role === "core" ? 24 : 16);

    const gradient = ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
    if (darkMode) {
      gradient.addColorStop(0, "rgba(180, 198, 252, 0.95)");
      gradient.addColorStop(1, "rgba(30, 41, 59, 0.05)");
    } else {
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.92)");
      gradient.addColorStop(1, "rgba(226, 232, 240, 0.05)");
    }
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = node.role === "core" ? 2.4 : 1.5;
    ctx.strokeStyle = darkMode ? "rgba(165, 180, 252, 0.55)" : "rgba(79, 70, 229, 0.45)";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
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

function AutomationCardComponent({
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
  attentionScore = 0,
  spotlighted = false,
  onDwell,
}) {
  const { darkMode } = useTheme();
  const { dispatchInteraction } = useMicroInteractions();
  const palette = useIconPalette(item.icon);
  const [hovered, setHovered] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [simulationStep, setSimulationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [streamIndex, setStreamIndex] = useState(0);
  const dwellStartRef = useRef(null);
  const dwellTickRef = useRef(null);
  const lastDispatchRef = useRef(null);
  const tiltFrameRef = useRef(null);

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
  const previewGraph = useMemo(() => createPreviewGraph(item, activeNeed), [item, activeNeed]);
  const previewSummary = useMemo(() => {
    const summary = previewGraph.summary || {};
    return {
      sources: Array.isArray(summary.sources) ? summary.sources.filter(Boolean) : [],
      destinations: Array.isArray(summary.destinations) ? summary.destinations.filter(Boolean) : [],
      focus: summary.focus || "Automation intelligence",
    };
  }, [previewGraph]);
  const cardCurrency = item.currency || "USD";

  const [roiCounter, setRoiCounter] = useState(() =>
    Math.round(previewGraph.metrics?.baselineSavings || 0),
  );
  const [telemetry, setTelemetry] = useState(() => ({
    perMinute: previewGraph.metrics?.eventsPerMinute || 0,
    activeConnections: 0,
  }));
  const latestFrameRef = useRef({ flows: [], nodes: [] });
  const graphRef = useRef(previewGraph);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const previewContainerRef = useRef(null);
  const cardRef = useRef(null);
  const workerRef = useRef(null);
  const lastRoiUpdateRef = useRef(0);
  const lastTelemetryUpdateRef = useRef(0);
  const inlineLoopRef = useRef(null);
  const inlineStateRef = useRef(null);

  useEffect(() => {
    graphRef.current = previewGraph;
    latestFrameRef.current = {
      flows: [],
      nodes: previewGraph.nodes?.map((node) => ({ id: node.id, pulse: 1, activity: 0.5 })) || [],
    };
    setRoiCounter(Math.round(previewGraph.metrics?.baselineSavings || 0));
    setTelemetry({
      perMinute: previewGraph.metrics?.eventsPerMinute || 0,
      activeConnections: 0,
    });
    lastRoiUpdateRef.current = 0;
    lastTelemetryUpdateRef.current = 0;
  }, [previewGraph]);

  const renderLiveDiagram = useCallback(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    const container = previewContainerRef.current;
    const graph = graphRef.current;
    if (!canvas || !container || !graph) return;
    drawLivePreview(canvas, container, graph, latestFrameRef.current, darkMode);
  }, [darkMode]);

  const scheduleRender = useCallback(() => {
    if (typeof window === "undefined") return;
    if (animationFrameRef.current != null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      renderLiveDiagram();
    });
  }, [renderLiveDiagram]);

  const stopInlinePreview = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      inlineLoopRef.current != null &&
      window.cancelAnimationFrame
    ) {
      window.cancelAnimationFrame(inlineLoopRef.current);
    }
    inlineLoopRef.current = null;
    inlineStateRef.current = null;
  }, []);

  const beginInlinePreview = useCallback(
    (graph) => {
      if (typeof window === "undefined" || !graph) return undefined;

      stopInlinePreview();

      const seededRandom = createSeededRandom((graph.seed || 0) + 1729);
      const now =
        typeof performance !== "undefined" && performance.now
          ? performance.now()
          : Date.now();

      inlineStateRef.current = {
        lastTime: now,
        basePulse: seededRandom() * TAU,
        roi: Number(graph.metrics?.baselineSavings) || 0,
        roiRate: graph.metrics?.roiVelocity
          ? Number(graph.metrics.roiVelocity) / 1000
          : 0.24,
        throughputBase: Number(graph.metrics?.eventsPerMinute) || 120,
        nodes: (graph.nodes || []).map((node, index) => ({
          id: node.id,
          phase: seededRandom() * TAU,
          pulse: 1,
          activity: 0.5,
          wobble: 0.9 + (index % 3) * 0.12 + seededRandom() * 0.08,
        })),
        flows: (graph.edges || []).map((edge, index) => ({
          id: edge.id,
          progress: seededRandom(),
          speed: 0.00055 + (index % 3) * 0.00018 + seededRandom() * 0.00025,
          intensity: 0.4,
          active: false,
        })),
      };

      const step = () => {
        const state = inlineStateRef.current;
        if (!state) return;

        const time =
          typeof performance !== "undefined" && performance.now
            ? performance.now()
            : Date.now();
        const rawDelta = time - state.lastTime;
        const delta = Math.max(8, Math.min(32, rawDelta));
        state.lastTime = time;

        state.basePulse = (state.basePulse + delta * 0.0012) % TAU;

        state.nodes = state.nodes.map((nodeState, index) => {
          const speed = 0.0015 + (index % 3) * 0.00045 + nodeState.wobble * 0.00015;
          const nextPhase = (nodeState.phase + delta * speed) % TAU;
          const pulse = 0.93 + 0.09 * ((Math.sin(nextPhase) + 1) / 2);
          const activity = 0.35 + 0.65 * Math.pow(Math.sin(nextPhase * 0.75 + index), 2);
          return {
            ...nodeState,
            phase: nextPhase,
            pulse,
            activity,
          };
        });

        let activeConnections = 0;
        state.flows = state.flows.map((flowState) => {
          let progress = flowState.progress + delta * flowState.speed;
          if (progress > 1) {
            progress -= Math.floor(progress);
          }
          const intensity = 0.38 + 0.62 * Math.sin(progress * Math.PI);
          const active = progress < 0.22;
          if (active) activeConnections += 1;
          return {
            ...flowState,
            progress,
            intensity,
            active,
          };
        });

        state.roi += state.roiRate * delta;
        const roiTotal = state.roi;

        const throughputPerMinute =
          state.throughputBase + Math.sin(time / 1400) * (state.throughputBase * 0.08);

        latestFrameRef.current = {
          flows: state.flows.map(({ id, progress, intensity, active }) => ({
            id,
            progress,
            intensity,
            active,
          })),
          nodes: state.nodes.map(({ id, pulse, activity }) => ({
            id,
            pulse,
            activity,
          })),
        };

        if (cardRef.current) {
          const pulse = 0.96 + 0.04 * Math.sin(state.basePulse);
          cardRef.current.style.setProperty("--live-pulse", pulse.toFixed(3));
        }

        if (!lastRoiUpdateRef.current || time - lastRoiUpdateRef.current > 120) {
          lastRoiUpdateRef.current = time;
          const rounded = Math.round(roiTotal);
          setRoiCounter((prev) => (prev === rounded ? prev : rounded));
        }

        if (!lastTelemetryUpdateRef.current || time - lastTelemetryUpdateRef.current > 180) {
          lastTelemetryUpdateRef.current = time;
          const nextTelemetry = {
            perMinute: throughputPerMinute,
            activeConnections: Math.max(0, Math.round(activeConnections)),
          };
          setTelemetry((prev) => {
            if (
              Math.round(prev.perMinute) === Math.round(nextTelemetry.perMinute) &&
              prev.activeConnections === nextTelemetry.activeConnections
            ) {
              return prev;
            }
            return nextTelemetry;
          });
        }

        scheduleRender();
        inlineLoopRef.current = window.requestAnimationFrame(step);
      };

      inlineLoopRef.current = window.requestAnimationFrame(step);

      return () => {
        stopInlinePreview();
      };
    },
    [scheduleRender, stopInlinePreview, setTelemetry, setRoiCounter],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const cleanup = () => {
      if (animationFrameRef.current != null && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
    return cleanup;
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--live-pulse", "1");
    }
  }, []);

  useEffect(() => {
    scheduleRender();
  }, [scheduleRender, darkMode]);

  useEffect(() => {
    scheduleRender();
  }, [scheduleRender, previewGraph]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return undefined;
    const container = previewContainerRef.current;
    if (!container) return undefined;
    const observer = new ResizeObserver(() => scheduleRender());
    observer.observe(container);
    return () => observer.disconnect();
  }, [scheduleRender]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const runFallback = () => beginInlinePreview(previewGraph);

    if (typeof Worker === "undefined") {
      return runFallback();
    }

    try {
      const worker = new Worker(new URL("../../../workers/automationPreviewWorker.js", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;
      const handleMessage = (event) => {
        const data = event?.data;
        if (!data || typeof data !== "object" || data.type !== "frame") return;
        latestFrameRef.current = {
          flows: Array.isArray(data.flows) ? data.flows : [],
          nodes: Array.isArray(data.nodes) ? data.nodes : [],
        };

        const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
        if (cardRef.current && typeof data.pulse === "number" && Number.isFinite(data.pulse)) {
          cardRef.current.style.setProperty("--live-pulse", data.pulse.toFixed(3));
        }

        if (typeof data.roi === "number" && Number.isFinite(data.roi)) {
          if (!lastRoiUpdateRef.current || now - lastRoiUpdateRef.current > 120) {
            lastRoiUpdateRef.current = now;
            const rounded = Math.round(data.roi);
            setRoiCounter((prev) => {
              if (prev === rounded) return prev;
              return rounded;
            });
          }
        }

        if (data.throughput && typeof data.throughput === "object") {
          const perMinute = Number(data.throughput.perMinute);
          const activeConnections = Number(data.throughput.activeConnections);
          if (!lastTelemetryUpdateRef.current || now - lastTelemetryUpdateRef.current > 180) {
            lastTelemetryUpdateRef.current = now;
            setTelemetry((prev) => {
              const next = {
                perMinute: Number.isFinite(perMinute) ? perMinute : 0,
                activeConnections: Number.isFinite(activeConnections)
                  ? Math.max(0, Math.round(activeConnections))
                  : 0,
              };
              if (
                Math.round(prev.perMinute) === Math.round(next.perMinute) &&
                prev.activeConnections === next.activeConnections
              ) {
                return prev;
              }
              return next;
            });
          }
        }

        scheduleRender();
      };

      worker.addEventListener("message", handleMessage);
      worker.postMessage({
        type: "init",
        payload: {
          graph: previewGraph,
          metrics: previewGraph.metrics,
          seed: previewGraph.seed,
        },
      });

      return () => {
        worker.removeEventListener("message", handleMessage);
        try {
          worker.postMessage({ type: "stop" });
        } catch (err) {
          // ignore post termination errors
        }
        worker.terminate();
        workerRef.current = null;
      };
    } catch (err) {
      console.warn("Automation preview worker unavailable", err);
      workerRef.current = null;
      return runFallback();
    }
  }, [previewGraph, scheduleRender, beginInlinePreview]);

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
  const attentionIntensity = Math.min(1, Math.max(0, attentionScore / 4));
  const activeLinksLabel = telemetry.activeConnections === 1 ? "link" : "links";
  const formattedPerMinute = formatNumber(telemetry.perMinute);
  const formattedSavings = formatCompactCurrency(roiCounter, cardCurrency);
  const baseBorderColor = hovered
    ? "rgba(139, 92, 246, 0.5)"
    : darkMode
    ? "rgba(148,163,184,0.22)"
    : "rgba(148,163,184,0.32)";
  const translateYValue = hovered ? -8 : computedMotion.translateY;
  const scaleValue = hovered ? 1.02 : computedMotion.scale;
  const transformValue = [
    "perspective(1200px)",
    `rotateX(${tilt.x.toFixed(2)}deg)`,
    `rotateY(${tilt.y.toFixed(2)}deg)`,
    `translateY(${translateYValue.toFixed(2)}px)`,
    `scale(${scaleValue.toFixed(3)})`,
    "scale(var(--live-pulse, 1))",
  ].join(" ");

  const computedShadow = useMemo(() => {
    if (hovered) {
      return "0 24px 60px rgba(139, 92, 246, 0.3)";
    }
    const base = spotlighted
      ? "0 38px 80px rgba(99, 102, 241, 0.45)"
      : `0 25px 45px ${palette.shadow}`;
    if (attentionIntensity <= 0.05 || spotlighted) {
      return base;
    }
    const radius = Math.round(35 + attentionIntensity * 55);
    const opacity = Math.min(0.55, 0.2 + attentionIntensity * 0.45).toFixed(3);
    return `${base}, 0 0 ${radius}px rgba(99, 102, 241, ${opacity})`;
  }, [hovered, palette.shadow, attentionIntensity, spotlighted]);

  const computedMotion = useMemo(() => {
    if (spotlighted && !hovered) {
      return { translateY: -4, scale: 1.015 };
    }
    if (!hovered && attentionIntensity > 0.08) {
      const lift = -(attentionIntensity * 6);
      const scale = 1 + attentionIntensity * 0.012;
      return { translateY: lift, scale };
    }
    return { translateY: 0, scale: 1 };
  }, [spotlighted, attentionIntensity, hovered]);

  useEffect(() => {
    return () => {
      if (dwellTickRef.current && typeof window !== "undefined" && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(dwellTickRef.current);
      }
      dwellTickRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (tiltFrameRef.current && typeof window !== "undefined" && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(tiltFrameRef.current);
      }
      tiltFrameRef.current = null;
    };
  }, []);

  const dispatchDwellDelta = (force = false) => {
    if (typeof onDwell !== "function" || !item?.id) return;
    const lastDispatch = lastDispatchRef.current || dwellStartRef.current;
    if (lastDispatch == null) return;
    const now = typeof window !== "undefined" ? performance.now() : Date.now();
    const delta = now - lastDispatch;
    if (!force && delta < 180) return;
    lastDispatchRef.current = now;
    if (delta > 16) {
      onDwell(item.id, delta);
    }
  };

  const stopDwellTracking = (force = false) => {
    if (dwellTickRef.current && typeof window !== "undefined" && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(dwellTickRef.current);
      dwellTickRef.current = null;
    }
    dispatchDwellDelta(force);
    dwellStartRef.current = null;
    lastDispatchRef.current = null;
  };

  const trackDwell = () => {
    if (dwellStartRef.current == null) {
      dwellStartRef.current = typeof window !== "undefined" ? performance.now() : Date.now();
      lastDispatchRef.current = dwellStartRef.current;
    }
    dispatchDwellDelta();
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      dwellTickRef.current = window.requestAnimationFrame(trackDwell);
    }
  };

  const resetTilt = useCallback(() => {
    if (tiltFrameRef.current && typeof window !== "undefined" && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(tiltFrameRef.current);
      tiltFrameRef.current = null;
    }
    setTilt({ x: 0, y: 0 });
  }, []);

  const handlePointerEnter = () => {
    resetTilt();
    setHovered(true);
    if (typeof window === "undefined" || !window.requestAnimationFrame) {
      return;
    }
    if (typeof onDwell === "function") {
      if (dwellTickRef.current && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(dwellTickRef.current);
      }
      dwellStartRef.current = performance.now();
      lastDispatchRef.current = dwellStartRef.current;
      dwellTickRef.current = window.requestAnimationFrame(trackDwell);
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
    stopDwellTracking(true);
    resetTilt();
  };

  const handlePointerMove = useCallback(
    (event) => {
      if (!hovered || !cardRef.current) {
        return;
      }
      const rect = cardRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const rawRotateX = ((event.clientY - cardCenterY) / rect.height) * 10;
      const rawRotateY = ((event.clientX - cardCenterX) / rect.width) * 10;
      const clampedX = Math.max(-10, Math.min(10, rawRotateX));
      const clampedY = Math.max(-10, Math.min(10, rawRotateY));

      if (typeof window !== "undefined" && window.requestAnimationFrame) {
        if (tiltFrameRef.current && window.cancelAnimationFrame) {
          window.cancelAnimationFrame(tiltFrameRef.current);
        }
        tiltFrameRef.current = window.requestAnimationFrame(() => {
          setTilt({ x: clampedX, y: clampedY });
        });
      } else {
        setTilt({ x: clampedX, y: clampedY });
      }
    },
    [hovered],
  );

  const handleCardClick = useCallback((event) => {
    if (event?.defaultPrevented) return;
    setDetailOpen(true);
  }, []);

  const handleCardKeyDown = useCallback((event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setDetailOpen(true);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setDetailOpen(false);
  }, []);

  const handleDemo = useCallback(
    (event) => {
      event?.stopPropagation?.();
      dispatchInteraction("cta-secondary", { event });
      onDemo?.(item);
    },
    [dispatchInteraction, item, onDemo],
  );

  const handleBuy = useCallback(
    (event) => {
      event?.stopPropagation?.();
      dispatchInteraction("cta-primary", { event, particles: true });
      onBuy?.(item);
    },
    [dispatchInteraction, item, onBuy],
  );

const handleVote = useCallback(
    (event) => {
      event?.stopPropagation?.();
      dispatchInteraction("cta-ghost", { event, haptic: "pulse" });
      onVote?.(item);
    },
    [dispatchInteraction, item, onVote],
  );

  const handleModalDemo = useCallback(
    (event) => {
      dispatchInteraction("cta-secondary", { event });
      onDemo?.(item);
    },
    [dispatchInteraction, item, onDemo],
  );

  const handleModalDeploy = useCallback(
    (event) => {
      dispatchInteraction("cta-primary", { event, particles: true });
      onBuy?.(item);
    },
    [dispatchInteraction, item, onBuy],
  );

  return (
    <>
      <div
      className={`automation-card glass-panel${hovered ? " is-hovered" : ""}${
        intensity > 0.45 ? " is-priority" : ""
      }${predicted ? " is-psychic" : ""}`}
      data-glass="true"
      data-predicted={predicted}
      data-attention-level={attentionIntensity.toFixed(3)}
      data-spotlight={spotlighted}
      data-live="true"
      id={item?.id ? `automation-${item.id}` : undefined}
      style={{
        position: "relative",
        display: "grid",
        gap: space("sm"),
        padding: space("md", 1.2667),
        borderRadius: "1.35rem",
        border: "1px solid transparent",
        borderColor: baseBorderColor,
        background: `linear-gradient(145deg, ${palette.secondary}, rgba(15,23,42,0.85))`,
        boxShadow: computedShadow,
        color: darkMode ? "#e2e8f0" : "#1f2937",
        transform: transformValue,
        transition:
          "transform 200ms ease, box-shadow 300ms ease-out, border-color 300ms ease-out, filter 300ms ease-out",
        contain: "layout style paint",
        "--attention-level": attentionIntensity,
      }}
      ref={cardRef}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={detailOpen}
      tabIndex={0}
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

      <div
        className="automation-card__live-preview"
        ref={previewContainerRef}
        role="img"
        aria-label={`Live automation data flow for ${item.name}`}
      >
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="automation-card__live-hud" aria-live="polite">
          <div className="automation-card__live-metric">
            <strong>{formattedPerMinute}</strong>
            <span>
              events/min · {telemetry.activeConnections} {activeLinksLabel} live
            </span>
          </div>
          <div className="automation-card__live-metric">
            <strong>{formattedSavings}</strong>
            <span>Savings across customers</span>
          </div>
        </div>
      </div>

      <div className="automation-card__live-summary">
        <span className="automation-card__live-summary-segment" data-role="sources">
          {previewSummary.sources.length
            ? previewSummary.sources.join(" • ")
            : "Live data sources"}
        </span>
        <span className="automation-card__live-summary-separator" aria-hidden="true">
          →
        </span>
        <span className="automation-card__live-summary-segment" data-role="core">
          {previewSummary.focus}
        </span>
        <span className="automation-card__live-summary-separator" aria-hidden="true">
          →
        </span>
        <span className="automation-card__live-summary-segment" data-role="destinations">
          {previewSummary.destinations.length
            ? previewSummary.destinations.join(" • ")
            : "Active destinations"}
        </span>
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
          <Icon name="zap" size={18} />
        </span>
        <span className="automation-card__stat-copy">{metrics.statement}</span>
      </div>

      <div className="automation-card__psychic" data-visible={predicted}>
        <span aria-hidden="true" className="automation-card__psychic-icon">
          <Icon name="sparkles" size={18} />
        </span>
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
        <Button size="sm" variant="secondary" magnetic glowOnHover={false} onClick={handleDemo}>
          Preview Automation
        </Button>
        <Button size="sm" variant="primary" magnetic onClick={handleBuy}>
          <span>Deploy Automation</span>
        </Button>
      </div>

      {onVote && (
        <div className="automation-card__collab">
          <Button
            type="button"
            variant="secondary"
            magnetic
            glowOnHover={false}
            className="automation-card__vote"
            onClick={handleVote}
          >
            <span aria-hidden="true" className="automation-card__vote-icon">
              <Icon name="vote" size={18} />
            </span>
            <span>Vote to deploy</span>
          </Button>
          <span className="automation-card__vote-count">{voteCount} team votes</span>
        </div>
      )}
    </div>
      {detailOpen && (
        <AutomationModal
          item={item}
          onClose={handleCloseModal}
          featureHighlights={featureHighlights}
          simulationSteps={simulationSteps}
          sampleDataset={sampleDataset}
          metrics={metrics}
          previewSummary={previewSummary}
          priceLabel={formatPrice(item.priceMonthly, item.currency)}
          onDeploy={handleModalDeploy}
          onDemo={handleModalDemo}
        />
      )}
    </>
  );
}

const areAutomationPropsEqual = (prevProps, nextProps) => {
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;

  if (prevItem?.id !== nextItem?.id) return false;
  if (prevItem?.updatedAt !== nextItem?.updatedAt) return false;

  return (
    prevProps.matchStrength === nextProps.matchStrength &&
    prevProps.industryMatch === nextProps.industryMatch &&
    prevProps.browsingMatch === nextProps.browsingMatch &&
    prevProps.attentionScore === nextProps.attentionScore &&
    prevProps.spotlighted === nextProps.spotlighted &&
    prevProps.predicted === nextProps.predicted &&
    prevProps.activeNeed === nextProps.activeNeed
  );
};

export default memo(AutomationCardComponent, areAutomationPropsEqual);