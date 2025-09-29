import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_METRICS = {
  deployments: 47,
  savings: 2847,
  competitor: "TechCorp",
  wins: 6,
};

function randomize(base, variance) {
  const delta = (Math.random() - 0.5) * variance * 2;
  return Math.max(0, base + delta);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function LivingSuccessMetrics({
  industry,
  focus,
  activeCombo,
}) {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [sparkValues, setSparkValues] = useState(() =>
    new Array(24).fill(null).map((_, index) => 60 + index * 2),
  );
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return () => {};
    let frame;
    const update = () => {
      progressRef.current += 0.0025;
      const phase = Math.sin(progressRef.current * Math.PI * 2);
      setSparkValues((prev) => {
        const next = prev.slice(1);
        next.push(60 + Math.max(-8, Math.min(phase * 28, 32)) + Math.random() * 4);
        return next;
      });
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        deployments: Math.round(randomize(prev.deployments + 0.7, 3)),
        savings: Math.round(randomize(prev.savings + 22, 180)),
        competitor: prev.competitor,
        wins: Math.round(randomize(prev.wins + 0.2, 1.6)),
      }));
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const metricCopy = useMemo(() => {
    const scope = industry ? `${industry} teams` : "Teams like yours";
    const focusLabel = focus ? focus.toLowerCase() : "automation";
    return {
      deployments: `${metrics.deployments} companies deployed this automation last week`,
      savings: `${scope} are saving ${formatCurrency(metrics.savings)} today`,
      competitor: `Your competitor ${metrics.competitor} deployed this yesterday`,
      wins: `${metrics.wins} fresh customer wins just landed`,
      combo: activeCombo
        ? `The ${activeCombo.title} stack is trending with ${activeCombo.items.join(", ")}`
        : `${scope} are exploring new ${focusLabel} patterns right now`,
    };
  }, [metrics, industry, focus, activeCombo]);

  return (
    <section className="living-metrics" aria-live="polite">
      <header>
        <span>Living success metrics</span>
        <h3>Social proof that feels alive</h3>
      </header>
      <div className="living-metrics__grid">
        <article>
          <strong>{metricCopy.deployments}</strong>
          <p>Updated continuously from marketplace telemetry.</p>
        </article>
        <article>
          <strong>{metricCopy.savings}</strong>
          <p>Live value counter pulsing with collective savings.</p>
          <div className="living-metrics__sparkline" aria-hidden="true">
            <svg viewBox="0 0 240 72" preserveAspectRatio="none">
              <polyline
                points={sparkValues.map((value, index) => `${index * 10},${72 - value}`).join(" ")}
              />
            </svg>
          </div>
        </article>
        <article>
          <strong>{metricCopy.competitor}</strong>
          <p>Industry intelligence surfaces the moment you wonder if it works.</p>
        </article>
        <article>
          <strong>{metricCopy.wins}</strong>
          <p>Success stories refresh the instant new outcomes arrive.</p>
        </article>
        <article className="living-metrics__highlight">
          <strong>{metricCopy.combo}</strong>
          <p>Marketplace anticipates combinations before you reach for them.</p>
        </article>
      </div>
    </section>
  );
}