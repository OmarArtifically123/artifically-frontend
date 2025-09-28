import { useEffect, useMemo, useRef, useState } from "react";

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

export default function Contact() {
  const initialFormState = useMemo(
    () => ({ ...FORM_DEFAULTS, ...getStoredPreferences() }),
    []
  );

  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(() => shouldOpenAdvanced(initialFormState));
  const [topicHistory, setTopicHistory] = useState(() => getTopicHistory());
  const [activeHint, setActiveHint] = useState(null);
  const hesitationTimers = useRef({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    stopHesitation(name);
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
    return () => {
      Object.values(hesitationTimers.current).forEach((timer) => clearTimeout(timer));
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

  return (
    <main className="container" style={{ padding: "64px 0", minHeight: "80vh" }}>
      <header style={{ maxWidth: "720px", margin: "0 auto 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: "16px" }}>Contact our team</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Tell us about your automation initiative and we'll craft a tailored success plan.
        </p>
      </header>

      <section className="glass" style={{ padding: "32px", borderRadius: "16px" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              onFocus={() => startHesitation("name", formState.name)}
              onBlur={() => stopHesitation("name")}
              required
              style={inputStyle}
            />
            <FieldHint visible={activeHint === "name"}>{hints.name}</FieldHint>
          </label>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              onFocus={() => startHesitation("email", formState.email)}
              onBlur={() => stopHesitation("email")}
              required
              style={inputStyle}
            />
            <FieldHint visible={activeHint === "email"}>{hints.email}</FieldHint>
          </label>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Topic</span>
            <input
              type="text"
              name="topic"
              value={formState.topic}
              onChange={handleChange}
              onFocus={() => startHesitation("topic", formState.topic)}
              onBlur={() => stopHesitation("topic")}
              placeholder="Deployment, pricing, partnership..."
              style={inputStyle}
            />
            <FieldHint visible={activeHint === "topic"}>{hints.topic}</FieldHint>
            {!!topicHistory.length && (
              <div style={suggestionRowStyle}>
                <span style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>Recent topics:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {topicHistory.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicSuggestion(topic)}
                      className="btn"
                      style={chipStyle}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </label>
          <label style={{ display: "grid", gap: "8px" }}>
            <span>Message</span>
            <textarea
              name="message"
              value={formState.message}
              onChange={handleChange}
              onFocus={() => startHesitation("message", formState.message)}
              onBlur={() => stopHesitation("message")}
              rows={4}
              style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
            />
            <FieldHint visible={activeHint === "message"}>{hints.message}</FieldHint>
          </label>

          <div style={{ display: "grid", gap: "12px" }}>
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className="btn"
              style={{
                justifySelf: "flex-start",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "rgba(148, 163, 184, 0.15)",
                color: "var(--gray-100)",
              }}
            >
              {showAdvanced ? "Hide advanced planning" : "Add rollout preferences"}
            </button>

            {showAdvanced && (
              <div
                className="glass"
                style={{
                  display: "grid",
                  gap: "16px",
                  padding: "20px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.55)",
                }}
              >
                <label style={{ display: "grid", gap: "6px" }}>
                  <span>Preferred contact method</span>
                  <select
                    name="contactMethod"
                    value={formState.contactMethod}
                    onChange={handleChange}
                    onFocus={() => startHesitation("contactMethod", formState.contactMethod)}
                    onBlur={() => stopHesitation("contactMethod")}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="email">Email</option>
                    <option value="video-call">Video call</option>
                    <option value="slack">Shared Slack channel</option>
                  </select>
                  <FieldHint visible={activeHint === "contactMethod"}>{hints.contactMethod}</FieldHint>
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <span>Implementation timeline</span>
                  <select
                    name="timeline"
                    value={formState.timeline}
                    onChange={handleChange}
                    onFocus={() => startHesitation("timeline", formState.timeline)}
                    onBlur={() => stopHesitation("timeline")}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="immediate">Ready to start this month</option>
                    <option value="this-quarter">Planning this quarter</option>
                    <option value="next-quarter">Exploring for next quarter</option>
                    <option value="no-rush">Gathering information</option>
                  </select>
                  <FieldHint visible={activeHint === "timeline"}>{hints.timeline}</FieldHint>
                </label>

                <label style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <input
                    type="checkbox"
                    name="shareMetrics"
                    checked={formState.shareMetrics}
                    onChange={handleChange}
                    onFocus={() => startHesitation("shareMetrics", formState.shareMetrics)}
                    onBlur={() => stopHesitation("shareMetrics")}
                    style={{ marginTop: "4px" }}
                  />
                  <span style={{ display: "grid", gap: "4px" }}>
                    <span>Share automation performance metrics</span>
                    <span style={{ color: "var(--gray-400)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                      This helps our solutions team benchmark improvements against similar deployments.
                    </span>
                    <FieldHint visible={activeHint === "shareMetrics"}>{hints.shareMetrics}</FieldHint>
                  </span>
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
            style={{ padding: "12px 20px", borderRadius: "12px" }}
          >
            {status === "loading" ? "Sending..." : "Submit"}
          </button>

          <div aria-live="polite" style={{ color: status === "success" ? "#34d399" : "var(--gray-400)" }}>
            {status === "success" && "Thanks! We'll reach out shortly."}
          </div>
        </form>
      </section>
    </main>
  );
}

const inputStyle = {
  padding: "12px 16px",
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

const suggestionRowStyle = {
  display: "grid",
  gap: "6px",
};

const chipStyle = {
  padding: "6px 12px",
  borderRadius: "999px",
  background: "rgba(99, 102, 241, 0.16)",
  border: "1px solid rgba(99, 102, 241, 0.35)",
  color: "var(--gray-050)",
};

function FieldHint({ visible, children }) {
  if (!visible) return null;
  return (
    <p role="status" style={hintStyle}>
      {children}
    </p>
  );
}