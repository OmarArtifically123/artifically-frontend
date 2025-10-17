const FALLBACK_FEATURE_HIGHLIGHTS = [
  {
    id: "live-demos",
    icon: "zap",
    title: "One-click live demos",
    description: "See automation running with your actual data (simulated)",
    status: "Immersive preview",
  },
  {
    id: "roi-calculator",
    icon: "barChart",
    title: "Interactive ROI calculator",
    description: "Drag sliders to see cost/benefit in real-time",
    status: "Dynamic projections",
  },
  {
    id: "workflow-visualization",
    icon: "brain",
    title: "3D workflow visualization",
    description: "See exactly how data flows through each step",
    status: "Spatial insight",
  },
  {
    id: "before-after",
    icon: "refresh",
    title: "Before/after scenarios",
    description: "Visual comparison of manual vs automated process",
    status: "Clarity mode",
  },
  {
    id: "demo-metrics",
    icon: "barChart",
    title: "Realistic projections",
    description:
      "Every demo surfaces live-looking KPIs tailored to your inputs",
    status: "Insightful",
  },
  {
    id: "safe-interaction",
    icon: "shield",
    title: "Safe sandbox interaction",
    description: "Experiment confidently with isolated, no-risk data streams",
    status: "Sandboxed",
  },
];

const FALLBACK_MARKETPLACE_STATS = {
  totalAutomations: 128,
  averageROI: 5.12,
  partners: 42,
};

let cachedFeatureData = null;
let cachedFeaturePromise = null;

const sanitizeFeature = (feature, index) => {
  if (!feature || typeof feature !== "object") {
    return FALLBACK_FEATURE_HIGHLIGHTS[index] || FALLBACK_FEATURE_HIGHLIGHTS[0];
  }

  return {
    id: String(feature.id || `feature-${index}`),
    icon: feature.icon || "sparkles",
    title: feature.title || "Powerful automation",
    description:
      feature.description ||
      "Unlock better ROI with guided automation workflows and smart insights.",
    status: feature.status || "Available",
  };
};

const sanitizeStats = (stats) => {
  if (!stats || typeof stats !== "object") {
    return { ...FALLBACK_MARKETPLACE_STATS };
  }

  const totalAutomations = Number(stats.totalAutomations);
  const averageROI = Number(stats.averageROI);
  const partners = Number(stats.partners);

  return {
    totalAutomations: Number.isFinite(totalAutomations)
      ? totalAutomations
      : FALLBACK_MARKETPLACE_STATS.totalAutomations,
    averageROI: Number.isFinite(averageROI)
      ? Number(averageROI.toFixed(2))
      : FALLBACK_MARKETPLACE_STATS.averageROI,
    partners: Number.isFinite(partners)
      ? partners
      : FALLBACK_MARKETPLACE_STATS.partners,
  };
};

const sanitizeFeatureData = (data) => {
  const features = Array.isArray(data?.features)
    ? data.features.map(sanitizeFeature)
    : FALLBACK_FEATURE_HIGHLIGHTS.map(sanitizeFeature);

  const stats = sanitizeStats(data?.stats || data?.marketplaceStats);

  return { features, stats };
};

const readBootstrappedFeatureData = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const payload = window.__FEATURE_DATA__;
  if (!payload) {
    return null;
  }

  try {
    const normalized = sanitizeFeatureData(payload);
    delete window.__FEATURE_DATA__;
    return normalized;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to hydrate bootstrapped feature data", error);
    }
    delete window.__FEATURE_DATA__;
    return null;
  }
};

const simulateAsync = (factory, { signal, delay = 0 } = {}) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Aborted"));
      return;
    }

    const complete = () => {
      try {
        resolve(factory());
      } catch (error) {
        reject(error);
      }
    };

    if (delay > 0) {
      const timeout = setTimeout(complete, delay);
      signal?.addEventListener?.("abort", () => {
        clearTimeout(timeout);
        reject(new Error("Aborted"));
      });
      return;
    }

    if (typeof queueMicrotask === "function") {
      queueMicrotask(complete);
      return;
    }

    Promise.resolve().then(complete);
  });

export const getFallbackFeatureData = () =>
  sanitizeFeatureData({
    features: FALLBACK_FEATURE_HIGHLIGHTS,
    stats: FALLBACK_MARKETPLACE_STATS,
  });

export const loadFeatureData = (options = {}) => {
  if (typeof window !== "undefined") {
    if (!cachedFeatureData) {
      cachedFeatureData = readBootstrappedFeatureData();
    }

    if (cachedFeatureData) {
      return Promise.resolve(cachedFeatureData);
    }
  }

  if (cachedFeatureData) {
    return Promise.resolve(cachedFeatureData);
  }

  if (cachedFeaturePromise) {
    return cachedFeaturePromise;
  }

  const factory = () => {
    const resolved = sanitizeFeatureData({
      features: FALLBACK_FEATURE_HIGHLIGHTS,
      stats: FALLBACK_MARKETPLACE_STATS,
    });

    if (typeof window !== "undefined") {
      cachedFeatureData = resolved;
    }

    return resolved;
  };

  if (typeof window === "undefined") {
    return Promise.resolve(factory());
  }

  cachedFeaturePromise = simulateAsync(factory, {
    signal: options.signal,
    delay: options.delay ?? 120,
  }).finally(() => {
    cachedFeaturePromise = null;
  });

  return cachedFeaturePromise;
};

export const loadMarketplaceStats = (options = {}) =>
  loadFeatureData(options).then((data) => data.stats);

export const primeFeatureData = (data) => {
  cachedFeatureData = sanitizeFeatureData(data);
};

export const resetFeatureDataCache = () => {
  cachedFeatureData = null;
  cachedFeaturePromise = null;
};

export {
  FALLBACK_FEATURE_HIGHLIGHTS,
  FALLBACK_MARKETPLACE_STATS,
};