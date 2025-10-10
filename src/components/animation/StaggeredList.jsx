import { useEffect, useRef } from "react";

export function StaggeredContainer({ children, threshold = 0.2, className = "", ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const reveal = () => {
      node.dataset.reveal = "true";
    };

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      reveal();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold: [threshold, 0.6, 0.8] },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`staggered ${className}`.trim()} data-reveal="false" {...props}>
      {children}
    </div>
  );
}

export function StaggeredItem({ children, index = 0, className = "", style, ...props }) {
  return (
    <div
      className={`staggered__item ${className}`.trim()}
      style={{ "--stagger-index": index, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}