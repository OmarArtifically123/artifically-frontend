import { forwardRef } from "react";
import * as m from "framer-motion/m";
import { useTransform, useScroll } from "framer-motion";

const ParallaxSection = forwardRef(function ParallaxSection(
  { children, speed = 0.5, className, style },
  ref,
) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <m.div ref={ref} style={{ y, willChange: "transform", ...style }} className={className}>
      {children}
    </m.div>
  );
});

export default ParallaxSection;