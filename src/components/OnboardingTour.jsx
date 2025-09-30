import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getInitialVisibility = (storageKey, isActive, hasSteps) => {
  if (typeof window === "undefined" || !hasSteps || !isActive) {
    return false;
  }

  const stored = window.localStorage.getItem(storageKey);
  return stored !== "dismissed";
};

const defaultSteps = [];

const useStepPosition = (steps, stepIndex, visible) => {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const step = steps[stepIndex];
    if (!step?.target || typeof window === "undefined") {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const target = document.querySelector(`[data-tour-id="${step.target}"]`);
      if (!target) {
        setCoords(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const highlightTop = rect.top + scrollY;
      const highlightLeft = rect.left + scrollX;
      const highlightWidth = rect.width;
      const highlightHeight = rect.height;

      const placeAbove = rect.bottom + 240 > viewportHeight && highlightTop > 240;
      const tooltipTop = placeAbove
        ? Math.max(scrollY + 40, highlightTop - 210)
        : highlightTop + highlightHeight + 16;
      const centerX = highlightLeft + highlightWidth / 2;
      const tooltipLeft = clamp(centerX, scrollX + 160, scrollX + viewportWidth - 160);

      setCoords({
        tooltipTop,
        tooltipLeft,
        highlightTop,
        highlightLeft,
        highlightWidth,
        highlightHeight,
        placeAbove,
      });
    };

    updatePosition();
    const handleResize = () => updatePosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [steps, stepIndex, visible]);

  return coords;
};

const OnboardingTour = ({
  steps = defaultSteps,
  storageKey = "artifically:dashboard:onboarding",
  isActive = true,
}) => {
  const { darkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const hasSteps = steps.length > 0;
  const [visible, setVisible] = useState(() => getInitialVisibility(storageKey, isActive, hasSteps));
  const coords = useStepPosition(steps, currentStep, visible);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const tooltipBg = useMemo(
    () => (darkMode ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.98)"),
    [darkMode]
  );

  const finishTour = (shouldPersist = true) => {
    setVisible(false);
    if (shouldPersist && typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "dismissed");
    }
  };

  const dismissTour = () => finishTour(true);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishTour(true);
    }
  };

  const skipTour = () => finishTour(true);

  useEffect(() => {
    if (!hasSteps || !isActive) {
      setVisible(false);
      return;
    }

    if (!visible) {
      const shouldShow = getInitialVisibility(storageKey, isActive, hasSteps);
      setVisible(shouldShow);
    }
  }, [hasSteps, isActive, storageKey, visible]);

  useEffect(() => {
    if (!visible || typeof window === "undefined") {
      return;
    }

    const handleKey = (event) => {
      if (event.key === "Escape") {
        dismissTour();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible, dismissTour]);

  if (!visible || !hasSteps || typeof document === "undefined") {
    return null;
  }

  const tooltipStyle = coords
    ? {
        top: coords.tooltipTop,
        left: coords.tooltipLeft,
        transform: "translate(-50%, 0)",
      }
    : {
        bottom: 32,
        right: 32,
      };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: darkMode ? "rgba(2,6,23,0.65)" : "rgba(15,23,42,0.45)",
          backdropFilter: "blur(2px)",
        }}
      />

      {coords && (
        <div
          style={{
            position: "absolute",
            top: coords.highlightTop - 8,
            left: coords.highlightLeft - 8,
            width: coords.highlightWidth + 16,
            height: coords.highlightHeight + 16,
            borderRadius: "1.25rem",
            border: "2px solid rgba(99,102,241,0.9)",
            boxShadow: "0 0 0 9999px rgba(15,23,42,0.35)",
            pointerEvents: "none",
            transition: "all 0.2s ease",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          pointerEvents: "auto",
          maxWidth: "320px",
          width: "clamp(260px, 40vw, 320px)",
          background: tooltipBg,
          color: darkMode ? "#e2e8f0" : "#1f2937",
          borderRadius: "1.25rem",
          padding: "1.5rem",
          boxShadow: darkMode
            ? "0 24px 45px rgba(8, 15, 34, 0.55)"
            : "0 24px 45px rgba(148, 163, 184, 0.45)",
          border: darkMode
            ? "1px solid rgba(99,102,241,0.35)"
            : "1px solid rgba(99,102,241,0.25)",
          ...tooltipStyle,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: darkMode ? "#a5b4fc" : "#4338ca" }}>
            Step {currentStep + 1} of {totalSteps}
          </span>
          <button
            type="button"
            onClick={skipTour}
            style={{
              appearance: "none",
              border: "none",
              background: "none",
              color: darkMode ? "#94a3b8" : "#475569",
              fontSize: "0.8rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Skip
          </button>
        </div>
        <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>{step?.title}</h3>
        <p style={{ margin: "0.75rem 0", fontSize: "0.9rem", lineHeight: 1.5 }}>
          {step?.description}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={dismissTour}
            style={{
              appearance: "none",
              border: "none",
              background: darkMode ? "rgba(148,163,184,0.18)" : "rgba(148,163,184,0.2)",
              color: darkMode ? "#e2e8f0" : "#1f2937",
              borderRadius: "0.85rem",
              padding: "0.6rem 1.25rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={nextStep}
            style={{
              appearance: "none",
              border: "none",
              background: "linear-gradient(120deg, #6366f1, #22d3ee)",
              color: "#0f172a",
              borderRadius: "0.85rem",
              padding: "0.6rem 1.5rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: darkMode
                ? "0 16px 28px rgba(99, 102, 241, 0.35)"
                : "0 16px 28px rgba(99, 102, 241, 0.25)",
            }}
          >
            {currentStep === totalSteps - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>

      {coords && (
        <div
          style={{
            position: "absolute",
            top: coords.placeAbove
              ? coords.highlightTop - 12
              : coords.highlightTop + coords.highlightHeight + 4,
            left: coords.tooltipLeft,
            transform: "translate(-50%, 0)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: coords.placeAbove ? "10px solid transparent" : `10px solid ${tooltipBg}`,
            borderBottom: coords.placeAbove ? `10px solid ${tooltipBg}` : "10px solid transparent",
            pointerEvents: "none",
          }}
        />
      )}
    </div>,
    document.body
  );
};

export default OnboardingTour;