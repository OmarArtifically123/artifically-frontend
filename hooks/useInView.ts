'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type UseInViewOptions = {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
};

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0, triggerOnce = false, rootMargin = '0px' } = options;
  const [inView, setInView] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting;
        setInView(isInView);

        if (isInView && triggerOnce && element) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, triggerOnce, rootMargin]);

  return { ref, inView };
}

