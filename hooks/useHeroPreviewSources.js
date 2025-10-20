import { useEffect, useState } from "react";

import { HERO_PREVIEW_HIGH_QUALITY, HERO_PREVIEW_OPTIMIZED } from "../components/landing/heroPreviewAssets";

const HIGH_QUALITY_SOURCES = {
  ...HERO_PREVIEW_HIGH_QUALITY,
};

const OPTIMIZED_SOURCES = {
  ...HERO_PREVIEW_OPTIMIZED,
};

export default function useHeroPreviewSources() {
  const [sources, setSources] = useState(() => ({ ...OPTIMIZED_SOURCES }));

  useEffect(() => {
    if (typeof navigator === "undefined") {
      setSources(OPTIMIZED_SOURCES);
      return () => {};
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const updateSources = () => {
      if (connection && connection.effectiveType === "4g") {
        // Load high-quality assets
        setSources({ ...HIGH_QUALITY_SOURCES });
      } else {
        // Load optimized assets
        setSources({ ...OPTIMIZED_SOURCES });
      }
    };

    updateSources();

    if (!connection) {
      return () => {};
    }

    if (typeof connection.addEventListener === "function") {
      connection.addEventListener("change", updateSources);
      return () => connection.removeEventListener("change", updateSources);
    }

    connection.onchange = updateSources;
    return () => {
      connection.onchange = null;
    };
  }, []);

  return sources;
}