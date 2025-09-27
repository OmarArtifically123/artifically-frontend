import { useEffect, useMemo, useRef } from "react";

const requestIdle =
  typeof window !== "undefined" && window.requestIdleCallback
    ? window.requestIdleCallback
    : (cb) => window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1);

const cancelIdle =
  typeof window !== "undefined" && window.cancelIdleCallback
    ? window.cancelIdleCallback
    : window.clearTimeout;

export default function usePredictivePrefetch(routeLoaders, currentPathname) {
  const interactionCounts = useRef(new Map());
  const idleHandle = useRef(null);

  const loaders = useMemo(() => routeLoaders || {}, [routeLoaders]);

  useEffect(() => {
    const counts = interactionCounts.current;
    const currentCount = counts.get(currentPathname) || 0;
    counts.set(currentPathname, currentCount + 0.5);

    idleHandle.current = requestIdle(() => {
      const entries = Array.from(counts.entries()).filter(([path]) => loaders[path]);
      entries.sort(([, a], [, b]) => b - a);
      const nextTargets = entries.slice(0, 3).map(([path]) => path);

      nextTargets.forEach((path) => {
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
    const handler = (event) => {
      const route = event.target?.getAttribute?.("data-prefetch-route");
      if (route && loaders[route]) {
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
  }, [loaders]);

  return {
    prefetch: (path) => loaders[path]?.(),
  };
}