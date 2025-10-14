import { useEffect, useMemo, useState } from "react";
import { fetchAutomations } from "../data/automations";
import { toast } from "../components/Toast";

const categories = ["All", "Sales", "Support", "Operations", "Finance", "Marketing"];

export default function Marketplace() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("trending");
  const [featured, setFeatured] = useState(null);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchAutomations()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setAutomations(list);
        setFeatured(list[0] ?? null);
      })
      .catch((error) => {
        console.error(error);
        toast("Unable to load automations", { type: "error" });
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredAutomations = useMemo(() => {
    let list = automations;
    if (activeCategory !== "All") {
      list = list.filter((automation) => {
        const category = (automation.category || automation.vertical || "").toLowerCase();
        return category.includes(activeCategory.toLowerCase());
      });
    }
    if (search) {
      const query = search.toLowerCase();
      list = list.filter((automation) =>
        [automation.name, automation.description, ...(automation.tags || [])]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query)),
      );
    }

    const sorted = [...list];
    if (sort === "roi") {
      sorted.sort((a, b) => (b.roi || 0) - (a.roi || 0));
    } else if (sort === "new") {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    return sorted;
  }, [activeCategory, automations, search, sort]);

  return (
    <main className="marketplace-shell">
      <header className="section-header">
        <span className="section-eyebrow">Automation Marketplace</span>
        <h1 className="section-title">Discover battle-tested automations</h1>
        <p className="section-subtitle">
          Evaluate interactive demos, compare ROI, and launch pre-built automations built by Artifically's enterprise experts.
        </p>
      </header>

      <div className="filter-bar" role="search">
        <label htmlFor="automation-search" className="sr-only">
          Search automations
        </label>
        <input
          id="automation-search"
          type="search"
          placeholder="Search automations..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="filter-group" role="tablist" aria-label="Automation categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="filter-chip"
              data-active={category === activeCategory}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <select
          aria-label="Sort automations"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "999px",
            border: "1px solid color-mix(in oklch, white 12%, transparent)",
            background: "color-mix(in oklch, var(--glass-3) 70%, transparent)",
            color: "white",
          }}
        >
          <option value="trending">Trending</option>
          <option value="roi">Highest ROI</option>
          <option value="new">Newest</option>
        </select>
      </div>

      {featured && (
        <article className="featured-card" aria-labelledby="featured-title">
          <div className="featured-card__preview">
            <SpotlightPreview automation={featured} />
          </div>
          <div className="featured-card__details">
            <span style={{ padding: "0.45rem 0.9rem", borderRadius: "999px", border: "1px solid color-mix(in oklch, white 12%, transparent)", width: "fit-content", background: "color-mix(in oklch, var(--glass-2) 70%, transparent)", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.75rem", color: "color-mix(in oklch, white 75%, var(--gray-300))" }}>
              Featured
            </span>
            <h2 id="featured-title" style={{ fontSize: "2rem", color: "white" }}>{featured.name}</h2>
            <p style={{ color: "color-mix(in oklch, white 78%, var(--gray-200))" }}>{featured.description}</p>
            <div className="metrics-row">
              <Metric icon="⚡" label="Avg ROI" value={`${featured.roi ?? 4.8}x`} />
              <Metric icon="⏱" label="Time to deploy" value={featured.timeToDeploy ?? "45 min"} />
              <Metric icon="🧠" label="AI coverage" value={featured.aiCoverage ?? "Full"} />
            </div>
            <div className="cta-group">
              <button type="button" className="cta-primary" onClick={() => setQuickView(featured)}>
                Try Demo
              </button>
              <button type="button" className="cta-secondary" onClick={() => setQuickView(featured)}>
                Learn More
              </button>
            </div>
          </div>
        </article>
      )}

      <section aria-live="polite">
        {loading ? (
          <p>Loading automations…</p>
        ) : (
          <div className="automation-grid">
            {filteredAutomations.map((automation) => (
              <button
                key={automation.id}
                type="button"
                className="automation-card"
                onClick={() => setQuickView(automation)}
              >
                <span style={{ fontSize: "1.5rem" }}>⚙️</span>
                <strong style={{ fontSize: "1.15rem", color: "white" }}>{automation.name}</strong>
                <p style={{ color: "color-mix(in oklch, white 78%, var(--gray-200))", fontSize: "0.95rem" }}>
                  {automation.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", color: "color-mix(in oklch, white 70%, var(--gray-300))", fontSize: "0.8rem" }}>
                  {(automation.tags || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "0.2rem 0.55rem",
                        borderRadius: "999px",
                        background: "color-mix(in oklch, var(--glass-3) 75%, transparent)",
                        border: "1px solid color-mix(in oklch, white 12%, transparent)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {quickView && (
        <QuickViewModal automation={quickView} onClose={() => setQuickView(null)} />
      )}
    </main>
  );
}

function SpotlightPreview({ automation }) {
  return (
    <div
      style={{
        borderRadius: "28px",
        padding: "2rem",
        border: "1px solid color-mix(in oklch, white 12%, transparent)",
        background:
          "linear-gradient(150deg, color-mix(in oklch, var(--brand-primary) 25%, transparent) 0%, color-mix(in oklch, var(--brand-depth) 85%, black) 100%)",
        minHeight: "260px",
        display: "grid",
        gap: "1.5rem",
        color: "color-mix(in oklch, white 80%, var(--gray-200))",
      }}
    >
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <span style={{ fontSize: "2.5rem" }}>🌀</span>
        <div>
          <strong style={{ color: "white", fontSize: "1.25rem" }}>{automation.name}</strong>
          <p style={{ fontSize: "0.95rem" }}>Out-of-the-box orchestration with smart branching.</p>
        </div>
      </div>
      <ul style={{ display: "grid", gap: "0.5rem", paddingLeft: "1.1rem" }}>
        <li>Guided quickstart with live sample data</li>
        <li>Telemetry overlay reveals ROI impact in real-time</li>
        <li>Collaboration layer for approvals and notes</li>
      </ul>
    </div>
  );
}

function QuickViewModal({ automation, onClose }) {
  return (
    <div className="quick-view-backdrop" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
      <div className="quick-view-modal">
        <div className="quick-view-visual">
          <header style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.75rem", color: "color-mix(in oklch, white 70%, var(--gray-300))" }}>
              Interactive Demo
            </span>
            <h2 id="quick-view-title" style={{ fontSize: "1.8rem", color: "white" }}>
              {automation.name}
            </h2>
          </header>
          <div
            style={{
              marginTop: "1rem",
              borderRadius: "20px",
              border: "1px solid color-mix(in oklch, white 12%, transparent)",
              background:
                "radial-gradient(circle at 30% 20%, color-mix(in oklch, var(--brand-glow) 35%, transparent) 0%, transparent 60%)," +
                "linear-gradient(180deg, color-mix(in oklch, var(--brand-depth) 80%, black) 0%, color-mix(in oklch, var(--brand-muted) 25%, black) 100%)",
              minHeight: "240px",
              display: "grid",
              placeItems: "center",
              color: "white",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <p>Live workflow preview renders here with synthetic data and guardrails enabled.</p>
          </div>
        </div>
        <div className="quick-view-details">
          <p style={{ color: "color-mix(in oklch, white 78%, var(--gray-200))" }}>{automation.description}</p>
          <div className="metric-grid">
            <Metric icon="⚡" label="ROI" value={`${automation.roi ?? 3.8}x`} />
            <Metric icon="⌛" label="Time saved" value={`${automation.timeSaved ?? 36} hrs/week`} />
            <Metric icon="📦" label="Integrations" value={(automation.integrations || []).slice(0, 2).join(", ") || "10+"} />
          </div>
          <div className="roi-calculator">
            <strong style={{ color: "white", fontSize: "1.1rem" }}>ROI Calculator</strong>
            <p>Based on your team size and hourly rate, this automation could save:</p>
            <RoiResult roi={automation.roi} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="button" className="cta-primary" onClick={onClose}>
              Launch Pilot
            </button>
            <button type="button" className="cta-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoiResult({ roi }) {
  const roiValue = Number.isFinite(roi) ? roi : 4.2;
  const savings = Math.round(roiValue * 1240);

  return (
    <div className="roi-result">
      <span style={{ fontSize: "2rem", color: "white" }}>${savings.toLocaleString()}</span>
      <span>Estimated monthly savings</span>
      <ul style={{ display: "grid", gap: "0.35rem", paddingLeft: "1.1rem" }}>
        <li>Time saved: 40 hrs per week</li>
        <li>Projected ROI: {roiValue.toFixed(1)}x</li>
      </ul>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      <span aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}