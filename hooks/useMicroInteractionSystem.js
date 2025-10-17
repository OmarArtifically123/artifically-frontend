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

function isMouseLike(event) {
  return event.pointerType === "mouse" || event.pointerType === "pen" || event.pointerType === "";
}

export default function useMicroInteractionSystem({ enabled, pointerFine, reducedMotion }) {
  const { dispatchInteraction, reducedMotion: contextReducedMotion } = useMicroInteractions();
  const motionDisabled = reducedMotion ?? contextReducedMotion;

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const preferFinePointer = Boolean(pointerFine);
    const cursor = null;

    const hoverTimers = new Map();
    const focusTimers = new Map();
    const guideTimers = new Map();
    const prefetchMap = new Map();
    const preparedElements = new WeakSet();

    const clearTimer = (map, element) => {
      const timer = map.get(element);
      if (timer) {
        window.clearTimeout(timer);
        map.delete(element);
      }
    };

    const cancelPrefetch = (element) => {
      const cancel = prefetchMap.get(element);
      if (typeof cancel === "function") {
        cancel();
      }
      prefetchMap.delete(element);
    };

    const prepareElement = (element) => {
      if (preparedElements.has(element)) return;
      preparedElements.add(element);
      element.dataset.microInteractive = element.dataset.microInteractive || "true";
      if (preferFinePointer && !motionDisabled && element.dataset.magnetic !== "false" && !element.dataset.magnetic) {
        element.dataset.magnetic = "true";
        if (!element.dataset.magneticStrength) {
          if (element.classList.contains("button--primary")) {
            element.dataset.magneticStrength = "1.1";
          } else if (element.classList.contains("button")) {
            element.dataset.magneticStrength = "0.85";
          } else {
            element.dataset.magneticStrength = "0.65";
          }
        }
      }
      if (!element.dataset.ripple && element.tagName === "BUTTON") {
        element.dataset.ripple = "true";
      }
    };

    const getInteractive = (node) => {
      if (!(node instanceof Element)) return null;
      return node.closest(INTERACTIVE_SELECTOR);
    };

    const clearHover = (element) => {
      clearTimer(hoverTimers, element);
      delete element.dataset.microHover;
      cancelPrefetch(element);
    };

    const clearFocus = (element) => {
      clearTimer(focusTimers, element);
      if (element.dataset.microGuided === "focus") {
        delete element.dataset.microGuided;
      }
      delete element.dataset.microFocus;
    };

    const clearGuide = (element) => {
      clearTimer(guideTimers, element);
      delete element.dataset.microGuided;
    };

    const isMouseLike = (event) =>
      event.pointerType === "mouse" || event.pointerType === "pen" || event.pointerType === "";

    const handlePointerOver = (event) => {
      if (!isMouseLike(event)) return;
      const element = getInteractive(event.target);
      if (!element) return;
      prepareElement(element);
      clearTimer(guideTimers, element);
      clearTimer(hoverTimers, element);
      const timer = window.setTimeout(() => {
        element.dataset.microHover = "true";
      }, 40);
      hoverTimers.set(element, timer);
      element.dataset.microGuided = "pointer";
      cursor?.activate(element);
      cursor?.move(event.clientX, event.clientY);
      cancelPrefetch(element);
      if (element.tagName === "A") {
        const cancel = schedulePrefetch(element);
        if (cancel) {
          prefetchMap.set(element, cancel);
        }
      }
    };

    const handlePointerOut = (event) => {
      const element = getInteractive(event.target);
      if (!element) return;
      if (event.relatedTarget instanceof Element && element.contains(event.relatedTarget)) {
        return;
      }
      clearHover(element);
      if (element.dataset.microGuided === "pointer") {
        clearTimer(guideTimers, element);
        const timer = window.setTimeout(() => {
          if (element.dataset.microGuided === "pointer") {
            delete element.dataset.microGuided;
          }
          guideTimers.delete(element);
        }, 140);
        guideTimers.set(element, timer);
      } else {
        clearGuide(element);
      }
      delete element.dataset.microPress;
      cursor?.release();
      cursor?.rest();
    };

    const handlePointerCancel = (event) => {
      const element = getInteractive(event.target);
      if (!element) return;
      clearHover(element);
      clearGuide(element);
      delete element.dataset.microPress;
      cursor?.release();
      cursor?.rest();
    };

    const handlePointerDown = (event) => {
      if (!isMouseLike(event) && event.pointerType !== "touch") return;
      const element = getInteractive(event.target);
      if (!element) return;
      prepareElement(element);
      window.requestAnimationFrame(() => {
        element.dataset.microPress = "true";
        cursor?.press();
      });
    };

    const handlePointerUp = (event) => {
      const element = getInteractive(event.target);
      if (!element) return;
      delete element.dataset.microPress;
      cursor?.release();
    };

    const handleFocusIn = (event) => {
      const element = getInteractive(event.target);
      if (!element) return;
      prepareElement(element);
      clearFocus(element);
      const timer = window.setTimeout(() => {
        element.dataset.microFocus = "true";
        element.dataset.microGuided = "focus";
        if (event.target instanceof HTMLElement) {
          const rect = event.target.getBoundingClientRect();
          cursor?.activate(element);
          cursor?.move(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      }, 24);
      focusTimers.set(element, timer);
    };

    const handleFocusOut = (event) => {
      const element = getInteractive(event.target);
      if (!element) return;
      clearFocus(element);
      cursor?.rest();
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const element = getInteractive(event.target);
      if (!element) return;
      element.dataset.microPress = "true";
      cursor?.press();
    };

    const handleKeyUp = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const element = getInteractive(event.target);
      if (!element) return;
      delete element.dataset.microPress;
      cursor?.release();
    };

    const handleClick = (event) => {
      const element = getInteractive(event.target);
      if (!element) return;
      prepareElement(element);
      const celebrate =
        element.dataset.microCelebrate === "true" ||
        element.classList.contains("button--primary") ||
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

    const handleSubmit = (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.matches(FORM_SELECTOR)) return;
      dispatchInteraction("form-celebrate", { event, particles: { count: 72 } });
      cursor?.celebrate();
    };

    const handlePointerMove = (event) => {
      if (!cursor || !isMouseLike(event)) return;
      cursor.move(event.clientX, event.clientY);
    };

    const handleWindowBlur = () => {
      cursor?.rest();
      cursor?.release();
    };

    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointerout", handlePointerOut, true);
    document.addEventListener("pointercancel", handlePointerCancel, true);
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointerup", handlePointerUp, true);
    document.addEventListener("focusin", handleFocusIn, true);
    document.addEventListener("focusout", handleFocusOut, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyUp, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    if (cursor) { 
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("blur", handleWindowBlur);
    }

    return () => {
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointerout", handlePointerOut, true);
      document.removeEventListener("pointercancel", handlePointerCancel, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointerup", handlePointerUp, true);
      document.removeEventListener("focusin", handleFocusIn, true);
      document.removeEventListener("focusout", handleFocusOut, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyUp, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      if (cursor) {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("blur", handleWindowBlur);
      }
      hoverTimers.forEach((timer) => window.clearTimeout(timer));
      hoverTimers.clear();
      focusTimers.forEach((timer) => window.clearTimeout(timer));
      focusTimers.clear();
      guideTimers.forEach((timer) => window.clearTimeout(timer));
      guideTimers.clear();
      prefetchMap.forEach((cancel) => {
        if (typeof cancel === "function") {
          cancel();
        }
      });
      prefetchMap.clear();
      cursor?.destroy();
    };
  }, [dispatchInteraction, enabled, motionDisabled, pointerFine]);
}