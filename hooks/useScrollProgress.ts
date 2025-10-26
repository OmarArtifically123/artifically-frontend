import { useEffect, useState } from "react";
import { throttle } from "lodash";

interface ScrollProgress {
  scrollY: number;
  scrollPercentage: number;
  direction: "up" | "down" | null;
  isAtTop: boolean;
  isAtBottom: boolean;
}

/**
 * Hook to track scroll position and progress through the page
 */
export function useScrollProgress(): ScrollProgress {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    scrollY: 0,
    scrollPercentage: 0,
    direction: null,
    isAtTop: true,
    isAtBottom: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastScrollY = window.scrollY;

    const updateScrollProgress = throttle(() => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;
      
      const direction = scrollY > lastScrollY ? "down" : scrollY < lastScrollY ? "up" : null;
      const isAtTop = scrollY < 10;
      const isAtBottom = scrollY >= documentHeight - 10;

      setScrollProgress({
        scrollY,
        scrollPercentage,
        direction,
        isAtTop,
        isAtBottom,
      });

      lastScrollY = scrollY;
    }, 100);

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      updateScrollProgress.cancel();
    };
  }, []);

  return scrollProgress;
}

export default useScrollProgress;




