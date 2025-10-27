"use client";

import { useEffect, useRef, type RefObject } from "react";

interface FocusTrapOptions {
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
}

/**
 * useFocusTrap - Hook to trap focus within a container
 * Useful for modals, dialogs, and other overlay components
 */
export function useFocusTrap(
  isActive: boolean = true,
  externalRef?: RefObject<HTMLElement>,
  options?: FocusTrapOptions
) {
  const internalRef = useRef<HTMLElement | null>(null);
  const containerRef = externalRef || internalRef;

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && options?.onEscape) {
        e.preventDefault();
        options.onEscape();
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Focus initial element
    const focusTarget = options?.initialFocusRef?.current || firstElement;
    focusTarget?.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      
      // Return focus to the element that triggered the trap
      if (options?.returnFocusRef?.current) {
        options.returnFocusRef.current.focus();
      }
    };
  }, [isActive, containerRef, options]);

  return containerRef;
}

export default useFocusTrap;
