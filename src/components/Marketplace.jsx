import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const ATTENTION_STORAGE_KEY = "automation-attention-scores";
const SEARCH_HISTORY_KEY = "automation-search-history";
const MAX_ATTENTION_ENTRIES = 32;
const MAX_SEARCH_HISTORY = 8;
const ATTENTION_DECAY_FACTOR = 0.94;
const ATTENTION_DECAY_INTERVAL_MINUTES = 18;

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

function loadAttentionScores() {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(ATTENTION_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return {};

    const now = Date.now();
    const entries = {};

    Object.entries(parsed).forEach(([id, value]) => {
      if (!id || !value || typeof value !== "object") return;
      const rawScore = Number(value.score) || 0;
      const interactions = Number(value.interactions) || 0;
      const lastViewed = Number(value.lastViewed) || 0;
      if (rawScore <= 0 && interactions <= 0) return;

      const ageMinutes = lastViewed ? Math.max(0, (now - lastViewed) / 60000) : 0;
      const decaySteps = ageMinutes / ATTENTION_DECAY_INTERVAL_MINUTES;
      const decayMultiplier = decaySteps ? Math.pow(ATTENTION_DECAY_FACTOR, decaySteps) : 1;
      const score = Math.max(0, rawScore * decayMultiplier);
      if (score <= 0.01 && interactions <= 0) return;

      entries[id] = {
        score,
        interactions,
        lastViewed,
      };
    });

    return entries;
  } catch (error) {
    console.warn("Failed to parse attention scores", error);
    return {};
  }
}

function loadSearchHistory() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && typeof entry.query === "string")
      .slice(0, MAX_SEARCH_HISTORY);
  } catch (error) {
    console.warn("Failed to parse search history", error);
    return [];
  }
}

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
  const [attentionScores, setAttentionScores] = useState(() => loadAttentionScores());
  const attentionQueueRef = useRef(new Map());
  const attentionRafRef = useRef(null);
  const [spotlightId, setSpotlightId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => loadSearchHistory());
  const searchBlurTimerRef = useRef(null);
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
    return () => {
      if (searchBlurTimerRef.current) {
        clearTimeout(searchBlurTimerRef.current);
      }
      if (attentionRafRef.current && typeof window !== "undefined" && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(attentionRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const entries = Object.entries(attentionScores || {});
      if (!entries.length) {
        window.localStorage.removeItem(ATTENTION_STORAGE_KEY);
        return;
      }
      const trimmed = entries
        .sort((a, b) => (b[1]?.score || 0) - (a[1]?.score || 0))
        .slice(0, MAX_ATTENTION_ENTRIES)
        .reduce((acc, [id, value]) => {
          if (!id || !value) return acc;
          acc[id] = {
            score: Number(value.score) || 0,
            interactions: Number(value.interactions) || 0,
            lastViewed: Number(value.lastViewed) || Date.now(),
          };
          return acc;
        }, {});
      window.localStorage.setItem(ATTENTION_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.warn("Failed to persist attention scores", error);
    }
  }, [attentionScores]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!searchHistory.length) {
        window.localStorage.removeItem(SEARCH_HISTORY_KEY);
        return;
      }
      const trimmed = searchHistory.slice(0, MAX_SEARCH_HISTORY);
      window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.warn("Failed to persist search history", error);
    }
  }, [searchHistory]);

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

  const registerAttention = useCallback(
    (automationId, deltaMs) => {
      if (!automationId) return;
      if (typeof deltaMs !== "number" || Number.isNaN(deltaMs) || deltaMs <= 0) {
        return;
      }
      if (typeof window === "undefined") return;

      const queue = attentionQueueRef.current;
      const seconds = deltaMs / 1000;
      queue.set(automationId, (queue.get(automationId) || 0) + seconds);

      if (attentionRafRef.current && window.requestAnimationFrame) {
        return;
      }

      if (!window.requestAnimationFrame) {
        setAttentionScores((prev) => {
          const next = { ...(prev || {}) };
          const existing = next[automationId] || { score: 0, interactions: 0, lastViewed: 0 };
          next[automationId] = {
            score: Math.max(0, existing.score * 0.985 + seconds),
            interactions: (existing.interactions || 0) + 1,
            lastViewed: Date.now(),
          };
          return next;
        });
        queue.delete(automationId);
        return;
      }

      attentionRafRef.current = window.requestAnimationFrame(() => {
        attentionRafRef.current = null;
        const updates = new Map(queue);
        queue.clear();
        const now = Date.now();
        setAttentionScores((prev) => {
          const next = { ...(prev || {}) };
          updates.forEach((gain, id) => {
            const existing = next[id] || { score: 0, interactions: 0, lastViewed: 0 };
            next[id] = {
              score: Math.max(0, (existing.score || 0) * 0.985 + gain),
              interactions: (existing.interactions || 0) + 1,
              lastViewed: now,
            };
          });
          return next;
        });
      });
    },
    [],
  );

  const handleAttentionDwell = useCallback(
    (automationId, deltaMs) => {
      registerAttention(automationId, deltaMs);
    },
    [registerAttention],
  );

  useEffect(() => {
    if (!spotlightId) return undefined;
    const timer = setTimeout(() => setSpotlightId(null), 2400);
    return () => clearTimeout(timer);
  }, [spotlightId]);

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

    const now = Date.now();
    const entries = automations.map((item) => {
      const baseScore = computeMatchScore(
        item,
        detectedNeeds,
        activeNeed,
        browsingSignals,
        detectedIndustry,
      );
      const attention = attentionScores?.[item.id];
      let attentionBonus = 0;
      if (attention) {
        const recencyMinutes = attention.lastViewed
          ? Math.max(0, (now - attention.lastViewed) / 60000)
          : 0;
        const recencyBoost = Math.max(0, 1.35 - recencyMinutes / 8);
        attentionBonus += Math.min(attention.score || 0, 12) * 1.6;
        attentionBonus += Math.min(attention.interactions || 0, 6) * 0.3;
        attentionBonus += recencyBoost;
      }

      const score = baseScore + attentionBonus;
      return {
        item,
        score,
        baseScore,
        attentionBonus,
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
    attentionScores,
  ]);

  const automationMap = useMemo(() => {
    return new Map(automations.map((item) => [item.id, item]));
  }, [automations]);

  const automationClusters = useMemo(() => {
    if (!scoredAutomations.length) return [];

    const groups = new Map();
    scoredAutomations.forEach(({ item, matchStrength, industryMatch, browsingMatch, attentionBonus }) => {
      const label = computeClusterLabel(item, activeNeed);
      if (!groups.has(label)) {
        groups.set(label, []);
      }
      groups.get(label).push({
        item,
        matchStrength,
        industryMatch,
        browsingMatch,
        attentionBonus,
        attentionScore: attentionScores?.[item.id]?.score || 0,
      });
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

  const searchIndex = useMemo(() => {
    if (!automations.length) return [];
    return automations.map((item) => {
      const keywords = new Set();
      const pushTokens = (value) => {
        const normalizedValue = normalize(value);
        if (!normalizedValue) return;
        normalizedValue
          .split(/[^a-z0-9]+/)
          .map((token) => token.trim())
          .filter(Boolean)
          .forEach((token) => keywords.add(token));
      };
      pushTokens(item.name);
      pushTokens(item.description);
      pushTokens(item.category);
      pushTokens(item.vertical);
      (item.tags || []).forEach(pushTokens);

      const normalizedName = normalize(item.name);
      return {
        item,
        normalizedName,
        nameFragments: normalizedName.split(/\s+/).filter(Boolean),
        keywords,
      };
    });
  }, [automations]);

  const scoredMap = useMemo(() => {
    const map = new Map();
    scoredAutomations.forEach((entry) => {
      map.set(entry.item.id, {
        score: entry.score,
        matchStrength: entry.matchStrength,
        attentionBonus: entry.attentionBonus,
      });
    });
    return map;
  }, [scoredAutomations]);

  const historyWeights = useMemo(() => {
    const weights = new Map();
    searchHistory.forEach((entry, index) => {
      const key = normalize(entry?.query);
      if (!key) return;
      weights.set(key, Math.max(1, MAX_SEARCH_HISTORY - index));
    });
    return weights;
  }, [searchHistory]);

  const searchSuggestions = useMemo(() => {
    const suggestions = [];
    if (activeNeed) {
      suggestions.push(titleCase(activeNeed));
    }
    if (detectedIndustry) {
      suggestions.push(`${titleCase(detectedIndustry)} automations`);
    }
    searchHistory.forEach((entry) => {
      if (entry?.query) {
        suggestions.push(entry.query);
      }
    });
    return Array.from(new Set(suggestions)).slice(0, 5);
  }, [activeNeed, detectedIndustry, searchHistory]);

  const searchResults = useMemo(() => {
    if ((!searchFocused && !searchTerm) || !searchIndex.length) return [];

    const rawInput = searchTerm.trim();
    const normalizedInput = normalize(rawInput);
    const tokens = normalizedInput.split(/\s+/).filter(Boolean);
    const partialToken = tokens.length ? tokens[tokens.length - 1] : normalizedInput;
    const results = [];
    const used = new Set();

    const addResult = (item, score, reason) => {
      if (!item || used.has(item.id)) return;
      used.add(item.id);
      results.push({ item, score, reason });
    };

    searchIndex.forEach(({ item, normalizedName, nameFragments, keywords }) => {
      let score = (scoredMap.get(item.id)?.score || 0) * 0.92;
      let matches = 0;

      tokens.forEach((token, index) => {
        if (!token) return;
        if (normalizedName.startsWith(token)) {
          score += 8 - index * 0.45;
          matches += 1;
        } else if (nameFragments.some((fragment) => fragment.startsWith(token))) {
          score += 6.75 - index * 0.4;
          matches += 1;
        } else if (normalizedName.includes(token)) {
          score += 3.5 - index * 0.35;
          matches += 1;
        }
        if (keywords.has(token)) {
          score += 3.1 - index * 0.25;
          matches += 1;
        }
      });

      if (partialToken && partialToken.length > 0 && partialToken.length < 3) {
        if (nameFragments.some((fragment) => fragment.startsWith(partialToken))) {
          score += 4.5;
          matches += 1;
        }
      }

      if (!tokens.length) {
        const focusMatches = [activeNeed, detectedIndustry]
          .map((value) => normalize(value))
          .filter(Boolean)
          .some((value) => keywords.has(value));
        if (focusMatches) {
          score += 5.4;
          matches += 1;
        }
      }

      const attention = attentionScores?.[item.id];
      if (attention) {
        score += Math.min(attention.score || 0, 10) * 0.85;
        score += Math.min(attention.interactions || 0, 5) * 0.25;
      }

      historyWeights.forEach((weight, query) => {
        if (!query) return;
        if (normalizedInput && query.startsWith(normalizedInput)) {
          score += weight * 1.25;
        } else if (normalizedName.includes(query)) {
          score += weight * 0.6;
        }
      });

      if (matches > 0 || (!tokens.length && results.length < 6)) {
        addResult(item, score, matches > 0 ? "match" : "prefetch");
      }
    });

    if (!tokens.length) {
      recommendedAutomations.forEach((entry, index) => {
        addResult(entry.item, (entry.score || 0) + 12 - index * 1.5, "recommended");
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 6);
  }, [
    searchFocused,
    searchTerm,
    searchIndex,
    scoredMap,
    attentionScores,
    activeNeed,
    detectedIndustry,
    historyWeights,
    recommendedAutomations,
  ]);

  const topSearchResult = searchResults[0];

  const handleSearchFocus = useCallback(() => {
    if (searchBlurTimerRef.current) {
      clearTimeout(searchBlurTimerRef.current);
      searchBlurTimerRef.current = null;
    }
    setSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    if (searchBlurTimerRef.current) {
      clearTimeout(searchBlurTimerRef.current);
    }
    searchBlurTimerRef.current = setTimeout(() => {
      setSearchFocused(false);
    }, 120);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchSelect = useCallback(
    (automation, queryOverride) => {
      if (!automation) return;
      if (searchBlurTimerRef.current) {
        clearTimeout(searchBlurTimerRef.current);
        searchBlurTimerRef.current = null;
      }

      const query = (queryOverride ?? searchTerm).trim();
      setSpotlightId(automation.id);

      if (typeof window !== "undefined") {
        const element = document.getElementById(`automation-${automation.id}`);
        if (element) {
          window.requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }
      }

      if (query) {
        setSearchHistory((prev = []) => {
          const filtered = prev.filter((entry) => entry?.query !== query);
          const next = [{ query, ts: Date.now() }, ...filtered];
          return next.slice(0, MAX_SEARCH_HISTORY);
        });
      }

      setSearchFocused(false);
      setSearchTerm("");
      registerAttention(automation.id, 900);
    },
    [registerAttention, searchTerm],
  );

  const handleSearchKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (topSearchResult) {
          handleSearchSelect(topSearchResult.item, searchTerm);
        }
      } else if (event.key === "Escape") {
        setSearchTerm("");
        setSearchFocused(false);
      }
    },
    [handleSearchSelect, searchTerm, topSearchResult],
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      if (!suggestion) return;
      setSearchTerm(suggestion);
      handleSearchFocus();
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          const input = document.getElementById("marketplace-search-input");
          if (input) {
            input.focus();
            if (typeof input.setSelectionRange === "function") {
              const length = suggestion.length;
              input.setSelectionRange(length, length);
            }
          }
        });
      }
    },
    [handleSearchFocus],
  );

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

        <div className="marketplace-search" role="search">
          <label htmlFor="marketplace-search-input">
            <span className="marketplace-search__label">Search automations</span>
            <div className="marketplace-search__field">
              <span aria-hidden="true" className="marketplace-search__icon">
                🔍
              </span>
              <input
                id="marketplace-search-input"
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleSearchKeyDown}
                placeholder="Predictive search that responds before you finish typing"
                autoComplete="off"
              />
            </div>
            <p className="marketplace-search__hint">
              Results pre-populate using browsing signals, time-of-day patterns, and previous searches.
            </p>
          </label>

          {searchSuggestions.length > 0 && (
            <div className="marketplace-search__suggestions" role="list">
              {searchSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="marketplace-search__suggestion"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSuggestionClick(suggestion);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {(searchFocused || searchTerm) && (
            <div className="marketplace-search__results" role="listbox">
              {searchResults.length === 0 ? (
                <div className="marketplace-search__empty">Preloading likely matches… keep typing if you like.</div>
              ) : (
                searchResults.map(({ item, reason }) => {
                  const detail = item.tags?.slice(0, 2).join(" · ") || item.category;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      className="marketplace-search__result"
                      data-reason={reason}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleSearchSelect(item, searchTerm);
                      }}
                    >
                      <div className="marketplace-search__result-main">
                        <strong>{item.name}</strong>
                        {detail ? <span>{detail}</span> : null}
                      </div>
                      <span className="marketplace-search__result-reason">
                        {reason === "match" ? "Instant match" : "Predicted fit"}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

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
                  {cluster.items.map(({ item, matchStrength, industryMatch, browsingMatch, attentionScore }) => (
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
                      attentionScore={attentionScore}
                      spotlighted={spotlightId === item.id}
                      onDwell={handleAttentionDwell}
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