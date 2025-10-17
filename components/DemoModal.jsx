import { useEffect, useMemo, useState } from "react";
import api from "../src/api";
import { toast } from "./Toast";
import { useTheme } from "../context/ThemeContext";
import Button from "../src/components/ui/Button";
import { Icon } from "./icons";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatCurrency = (value, currency = "USD") => {
  if (!Number.isFinite(value)) {
    return "–";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value);
  } catch (err) {
    console.warn("Failed to format currency", err);
    return `$${value.toFixed(2)}`;
  }
};

const hashHue = (value) => {
  if (!value) return 210;
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
};

const buildWorkflow = (automation, coverage) => {
  const name = automation?.name || "Automation";
  const category = automation?.category || automation?.vertical || "workflow";
  const coverageLabel = `${Math.round(coverage)}% coverage`;

  const base = [
    {
      title: "Signal intake",
      detail: `${name} listens for new ${category.toLowerCase()} signals and prepares payloads instantly.`,
      metric: "Latency &lt;1.8s",
    },
    {
      title: "AI decisioning",
      detail: `Proprietary models score every event and orchestrate downstream actions with ${coverageLabel}.`,
      metric: "Confidence 96%",
    },
    {
      title: "Human-in-the-loop",
      detail: "Critical branches surface to analysts with generated summaries for fast approvals.",
      metric: "Escalations ↓ 72%",
    },
    {
      title: "Autonomous resolution",
      detail: `Closed-loop updates sync back to your systems so ${name} keeps learning automatically.`,
      metric: "Accuracy 99.2%",
    },
  ];

  return base;
};

const buildBeforeAfter = ({
  hoursPerMonth,
  hourlyRate,
  automationCoverage,
  subscription,
  monthlyVolume,
}) => {
  const manualCost = hoursPerMonth * hourlyRate;
  const automatedHours = hoursPerMonth * (1 - automationCoverage / 100);
  const automationLabor = automatedHours * hourlyRate;
  const totalAutomationCost = automationLabor + subscription;
  const savings = manualCost - totalAutomationCost;

  const manualCycle = monthlyVolume > 0 ? hoursPerMonth / monthlyVolume : 0;
  const automatedCycle = monthlyVolume > 0 ? automatedHours / monthlyVolume : 0;

  return {
    manual: {
      cost: manualCost,
      cycle: manualCycle,
      summary: "Manual teams juggle spreadsheets, approvals, and follow-ups by hand.",
    },
    automated: {
      cost: totalAutomationCost,
      cycle: automatedCycle,
      summary: "Automation handles repetitive work while humans focus on high-signal exceptions.",
    },
    savings,
  };
};

export default function DemoModal({ automation, user, onClose }) {
  const { darkMode } = useTheme();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const currency = automation?.currency || "USD";
  const fallbackPrice = 1299;
  const subscription = useMemo(() => {
    const price = Number(automation?.priceMonthly);
    return Number.isFinite(price) && price > 0 ? price : fallbackPrice;
  }, [automation?.priceMonthly]);

  const defaultHours = clamp(Number(automation?.estimatedHoursPerMonth) || 160, 40, 640);
  const defaultRate = clamp(Number(automation?.averageHandleCost) || 48, 20, 240);
  const [roiInputs, setRoiInputs] = useState({
    hoursPerMonth: defaultHours,
    hourlyRate: defaultRate,
    automationCoverage: 78,
  });

  const monthlyVolume = clamp(Number(automation?.monthlyVolume) || 1200, 200, 100000);

  const companyName = useMemo(() => {
    if (user?.businessName?.trim()) return user.businessName.trim();
    if (user?.email?.includes("@")) {
      return `${user.email.split("@")[0]} Inc.`;
    }
    return "Your Company";
  }, [user?.businessName, user?.email]);

  const companyInitials = useMemo(() => {
    return companyName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "YC";
  }, [companyName]);

  const companyHue = useMemo(() => hashHue(companyName + automation?.id), [companyName, automation?.id]);
  const companyAccent = `hsl(${companyHue}deg 92% ${darkMode ? 68 : 52}%)`;
  const companyAccentSoft = `hsla(${companyHue}deg, 88%, ${darkMode ? 32 : 72}%, 0.55)`;

  const workflow = useMemo(
    () => buildWorkflow(automation, roiInputs.automationCoverage),
    [automation, roiInputs.automationCoverage],
  );

  const beforeAfter = useMemo(
    () =>
      buildBeforeAfter({
        hoursPerMonth: roiInputs.hoursPerMonth,
        hourlyRate: roiInputs.hourlyRate,
        automationCoverage: roiInputs.automationCoverage,
        subscription,
        monthlyVolume,
      }),
    [roiInputs, subscription, monthlyVolume],
  );

  const automationHours = roiInputs.hoursPerMonth * (1 - roiInputs.automationCoverage / 100);
  const automationLaborCost = automationHours * roiInputs.hourlyRate;
  const automationCostTotal = automationLaborCost + subscription;
  const manualCost = roiInputs.hoursPerMonth * roiInputs.hourlyRate;
  const savings = beforeAfter.savings;
  const roiMultiple = automationCostTotal > 0 ? manualCost / automationCostTotal : 0;
  const paybackDays = savings > 0 ? Math.max(7, Math.round((subscription / savings) * 30)) : null;
  const projectedThroughput = Math.round(monthlyVolume * (roiInputs.automationCoverage / 100 + 0.18));
  const projectionConfidence = clamp(Math.round(roiInputs.automationCoverage + 18), 60, 99);

  const updateInput = (key) => (event) => {
    const value = Number(event.target.value);
    setRoiInputs((prev) => ({ ...prev, [key]: clamp(value, 0, 1000) }));
  };

  useEffect(() => {
    setRoiInputs({
      hoursPerMonth: clamp(Number(automation?.estimatedHoursPerMonth) || 160, 40, 640),
      hourlyRate: clamp(Number(automation?.averageHandleCost) || 48, 20, 240),
      automationCoverage: 78,
    });
    setActiveStage(0);
    setResult(null);
  }, [automation?.id]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("demo-experience-open");
    const frame = requestAnimationFrame(() => setIsVisible(true));

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("demo-experience-open");
    };
  }, [onClose]);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await api.post("/ai/demo", { automationId: automation.id });
      setResult(res.data);
    } catch (err) {
      const res = err?.response?.data;
      if (res?.errors?.length) {
        setResult({
          status: "error",
          output: res.errors.map((e) => `${e.field}: ${e.message}`).join(", "),
          logs: [],
        });
      } else {
        toast(res?.message || "Demo failed", { type: "error" });
      }
    } finally {
      setRunning(false);
    }
  };

  const statusColor = result?.status === "success"
    ? darkMode
      ? "#6ee7b7"
      : "#047857"
    : darkMode
      ? "#fca5a5"
      : "#b91c1c";

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="demo-experience"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-experience-title"
      onClick={handleOverlayClick}
    >
      <div
        className={`demo-experience__shell${isVisible ? " is-visible" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="demo-experience__header">
          <div className="demo-experience__identity">
            <span
              className="demo-experience__avatar"
              style={{
                background: `radial-gradient(circle at 25% 25%, ${companyAccent}, ${companyAccentSoft})`,
                color: darkMode ? "#0f172a" : "#f8fafc",
              }}
            >
              {companyInitials}
            </span>
            <div>
              <span className="demo-experience__eyebrow">{automation.icon} {automation.name} Demo</span>
              <h2 id="demo-experience-title">Immersive preview for {companyName}</h2>
            </div>
          </div>
          <button type="button" className="demo-experience__close" onClick={onClose} aria-label="Close demo">
            ×
          </button>
        </header>

        <div className="demo-experience__promises">
          <article>
            <h3>One-click live demos</h3>
            <p>See automation running with your actual data (simulated)</p>
          </article>
          <article>
            <h3>Interactive ROI calculator</h3>
            <p>Drag sliders to see cost/benefit in real-time</p>
          </article>
          <article>
            <h3>3D workflow visualization</h3>
            <p>See exactly how data flows through each step</p>
          </article>
          <article>
            <h3>Before/after scenarios</h3>
            <p>Visual comparison of manual vs automated process</p>
          </article>
        </div>

        <div className="demo-experience__content">
          <div className="demo-experience__main">
            <section className="demo-experience__workflow" aria-label="3D workflow visualization">
              <div className="demo-experience__workflow-scene">
                <div className="demo-experience__workflow-track">
                  {workflow.map((stage, index) => (
                    <button
                      type="button"
                      key={stage.title}
                      className="demo-experience__workflow-stage"
                      data-active={index === activeStage}
                      style={{
                        transitionDelay: `${index * 60}ms`,
                      }}
                      onMouseEnter={() => setActiveStage(index)}
                      onFocus={() => setActiveStage(index)}
                    >
                      <span className="demo-experience__stage-index">{index + 1}</span>
                      <span className="demo-experience__stage-title">{stage.title}</span>
                      <span className="demo-experience__stage-metric">{stage.metric}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="demo-experience__workflow-detail">
                <h4>{workflow[activeStage]?.title}</h4>
                <p>{workflow[activeStage]?.detail}</p>
              </div>
            </section>

            <section className="demo-experience__roi" aria-label="Interactive ROI calculator">
              <header>
                <h3>Interactive ROI calculator</h3>
                <span>Adjust assumptions to see live projections.</span>
              </header>
              <div className="demo-experience__sliders">
                <label>
                  <span>Team hours per month</span>
                  <input
                    type="range"
                    min="40"
                    max="640"
                    step="10"
                    value={roiInputs.hoursPerMonth}
                    onChange={updateInput("hoursPerMonth")}
                  />
                  <strong>{Math.round(roiInputs.hoursPerMonth)} hrs</strong>
                </label>
                <label>
                  <span>Average hourly cost</span>
                  <input
                    type="range"
                    min="20"
                    max="240"
                    step="5"
                    value={roiInputs.hourlyRate}
                    onChange={updateInput("hourlyRate")}
                  />
                  <strong>{formatCurrency(roiInputs.hourlyRate, currency)}/hr</strong>
                </label>
                <label>
                  <span>Automation coverage</span>
                  <input
                    type="range"
                    min="40"
                    max="95"
                    step="1"
                    value={roiInputs.automationCoverage}
                    onChange={updateInput("automationCoverage")}
                  />
                  <strong>{Math.round(roiInputs.automationCoverage)}%</strong>
                </label>
              </div>
              <div className="demo-experience__roi-results">
                <div>
                  <span>Projected monthly savings</span>
                  <strong>{formatCurrency(Math.max(0, savings), currency)}</strong>
                </div>
                <div>
                  <span>ROI multiple</span>
                  <strong>{roiMultiple > 0 ? `${roiMultiple.toFixed(2)}x` : "–"}</strong>
                </div>
                <div>
                  <span>Payback period</span>
                  <strong>{paybackDays ? `${paybackDays} days` : "Within first month"}</strong>
                </div>
                <div>
                  <span>Projected throughput</span>
                  <strong>{projectedThroughput.toLocaleString()} ops/mo</strong>
                </div>
              </div>
            </section>

            <section className="demo-experience__before-after" aria-label="Before and after comparison">
              <header>
                <h3>Before/after scenarios</h3>
                <span>Visual comparison of manual vs automated process</span>
              </header>
              <div className="demo-experience__comparison">
                <article>
                  <h4>Manual process</h4>
                  <p>{beforeAfter.manual.summary}</p>
                  <dl>
                    <div>
                      <dt>Monthly cost</dt>
                      <dd>{formatCurrency(beforeAfter.manual.cost, currency)}</dd>
                    </div>
                    <div>
                      <dt>Cycle time</dt>
                      <dd>{beforeAfter.manual.cycle ? `${beforeAfter.manual.cycle.toFixed(2)} hrs/ticket` : "Slow"}</dd>
                    </div>
                  </dl>
                </article>
                <article>
                  <h4>Automated with Artifically</h4>
                  <p>{beforeAfter.automated.summary}</p>
                  <dl>
                    <div>
                      <dt>Monthly cost</dt>
                      <dd>{formatCurrency(beforeAfter.automated.cost, currency)}</dd>
                    </div>
                    <div>
                      <dt>Cycle time</dt>
                      <dd>
                        {beforeAfter.automated.cycle
                          ? `${beforeAfter.automated.cycle.toFixed(2)} hrs/ticket`
                          : "Minutes"}
                      </dd>
                    </div>
                  </dl>
                </article>
              </div>
            </section>
          </div>

          <aside className="demo-experience__sidebar" aria-label="Live projections and controls">
            <div className="demo-experience__sidebar-card" style={{ borderColor: companyAccent }}>
              <header>
                <span>Realistic metrics and projections</span>
                <strong>{formatCurrency(subscription, currency)}/mo subscription</strong>
              </header>
              <ul>
                <li>
                  <span>Confidence</span>
                  <strong>{projectionConfidence}%</strong>
                </li>
                <li>
                  <span>Automation hours</span>
                  <strong>{Math.round(automationHours)} hrs</strong>
                </li>
                <li>
                  <span>Automation cost</span>
                  <strong>{formatCurrency(automationCostTotal, currency)}</strong>
                </li>
                <li>
                  <span>Manual baseline</span>
                  <strong>{formatCurrency(manualCost, currency)}</strong>
                </li>
              </ul>
            </div>

            <div className="demo-experience__cta">
              <Button type="button" size="lg" onClick={run} disabled={running} aria-live="polite">
                {running ? (
                  <span className="loading" style={{ width: "1.5rem", height: "1.5rem" }} />
                ) : (
                  <span>Run safe sandbox demo</span>
                )}
              </Button>
              <span>Sandboxed environment. Your production data never leaves the simulation.</span>
            </div>

            {result ? (
              <div className="demo-experience__result" data-status={result.status}>
                <header style={{ color: statusColor }}>
                  <strong
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    {result.status === "success" ? (
                      <>
                        <Icon name="check" size={20} aria-hidden="true" />
                        <span>Success</span>
                      </>
                    ) : (
                      <>
                        <Icon name="alert" size={20} aria-hidden="true" />
                        <span>Demo error</span>
                      </>
                    )}
                  </strong>
                  {result.cost && result.latency ? (
                    <span>
                      Cost: {result.cost} • Latency: {result.latency}
                    </span>
                  ) : null}
                </header>
                <pre>{result.output || "No output provided."}</pre>
                {result.logs?.length ? (
                  <div className="demo-experience__result-logs">
                    <h4>Execution logs</h4>
                    <ul>
                      {result.logs.map((log, index) => (
                        <li key={`${log.time}-${index}`}>
                          <span>[{log.time}]</span>
                          <span>{log.level}</span>
                          <span>{log.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="demo-experience__result" data-status="idle">
                <header>
                  <strong>Ready when you are</strong>
                  <span>Live run uses simulated payloads tailored to your inputs.</span>
                </header>
                <pre>{automation.description}</pre>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}