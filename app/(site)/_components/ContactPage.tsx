// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import { space } from "@/styles/spacing";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const FORM_DEFAULTS = {
  name: "",
  email: "",
  topic: "",
  message: "",
  contactMethod: "email",
  timeline: "this-quarter",
  shareMetrics: true,
};

const PREFERENCES_KEY = "contact-form-preferences";
const TOPIC_HISTORY_KEY = "contact-form-topic-history";
const HESITATION_DELAY = 1400;

const hints = {
  name: "Let us know who to address our reply to.",
  email: "We'll only use this to send the follow-up conversation.",
  topic: "Share the initiative or question you want to tackle next.",
  message: "Describe the current workflow and the outcome you're expecting.",
  contactMethod: "Pick the follow-up channel that works best for your team.",
  timeline: "This helps us assign the right solution architects to your project.",
  shareMetrics: "Sharing performance metrics lets us tailor optimization playbooks.",
};

const getStoredPreferences = () => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch (error) {
    console.warn("Failed to parse stored contact preferences", error);
    return {};
  }
};

const getTopicHistory = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(TOPIC_HISTORY_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to parse topic history", error);
    return [];
  }
};

const shouldOpenAdvanced = (state) =>
  state.contactMethod !== FORM_DEFAULTS.contactMethod ||
  state.timeline !== FORM_DEFAULTS.timeline ||
  state.shareMetrics !== FORM_DEFAULTS.shareMetrics;

const decodeParam = (value) => {
  if (!value && value !== 0) return "";
  try {
    return decodeURIComponent(String(value).replace(/\+/g, " "));
  } catch (error) {
    return String(value);
  }
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactValidators = {
  name: (value) => {
    if (!String(value).trim()) {
      return "Enter your name so we know who to contact.";
    }
    return "";
  },
  email: (value) => {
    const email = String(value).trim();
    if (!email) {
      return "Enter your work email address.";
    }
    if (!EMAIL_PATTERN.test(email)) {
      return "Enter a valid email address (for example, name@company.com).";
    }
    return "";
  },
  message: (value) => {
    const message = String(value).trim();
    if (!message) {
      return "Tell us how we can help your team.";
    }
    if (message.length < 10) {
      return "Share at least 10 characters so we understand your request.";
    }
    return "";
  },
};

const validateContactField = (field, value) => {
  const validator = contactValidators[field];
  return validator ? validator(value ?? "") : "";
};

const validateContactForm = (state) =>
  Object.entries(contactValidators).reduce((issues, [field, validator]) => {
    const message = validator(state[field] ?? "");
    if (message) {
      issues[field] = message;
    }
    return issues;
  }, {});

const toTitleCase = (input = "") =>
  input
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

function getSmartPrefill(stored = {}) {
  if (typeof window === "undefined") return {};

  const guesses = {};
  const params = new URLSearchParams(window.location.search);
  const ref = (document.referrer || "").toLowerCase();

  const maybeSet = (key, value) => {
    if (value == null || value === "") return;
    if (stored[key] && String(stored[key]).trim()) return;
    guesses[key] = value;
  };

  const paramName = decodeParam(
    params.get("name") || params.get("full_name") || params.get("contact"),
  );
  maybeSet("name", paramName);

  const paramEmail = decodeParam(params.get("email") || params.get("user_email"));
  maybeSet("email", paramEmail);

  const paramTopic =
    decodeParam(params.get("topic")) ||
    decodeParam(params.get("use_case")) ||
    decodeParam(params.get("campaign"));
  if (paramTopic) {
    maybeSet("topic", toTitleCase(paramTopic));
  }

  const focusParam = decodeParam(params.get("focus") || params.get("need"));
  if (focusParam && !guesses.topic) {
    maybeSet("topic", toTitleCase(focusParam));
  }

  if (!guesses.topic) {
    if (ref.includes("pricing") || params.get("from") === "pricing") {
      maybeSet("topic", "Pricing and packaging");
    } else if (ref.includes("docs") || ref.includes("api")) {
      maybeSet("topic", "API integration support");
    } else if (ref.includes("case-studies") || ref.includes("customers")) {
      maybeSet("topic", "Customer success automation");
    }
  }

  const campaign = decodeParam(params.get("utm_campaign"));
  const company = decodeParam(params.get("company") || params.get("org"));
  const inferredCompany = company || decodeParam(params.get("account"));

  if (!stored.message || !stored.message.trim()) {
    if (campaign && campaign.toLowerCase().includes("migration")) {
      guesses.message = `Planning a migration for ${inferredCompany || "our team"} and want to understand integration requirements and support windows.`;
    } else if (ref.includes("pricing")) {
      guesses.message = `Reviewing pricing and packaging for ${inferredCompany || "our organization"}. We'd like a quick walkthrough of deployment effort and ROI benchmarks.`;
    } else if (paramTopic) {
      guesses.message = `Exploring ${paramTopic} automation for ${inferredCompany || "our team"}. Looking for setup guidance and recommended playbooks.`;
    }
  }

  const paramTimeline = decodeParam(params.get("timeline"));
  const now = new Date();
  const hour = now.getHours();
  const weekend = now.getDay() === 0 || now.getDay() === 6;
  if (!stored.timeline || stored.timeline === FORM_DEFAULTS.timeline) {
    if (paramTimeline) {
      maybeSet("timeline", paramTimeline);
    } else if (weekend || hour >= 18) {
      maybeSet("timeline", "next-quarter");
    } else if (hour < 10) {
      maybeSet("timeline", "immediate");
    } else {
      maybeSet("timeline", "this-quarter");
    }
  }

  const paramContact = decodeParam(params.get("contact_method") || params.get("channel"));
  if (!stored.contactMethod || stored.contactMethod === FORM_DEFAULTS.contactMethod) {
    if (paramContact.includes("slack")) {
      maybeSet("contactMethod", "slack");
    } else if (paramContact.includes("video") || paramContact.includes("call")) {
      maybeSet("contactMethod", "video-call");
    } else if (ref.includes("demo")) {
      maybeSet("contactMethod", "video-call");
    }
  }

  if (params.get("share_metrics") === "false") {
    maybeSet("shareMetrics", false);
  }

  return guesses;
}

export default function ContactPage() {
  const storedPreferences = useMemo(() => getStoredPreferences(), []);
  const [isHydrated, setIsHydrated] = useState(false);
  const smartDefaults = useMemo(
    () => (isHydrated ? getSmartPrefill(storedPreferences) : {}),
    [isHydrated, storedPreferences],
  );
  const baseInitialState = useMemo(
    () => ({ ...FORM_DEFAULTS, ...storedPreferences }),
    [storedPreferences],
  );

  const [formState, setFormState] = useState(baseInitialState);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(() => shouldOpenAdvanced(baseInitialState));
  const [topicHistory, setTopicHistory] = useState(() => getTopicHistory());
  const [activeHint, setActiveHint] = useState(null);
  const hesitationTimers = useRef({});
  const errorSummaryRef = useRef(null);
  const formInstanceId = useId();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !Object.keys(smartDefaults).length) {
      return;
    }

    setFormState((prev) => {
      const needsUpdate = Object.entries(smartDefaults).some(
        ([key, value]) => prev[key] !== value,
      );
      if (!needsUpdate) {
        return prev;
      }

      const nextState = { ...prev, ...smartDefaults };
      setShowAdvanced((current) => current || shouldOpenAdvanced(nextState));
      return nextState;
    });
  }, [isHydrated, smartDefaults]);
  
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;
    setFormState((prev) => ({ ...prev, [name]: nextValue }));
    stopHesitation(name);
    if (!errors[name]) {
      return;
    }

    const message = validateContactField(name, nextValue);
    setErrors((prev) => {
      const next = { ...prev };
      if (message) {
        next[name] = message;
      } else {
        delete next[name];
      }
      if (!Object.keys(next).length) {
        setStatus((current) => (current === "error" ? "" : current));
      }
      return next;
    });
  };

  const focusField = (field) => {
    if (typeof document === "undefined") return;
    const target = document.getElementById(`${formInstanceId}-${field}`);
    target?.focus();
  };

  const startHesitation = (field, value) => {
    if (
      (typeof value === "string" && value.trim().length) ||
      (typeof value === "boolean" && value)
    ) {
      return;
    }

    stopHesitation(field);
    hesitationTimers.current[field] = setTimeout(() => {
      setActiveHint(field);
    }, HESITATION_DELAY);
  };

  const stopHesitation = (field) => {
    const timer = hesitationTimers.current[field];
    if (timer) {
      clearTimeout(timer);
      delete hesitationTimers.current[field];
    }
    setActiveHint((current) => (current === field ? null : current));
  };

  const handleTopicSuggestion = (value) => {
    setFormState((prev) => ({ ...prev, topic: value }));
    stopHesitation("topic");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationIssues = validateContactForm(formState);
    if (Object.keys(validationIssues).length) {
      setErrors(validationIssues);
      setStatus("error");
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    setErrors({});
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setFormState((prev) => ({
      ...prev,
      topic: "",
      message: "",
    }));

    if (formState.topic.trim()) {
      const nextTopics = [formState.topic.trim(), ...topicHistory.filter((item) => item !== formState.topic.trim())].slice(0, 5);
      setTopicHistory(nextTopics);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOPIC_HISTORY_KEY, JSON.stringify(nextTopics));
      }
    }

    setTimeout(() => setStatus(""), 2500);
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const preferenceSnapshot = {
      name: formState.name,
      email: formState.email,
      contactMethod: formState.contactMethod,
      timeline: formState.timeline,
      shareMetrics: formState.shareMetrics,
    };
    const persist = window.setTimeout(() => {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferenceSnapshot));
    }, 150);

    return () => window.clearTimeout(persist);
  }, [
    formState.name,
    formState.email,
    formState.contactMethod,
    formState.timeline,
    formState.shareMetrics,
  ]);

  useEffect(() => {
    const timers = hesitationTimers.current;
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (showAdvanced) return;
    const topic = formState.topic.toLowerCase();
    if (!topic) return;
    if (["integration", "api", "workflow", "security"].some((keyword) => topic.includes(keyword))) {
      setShowAdvanced(true);
    }
  }, [formState.topic, showAdvanced]);

  const errorEntries = Object.entries(errors);
  const feedbackMessage =
    status === "success"
      ? "Thanks! We'll reach out shortly."
      : status === "error"
        ? "Please correct the highlighted fields before resubmitting."
        : "";

  const nameFieldId = `${formInstanceId}-name`;
  const emailFieldId = `${formInstanceId}-email`;
  const topicFieldId = `${formInstanceId}-topic`;
  const messageFieldId = `${formInstanceId}-message`;
  const nameHintId = `${nameFieldId}-hint`;
  const emailHintId = `${emailFieldId}-hint`;
  const topicHintId = `${topicFieldId}-hint`;
  const messageHintId = `${messageFieldId}-hint`;
  const messageErrorId = `${messageFieldId}-error`;

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: `0 auto ${space("xl")}`, textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm") }}>Contact our team</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Tell us about your automation initiative and we'll craft a tailored success plan.
        </p>
      </header>

      <section className="glass" style={{ padding: space("lg"), borderRadius: "16px" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: space("fluid-sm") }}>
          {errorEntries.length > 0 && (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              role="alert"
              aria-live="assertive"
              style={{
                display: "grid",
                gap: space("2xs", 1.5),
                padding: space("sm"),
                borderRadius: "12px",
                border: "1px solid rgba(248, 113, 113, 0.6)",
                background: "rgba(127, 29, 29, 0.35)",
                color: "#fecaca",
              }}
            >
              <strong>We couldn't submit the form. Please review the highlighted fields:</strong>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: space("3xs") }}>
                {errorEntries.map(([field, message]) => (
                  <li key={field}>
                    <button
                      type="button"
                      onClick={() => focusField(field)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "#bfdbfe",
                        textDecoration: "underline",
                        cursor: "pointer",
                        font: "inherit",
                      }}
                    >
                      {message}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: "grid", gap: space("xs") }}>
            <Input
              label="Name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              onFocus={() => startHesitation("name", formState.name)}
              onBlur={() => stopHesitation("name")}
              required
              id={nameFieldId}
              aria-describedby={nameHintId}
              error={errors.name}
            />
            <FieldHint id={nameHintId} visible={activeHint === "name"}>
              {hints.name}
            </FieldHint>
          </div>
          <div style={{ display: "grid", gap: space("xs") }}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              onFocus={() => startHesitation("email", formState.email)}
              onBlur={() => stopHesitation("email")}
              required
              id={emailFieldId}
              aria-describedby={emailHintId}
              error={errors.email}
            />
            <FieldHint id={emailHintId} visible={activeHint === "email"}>
              {hints.email}
            </FieldHint>
          </div>
          <div style={{ display: "grid", gap: space("xs") }}>
            <Input
              label="Topic"
              name="topic"
              value={formState.topic}
              onChange={handleChange}
              onFocus={() => startHesitation("topic", formState.topic)}
              onBlur={() => stopHesitation("topic")}
              placeholder="Deployment, pricing, partnership..."
              id={topicFieldId}
              aria-describedby={topicHintId}
            />
            <FieldHint id={topicHintId} visible={activeHint === "topic"}>
              {hints.topic}
            </FieldHint>
            {!!topicHistory.length && (
              <div style={suggestionRowStyle}>
                <span style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>Recent topics:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: space("xs") }}>
                  {topicHistory.map((topic) => (
                    <Button
                      key={topic}
                      type="button"
                      size="sm"
                      variant="secondary"
                      glowOnHover={false}
                      magnetic={false}
                      style={chipStyle}
                      onClick={() => handleTopicSuggestion(topic)}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "grid", gap: space("xs") }}>
            <label htmlFor={messageFieldId} style={{ display: "grid", gap: space("2xs", 1.5) }}>
              <span>Message</span>
              <textarea
                id={messageFieldId}
                name="message"
                value={formState.message}
                onChange={handleChange}
                onFocus={() => startHesitation("message", formState.message)}
                onBlur={() => stopHesitation("message")}
                rows={4}
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={
                  [messageHintId, errors.message ? messageErrorId : null].filter(Boolean).join(" ") || undefined
                }
                style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
              />
            </label>
            {errors.message && (
              <p
                id={messageErrorId}
                role="alert"
                aria-live="assertive"
                style={errorTextStyle}
              >
                {errors.message}
              </p>
            )}
            <FieldHint id={messageHintId} visible={activeHint === "message"}>
              {hints.message}
            </FieldHint>
          </div>

          <div style={{ display: "grid", gap: space("xs", 1.5) }}>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              glowOnHover={false}
              magnetic={false}
              style={{
                justifySelf: "flex-start",
                padding: `${space("xs")} ${space("xs", 1.75)}`,
                borderRadius: "10px",
                background: "rgba(148, 163, 184, 0.15)",
                color: "var(--gray-100)",
              }}
              onClick={() => setShowAdvanced((prev) => !prev)}
            >
              {showAdvanced ? "Hide advanced planning" : "Add rollout preferences"}
            </Button>

            {showAdvanced && (
              <div
                className="glass"
                style={{
                  display: "grid",
                  gap: space("sm"),
                  padding: space("fluid-sm"),
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.55)",
                }}
              >
                <label style={{ display: "grid", gap: space("2xs", 1.5) }}>
                  <span>Preferred contact method</span>
                  <select
                    name="contactMethod"
                    value={formState.contactMethod}
                    onChange={handleChange}
                    onFocus={() => startHesitation("contactMethod", formState.contactMethod)}
                    onBlur={() => stopHesitation("contactMethod")}
                    aria-describedby={`${formInstanceId}-contactMethod-hint`}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="email">Email</option>
                    <option value="video-call">Video call</option>
                    <option value="slack">Shared Slack channel</option>
                  </select>
                  <FieldHint id={`${formInstanceId}-contactMethod-hint`} visible={activeHint === "contactMethod"}>
                    {hints.contactMethod}
                  </FieldHint>
                </label>

                <label style={{ display: "grid", gap: space("2xs", 1.5) }}>
                  <span>Implementation timeline</span>
                  <select
                    name="timeline"
                    value={formState.timeline}
                    onChange={handleChange}
                    onFocus={() => startHesitation("timeline", formState.timeline)}
                    onBlur={() => stopHesitation("timeline")}
                    aria-describedby={`${formInstanceId}-timeline-hint`}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="immediate">Ready to start this month</option>
                    <option value="this-quarter">Planning this quarter</option>
                    <option value="next-quarter">Exploring for next quarter</option>
                    <option value="no-rush">Gathering information</option>
                  </select>
                  <FieldHint id={`${formInstanceId}-timeline-hint`} visible={activeHint === "timeline"}>
                    {hints.timeline}
                  </FieldHint>
                </label>

                <label style={{ display: "flex", gap: space("xs", 1.5), alignItems: "flex-start" }}>
                  <input
                    type="checkbox"
                    name="shareMetrics"
                    checked={formState.shareMetrics}
                    onChange={handleChange}
                    onFocus={() => startHesitation("shareMetrics", formState.shareMetrics)}
                    onBlur={() => stopHesitation("shareMetrics")}
                    style={{ marginTop: space("2xs") }}
                    aria-describedby={`${formInstanceId}-shareMetrics-hint`}
                  />
                  <span style={{ display: "grid", gap: space("2xs") }}>
                    <span>Share automation performance metrics</span>
                    <span style={{ color: "var(--gray-400)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                      This helps our solutions team benchmark improvements against similar deployments.
                    </span>
                    <FieldHint id={`${formInstanceId}-shareMetrics-hint`} visible={activeHint === "shareMetrics"}>
                      {hints.shareMetrics}
                    </FieldHint>
                  </span>
                </label>
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="md"
            variant="primary"
            disabled={status === "loading"}
            style={{ padding: `${space("xs", 1.5)} ${space("fluid-sm")}`, borderRadius: "12px" }}
          >
            <span>{status === "loading" ? "Sending..." : "Submit"}</span>
          </Button>

          <div aria-live="polite" style={{ color: status === "success" ? "#34d399" : "var(--gray-400)" }}>
            {feedbackMessage}
          </div>
        </form>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: `${space("xs", 1.5)} ${space("sm")}`,
  borderRadius: "12px",
  border: "1px solid rgba(148, 163, 184, 0.32)",
  background: "rgba(15, 23, 42, 0.7)",
  color: "var(--white)",
};

const hintStyle = {
  color: "var(--gray-400)",
  fontSize: "0.85rem",
  lineHeight: 1.5,
};

const errorTextStyle = {
  color: "#fca5a5",
  fontSize: "0.85rem",
  margin: 0,
};

const suggestionRowStyle = {
  display: "grid",
  gap: space("2xs", 1.5),
};

const chipStyle = {
  padding: `${space("2xs", 1.5)} ${space("xs", 1.5)}`,
  borderRadius: "999px",
  background: "rgba(99, 102, 241, 0.16)",
  border: "1px solid rgba(99, 102, 241, 0.35)",
  color: "var(--gray-050)",
};

function FieldHint({ id, visible, children }) {
  if (!visible) return null;
  return (
    <p id={id} role="status" aria-live="polite" style={hintStyle}>
      {children}
    </p>
  );
}