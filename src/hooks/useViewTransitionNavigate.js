import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

const supportsViewTransitions = () => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }
  if (!("startViewTransition" in document)) {
    return false;
  }
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (error) {
    return true;
  }
};

export default function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to, options) => {
      if (!supportsViewTransitions()) {
        navigate(to, options);
        return;
      }

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          navigate(to, options);
        });
      });

      transition?.finished?.catch(() => {
        /* noop */
      });
    },
    [navigate],
  );
}