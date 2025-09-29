import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { fetchAutomations } from "../data/automations";
import AutomationCard from "./AutomationCard";
import DemoModal from "./DemoModal";
import { toast } from "./Toast";
import api from "../api";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { warmupWasm, wasmAverage } from "../lib/wasmMath";
import LivingSuccessMetrics from "./LivingSuccessMetrics";
import MarketplaceCollaborationLayer from "./MarketplaceCollaborationLayer";
import {
  FALLBACK_MARKETPLACE_STATS,
  MARKETPLACE_STATS_QUERY,
} from "../lib/graphqlClient";

const BROWSING_STORAGE_KEY = "automation-browsing-signals";

const COLLABORATION_FEATURES = [
  {
    title: "Team exploration mode",
    description: "See where colleagues are looking in real-time.",
  },
  {
    title: "Shared favorites",
    description: "Automations teammates bookmarked glow softly.",
  },
  {
    title: "Collaborative filtering",
    description: '"3 team members viewed this automation" moments surface instantly.',
  },
  {
    title: "Quick sharing",
    description: "One-click to share automation preview with the team.",
  },
];

const SOCIAL_FEATURES = [
  "Teammate cursors appear as they explore",
  "Popular automations among your industry peers are highlighted",
  "Team annotations appear on relevant automations",
  "Shared deployment planning workspace",
];

const MARKETPLACE_JOURNEY = [
  {
    title: "Entry Experience",
    icon: "🚪",
    steps: [
      "Automations arrange themselves based on detected company profile",
      "Gentle animations guide attention to highest-value options",
      "Success metrics from similar companies fade in gracefully",
      "Most relevant categories pulse softly with welcoming energy",
    ],
  },
  {
    title: "Browse & Filter",
    icon: "🧭",
    steps: [
      "Intelligent filters appear based on browsing behavior",
      "Automations reorganize fluidly when filters change",
      "Related automations connect with animated lines",
      "ROI indicators update in real-time as they browse",
    ],
  },
  {
    title: "Deep Dive Preview",
    icon: "🔍",
    steps: [
      "Card morphs into immersive full-screen experience",
      "Shows automation running with user's industry data",
      "Interactive elements let them \"test drive\" features",
      "Real deployment timeline appears with effort estimates",
    ],
  },
  {
    title: "Team Collaboration",
    icon: "🤝",
    steps: [
      "Their cursor appears with elegant fade-in animation",
      "Shared discoveries synchronize across all viewers",
      "Live discussion appears as contextual chat bubbles",
      "Collaborative decision-making with voting/rating system",
    ],
  },
];

function deriveROIMetrics(automations = [], signals = [], focus) {
  const roiValues = [];
  const categoryMap = new Map();
  const comboScores = [];

  automations.forEach((automation) => {
    if (!automation || typeof automation !== "object") return;
    const roi = Number(automation?.roi);
    if (Number.isFinite(roi)) {
      roiValues.push(roi);
    }

    const category = automation?.category || automation?.vertical || "General";
    const entry = categoryMap.get(category) || { count: 0, roi: 0 };
    entry.count += 1;
    if (Number.isFinite(roi)) {
      entry.roi += roi;
    }
    categoryMap.set(category, entry);

    const tags = Array.isArray(automation?.tags) ? automation.tags : [];
    const overlap = signals.filter((signal) => {
      const normalized = String(signal || "").toLowerCase();
      return (
        normalized &&
        (String(category).toLowerCase().includes(normalized) ||
          tags.some((tag) => String(tag).toLowerCase().includes(normalized)))
      );
    });
    if (overlap.length >= 2) {
      comboScores.push({
        id: automation.id,
        name: automation.name,
        overlap,
        roi: Number.isFinite(roi) ? roi : 0,
      });
    }
  });

  const averageROI =
    roiValues.length > 0
      ? roiValues.reduce((total, value) => total + value, 0) / roiValues.length
      : null;

  const topCategory = Array.from(categoryMap.entries())
    .map(([category, { count, roi }]) => ({
      category,
      count,
      roiAverage: count > 0 ? roi / count : 0,
    }))
    .sort((a, b) => {
      if (b.roiAverage === a.roiAverage) {
        return b.count - a.count;
      }
      return b.roiAverage - a.roiAverage;
    })[0] || null;

  const combo = comboScores
    .map((entry) => ({
      ...entry,
      score: entry.roi + entry.overlap.length * 1.75 + (focus ? 2.5 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { averageROI, topCategory, combo };
}

const DOMAIN_INDUSTRY_MAP = [
  { keywords: ["health", "med", "pharma", "clinic"], industry: "Healthcare" },
  { keywords: ["fin", "bank", "capital", "credit"], industry: "Financial Services" },
  { keywords: ["retail", "commerce", "shop", "store"], industry: "Ecommerce" },
  { keywords: ["edu", "school", "academy", "college"], industry: "Education" },
  { keywords: ["logistics", "supply", "shipping", "freight"], industry: "Logistics" },
  { keywords: ["manufact", "factory", "industrial"], industry: "Manufacturing" },
  { keywords: ["travel", "hospitality", "hotel"], industry: "Hospitality" },
  { keywords: ["media", "marketing", "agency"], industry: "Media & Marketing" },
  { keywords: ["gov", "public", "civic"], industry: "Public Sector" },
  { keywords: ["tech", "cloud", "software", "saas"], industry: "Software" },
];

function normalize(text) {
  return (text || "").toString().toLowerCase();
}

function titleCase(value = "") {
  return value
    .toString()
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function extractDomain(email = "") {
  const [, domain] = String(email).split("@");
  return domain ? domain.toLowerCase() : "";
}

function detectIndustryFromDomain(email, fallback) {
  const domain = extractDomain(email);
  if (!domain) return fallback || null;

  const sanitized = domain.replace(/^www\./, "");
  const segments = sanitized.split(".");
  const base = segments.slice(0, -1).join(".") || sanitized;

  for (const entry of DOMAIN_INDUSTRY_MAP) {
    if (entry.keywords.some((keyword) => base.includes(keyword))) {
      return entry.industry;
    }
  }

  return fallback || null;
}

function matchesIndustry(item, industry) {
  if (!industry) return false;
  const target = normalize(industry);
  const pool = [item?.category, item?.vertical, ...(item?.tags || [])].filter(Boolean);
  return pool.some((value) => normalize(value).includes(target));
}

function detectNeeds(user, items) {
  const signals = [];
  const addSignal = (raw) => {
    if (!raw) return;
    const label = titleCase(raw);
    const isDuplicate = signals.some((entry) => normalize(entry) === normalize(label));
    if (!isDuplicate) {
      signals.push(label);
    }
  };

  if (user?.industry) addSignal(`${user.industry}`);
  if (user?.department) addSignal(`${user.department} workflows`);
  if (user?.role) addSignal(`${user.role} enablement`);
  if (user?.teamSize) {
    const size = Number(user.teamSize);
    if (!Number.isNaN(size)) {
      if (size > 500) addSignal("Enterprise scale");
      else if (size > 120) addSignal("Team productivity");
      else addSignal("Startup velocity");
    }
  }

  const painPoints = Array.isArray(user?.painPoints)
    ? user?.painPoints
    : typeof user?.painPoints === "string"
      ? user.painPoints.split(/,|;/)
      : [];
  painPoints.forEach((point) => addSignal(point));

  const tagFrequency = new Map();
  (items || []).forEach((item) => {
    (item?.tags || []).forEach((tag) => {
      const key = normalize(tag);
      if (!key) return;
      tagFrequency.set(key, (tagFrequency.get(key) || 0) + 1);
    });
  });

  const trending = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => titleCase(tag));

  trending.forEach((tag) => addSignal(tag));

  return signals.slice(0, 4);
}

function computeMatchScore(item, detectedNeeds, activeNeed, browsingSignals, industry) {
  const tags = (item?.tags || []).map((tag) => normalize(tag));
  const description = normalize(item?.description);
  const category = normalize(item?.category || item?.vertical);
  let score = 1;

  if (activeNeed) {
    const target = normalize(activeNeed);
    if (tags.some((tag) => tag.includes(target))) score += 7;
    if (category.includes(target)) score += 5;
    if (description.includes(target)) score += 4;
  }

  detectedNeeds.forEach((need, index) => {
    const normalizedNeed = normalize(need);
    const weight = detectedNeeds.length - index;
    if (tags.some((tag) => tag.includes(normalizedNeed))) score += weight * 1.5;
    if (description.includes(normalizedNeed)) score += weight;
  });

  if (typeof item?.roi === "number") score += item.roi;
  if (typeof item?.popularity === "number") score += item.popularity * 0.5;

  if (industry && matchesIndustry(item, industry)) {
    score += 6;
  }

  (browsingSignals || []).forEach((signal, index) => {
    const normalizedSignal = normalize(signal.label);
    const weight = signal.weight || Math.max(1, (browsingSignals.length - index) * 0.9);
    if (tags.some((tag) => tag.includes(normalizedSignal))) score += weight * 1.4;
    if (description.includes(normalizedSignal)) score += weight;
    if (category.includes(normalizedSignal)) score += weight * 1.1;
  });

  return score;
}

function computeClusterLabel(item, activeNeed) {
  if (activeNeed) {
    const normalizedNeed = normalize(activeNeed);
    const hasNeedTag = (item?.tags || []).some((tag) => normalize(tag).includes(normalizedNeed));
    if (hasNeedTag || normalize(item?.category).includes(normalizedNeed)) {
      return `Tailored for ${titleCase(activeNeed)}`;
    }
  }

  const baseLabel = item?.category || item?.vertical || (item?.tags?.[0] ?? "Universal");
  return `Cluster: ${titleCase(baseLabel)}`;
}

function createClusterDescription(label, activeNeed) {
  const lower = normalize(label);
  if (lower.startsWith("tailored")) {
    return activeNeed
      ? `Automations tuned to your ${titleCase(activeNeed)} focus with synchronized data flows.`
      : "Automations tuned to your current signals with synchronized data flows.";
  }

  const topic = label.split(":").slice(1).join(":").trim();
  return topic
    ? `${topic} specialists linked by glowing workflow connections.`
    : "Related automations collaborating through live workflow connections.";
}

export default function Marketplace({ user, openAuth }) {
  const { darkMode } = useTheme();
  const [demo, setDemo] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageROI, setAverageROI] = useState(null);
  const [detectedNeeds, setDetectedNeeds] = useState([]);
  const [activeNeed, setActiveNeed] = useState(null);
  const [layoutKey, setLayoutKey] = useState(0);
  const [detectedIndustry, setDetectedIndustry] = useState(null);
  const [browsingSignals, setBrowsingSignals] = useState([]);
  const [workerMetrics, setWorkerMetrics] = useState({
    averageROI: null,
    topCategory: null,
    combo: [],
  });
  const [psychicId, setPsychicId] = useState(null);
  const [teamVotes, setTeamVotes] = useState({});
  const workerRef = useRef(null);
  const collaborationChannelRef = useRef(null);
  const [collaborationReady, setCollaborationReady] = useState(false);
  const sessionId = useMemo(() => `mp-${Math.random().toString(36).slice(2, 8)}`, []);
  const {
    data: statsData,
    error: statsError,
  } = useQuery(MARKETPLACE_STATS_QUERY, {
    fetchPolicy: "cache-first",
  });

  const resolvedStatsROI = useMemo(() => {
    const roi = statsData?.marketplaceStats?.averageROI;
    if (typeof roi === "number" && Number.isFinite(roi)) {
      return roi;
    }
    const fallbackROI = FALLBACK_MARKETPLACE_STATS?.averageROI;
    if (typeof fallbackROI === "number" && Number.isFinite(fallbackROI)) {
      return fallbackROI;
    }
    return null;
  }, [statsData]);

  useEffect(() => {
    if (statsError) {
      console.warn("Failed to fetch marketplace stats", statsError);
    }
  }, [statsError]);

  useEffect(() => {
    if (resolvedStatsROI == null) return;
    setAverageROI((current) => {
      const next = Number(resolvedStatsROI.toFixed(2));
      if (typeof current === "number" && Math.abs(current - next) < 0.005) {
        return current;
      }
      return next;
    });
  }, [resolvedStatsROI]);

  useEffect(() => {
    warmupWasm();

    const loadAutomations = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await fetchAutomations();
        if (!Array.isArray(list)) {
          throw new Error("Invalid data format received");
        }
        setAutomations(list);

        const roiValues = list
          .map((item) => item?.roi)
          .filter((value) => typeof value === "number" && Number.isFinite(value))
          .map((value) => Math.round(value * 100));
        if (roiValues.length) {
          wasmAverage(roiValues)
            .then((avg) => setAverageROI(Number((avg / 100).toFixed(2))))
            .catch((err) => console.warn("Failed to compute ROI average", err));
        }
      } catch (err) {
        console.error("Error loading automations:", err);
        setAutomations([]);
        setError(err);
        toast(err?.message || "Failed to load automations", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadAutomations();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof Worker === "undefined") return undefined;
    try {
      const worker = new Worker(new URL("../workers/roiWorker.js", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;
      const handleMessage = (event) => {
        if (event.data?.type === "metrics") {
          setWorkerMetrics({
            averageROI: event.data.averageROI,
            topCategory: event.data.topCategory,
            combo: event.data.combo || [],
          });
        }
      };
      worker.addEventListener("message", handleMessage);

      return () => {
        worker.removeEventListener("message", handleMessage);
        worker.terminate();
        workerRef.current = null;
      };
    } catch (err) {
      console.warn("ROI worker unavailable", err);
      workerRef.current = null;
      return undefined;
    }
  }, []);

  useEffect(() => {
    const fallbackIndustry = user?.industry ? titleCase(user.industry) : null;
    const emailIndustry = detectIndustryFromDomain(
      user?.businessEmail || user?.email || "",
      fallbackIndustry,
    );
    setDetectedIndustry(emailIndustry);
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(BROWSING_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (!stored || typeof stored !== "object") return;
      const ranked = Object.values(stored)
        .filter((entry) => entry && entry.label)
        .sort((a, b) => {
          if (b.count === a.count) {
            return (b.lastSeen || 0) - (a.lastSeen || 0);
          }
          return b.count - a.count;
        })
        .slice(0, 6)
        .map((entry, index) => ({
          ...entry,
          weight: Math.max(1, 5 - index) + Math.min(entry.count, 5) * 0.3,
        }));
      setBrowsingSignals(ranked);
    } catch (err) {
      console.warn("Failed to load browsing signals", err);
    }
  }, []);

  useEffect(() => {
    if (!automations.length) {
      setDetectedNeeds([]);
      setActiveNeed(null);
      return;
    }

    const needs = detectNeeds(user, automations);
    setDetectedNeeds(needs);

    if (!needs.length) {
      setActiveNeed(null);
      return;
    }

    setActiveNeed((prev) => {
      if (prev && needs.some((need) => normalize(need) === normalize(prev))) {
        return prev;
      }
      return needs[0];
    });
  }, [automations, user]);

  useEffect(() => {
    if (!detectedIndustry || !detectedNeeds.length) return;
    setActiveNeed((prev) => {
      if (prev) return prev;
      const match = detectedNeeds.find((need) =>
        normalize(need).includes(normalize(detectedIndustry)),
      );
      return match || prev;
    });
  }, [detectedIndustry, detectedNeeds]);

  useEffect(() => {
    setLayoutKey((prev) => prev + 1);
  }, [activeNeed]);

  useEffect(() => {
    if (!automations.length) return;
    const signals = [
      ...detectedNeeds,
      ...(browsingSignals || []).map((signal) => signal.label).filter(Boolean),
    ];

    if (workerRef.current) {
      workerRef.current.postMessage({ automations, signals, focus: activeNeed });
      return;
    }

    setWorkerMetrics(deriveROIMetrics(automations, signals, activeNeed));
  }, [automations, detectedNeeds, browsingSignals, activeNeed]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
      return undefined;
    }
    const channel = new BroadcastChannel("marketplace-collaboration");
    collaborationChannelRef.current = channel;
    setCollaborationReady(true);
    const handleMessage = (event) => {
      const payload = event.data;
      if (!payload || payload.sessionId === sessionId) return;
      if (payload.type === "vote" && payload.automationId) {
        setTeamVotes((prev) => ({
          ...prev,
          [payload.automationId]: (prev[payload.automationId] || 0) + (payload.delta || 1),
        }));
      }
    };
    channel.addEventListener("message", handleMessage);
    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
      collaborationChannelRef.current = null;
      setCollaborationReady(false);
    };
  }, [sessionId]);

  const scoredAutomations = useMemo(() => {
    if (!automations.length) return [];

    const entries = automations.map((item) => {
      const score = computeMatchScore(
        item,
        detectedNeeds,
        activeNeed,
        browsingSignals,
        detectedIndustry,
      );
      return {
        item,
        score,
        industryMatch: matchesIndustry(item, detectedIndustry),
        browsingMatch: (browsingSignals || []).some((signal) =>
          matchesIndustry(item, signal.label),
        ),
      };
    });

    const maxScore = entries.reduce((max, entry) => Math.max(max, entry.score), 1);

    return entries
      .map((entry) => ({
        ...entry,
        matchStrength: maxScore ? entry.score / maxScore : 0,
      }))
      .sort((a, b) => b.score - a.score);
  }, [
    automations,
    detectedNeeds,
    activeNeed,
    browsingSignals,
    detectedIndustry,
  ]);

  const automationMap = useMemo(() => {
    return new Map(automations.map((item) => [item.id, item]));
  }, [automations]);

  const automationClusters = useMemo(() => {
    if (!scoredAutomations.length) return [];

    const groups = new Map();
    scoredAutomations.forEach(({ item, matchStrength, industryMatch, browsingMatch }) => {
      const label = computeClusterLabel(item, activeNeed);
      if (!groups.has(label)) {
        groups.set(label, []);
      }
      groups.get(label).push({ item, matchStrength, industryMatch, browsingMatch });
    });

    return Array.from(groups.entries()).map(([label, items], index) => ({
      id: `${label}-${index}`,
      label,
      description: createClusterDescription(label, activeNeed),
      items,
    }));
  }, [scoredAutomations, activeNeed]);

  const recommendedAutomations = useMemo(
    () =>
      scoredAutomations.slice(0, 3).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        confidence: Math.round((entry.matchStrength || 0) * 100),
      })),
    [scoredAutomations],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !recommendedAutomations.length) return;
    const [top] = recommendedAutomations;
    const timer = window.setTimeout(() => {
      setPsychicId(top.item.id);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [recommendedAutomations]);

  const combinationHighlight = useMemo(() => {
    if (!automationClusters.length) return null;
    const [topCluster] = automationClusters;
    return {
      title: topCluster.label,
      description: topCluster.description,
      items: topCluster.items.slice(0, 3).map(({ item }) => item.name),
    };
  }, [automationClusters]);

  const workerComboHighlight = useMemo(() => {
    if (!workerMetrics.combo?.length) return null;
    const [primary] = workerMetrics.combo;
    const source = automationMap.get(primary.id);
    const title = primary?.name || source?.name || "High-impact automation stack";
    return {
      title,
      description: primary?.overlap?.length
        ? `Signals in common: ${primary.overlap.join(", ")}`
        : "This stack surges ahead for teams matching your signals.",
      items: [title, ...(primary?.overlap || []).slice(0, 2)],
      roi: primary?.roi,
    };
  }, [workerMetrics.combo, automationMap]);

  const activeCombination = workerComboHighlight || combinationHighlight;

  const successMessage = useMemo(() => {
    const roiSource =
      typeof workerMetrics.averageROI === "number" && Number.isFinite(workerMetrics.averageROI)
        ? workerMetrics.averageROI
        : typeof averageROI === "number" && Number.isFinite(averageROI)
          ? averageROI
          : resolvedStatsROI;
    const roiValue =
      typeof roiSource === "number" && Number.isFinite(roiSource)
        ? roiSource
        : FALLBACK_MARKETPLACE_STATS?.averageROI || 0;
    const roi = Number(roiValue).toFixed(1);
    if (detectedIndustry) {
      return `Teams similar to yours in ${detectedIndustry} see ${roi}x ROI with this combination.`;
    }
    if (activeNeed) {
      return `Teams optimizing for ${titleCase(activeNeed)} see ${roi}x ROI with this combination.`;
    }
    return `Teams similar to yours see ${roi}x ROI with this combination.`;
  }, [averageROI, resolvedStatsROI, detectedIndustry, activeNeed, workerMetrics.averageROI]);

  const castVote = (automationId, delta = 1) => {
    if (!automationId) return;
    setTeamVotes((prev) => ({
      ...prev,
      [automationId]: (prev[automationId] || 0) + delta,
    }));
    collaborationChannelRef.current?.postMessage({
      type: "vote",
      sessionId,
      automationId,
      delta,
    });
  };

  const recordBrowsingSignal = (item, updateState) => {
    if (typeof window === "undefined" || !item) return;
    try {
      const raw = window.localStorage.getItem(BROWSING_STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : {};
      const buckets = stored && typeof stored === "object" ? { ...stored } : {};
      const descriptors = [item.category, item.vertical, ...(item.tags || [])].filter(Boolean);
      descriptors.forEach((descriptor) => {
        const key = normalize(descriptor);
        if (!key) return;
        const existing = buckets[key] || { label: titleCase(descriptor), count: 0 };
        buckets[key] = {
          ...existing,
          label: titleCase(descriptor),
          count: (existing.count || 0) + 1,
          lastSeen: Date.now(),
        };
      });
      window.localStorage.setItem(BROWSING_STORAGE_KEY, JSON.stringify(buckets));
      const ranked = Object.values(buckets)
        .filter((entry) => entry && entry.label)
        .sort((a, b) => {
          if (b.count === a.count) {
            return (b.lastSeen || 0) - (a.lastSeen || 0);
          }
          return b.count - a.count;
        })
        .slice(0, 6)
        .map((entry, index) => ({
          ...entry,
          weight: Math.max(1, 5 - index) + Math.min(entry.count, 5) * 0.3,
        }));
      updateState(ranked);
    } catch (err) {
      console.warn("Failed to persist browsing signals", err);
    }
  };

  const buy = async (item) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }

    if (!user) {
      openAuth("signup");
      return;
    }

    if (!user.verified) {
      toast("Please verify your email before deploying automations.", { type: "warn" });
      return;
    }

    try {
      const deploymentData = {
        automationId: item.id,
        placeholders: {
          businessName: user.businessName || "",
          businessPhone: user.businessPhone || "",
          businessEmail: user.businessEmail || "",
          websiteUrl: user.websiteUrl || "",
        },
      };

      await api.post("/deployments", deploymentData);
      recordBrowsingSignal(item, setBrowsingSignals);
      toast(`Successfully deployed ${item.name || "automation"}`, { type: "success" });
    } catch (err) {
      console.error("Deployment error:", err);
      const res = err?.response?.data;
      if (res?.errors?.length) {
        toast(res.errors.map((e) => `${e.field}: ${e.message}`).join(", "), { type: "error" });
      } else {
        const errorMessage = res?.message || err?.message || "Deployment failed";
        toast(errorMessage, { type: "error" });
      }
    }
  };

  const handleDemo = (item) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }
    recordBrowsingSignal(item, setBrowsingSignals);
    setDemo(item);
  };

  const sectionHeader = (
    <div
      className="section-header"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div className="marketplace-entry__intro">
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800 }}>
            Marketplace reimagined for {detectedIndustry || "your industry"}
          </h2>
          <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
            Automations reshuffle themselves around your profile. Categories pulse to guide attention
            and success metrics fade in as if the marketplace already knows what you'll ask next.
          </p>
          <div className="marketplace-entry__meta">
            <div>
              <span>Top live cluster</span>
              <strong>{workerMetrics.topCategory?.category || "Adaptive orchestration"}</strong>
            </div>
            <div>
              <span>Psychic highlight</span>
              <strong>
                {psychicId
                  ? automationMap.get(psychicId)?.name || "Discovering"
                  : "Scanning"}
              </strong>
            </div>
            <div>
              <span>Active combination ROI</span>
              <strong>
                {activeCombination?.roi
                  ? `${Number(activeCombination.roi).toFixed(2)}x`
                  : workerMetrics.averageROI
                    ? `${workerMetrics.averageROI.toFixed(2)}x`
                    : "Modeling"}
              </strong>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {[
          "Psychic glow predictions",
          "Canvas ecosystem map",
          "Collaborative decisions",
          workerMetrics.averageROI ? `Live ROI ${workerMetrics.averageROI.toFixed(2)}x` : null,
          detectedIndustry ? `${detectedIndustry} focus` : null,
        ]
          .filter(Boolean)
          .map((tag) => (
            <span
              key={tag}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "0.8rem",
                background: darkMode ? "rgba(148,163,184,0.18)" : "rgba(99,102,241,0.12)",
                border: `1px solid ${darkMode ? "rgba(148,163,184,0.32)" : "rgba(99,102,241,0.25)"}`,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: darkMode ? "#cbd5e1" : "#1f2937",
              }}
            >
              {tag}
            </span>
          ))}
      </div>
      <div
        className="marketplace-demo-experience"
        role="note"
        aria-label="Collaborative marketplace experience details"
      >
        <div className="marketplace-demo-experience__header">
          <span className="marketplace-demo-experience__eyebrow">Team Exploration</span>
          <p>Marketplace is now multiplayer-ready:</p>
        </div>
        <ul className="marketplace-demo-experience__list">
          {COLLABORATION_FEATURES.map(({ title, description }) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{description}</span>
            </li>
          ))}
        </ul>
        <div className="marketplace-collaboration__social">
          <header>
            <span aria-hidden="true">🤝</span>
            <div>
              <h4>Social Features</h4>
              <p>Multiplayer marketplace where:</p>
            </div>
          </header>
          <ul className="marketplace-collaboration__social-list">
            {SOCIAL_FEATURES.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="marketplace-journey" aria-label="Marketplace journey highlights">
        <header>
          <span className="marketplace-journey__eyebrow">🎨 Marketplace Reimagined</span>
          <p>Follow the shared exploration flow from welcome moment to decision.</p>
        </header>
        <div className="marketplace-journey__grid">
          {MARKETPLACE_JOURNEY.map(({ title, icon, steps }) => (
            <article key={title} className="marketplace-journey__card">
              <div className="marketplace-journey__card-header">
                <span aria-hidden="true" className="marketplace-journey__icon">
                  {icon}
                </span>
                <h4>{title}</h4>
              </div>
              <ol>
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
      {detectedNeeds.length > 0 && (
        <div className="marketplace-needs" role="group" aria-label="Dynamic automation filters">
          <div className="marketplace-needs__meta">
            <span>We think you're optimizing for</span>
            <strong>{activeNeed ? titleCase(activeNeed) : "blended impact"}</strong>
          </div>
          <div className="marketplace-needs__chips">
            {detectedNeeds.map((need) => {
              const isActive = normalize(need) === normalize(activeNeed);
              return (
                <button
                  type="button"
                  key={need}
                  className="marketplace-needs__chip"
                  data-active={isActive}
                  onClick={() => setActiveNeed(need)}
                >
                  <span>{need}</span>
                  <span className="marketplace-needs__glow" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <p className="marketplace-needs__hint">
            Automations reorganize themselves in real-time based on the signal you select.
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="marketplace" data-glass="true" style={{ padding: "5rem 0" }}>
        <div className="container" style={{ display: "grid", gap: "2rem" }}>
          {sectionHeader}
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
              background: darkMode
                ? "linear-gradient(145deg, rgba(15,23,42,0.75), rgba(30,41,59,0.82))"
                : "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.92))",
            }}
          >
            <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569", marginTop: "1rem" }}>Loading automations…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && automations.length === 0) {
    return (
      <section className="marketplace" data-glass="true" style={{ padding: "5rem 0" }}>
        <div className="container" style={{ display: "grid", gap: "2rem" }}>
          {sectionHeader}
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(248,113,113,0.4)" : "rgba(248,113,113,0.5)"}`,
              background: darkMode
                ? "linear-gradient(145deg, rgba(127,29,29,0.45), rgba(15,23,42,0.85))"
                : "linear-gradient(145deg, rgba(254,226,226,0.95), rgba(254,242,242,0.9))",
              color: darkMode ? "#fecaca" : "#b91c1c",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Unable to Load Marketplace</h3>
            <p style={{ maxWidth: "420px", margin: "0 auto 1.5rem" }}>
              We're having trouble loading the automation marketplace. Please check your connection and try again.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="marketplace" data-glass="true" style={{ padding: "5rem 0" }}>
      <div className="container" style={{ display: "grid", gap: "2.5rem" }}>
        {sectionHeader}

        {collaborationReady && (
          <MarketplaceCollaborationLayer
            focus={activeNeed ? titleCase(activeNeed) : null}
            channel={collaborationChannelRef.current}
            sessionId={sessionId}
          />
        )}

        <div className="marketplace-smart" role="region" aria-label="Smart marketplace insights">
          <div className="marketplace-smart__column">
            <header className="marketplace-smart__header">
              <span className="marketplace-smart__eyebrow">Smart recommendations</span>
              <h3>Companies like yours typically start with these 3</h3>
              {detectedIndustry && (
                <p>
                  We detected <strong>{detectedIndustry}</strong> signals from your profile and email
                  domain.
                </p>
              )}
            </header>
            <div className="marketplace-smart__recommendations">
              {recommendedAutomations.length === 0 ? (
                <p>No recommendations available yet.</p>
              ) : (
                recommendedAutomations.map(({ item, rank, confidence }) => (
                  <article
                    key={item.id}
                    className="marketplace-smart__card"
                    data-predicted={psychicId === item.id}
                  >
                    <div className="marketplace-smart__card-rank">#{rank}</div>
                    <div className="marketplace-smart__card-body">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <div className="marketplace-smart__card-meta">
                        <span>{confidence}% relevance match</span>
                        {item.tags?.length ? <span>{item.tags.slice(0, 2).join(" · ")}</span> : null}
                        {typeof workerMetrics.averageROI === "number" ? (
                          <span>{workerMetrics.averageROI.toFixed(2)}x live ROI</span>
                        ) : null}
                      </div>
                      <div className="marketplace-smart__card-collab">
                        <button type="button" onClick={() => castVote(item.id)}>
                          <span aria-hidden="true">🗳️</span>
                          <span>Team vote</span>
                        </button>
                        <span>{teamVotes[item.id] || 0} votes</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="marketplace-smart__card-action"
                      onClick={() => handleDemo(item)}
                    >
                      Preview
                    </button>
                  </article>
                ))
              )}
            </div>
            <div className="marketplace-smart__success" role="status">
              <strong>Success pattern matching</strong>
              <span>{successMessage}</span>
            </div>
          </div>

          <div className="marketplace-smart__column marketplace-smart__column--meta">
            <h4>Smart Features</h4>
            <ul>
              <li>
                <strong>Industry-aware filtering</strong>
                <span>
                  Automatically highlights automations for {detectedIndustry || "your business"} and
                  reshapes scoring as you explore.
                </span>
              </li>
              <li>
                <strong>Adaptive marketplace</strong>
                <span>Detects your industry from email domain and adapts recommendations instantly.</span>
              </li>
              <li>
                <strong>Behavioral learning</strong>
                <span>Learns from your browsing patterns and rearranges the marketplace in real time.</span>
              </li>
              <li>
                <strong>Peer success signals</strong>
                <span>Shows peer success stories and ROI uplift for teams similar to yours.</span>
              </li>
              {activeCombination && (
                <li>
                  <strong>Combination spotlight</strong>
                  <span>
                    Highlights automation combinations like <em>{activeCombination.title}</em> that
                    work well together: {activeCombination.items.join(", ")}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <LivingSuccessMetrics
          industry={detectedIndustry}
          focus={activeNeed ? titleCase(activeNeed) : null}
          activeCombo={activeCombination}
        />

        {error && automations.length > 0 && (
          <div
            role="alert"
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              border: `1px solid ${darkMode ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.5)"}`,
              background: darkMode ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.18)",
              color: darkMode ? "#fbbf24" : "#b45309",
              textAlign: "center",
            }}
          >
            Some automations may not be displayed due to a connection issue.
          </div>
        )}

        <div className="marketplace-detected-message">
          {activeNeed ? (
            <span>
              <strong>{titleCase(activeNeed)}</strong> automations surge to the front with live clustering.
            </span>
          ) : (
            <span></span>
          )}
        </div>

        {automationClusters.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤔</div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>No automations found</h3>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
              Check back soon—new automations are added every week.
            </p>
          </div>
        ) : (
          <div className="automation-clusters">
            {automationClusters.map((cluster) => (
              <div
                key={`${cluster.id}-${layoutKey}`}
                className="automation-cluster"
                data-highlight={normalize(cluster.label).startsWith("tailored")}
              >
                <div className="automation-cluster__halo" aria-hidden="true" />
                <div className="automation-cluster__links" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <header>
                  <h3>{cluster.label}</h3>
                  <p>{cluster.description}</p>
                </header>
                <div className="automation-cluster__grid">
                  {cluster.items.map(({ item, matchStrength, industryMatch, browsingMatch }) => (
                    <AutomationCard
                      key={item.id}
                      item={item}
                      onDemo={handleDemo}
                      onBuy={buy}
                      activeNeed={activeNeed}
                      matchStrength={matchStrength}
                      industryMatch={industryMatch}
                      industryLabel={detectedIndustry}
                      browsingMatch={browsingMatch}
                      onVote={(automation) => castVote(automation.id)}
                      voteCount={teamVotes[item.id] || 0}
                      predicted={psychicId === item.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {demo && (
        <DemoModal automation={demo} user={user} onClose={() => setDemo(null)} />
      )}
    </section>
  );
}