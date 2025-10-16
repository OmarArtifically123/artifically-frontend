import { useEffect, useRef, useState } from "react";

// Small IntersectionObserver helper that returns a ref and a boolean indicating
// if the node has entered the viewport. By default it only fires once to avoid
// re-running entrance animations.
export default function useInViewState({
  threshold = 0.25,
  rootMargin = "0px",
  once = true,
} = {}) {
  const nodeRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== node) return;
          if (entry.isIntersecting) {
            setInView(true);
            if (once) {
              observer.unobserve(node);
            }
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return [nodeRef, inView];
}