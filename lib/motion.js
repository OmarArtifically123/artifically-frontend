"use client";

import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

const DEFAULT_SPRING = {
  stiffness: 200,
  damping: 26,
  mass: 1,
  restSpeed: 0.01,
  restDelta: 0.01,
  delay: 0,
};

const TRANSFORM_PROPS = new Set(["x", "y", "scale", "rotate"]);

function parseNumeric(value, fallback = 0) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function buildTransform(state) {
  const transforms = [];
  if ("x" in state || "y" in state) {
    const x = state.x?.value ?? 0;
    const y = state.y?.value ?? 0;
    transforms.push(`translate3d(${x}px, ${y}px, 0)`);
  }
  if ("scale" in state) {
    transforms.push(`scale(${state.scale.value})`);
  }
  if ("rotate" in state) {
    transforms.push(`rotate(${state.rotate.value}deg)`);
  }
  return transforms.join(" ");
}

function springAnimate(node, options) {
  if (!node) return () => {};
  const {
    from = {},
    to = {},
    stiffness,
    damping,
    mass,
    restSpeed,
    restDelta,
    delay = 0,
  } = { ...DEFAULT_SPRING, ...options };

  const keys = Object.keys(to);
  if (keys.length === 0) {
    return () => {};
  }

  const state = keys.reduce((acc, key) => {
    const target = to[key];
    const initial = from[key];
    const isTransform = TRANSFORM_PROPS.has(key);
    const unit = !isTransform && typeof target === "string" && target.trim().endsWith("px") ? "px" : "";
    const fallback = key === "scale" ? 1 : 0;
    acc[key] = {
      value: parseNumeric(initial, fallback),
      velocity: 0,
      unit,
      isTransform,
    };
    return acc;
  }, {});

  let frameId;
  let timeoutId;
  let lastTime;

  const step = (time) => {
    if (!lastTime) lastTime = time;
    const dt = Math.min(0.064, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    let settled = true;
    let transformsDirty = false;

    keys.forEach((key) => {
      const current = state[key];
      const target = parseNumeric(to[key], key === "scale" ? 1 : 0);
      const force = -stiffness * (current.value - target);
      const dampingForce = -damping * current.velocity;
      const acceleration = (force + dampingForce) / mass;
      current.velocity += acceleration * dt;
      current.value += current.velocity * dt;

      if (
        Math.abs(current.velocity) > restSpeed ||
        Math.abs(current.value - target) > restDelta
      ) {
        settled = false;
      } else {
        current.value = target;
        current.velocity = 0;
      }

      if (current.isTransform) {
        transformsDirty = true;
      } else if (key === "opacity") {
        node.style.opacity = String(current.value);
      } else {
        node.style.setProperty(key, `${current.value}${current.unit}`);
      }
    });

    if (transformsDirty) {
      node.style.transform = buildTransform(state);
    }

    if (!settled) {
      frameId = requestAnimationFrame(step);
    }
  };

  const start = () => {
    frameId = requestAnimationFrame(step);
  };

  if (delay > 0) {
    timeoutId = setTimeout(start, delay * 1000);
  } else {
    start();
  }

  return () => {
    if (frameId) cancelAnimationFrame(frameId);
    if (timeoutId) clearTimeout(timeoutId);
  };
}

function applyInitial(node, initial = {}) {
  if (!node) return {};
  const state = {};
  let translateX;
  let translateY;
  let scaleValue;
  let rotateValue;

  Object.entries(initial).forEach(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null) return;
    const value = typeof rawValue === "number" ? rawValue : parseNumeric(rawValue, 0);
    if (key === "opacity") {
      node.style.opacity = String(value);
      state.opacity = value;
    } else if (key === "x") {
      translateX = value;
      state.x = value;
    } else if (key === "y") {
      translateY = value;
      state.y = value;
    } else if (key === "scale") {
      scaleValue = value;
      state.scale = value;
    } else if (key === "rotate") {
      rotateValue = value;
      state.rotate = value;
    } else {
      node.style.setProperty(key, typeof rawValue === "number" ? `${rawValue}` : rawValue);
      state[key] = rawValue;
    }
  });

  const transforms = [];
  if (translateX !== undefined || translateY !== undefined) {
    transforms.push(`translate3d(${translateX || 0}px, ${translateY || 0}px, 0)`);
  }
  if (scaleValue !== undefined) {
    transforms.push(`scale(${scaleValue})`);
  }
  if (rotateValue !== undefined) {
    transforms.push(`rotate(${rotateValue}deg)`);
  }

  if (transforms.length) {
    node.style.transform = transforms.join(" ");
  }

  return state;
}

function resolveDefinition(definition, variants, custom) {
  if (!definition) return {};
  if (typeof definition === "string" && variants && variants[definition]) {
    const variant = variants[definition];
    if (typeof variant === "function") {
      return { ...variant(custom) };
    }
    return { ...variant };
  }
  if (typeof definition === "function") {
    return { ...definition(custom) };
  }
  if (typeof definition === "object") {
    return { ...definition };
  }
  return {};
}

function extractTransition(definition, fallbackTransition) {
  if (!definition) return [{}, { ...(fallbackTransition || {}) }];
  const { transition, ...rest } = definition;
  return [rest, { ...(fallbackTransition || {}), ...(transition || {}) }];
}

function computeFrom(node, state, target) {
  const from = {};
  const computed = typeof window !== "undefined" ? window.getComputedStyle(node) : null;

  Object.keys(target).forEach((key) => {
    if (state && key in state) {
      from[key] = state[key];
      return;
    }
    if (key === "opacity") {
      const value = computed ? Number.parseFloat(computed.opacity) : 0;
      from.opacity = Number.isNaN(value) ? 0 : value;
      return;
    }
    if (key === "scale") {
      from.scale = 1;
      return;
    }
    if (key === "rotate") {
      from.rotate = 0;
      return;
    }
    if (key === "x" || key === "y") {
      from[key] = 0;
      return;
    }
    const current = computed ? computed.getPropertyValue(key) : "";
    const numeric = Number.parseFloat(current);
    from[key] = Number.isNaN(numeric) ? 0 : numeric;
  });

  return from;
}

function inlineInitial(initial = {}, baseStyle = {}) {
  const style = { ...baseStyle };
  Object.entries(initial).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === "opacity") {
      style.opacity = value;
    } else if (!TRANSFORM_PROPS.has(key)) {
      style[key] = value;
    }
  });
  return style;
}

function createMotionComponent(tag) {
  return forwardRef(function MotionComponent(props, forwardedRef) {
    const {
      initial,
      animate,
      variants,
      custom,
      transition,
      style,
      ...rest
    } = props;
    const nodeRef = useRef(null);
    const cleanupRef = useRef(() => {});
    const stateRef = useRef({});

    const resolvedInitial = useMemo(
      () => resolveDefinition(initial, variants, custom),
      [initial, variants, custom]
    );

    useEffect(() => {
      const node = nodeRef.current;
      if (!node) return undefined;
      cleanupRef.current();
      const appliedState = applyInitial(node, resolvedInitial);
      stateRef.current = { ...stateRef.current, ...appliedState };
      return () => {
        cleanupRef.current();
      };
    }, [resolvedInitial]);

    useEffect(() => () => cleanupRef.current(), []);

    const runAnimation = useCallback(
      (definition) => {
        const node = nodeRef.current;
        if (!node || !definition) return Promise.resolve();
        const resolved = resolveDefinition(definition, variants, custom);
        if (!resolved || Object.keys(resolved).length === 0) {
          return Promise.resolve();
        }
        const [targetBase, transitionSettings] = extractTransition(resolved, transition);
        const target = { ...targetBase };
        TRANSFORM_PROPS.forEach((key) => {
          if (stateRef.current[key] !== undefined && target[key] === undefined) {
            target[key] = stateRef.current[key];
          }
        });
        const from = computeFrom(node, stateRef.current, target);
        cleanupRef.current();
        cleanupRef.current = springAnimate(node, {
          from,
          to: target,
          ...transitionSettings,
        });
        stateRef.current = { ...stateRef.current, ...target };
        return Promise.resolve();
      },
      [variants, custom, transition]
    );

    useEffect(() => {
      if (!animate) return undefined;
      if (typeof animate === "object" && typeof animate.subscribe === "function") {
        const unsubscribe = animate.subscribe(runAnimation);
        return () => unsubscribe();
      }
      runAnimation(animate);
      return undefined;
    }, [animate, runAnimation]);

    return createElement(tag, {
      ...rest,
      ref: (value) => {
        nodeRef.current = value;
        if (typeof forwardedRef === "function") {
          forwardedRef(value);
        } else if (forwardedRef && typeof forwardedRef === "object") {
          forwardedRef.current = value;
        }
      },
      style: inlineInitial(resolvedInitial, style),
    });
  });
}

export const motion = new Proxy(
  {},
  {
    get: (_, tag) => createMotionComponent(tag),
  }
);

export function useAnimationControls() {
  const storeRef = useRef({ listeners: new Set() });

  const subscribe = useCallback((listener) => {
    storeRef.current.listeners.add(listener);
    return () => storeRef.current.listeners.delete(listener);
  }, []);

  const start = useCallback((definition) => {
    const promises = Array.from(storeRef.current.listeners).map((listener) => listener(definition));
    return Promise.all(promises);
  }, []);

  return useMemo(
    () => ({
      start,
      set: start,
      subscribe,
    }),
    [start, subscribe]
  );
}

export function AnimatePresence({ children }) {
  return children;
}