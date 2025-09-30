import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { pick } from "../api";
import { toast } from "./Toast";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import OnboardingTour from "./OnboardingTour";
import { useAchievements } from "../hooks/useAchievements";

const statusColors = {
  active: { bg: "rgba(16,185,129,0.18)", color: "#10b981" },
  paused: { bg: "rgba(245,158,11,0.18)", color: "#b45309" },
  error: { bg: "rgba(239,68,68,0.18)", color: "#dc2626" },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function Dashboard({ user, openAuth }) {
  const { darkMode } = useTheme();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerCounts, setViewerCounts] = useState({});
  const [loginStreak, setLoginStreak] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadDeployments = async () => {
      try {
        setError(null);
        const response = await api.get("/deployments");
        const deploymentsData = pick("deployments")(response);
        setDeployments(deploymentsData || []);
      } catch (err) {
        console.error("Failed to load deployments:", err);
        setError(err);

        const res = err?.response?.data;
        if (res?.errors?.length) {
          toast(res.errors.map((e) => `${e.field}: ${e.message}`).join(", "), { type: "error" });
        } else {
          toast(res?.message || "Failed to load deployments", { type: "error" });
        }
      } finally {
        setLoading(false);
      }
    };

    loadDeployments();
  }, [user]);

  useEffect(() => {
    if (!user || typeof window === "undefined") {
      return;
    }

    const streakKey = `artifically:login-streak:${user.id || user.email}`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().split("T")[0];

    try {
      const stored = window.localStorage.getItem(streakKey);
      let nextCount = 1;

      if (stored) {
        const parsed = JSON.parse(stored);
        const lastDateString = parsed?.lastDate;
        if (lastDateString) {
          const lastDate = new Date(lastDateString);
          lastDate.setHours(0, 0, 0, 0);
          const diffMs = today.getTime() - lastDate.getTime();
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            nextCount = parsed.count || 1;
          } else if (diffDays === 1) {
            nextCount = (parsed.count || 0) + 1;
          } else {
            nextCount = 1;
          }
        }
      }

      setLoginStreak(nextCount);
      window.localStorage.setItem(
        streakKey,
        JSON.stringify({ lastDate: todayKey, count: nextCount })
      );
    } catch (streakError) {
      if (import.meta.env.DEV) {
        console.warn("Unable to track engagement streak", streakError);
      }
      setLoginStreak(1);
    }
  }, [user]);

  useEffect(() => {
    if (!deployments?.length) {
      setViewerCounts({});
      return;
    }

    setViewerCounts((previous) => {
      const next = { ...previous };
      deployments.forEach((deployment) => {
        if (!deployment?.id) {
          return;
        }

        if (typeof next[deployment.id] !== "number") {
          next[deployment.id] = clamp(Math.round(Math.random() * 4) + 1, 1, 12);
        }
      });
      return next;
    });
  }, [deployments]);

  useEffect(() => {
    if (!deployments?.length) {
      return;
    }

    const interval = setInterval(() => {
      setViewerCounts((previous) => {
        const next = {};
        deployments.forEach((deployment) => {
          const base = typeof previous[deployment.id] === "number"
            ? previous[deployment.id]
            : clamp(Math.round(Math.random() * 4) + 1, 1, 12);
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
          next[deployment.id] = clamp(base + delta, 1, 24);
        });
        return next;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [deployments]);

  const formatPrice = useMemo(
    () =>
      (price, currency = "USD") =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
        }).format(price),
    []
  );

  const profileFields = useMemo(
    () => [
      { key: "businessName", label: "Business Name" },
      { key: "businessEmail", label: "Business Email" },
      { key: "businessPhone", label: "Business Phone" },
      { key: "websiteUrl", label: "Website URL" },
    ],
    []
  );

  const profileCompletion = useMemo(() => {
    const total = profileFields.length;
    if (!user) {
      return { percent: 0, completed: [], missing: profileFields, total };
    }

    const completed = profileFields.filter(({ key }) => Boolean(user[key]));
    const missing = profileFields.filter(({ key }) => !user[key]);
    const percent = total === 0 ? 0 : Math.round((completed.length / total) * 100);

    return { percent, completed, missing, total };
  }, [profileFields, user]);

  const { achievements, unlockedCount, totalCount, completion: achievementsCompletion } =
    useAchievements({ deploymentsCount: deployments.length, streak: loginStreak });

  const achievementEntries = useMemo(
    () => Object.values(achievements || {}),
    [achievements]
  );

  const estimatedSavings = useMemo(() => {
    if (!deployments?.length) {
      return 0;
    }

    return deployments.reduce((total, deployment) => {
      const used = deployment?.requestsUsed ?? 0;
      const limit = deployment?.requestLimit ?? 0;
      const baseline = used > 0 ? used : Math.round(limit * 0.4);
      const automationValue = deployment?.automation?.priceMonthly ?? 320;
      return total + baseline * 3.75 + automationValue * 0.25;
    }, 0);
  }, [deployments]);

  const streakProgress = useMemo(() => Math.min(100, Math.round((loginStreak / 14) * 100)), [loginStreak]);
  const automationProgress = useMemo(
    () => Math.min(100, Math.round(((deployments?.length || 0) / 5) * 100)),
    [deployments]
  );
  const roiProgress = useMemo(
    () => Math.min(100, Math.round(((estimatedSavings || 0) / 5000) * 100)),
    [estimatedSavings]
  );

  const gamificationStats = useMemo(
    () => [
      {
        key: "streak",
        title: "Activity Streak",
        value: `${loginStreak} day${loginStreak === 1 ? "" : "s"}`,
        description: "Review your automations daily to keep the momentum and unlock streak rewards.",
        progress: streakProgress,
        accent: darkMode ? "#22d3ee" : "#0284c7",
      },
      {
        key: "roi",
        title: "ROI Milestone",
        value: formatPrice(Math.round(estimatedSavings) || 0),
        description: "Projected monthly savings generated by your deployed automations.",
        progress: roiProgress,
        accent: "#6366f1",
      },
      {
        key: "coverage",
        title: "Automation Coverage",
        value: `${deployments.length} active`,
        description: "Reach five live automations to secure the Automation Architect badge.",
        progress: automationProgress,
        accent: "#f97316",
      },
    ],
    [loginStreak, streakProgress, darkMode, estimatedSavings, formatPrice, roiProgress, deployments.length, automationProgress]
  );

  const onboardingSteps = useMemo(() => {
    const stepsList = [
      {
        target: "dashboard-profile-progress",
        title: "Complete your profile",
        description: "Add your business details to unlock personalised onboarding and boost engagement by 30%+.",
      },
    ];

    if ((deployments?.length || 0) === 0) {
      stepsList.push({
        target: "dashboard-action-button",
        title: "Launch your first automation",
        description: "Open the marketplace to request a demo and claim the Early Adopter achievement.",
      });
    } else {
      stepsList.push({
        target: "dashboard-collaboration",
        title: "Collaborate in real time",
        description: "See how many teammates are reviewing each automation to coordinate launch readiness.",
      });
    }

    stepsList.push({
      target: "dashboard-achievements",
      title: "Track achievements & rewards",
      description: `You've unlocked ${unlockedCount} of ${totalCount} milestones—keep going to earn exclusive perks!`,
    });

    stepsList.push({
      target: "dashboard-gamification",
      title: "Monitor streaks and ROI",
      description: "Let the streak, coverage, and ROI progress bars keep your automation goals on track.",
    });

    return stepsList;
  }, [deployments?.length, unlockedCount, totalCount]);

  const renderGate = (title, message, action) => (
    <section
      style={{
        padding: "5rem 0",
        textAlign: "center",
        color: darkMode ? "#e2e8f0" : "#1f2937",
      }}
    >
      <div
        className="container"
        style={{
          background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.9)",
          borderRadius: "1.5rem",
          padding: "3rem",
          border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
          boxShadow: darkMode
            ? "0 40px 70px rgba(8, 15, 34, 0.55)"
            : "0 40px 70px rgba(148, 163, 184, 0.35)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{title}</h2>
        <p style={{ color: darkMode ? "#94a3b8" : "#475569", marginBottom: "2rem" }}>{message}</p>
        {action}
      </div>
    </section>
  );

  if (!user) {
    return renderGate(
      "Authentication Required",
      "Please sign in to access your dashboard.",
      <button className="btn btn-primary" onClick={() => openAuth("signin")}>Sign In</button>
    );
  }

  if (loading) {
    return renderGate(
      "Loading your dashboard",
      "We’re fetching your latest deployment metrics.",
      <div className="loading" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
    );
  }

  if (error && deployments.length === 0) {
    return renderGate(
      "Unable to Load Dashboard",
      "We encountered an issue loading your deployments. Please try again.",
      <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
    );
  }

  return (
    <section className="dashboard" style={{ padding: "5rem 0" }}>
      <div className="container" style={{ display: "grid", gap: "2rem" }}>
        <div
          className="dashboard-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            padding: "1.5rem",
            borderRadius: "1.25rem",
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
              Welcome back, {user.businessName || user.email}
            </h1>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>Your deployed automations and usage</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ThemeToggle />
            <button
              className="btn btn-primary"
              data-tour-id="dashboard-action-button"
              onClick={() => navigate("/marketplace")}
            >
              + Add Automation
            </button>
          </div>
        </div>

        <div
          data-tour-id="dashboard-profile-progress"
          style={{
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            borderRadius: "1.25rem",
            padding: "1.5rem",
            border: `1px solid ${darkMode ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.25)"}`,
            display: "grid",
            gap: "1rem",
          }}
        >
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
              Profile completion
            </h3>
            <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#475569", fontSize: "0.95rem" }}>
              Finish your business profile to unlock tailored onboarding nudges and drive more engaged automation rollouts.
            </p>
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: darkMode ? "#cbd5e1" : "#1f2937" }}>
              <span>{profileCompletion.percent}% complete</span>
              <span>
                {profileCompletion.completed.length}/{profileCompletion.total}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "10px",
                borderRadius: "999px",
                background: darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.25)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${profileCompletion.percent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #10b981, #22d3ee)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: "0.85rem", color: darkMode ? "#94a3b8" : "#475569" }}>
            {profileCompletion.missing.length ? (
              <>
                Next up: {" "}
                <strong>{profileCompletion.missing.map((item) => item.label).join(", ")}</strong>
              </>
            ) : (
              <>
                <strong>Great!</strong> Your profile is complete and ready for deeper insights.
              </>
            )}
          </div>
        </div>

        <div
          data-tour-id="dashboard-achievements"
          style={{
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            borderRadius: "1.25rem",
            padding: "1.5rem",
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
            display: "grid",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Achievement tracker</h3>
              <p style={{ margin: "0.35rem 0 0", color: darkMode ? "#94a3b8" : "#475569", fontSize: "0.95rem" }}>
                {unlockedCount} of {totalCount} milestones unlocked
              </p>
            </div>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: darkMode ? "#a5b4fc" : "#4338ca",
              }}
            >
              {achievementsCompletion}% complete
            </span>
          </div>

          <div style={{ display: "grid", gap: "0.5rem" }}>
            <div
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "999px",
                background: darkMode ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${achievementsCompletion}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #6366f1, #c084fc)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {achievementEntries.map((achievement) => {
              const unlocked = Boolean(achievement?.unlocked);
              const unlockedDate = achievement?.unlockedAt
                ? new Date(achievement.unlockedAt).toLocaleDateString()
                : null;

              return (
                <div
                  key={achievement.id}
                  style={{
                    borderRadius: "1rem",
                    border: `1px solid ${unlocked
                      ? darkMode ? "rgba(16,185,129,0.45)" : "rgba(16,185,129,0.35)"
                      : darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.25)"}`,
                    background: unlocked
                      ? darkMode ? "rgba(16,185,129,0.12)" : "rgba(134,239,172,0.2)"
                      : darkMode ? "rgba(15,23,42,0.6)" : "rgba(248,250,252,0.9)",
                    padding: "1.1rem",
                    display: "grid",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "1rem" }}>{achievement.title}</strong>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: unlocked ? "#0f766e" : darkMode ? "#94a3b8" : "#64748b" }}>
                      {unlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: darkMode ? "#cbd5e1" : "#475569" }}>
                    {achievement.description}
                  </p>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    🎁 {achievement.reward}
                  </span>
                  {unlockedDate && (
                    <span style={{ fontSize: "0.75rem", color: darkMode ? "#94a3b8" : "#64748b" }}>
                      Unlocked on {unlockedDate}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          data-tour-id="dashboard-gamification"
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          }}
        >
          {gamificationStats.map((stat) => (
            <div
              key={stat.key}
              style={{
                borderRadius: "1.25rem",
                border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.3)"}`,
                background: darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.95)",
                padding: "1.25rem",
                display: "grid",
                gap: "0.75rem",
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{stat.title}</h4>
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: darkMode ? "#94a3b8" : "#475569" }}>
                  {stat.description}
                </p>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: stat.accent }}>{stat.value}</div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "999px",
                  background: darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.25)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${stat.progress}%`,
                    height: "100%",
                    background: stat.accent,
                    opacity: 0.8,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {deployments.length === 0 ? (
          <div
            className="empty-state"
            style={{
              textAlign: "center",
              padding: "4rem",
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
              background: darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.95)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.6 }}>🤖</div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>No Automations Yet</h3>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
              Browse the marketplace to deploy your first AI automation and start transforming your business operations.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/marketplace")}>
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div
            className="deployments-list"
            style={{
              display: "grid",
              gap: "1.5rem",
            }}
          >
            {deployments.map((deployment, index) => {
              const status = (deployment.status || "active").toLowerCase();
              const colors = statusColors[status] || statusColors.active;
              const usagePercent = deployment.requestLimit
                ? Math.min(100, Math.round((deployment.requestsUsed / deployment.requestLimit) * 100))
                : null;

              return (
                <article
                  key={deployment.id}
                  style={{
                    borderRadius: "1.25rem",
                    border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
                    padding: "1.75rem",
                    background: darkMode
                      ? "linear-gradient(145deg, rgba(15,23,42,0.8), rgba(30,41,59,0.85))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(241,245,249,0.94))",
                    boxShadow: darkMode
                      ? "0 30px 55px rgba(8, 15, 34, 0.45)"
                      : "0 30px 55px rgba(148, 163, 184, 0.3)",
                    display: "grid",
                    gap: "1.25rem",
                  }}
                >
                  <header
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>
                        {deployment.automation?.name || "Automation"}
                      </h2>
                      <p style={{ color: darkMode ? "#94a3b8" : "#475569" }}>
                        {deployment.automation?.description || "Deployed workflow"}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "0.75rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: colors.bg,
                          color: colors.color,
                        }}
                      >
                        {status}
                      </span>
                      {deployment.automation?.priceMonthly && (
                        <span style={{ color: darkMode ? "#cbd5e1" : "#475569" }}>
                          {formatPrice(deployment.automation.priceMonthly, deployment.automation.currency)}/mo
                        </span>
                      )}
                    </div>
                  </header>

                  <div
                    data-tour-id={index === 0 ? "dashboard-collaboration" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: darkMode ? "#22d3ee" : "#0f766e",
                      fontWeight: 600,
                    }}
                  >
                    <span>
                      👥 {viewerCounts[deployment.id] ?? 1} teammates viewing this automation
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        opacity: 0.8,
                      }}
                    >
                      Live
                    </span>
                  </div>

                  {usagePercent !== null && (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: darkMode ? "#cbd5e1" : "#475569" }}>
                        <span>Usage this month</span>
                        <span>
                          {deployment.requestsUsed}/{deployment.requestLimit} ({usagePercent}%)
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          borderRadius: "999px",
                          background: darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${usagePercent}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {deployment.placeholders && (
                    <details
                      style={{
                        background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                        borderRadius: "1rem",
                        border: `1px solid ${darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)"}`,
                        padding: "1rem 1.25rem",
                      }}
                    >
                      <summary style={{ cursor: "pointer", fontWeight: 600 }}>Configuration Details</summary>
                      <pre
                        style={{
                          marginTop: "0.75rem",
                          background: darkMode ? "rgba(15,23,42,0.85)" : "rgba(15,23,42,0.85)",
                          color: "#f8fafc",
                          padding: "1rem",
                          borderRadius: "0.85rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          overflowX: "auto",
                        }}
                      >
                        {JSON.stringify(deployment.placeholders, null, 2)}
                      </pre>
                    </details>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {error && deployments.length > 0 && (
          <div
            role="alert"
            style={{
              marginTop: "0.5rem",
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              border: `1px solid ${darkMode ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.5)"}`,
              background: darkMode ? "rgba(239,68,68,0.15)" : "rgba(254,226,226,0.85)",
              color: darkMode ? "#fca5a5" : "#b91c1c",
              textAlign: "center",
            }}
          >
            Some data may not be up to date due to a connection issue.
          </div>
        )}
      </div>
      <OnboardingTour steps={onboardingSteps} />
    </section>
  );
}