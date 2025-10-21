import { useEffect, type RefObject } from "react";

import { getFocusableElements } from "@/utils/focus";

interface RovingFocusOptions {
  loop?: boolean;
  onEscape?: () => void;
}

export function useRovingFocus(
  containerRef: RefObject<HTMLElement | null>,
  { loop = true, onEscape }: RovingFocusOptions = {},
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!container.contains(event.target as Node)) {
        return;
      }

      const target = event.target as HTMLElement;
      if (target.isContentEditable) {
        return;
      }
      const tagName = target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea") {
        return;
      }

      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        return;
      }

      const currentIndex = focusable.findIndex((element) => element === target);

      if (event.key === "Home") {
        event.preventDefault();
        focusable[0].focus({ preventScroll: true });
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusable[focusable.length - 1].focus({ preventScroll: true });
        return;
      }

      const isNextKey = event.key === "ArrowRight" || event.key === "ArrowDown";
      const isPreviousKey = event.key === "ArrowLeft" || event.key === "ArrowUp";

      if (!isNextKey && !isPreviousKey) {
        return;
      }

      event.preventDefault();

      if (currentIndex === -1) {
        focusable[0].focus({ preventScroll: true });
        return;
      }

      let nextIndex = currentIndex + (isNextKey ? 1 : -1);

      if (nextIndex < 0) {
        nextIndex = loop ? focusable.length - 1 : 0;
      } else if (nextIndex >= focusable.length) {
        nextIndex = loop ? 0 : focusable.length - 1;
      }

      focusable[nextIndex].focus({ preventScroll: true });
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, loop, onEscape]);
}