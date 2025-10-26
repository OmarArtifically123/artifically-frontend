import { useEffect, useState, RefObject } from "react";

/**
 * Simple hook to track if element is in viewport
 * Returns boolean indicating if the element has entered viewport
 */
export function useInViewState(ref: RefObject<HTMLElement>, options?: IntersectionObserverInit): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInView;
}

export default useInViewState;


