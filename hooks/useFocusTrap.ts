import { useEffect, useRef, type RefObject } from "react";

import { getFocusableElements, isFocusableElement } from "@/utils/focus";

interface FocusTrapOptions {
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  options: FocusTrapOptions = {},
) {
  const { initialFocusRef, returnFocusRef, onEscape } = options;
  const restoreElementRef = useRef<HTMLElement | null>(null);
  const hasActivatedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      if (!hasActivatedRef.current) {
        return;
      }
      hasActivatedRef.current = false;
      if (typeof window === "undefined") {
        return;
      }
      const restoreTarget = returnFocusRef?.current || restoreElementRef.current;
      if (restoreTarget && typeof restoreTarget.focus === "function") {
        requestAnimationFrame(() => {
          restoreTarget.focus({ preventScroll: true });
        });
      }
      return;
    }

    if (typeof document === "undefined") {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    hasActivatedRef.current = true;
    const previouslyFocused = document.activeElement;
    if (isFocusableElement(previouslyFocused as HTMLElement | null)) {
      restoreElementRef.current = previouslyFocused as HTMLElement;
    } else {
      restoreElementRef.current = null;
    }

    const focusInitial = () => {
      const explicit = initialFocusRef?.current;
      if (isFocusableElement(explicit ?? null)) {
        explicit!.focus({ preventScroll: true });
        return;
      }
      const focusable = getFocusableElements(container);
      const target = focusable[0] ?? container;
      target.focus({ preventScroll: true });
    };

    requestAnimationFrame(focusInitial);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!container.contains(event.target as Node | null)) {
        return;
      }

      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        event.stopPropagation();
        onEscape();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        event.stopPropagation();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!current || current === first || !container.contains(current)) {
          event.preventDefault();
          event.stopPropagation();
          last.focus({ preventScroll: true });
        }
        return;
      }

      if (!current || current === last) {
        event.preventDefault();
        event.stopPropagation();
        first.focus({ preventScroll: true });
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || container.contains(target)) {
        return;
      }
      const focusable = getFocusableElements(container);
      const fallback = focusable[0] ?? container;
      fallback.focus({ preventScroll: true });
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("focusin", handleFocusIn, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("focusin", handleFocusIn, true);
      hasActivatedRef.current = false;
      const restoreTarget = returnFocusRef?.current || restoreElementRef.current;
      if (restoreTarget && typeof restoreTarget.focus === "function") {
        requestAnimationFrame(() => {
          restoreTarget.focus({ preventScroll: true });
        });
      }
    };
  }, [active, containerRef, initialFocusRef, onEscape, returnFocusRef]);
}