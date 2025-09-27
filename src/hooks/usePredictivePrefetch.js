import { useEffect, useMemo, useRef } from "react";

const STORAGE_KEY = "__artifically_route_model_v1";

const requestIdle =
  typeof window !== "undefined" && window.requestIdleCallback
    ? window.requestIdleCallback
    : (cb) => window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1);

const cancelIdle =
  typeof window !== "undefined" && window.cancelIdleCallback
    ? window.cancelIdleCallback
    : window.clearTimeout;

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

    if (idleHandle.current) {
      cancelIdle(idleHandle.current);
    }

    idleHandle.current = requestIdle(() => {
      const entries = Object.entries(probabilityMap).filter(([path]) => loaders[path]);

      const scoredEntries = entries
        .map(([path, probability]) => {
          const interactionBoost = interactionCounts.current.get(path) || 0;
          const visitCount = model.visits[path] || 0;
          const decay = Math.exp(-Math.max(visitCount - 1, 0) * 0.05);
          const score = probability * 0.7 + interactionBoost * 0.2 + decay * 0.1;
          return { path, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      if (!scoredEntries.length) {
        const fallbackEntries = Array.from(counts.entries())
          .filter(([path]) => loaders[path] && path !== currentPathname)
          .map(([path, score]) => ({ path, score: score / 5 }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        scoredEntries.push(...fallbackEntries);
      }

      scoredEntries.forEach(({ path }) => {
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