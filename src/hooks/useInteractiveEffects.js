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

export default function useInteractiveEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const controllers = new WeakMap();
    const cleanup = [];

    const initButton = (button) => {
      if (controllers.has(button)) return;
      const controller = createPhysicsController(button);
      controllers.set(button, controller);

      const state = { pending: null, raf: null };
      button.style.willChange = "transform";

      const schedule = () => {
        if (state.raf != null) return;
        state.raf = window.requestAnimationFrame(() => {
          state.raf = null;
          if (!state.pending) return;
          const { x, y } = state.pending;
          controller.setTarget(x, y);
          state.pending = null;
        });
      };

      const handleMove = (event) => {
        const rect = button.getBoundingClientRect();
        const strength = Number(button.dataset.magneticStrength || "1");
        const offsetX = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const offsetY = (event.clientY - rect.top - rect.height / 2) / rect.height;
        state.pending = {
          x: offsetX * 16 * strength,
          y: offsetY * 16 * strength,
        };
        schedule();
      };

      const handleLeave = () => {
        state.pending = { x: 0, y: 0 };
        schedule();
        controller.reset();
      };

      const handleClick = (event) => {
        if (button.dataset.ripple === "true") {
          createRipple(event);
        }
      };

      button.addEventListener("pointermove", handleMove);
      button.addEventListener("pointerleave", handleLeave);
      button.addEventListener("pointercancel", handleLeave);
      button.addEventListener("blur", handleLeave);
      button.addEventListener("click", handleClick);

      cleanup.push(() => {
        controller.destroy();
        button.style.removeProperty("will-change");
        button.removeEventListener("pointermove", handleMove);
        button.removeEventListener("pointerleave", handleLeave);
        button.removeEventListener("pointercancel", handleLeave);
        button.removeEventListener("blur", handleLeave);
        button.removeEventListener("click", handleClick);
        if (state.raf != null) {
          window.cancelAnimationFrame(state.raf);
        }
      });
    };

    document.querySelectorAll("[data-magnetic]").forEach((btn) => initButton(btn));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches?.("[data-magnetic]")) {
            initButton(node);
          }
          node.querySelectorAll?.("[data-magnetic]").forEach((child) => initButton(child));
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup.forEach((fn) => fn());
    };
  }, []);

  return null;
}