"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AchievementCelebrationProps {
  achievement: Achievement | null;
  onDismiss?: () => void;
}

/**
 * Animated achievement celebration when reaching milestones
 */
export default function AchievementCelebration({
  achievement,
  onDismiss,
}: AchievementCelebrationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!achievement) {
      setParticles([]);
      return;
    }

    // Generate celebratory particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
    }));

    setParticles(newParticles);

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      onDismiss?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className="fixed bottom-8 right-8 z-50 max-w-sm"
        >
          <div
            className="relative p-6 rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl overflow-hidden"
            style={{
              borderColor: achievement.color,
              boxShadow: `0 20px 60px ${achievement.color}40`,
            }}
          >
            {/* Particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: achievement.color,
                  left: "50%",
                  top: "50%",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: 0,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: particle.id * 0.03,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Content */}
            <div className="relative z-10">
              {/* Icon with pulse effect */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-4"
                style={{
                  backgroundColor: `${achievement.color}20`,
                  border: `2px solid ${achievement.color}`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 3,
                  ease: "easeInOut",
                }}
              >
                {achievement.icon}
              </motion.div>

              {/* Badge */}
              <motion.div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
                style={{
                  backgroundColor: `${achievement.color}20`,
                  color: achievement.color,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                🎉 Achievement Unlocked!
              </motion.div>

              {/* Title */}
              <motion.h4
                className="text-xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {achievement.title}
              </motion.h4>

              {/* Description */}
              <motion.p
                className="text-sm text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {achievement.description}
              </motion.p>
            </div>

            {/* Dismiss button */}
            <motion.button
              onClick={onDismiss}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-700 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            {/* Glow effect */}
            <div
              className="absolute inset-0 opacity-20 blur-2xl pointer-events-none"
              style={{ backgroundColor: achievement.color }}
            />

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




