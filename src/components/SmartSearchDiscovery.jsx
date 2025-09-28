import { useEffect, useMemo, useRef, useState } from "react";
import { integrationCombos, onboardingPlaybooks } from "../data/smartSearchCatalog";

const STORAGE_KEY = "artifically-smart-search-profile";
const DEFAULT_PROFILE = {
  history: [],
  usage: {},
  companySize: "Mid-market",
  industry: "SaaS",
};

const COMPANY_SIZE_OPTIONS = ["Startup", "Mid-market", "Enterprise"];
const INDUSTRY_OPTIONS = ["SaaS", "B2B Services", "E-commerce", "Financial Services", "Manufacturing", "DevTools", "Fintech"];
const DISCOVERY_HIGHLIGHTS = [
  {
    id: "recommendations",
    label: "Smart recommendations",
    description: "\"Companies like yours typically start with these 3\"",
  },
  {
    id: "filtering",
    label: "Industry-aware filtering",
    description: "Automatically highlight automations for your business type",
  },
  {
    id: "pattern-matching",
    label: "Success pattern matching",
    description: "\"Teams similar to yours see 4.2x ROI with this combination\"",
  },
  {
    id: "sorting",
    label: "Intelligent sorting",
    description: "Most relevant automations float to the top automatically",
  },
];

const MARKETPLACE_INTELLIGENCE = [
  "Detects your industry from email domain and adapts",
  "Learns from your browsing patterns and rearranges",
  "Shows peer success stories from similar companies",
  "Highlights automation combinations that work well together",
];

function buildComboIndex() {
  const map = new Map();
  integrationCombos.forEach(combo => {
    map.set(combo.id, combo);
  });
  return map;
}

function deriveDetectedSignals(history, comboIndex) {
  if (!history.length) {
    return null;
  }

  const sizeCounts = new Map();
  const industryCounts = new Map();

  history.forEach(entry => {
    const combo = comboIndex.get(entry.resultId);
    if (!combo) return;

    combo.companySizes.forEach(size => {
      sizeCounts.set(size, (sizeCounts.get(size) || 0) + 1);
    });

    combo.industries.forEach(industry => {
      industryCounts.set(industry, (industryCounts.get(industry) || 0) + 1);
    });
  });

  const topSize = [...sizeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const topIndustry = [...industryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  if (!topSize && !topIndustry) {
    return null;
  }

  return {
    companySize: topSize,
    industry: topIndustry,
    confidence: Math.min(1, history.length / 5),
  };
}

function computeBaseMatches(tokens) {
  if (!tokens.length) {
    return integrationCombos.map(combo => combo.id);
  }

  const matches = [];

  integrationCombos.forEach(combo => {
    let score = 0;
    const haystack = [
      combo.name,
      combo.description,
      combo.integrations.join(" "),
      combo.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    tokens.forEach(token => {
      if (combo.name.toLowerCase().includes(token)) {
        score += 5;
      }
      if (combo.integrations.some(integration => integration.toLowerCase().includes(token))) {
        score += 4;
      }
      if (combo.tags.some(tag => tag.toLowerCase().includes(token))) {
        score += 3;
      }
      if (haystack.includes(token)) {
        score += 2;
      }
    });

    if (score > 0) {
      matches.push({ id: combo.id, score });
    }
  });

  matches.sort((a, b) => b.score - a.score);
  return matches.map(match => match.id);
}

function rankMatches(ids, profile, comboIndex) {
  const usage = profile.usage || {};
  return ids
    .map((id, index) => {
      const combo = comboIndex.get(id);
      if (!combo) return null;

      const baseScore = ids.length - index;
      const usageBoost = usage[id] ? Math.log2(usage[id] + 1) * 2 : 0;
      const sizeBoost = combo.companySizes.includes(profile.companySize) ? 1.5 : 0;
      const industryBoost = combo.industries.includes(profile.industry) ? 1.5 : 0;

      return {
        combo,
        score: baseScore + usageBoost + sizeBoost + industryBoost,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map(item => item.combo);
}

function deriveAutoComplete(query, profile) {
  const normalized = query.trim().toLowerCase();
  const combos = [...integrationCombos];

  if (!normalized) {
    combos.sort((a, b) => (profile.usage?.[b.id] || 0) - (profile.usage?.[a.id] || 0));
    return combos.slice(0, 5);
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  return combos
    .map(combo => {
      const haystack = [
        combo.name,
        combo.integrations.join(" "),
        combo.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const matched = tokens.every(token => haystack.includes(token));
      return matched ? combo : null;
    })
    .filter(Boolean)
    .slice(0, 6);
}

function deriveQuickActions(profile) {
  const combosByUsage = [...integrationCombos].sort(
    (a, b) => (profile.usage?.[b.id] || 0) - (profile.usage?.[a.id] || 0)
  );

  const seen = new Set();
  const actions = [];

  combosByUsage.forEach(combo => {
    combo.quickActions.forEach(action => {
      const key = `${combo.id}-${action.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      actions.push({
        ...action,
        source: combo.name,
        comboId: combo.id,
      });
    });
  });

  if (!actions.length) {
    return integrationCombos
      .flatMap(combo =>
        combo.quickActions.map(action => ({
          ...action,
          source: combo.name,
          comboId: combo.id,
        }))
      )
      .slice(0, 5);
  }

  return actions.slice(0, 5);
}

function getOnboardingPlaybook(profile) {
  const match = onboardingPlaybooks.find(
    playbook =>
      playbook.companySize === profile.companySize &&
      playbook.industries.includes(profile.industry)
  );

  if (match) return match;

  return (
    onboardingPlaybooks.find(playbook => playbook.companySize === profile.companySize) ||
    onboardingPlaybooks[0]
  );
}

export default function SmartSearchDiscovery() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [resultSource, setResultSource] = useState(null);
  const [activeResultId, setActiveResultId] = useState(null);
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const cacheRef = useRef(new Map());
  const comboIndex = useMemo(() => buildComboIndex(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn("Failed to parse stored search profile", error);
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!storageLoaded || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, storageLoaded]);

  const detectedSignals = useMemo(
    () => deriveDetectedSignals(profile.history, comboIndex),
    [profile.history, comboIndex]
  );

  const autoComplete = useMemo(() => deriveAutoComplete(query, profile), [query, profile]);
  const quickActions = useMemo(() => deriveQuickActions(profile), [profile]);
  const playbook = useMemo(() => getOnboardingPlaybook(profile), [profile]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setResultSource(null);
      return;
    }

    const normalized = query.trim().toLowerCase();
    const tokens = normalized.split(/\s+/).filter(Boolean);

    if (cacheRef.current.has(normalized)) {
      const cached = cacheRef.current.get(normalized);
      const ranked = rankMatches(cached.ids, profile, comboIndex);
      setResults(ranked);
      setResultSource("cache");
      return;
    }

    const ids = computeBaseMatches(tokens);
    cacheRef.current.set(normalized, { ids, timestamp: Date.now() });
    const ranked = rankMatches(ids, profile, comboIndex);
    setResults(ranked);
    setResultSource("fresh");
  }, [query, profile, comboIndex]);

  useEffect(() => {
    setGuidedStepIndex(0);
  }, [playbook.id]);

  function handleResultSelect(result, overrideQuery) {
    setActiveResultId(result.id);
    const nextQuery = overrideQuery || query || result.name;
    setQuery(nextQuery);

    setProfile(prev => {
      const nextHistory = [
        { resultId: result.id, query: nextQuery, timestamp: Date.now() },
        ...prev.history,
      ].slice(0, 12);
      const usage = { ...prev.usage, [result.id]: (prev.usage?.[result.id] || 0) + 1 };
      return {
        ...prev,
        history: nextHistory,
        usage,
      };
    });
  }

  function handleAutoCompleteSelect(combo) {
    setQuery(combo.integrations.join(" + "));
    handleResultSelect(combo, combo.integrations.join(" + "));
  }

  function handleQuickActionClick(action) {
    const related = comboIndex.get(action.comboId);
    if (related) {
      handleResultSelect(related, action.relatedQuery || related.name);
    }
  }

  function applyDetectedSignals() {
    if (!detectedSignals) return;
    setProfile(prev => ({
      ...prev,
      companySize: detectedSignals.companySize || prev.companySize,
      industry: detectedSignals.industry || prev.industry,
    }));
  }

  const historyChips = useMemo(() => profile.history.slice(0, 6), [profile.history]);

  function handleHistoryChipClick(entry) {
    const combo = comboIndex.get(entry.resultId);
    if (combo) {
      setQuery(entry.query);
      handleResultSelect(combo, entry.query);
    }
  }

  function handleProfileChange(field, value) {
    setProfile(prev => ({ ...prev, [field]: value }));
  }

  const onboardingSteps = playbook.steps || [];
  const spotlightAutomations = playbook.spotlightAutomations || [];

  return (
    <section
      aria-label="Smart search and discovery"
      style={{
        padding: "5rem 0",
        background: "linear-gradient(160deg, rgba(15,23,42,0.03), rgba(99,102,241,0.04))",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gap: "2.5rem",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "760px",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#6366f1",
              textTransform: "uppercase",
            }}
          >
            Contextual Intelligence Discovery
          </span>
          <h2
            style={{
              fontSize: "clamp(2.1rem, 4vw, 2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Replace generic browsing with adaptive automation paths
          </h2>
          <p
            style={{
              color: "#475569",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: "700px",
            }}
          >
            Every search learns from your context—industry signals, team behavior, and ROI wins—to suggest the right
            automations before you ask. The result is a discovery experience that feels curated for your business instead of a
            static catalog.
          </p>
          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              padding: "1.5rem",
              background: "rgba(255,255,255,0.72)",
              borderRadius: "1.25rem",
              border: "1px solid rgba(99,102,241,0.15)",
              boxShadow: "0 18px 35px rgba(99,102,241,0.12)",
            }}
          >
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#312e81", textTransform: "uppercase" }}>
                Replace generic browsing with:
              </span>
              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                {DISCOVERY_HIGHLIGHTS.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gap: "0.25rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.95rem",
                      border: "1px solid rgba(79,70,229,0.18)",
                      background: "rgba(79,70,229,0.08)",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#1e1b4b", fontSize: "0.95rem" }}>{item.label}</span>
                    <span style={{ color: "#4338ca", fontSize: "0.9rem", lineHeight: 1.5 }}>{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase" }}>
                Smart features:
              </span>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: "0.65rem",
                }}
              >
                {MARKETPLACE_INTELLIGENCE.map(item => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.6rem",
                      fontSize: "0.9rem",
                      color: "#1e293b",
                      lineHeight: 1.6,
                    }}
                  >
                    <span aria-hidden="true" style={{ color: "#6366f1", fontWeight: 700 }}>
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gap: "1.75rem",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              background: "rgba(255,255,255,0.92)",
              borderRadius: "1.5rem",
              padding: "2rem",
              border: "1px solid rgba(148,163,184,0.25)",
              boxShadow: "0 25px 45px rgba(15,23,42,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <label htmlFor="smart-search" style={{ fontWeight: 600, color: "#1e293b" }}>
                Context-aware search
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <input
                  id="smart-search"
                  type="search"
                  placeholder="Search automations, integrations, or outcomes"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.9rem 1.1rem",
                    borderRadius: "0.9rem",
                    border: "1px solid rgba(148,163,184,0.35)",
                    fontSize: "1rem",
                    background: "rgba(248,250,252,0.9)",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: resultSource === "cache" ? "#059669" : resultSource ? "#6366f1" : "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  {resultSource === "cache"
                    ? "Cached insight"
                    : resultSource === "fresh"
                    ? "Fresh results"
                    : "Type to explore"}
                </span>
              </div>
              {autoComplete.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Automation suggestions"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {autoComplete.map(combo => (
                    <button
                      key={combo.id}
                      type="button"
                      onClick={() => handleAutoCompleteSelect(combo)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.55rem 0.85rem",
                        borderRadius: "999px",
                        border: "1px solid rgba(99,102,241,0.35)",
                        background: "rgba(99,102,241,0.08)",
                        color: "#4338ca",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      <span role="img" aria-hidden="true">
                        🔍
                      </span>
                      {combo.integrations.join(" + ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Suggested automations</h3>
                {results.length > 0 && (
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{results.length} matches</span>
                )}
              </div>
              <div style={{ display: "grid", gap: "1rem" }}>
                {(results.length ? results : integrationCombos.slice(0, 3)).map(combo => {
                  const usageCount = profile.usage?.[combo.id] || 0;
                  return (
                    <button
                      key={combo.id}
                      type="button"
                      onClick={() => handleResultSelect(combo)}
                      style={{
                        textAlign: "left",
                        padding: "1.25rem",
                        borderRadius: "1rem",
                        border: activeResultId === combo.id
                          ? "2px solid rgba(99,102,241,0.65)"
                          : "1px solid rgba(148,163,184,0.25)",
                        background:
                          activeResultId === combo.id
                            ? "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(79,70,229,0.25))"
                            : "rgba(248,250,252,0.9)",
                        display: "grid",
                        gap: "0.65rem",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                        }}
                      >
                        <strong style={{ fontSize: "1.05rem", color: "#111827" }}>{combo.name}</strong>
                        {usageCount > 0 && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#0f766e",
                              background: "rgba(16,185,129,0.12)",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "999px",
                            }}
                          >
                            Used ×{usageCount}
                          </span>
                        )}
                      </div>
                      <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.6 }}>
                        {combo.description}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {combo.integrations.map(integration => (
                          <span
                            key={integration}
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              padding: "0.25rem 0.55rem",
                              borderRadius: "999px",
                              background: "rgba(15,23,42,0.08)",
                              color: "#1e3a8a",
                            }}
                          >
                            {integration}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {historyChips.length > 0 && (
              <div style={{ display: "grid", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>Recently explored</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {historyChips.map(entry => {
                    const combo = comboIndex.get(entry.resultId);
                    return (
                      <button
                        key={`${entry.resultId}-${entry.timestamp}`}
                        type="button"
                        onClick={() => handleHistoryChipClick(entry)}
                        style={{
                          borderRadius: "999px",
                          border: "1px solid rgba(148,163,184,0.3)",
                          background: "rgba(255,255,255,0.85)",
                          padding: "0.45rem 0.75rem",
                          fontSize: "0.8rem",
                          color: "#334155",
                          cursor: "pointer",
                        }}
                      >
                        {combo ? combo.integrations.join(" • ") : entry.query}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div
              style={{
                background: "rgba(15,23,42,0.94)",
                color: "#e2e8f0",
                borderRadius: "1.4rem",
                padding: "1.75rem",
                display: "grid",
                gap: "1rem",
                boxShadow: "0 25px 45px rgba(15,23,42,0.4)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Observed quick actions</h3>
                <span style={{ fontSize: "0.75rem", color: "rgba(226,232,240,0.65)" }}>Learns locally</span>
              </div>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {quickActions.map(action => (
                  <button
                    key={`${action.comboId}-${action.id}`}
                    type="button"
                    onClick={() => handleQuickActionClick(action)}
                    style={{
                      textAlign: "left",
                      display: "grid",
                      gap: "0.3rem",
                      padding: "0.9rem",
                      borderRadius: "1rem",
                      background: "rgba(30,41,59,0.7)",
                      border: "1px solid rgba(148,163,184,0.12)",
                      color: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                      <span role="img" aria-hidden="true">
                        {action.icon || "⚡"}
                      </span>
                      {action.label}
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "rgba(226,232,240,0.75)", lineHeight: 1.5 }}>
                      {action.description}
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.75)" }}>{action.source}</span>
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "1.4rem",
                padding: "1.75rem",
                border: "1px solid rgba(148,163,184,0.25)",
                display: "grid",
                gap: "1.1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Guided onboarding</h3>
                  <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
                    Adapts recommendations based on your company signals and recent search behaviour.
                  </p>
                </div>
                {detectedSignals && (
                  <button
                    type="button"
                    onClick={applyDetectedSignals}
                    style={{
                      borderRadius: "999px",
                      border: "1px solid rgba(99,102,241,0.35)",
                      background: "rgba(99,102,241,0.08)",
                      color: "#4338ca",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.35rem 0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Apply detected signals
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gap: "0.85rem" }}>
                <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                  <div style={{ display: "grid", gap: "0.25rem" }}>
                    <label htmlFor="company-size" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569" }}>
                      Company size
                    </label>
                    <select
                      id="company-size"
                      value={profile.companySize}
                      onChange={event => handleProfileChange("companySize", event.target.value)}
                      style={{
                        borderRadius: "0.8rem",
                        padding: "0.55rem 0.75rem",
                        border: "1px solid rgba(148,163,184,0.35)",
                        fontSize: "0.85rem",
                        background: "rgba(248,250,252,0.9)",
                      }}
                    >
                      {COMPANY_SIZE_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "grid", gap: "0.25rem" }}>
                    <label htmlFor="industry" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569" }}>
                      Industry focus
                    </label>
                    <select
                      id="industry"
                      value={profile.industry}
                      onChange={event => handleProfileChange("industry", event.target.value)}
                      style={{
                        borderRadius: "0.8rem",
                        padding: "0.55rem 0.75rem",
                        border: "1px solid rgba(148,163,184,0.35)",
                        fontSize: "0.85rem",
                        background: "rgba(248,250,252,0.9)",
                      }}
                    >
                      {INDUSTRY_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {detectedSignals && (
                  <div
                    style={{
                      borderRadius: "1rem",
                      padding: "0.75rem",
                      border: "1px dashed rgba(99,102,241,0.35)",
                      background: "rgba(99,102,241,0.08)",
                      color: "#4338ca",
                      fontSize: "0.8rem",
                      display: "grid",
                      gap: "0.25rem",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>Detected pattern</span>
                    <span>
                      {detectedSignals.companySize ? `Likely ${detectedSignals.companySize}` : ""}
                      {detectedSignals.companySize && detectedSignals.industry ? " • " : ""}
                      {detectedSignals.industry ? detectedSignals.industry : ""}
                    </span>
                    <span style={{ color: "rgba(67,56,202,0.7)" }}>
                      Confidence {(detectedSignals.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                    Step {guidedStepIndex + 1} of {onboardingSteps.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuidedStepIndex(index =>
                        index + 1 < onboardingSteps.length ? index + 1 : 0
                      )
                    }
                    style={{
                      borderRadius: "999px",
                      border: "1px solid rgba(14,165,233,0.35)",
                      background: "rgba(14,165,233,0.12)",
                      color: "#0369a1",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.35rem 0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Next suggestion
                  </button>
                </div>
                <div
                  style={{
                    borderRadius: "1rem",
                    padding: "1rem",
                    border: "1px solid rgba(148,163,184,0.25)",
                    background: "rgba(248,250,252,0.85)",
                    color: "#1e293b",
                    minHeight: "120px",
                  }}
                >
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{playbook.headline}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.5rem", lineHeight: 1.6 }}>
                    {onboardingSteps[guidedStepIndex] || onboardingSteps[0]}
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "0.45rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>Recommended automations</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {spotlightAutomations.map(item => (
                    <span
                      key={item}
                      style={{
                        padding: "0.45rem 0.75rem",
                        borderRadius: "999px",
                        background: "rgba(15,118,110,0.12)",
                        color: "#0f766e",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}