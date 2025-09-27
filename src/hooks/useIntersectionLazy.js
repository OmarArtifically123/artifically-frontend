import { useCallback, useEffect, useRef, useState } from "react";

export default function useIntersectionLazy(options = {}) {
  const [isIntersecting, setIntersecting] = useState(false);
  const elementRef = useRef(null);

  const observer = useRef(null);

  const cleanup = () => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }
  };

  const setRef = useCallback((node) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (!node) {
      elementRef.current = null;
      return;
    }

    elementRef.current = node;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIntersecting(true);
          cleanup();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.15,
        ...options,
      }
    );

    observer.current.observe(node);
  }, [options]);

  useEffect(() => () => cleanup(), []);

  return { ref: setRef, isIntersecting };
}