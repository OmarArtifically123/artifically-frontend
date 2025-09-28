import { useEffect, useMemo, useState } from "react";
import { fetchAutomations } from "../data/automations";
import AutomationCard from "./AutomationCard";
import DemoModal from "./DemoModal";
import { toast } from "./Toast";
import api from "../api";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { warmupWasm, wasmAverage } from "../lib/wasmMath";

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

function computeMatchScore(item, detectedNeeds, activeNeed) {
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

  return score;
}

function computeClusterLabel(item, activeNeed) {
  if (activeNeed) {
    const normalizedNeed = normalize(activeNeed);
    const hasNeedTag = (item?.tags || []).some((tag) => normalize(tag).includes(normalizedNeed));
    if (hasNeedTag || normalize(item?.category).includes(normalizedNeed)) {
      return `Tailored for ${titleCase(activeNeed)}`;
    }
  }

  const baseLabel = item?.category || item?.vertical || (item?.tags?.[0] ?? "Universal");
  return `Cluster: ${titleCase(baseLabel)}`;
}

function createClusterDescription(label, activeNeed) {
  const lower = normalize(label);
  if (lower.startsWith("tailored")) {
    return activeNeed
      ? `Automations tuned to your ${titleCase(activeNeed)} focus with synchronized data flows.`
      : "Automations tuned to your current signals with synchronized data flows.";
  }

  const topic = label.split(":").slice(1).join(":").trim();
  return topic
    ? `${topic} specialists linked by glowing workflow connections.`
    : "Related automations collaborating through live workflow connections.";
}

export default function Marketplace({ user, openAuth }) {
  const { darkMode } = useTheme();
  const [demo, setDemo] = useState(null);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageROI, setAverageROI] = useState(null);
  const [detectedNeeds, setDetectedNeeds] = useState([]);
  const [activeNeed, setActiveNeed] = useState(null);
  const [layoutKey, setLayoutKey] = useState(0);

  useEffect(() => {
    warmupWasm();

    const loadAutomations = async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await fetchAutomations();
        if (!Array.isArray(list)) {
          throw new Error("Invalid data format received");
        }
        setAutomations(list);

        const roiValues = list.map((item) => Math.round((item.roi || 4.2) * 100));
        wasmAverage(roiValues)
          .then((avg) => setAverageROI(Number((avg / 100).toFixed(2))))
          .catch((err) => console.warn("Failed to compute ROI average", err));
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
    setLayoutKey((prev) => prev + 1);
  }, [activeNeed]);

  const scoredAutomations = useMemo(() => {
    if (!automations.length) return [];

    const entries = automations.map((item) => {
      const score = computeMatchScore(item, detectedNeeds, activeNeed);
      return { item, score };
    });

    const maxScore = entries.reduce((max, entry) => Math.max(max, entry.score), 1);

    return entries
      .map((entry) => ({
        ...entry,
        matchStrength: maxScore ? entry.score / maxScore : 0,
      }))
      .sort((a, b) => b.score - a.score);
  }, [automations, detectedNeeds, activeNeed]);

  const automationClusters = useMemo(() => {
    if (!scoredAutomations.length) return [];

    const groups = new Map();
    scoredAutomations.forEach(({ item, matchStrength }) => {
      const label = computeClusterLabel(item, activeNeed);
      if (!groups.has(label)) {
        groups.set(label, []);
      }
      groups.get(label).push({ item, matchStrength });
    });

    return Array.from(groups.entries()).map(([label, items], index) => ({
      id: `${label}-${index}`,
      label,
      description: createClusterDescription(label, activeNeed),
      items,
    }));
  }, [scoredAutomations, activeNeed]);

  const buy = async (item) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }

    if (!user) {
      openAuth("signup");
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
  };

  const handleDemo = (item) => {
    if (!item || !item.id) {
      toast("Invalid automation selected", { type: "error" });
      return;
    }
    setDemo(item);
  };

  const sectionHeader = (
    <div
      className="section-header"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Automation Marketplace</h2>
          <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
            Pick an automation, preview the workflow, and deploy with glassmorphism-rich previews.
          </p>
        </div>
        <ThemeToggle />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {[
          "Instant deployments",
          "Security reviews",
          "Theme-aware demos",
          averageROI ? `Avg ROI ${averageROI}x` : null,
        ]
          .filter(Boolean)
          .map((tag) => (
          <span
            key={tag}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "0.8rem",
              background: darkMode ? "rgba(148,163,184,0.18)" : "rgba(99,102,241,0.12)",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.32)" : "rgba(99,102,241,0.25)"}`,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: darkMode ? "#cbd5e1" : "#1f2937",
            }}
          >
            {tag}
          </span>
          ))}
      </div>
      {detectedNeeds.length > 0 && (
        <div className="marketplace-needs" role="group" aria-label="Dynamic automation filters">
          <div className="marketplace-needs__meta">
            <span>We think you're optimizing for</span>
            <strong>{activeNeed ? titleCase(activeNeed) : "blended impact"}</strong>
          </div>
          <div className="marketplace-needs__chips">
            {detectedNeeds.map((need) => {
              const isActive = normalize(need) === normalize(activeNeed);
              return (
                <button
                  type="button"
                  key={need}
                  className="marketplace-needs__chip"
                  data-active={isActive}
                  onClick={() => setActiveNeed(need)}
                >
                  <span>{need}</span>
                  <span className="marketplace-needs__glow" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <p className="marketplace-needs__hint">
            Automations reorganize themselves in real-time based on the signal you select.
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="marketplace" data-glass="true" style={{ padding: "5rem 0" }}>
        <div className="container" style={{ display: "grid", gap: "2rem" }}>
          {sectionHeader}
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
              background: darkMode
                ? "linear-gradient(145deg, rgba(15,23,42,0.75), rgba(30,41,59,0.82))"
                : "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.92))",
            }}
          >
            <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569", marginTop: "1rem" }}>Loading automations…</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && automations.length === 0) {
    return (
      <section className="marketplace" data-glass="true" style={{ padding: "5rem 0" }}>
        <div className="container" style={{ display: "grid", gap: "2rem" }}>
          {sectionHeader}
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(248,113,113,0.4)" : "rgba(248,113,113,0.5)"}`,
              background: darkMode
                ? "linear-gradient(145deg, rgba(127,29,29,0.45), rgba(15,23,42,0.85))"
                : "linear-gradient(145deg, rgba(254,226,226,0.95), rgba(254,242,242,0.9))",
              color: darkMode ? "#fecaca" : "#b91c1c",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Unable to Load Marketplace</h3>
            <p style={{ maxWidth: "420px", margin: "0 auto 1.5rem" }}>
              We're having trouble loading the automation marketplace. Please check your connection and try again.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="marketplace" data-glass="true" style={{ padding: "5rem 0" }}>
      <div className="container" style={{ display: "grid", gap: "2.5rem" }}>
        {sectionHeader}

        {error && automations.length > 0 && (
          <div
            role="alert"
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              border: `1px solid ${darkMode ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.5)"}`,
              background: darkMode ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.18)",
              color: darkMode ? "#fbbf24" : "#b45309",
              textAlign: "center",
            }}
          >
            Some automations may not be displayed due to a connection issue.
          </div>
        )}

        <div className="marketplace-detected-message">
          {activeNeed ? (
            <span>
              <strong>{titleCase(activeNeed)}</strong> automations surge to the front with live clustering.
            </span>
          ) : (
            <span>Showing the full automation constellation with live previews.</span>
          )}
        </div>

        {automationClusters.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤔</div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>No automations found</h3>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
              Check back soon—new automations are added every week.
            </p>
          </div>
        ) : (
          <div className="automation-clusters">
            {automationClusters.map((cluster) => (
              <div
                key={`${cluster.id}-${layoutKey}`}
                className="automation-cluster"
                data-highlight={normalize(cluster.label).startsWith("tailored")}
              >
                <div className="automation-cluster__halo" aria-hidden="true" />
                <div className="automation-cluster__links" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <header>
                  <h3>{cluster.label}</h3>
                  <p>{cluster.description}</p>
                </header>
                <div className="automation-cluster__grid">
                  {cluster.items.map(({ item, matchStrength }) => (
                    <AutomationCard
                      key={item.id}
                      item={item}
                      onDemo={handleDemo}
                      onBuy={buy}
                      activeNeed={activeNeed}
                      matchStrength={matchStrength}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {demo && <DemoModal automation={demo} onClose={() => setDemo(null)} />}
    </section>
  );
}