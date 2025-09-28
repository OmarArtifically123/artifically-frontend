import { useEffect, useMemo, useRef } from "react";

const STORAGE_KEY = "__artifically_route_model_v1";
const HISTORY_KEY = "route-history";

const requestIdle =
  typeof window !== "undefined" && typeof window.requestIdleCallback === "function"
    ? (cb) => window.requestIdleCallback(cb)
    : (cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1);

const cancelIdle =
  typeof window !== "undefined" && typeof window.cancelIdleCallback === "function"
    ? (id) => window.cancelIdleCallback(id)
    : (id) => clearTimeout(id);

    const loadHistory = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to load route history", error);
    return [];
  }
};

const calculateHistoryWeights = (history, currentPathname) => {
  if (!Array.isArray(history) || !history.length) return {};

  const now = Date.now();
  const weights = history.reduce((acc, entry, index) => {
    if (!entry || typeof entry.path !== "string" || entry.path === currentPathname) {
      return acc;
    }

    const age = Math.max(now - (entry.ts || 0), 0);
    const recency = Math.exp(-age / (1000 * 60 * 10)); // decay over ~10 minutes
    const positionWeight = 1 / Math.pow(index + 1, 1.2);
    const weight = recency * positionWeight;

    acc[entry.path] = (acc[entry.path] || 0) + weight;
    return acc;
  }, {});

  return normalise(weights);
};

const loadModel = () => {
  if (typeof window === "undefined") return { transitions: {}, visits: {} };
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { transitions: {}, visits: {} };
    const parsed = JSON.parse(stored);
    if (typeof parsed !== "object" || !parsed) {
      return { transitions: {}, visits: {} };
    }
    return {
      transitions: parsed.transitions || {},
      visits: parsed.visits || {},
    };
  } catch (error) {
    console.warn("Failed to load predictive model", error);
    return { transitions: {}, visits: {} };
  }
};

const persistModel = (model) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        transitions: model.transitions,
        visits: model.visits,
      })
    );
  } catch (error) {
    console.warn("Failed to persist predictive model", error);
  }
};

const normalise = (weights) => {
  const entries = Object.entries(weights || {});
  if (!entries.length) return {};
  const total = entries.reduce((acc, [, value]) => acc + value, 0);
  if (!total) return {};
  return entries.reduce((acc, [key, value]) => {
    acc[key] = value / total;
    return acc;
  }, {});
};

export default function usePredictivePrefetch(routeLoaders, currentPathname) {
  const interactionCounts = useRef(new Map());
  const idleHandle = useRef(null);
  const modelRef = useRef(loadModel());
  const previousRouteRef = useRef(currentPathname);
  const persistIdleHandle = useRef(null);

  const loaders = useMemo(() => routeLoaders || {}, [routeLoaders]);

  useEffect(() => {
    previousRouteRef.current = currentPathname;
  }, []);

  useEffect(() => {
    const counts = interactionCounts.current;
    const model = modelRef.current;
    const prev = previousRouteRef.current;

    if (prev && prev !== currentPathname) {
      const transitions = model.transitions[prev] || {};
      transitions[currentPathname] = (transitions[currentPathname] || 0) + 1;
      model.transitions[prev] = transitions;
    }

    model.visits[currentPathname] = (model.visits[currentPathname] || 0) + 1;
    previousRouteRef.current = currentPathname;

    if (persistIdleHandle.current) {
      cancelIdle(persistIdleHandle.current);
    }
    persistIdleHandle.current = requestIdle(() => persistModel(model));

    const currentCount = counts.get(currentPathname) || 0;
    counts.set(currentPathname, currentCount + 0.5);

    const probabilityMap = normalise(model.transitions[currentPathname] || {});
    const history = loadHistory();
    const historyMap = calculateHistoryWeights(history, currentPathname);

    const candidatePaths = new Set(
      Object.keys(probabilityMap).filter((path) => loaders[path])
    );
    Object.keys(historyMap)
      .filter((path) => loaders[path])
      .forEach((path) => candidatePaths.add(path));

    if (idleHandle.current) {
      cancelIdle(idleHandle.current);
    }

    idleHandle.current = requestIdle(() => {
      const scoredEntries = Array.from(candidatePaths)
        .map((path) => {
          const probability = probabilityMap[path] || 0;
          const interactionBoost = interactionCounts.current.get(path) || 0;
          const historyBoost = historyMap[path] || 0;
          const visitCount = model.visits[path] || 0;
          const decay = Math.exp(-Math.max(visitCount - 1, 0) * 0.05);
          const score =
            probability * 0.55 +
            interactionBoost * 0.2 +
            historyBoost * 0.2 +
            decay * 0.05;
          return { path, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      if (!scoredEntries.length) {
        const fallbackEntries = Array.from(counts.entries())
          .filter(([path]) => loaders[path] && path !== currentPathname)
          .map(([path, score]) => ({ path, score: score / 5 }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        const historyFallback = Object.entries(historyMap)
          .filter(([path]) => loaders[path] && path !== currentPathname)
          .map(([path, score]) => ({ path, score }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);

        const seen = new Set();
        const combined = [...fallbackEntries, ...historyFallback].filter(({ path }) => {
          if (seen.has(path)) return false;
          seen.add(path);
          return true;
        });

        scoredEntries.push(...combined);
      }

      const prefetched = new Set();
      scoredEntries.forEach(({ path }) => {
        if (prefetched.has(path)) return;
        prefetched.add(path);
        try {
          loaders[path]?.();
        } catch (error) {
          console.warn("Prefetch failed", path, error);
        }
      });
    });

    return () => {
      if (idleHandle.current) {
        cancelIdle(idleHandle.current);
      }
    };
  }, [currentPathname, loaders]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const handler = (event) => {
      const route = event.target?.getAttribute?.("data-prefetch-route");
      if (route && loaders[route]) {
        const model = modelRef.current;
        const transitions = model.transitions[currentPathname] || {};
        transitions[route] = (transitions[route] || 0) + 0.35;
        model.transitions[currentPathname] = transitions;

        interactionCounts.current.set(route, (interactionCounts.current.get(route) || 0) + 1.5);
        requestIdle(() => loaders[route]());
      }
    };

    document.addEventListener("pointerenter", handler, { passive: true, capture: true });
    document.addEventListener("focusin", handler, { passive: true, capture: true });

    return () => {
      document.removeEventListener("pointerenter", handler, { capture: true });
      document.removeEventListener("focusin", handler, { capture: true });
    };
  }, [currentPathname, loaders]);

  return {
    prefetch: (path) => loaders[path]?.(),
  };
}