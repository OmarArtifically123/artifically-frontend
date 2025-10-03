import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.22,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 210,
      damping: 22,
      mass: 0.9,
    },
  },
};

export function StaggeredContainer({ children, ...props }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItem({ children, ...props }) {
  return (
    <motion.div variants={itemVariants} {...props}>
      {typeof children === "function" ? children(itemVariants) : children}
    </motion.div>
  );
}