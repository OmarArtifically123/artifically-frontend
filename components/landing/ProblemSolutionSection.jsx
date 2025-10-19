"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "../icons";

const problems = [
  {
    title: "Fragmented Data",
    description: "Information sits in silos so teams manually reconcile end-of-day across dozens of systems.",
  },
  {
    title: "Manual QA Loops",
    description: "Ops leads chase down twelve tools to verify every automation run by hand.",
  },
  {
    title: "Slow Change Control",
    description: "Vendors require weeks of tickets and approvals before anything ships to production.",
  },
  {
    title: "Runaway Costs",
    description: "Consulting retainers and surprise usage fees keep ROI perpetually out of reach.",
  },
];

const solutions = [
  {
    title: "Unified Data Layer",
    description: "Sync every system through a governed data layer with built-in lineage tracking.",
  },
  {
    title: "AI Guardrails",
    description: "Autonomous monitoring flags anomalies, retries safely, and briefs owners automatically.",
  },
  {
    title: "Instant Playbooks",
    description: "Launch curated playbooks with guided setup flows and zero custom scripts.",
  },
  {
    title: "Predictable Pricing",
    description: "Usage-based tiers and cost alerts keep finance, ops, and execs aligned.",
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ProblemSolutionSection() {
  const pairs = useMemo(() => problems.map((problem, index) => ({ problem, solution: solutions[index] })), []);
  const sliderRef = useRef(null);
  const [position, setPosition] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const handleChange = (event) => setIsMobile(event.matches);

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isDragging || isMobile) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      event.preventDefault();
      updatePosition(event.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, isMobile]);

  const updatePosition = (clientX) => {
    if (!sliderRef.current) {
      return;
    }

    const bounds = sliderRef.current.getBoundingClientRect();
    const offset = clamp(clientX - bounds.left, 0, bounds.width);
    const ratio = clamp(offset / bounds.width, 0.02, 0.98);
    setPosition(Number(ratio.toFixed(3)));
  };

  const beginDrag = (clientX) => {
    if (isMobile) {
      return;
    }

    setIsDragging(true);
    updatePosition(clientX);
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    beginDrag(event.clientX);
  };

  const handleTrackPointerDown = (event) => {
    if (isMobile) {
      return;
    }

    if (event.pointerType !== "touch" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    beginDrag(event.clientX);
  };

  const handleKeyDown = (event) => {
    if (isMobile) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const delta = event.key === "ArrowLeft" ? -0.05 : 0.05;
      setPosition((previous) => clamp(Number((previous + delta).toFixed(3)), 0.02, 0.98));
    }
  };

  const leftClip = !isMobile ? { clipPath: `inset(0 ${Math.max(0, 100 - position * 100)}% 0 0)` } : undefined;
  const rightClip = !isMobile ? { clipPath: `inset(0 0 0 ${position * 100}%)` } : undefined;
  const dividerStyle = !isMobile ? { left: `${position * 100}%` } : undefined;

  return (
    <section id="problem-solution" className="comparison-section" aria-labelledby="problem-solution-title">
      <div className="comparison-shell">
        <header className="comparison-header">
          <h2 id="problem-solution-title" className="comparison-title">
            THE OLD WAY VS. THE ARTIFICALLY WAY
          </h2>
          <p className="comparison-description">
            Old-school automation stacks demand months of integration work. We designed Artifically for teams who need
            impact now, not next quarter.
          </p>
        </header>
        <div className="comparison-grid" ref={sliderRef} onPointerDown={handleTrackPointerDown}>
          <article
            className="comparison-panel comparison-panel--old"
            style={leftClip}
            data-side="old"
          >
            <header className="comparison-panel__header">
              <span aria-hidden="true" className="comparison-panel__symbol">
                ⚠️
              </span>
              <h3>Weeks of Setup</h3>
            </header>
            <div className="comparison-panel__list">
              {pairs.map(({ problem }) => (
                <div key={problem.title} className="comparison-card comparison-card--problem">
                  <span aria-hidden="true" className="comparison-card__glyph comparison-card__glyph--negative">
                    <Icon name="close" size={20} />
                  </span>
                  <h4>{problem.title}</h4>
                  <p>{problem.description}</p>
                </div>
              ))}
            </div>
          </article>
          <article
            className="comparison-panel comparison-panel--new"
            style={rightClip}
            data-side="new"
          >
            <header className="comparison-panel__header">
              <span aria-hidden="true" className="comparison-panel__symbol comparison-panel__symbol--positive">
                ✓
              </span>
              <h3>Deploy in Minutes</h3>
            </header>
            <div className="comparison-panel__list">
              {pairs.map(({ solution }) => (
                <div key={solution.title} className="comparison-card comparison-card--solution">
                  <span aria-hidden="true" className="comparison-card__glyph comparison-card__glyph--positive">
                    <Icon name="check" size={20} />
                  </span>
                  <h4>{solution.title}</h4>
                  <p>{solution.description}</p>
                </div>
              ))}
            </div>
          </article>
          {!isMobile ? (
            <div className={`comparison-divider${isDragging ? " is-dragging" : ""}`} style={dividerStyle}>
              <span aria-hidden="true" className="comparison-divider__arrow">
                →
              </span>
              <button
                type="button"
                className="comparison-handle"
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                aria-label="Drag to reveal the old way versus the Artifically way"
              >
                <Icon name="arrowRight" size={20} className="comparison-handle__icon" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}