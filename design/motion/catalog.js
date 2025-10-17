// src/design/motion/catalog.js
// Central catalogue of micro-interaction tokens shared across the app.
// All durations are expressed in seconds so they can be passed directly to
// Framer Motion transitions. The intent is to animate transform/opacity only
// unless otherwise documented, keeping interactions light-weight and
// responsive even on constrained devices. Use these exports instead of inline
// numbers to ensure timing consistency across the product.

export const motionCatalog = {
  durations: {
    instant: 0,
    micro: 0.12,
    short: 0.2,
    medium: 0.32,
    long: 0.6,
    xlong: 0.9,
    stagger: 0.08,
  },
  easings: {
    standard: [0.2, 0.0, 0.38, 0.9],
    in: [0.6, 0.04, 0.98, 0.335],
    out: [0.16, 1, 0.3, 1],
    inOut: [0.37, 0, 0.63, 1],
  },
  springs: {
    gentle: { type: "spring", stiffness: 200, damping: 26, mass: 1 },
    responsive: { type: "spring", stiffness: 280, damping: 32, mass: 0.9 },
  },
  guidelines: {
    entering: "Use out easing on entry animations and keep motion under 600ms.",
    exiting: "Use in easing on exit states to avoid abrupt snaps.",
    reducedMotion: "Skip translations when prefers-reduced-motion is enabled.",
    transformsOnly: "Limit animated properties to transform and opacity.",
  },
};

export default motionCatalog;