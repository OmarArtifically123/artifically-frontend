"use client";

import { Suspense, lazy, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { formatDistanceToNow } from "date-fns";
import { fetchAutomations } from "../data/automations.js";
import { toast } from "./Toast";
import api from "../api.js";
import ThemeToggle from "./ThemeToggle";
import Button from "./ui/Button.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { warmupWasm, wasmAverage } from "../lib/wasmMath.js";
import LivingSuccessMetrics from "./LivingSuccessMetrics";
import MarketplaceCollaborationLayer from "./MarketplaceCollaborationLayer";
import { space } from "../styles/spacing.js";
import AutomationCard from "../features/marketplace/components/AutomationCard.js";
import VirtualizedAutomationList from "./VirtualizedAutomationList.jsx";
import { Icon } from "./icons/index.js";
import {
  FALLBACK_MARKETPLACE_STATS,
  loadMarketplaceStats,
} from "../lib/graphqlClient.js";
import ModalShell from "./skeletons/ModalShell.js";
import "../styles/marketplace.css";
import { isFocusableElement } from "@/utils/focus";

const DemoModal = lazy(() => import(/* webpackChunkName: "demo-modal" */ "./DemoModal.jsx"));

const BROWSING_STORAGE_KEY = "automation-browsing-signals";
const ATTENTION_STORAGE_KEY = "automation-attention-scores";
const MAX_ATTENTION_ENTRIES = 32;
const ATTENTION_DECAY_FACTOR = 0.94;
const ATTENTION_DECAY_INTERVAL_MINUTES = 18;

const MARKETPLACE_JOURNEY = [
  {
    title: "Entry Experience",
    icon: "door",
    steps: [
      "Marketplace welcome adapts to your company profile in one glance",
      "Live ROI summary highlights the outcomes your team cares about",
      "Clean layout keeps the focus on evaluating automations, not fighting UI",
      "Quick links surface documentation, pricing, and support right away",
    ],
  },
  {
    title: "Browse & Evaluate",
    icon: "compass",
    steps: [
      "Clusters group automations by outcome so you scan less",
      "Match strength indicators compare every option instantly",
      "Preview modals launch without taking you away from the grid",
      "Saved browsing signals nudge relevant categories back to the top",
    ],
  },
  {
    title: "Deep Dive Preview",
    icon: "search",
    steps: [
      "Interactive previews stream sample data based on your needs",
      "Feature highlights explain how the automation actually works",
      "Deployment actions stay one click away with clear CTAs",
      "Telemetry hints show which metrics will populate once live",
    ],
  },
  {
    title: "Team Collaboration",
    icon: "handshake",
    steps: [
      "Shared cursors broadcast teammate focus in real time",
      "Lightweight discussion feed captures quick takeaways",
      "Signals sync so everyone evaluates the same prioritized layout",
      "Optional demos help stakeholders experience the automation together",
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

export default function Marketplace({ user, openAuth }) {
  const { darkMode } = useTheme();
  const [demo, setDemo] = useState(null);
  const demoReturnFocusRef = useRef(null);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageROI, setAverageROI] = useState(null);
  const [detectedNeeds, setDetectedNeeds] = useState([]);
  const [activeNeed, setActiveNeed] = useState(null);
  const [detectedIndustry, setDetectedIndustry] = useState(null);
  const [browsingSignals, setBrowsingSignals] = useState([]);
  const [workerMetrics, setWorkerMetrics] = useState({
    averageROI: null,
    topCategory: null,
    combo: [],
  });
  const [attentionScores, setAttentionScores] = useState(() => loadAttentionScores());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const attentionQueueRef = useRef(new Map());
  const attentionRafRef = useRef(null);
  const workerRef = useRef(null);
  const collaborationChannelRef = useRef(null);
  const [collaborationReady, setCollaborationReady] = useState(false);
  const generatedSessionId = useId();
  const sessionId = useMemo(
    () => `mp-${generatedSessionId.replace(/[:]/g, "-")}`,
    [generatedSessionId],
  );
  const [resolvedStatsROI, setResolvedStatsROI] = useState(() => {
    const fallbackROI = FALLBACK_MARKETPLACE_STATS?.averageROI;
    return Number.isFinite(Number(fallbackROI)) ? Number(fallbackROI) : null;
  });

  const debouncedSearch = useDebouncedCallback(
    (value) => {
      setDebouncedQuery(value.trim().toLowerCase());
    },
    300,
    { leading: false, trailing: true },
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchChange = useCallback(
    (event) => {
      const value = event.target.value;
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const formatLastViewedLabel = useCallback(
    (id) => {
      const entry = attentionScores?.[id];
      if (!entry?.lastViewed) return null;
      try {
        return formatDistanceToNow(entry.lastViewed, { addSuffix: true });
      } catch (error) {
        return null;
      }
    },
    [attentionScores],
  );

  useEffect(() => {
    let isMounted = true;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;

    loadMarketplaceStats({ signal: controller?.signal })
      .then((stats) => {
        if (!isMounted) return;
        const roi = Number(stats?.averageROI);
        if (Number.isFinite(roi)) {
          setResolvedStatsROI(roi);
        }
      })
      .catch((error) => {
        if (controller?.signal?.aborted || !isMounted) {
          return;
        }
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to fetch marketplace stats", error);
        }
      });

    return () => {
      isMounted = false;
      controller?.abort?.();
    };
  }, []);

  useEffect(() => {
    return () => {
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
    let cancelled = false;
    let idleId;
    let timeoutId;

    const runWarmup = () => {
      if (cancelled) {
        return;
      }
      try {
        warmupWasm();
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to warm up WASM", error);
        }
      }
    };

    if (typeof window === "undefined") {
      runWarmup();
    } else if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(
        () => {
          idleId = undefined;
          runWarmup();
        },
        { timeout: 1200 },
      );
    } else {
      timeoutId = window.setTimeout(() => {
        timeoutId = undefined;
        runWarmup();
      }, 600);
    }

    const loadAutomations = async () => {
      try {
        setLoading(true);
        setError(null);
        const page = await fetchAutomations({ page: 1, limit: 20 });
        const list = Array.isArray(page?.items) ? page.items : [];
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

    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        if (idleId && typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        }
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      }
    };
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
    const handleMessage = () => {};
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
        attentionScore: attention?.score || 0,
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

  const filteredAutomations = useMemo(() => {
    if (!debouncedQuery) {
      return scoredAutomations;
    }

    const query = debouncedQuery.trim();
    if (!query) {
      return scoredAutomations;
    }

    return scoredAutomations.filter(({ item }) => {
      if (!item) return false;
      const fields = [
        item.name,
        item.description,
        item.category,
        item.vertical,
        ...(item.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return fields.includes(query);
    });
  }, [debouncedQuery, scoredAutomations]);

  const automationMap = useMemo(() => {
    return new Map(automations.map((item) => [item.id, item]));
  }, [automations]);

  const combinationHighlight = useMemo(() => {
    if (!scoredAutomations.length) return null;
    const topEntries = scoredAutomations.slice(0, 3);
    const label = activeNeed ? `${titleCase(activeNeed)} standouts` : "Top matching automations";
    return {
      title: label,
      description: activeNeed
        ? `Automations that excel for ${titleCase(activeNeed)} teams right now.`
        : "High-performing automations based on your live signals.",
      items: topEntries.map(({ item }) => item.name),
    };
  }, [scoredAutomations, activeNeed]);

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

  const recordBrowsingSignal = useCallback((item, updateState) => {
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
  }, []);

  const totalResults = scoredAutomations.length;
  const visibleResults = filteredAutomations.length;
  const searchActive = debouncedQuery.length > 0;
  const resultsLabel = searchActive
    ? `${visibleResults} of ${totalResults} automations match your search`
    : `${totalResults} automations ready for evaluation`;

  const buy = useCallback(async (item, trigger) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }

    if (!user) {
      openAuth("signup", { trigger: trigger instanceof HTMLElement ? trigger : undefined });
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
  }, [user, openAuth, recordBrowsingSignal]);

  const handleDemo = useCallback((item, trigger) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }
    if (trigger instanceof HTMLElement) {
      demoReturnFocusRef.current = trigger;
    } else if (typeof document !== "undefined") {
      const activeElement = document.activeElement;
      demoReturnFocusRef.current = isFocusableElement(activeElement ?? null)
        ? activeElement
        : null;
    } else {
      demoReturnFocusRef.current = null;
    }
    recordBrowsingSignal(item, setBrowsingSignals);
    setDemo(item);
  }, [recordBrowsingSignal]);

  const renderAutomationRow = useCallback(
    (entry, index) => {
      if (!entry) return null;

      const { item, matchStrength, industryMatch, browsingMatch, attentionBonus, attentionScore } = entry;
      if (!item) return null;

      const lastViewedLabel = item?.id ? formatLastViewedLabel(item.id) : null;

      return (
        <div role="listitem" className="marketplace-results__item">
          <AutomationCard
            item={item}
            activeNeed={activeNeed}
            matchStrength={matchStrength}
            industryMatch={industryMatch}
            browsingMatch={browsingMatch}
            attentionScore={attentionScore}
            predicted={Boolean(attentionBonus && attentionBonus > 0)}
            spotlighted={!searchActive && index < 2}
            onDemo={handleDemo}
            onBuy={buy}
            onDwell={handleAttentionDwell}
          />
          {lastViewedLabel ? (
            <span className="marketplace-results__meta">Last viewed {lastViewedLabel}</span>
          ) : null}
        </div>
      );
    },
    [
      activeNeed,
      buy,
      formatLastViewedLabel,
      handleAttentionDwell,
      handleDemo,
      searchActive,
    ],
  );
  
  const sectionHeader = (
    <div
      className="section-header"
      data-animate="fade-up"
      data-animate-context="story"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space("sm"),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: space("sm"),
          flexWrap: "wrap",
        }}
      >
        <div className="marketplace-entry__intro" data-animate="fade-up" data-animate-order="1">
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800 }}>
            Marketplace built for {detectedIndustry || "teams like yours"}
          </h2>
          <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
            Discover automations with narrative previews and instant calls-to-action so evaluating
            fit feels more like a guided tour than a scavenger hunt.
          </p>
          <div
            className="marketplace-entry__meta glass-card glass-card--subtle"
            data-animate="fade-up"
            data-animate-order="2"
            data-animate-cascade="0.08"
            data-animate-context="dashboard"
          >
            <div>
              <span>Top live match</span>
              <strong>{workerMetrics.topCategory?.category || "Adaptive orchestration"}</strong>
            </div>
            <div>
              <span>Spotlight stack</span>
              <strong>{activeCombination?.title || "Scanning"}</strong>
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
        <div data-animate="scale-in" data-animate-order="3" data-animate-context="panel">
          <ThemeToggle />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: space("xs", 1.5),
        }}
        data-animate="fade-up"
        data-animate-order="4"
        data-animate-cascade="0.05"
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
              className="marketplace-entry__tag glass-pill"
            >
              {tag}
            </span>
          ))}
      </div>

      <div
        className="marketplace-journey"
        aria-label="Marketplace journey highlights"
        data-animate="fade-up"
        data-animate-order="5"
        data-animate-context="story"
      >
        <header data-animate="fade-up" data-animate-order="0">
          <span className="marketplace-journey__eyebrow">
            <Icon name="target" size={18} aria-hidden="true" /> Marketplace Playbook
          </span>
          <p>See how each phase of the marketplace keeps momentum from hello to handoff.</p>
        </header>
        <div className="marketplace-journey__grid">
          {MARKETPLACE_JOURNEY.map(({ title, icon, steps }, index) => (
            <article
              key={title}
              className="marketplace-journey__card glass-card glass-card--subtle"
              data-animate="scale-in"
              data-animate-context="panel"
              data-animate-order={index + 1}
              data-animate-cascade="0.08"
            >
              <div className="marketplace-journey__card-header">
                <span aria-hidden="true" className="marketplace-journey__icon glass-pill">
                  <Icon name={icon} size={20} />
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
    </div>
  );

  if (loading) {
    return (
      <section className="marketplace" data-glass="true" data-animate-root style={{ padding: `${space("3xl")} 0` }}>
        <div className="container" style={{ display: "grid", gap: space("lg") }}>
          {sectionHeader}
          <div className="marketplace-placeholder glass-card glass-card--subtle">
            <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
            <p className="marketplace-placeholder__text">Loading automations…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && automations.length === 0) {
    return (
      <section className="marketplace" data-glass="true" data-animate-root style={{ padding: `${space("3xl")} 0` }}>
        <div className="container" style={{ display: "grid", gap: space("lg") }}>
          {sectionHeader}
          <div className="marketplace-error glass-card glass-card--danger">
            <div
              aria-hidden="true"
              style={{
                marginBottom: space("sm"),
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="alert" size={48} />
            </div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: space("xs") }}>Unable to Load Marketplace</h3>
            <p className="marketplace-error__description">
              We're having trouble loading the automation marketplace. Please check your connection and try again.
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              <span>Retry</span>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="marketplace" data-glass="true" data-animate-root style={{ padding: `${space("3xl")} 0` }}>
      <div className="container" style={{ display: "grid", gap: space("lg", 1.25) }}>
        {sectionHeader}

        {collaborationReady && (
          <div data-animate="blur-up" data-animate-context="story" data-animate-order="2">
            <MarketplaceCollaborationLayer
              focus={activeNeed ? titleCase(activeNeed) : null}
              channel={collaborationChannelRef.current}
              sessionId={sessionId}
            />
          </div>
        )}

        <div data-animate="scale-in" data-animate-context="dashboard" data-animate-order="3">
          <LivingSuccessMetrics
            industry={detectedIndustry}
            focus={activeNeed ? titleCase(activeNeed) : null}
            activeCombo={activeCombination}
          />
        </div>

        <div
          className="marketplace-results"
          data-animate="fade-up"
          data-animate-order="4"
          data-animate-context="dashboard"
        >
          <header className="marketplace-results__toolbar glass-card glass-card--subtle">
            <div>
              <h3 style={{ margin: 0 }}>Automation catalog</h3>
              <p className="marketplace-results__summary">{resultsLabel}</p>
            </div>
            <label className="marketplace-search">
              <span className="sr-only">Search automations</span>
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search automations, industries, or outcomes"
                autoComplete="off"
              />
            </label>
          </header>
          <VirtualizedAutomationList
            items={filteredAutomations}
            estimateSize={420}
            overscan={6}
            getKey={(entry) => entry?.item?.id ?? entry?.id}
            parentProps={{
              className: "marketplace-results__scroller",
              role: "list",
              "aria-label": "Marketplace automation results",
            }}
            renderItem={renderAutomationRow}
          />
          {visibleResults === 0 ? (
            <div className="marketplace-results__empty glass-card glass-card--subtle">
              <h4>No automations match "{searchQuery.trim()}"</h4>
              <p>Try a different keyword or explore the recommended needs above.</p>
            </div>
          ) : null}
        </div>

        {error && automations.length > 0 && (
          <div
            role="alert"
            data-animate="fade-up"
            data-animate-order="5"
            className="marketplace-alert glass-card glass-card--warning"
          >
            Some automations may not be displayed due to a connection issue.
          </div>
        )}

        <div className="marketplace-detected-message" data-animate="fade-up" data-animate-order="7">
          {activeNeed ? (
            <span>
              <strong>{titleCase(activeNeed)}</strong> automations surge to the front based on live
              signals.
            </span>
          ) : (
            <span>Automations adapt in real time to match your browsing signals.</span>
          )}
        </div>
        
      </div>

      {demo && (
        <Suspense fallback={<ModalShell label="Preparing automation preview" />}>
          <DemoModal
            automation={demo}
            user={user}
            onClose={() => setDemo(null)}
            returnFocusRef={demoReturnFocusRef}
          />
        </Suspense>
      )}
    </section>
  );
}