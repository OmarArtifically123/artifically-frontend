"use client";

import { useEffect } from "react";

const SPRING = 0.16;
const DAMPING = 0.82;

function createRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  button.appendChild(ripple);
  ripple.addEventListener(
    "animationend",
    () => {
      ripple.remove();
    },
    { once: true }
  );
}

function createPhysicsController(element) {
  const state = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    frame: null,
  };

  const animate = () => {
    const dx = state.targetX - state.x;
    const dy = state.targetY - state.y;
    state.vx = state.vx * DAMPING + dx * SPRING;
    state.vy = state.vy * DAMPING + dy * SPRING;
    state.x += state.vx;
    state.y += state.vy;

    if (element) {
      element.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`;
    }

    if (Math.abs(state.vx) + Math.abs(state.vy) > 0.08 || Math.abs(dx) + Math.abs(dy) > 0.08) {
      state.frame = window.requestAnimationFrame(animate);
    } else {
      state.frame = null;
    }
  };

  const setTarget = (x, y) => {
    state.targetX = x;
    state.targetY = y;
    if (!state.frame) {
      state.frame = window.requestAnimationFrame(animate);
    }
  };

  const reset = () => {
    state.targetX = 0;
    state.targetY = 0;
    if (!state.frame) {
      state.frame = window.requestAnimationFrame(animate);
    }
  };

  return { setTarget, reset, destroy: () => state.frame && window.cancelAnimationFrame(state.frame) };
}

export default function useInteractiveEffects(enabled) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const pointerQuery = window.matchMedia?.("(pointer: fine)");
    const reduceMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const allowMagnetism = Boolean(pointerQuery?.matches) && !reduceMotionQuery?.matches;
    const allowRipple = !reduceMotionQuery?.matches;

    if (!allowMagnetism && !allowRipple) {
      return undefined;
    }

    const controllers = new WeakMap();
    let activeElement = null;
    let activeController = null;
    let pending = null;
    let rafId = null;

    const isMouseLike = (event) =>
      event.pointerType === "mouse" || event.pointerType === "pen" || event.pointerType === "";

    const flush = () => {
      rafId = null;
      if (!pending || !activeController) return;
      activeController.setTarget(pending.x, pending.y);
      pending = null;
    };

    const ensureController = (element) => {
      if (!allowMagnetism) return null;
      let controller = controllers.get(element);
      if (!controller) {
        controller = createPhysicsController(element);
        controllers.set(element, controller);
      }
      element.style.willChange = "transform";
      return controller;
    };

    const resetActiveElement = () => {
      if (!activeElement) return;
      if (activeController) {
        activeController.reset();
      }
      activeElement.style.removeProperty("will-change");
      activeElement = null;
      activeController = null;
      pending = null;
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const updateTarget = (event) => {
      if (!activeElement || !activeController) return;
      const rect = activeElement.getBoundingClientRect();
      const strength = Number(activeElement.dataset.magneticStrength || "1");
      const offsetX = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const offsetY = (event.clientY - rect.top - rect.height / 2) / rect.height;
      pending = {
        x: offsetX * 16 * strength,
        y: offsetY * 16 * strength,
      };
      if (rafId == null) {
        rafId = window.requestAnimationFrame(flush);
      }
    };

    const handlePointerOver = (event) => {
      if (!allowMagnetism || !isMouseLike(event)) return;
      if (!(event.target instanceof Element)) return;
      const candidate = event.target.closest("[data-magnetic]");
      if (!candidate) return;
      if (candidate.dataset.magnetic === "false") return;
      if (activeElement === candidate) return;
      resetActiveElement();
      activeElement = candidate;
      activeController = ensureController(candidate);
    };

    const handlePointerOut = (event) => {
      if (!activeElement || !(event.target instanceof Element)) return;
      const candidate = event.target.closest("[data-magnetic]");
      if (!candidate || candidate !== activeElement) return;
      if (event.relatedTarget instanceof Element && candidate.contains(event.relatedTarget)) {
        return;
      }
      if (activeController) {
        pending = { x: 0, y: 0 };
        if (rafId == null) {
          rafId = window.requestAnimationFrame(flush);
        }
      }
      resetActiveElement();
    };

    const handlePointerMove = (event) => {
      if (!allowMagnetism || !isMouseLike(event)) return;
      updateTarget(event);
    };

    const handlePointerCancel = () => {
      resetActiveElement();
    };

    const handleBlur = (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (!event.target.matches("[data-magnetic]")) return;
      resetActiveElement();
    };

    const handleClick = (event) => {
      if (!allowRipple || !(event.target instanceof Element)) return;
      const button = event.target.closest("button[data-ripple='true'], button[data-ripple=true], button[data-ripple]");
      if (!button) return;
      const rippleSetting = button.dataset.ripple;
      if (rippleSetting !== "true") return;
      if (typeof event.clientX !== "number" || typeof event.clientY !== "number") return;
      createRipple({ currentTarget: button, clientX: event.clientX, clientY: event.clientY });
    };

    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointerout", handlePointerOut, true);
    document.addEventListener("pointercancel", handlePointerCancel, true);
    document.addEventListener("blur", handleBlur, true);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      resetActiveElement();
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointerout", handlePointerOut, true);
      document.removeEventListener("pointercancel", handlePointerCancel, true);
      document.removeEventListener("blur", handleBlur, true);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [enabled]);

  return null;
}