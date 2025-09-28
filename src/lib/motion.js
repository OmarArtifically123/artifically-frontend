import { createElement, forwardRef, useEffect, useRef } from "react";

function springAnimate(node, { from, to, stiffness = 180, damping = 24, mass = 1, restSpeed = 0.01, restDelta = 0.01 }) {
  if (!node) return () => {};
  const animatedKeys = Object.keys(to || {});
  const state = animatedKeys.reduce((acc, key) => {
    const value = typeof from[key] === "number" ? from[key] : Number.parseFloat(from[key]) || 0;
    const unit = typeof to[key] === "string" && to[key].includes("px") ? "px" : "";
    acc[key] = { value, velocity: 0, unit };
    return acc;
  }, {});

  let frame;
  let lastTime;

  const step = (time) => {
    if (!lastTime) lastTime = time;
    const dt = Math.min(0.064, (time - lastTime) / 1000);
    lastTime = time;
    let settled = true;

    animatedKeys.forEach((key) => {
      const target = typeof to[key] === "number" ? to[key] : Number.parseFloat(to[key]) || 0;
      const current = state[key];
      const force = -stiffness * (current.value - target);
      const dampingForce = -damping * current.velocity;
      const acceleration = (force + dampingForce) / mass;
      current.velocity += acceleration * dt;
      current.value += current.velocity * dt;
      if (Math.abs(current.velocity) > restSpeed || Math.abs(current.value - target) > restDelta) {
        settled = false;
      } else {
        current.value = target;
        current.velocity = 0;
      }
      if (key === "opacity") {
        node.style.opacity = String(current.value);
      } else if (key === "scale") {
        node.style.transform = `scale(${current.value})`;
      } else if (key === "rotate") {
        node.style.transform = `${node.style.transform || ""} rotate(${current.value}deg)`;
      } else if (key === "x" || key === "y") {
        const existing = node.style.transform || "";
        const transforms = existing.split(" ").filter(Boolean).filter((item) => !item.startsWith("translate"));
        transforms.push(`translate3d(${(state.x?.value || 0)}px, ${(state.y?.value || 0)}px, 0)`);
        node.style.transform = transforms.join(" ");
      } else {
        node.style.setProperty(key, `${current.value}${current.unit}`);
      }
    });

    if (!settled) {
      frame = requestAnimationFrame(step);
    }
  };

  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

function applyInitial(node, initial) {
  if (!node || !initial) return;
  Object.entries(initial).forEach(([key, value]) => {
    if (key === "opacity") {
      node.style.opacity = value;
    } else if (key === "x" || key === "y") {
      const existing = node.style.transform || "";
      const transforms = existing
        .split(" ")
        .filter(Boolean)
        .filter((item) => !item.startsWith("translate"));
      const x = key === "x" ? value : Number.parseFloat(node.dataset.motionX) || 0;
      const y = key === "y" ? value : Number.parseFloat(node.dataset.motionY) || 0;
      node.dataset.motionX = String(x);
      node.dataset.motionY = String(y);
      transforms.push(`translate3d(${x}px, ${y}px, 0)`);
      node.style.transform = transforms.join(" ");
    } else {
      node.style.setProperty(key, typeof value === "number" ? `${value}` : value);
    }
  });
}

function createMotionComponent(tag) {
  return forwardRef(({ initial = {}, animate = {}, transition = {}, style, ...rest }, ref) => {
    const nodeRef = useRef(null);

    useEffect(() => {
      const node = nodeRef.current;
      if (!node) return undefined;
      applyInitial(node, initial);
      return springAnimate(node, { from: initial, to: animate, ...transition });
    }, [initial, animate, transition]);

    return createElement(tag, {
      ...rest,
      ref: (value) => {
        nodeRef.current = value;
        if (typeof ref === "function") {
          ref(value);
        } else if (ref && typeof ref === "object") {
          ref.current = value;
        }
      },
      style: { ...style, ...initial },
    });
  });
}

export const motion = new Proxy(
  {},
  {
    get: (_, tag) => createMotionComponent(tag),
  }
);

export function AnimatePresence({ children }) {
  return children;
}