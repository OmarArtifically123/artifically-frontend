import { useEffect, useMemo, useRef, useState } from "react";
import { getNetworkInformation, prefersLowPower } from "../utils/networkPreferences";

const STORAGE_KEY = "__artifically_route_model_v1";
const HISTORY_KEY = "route-history";

const supportsScheduler =
  typeof window !== "undefined" &&
  typeof window.scheduler !== "undefined" &&
  typeof window.scheduler.postTask === "function";

const scheduleIdleTask = (callback, { priority = "background" } = {}) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const run = () => {
    callback();
  };

if (supportsScheduler) {
    const controller = new AbortController();
    window.scheduler.postTask(run, {
      priority,
      delay: 0,
      signal: controller.signal,
    });
    return () => controller.abort();
  }

    if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(run, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }

  const timeoutId = window.setTimeout(run, 1);
  return () => window.clearTimeout(timeoutId);
};

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
  const idleCancel = useRef(null);
  const modelRef = useRef(loadModel());
  const previousRouteRef = useRef(currentPathname);
  const persistIdleCancel = useRef(null);
  const prefetchedRoutesRef = useRef(new Set());
  const [hasUserEngaged, setHasUserEngaged] = useState(false);
  const [connectionConstrained, setConnectionConstrained] = useState(() => prefersLowPower());

  const loaders = useMemo(() => routeLoaders || {}, [routeLoaders]);

  useEffect(() => {
    previousRouteRef.current = currentPathname;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const markEngaged = () => {
      setHasUserEngaged(true);
    };

    window.addEventListener("pointermove", markEngaged, { once: true, passive: true });
    window.addEventListener("keydown", markEngaged, { once: true });
    window.addEventListener("touchstart", markEngaged, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointermove", markEngaged);
      window.removeEventListener("keydown", markEngaged);
      window.removeEventListener("touchstart", markEngaged);
    };
  }, []);

  useEffect(() => {
    const connection = getNetworkInformation();
    if (!connection) {
      setConnectionConstrained(false);
      return undefined;
    }

    const updateConstraint = () => setConnectionConstrained(prefersLowPower(connection));
    updateConstraint();

    if (typeof connection.addEventListener === "function") {
      connection.addEventListener("change", updateConstraint);
      return () => connection.removeEventListener("change", updateConstraint);
    }

    connection.onchange = updateConstraint;
    return () => {
      connection.onchange = null;
    };
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

    if (persistIdleCancel.current) {
      persistIdleCancel.current();
    }
    persistIdleCancel.current = scheduleIdleTask(() => persistModel(model));

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

    const schedulePrefetch = () => {
      const ranked = Array.from(candidatePaths)
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
        .sort((a, b) => b.score - a.score);

      if (!ranked.length) {
        const fallbackEntries = Array.from(counts.entries())
          .filter(([path]) => loaders[path] && path !== currentPathname)
          .map(([path, score]) => ({ path, score: score / 5 }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);

        const historyFallback = Object.entries(historyMap)
          .filter(([path]) => loaders[path] && path !== currentPathname)
          .map(([path, score]) => ({ path, score }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 2);

        const seenFallback = new Set();
        const combined = [...fallbackEntries, ...historyFallback].filter(({ path }) => {
          if (seenFallback.has(path)) return false;
          seenFallback.add(path);
          return true;
        });

        ranked.push(...combined);
      }

      const visibleRoutes = new Set();
      if (typeof document !== "undefined" && typeof window !== "undefined") {
        const viewportHeight = window.innerHeight || 0;
        const viewportWidth = window.innerWidth || 0;
        document.querySelectorAll("[data-prefetch-route]").forEach((element) => {
          const route = element.getAttribute("data-prefetch-route");
          if (!route) return;
          const rect = element.getBoundingClientRect();
          const inViewport =
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < viewportWidth &&
            rect.top < viewportHeight;
          if (inViewport) {
            visibleRoutes.add(route);
          }
        });
      }

      const prioritised = [];
      const seen = new Set();
      const pushEntries = (entries, requireVisibility) => {
        entries.forEach((entry) => {
          if (seen.has(entry.path)) return;
          if (requireVisibility && visibleRoutes.size && !visibleRoutes.has(entry.path)) {
            return;
          }
          seen.add(entry.path);
          prioritised.push(entry);
        });
      };

      pushEntries(ranked, true);

      if (!prioritised.length) {
        pushEntries(ranked, false);
      }

      if (!visibleRoutes.size) {
        return;
      }

      const limited = prioritised.slice(0, 2);
      limited.forEach(({ path }) => {
        if (prefetchedRoutesRef.current.has(path)) {
          return;
        }
        if (!loaders[path]) {
          return;
        }

        prefetchedRoutesRef.current.add(path);
        try {
          loaders[path]?.();
        } catch (error) {
          console.warn("Prefetch failed", path, error);
        }
      });
    };

    if (idleCancel.current) {
      idleCancel.current();
    }

    if (!hasUserEngaged || connectionConstrained) {
      return () => {
        if (idleCancel.current) {
          idleCancel.current();
        }
      };
    }

    idleCancel.current = scheduleIdleTask(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      schedulePrefetch();
    });

    return () => {
      if (idleCancel.current) {
        idleCancel.current();
        idleCancel.current = null;
      }
      if (persistIdleCancel.current) {
        persistIdleCancel.current();
        persistIdleCancel.current = null;
      }
    };
  }, [connectionConstrained, currentPathname, hasUserEngaged, loaders]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const handler = (event) => {
      const route = event.target?.getAttribute?.("data-prefetch-route");
      if (!route || !loaders[route]) {
        return;
      }

      if (connectionConstrained) {
        return;
      }

      if (!hasUserEngaged) {
        setHasUserEngaged(true);
      }

      const model = modelRef.current;
      const transitions = model.transitions[currentPathname] || {};
      transitions[route] = (transitions[route] || 0) + 0.35;
      model.transitions[currentPathname] = transitions;

      interactionCounts.current.set(route, (interactionCounts.current.get(route) || 0) + 1.5);
      if (prefetchedRoutesRef.current.has(route)) {
        return;
      }

      prefetchedRoutesRef.current.add(route);
      scheduleIdleTask(() => loaders[route]?.());
    };

    document.addEventListener("pointerenter", handler, { passive: true, capture: true });
    document.addEventListener("focusin", handler, { passive: true, capture: true });

    return () => {
      document.removeEventListener("pointerenter", handler, { capture: true });
      document.removeEventListener("focusin", handler, { capture: true });
    };
  }, [connectionConstrained, currentPathname, hasUserEngaged, loaders]);

  return {
    prefetch: (path) => loaders[path]?.(),
  };
}