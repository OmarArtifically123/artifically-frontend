import { useEffect } from "react";
import useMicroInteractions from "./useMicroInteractions";

const INTERACTIVE_SELECTOR = [
  "button:not([disabled]):not([data-micro-opt-out])",
  "a[href]:not([aria-disabled='true']):not([data-micro-opt-out])",
  "[role='button']:not([aria-disabled='true']):not([data-micro-opt-out])",
  "input:not([disabled]):not([type='hidden']):not([data-micro-opt-out])",
  "textarea:not([disabled]):not([data-micro-opt-out])",
  "select:not([disabled]):not([data-micro-opt-out])",
  "[data-micro-interactive]",
].join(",");

const FORM_SELECTOR = "form:not([data-micro-opt-out])";

const PREFETCH_BLOCKLIST = /^(mailto:|tel:|#|javascript:|https?:\/\/)/i;

function schedulePrefetch(anchor) {
  if (!anchor || PREFETCH_BLOCKLIST.test(anchor.getAttribute("href") || "")) {
    return null;
  }

  const scheduler =
    typeof window !== "undefined" && typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback
      : (cb) => window.setTimeout(cb, 80);

  const canceler =
    typeof window !== "undefined" && typeof window.cancelIdleCallback === "function"
      ? window.cancelIdleCallback
      : window.clearTimeout;

  const href = anchor.getAttribute("href");
  if (!href) return null;

  const id = scheduler(() => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    link.as = "document";
    link.dataset.microPrefetch = "true";
    document.head.appendChild(link);
    window.setTimeout(() => {
      link.remove();
    }, 6000);
  });

  return () => canceler(id);
}

function createPointerProxy() {
  const el = document.createElement("div");
  el.className = "micro-cursor";
  el.dataset.active = "false";
  el.dataset.pressed = "false";
  el.setAttribute("aria-hidden", "true");
  el.style.setProperty("--micro-cursor-scale", "0.45");
  el.style.setProperty("--micro-cursor-x", "-100px");
  el.style.setProperty("--micro-cursor-y", "-100px");
  document.body.appendChild(el);

  const state = {
    scale: 0.45,
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const api = {
    move(x, y) {
      el.style.setProperty("--micro-cursor-x", `${x}px`);
      el.style.setProperty("--micro-cursor-y", `${y}px`);
    },
    setScale(value) {
      state.scale = clamp(Number.isFinite(value) ? value : state.scale, 0.35, 1.25);
      el.style.setProperty("--micro-cursor-scale", `${state.scale}`);
    },
    activate(target) {
      el.dataset.active = "true";
      if (target) {
        const attrScale = target.dataset.microCursorScale;
        const inferredScale = target.dataset.interactionIntent === "primary" || target.classList.contains("btn-primary")
          ? 0.92
          : target.classList.contains("btn")
            ? 0.78
            : 0.65;
        api.setScale(attrScale ? Number(attrScale) : inferredScale);
        if (target.dataset.microCursorColor) {
          el.style.setProperty("--micro-cursor-color", target.dataset.microCursorColor);
        } else {
          el.style.removeProperty("--micro-cursor-color");
        }
      } else {
        api.setScale(0.65);
      }
    },
    rest() {
      el.dataset.active = "false";
      api.setScale(0.45);
    },
    press() {
      el.dataset.pressed = "true";
    },
    release() {
      el.dataset.pressed = "false";
    },
    celebrate() {
      el.dataset.celebrate = "true";
      window.requestAnimationFrame(() => {
        el.dataset.celebrate = "false";
      });
    },
    destroy() {
      el.remove();
    },
  };

  return api;
}

function isMouseLike(event) {
  return event.pointerType === "mouse" || event.pointerType === "pen" || event.pointerType === "";
}

export default function useMicroInteractionSystem() {
  const { dispatchInteraction, reducedMotion } = useMicroInteractions();

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const pointerQuery = window.matchMedia?.("(pointer: fine)");
    const preferFinePointer = pointerQuery?.matches ?? false;
    const cursor = preferFinePointer && !reducedMotion ? createPointerProxy() : null;

    const cleanupMap = new Map();
    const formCleanup = new Map();
    const hoverTimers = new WeakMap();
    const focusTimers = new WeakMap();
    const guideTimers = new WeakMap();
    const guidePulseSeen = new WeakSet();

    const intersection = !reducedMotion && "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const { target, isIntersecting } = entry;
              if (!isIntersecting) return;
              if (guidePulseSeen.has(target)) return;
              guidePulseSeen.add(target);
              target.dataset.microGuidePulse = "true";
              const timeout = window.setTimeout(() => {
                if (target.dataset.microGuidePulse === "true") {
                  delete target.dataset.microGuidePulse;
                }
                guideTimers.delete(target);
              }, 900);
              guideTimers.set(target, timeout);
            });
          },
          { threshold: 0.55 },
        )
      : null;

    const registerForm = (form) => {
      if (formCleanup.has(form)) return;
      const handleSubmit = (event) => {
        dispatchInteraction("form-celebrate", { event, particles: { count: 72 } });
        cursor?.celebrate();
      };
      form.addEventListener("submit", handleSubmit, true);
      formCleanup.set(form, () => {
        form.removeEventListener("submit", handleSubmit, true);
      });
    };

    const registerElement = (element) => {
      if (!(element instanceof HTMLElement)) return;
      if (!element.matches(INTERACTIVE_SELECTOR)) return;
      if (cleanupMap.has(element)) return;

      element.dataset.microInteractive = element.dataset.microInteractive || "true";
      if (preferFinePointer && element.dataset.magnetic !== "false" && !element.dataset.magnetic) {
        element.dataset.magnetic = "true";
        if (!element.dataset.magneticStrength) {
          if (element.classList.contains("btn-primary")) {
            element.dataset.magneticStrength = "1.1";
          } else if (element.classList.contains("btn")) {
            element.dataset.magneticStrength = "0.85";
          } else {
            element.dataset.magneticStrength = "0.65";
          }
        }
      }

      if (!element.dataset.ripple && element.tagName === "BUTTON") {
        element.dataset.ripple = "true";
      }

      intersection?.observe(element);

      let prefetchCancel = null;

      const clearHoverTimer = () => {
        const timer = hoverTimers.get(element);
        if (timer) {
          window.clearTimeout(timer);
          hoverTimers.delete(element);
        }
      };

      const clearFocusTimer = () => {
        const timer = focusTimers.get(element);
        if (timer) {
          window.clearTimeout(timer);
          focusTimers.delete(element);
        }
      };

      const clearGuideTimer = () => {
        const timer = guideTimers.get(element);
        if (typeof timer === "number") {
          window.clearTimeout(timer);
          guideTimers.delete(element);
        }
      };

      const handlePointerEnter = (event) => {
        if (!isMouseLike(event)) return;
        clearHoverTimer();
        const timer = window.setTimeout(() => {
          element.dataset.microHover = "true";
        }, 40);
        hoverTimers.set(element, timer);
        element.dataset.microGuided = "pointer";
        cursor?.activate(element);
        cursor?.move(event.clientX, event.clientY);
        if (prefetchCancel) {
          prefetchCancel();
        }
        if (element.tagName === "A") {
          prefetchCancel = schedulePrefetch(element);
        } else {
          prefetchCancel = null;
        }
        const anticipate = new CustomEvent("micro:anticipate", {
          bubbles: false,
          detail: { element },
        });
        element.dispatchEvent(anticipate);
      };

      const handlePointerLeave = () => {
        clearHoverTimer();
        clearGuideTimer();
        delete element.dataset.microHover;
        if (element.dataset.microGuided === "pointer") {
          window.setTimeout(() => {
            delete element.dataset.microGuided;
          }, 140);
        }
        delete element.dataset.microPress;
        cursor?.rest();
        cursor?.release();
        if (prefetchCancel) {
          prefetchCancel();
          prefetchCancel = null;
        }
      };

      const handlePointerDown = (event) => {
        if (!isMouseLike(event) && event.pointerType !== "touch") return;
        window.requestAnimationFrame(() => {
          element.dataset.microPress = "true";
          cursor?.press();
        });
      };

      const handlePointerUp = () => {
        delete element.dataset.microPress;
        cursor?.release();
      };

      const handleFocus = (event) => {
        clearFocusTimer();
        const timer = window.setTimeout(() => {
          element.dataset.microFocus = "true";
          element.dataset.microGuided = "focus";
          cursor?.activate(element);
          if (event.target instanceof HTMLElement) {
            const rect = event.target.getBoundingClientRect();
            cursor?.move(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
        }, 24);
        focusTimers.set(element, timer);
      };

      const handleBlur = () => {
        clearFocusTimer();
        if (element.dataset.microGuided === "focus") {
          delete element.dataset.microGuided;
        }
        delete element.dataset.microFocus;
        cursor?.rest();
      };

      const handleKeyDown = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        element.dataset.microPress = "true";
        cursor?.press();
      };

      const handleKeyUp = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        delete element.dataset.microPress;
        cursor?.release();
      };

      const handleClick = (event) => {
        const celebrate =
          element.dataset.microCelebrate === "true" ||
          element.classList.contains("btn-primary") ||
          element.getAttribute("type") === "submit";
        const navIntent = element.closest("nav") ? "interactive-nav" : "interactive";
        const intent = element.dataset.interactionIntent || (celebrate ? "interactive-strong" : navIntent);
        const particleSetting = celebrate
          ? { count: 42 }
          : element.dataset.microParticles === "true"
            ? { count: 24 }
            : false;
        const manual = element.dataset.microManual === "true" || event.__microInteractionHandled;
        if (!manual) {
          dispatchInteraction(intent, {
            event,
            particles: particleSetting,
          });
        }
        if (celebrate) {
          cursor?.celebrate();
        }
      };

      element.addEventListener("pointerenter", handlePointerEnter);
      element.addEventListener("pointerleave", handlePointerLeave);
      element.addEventListener("pointercancel", handlePointerLeave);
      element.addEventListener("pointerdown", handlePointerDown);
      element.addEventListener("pointerup", handlePointerUp);
      element.addEventListener("focus", handleFocus);
      element.addEventListener("blur", handleBlur);
      element.addEventListener("keydown", handleKeyDown);
      element.addEventListener("keyup", handleKeyUp);
      element.addEventListener("click", handleClick);

      cleanupMap.set(element, () => {
        clearHoverTimer();
        clearFocusTimer();
        clearGuideTimer();
        element.removeEventListener("pointerenter", handlePointerEnter);
        element.removeEventListener("pointerleave", handlePointerLeave);
        element.removeEventListener("pointercancel", handlePointerLeave);
        element.removeEventListener("pointerdown", handlePointerDown);
        element.removeEventListener("pointerup", handlePointerUp);
        element.removeEventListener("focus", handleFocus);
        element.removeEventListener("blur", handleBlur);
        element.removeEventListener("keydown", handleKeyDown);
        element.removeEventListener("keyup", handleKeyUp);
        element.removeEventListener("click", handleClick);
        intersection?.unobserve(element);
        if (prefetchCancel) {
          prefetchCancel();
        }
      });
    };

    const initialInteractive = Array.from(document.querySelectorAll(INTERACTIVE_SELECTOR));
    initialInteractive.forEach(registerElement);
    const initialForms = Array.from(document.querySelectorAll(FORM_SELECTOR));
    initialForms.forEach(registerForm);

    const handlePointerMove = (event) => {
      if (!cursor || !isMouseLike(event)) return;
      cursor.move(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    if (cursor) {
      window.addEventListener("blur", cursor.rest);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches?.(INTERACTIVE_SELECTOR)) {
            registerElement(node);
          }
          node.querySelectorAll?.(INTERACTIVE_SELECTOR).forEach((child) => registerElement(child));
          if (node.matches?.(FORM_SELECTOR)) {
            registerForm(node);
          }
          node.querySelectorAll?.(FORM_SELECTOR).forEach((child) => registerForm(child));
        });
        mutation.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const cleanup = cleanupMap.get(node);
          if (cleanup) {
            cleanup();
            cleanupMap.delete(node);
          }
          node.querySelectorAll?.(INTERACTIVE_SELECTOR).forEach((child) => {
            const childCleanup = cleanupMap.get(child);
            if (childCleanup) {
              childCleanup();
              cleanupMap.delete(child);
            }
          });
          const formHandler = formCleanup.get(node);
          if (formHandler) {
            formHandler();
            formCleanup.delete(node);
          }
          node.querySelectorAll?.(FORM_SELECTOR).forEach((child) => {
            const childHandler = formCleanup.get(child);
            if (childHandler) {
              childHandler();
              formCleanup.delete(child);
            }
          });
        });
        if (mutation.type === "attributes" && mutation.attributeName === "data-micro-interactive") {
          if (mutation.target instanceof HTMLElement && mutation.target.dataset.microInteractive === "true") {
            registerElement(mutation.target);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-micro-interactive"],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      if (cursor) {
        window.removeEventListener("blur", cursor.rest);
      }
      cleanupMap.forEach((cleanup) => cleanup());
      cleanupMap.clear();
      formCleanup.forEach((cleanup) => cleanup());
      formCleanup.clear();
      intersection?.disconnect();
      cursor?.destroy();
    };
  }, [dispatchInteraction, reducedMotion]);
}