import { forwardRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";

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
    <motion.div ref={ref} style={{ y, willChange: "transform", ...style }} className={className}>
      {children}
    </motion.div>
  );
});

export default ParallaxSection;