// @ts-nocheck
"use client";

import Link from "next/link";
import { useCallback, useId, useMemo, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { space } from "@/styles/spacing";
import Button from "@/components/ui/Button";

const tooltipStyle = {
  position: "relative",
  cursor: "help",
  borderBottom: "1px dashed rgba(148,163,184,0.5)",
};

type TooltipTermProps = {
  label: string;
  description: string;
};

function TooltipTerm({ label, description }: TooltipTermProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const tooltipId = useId();

  const visible = isHovered || isFocused;

  return (
    <button
      type="button"
      style={{
        ...tooltipStyle,
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        display: "inline",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsFocused(false);
          setIsHovered(false);
        }
      }}
      aria-describedby={tooltipId}
      aria-controls={tooltipId}
      aria-haspopup="true"
      aria-expanded={visible}
    >
      {label}
      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!visible}
        style={{
          position: "absolute",
          bottom: "110%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(15,23,42,0.95)",
          color: "#f8fafc",
          padding: space("xs", 1.5),
          borderRadius: "0.75rem",
          width: "220px",
          fontSize: "0.8rem",
          lineHeight: 1.5,
          pointerEvents: "none",
          boxShadow: "0 20px 45px rgba(15,23,42,0.45)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          transformOrigin: "bottom center",
          zIndex: 10,
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(148,163,184,0.25)",
          visibility: visible ? "visible" : "hidden",
        }}
      >
        {description}
      </span>
    </button>
  );
}

type CodeBlockProps = {
  language?: string;
  code: string;
};

function CodeBlock({ language = "", code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code.trim());
      } else {
        if (typeof document === "undefined") {
          return;
        }
        const textarea = document.createElement("textarea");
        textarea.value = code.trim();
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.warn("Unable to copy code block", error);
    }
  }, [code]);

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(15,23,42,0.85)",
        borderRadius: "1rem",
        padding: space("fluid-sm"),
        border: "1px solid rgba(148,163,184,0.35)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          background: copied ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.2)",
          color: copied ? "#22c55e" : "#e0e7ff",
          border: "1px solid rgba(99,102,241,0.35)",
          borderRadius: "999px",
          padding: `${space("2xs", 1.4)} ${space("xs", 1.8)}`,
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <div
        style={{
          color: "rgba(148,163,184,0.6)",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: space("xs", 1.5),
        }}
      >
        {language}
      </div>
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "var(--font-mono)",
          fontSize: "0.95rem",
          color: "#e2e8f0",
        }}
      >
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

const playgroundSamples = [
  {
    id: "deploy",
    label: "Create Deployment",
    method: "POST",
    path: "/api/v1/deployments",
    request: {
      automationId: "ops-guardian",
      environment: "production",
      webhookUrl: "https://hooks.example.com/ops",
    },
    response: {
      id: "dep_87ac3",
      status: "queued",
      etaSeconds: 42,
      dashboardUrl: "https://app.artifically.com/deployments/dep_87ac3",
    },
  },
  {
    id: "pause",
    label: "Pause Automation",
    method: "POST",
    path: "/api/v1/deployments/dep_87ac3/pause",
    request: {
      reason: "Scheduled maintenance",
      notifyTeam: true,
    },
    response: {
      id: "dep_87ac3",
      status: "paused",
      pausedAt: "2024-03-01T09:12:18.204Z",
      resumesAt: null,
    },
  },
  {
    id: "metrics",
    label: "Deployment Metrics",
    method: "GET",
    path: "/api/v1/deployments/dep_87ac3/metrics",
    request: null,
    response: {
      requests: 4230,
      successRate: 0.998,
      avgLatencyMs: 321,
      hoursSaved: 186,
    },
  },
];

export default function DocsPage() {
  const { darkMode } = useTheme();
  const [activeSection, setActiveSection] = useState("overview");
  const [playgroundSelection, setPlaygroundSelection] = useState(playgroundSamples[0]);
  const [playgroundState, setPlaygroundState] = useState({
    loading: false,
    response: playgroundSamples[0].response,
  });

  const sections = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "quickstart", label: "Quickstart" },
      { id: "concepts", label: "Core Concepts" },
      { id: "api", label: "API" },
      { id: "tooling", label: "Tooling" },
      { id: "support", label: "Support" },
    ],
    []
  );

  const runPlayground = useCallback(() => {
    setPlaygroundState({ loading: true, response: null });
    setTimeout(() => {
      setPlaygroundState({ loading: false, response: playgroundSelection.response });
    }, 550);
  }, [playgroundSelection]);

  return (
    <main
      className="container"
      style={{
        padding: `${space("xl")} 0 ${space("2xl", 1.5)}`,
        minHeight: "80vh",
        display: "grid",
        gap: space("lg", 1.25),
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px minmax(0, 1fr)",
          gap: space("lg", 1.25),
          alignItems: "flex-start",
        }}
      >
        <aside
          style={{
            position: "sticky",
            top: "120px",
            alignSelf: "start",
            background: darkMode ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.95)",
            borderRadius: "1.25rem",
            border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.35)"}`,
            padding: `${space("md")} ${space("fluid-sm")}`,
            display: "grid",
            gap: space("xs"),
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: darkMode ? "#cbd5e1" : "#1f2937" }}>
            Documentation
          </div>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              style={{
                textAlign: "left",
                background: activeSection === section.id ? "rgba(99,102,241,0.15)" : "transparent",
                color: activeSection === section.id ? "#6366f1" : darkMode ? "#94a3b8" : "#334155",
                padding: `${space("xs", 1.2)} ${space("xs", 1.5)}`,
                borderRadius: "0.85rem",
                border: "none",
                fontSize: "0.95rem",
                fontWeight: activeSection === section.id ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {section.label}
            </button>
          ))}
        </aside>

        <div style={{ display: "grid", gap: space("lg") }}>
          <div
            style={{
              position: "sticky",
              top: "80px",
              zIndex: 10,
              padding: `${space("sm")} ${space("fluid-sm")}`,
              borderRadius: "1rem",
              background: darkMode ? "rgba(15,23,42,0.88)" : "rgba(255,255,255,0.92)",
              border: `1px solid ${darkMode ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: space("sm"),
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#818cf8" }}>
                Ship faster
              </div>
              <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Deploy production-ready automations in minutes.</h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: space("xs", 1.5) }}>
              <Button
                size="sm"
                variant="primary"
                style={{ whiteSpace: "nowrap" }}
                onClick={() =>
                  typeof window !== "undefined" &&
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              >
                <span>Deploy Your First Automation</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <article
            id="overview"
            className="glass"
            style={{
              borderRadius: "1.5rem",
              padding: space("lg", 1.25),
              display: "grid",
              gap: space("md"),
            }}
          >
            <header>
              <h2 style={{ fontSize: "2.25rem", marginBottom: space("xs", 1.5) }}>Artifically Docs</h2>
              <p style={{ color: "var(--gray-300)", fontSize: "1.05rem", lineHeight: 1.7 }}>
                Built for teams who automate with confidence. Explore production patterns, enterprise safeguards,
                and <TooltipTerm label="SLA" description="Service level agreements define uptime guarantees and response targets." />
                -ready integrations inspired by Stripe and Vercel docs.
              </p>
            </header>
            <section
              style={{
                display: "grid",
                gap: space("fluid-sm"),
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {[
                {
                  title: "Comprehensive guides",
                  description: "Opinionated walkthroughs for provisioning, securing, and scaling automations across environments.",
                },
                {
                  title: "Audit-grade tooling",
                  description: "Trace every request with structured logs and exportable evidence to streamline compliance reviews.",
                },
                {
                  title: "SDKs & CLI",
                  description: "Ship faster with generated clients, typed SDKs, and a CLI that mirrors production automations locally.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                    borderRadius: "1.25rem",
                    padding: space("md"),
                    border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.3)"}`,
                    display: "grid",
                    gap: space("xs", 1.5),
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: darkMode ? "#e2e8f0" : "#1e293b" }}>{card.title}</h3>
                  <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#475569", lineHeight: 1.6 }}>{card.description}</p>
                </div>
              ))}
            </section>
          </article>

          <article
            id="quickstart"
            className="glass"
            style={{ borderRadius: "1.5rem", padding: space("lg", 1.25), display: "grid", gap: space("md", 1.1667) }}
          >
            <header>
              <h2 style={{ fontSize: "1.75rem", marginBottom: space("xs") }}>Quickstart</h2>
              <p style={{ color: "var(--gray-300)" }}>
                Launch your first automation in under five minutes with our streamlined provisioning workflow.
              </p>
            </header>
            <ol style={{ display: "grid", gap: space("sm"), paddingLeft: space("md"), color: "var(--gray-300)" }}>
              <li>
                Create your workspace via the <Link href="/pricing">enterprise trial</Link> and invite teammates for
                shared controls.
              </li>
              <li>
                Select a template from the <Link href="/marketplace">automation marketplace</Link> and tailor parameters.
              </li>
              <li>
                Connect integrations, configure <TooltipTerm label="webhooks" description="HTTP callbacks that Artifically triggers when automation state changes." />, and set rollout gates.
              </li>
              <li>
                Deploy with one click, then monitor performance in the dashboard with live insights.
              </li>
            </ol>
            <CodeBlock
              language="CLI"
              code={`npm create artifically@latest
cd my-automation
artifically deploy --env production --automation ops-guardian`}
            />
          </article>

          <article
            id="concepts"
            className="glass"
            style={{ borderRadius: "1.5rem", padding: space("lg", 1.25), display: "grid", gap: space("md", 1.1667) }}
          >
            <header>
              <h2 style={{ fontSize: "1.75rem", marginBottom: space("xs") }}>Core concepts</h2>
              <p style={{ color: "var(--gray-300)" }}>
                Understand the primitives that power Artifically—designed for clarity and enterprise scale.
              </p>
            </header>
            <div style={{ display: "grid", gap: space("fluid-sm") }}>
              {["Deployments", "Policies", "Observability"].map((title) => (
                <section key={title} style={{ display: "grid", gap: space("xs", 1.5) }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--white)" }}>{title}</h3>
                  <p style={{ margin: 0, color: "var(--gray-400)", lineHeight: 1.7 }}>
                    {title === "Deployments" &&
                      "Immutable units of automation runtime. Each deployment carries its own secrets, rollout plan, and approval workflow."}
                    {title === "Policies" &&
                      "Guardrails defining who can trigger, pause, or edit automations. Policies mirror your SSO roles and support conditional access."}
                    {title === "Observability" &&
                      "Built-in traces, logs, and anomaly alerts with exportable data lakes. Integrate directly with Datadog or Grafana for advanced insights."}
                  </p>
                </section>
              ))}
            </div>
            <CodeBlock
              language="JSON"
              code={`{
  "deploymentId": "dep_87ac3",
  "policy": {
    "approvers": ["ops-lead@company.com"],
    "rollout": { "strategy": "progressive", "segment": "enterprise" },
    "alerting": ["slack:#automation-alerts"]
  }
}`}
            />
          </article>

          <article
            id="api"
            className="glass"
            style={{ borderRadius: "1.5rem", padding: space("lg", 1.25), display: "grid", gap: space("lg") }}
          >
            <header>
              <h2 style={{ fontSize: "1.75rem", marginBottom: space("xs") }}>API playground</h2>
              <p style={{ color: "var(--gray-300)" }}>
                Explore the REST API with live, sandboxed responses. Perfect for validating requests before pushing to CI.
              </p>
            </header>
            <div
              style={{
                display: "grid",
                gap: space("sm"),
                gridTemplateColumns: "minmax(0, 220px) minmax(0, 1fr)",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                  borderRadius: "1.25rem",
                  border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.3)"}`,
                  display: "grid",
                  gap: space("xs"),
                  padding: space("sm"),
                }}
              >
                {playgroundSamples.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setPlaygroundSelection(sample);
                      setPlaygroundState({ loading: false, response: sample.response });
                    }}
                    style={{
                      textAlign: "left",
                      padding: `${space("xs", 1.5)} ${space("xs", 1.8)}`,
                      borderRadius: "0.9rem",
                      border: "none",
                      cursor: "pointer",
                      background:
                        playgroundSelection.id === sample.id
                          ? "rgba(99,102,241,0.15)"
                          : "transparent",
                      color:
                        playgroundSelection.id === sample.id
                          ? "#6366f1"
                          : darkMode
                          ? "#cbd5e1"
                          : "#1f2937",
                      fontWeight: playgroundSelection.id === sample.id ? 600 : 500,
                    }}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
              <div
                style={{
                  background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                  borderRadius: "1.25rem",
                  border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.3)"}`,
                  padding: space("md"),
                  display: "grid",
                  gap: space("fluid-sm"),
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", color: "var(--gray-300)" }}>
                  <span
                    style={{
                      padding: `${space("2xs")} ${space("xs", 1.3)}`,
                      borderRadius: "999px",
                      background: "rgba(34,197,94,0.15)",
                      color: "#22c55e",
                      fontSize: "0.75rem",
                      marginRight: space("xs", 1.5),
                    }}
                  >
                    {playgroundSelection.method}
                  </span>
                  {playgroundSelection.path}
                </div>
                {playgroundSelection.request && (
                  <CodeBlock
                    language="Request"
                    code={JSON.stringify(playgroundSelection.request, null, 2)}
                  />
                )}
                <div style={{ display: "flex", gap: space("xs", 1.5), alignItems: "center" }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={runPlayground}
                    disabled={playgroundState.loading}
                  >
                    {playgroundState.loading ? "Running..." : "Run request"}
                  </Button>
                  <span style={{ fontSize: "0.85rem", color: "var(--gray-400)" }}>
                    Responses stream back instantly from our mocked sandbox.
                  </span>
                </div>
                {playgroundState.response && (
                  <CodeBlock
                    language="Response"
                    code={JSON.stringify(playgroundState.response, null, 2)}
                  />
                )}
              </div>
            </div>
          </article>

          <article
            id="tooling"
            className="glass"
            style={{ borderRadius: "1.5rem", padding: space("lg", 1.25), display: "grid", gap: space("md", 1.1667) }}
          >
            <header>
              <h2 style={{ fontSize: "1.75rem", marginBottom: space("xs") }}>Developer tooling</h2>
              <p style={{ color: "var(--gray-300)" }}>
                Everything your platform team needs: Observability dashboards, typed SDKs, and policy validation baked in.
              </p>
            </header>
            <CodeBlock
              language="TypeScript"
              code={`import { Artifically } from "@artifically/sdk";

const client = new Artifically({ apiKey: process.env.ARTIFICIALLY_KEY });

const { deployment } = await client.deployments.create({
  automationId: "revenue-loop",
  environment: "staging",
  approvals: ["revops-lead@company.com"],
});

console.log(deployment.status);
`}
            />
            <p style={{ color: "var(--gray-400)", lineHeight: 1.7 }}>
              Validate rollout plans locally, surface guardrails inline with your IDE, and rely on generated types to
              remove guesswork. The CLI mirrors production APIs so what you ship in staging behaves exactly the same in
              production.
            </p>
          </article>

          <article
            id="support"
            className="glass"
            style={{ borderRadius: "1.5rem", padding: space("lg", 1.25), display: "grid", gap: space("md", 1.1667) }}
          >
            <header>
              <h2 style={{ fontSize: "1.75rem", marginBottom: space("xs") }}>Support & enablement</h2>
              <p style={{ color: "var(--gray-300)" }}>
                Enterprise help 24/7 with direct-to-engineering escalation paths.
              </p>
            </header>
            <div style={{ display: "grid", gap: space("fluid-sm"), gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              {["support@artifically.com", "Docs office hours", "Private Slack"].map((item) => (
                <div
                  key={item}
                  style={{
                    background: darkMode ? "rgba(15,23,42,0.75)" : "rgba(255,255,255,0.95)",
                    borderRadius: "1.25rem",
                    padding: space("md"),
                    border: `1px solid ${darkMode ? "rgba(148,163,184,0.25)" : "rgba(148,163,184,0.3)"}`,
                    display: "grid",
                    gap: space("xs"),
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "1rem", color: darkMode ? "#e2e8f0" : "#1f2937" }}>{item}</h3>
                  <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#475569", lineHeight: 1.6 }}>
                    {item === "support@artifically.com" && "Get a response in under two hours from automation specialists."}
                    {item === "Docs office hours" && "Join weekly deep-dives with our solutions engineers to unblock complex rollouts."}
                    {item === "Private Slack" && "Collaborate with 5k+ operators sharing playbooks and best practices."}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}