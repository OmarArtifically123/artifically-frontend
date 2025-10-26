"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AIAvatarProps {
  role: string;
  color: string;
  icon: string;
  isActive: boolean;
}

/**
 * Animated AI avatar for each role with particle effects
 * Using CSS animations instead of Lottie for better performance
 */
export default function AIAvatar({ role, color, icon, isActive }: AIAvatarProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Generate floating particles around avatar
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
    }));

    setParticles(newParticles);
  }, [isActive]);

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Avatar circle */}
      <motion.div
        className="relative w-full h-full rounded-full flex items-center justify-center text-6xl overflow-hidden"
        style={{
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          boxShadow: isActive ? `0 0 30px ${color}50` : "none",
        }}
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
          boxShadow: isActive
            ? [
                `0 0 20px ${color}50`,
                `0 0 40px ${color}70`,
                `0 0 20px ${color}50`,
              ]
            : `0 0 0px ${color}00`,
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {icon}

        {/* Neural network pattern overlay */}
        {isActive && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle, transparent 40%, ${color}10 100%)`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            left: "50%",
            top: "50%",
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [0, particle.x, 0],
            y: [0, particle.y, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: particle.id * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Orbital rings */}
      {isActive && (
        <>
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${color}`,
                opacity: 0.2,
              }}
              initial={{
                scale: 1,
                opacity: 0.3,
              }}
              animate={{
                scale: 1 + ring * 0.2,
                opacity: 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Role label */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium"
        style={{
          color: isActive ? color : "#94a3b8",
        }}
        animate={{
          y: isActive ? [-2, 2, -2] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {role}
      </motion.div>
    </div>
  );
}





