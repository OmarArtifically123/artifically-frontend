import { createContext, useContext, useMemo } from "react";
import { MotionConfig } from "framer-motion";

const AnimationContext = createContext({
  baseTransition: {
    type: "spring",
    stiffness: 420,
    damping: 36,
    mass: 1,
  },
  reducedMotion: false,
});

export function AnimationProvider({ children }) {
  const value = useMemo(
    () => ({
      baseTransition: {
        type: "spring",
        stiffness: 420,
        damping: 36,
        mass: 1,
      },
      reducedMotion: typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
    }),
    [],
  );

  return (
    <AnimationContext.Provider value={value}>
      <MotionConfig transition={value.baseTransition}>{children}</MotionConfig>
    </AnimationContext.Provider>
  );
}

export function useAnimationConfig() {
  return useContext(AnimationContext);
}