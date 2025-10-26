import { useEffect, useRef, useState } from "react";

interface UseIntersectionLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to lazy load components when they enter the viewport
 * Returns [ref, isIntersecting, hasIntersected]
 */
export function useIntersectionLoad<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionLoadOptions = {}
): [React.RefObject<T>, boolean, boolean] {
  const {
    threshold = 0.1,
    rootMargin = "50px",
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already intersected and triggerOnce is true, don't observe
    if (hasIntersected && triggerOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return [ref, isIntersecting, hasIntersected];
}

export default useIntersectionLoad;




