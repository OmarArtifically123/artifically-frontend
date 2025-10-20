export const ANIMATION_TIMINGS = {
  // Micro-interactions (very frequent)
  instant: 0,
  micro: 100,
  fast: 200,

  // Standard UI (common interactions)
  normal: 300,
  moderate: 400,

  // Complex animations (infrequent)
  slow: 600,
  slower: 800,

  // Maximum allowed
  max: 1000,
};

export const EASING = {
  // Standard easings
  linear: "cubic-bezier(0, 0, 1, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",

  // Material Design
  material: "cubic-bezier(0.4, 0, 0.2, 1)",

  // Custom branded easings
  snappy: "cubic-bezier(0.3, 0.7, 0.4, 1)",
  bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  elastic: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

export const SPRING_CONFIGS = {
  // Framer Motion spring configs
  fast: { stiffness: 800, damping: 40 },
  medium: { stiffness: 400, damping: 30 },
  slow: { stiffness: 200, damping: 25 },
  wobbly: { stiffness: 180, damping: 12 },
};