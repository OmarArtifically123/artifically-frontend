import { useMemo } from "react";

const EMPTY_METRICS = {
  deployments: 0,
  savings: 0,
  wins: 0,
};

export default function LivingSuccessMetrics({ industry, focus, activeCombo }) {
  const sparkline = useMemo(
    () => new Array(24).fill(null).map((_, index) => 36 + Math.sin(index / 2.1) * 6),
    [],
  );

  const summaries = useMemo(() => {
    const scope = industry ? `${industry} teams` : "Teams like yours";
    const focusLabel = focus ? focus.toLowerCase() : "automation";

    return {
      deployments:
        EMPTY_METRICS.deployments === 0
          ? "No deployments yet — launch your first automation to start the feed."
          : `${EMPTY_METRICS.deployments} companies deployed this automation last week`,
      savings:
        EMPTY_METRICS.savings === 0
          ? `${scope} will see real savings here once telemetry goes live.`
          : `${scope} are saving $${EMPTY_METRICS.savings.toLocaleString()} today`,
      wins:
        EMPTY_METRICS.wins === 0
          ? "Customer wins will appear as soon as outcomes start rolling in."
          : `${EMPTY_METRICS.wins} fresh customer wins just landed`,
      combo: activeCombo
        ? `The ${activeCombo.title} stack is ready with ${activeCombo.items.join(", ")}.`
        : `Preview ${focusLabel} automations now and telemetry activates automatically.`,
    };
  }, [industry, focus, activeCombo]);

  return (
    <section className="living-metrics" aria-live="polite">
      <header>
        <span>Marketplace telemetry</span>
        <h3>Success metrics go live after your first deployment</h3>
      </header>
      <div className="living-metrics__grid">
        <article>
          <strong>{summaries.deployments}</strong>
          <p>Telemetry is idle until an automation is deployed.</p>
        </article>
        <article>
          <strong>{summaries.savings}</strong>
          <p>Financial impact tracking boots up alongside your first workflow.</p>
          <div className="living-metrics__sparkline" aria-hidden="true">
            <svg viewBox="0 0 240 72" preserveAspectRatio="none">
              <polyline points={sparkline.map((value, index) => `${index * 10},${72 - value}`).join(" ")} />
            </svg>
          </div>
        </article>
        <article>
          <strong>Competitor data activates later</strong>
          <p>Comparative insights appear once verified customers are running this automation.</p>
        </article>
        <article>
          <strong>{summaries.wins}</strong>
          <p>Keep an eye here — live outcomes stream in the moment customers go live.</p>
        </article>
        <article className="living-metrics__highlight">
          <strong>{summaries.combo}</strong>
          <p>Plan your rollout today so these cards show the story you want to tell.</p>
        </article>
      </div>
    </section>
  );
}