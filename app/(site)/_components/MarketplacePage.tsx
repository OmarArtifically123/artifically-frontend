// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fetchAutomations } from "@/data/automations";
import { toast } from "@/components/Toast";
import ProductPreview3D from "@/components/landing/ProductPreview3D";
import { calculateSavings } from "@/utils/calculateSavings";
import ROICalculator from "@/components/roi/ROICalculator";
import AssistiveHint from "@/components/ui/AssistiveHint";
import { Icon } from "@/components/icons";
import useInViewState from "@/hooks/useInViewState";
import motionCatalog from "@/design/motion/catalog";

const categories = ["All", "Sales", "Support", "Operations", "Finance", "Marketing"];
const FILTER_STORAGE_KEY = "artifically:marketplace:filters";

export default function MarketplacePage() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("trending");
  const [featured, setFeatured] = useState(null);
  const [quickView, setQuickView] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(0);
  const [filtersHydrated, setFiltersHydrated] = useState(false);
  const suggestionIdPrefix = useId();
  const filterRefs = useRef([]);
  const cardRefs = useRef([]);
  const searchFieldBlurTimeout = useRef();
  const suggestionListRef = useRef(null);
  const queryAppliedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [featuredRef, featuredInView] = useInViewState({ threshold: 0.35, rootMargin: "-120px", once: true });
  const [gridRef, gridInView] = useInViewState({ threshold: 0.2, rootMargin: "-80px", once: true });

  const featuredVariants = useMemo(() => {
    const hidden = { opacity: 0 };
    if (!prefersReducedMotion) {
      hidden.y = 18;
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

  const gridContainerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: motionCatalog.durations.short,
          ease: motionCatalog.easings.out,
        },
      },
    }),
    [],
  );

  const gridItemVariants = useMemo(() => {
    const hiddenState = { opacity: 0 };
    if (!prefersReducedMotion) {
      hiddenState.y = 14;
    }
    return {
      hidden: hiddenState,
      visible: (index = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
          duration: motionCatalog.durations.short,
          ease: motionCatalog.easings.out,
          delay: Math.min(0.36, index * motionCatalog.durations.stagger),
        },
      }),
    };
  }, [prefersReducedMotion]);

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

  useEffect(() => {
    return () => {
      if (searchFieldBlurTimeout.current) {
        clearTimeout(searchFieldBlurTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setFiltersHydrated(true);
      return;
    }
    try {
      const stored = window.localStorage.getItem(FILTER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed?.search === "string") {
          setSearch(parsed.search);
        }
        if (typeof parsed?.category === "string") {
          setActiveCategory(parsed.category);
        }
        if (typeof parsed?.sort === "string") {
          setSort(parsed.sort);
        }
      }
    } catch (error) {
      console.warn("Unable to load marketplace filters", error);
    } finally {
      setFiltersHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !filtersHydrated) {
      return;
    }
    try {
      const payload = {
        search,
        category: activeCategory,
        sort,
      };
      window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.warn("Unable to persist marketplace filters", error);
    }
  }, [activeCategory, filtersHydrated, search, sort]);

  useEffect(() => {
    if (typeof window === "undefined" || queryAppliedRef.current === true || !filtersHydrated) {
      return;
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const persona = params.get("persona");
      const wizard = params.get("wizard");
      if (persona) {
        const normalized = persona.toLowerCase();
        if (normalized.includes("finance")) {
          setActiveCategory("Finance");
        } else if (normalized.includes("support")) {
          setActiveCategory("Support");
        } else if (normalized.includes("operations")) {
          setActiveCategory("Operations");
        }
        setSearch(persona.replace(/-/g, " "));
        queryAppliedRef.current = true;
      } else if (wizard) {
        setSearch(wizard.split(" · ")[0] || "");
        queryAppliedRef.current = true;
      }
    } catch (error) {
      console.warn("Unable to apply marketplace query filters", error);
    }
  }, [filtersHydrated]);

  const suggestions = useMemo(() => {
    if (!search.trim()) {
      return [];
    }

    const query = search.toLowerCase();
    const unique = new Map();

    automations.forEach((automation) => {
      const name = automation.name || "";
      const matchesName = name.toLowerCase().includes(query);
      const matchesTag = (automation.tags || []).some((tag) => tag.toLowerCase().includes(query));

      if (matchesName || matchesTag) {
        unique.set(name || automation.id, automation);
      }
    });

    return Array.from(unique.values())
      .sort((a, b) => {
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();
        return (aName.indexOf(query) === -1 ? 999 : aName.indexOf(query)) -
          (bName.indexOf(query) === -1 ? 999 : bName.indexOf(query));
      })
      .slice(0, 6);
  }, [automations, search]);

  const showSuggestions = isSearchFocused && suggestions.length > 0;

  useEffect(() => {
    setHighlightedSuggestion(0);
  }, [search, suggestions.length]);

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

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, filteredAutomations.length);
  }, [filteredAutomations.length]);

  const focusFilterAt = (index) => {
    const total = categories.length;
    const nextIndex = ((index % total) + total) % total;
    filterRefs.current[nextIndex]?.focus();
  };

  const handleFilterKeyDown = (event, index) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusFilterAt(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusFilterAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusFilterAt(0);
        break;
      case "End":
        event.preventDefault();
        focusFilterAt(categories.length - 1);
        break;
      default:
        break;
    }
  };

  const focusCardAt = (index) => {
    if (index < 0 || index >= filteredAutomations.length) return;
    cardRefs.current[index]?.focus();
  };

  const handleCardKeyDown = (event, index) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusCardAt(Math.min(filteredAutomations.length - 1, index + 1));
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusCardAt(Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        focusCardAt(0);
        break;
      case "End":
        event.preventDefault();
        focusCardAt(filteredAutomations.length - 1);
        break;
      default:
        break;
    }
  };

  const handleSuggestionSelect = (value) => {
    setSearch(value);
    setIsSearchFocused(false);
  };

  const handleSearchFocus = () => {
    if (searchFieldBlurTimeout.current) {
      clearTimeout(searchFieldBlurTimeout.current);
    }
    setIsSearchFocused(true);
  };

  const handleSearchBlur = (event) => {
    const nextFocus = event?.relatedTarget;
    if (nextFocus && (nextFocus === event.currentTarget || suggestionListRef.current?.contains(nextFocus))) {
      return;
    }
    searchFieldBlurTimeout.current = setTimeout(() => {
      setIsSearchFocused(false);
    }, 120);
  };

  const handleSearchKeyDown = (event) => {
    if (!showSuggestions) {
      if (event.key === "Escape") {
        event.currentTarget.blur();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedSuggestion((index) => Math.min(suggestions.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedSuggestion((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      const suggestion = suggestions[highlightedSuggestion];
      if (suggestion) {
        event.preventDefault();
        handleSuggestionSelect(suggestion.name || "");
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsSearchFocused(false);
      event.currentTarget.blur();
    }
  };

  const suggestionListId = `${suggestionIdPrefix}-listbox`;
  const activeDescendant =
    showSuggestions && suggestions[highlightedSuggestion]
      ? `${suggestionIdPrefix}-option-${highlightedSuggestion}`
      : undefined;

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
        <div className="search-field">
          <label htmlFor="automation-search" className="sr-only">
            Search automations
          </label>
          <input
            id="automation-search"
            type="search"
            placeholder="Search automations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onKeyDown={handleSearchKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-controls={suggestionListId}
            aria-expanded={showSuggestions ? "true" : "false"}
            aria-activedescendant={activeDescendant}
            aria-haspopup="listbox"
          />
          <AssistiveHint
            id="marketplace-search"
            label="Search guidance"
            message="Type to filter automations. Use arrow keys to browse suggestions and Enter to select without losing focus."
            placement="right"
          />
          {showSuggestions && (
            <ul
              id={suggestionListId}
              className="search-suggestions"
              role="listbox"
              aria-label="Search suggestions"
              ref={suggestionListRef}
            >
              {suggestions.map((suggestion, index) => {
                const optionId = `${suggestionIdPrefix}-option-${index}`;
                return (
                    <li key={suggestion.id || suggestion.name || index} role="presentation">
                      <button
                        type="button"
                        role="option"
                        aria-selected={index === highlightedSuggestion}
                        data-highlighted={index === highlightedSuggestion}
                        id={optionId}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSuggestionSelect(suggestion.name || "")}
                      >
                        <span className="search-suggestions__name">{suggestion.name}</span>
                        <span className="search-suggestions__meta">
                          {suggestion.category || suggestion.vertical || "Automation"}
                        </span>
                      </button>
                    </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="filter-group" role="tablist" aria-label="Automation categories">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className="filter-chip"
              data-active={category === activeCategory}
              role="tab"
              aria-selected={category === activeCategory}
              ref={(node) => {
                filterRefs.current[index] = node;
              }}
              onKeyDown={(event) => handleFilterKeyDown(event, index)}
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

      {loading ? (
        <article className="featured-card featured-card--skeleton" aria-hidden="true">
          <div className="featured-card__preview">
            <div className="skeleton skeleton--preview" />
          </div>
          <div className="featured-card__details">
            <span className="skeleton skeleton--chip" />
            <span className="skeleton skeleton--title" />
            <span className="skeleton skeleton--body" />
            <div className="metrics-row">
              <span className="skeleton skeleton--metric" />
              <span className="skeleton skeleton--metric" />
              <span className="skeleton skeleton--metric" />
            </div>
            <div className="cta-group">
              <span className="skeleton skeleton--button" />
              <span className="skeleton skeleton--button" />
            </div>
          </div>
        </article>
      ) : (
        featured && (
          <motion.article
            ref={featuredRef}
            className="featured-card"
            aria-labelledby="featured-title"
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={featuredVariants}
          >
            <div className="featured-card__preview">
              <SpotlightPreview automation={featured} />
            </div>
            <div className="featured-card__details">
              <span className="featured-card__badge">Featured</span>
              <h2 id="featured-title" style={{ fontSize: "2rem", color: "white" }}>{featured.name}</h2>
              <p style={{ color: "color-mix(in oklch, white 78%, var(--gray-200))" }}>{featured.description}</p>
              <div className="metrics-row">
                <Metric icon="zap" label="Avg ROI" value={`${featured.roi ?? 4.8}x`} />
                <Metric icon="hourglass" label="Time to deploy" value={featured.timeToDeploy ?? "45 min"} />
                <Metric icon="brain" label="AI coverage" value={featured.aiCoverage ?? "Full"} />
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
          </motion.article>
        )
      )}

      <section aria-live="polite" aria-busy={loading ? "true" : "false"}>
        {loading ? (
          <div className="automation-grid" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="automation-card automation-card--skeleton">
                <span className="skeleton skeleton--icon" />
                <span className="skeleton skeleton--title" />
                <span className="skeleton skeleton--body" />
                <div className="automation-card__tags">
                  <span className="skeleton skeleton--tag" />
                  <span className="skeleton skeleton--tag" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            ref={gridRef}
            className="automation-grid"
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
            variants={gridContainerVariants}
          >
            {filteredAutomations.map((automation, index) => (
              <motion.button
                key={automation.id}
                type="button"
                className="automation-card"
                onClick={() => setQuickView(automation)}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                onKeyDown={(event) => handleCardKeyDown(event, index)}
                custom={index}
                variants={gridItemVariants}
              >
                <span className="automation-card__icon" aria-hidden="true">
                  <Icon name="cog" size={22} />
                </span>
                <strong style={{ fontSize: "1.15rem", color: "white" }}>{automation.name}</strong>
                <p style={{ color: "color-mix(in oklch, white 78%, var(--gray-200))", fontSize: "0.95rem" }}>
                  {automation.description}
                </p>
                <div className="automation-card__tags">
                  {(automation.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </motion.div>
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
    <div className="spotlight-preview">
      <ProductPreview3D label={`${automation.name} automation preview`} />
      <ul className="spotlight-preview__highlights">
        <li>Guided quickstart with live sample data</li>
        <li>Telemetry overlay reveals ROI impact in real-time</li>
        <li>Collaboration layer for approvals and notes</li>
      </ul>
    </div>
  );
}

function QuickViewModal({ automation, onClose }) {
  const dialogRef = useRef(null);
  const [teamSize, setTeamSize] = useState(automation.teamSizeHint ?? 45);
  const [hourlyRate, setHourlyRate] = useState(automation.hourlyRateHint ?? 95);
  const [savings, setSavings] = useState(() => calculateSavings(teamSize, hourlyRate));
  const focusTrapRef = useRef({ first: null, last: null });
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        const { first, last } = focusTrapRef.current;
        if (!first || !last) {
          return;
        }

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    const node = dialogRef.current;
    if (!node) {
      return () => {};
    }

    const updateFocusable = () => {
      const focusable = Array.from(
        node.querySelectorAll(
          "a[href], button:not([disabled]), textarea, input, select, details summary, [tabindex]:not([tabindex='-1'])",
        ),
      );
      focusTrapRef.current = {
        first: focusable[0] || node,
        last: focusable[focusable.length - 1] || focusable[0] || node,
      };
    };

    updateFocusable();
    requestAnimationFrame(() => {
      focusTrapRef.current.first?.focus({ preventScroll: true });
    });

    const observer = new MutationObserver(updateFocusable);
    observer.observe(node, { childList: true, subtree: true, attributes: true });

    const handleFocusIn = (event) => {
      if (!node.contains(event.target)) {
        focusTrapRef.current.first?.focus({ preventScroll: true });
      }
    };

    window.addEventListener("focusin", handleFocusIn);

    return () => {
      observer.disconnect();
      window.removeEventListener("focusin", handleFocusIn);
      previouslyFocusedRef.current?.focus?.({ preventScroll: true });
    };
  }, []);

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="quick-view-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      aria-describedby="quick-view-description quick-view-instructions"
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="quick-view-modal" ref={dialogRef} tabIndex={-1}>
        <div className="quick-view-visual">
          <header style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontSize: "0.75rem", color: "color-mix(in oklch, white 70%, var(--gray-300))" }}>
              Interactive Demo
            </span>
            <h2 id="quick-view-title" style={{ fontSize: "1.8rem", color: "white" }}>
              {automation.name}
            </h2>
          </header>
          <div className="quick-view-stage">
            <ProductPreview3D label={`${automation.name} live demo`} />
          </div>
        </div>
        <div className="quick-view-details">
          <p id="quick-view-description" style={{ color: "color-mix(in oklch, white 78%, var(--gray-200))" }}>
            {automation.description}
          </p>
          <p
            id="quick-view-instructions"
            style={{ color: "color-mix(in oklch, white 78%, var(--gray-300))", fontSize: "0.9rem", lineHeight: 1.5 }}
            role="note"
          >
            Use Tab or Shift+Tab to explore metrics, adjust ROI sliders, then press Launch Pilot to continue. Press Escape
            or select Close to return to the marketplace.
          </p>
          <div className="metric-grid">
            <Metric icon="zap" label="ROI" value={`${automation.roi ?? savings.roi.toFixed(1)}x`} />
            <Metric icon="hourglass" label="Time saved" value={`${automation.timeSaved ?? savings.hoursSavedPerWeek} hrs/week`} />
            <Metric icon="boxes" label="Integrations" value={(automation.integrations || []).slice(0, 2).join(", ") || "10+"} />
          </div>
          <ROICalculator
            heading="ROI Calculator"
            description="Adjust the sliders to estimate your potential savings."
            teamSize={teamSize}
            hourlyRate={hourlyRate}
            onTeamSizeChange={(value) => setTeamSize(value)}
            onHourlyRateChange={(value) => setHourlyRate(value)}
            onChange={(result) =>
              setSavings({
                hoursSavedPerWeek: result.hoursSavedPerWeek,
                monthlySavings: result.monthlySavings,
                roi: result.roi,
              })
            }
            variant="compact"
            headingLevel={3}
          />
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="cta-primary"
              onClick={() => {
                toast("Pilot request scheduled", {
                  type: "success",
                  description: `${automation.name || "Automation"} will be provisioned in your workspace shortly.`,
                });
                onClose();
              }}
            >
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

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      <span aria-hidden="true" className="metric__icon">
        <Icon name={icon} size={18} />
      </span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}