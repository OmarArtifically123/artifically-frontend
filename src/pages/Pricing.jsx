import { useEffect, useMemo, useState, useRef } from "react";
import gsap from "gsap";
import { fetchAutomations } from "../data/automations";
import { toast } from "../components/Toast";

const billingOptions = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly (save 20%)" },
];

const caseStudies = [
  {
    customer: "Nova Retail",
    story: "Automated 12 merchandising workflows across regions",
    automation: "Inventory Orchestrator",
    result: "+28% sell-through in 8 weeks",
  },
  {
    customer: "Mercury Labs",
    story: "Connected revops stack with revenue loop",
    automation: "Revenue Loop",
    result: "$420k pipeline reactivated",
  },
  {
    customer: "Atlas Support",
    story: "Scaled AI-first support triage globally",
    automation: "Support Coach",
    result: "40% faster resolution",
  },
];

const faqItems = [
  {
    question: "How does billing work?",
    answer:
      "Pick monthly or yearly. Yearly plans include a 20% discount and lock pricing for the contract term.",
  },
  {
    question: "Can I upgrade or downgrade at any time?",
    answer:
      "Yes. Automations are billed pro-rata. Scale usage up or pause automations without hidden fees.",
  },
  {
    question: "What support is included?",
    answer:
      "Every plan includes 24/7 priority support, shared Slack channel access, and quarterly architecture reviews.",
  },
  {
    question: "Do you offer pilots?",
    answer:
      "Enterprise teams can launch a 30-day pilot with production parity, including SOC 2 reports and DPA.",
  },
];

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function useGsapAccordion(ref, isOpen) {
  const timelineRef = useRef();

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") {
      return;
    }

    if (!timelineRef.current) {
      timelineRef.current = gsap
        .timeline({ paused: true })
        .fromTo(
          ref.current,
          { height: 0, opacity: 0, display: "none" },
          { height: "auto", opacity: 1, display: "block", duration: 0.4, ease: "power2.out" }
        );
    }

    if (isOpen) {
      timelineRef.current.play();
    } else {
      timelineRef.current.reverse();
    }
  }, [isOpen, ref]);
}

function FaqAccordion({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);
  useGsapAccordion(contentRef, isOpen);

  return (
    <article
      className="glass"
      style={{
        borderRadius: "1.25rem",
        padding: "1.25rem 1.5rem",
        border: `1px solid ${isOpen ? "rgba(99,102,241,0.3)" : "rgba(148,163,184,0.15)"}`,
        transition: "border-color 0.2s ease",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          background: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: "1rem",
          cursor: "pointer",
          color: "inherit",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "1rem" }}>{question}</span>
        <span style={{ transform: `rotate(${isOpen ? 90 : 0}deg)`, transition: "transform 0.3s ease" }}>➔</span>
      </button>
      <div
        ref={contentRef}
        style={{
          overflow: "hidden",
          marginTop: "0.9rem",
          color: "var(--gray-400)",
          lineHeight: 1.6,
          fontSize: "0.95rem",
        }}
      >
        {answer}
      </div>
    </article>
  );
}

export default function Pricing() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [automationCount, setAutomationCount] = useState(6);
  const [hoursSaved, setHoursSaved] = useState(40);
  const [faqOpen, setFaqOpen] = useState(faqItems[0].question);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const list = await fetchAutomations();
        setAutomations(Array.isArray(list) ? list : []);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load pricing information";
        toast(msg, { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  const averageMonthlyPrice = useMemo(() => {
    if (!automations.length) {
      return 240;
    }
    const sum = automations.reduce((total, item) => total + (item.priceMonthly || 0), 0);
    return Math.round(sum / automations.length);
  }, [automations]);

  const sliderPrice = useMemo(() => {
    const monthly = automationCount * averageMonthlyPrice;
    if (billingCycle === "monthly") {
      return monthly;
    }
    return monthly * 12 * 0.8;
  }, [automationCount, averageMonthlyPrice, billingCycle]);

  const roiMonthly = useMemo(() => {
    const hourlyValue = 85;
    const monthlyHours = hoursSaved * 4;
    return monthlyHours * hourlyValue;
  }, [hoursSaved]);

  const tierPrice = (automation) => {
    const base = automation.priceMonthly || averageMonthlyPrice;
    if (billingCycle === "monthly") {
      return base;
    }
    return Math.round(base * 12 * 0.8);
  };

  return (
    <main
      className="container"
      style={{ padding: "56px 0 96px", minHeight: "80vh", display: "grid", gap: "3rem" }}
    >
      <section style={{ textAlign: "center", display: "grid", gap: "1.5rem" }}>
        <span style={{ color: "#6366f1", fontSize: "0.85rem", letterSpacing: "0.08em" }}>Pricing</span>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800 }}>Predictable pricing for automation scale</h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1.1rem", maxWidth: "720px", margin: "0 auto" }}>
          Inspired by Stripe-level clarity. Choose your plan, launch your automations, and grow without worrying about
          surprise overages.
        </p>
        <div
          style={{
            display: "inline-flex",
            background: "rgba(99,102,241,0.08)",
            borderRadius: "999px",
            padding: "0.35rem",
            gap: "0.35rem",
            margin: "0 auto",
          }}
        >
          {billingOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setBillingCycle(option.id)}
              style={{
                border: "none",
                cursor: "pointer",
                borderRadius: "999px",
                padding: "0.55rem 1.4rem",
                fontWeight: 600,
                background: billingCycle === option.id ? "#6366f1" : "transparent",
                color: billingCycle === option.id ? "#f8fafc" : "#6366f1",
                transition: "all 0.2s ease",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {loading
          ? [1, 2, 3].map((index) => (
              <div key={index} className="glass" style={{ borderRadius: "1.5rem", padding: "2.5rem" }}>
                <div className="loading" style={{ width: "36px", height: "36px", marginBottom: "1.5rem" }}></div>
                <div
                  style={{
                    height: "12px",
                    background: "rgba(148,163,184,0.15)",
                    borderRadius: "999px",
                    marginBottom: "0.75rem",
                  }}
                ></div>
                <div
                  style={{
                    height: "12px",
                    background: "rgba(148,163,184,0.1)",
                    borderRadius: "999px",
                    width: "70%",
                  }}
                ></div>
              </div>
            ))
          : automations.map((automation) => {
              const price = tierPrice(automation);
              const isYearly = billingCycle === "yearly";
              return (
                <div
                  key={automation.id}
                  className="glass"
                  style={{
                    borderRadius: "1.5rem",
                    padding: "2.5rem",
                    display: "grid",
                    gap: "1.25rem",
                    border: "1px solid rgba(99,102,241,0.2)",
                    boxShadow: "0 35px 80px rgba(15,23,42,0.25)",
                  }}
                >
                  <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>{automation.name}</div>
                  <p style={{ color: "var(--gray-400)", lineHeight: 1.7 }}>{automation.description}</p>
                  <div>
                    <span style={{ fontSize: "2.4rem", fontWeight: 800, color: "#6366f1" }}>
                      {formatCurrency(price, automation.currency)}
                    </span>
                    <span style={{ color: "var(--gray-400)", marginLeft: "0.35rem" }}>
                      {isYearly ? "/year" : "/month"}
                    </span>
                  </div>
                  <ul
                    style={{
                      color: "var(--gray-300)",
                      lineHeight: 1.6,
                      paddingLeft: "1.1rem",
                      display: "grid",
                      gap: "0.4rem",
                    }}
                  >
                    {(automation.highlights || []).slice(0, 3).map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <button className="btn btn-primary" style={{ justifySelf: "flex-start" }}>
                    Start for Free →
                  </button>
                </div>
              );
            })}
      </section>

      <section
        className="glass"
        style={{
          borderRadius: "1.5rem",
          padding: "2.5rem",
          display: "grid",
          gap: "2rem",
          alignItems: "center",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <div style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Interactive calculator</h2>
          <p style={{ color: "var(--gray-400)", lineHeight: 1.7 }}>
            Slide to match your automation volume. Pricing updates instantly so you can model new rollouts with
            confidence.
          </p>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <label htmlFor="automation-count" style={{ fontWeight: 600 }}>
              Automations: {automationCount}
            </label>
            <input
              id="automation-count"
              type="range"
              min="1"
              max="50"
              value={automationCount}
              onChange={(event) => setAutomationCount(Number(event.target.value))}
            />
            <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              {formatCurrency(sliderPrice, "USD")} {billingCycle === "yearly" ? "/year" : "/month"}
            </div>
            <span style={{ color: "var(--gray-400)", fontSize: "0.9rem" }}>
              Includes orchestration, monitoring, and 24/7 support.
            </span>
          </div>
        </div>
        <div
          style={{
            background: "rgba(99,102,241,0.08)",
            borderRadius: "1.25rem",
            padding: "1.5rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <h3 style={{ margin: 0 }}>ROI snapshot</h3>
          <label htmlFor="hours-saved" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
            Hours saved per week: {hoursSaved}
          </label>
          <input
            id="hours-saved"
            type="range"
            min="5"
            max="120"
            step="5"
            value={hoursSaved}
            onChange={(event) => setHoursSaved(Number(event.target.value))}
          />
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#10b981" }}>
            {formatCurrency(roiMonthly, "USD")} /month in team capacity
          </div>
          <p style={{ color: "var(--gray-400)", margin: 0 }}>
            Based on blended hourly rate of $85 and four weeks per month. Adjust to your team inputs to build your ROI
            model.
          </p>
        </div>
      </section>

      <section style={{ display: "grid", gap: "1.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Teams scaling with Artifically</h2>
        <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {caseStudies.map((item) => (
            <article
              key={item.customer}
              className="glass"
              style={{ borderRadius: "1.5rem", padding: "2rem", display: "grid", gap: "0.75rem" }}
            >
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{item.customer}</div>
              <p style={{ color: "var(--gray-400)", margin: 0 }}>{item.story}</p>
              <div style={{ color: "#6366f1", fontWeight: 600 }}>{item.automation}</div>
              <span style={{ color: "#10b981", fontWeight: 600 }}>{item.result}</span>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Questions</h2>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {faqItems.map((item) => (
            <FaqAccordion
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={faqOpen === item.question}
              onToggle={() => setFaqOpen((prev) => (prev === item.question ? null : item.question))}
            />
          ))}
        </div>
      </section>

      <section
        style={{
          borderRadius: "1.75rem",
          padding: "3rem",
          textAlign: "center",
          background: "linear-gradient(120deg, rgba(99,102,241,0.85), rgba(14,165,233,0.85))",
          color: "#f8fafc",
          display: "grid",
          gap: "1rem",
        }}
      >
        <h2 style={{ fontSize: "2.1rem", fontWeight: 800 }}>Ready to orchestrate your automations?</h2>
        <p style={{ maxWidth: "560px", margin: "0 auto", fontSize: "1.05rem" }}>
          Start for free, deploy your first automation, and scale with full observability and enterprise guardrails.
        </p>
        <button className="btn btn-primary" style={{ justifySelf: "center" }}>
          Deploy Your First Automation
        </button>
      </section>
    </main>
  );
}