import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeToggle from "./ThemeToggle";
import useMicroInteractions from "../hooks/useMicroInteractions";
import useScrambleText from "../hooks/useScrambleText";

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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useCinematicBackground(canvasRef) {
  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined") return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const gradientMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3, 2),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1744"),
        roughness: 0.35,
        metalness: 0.65,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
      }),
    );

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(2.8, 64, 64),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#7a5bff"),
        transparent: true,
        opacity: 0.12,
      }),
    );

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 620;
    const positions = new Float32Array(particlesCount * 3);
    const basePositions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const colorA = new THREE.Color("#76fff7");
    const colorB = new THREE.Color("#ff8f5f");

    for (let i = 0; i < particlesCount; i += 1) {
      const i3 = i * 3;
      const mix = Math.random();
      const color = colorA.clone().lerp(colorB, mix);
      positions[i3] = (Math.random() - 0.5) * 8;
      positions[i3 + 1] = (Math.random() - 0.5) * 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;
      basePositions[i3] = positions[i3];
      basePositions[i3 + 1] = positions[i3 + 1];
      basePositions[i3 + 2] = positions[i3 + 2];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    const primaryLight = new THREE.PointLight("#ffffff", 2.2, 14);
    primaryLight.position.set(2, 3, 4);
    const ambientLight = new THREE.AmbientLight("#6b7bff", 0.6);

    scene.add(gradientMesh);
    scene.add(glow);
    scene.add(particles);
    scene.add(primaryLight);
    scene.add(ambientLight);

    const resize = () => {
      if (!canvasRef.current) return;
      const { clientWidth, clientHeight } = canvasRef.current;
      const aspect = clientWidth / clientHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };

    resize();
    window.addEventListener("resize", resize);

    const targetRotation = new THREE.Vector2(0.12, 0.2);
    const currentRotation = new THREE.Vector2();

    const pointerMove = (event) => {
      const { innerWidth, innerHeight } = window;
      targetRotation.x = ((event.clientY / innerHeight) - 0.5) * 0.5;
      targetRotation.y = ((event.clientX / innerWidth) - 0.5) * 0.5;
    };

    window.addEventListener("pointermove", pointerMove);

    const clock = new THREE.Clock();
    let animationFrame;

    const renderScene = () => {
      const elapsed = clock.getElapsedTime();
      currentRotation.lerp(targetRotation, 0.05);
      gradientMesh.rotation.set(
        currentRotation.x + elapsed * 0.22,
        currentRotation.y + elapsed * 0.18,
        0,
      );
      glow.rotation.copy(gradientMesh.rotation);

      const positionsAttr = particlesGeometry.getAttribute("position");
      for (let i = 0; i < particlesCount; i += 1) {
        const index = i * 3;
        positions[index + 1] = basePositions[index + 1] + Math.sin(elapsed * 0.6 + i) * 0.2;
        positions[index] = basePositions[index] + Math.cos(elapsed * 0.4 + i) * 0.05;
      }
      positionsAttr.needsUpdate = true;

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0006;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(renderScene);
    };

    renderScene();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [canvasRef]);
}

function useKineticHeadline(containerRef) {
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return undefined;
    const container = containerRef.current;
    container.setAttribute("data-scroll-story", "ready");

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(container.querySelectorAll("[data-kinetic-word]"));
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

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: container,
            start: "top center",
            end: "bottom top",
            scrub: true,
            onEnter: () => container.setAttribute("data-scroll-story", "active"),
            onEnterBack: () => container.setAttribute("data-scroll-story", "active"),
            onLeave: () => container.setAttribute("data-scroll-story", "past"),
            onLeaveBack: () => container.setAttribute("data-scroll-story", "ready"),
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
    }, containerRef);

    return () => {
      ctx.revert();
      container.setAttribute("data-scroll-story", "ready");
    };
  }, [containerRef]);
}

export default function Hero({ openAuth }) {
  const { dispatchInteraction } = useMicroInteractions();
  const canvasRef = useRef(null);
  const headlineRef = useRef(null);
  const commandInputRef = useRef(null);
  const tickerTitleRef = useRef(null);

  const [commandOpen, setCommandOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [activePulse, setActivePulse] = useState(0);
  const [demoPreset, setDemoPreset] = useState(PRESET_DEMOS[0].id);
  const [business, setBusiness] = useState("");

  useCinematicBackground(canvasRef);
  useKineticHeadline(headlineRef);

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
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
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
            <button
              type="button"
              className="hero-command glass-control"
              data-magnetic="true"
              data-magnetic-strength="1.1"
              data-ripple="true"
              data-micro-manual="true"
              onClick={handleCommandToggle}
            >
              <span aria-hidden="true">⌘</span>
              Launch Command
              <kbd>K</kbd>
            </button>
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
              <button
                type="button"
                className="btn btn-primary"
                data-magnetic="true"
                data-magnetic-strength="1.25"
                data-ripple="true"
                data-micro-manual="true"
                onClick={handleTryFree}
              >
                Try free
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-magnetic="true"
                data-magnetic-strength="1"
                data-ripple="true"
                data-micro-manual="true"
                onClick={handleExplore}
              >
                Explore marketplace
              </button>
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
            <ul className="hero-badges" data-animate="fade-up" data-animate-order="4">
              {HERO_BADGES.map(({ icon, label }) => (
                <li key={label} className="hero-badge__item glass-pill">
                  <span aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
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
                  <span aria-hidden="true">●</span>
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