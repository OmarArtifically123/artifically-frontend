"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function GlobalProgressBar({ active }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return;
    }

    const tick = () => {
      setProgress((current) => {
        if (current >= 95) {
          return current;
        }
        const increment = current < 60 ? 4 : current < 85 ? 2 : 0.5;
        return Math.min(98, current + increment);
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active]);

  useEffect(() => {
    if (!active && progress > 0) {
      const timeout = setTimeout(() => setProgress(0), 350);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [active, progress]);

  const style = useMemo(() => ({ width: `${active ? progress : 100}%` }), [progress, active]);

  return (
    <div className="global-progress" role="status" aria-live="polite" aria-label="Page loading">
      <span className="global-progress__bar" data-active={active || undefined} style={style} />
    </div>
  );
}