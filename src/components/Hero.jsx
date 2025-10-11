import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./animation/MagneticButton";
import { StaggeredContainer, StaggeredItem } from "./animation/StaggeredList";
import useMicroInteractions from "../hooks/useMicroInteractions";
import useScrambleText from "../hooks/useScrambleText";
let heroSceneModulePromise;

const loadHeroScene = async () => {
  if (!heroSceneModulePromise) {
    heroSceneModulePromise = import("./HeroScene.jsx");
  }
  const module = await heroSceneModulePromise;
  return module?.default ?? module;
};
const loadGsap = () => import("../lib/gsapConfig");

const HERO_MEDIA_DIMENSIONS = { width: 1280, height: 720 };

const heroMediaFrameStyle = {
  position: "relative",
  width: "min(1280px, 100%)",
  maxWidth: "1280px",
  aspectRatio: "16 / 9",
  margin: "0 auto",
};

const heroCanvasFallbackStyle = {
  width: "100%",
  height: "100%",
  display: "block",
  borderRadius: "inherit",
  background:
    "radial-gradient(circle at 30% 35%, rgba(59, 130, 246, 0.28), transparent 55%), radial-gradient(circle at 70% 65%, rgba(147, 51, 234, 0.24), transparent 58%)",
  opacity: 0.85,
};

const heroPulseBaseStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.65), rgba(59, 130, 246, 0) 70%)",
  opacity: 0.85,
};

const heroPulseAnimatedStyle = {
  ...heroPulseBaseStyle,
  animation: "pulse 1.6s ease-in-out infinite",
};

const HERO_BADGES = [
  { icon: "🧠", label: "AI-personalized demos" },
  { icon: "🌐", label: "Live automation telemetry" },
  { icon: "⚡", label: "Sub-120ms orchestration" },
  { icon: "🛡️", label: "Enterprise zero-trust" },
];

const TRENDING_AUTOMATIONS = [
  {
    title: "Sync Salesforce handoffs → auto-provision Linear issues",
    meta: "3,102 launches today",
  },
  {
    title: "Classify CX tickets with GPT-4 and trigger Zendesk macros",
    meta: "1,984 real-time automations",
  },
  {
    title: "Detect churn signals → orchestrate HubSpot re-engagement",
    meta: "2,451 journeys in flight",
  },
  {
    title: "Instrument product analytics → ship Amplitude insights",
    meta: "Trending across SaaS teams",
  },
];

const LIVE_STATS = [
  {
    label: "Automations executed",
    value: "12,480,223",
    delta: "+18% vs last week",
  },
  {
    label: "New AI agents",
    value: "1,204",
    delta: "+42 launched today",
  },
  {
    label: "Enterprise NPS",
    value: "72",
    delta: "Top 1% in automation",
  },
];

const TRUST_LOGOS = ["Arcadia", "Continuum", "Northwind", "Lumina", "Raybuild", "Orbit"]; 

const MAP_POINTS = [
  { id: "nyc", label: "New York", top: "38%", left: "28%" },
  { id: "lon", label: "London", top: "32%", left: "52%" },
  { id: "sgp", label: "Singapore", top: "58%", left: "78%" },
  { id: "sfo", label: "San Francisco", top: "44%", left: "18%" },
  { id: "blr", label: "Bengaluru", top: "60%", left: "62%" },
  { id: "syd", label: "Sydney", top: "72%", left: "85%" },
];

const PRESET_DEMOS = [
  {
    id: "ecommerce",
    label: "Ecommerce",
    description:
      "Shopify orders sync to Klaviyo and Gorgias so AI agents resolve CX tickets with next-best actions.",
    focus: "post-purchase experiences",
    sync: "Shopify, Klaviyo, and Gorgias",
    highlight: "personalized win-back plays",
  },
  {
    id: "fintech",
    label: "Fintech",
    description:
      "Fincrime alerts triage through Slack, Airflow, and Snowflake with approvals captured in real time.",
    focus: "risk and compliance operations",
    sync: "Snowflake, Airflow, and Slack",
    highlight: "audited approval trails",
  },
  {
    id: "saas",
    label: "B2B SaaS",
    description:
      "Usage telemetry routes into HubSpot and Linear to trigger account playbooks before risk escalates.",
    focus: "revenue operations",
    sync: "Segment, HubSpot, and Linear",
    highlight: "predictive lifecycle signals",
  },
];

const COMMAND_SHORTCUTS = [
  {
    href: "/pricing",
    title: "Open pricing",
    description: "Usage-based tiers with scenario calculators",
  },
  {
    href: "/marketplace",
    title: "Explore marketplace",
    description: "Cinematic previews of every automation kit",
  },
  {
    href: "/docs",
    title: "Read docs",
    description: "API-first developer mode and SDK guides",
  },
];

const HEADLINE_LINES = [
  ["Automation"],
  ["engineered", "with"],
  ["AI", "choreography."]
];

const heroSceneLoadDelay = 120;

function scheduleSceneLoad(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(callback, { timeout: 750 });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(callback, heroSceneLoadDelay);
  return () => window.clearTimeout(timeoutId);
}

function HeroMediaFallback() {
  return <div style={heroCanvasFallbackStyle} aria-hidden="true" />;
}

function useKineticHeadline(containerRef, prefersReducedMotion) {
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const target = containerRef.current;
    target.setAttribute("data-scroll-story", "ready");

    if (prefersReducedMotion || typeof window === "undefined") {
      return () => {
        target.setAttribute("data-scroll-story", "ready");
      };
    }

    let isMounted = true;
    let idleId;
    let timeoutId;
    let observer;
    let cleanup = () => {
      target.setAttribute("data-scroll-story", "ready");
    };

    const runSetup = async () => {
      try {
        const { gsap } = await loadGsap();
        if (!isMounted || !containerRef.current) {
          return;
        }

        const current = containerRef.current;
        const triggers = [];
        const ctx = gsap.context(() => {
          const words = gsap.utils.toArray(current.querySelectorAll("[data-kinetic-word]"));
          if (!words.length) return;

          const characters = words.reduce((accumulator, word) => {
            if (word.dataset.split === "true") {
              accumulator.push(...gsap.utils.toArray(word.querySelectorAll("[data-kinetic-char]")));
              return accumulator;
            }

            const text = word.textContent ?? "";
            word.textContent = "";
            Array.from(text).forEach((character, index) => {
              const span = document.createElement("span");
              span.className = "hero-kinetic-char";
              span.dataset.kineticChar = "true";
              span.textContent = character === " " ? "\u00A0" : character;
              span.style.setProperty("--char-index", `${index}`);
              word.appendChild(span);
              accumulator.push(span);
            });
            word.dataset.split = "true";
            return accumulator;
          }, []);

          if (!characters.length) return;

          gsap.set(words, { opacity: 1 });
          gsap.set(characters, { yPercent: 120, opacity: 0 });

          gsap.to(characters, {
            yPercent: 0,
            opacity: 1,
            ease: "power3.out",
            duration: 1.05,
            stagger: 0.05,
            delay: 0.25,
          });

          const timeline = gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: current,
                start: "top center",
                end: "bottom top",
                scrub: true,
                onEnter: () => current.setAttribute("data-scroll-story", "active"),
                onEnterBack: () => current.setAttribute("data-scroll-story", "active"),
                onLeave: () => current.setAttribute("data-scroll-story", "past"),
                onLeaveBack: () => current.setAttribute("data-scroll-story", "ready"),
              },
            })
            .to(
              characters,
              {
                yPercent: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 1,
              },
              0,
            )
            .to(
              characters,
              {
                yPercent: -80,
                opacity: 0,
                stagger: 0.08,
                duration: 1,
              },
              ">+=0.8",
            );

          if (timeline.scrollTrigger) {
            triggers.push(timeline.scrollTrigger);
          }
        }, current);

        cleanup = () => {
          triggers.forEach((trigger) => trigger.kill());
          ctx?.revert();
          current.setAttribute("data-scroll-story", "ready");
        };
      } catch (error) {
        console.warn("Failed to load kinetic headline animations", error);
      }
    };

    const scheduleSetup = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => {
          idleId = undefined;
          if (isMounted) {
            runSetup();
          }
        }, { timeout: 600 });
      } else {
        timeoutId = window.setTimeout(() => {
          timeoutId = undefined;
          if (isMounted) {
            runSetup();
          }
        }, heroSceneLoadDelay);
      }
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              scheduleSetup();
              observer.disconnect();
            }
          });
        },
        { rootMargin: "0px 0px -20%", threshold: 0.25 },
      );
      observer.observe(target);
    } else {
      scheduleSetup();
    }

    return () => {
      isMounted = false;
      cleanup();
      if (observer) {
        observer.disconnect();
      }
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [containerRef, prefersReducedMotion]);
}

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event) => {
      setPrefers(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleChange);
    }

    setPrefers(mediaQuery.matches);

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefers;
}

export default function Hero({ openAuth }) {
  const { dispatchInteraction } = useMicroInteractions();
  const headlineRef = useRef(null);
  const commandInputRef = useRef(null);
  const tickerTitleRef = useRef(null);

  const [shouldRenderScene, setShouldRenderScene] = useState(false);
  const [shouldRenderPulse, setShouldRenderPulse] = useState(false);
  const [HeroSceneComponent, setHeroSceneComponent] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [activePulse, setActivePulse] = useState(0);
  const [demoPreset, setDemoPreset] = useState(PRESET_DEMOS[0].id);
  const [business, setBusiness] = useState("");
  const prefersReducedMotion = usePrefersReducedMotion();
  useKineticHeadline(headlineRef, prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShouldRenderScene(false);
      setShouldRenderPulse(false);
      setHeroSceneComponent(null);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || shouldRenderScene) {
      return undefined;
    }

    let cancelled = false;
    const cancelSchedule = scheduleSceneLoad(() => {
      if (cancelled) {
        return;
      }
      loadHeroScene().catch((error) => {
        console.error("Failed to preload hero scene", error);
      });
      setShouldRenderScene(true);
    });

    return () => {
      cancelled = true;
      cancelSchedule();
    };
  }, [prefersReducedMotion, shouldRenderScene]);

  useEffect(() => {
    if (!shouldRenderScene) {
      return undefined;
    }

    let cancelled = false;

    loadHeroScene()
      .then((Component) => {
        if (!cancelled) {
          setHeroSceneComponent(() => Component);
        }
      })
      .catch((error) => {
        console.error("Failed to load hero scene", error);
        if (!cancelled) {
          setHeroSceneComponent(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shouldRenderScene]);

  useEffect(() => {
    if (prefersReducedMotion || shouldRenderPulse) {
      return undefined;
    }

    let cancelled = false;
    const cancelSchedule = scheduleSceneLoad(() => {
      if (!cancelled) {
        setShouldRenderPulse(true);
      }
    });

    return () => {
      cancelled = true;
      cancelSchedule();
    };
  }, [prefersReducedMotion, shouldRenderPulse]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const id = window.setInterval(
      () => setTickerIndex((index) => (index + 1) % TRENDING_AUTOMATIONS.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const id = window.setInterval(
      () => setActivePulse((index) => (index + 1) % MAP_POINTS.length),
      2200,
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleKey = (event) => {
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen(true);
        dispatchInteraction("command-bar-hotkey", { event });
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatchInteraction]);

  useEffect(() => {
    if (!commandOpen || typeof document === "undefined") return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [commandOpen]);

  useEffect(() => {
    if (!commandOpen) return;
    const id = window.requestAnimationFrame(() => {
      commandInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [commandOpen]);

  const demoOutput = useMemo(() => {
    const preset = PRESET_DEMOS.find((item) => item.id === demoPreset) ?? PRESET_DEMOS[0];
    const trimmed = business.trim();
    if (!trimmed) {
      return preset.description;
    }
    return `For ${trimmed}, Artifically orchestrates ${preset.focus}, syncing ${preset.sync} so teams launch ${preset.highlight} within minutes.`;
  }, [business, demoPreset]);

  const handleTryFree = useCallback(
    (event) => {
      dispatchInteraction("cta-primary", { event });
      if (typeof openAuth === "function") {
        openAuth("signup");
        return;
      }
      if (typeof window !== "undefined") {
        window.location.href = "/signup";
      }
    },
    [dispatchInteraction, openAuth],
  );

  const handleExplore = useCallback(
    (event) => {
      dispatchInteraction("cta-secondary", { event });
      if (typeof window === "undefined") return;
      const el = document.getElementById("marketplace");
      if (!el) return;
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 20;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    },
    [dispatchInteraction],
  );

  const handleCommandToggle = useCallback(
    (event) => {
      dispatchInteraction("command-bar-toggle", { event });
      setCommandOpen(true);
    },
    [dispatchInteraction],
  );

  const handleDocsClick = useCallback(
    (event) => {
      dispatchInteraction("cta-tertiary", { event });
    },
    [dispatchInteraction],
  );

  const selectedTrending = TRENDING_AUTOMATIONS[tickerIndex];

  useScrambleText(tickerTitleRef, selectedTrending.title);

  return (
    <section className="hero" data-animate-root>
      <div
        className="hero-canvas"
        aria-hidden="true"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div style={heroMediaFrameStyle}>
          {shouldRenderScene && HeroSceneComponent ? (
            <HeroSceneComponent width={HERO_MEDIA_DIMENSIONS.width} height={HERO_MEDIA_DIMENSIONS.height} />
          ) : (
            <HeroMediaFallback />
          )}
        </div>
      </div>
      <div className="hero-gradient" aria-hidden="true" />
      <div className="hero-inner">
        <header
          className="hero-header"
          data-animate="fade-up"
          data-animate-speed="fast"
          data-animate-context="story"
        >
          <span className="hero-badge glass-pill">
            <span aria-hidden="true">✨</span>
            The AI automation marketplace
          </span>
          <div className="hero-actions" data-animate="fade-up" data-animate-order="1">
            <MagneticButton
              type="button"
              className="hero-command glass-control"
              onClick={handleCommandToggle}
              style={{ gap: "0.65rem" }}
            >
              <span aria-hidden="true">⌘</span>
              Launch Command
              <kbd>K</kbd>
            </MagneticButton>
            <ThemeToggle />
          </div>
        </header>
        <div className="hero-body">
          <div className="hero-text" ref={headlineRef}>
            <h1>
              {HEADLINE_LINES.map((line, index) => (
                <span className="hero-kinetic-line" key={line.join("-") || index}>
                  {line.map((word, wordIndex) => (
                    <span
                      key={`${word}-${wordIndex}`}
                      className="hero-kinetic-word"
                      data-kinetic-word="true"
                    >
                      {word}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="hero-subtitle" data-animate="fade-up" data-animate-order="1">
              Full-screen cinematic storytelling meets enterprise-grade automation. Launch AI-driven workflows
              with Apple-level polish, Stripe clarity, and Linear precision—built to outperform Zapier and Make.com
              on day one.
            </p>
            <div
              className="hero-ctas"
              data-animate="fade-up"
              data-animate-order="2"
              data-animate-context="form"
              data-animate-cascade="0.06"
            >
              <MagneticButton
                type="button"
                className="btn btn-primary"
                variant="primary"
                onClick={handleTryFree}
              >
                Try free
                <span aria-hidden="true">→</span>
              </MagneticButton>
              <MagneticButton
                type="button"
                className="btn btn-secondary"
                onClick={handleExplore}
              >
                Explore marketplace
              </MagneticButton>
              <small>
                <span aria-hidden="true">●</span>
                Live status: 99.99% uptime
              </small>
            </div>
            <div className="hero-ticker" aria-live="polite" data-animate="slide-left" data-animate-order="3">
              <span className="hero-ticker__label">
                <span aria-hidden="true">▲</span>
                Trending
              </span>
              <span className="hero-ticker__item" data-scramble-host>
                <span className="hero-ticker__primary" ref={tickerTitleRef} data-scramble>
                  {selectedTrending.title}
                </span>
                <span className="hero-ticker__meta">{selectedTrending.meta}</span>
              </span>
            </div>
            <StaggeredContainer
              className="hero-badges"
              data-animate="fade-up"
              data-animate-order="4"
            >
              {HERO_BADGES.map(({ icon, label }, index) => (
                <StaggeredItem key={label} index={index} className="hero-badge__item glass-pill">
                  <span aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </StaggeredItem>
              ))}
            </StaggeredContainer>
          </div>
          <div className="hero-insights">
            <div
              className="hero-panel glass-card hero-panel--demo hero-demo"
              data-animate="scale-in"
              data-animate-context="panel"
              data-animate-speed="cinematic"
            >
              <h2>AI-personalized demo</h2>
              <form>
                <div className="hero-demo__inputs">
                  <input
                    type="text"
                    aria-label="Your company or industry"
                    placeholder="E.g. Arcadia robotics"
                    value={business}
                    onChange={(event) => setBusiness(event.target.value)}
                  />
                  <select
                    value={demoPreset}
                    aria-label="Demo focus"
                    onChange={(event) => setDemoPreset(event.target.value)}
                  >
                    {PRESET_DEMOS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hero-demo__output glass-card glass-card--subtle">{demoOutput}</div>
              </form>
              <Link
                to="/docs"
                className="hero-docs-link"
                data-micro-manual="true"
                onClick={handleDocsClick}
              >
                Dive into developer mode
              </Link>
            </div>
            <div
              className="hero-panel glass-card hero-panel--map"
              data-animate="blur-up"
              data-animate-context="story"
              data-animate-speed="slow"
              data-animate-order="1"
            >
              <h2>Live global activity</h2>
              <div className="hero-map glass-card glass-card--subtle" role="img" aria-label="Live automations map">
                <div className="hero-map__globe" />
                {MAP_POINTS.map((point, index) => (
                  <span
                    key={point.id}
                    className="hero-map__pulse"
                    style={{ top: point.top, left: point.left }}
                    data-active={activePulse === index}
                    aria-hidden="true"
                  />
                ))}
                <div className="hero-map__legend glass-pill">
                  <div className="hero-map__legend-animation" aria-hidden="true">
                    <div style={shouldRenderPulse ? heroPulseAnimatedStyle : heroPulseBaseStyle} />
                  </div>
                  Automations executing in real time
                </div>
              </div>
            </div>
            <div
              className="hero-panel glass-card hero-panel--stats"
              data-animate="fade-up"
              data-animate-speed="medium"
              data-animate-order="2"
              data-animate-context="dashboard"
            >
              <h2>Platform telemetry</h2>
              <div className="hero-stats">
                {LIVE_STATS.map((stat) => (
                  <div key={stat.label} className="hero-stat glass-card glass-card--subtle">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <em>{stat.delta}</em>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="hero-panel glass-card hero-panel--trust"
              data-animate="fade-up"
              data-animate-speed="medium"
              data-animate-order="3"
            >
              <h2>Teams shipping with Artifically</h2>
              <div className="hero-trust__grid">
                {TRUST_LOGOS.map((logo) => (
                  <div key={logo} className="hero-trust__logo glass-card glass-card--subtle">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {commandOpen ? (
        <div className="hero-command-overlay" role="dialog" aria-modal="true" aria-label="Artifically command bar">
          <div className="hero-command-overlay__dialog glass-card">
            <div className="hero-command-overlay__input glass-control">
              <span aria-hidden="true">⌘K</span>
              <input
                ref={commandInputRef}
                type="search"
                placeholder="Search automations, docs, or pricing..."
                aria-label="Search commands"
              />
              <button type="button" className="linklike" onClick={() => setCommandOpen(false)}>
                Close
              </button>
            </div>
            <div className="hero-command-overlay__list">
              {COMMAND_SHORTCUTS.map((shortcut) => (
                <Link
                  key={shortcut.href}
                  to={shortcut.href}
                  className="hero-command-overlay__item glass-card glass-card--subtle"
                  onClick={() => setCommandOpen(false)}
                >
                  <strong>{shortcut.title}</strong>
                  <span>{shortcut.description}</span>
                </Link>
              ))}
            </div>
            <div className="hero-command-overlay__footer">
              <span>
                Press
                {' '}
                <kbd>Esc</kbd>
                {' '}
                to close
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}