"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api, { pick } from "../api.js";
import { toast } from "./Toast";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import OnboardingTour from "./OnboardingTour";
import { useAchievements } from "../hooks/useAchievements";
import { space } from "../styles/spacing";
import "../styles/dashboard.css";
import Button from "./ui/Button";
import AssistiveHint from "./ui/AssistiveHint";
import { Icon } from "./icons";
import useInViewState from "../hooks/useInViewState";
import motionCatalog from "../design/motion/catalog";

const statusStyles = {
  active: {
    label: "Active",
    icon: "check",
    description: "Automation is running normally",
    light: { background: "#d1fae5", color: "#064e3b", border: "#34d399" },
    dark: { background: "#064e3b", color: "#d1fae5", border: "#34d399" },
  },
  paused: {
    label: "Paused",
    icon: "hourglass",
    description: "Automation is paused awaiting action",
    light: { background: "#fff2c1", color: "#78350f", border: "#f59e0b" },
    dark: { background: "#78350f", color: "#fff2c1", border: "#f59e0b" },
  },
  error: {
    label: "Needs attention",
    icon: "alert",
    description: "Automation has reported an error",
    light: { background: "#fee2e2", color: "#7f1d1d", border: "#f87171" },
    dark: { background: "#7f1d1d", color: "#fee2e2", border: "#f87171" },
  },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const marketplaceShowcase = [
  {
    id: "ops-guardian",
    name: "Ops Guardian",
    description: "Route incidents to the right squad and auto-generate postmortems.",
    category: "operations",
    keywords: ["ops", "operations", "it", "engineering"],
    preview: { success: 99.92, throughput: 240, savings: 6200 },
  },
  {
    id: "revenue-loop",
    name: "Revenue Loop",
    description: "Recover stalled deals with AI nudges and synced playbooks.",
    category: "revenue",
    keywords: ["sales", "revenue", "revops", "marketing"],
    preview: { success: 99.4, throughput: 185, savings: 7800 },
  },
  {
    id: "support-coach",
    name: "Support Coach",
    description: "Coach agents live with empathetic macros and churn signals.",
    category: "support",
    keywords: ["support", "customer", "cx", "service"],
    preview: { success: 98.7, throughput: 320, savings: 5400 },
  },
  {
    id: "commerce-recover",
    name: "Cart Recovery Bot",
    description: "Re-engage shoppers with multi-channel outreach automatically.",
    category: "ecommerce",
    keywords: ["commerce", "retail", "ecommerce", "d2c"],
    preview: { success: 99.1, throughput: 410, savings: 6600 },
  },
];

export default function Dashboard({ user, openAuth }) {
  const { darkMode } = useTheme();
  const [dockedAutomation, setDockedAutomation] = useState(marketplaceShowcase[0]);
  const [demoMetrics, setDemoMetrics] = useState(marketplaceShowcase[0].preview);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerCounts, setViewerCounts] = useState({});
  const [loginStreak, setLoginStreak] = useState(1);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [marketplaceRef, marketplaceInView] = useInViewState({ threshold: 0.25, rootMargin: "-80px", once: true });
  const [achievementsRef, achievementsInView] = useInViewState({ threshold: 0.25, rootMargin: "-60px", once: true });
  const [deploymentsRef, deploymentsInView] = useInViewState({ threshold: 0.2, rootMargin: "-60px", once: true });
  const lastAutomationRef = useRef(marketplaceShowcase[0]?.id ?? "initial");

  const sectionVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 24;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.medium,
        ease: motionCatalog.easings.out,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const listVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 16;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.short,
        ease: motionCatalog.easings.out,
        staggerChildren: motionCatalog.durations.stagger,
        delayChildren: motionCatalog.durations.micro,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const itemVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 12;
    }
    const visible = {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionCatalog.durations.short,
        ease: motionCatalog.easings.out,
      },
    };
    if (prefersReducedMotion) {
      delete visible.y;
    }
    return { hidden, visible };
  }, [prefersReducedMotion]);

  const handleAutomationDrop = useCallback((automation) => {
    if (!automation) return;
    setDockedAutomation(automation);
    setDemoMetrics(automation.preview);
    const automationKey = automation.id ?? automation.name ?? "unknown";
    if (lastAutomationRef.current !== automationKey) {
      lastAutomationRef.current = automationKey;
      toast("Automation added to workspace", {
        type: "success",
        description: `${automation.name || "Automation"} is now ready in your live preview.`,
      });
    }
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const automationId = event.dataTransfer.getData("automation-id");
      const automation = marketplaceShowcase.find((item) => item.id === automationId);
      if (automation) {
        handleAutomationDrop(automation);
      }
    },
    [handleAutomationDrop]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragStart = useCallback((automation) => (event) => {
    event.dataTransfer.setData("automation-id", automation.id);
    event.dataTransfer.effectAllowed = "copy";
  }, []);

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
      if (process.env.NODE_ENV !== "production") {
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

  useEffect(() => {
    if (!dockedAutomation) {
      return;
    }
    setDemoMetrics(dockedAutomation.preview);
  }, [dockedAutomation]);

  useEffect(() => {
    if (!dockedAutomation) {
      return;
    }

    const interval = setInterval(() => {
      setDemoMetrics((previous) => {
        const base = dockedAutomation.preview || previous;
        const jitter = (value, delta, precision = 0) => {
          const updated = value + (Math.random() - 0.5) * delta;
          if (precision > 0) {
            return Number(updated.toFixed(precision));
          }
          return Math.round(updated);
        };

        return {
          success: Math.min(100, Math.max(95, jitter(base.success ?? 99, 0.35, 2))),
          throughput: Math.max(0, jitter(base.throughput ?? 200, 28)),
          savings: Math.max(0, jitter(base.savings ?? 5000, 380)),
        };
      });
    }, 6500);

    return () => clearInterval(interval);
  }, [dockedAutomation]);

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

  const statsSnapshot = useMemo(() => {
    const totalHours = deployments.reduce((sum, deployment) => {
      if (typeof deployment.metrics?.hoursSaved === "number") {
        return sum + deployment.metrics.hoursSaved;
      }
      const fallback = deployment.requestsUsed ?? deployment.metrics?.runs ?? 90;
      return sum + Math.max(30, Math.round(fallback / 2));
    }, 0);

    const totalRuns = deployments.reduce((sum, deployment) => {
      if (typeof deployment.metrics?.runs === "number") {
        return sum + deployment.metrics.runs;
      }
      const used = deployment.requestsUsed ?? 160;
      return sum + Math.max(used, 120);
    }, 0);

    const computedHours = totalHours || (deployments.length ? deployments.length * 42 : 120);
    const computedRuns = totalRuns || (deployments.length ? deployments.length * 180 : 420);
    const projectedSavings = Math.max(estimatedSavings || computedHours * 58, 0);

    return [
      { key: "hours", label: "Hours saved", value: `${computedHours.toLocaleString()}h`, accent: "#0ea5e9" },
      { key: "runs", label: "Automations executed", value: computedRuns.toLocaleString(), accent: "#a855f7" },
      { key: "savings", label: "Money saved", value: formatPrice(Math.round(projectedSavings)), accent: "#22c55e" },
    ];
  }, [deployments, estimatedSavings, formatPrice]);

  const streakProgress = useMemo(() => Math.min(100, Math.round((loginStreak / 14) * 100)), [loginStreak]);
  const automationProgress = useMemo(
    () => Math.min(100, Math.round(((deployments?.length || 0) / 5) * 100)),
    [deployments]
  );
  const roiProgress = useMemo(
    () => Math.min(100, Math.round(((estimatedSavings || 0) / 5000) * 100)),
    [estimatedSavings]
  );

  const aiSuggestion = useMemo(() => {
    const profileHint = (user?.industry || user?.businessType || "").toLowerCase();
    const tokens = profileHint.split(/[^a-z0-9]+/).filter(Boolean);

    if (tokens.length) {
      const matched = marketplaceShowcase.find((automation) =>
        automation.keywords.some((keyword) => tokens.includes(keyword))
      );
      if (matched) {
        return matched;
      }
    }

    if (deployments.length === 0) {
      return marketplaceShowcase[0];
    }

    const deployedIds = new Set(
      deployments
        .map((deployment) => deployment.automation?.id || deployment.automationId)
        .filter(Boolean)
    );

    return marketplaceShowcase.find((automation) => !deployedIds.has(automation.id)) ?? marketplaceShowcase[0];
  }, [deployments, user]);

  const milestoneBadges = useMemo(
    () => [
      {
        id: "first",
        icon: "rocket",
        label: "First automation",
        unlocked: deployments.length > 0,
        description: "Launch your first workflow to unlock AI guidance and deeper analytics.",
      },
      {
        id: "scale",
        icon: "globe",
        label: "5 live automations",
        unlocked: deployments.length >= 5,
        description: "Reach full-team coverage and earn concierge rollout reviews.",
      },
      {
        id: "streak",
        icon: "flame",
        label: "7-day streak",
        unlocked: loginStreak >= 7,
        description: "Stay active every day for a week to unlock streak boosts.",
      },
    ],
    [deployments.length, loginStreak]
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

    stepsList.push({
      target: "dashboard-ai-suggestion",
      title: "Review your AI suggestion",
      description: "We recommend a starter automation tailored to your industry signals—preview it in seconds.",
    });

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

    stepsList.push({
      target: "dashboard-marketplace-embed",
      title: "Drag in a new automation",
      description: "Drop automations into your workspace to simulate live performance before deploying.",
    });

    return stepsList;
  }, [deployments?.length, unlockedCount, totalCount]);

  const renderGate = (title, message, action) => (
    <section
      style={{
        padding: `${space("3xl")} 0`,
        textAlign: "center",
        color: darkMode ? "#e2e8f0" : "#1f2937",
      }}
    >
      <div
        className="container"
        style={{
          background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.9)",
          borderRadius: "1.5rem",
          padding: space("xl"),
          border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
          boxShadow: darkMode
            ? "0 40px 70px rgba(8, 15, 34, 0.55)"
            : "0 40px 70px rgba(148, 163, 184, 0.35)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: space("sm") }}>{title}</h2>
        <p style={{ color: darkMode ? "#94a3b8" : "#475569", marginBottom: space("lg") }}>{message}</p>
        {action}
      </div>
    </section>
  );

  if (!user) {
    return renderGate(
      "Authentication Required",
      "Please sign in to access your dashboard.",
      <Button
        variant="primary"
        onClick={(event) => openAuth("signin", { trigger: event.currentTarget })}
      >
        <span>Sign In</span>
      </Button>
    );
  }

  if (loading) {
    return <DashboardSkeleton darkMode={darkMode} />;
  }

  if (error && deployments.length === 0) {
    return renderGate(
      "Unable to Load Dashboard",
      "We encountered an issue loading your deployments. Please try again.",
      <Button variant="primary" onClick={() => window.location.reload()}>
        <span>Retry</span>
      </Button>
    );
  }

  return (
    <section className="dashboard" style={{ padding: `${space("3xl")} 0` }}>
      <div className="container" style={{ display: "grid", gap: space("lg") }}>
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: space("sm"),
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            padding: space("md"),
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
          <div style={{ display: "flex", alignItems: "center", gap: space("xs", 1.5) }}>
            <ThemeToggle />
            <Button
              size="sm"
              variant="primary"
              data-tour-id="dashboard-action-button"
              magnetic
              onClick={() => router.push("/marketplace")}
            >
              <span>+ Add Automation</span>
            </Button>
          </div>
        </div>

        <div
          data-tour-id="dashboard-stats"
          style={{
            display: "grid",
            gap: space("fluid-sm"),
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {statsSnapshot.map((stat) => (
            <div
              key={stat.key}
              style={{
                background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                borderRadius: "1.25rem",
                padding: space("fluid-sm"),
                border: `1px solid ${darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.25)"}`,
                display: "grid",
                gap: space("xs"),
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: darkMode ? "#94a3b8" : "#475569",
                }}
              >
                {stat.label}
              </span>
              <span style={{ fontSize: "1.85rem", fontWeight: 700, color: stat.accent }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {aiSuggestion && (
          <div
            data-tour-id="dashboard-ai-suggestion"
            style={{
              background: darkMode ? "rgba(30,41,59,0.78)" : "rgba(248,250,252,0.96)",
              borderRadius: "1.25rem",
              padding: space("md"),
              border: `1px solid ${darkMode ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"}`,
              display: "grid",
              gap: space("xs", 1.5),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: space("sm") }}>
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: darkMode ? "#a5b4fc" : "#4f46e5",
                  }}
                >
                  AI assistant
                </span>
                <h2 style={{ margin: `${space("2xs", 1.4)} 0 0`, fontSize: "1.35rem" }}>{aiSuggestion.name}</h2>
              </div>
              <Button
                size="sm"
                variant="secondary"
                magnetic
                glowOnHover={false}
                onClick={() => handleAutomationDrop(aiSuggestion)}
              >
                Load into preview
              </Button>
            </div>
            <p style={{ margin: 0, color: darkMode ? "#cbd5e1" : "#475569", lineHeight: 1.6 }}>
              {aiSuggestion.description} We picked this based on your industry profile. Drop it into the playground to
              explore metrics before going live.
            </p>
          </div>
        )}

        <div
          data-tour-id="dashboard-profile-progress"
          style={{
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            borderRadius: "1.25rem",
            padding: space("md"),
            border: `1px solid ${darkMode ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.25)"}`,
            display: "grid",
            gap: space("sm"),
          }}
        >
          <div style={{ display: "grid", gap: space("2xs", 1.4) }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
              Profile completion
            </h3>
            <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#475569", fontSize: "0.95rem" }}>
              Finish your business profile to unlock tailored onboarding nudges and drive more engaged automation rollouts.
            </p>
          </div>
          <div style={{ display: "grid", gap: space("xs") }}>
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

        <motion.section
          data-tour-id="dashboard-marketplace-embed"
          ref={marketplaceRef}
          initial="hidden"
          animate={marketplaceInView ? "visible" : "hidden"}
          variants={sectionVariants}
          style={{
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            borderRadius: "1.35rem",
            border: `1px solid ${darkMode ? "rgba(99,102,241,0.25)" : "rgba(148,163,184,0.25)"}`,
            padding: space("md", 1.1667),
            display: "grid",
            gap: space("md"),
          }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: space("sm") }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Marketplace preview</h2>
              <p style={{ margin: `${space("2xs", 1.4)} 0 0`, color: darkMode ? "#94a3b8" : "#475569" }}>
                Drag automations into the live preview or press Enter on a card to simulate performance.
              </p>
            </div>
            <Button size="sm" variant="primary" magnetic onClick={() => router.push("/marketplace")}>
              <span>Browse marketplace</span>
            </Button>
            <AssistiveHint
              id="dashboard-marketplace-hint"
              label="Marketplace preview guidance"
              message="Use keyboard arrows to focus a card and press Enter to load it into the live preview."
              placement="left"
            />
          </header>
          <motion.div
            initial="hidden"
            animate={marketplaceInView ? "visible" : "hidden"}
            variants={listVariants}
            style={{
              display: "grid",
              gap: space("md"),
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <motion.div style={{ display: "grid", gap: space("sm") }} variants={listVariants}>
              {marketplaceShowcase.map((automation) => (
                <motion.article
                  key={automation.id}
                  draggable
                  onDragStart={handleDragStart(automation)}
                  onClick={() => handleAutomationDrop(automation)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleAutomationDrop(automation);
                    }
                  }}
                  style={{
                    background: darkMode ? "rgba(30,41,59,0.85)" : "rgba(248,250,252,0.95)",
                    borderRadius: "1.15rem",
                    padding: space("fluid-sm"),
                    border: `1px dashed ${darkMode ? "rgba(148,163,184,0.35)" : "rgba(99,102,241,0.35)"}`,
                    cursor: "grab",
                    display: "grid",
                    gap: space("xs"),
                  }}
                  variants={itemVariants}
                >
                  <span style={{ fontSize: "0.75rem", color: darkMode ? "#a5b4fc" : "#6366f1" }}>Drag to preview</span>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{automation.name}</h3>
                  <p style={{ margin: 0, color: darkMode ? "#cbd5e1" : "#475569", lineHeight: 1.5 }}>
                    {automation.description}
                  </p>
                </motion.article>
              ))}
            </motion.div>
            <motion.div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              role="region"
              aria-labelledby="dashboard-dropzone-title"
              aria-describedby="dashboard-dropzone-hint"
              variants={itemVariants}
              style={{
                minHeight: "260px",
                borderRadius: "1.25rem",
                border: `2px dashed ${darkMode ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.45)"}`,
                background: darkMode ? "rgba(17,24,39,0.85)" : "rgba(241,245,249,0.9)",
                padding: space("md", 1.1667),
                display: "grid",
                gap: space("sm"),
                alignContent: "start",
              }}
            >
              <div>
                <span
                  id="dashboard-dropzone-title"
                  style={{ fontSize: "0.75rem", color: darkMode ? "#a5b4fc" : "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  Live demo
                </span>
                <h3 style={{ margin: `${space("2xs", 1.4)} 0 0`, fontSize: "1.35rem" }}>{dockedAutomation.name}</h3>
              </div>
              <p style={{ margin: 0, color: darkMode ? "#cbd5e1" : "#475569", lineHeight: 1.6 }}>
                {dockedAutomation.description}
              </p>
              <p
                id="dashboard-dropzone-hint"
                style={{ margin: 0, color: darkMode ? "#94a3b8" : "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}
                role="note"
              >
                Prefer not to drag? Focus a card and press Enter to load it here. Screen reader users will hear live updates
                for the metrics below.
              </p>
              <div
                style={{
                  display: "grid",
                  gap: space("xs", 1.5),
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                }}
              >
                {[{
                  label: "Success rate",
                  value: `${(demoMetrics.success ?? dockedAutomation.preview.success).toFixed(2)}%`,
                },
                {
                  label: "Runs / hour",
                  value: Math.max(0, Math.round(demoMetrics.throughput ?? dockedAutomation.preview.throughput)).toLocaleString(),
                },
                {
                  label: "Monthly savings",
                  value: formatPrice(Math.round(demoMetrics.savings ?? dockedAutomation.preview.savings)),
                }].map((metric) => (
                  <div
                    key={metric.label}
                    style={{
                      background: darkMode ? "rgba(30,41,59,0.8)" : "rgba(255,255,255,0.95)",
                      borderRadius: "0.85rem",
                      padding: space("xs", 1.7),
                      border: `1px solid ${darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)"}`,
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: darkMode ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {metric.label}
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{metric.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.div
          data-tour-id="dashboard-achievements"
          ref={achievementsRef}
          initial="hidden"
          animate={achievementsInView ? "visible" : "hidden"}
          variants={sectionVariants}
          style={{
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            borderRadius: "1.25rem",
            padding: space("md"),
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
            display: "grid",
            gap: space("fluid-sm"),
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: space("xs", 1.5),
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>Achievement tracker</h3>
              <p style={{ margin: `${space("2xs", 1.4)} 0 0`, color: darkMode ? "#94a3b8" : "#475569", fontSize: "0.95rem" }}>
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

          <div style={{ display: "grid", gap: space("xs") }}>
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

          <motion.div
            initial="hidden"
            animate={achievementsInView ? "visible" : "hidden"}
            variants={listVariants}
            style={{
              display: "grid",
              gap: space("sm"),
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {achievementEntries.map((achievement) => {
              const unlocked = Boolean(achievement?.unlocked);
              const unlockedDate = achievement?.unlockedAt
                ? new Date(achievement.unlockedAt).toLocaleDateString()
                : null;

              return (
                <motion.div
                  key={achievement.id}
                  style={{
                    borderRadius: "1rem",
                    border: `1px solid ${unlocked
                      ? darkMode ? "rgba(16,185,129,0.45)" : "rgba(16,185,129,0.35)"
                      : darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.25)"}`,
                    background: unlocked
                      ? darkMode ? "rgba(16,185,129,0.12)" : "rgba(134,239,172,0.2)"
                      : darkMode ? "rgba(15,23,42,0.6)" : "rgba(248,250,252,0.9)",
                    padding: space("sm", 1.1),
                    display: "grid",
                    gap: space("xs"),
                  }}
                  variants={itemVariants}
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
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    <Icon name="gift" size={16} /> {achievement.reward}
                  </span>
                  {unlockedDate && (
                    <span style={{ fontSize: "0.75rem", color: darkMode ? "#94a3b8" : "#64748b" }}>
                      Unlocked on {unlockedDate}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <section
          data-tour-id="dashboard-badges"
          style={{
            background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
            borderRadius: "1.25rem",
            padding: space("md"),
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
            display: "grid",
            gap: space("fluid-sm"),
          }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: space("xs", 1.5) }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Badge milestones</h3>
              <p style={{ margin: `${space("2xs", 1.4)} 0 0`, color: darkMode ? "#94a3b8" : "#475569" }}>
                Unlock badges as you launch automations and keep engagement streaks alive.
              </p>
            </div>
          </header>
          <div style={{ display: "grid", gap: space("sm"), gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {milestoneBadges.map((badge) => (
              <div
                key={badge.id}
                style={{
                  borderRadius: "1rem",
                  border: `1px solid ${badge.unlocked ? "rgba(34,197,94,0.45)" : darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.3)"}`,
                  background: badge.unlocked
                    ? darkMode
                      ? "rgba(22,163,74,0.15)"
                      : "rgba(22,163,74,0.12)"
                    : darkMode
                    ? "rgba(30,41,59,0.6)"
                    : "rgba(248,250,252,0.9)",
                  padding: space("sm", 1.1),
                  display: "grid",
                  gap: space("xs"),
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={badge.icon} size={24} />
                </span>
                <div style={{ fontWeight: 600 }}>{badge.label}</div>
                <p style={{ margin: 0, color: darkMode ? "#cbd5e1" : "#475569", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  {badge.description}
                </p>
                <span
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: badge.unlocked ? "#22c55e" : darkMode ? "#94a3b8" : "#94a3b8",
                  }}
                >
                  {badge.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div
          data-tour-id="dashboard-gamification"
          style={{
            display: "grid",
            gap: space("fluid-sm"),
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
                padding: space("fluid-sm"),
                display: "grid",
                gap: space("xs", 1.5),
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>{stat.title}</h4>
                <p style={{ margin: `${space("2xs", 1.4)} 0 0`, fontSize: "0.85rem", color: darkMode ? "#94a3b8" : "#475569" }}>
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
          <motion.div
            className="empty-state"
            ref={deploymentsRef}
            initial="hidden"
            animate={deploymentsInView ? "visible" : "hidden"}
            variants={sectionVariants}
            style={{
              textAlign: "center",
              padding: space("2xl"),
              borderRadius: "1.5rem",
              border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
              background: darkMode ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.95)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: space("sm"), opacity: 0.6 }}>
              <Icon name="robot" size={48} />
            </div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: space("xs") }}>No Automations Yet</h3>
            <p style={{ color: darkMode ? "#94a3b8" : "#475569", maxWidth: "400px", margin: `0 auto ${space("md")}` }}>
              Browse the marketplace to deploy your first AI automation and start transforming your business operations.
            </p>
            <Button size="md" variant="primary" magnetic onClick={() => router.push("/marketplace")}>
              <span>Browse Marketplace</span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="deployments-list"
            ref={deploymentsRef}
            initial="hidden"
            animate={deploymentsInView ? "visible" : "hidden"}
            variants={listVariants}
            style={{
              display: "grid",
              gap: space("md"),
            }}
          >
            {deployments.map((deployment, index) => {
              const status = (deployment.status || "active").toLowerCase();
              const statusVisual = statusStyles[status] || statusStyles.active;
              const palette = darkMode ? statusVisual.dark : statusVisual.light;
              const usagePercent = deployment.requestLimit
                ? Math.min(100, Math.round((deployment.requestsUsed / deployment.requestLimit) * 100))
                : null;

              return (
                <motion.article
                  key={deployment.id}
                  style={{
                    borderRadius: "1.25rem",
                    border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
                    padding: space("md", 1.1667),
                    background: darkMode
                      ? "linear-gradient(145deg, rgba(15,23,42,0.8), rgba(30,41,59,0.85))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(241,245,249,0.94))",
                    boxShadow: darkMode
                      ? "0 30px 55px rgba(8, 15, 34, 0.45)"
                      : "0 30px 55px rgba(148, 163, 184, 0.3)",
                    display: "grid",
                    gap: space("fluid-sm"),
                  }}
                  variants={itemVariants}
                >
                  <header
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: space("sm"),
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
                    <div style={{ display: "flex", alignItems: "center", gap: space("xs", 1.5) }}>
                      <span
                        role="status"
                        aria-label={`${statusVisual.label}. ${statusVisual.description}`}
                        style={{
                          padding: `${space("2xs", 1.4)} ${space("xs", 1.5)}`,
                          borderRadius: "0.75rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          background: palette.background,
                          color: palette.color,
                          border: `1px solid ${palette.border}`,
                          letterSpacing: "0.04em",
                        }}
                      >
                        <Icon name={statusVisual.icon} size={16} aria-hidden focusable="false" />
                        <span>{statusVisual.label}</span>
                        <span className="sr-only">{statusVisual.description}</span>
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
                      gap: space("xs"),
                      color: darkMode ? "#22d3ee" : "#0f766e",
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                      <Icon name="users" size={16} /> {viewerCounts[deployment.id] ?? 1} teammates viewing this automation
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
                    <div style={{ display: "grid", gap: space("xs") }}>
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
                        padding: `${space("sm")} ${space("fluid-sm")}`,
                      }}
                    >
                      <summary style={{ cursor: "pointer", fontWeight: 600 }}>Configuration Details</summary>
                      <pre
                        style={{
                          marginTop: space("xs", 1.5),
                          background: darkMode ? "rgba(15,23,42,0.85)" : "rgba(15,23,42,0.85)",
                          color: "#f8fafc",
                          padding: space("sm"),
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
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {error && deployments.length > 0 && (
          <div
            role="alert"
            style={{
              marginTop: space("xs"),
              padding: `${space("sm")} ${space("fluid-sm")}`,
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

function SkeletonLine({ width = "100%", height, className = "" }) {
  return (
    <span
      className={`skeleton-line${className ? ` ${className}` : ""}`}
      style={{ width, minHeight: height }}
      aria-hidden="true"
    />
  );
}

function SkeletonSurface({ height, className = "" }) {
  return (
    <div
      className={`skeleton-surface${className ? ` ${className}` : ""}`}
      style={{ minHeight: height }}
      aria-hidden="true"
    />
  );
}

function DashboardSkeleton({ darkMode }) {
  return (
    <main className="dashboard-shell" aria-busy="true" aria-live="polite">
      <div
        className="container"
        style={{ display: "grid", gap: space("xl"), padding: `${space("xl")} 0` }}
      >
        <section style={{ display: "grid", gap: space("xs") }} aria-hidden="true">
          <SkeletonLine className="skeleton-line--heading" width="55%" />
          <SkeletonLine width="70%" />
        </section>

        <section
          style={{
            display: "grid",
            gap: space("md"),
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
          aria-hidden="true"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={{ display: "grid", gap: space("xs") }}>
              <SkeletonLine width="40%" />
              <SkeletonSurface height="140px" />
            </div>
          ))}
        </section>

        <section
          style={{
            background: darkMode ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.92)",
            borderRadius: "1.35rem",
            padding: space("md"),
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.3)"}`,
            display: "grid",
            gap: space("sm"),
          }}
          aria-hidden="true"
        >
          <SkeletonLine width="35%" />
          <div style={{ display: "grid", gap: space("xs"), gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonSurface key={index} height="88px" />
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: space("sm") }} aria-hidden="true">
          <SkeletonLine width="45%" />
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonSurface key={index} height="180px" />
          ))}
        </section>
      </div>
      <span className="sr-only">Loading your dashboard data…</span>
    </main>
  );
}