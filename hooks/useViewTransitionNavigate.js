import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";

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

const navigateWithOptions = (router, to, options) => {
  const method = options?.replace ? router.replace : router.push;
  if (options?.scroll !== undefined) {
    method(to, { scroll: options.scroll });
    return;
  }
  method(to);
};

export default function useViewTransitionNavigate() {
  const router = useRouter();

  return useCallback(
    (to, options) => {
      if (!supportsViewTransitions()) {
        navigateWithOptions(router, to, options);
        return;
      }

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          navigateWithOptions(router, to, options);
        });
      });

      transition?.finished?.catch(() => {
        /* noop */
      });
    },
    [router],
  );
}