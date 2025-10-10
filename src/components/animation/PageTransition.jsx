import * as m from "framer-motion/m";

const transition = {
  duration: 0.45,
  ease: [0.6, 0.05, 0.01, 0.9],
};

const variants = {
  initial: { opacity: 0, y: 28, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition },
  exit: { opacity: 0, y: -32, filter: "blur(12px)", transition },
};

export default function PageTransition({ children, className, as: Component = "div" }) {
  return (
    <m.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      style={{ willChange: "opacity, transform, filter" }}
      layout
    >
      <Component className="page-transition__content">{children}</Component>
    </m.div>
  );
}