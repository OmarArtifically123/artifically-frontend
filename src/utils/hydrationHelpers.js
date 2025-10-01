import { useEffect, useState } from "react";

export function suppressHydrationWarning(element) {
  if (!element || typeof element !== "object") {
    return element;
  }

  return {
    ...element,
    props: {
      ...(element.props || {}),
      suppressHydrationWarning: true,
    },
  };
}

export function isHydrating() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.__HYDRATING__);
}

export function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback;
  }

  return typeof children === "function" ? children() : children;
}

export function markHydrationStart() {
  if (typeof window !== "undefined") {
    window.__HYDRATING__ = true;
  }
}

export function markHydrationEnd() {
  if (typeof window !== "undefined") {
    window.__HYDRATING__ = false;
  }
}