"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useInViewState from "@/hooks/useInViewState";

const ROLES = [
  {
    id: "finance",
    label: "Finance",
    description: "Automated reconciliation, variance alerts, audit trails",
    color: "#10b981",
    metrics: {
      automation: "87%",
      timesSaved: "142",
      accuracy: "99.97%",
    },
    icon: "📊",
  },
  {
    id: "support",
    label: "Support",
    description: "AI-powered resolution, deflection, sentiment analysis",
    color: "#f59e0b",
    metrics: {
      automation: "64%",
      timesSaved: "89",
      accuracy: "94.2%",
    },
    icon: "🎧",
  },
  {
    id: "operations",
    label: "Operations",
    description: "Intelligent routing, predictive maintenance, optimization",
    color: "#8b5cf6",
    metrics: {
      automation: "76%",
      timesSaved: "156",
      accuracy: "98.4%",
    },
    icon: "⚙️",
  },
];

function RoleVisualizerCanvas({ roleIndex }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Initialize particles for this role
    const particleCount = 12;
    const particles = [];
    const role = ROLES[roleIndex];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 2 + Math.random() * 3,
        age: Math.random() * 1,
      });
    }

    particlesRef.current = particles;

    let animationTime = 0;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      animationTime += 0.016;

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.age += 0.01;

        // Wrap around
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw particle with glow
        const opacity = Math.max(0, 1 - particle.age * 0.5);
        ctx.fillStyle = role.color + Math.floor(opacity * 100).toString(16).padStart(2, "0");
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity2 = (1 - distance / 120) * 0.3;
            ctx.strokeStyle = role.color + Math.floor(opacity2 * 100).toString(16).padStart(2, "0");
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [roleIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(10,10,20,0.5), rgba(20,15,40,0.5))",
      }}
    />
  );
}

function RoleCard({ role, isActive, onClick, index }) {
  const cardRef = useRef(null);
  const isInView = useInViewState(cardRef);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.15, duration: 0.6 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <motion.div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isActive ? "ring-2" : "ring-1 ring-slate-700"
        }`}
        style={{
          borderColor: isActive ? role.color : undefined,
          backgroundColor: "rgba(10,10,20,0.4)",
        }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Canvas Visualizer */}
        <div className="h-64 overflow-hidden">
          <RoleVisualizerCanvas roleIndex={ROLES.indexOf(role)} />
        </div>

        {/* Content Overlay */}
        <motion.div className="p-6 bg-gradient-to-t from-black via-black/50 to-transparent absolute inset-0 flex flex-col justify-end">
          <motion.div variants={contentVariants}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{role.icon}</span>
              <h3 className="text-xl font-semibold text-white">{role.label}</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">{role.description}</p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(role.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{ color: role.color }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            className="absolute top-4 right-4"
            layoutId="activeIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: role.color, boxShadow: `0 0 12px ${role.color}` }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function IntelligenceUnveiling() {
  const [activeRole, setActiveRole] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const headlineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.2, duration: 0.6 },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,20,0.3), rgba(15,15,30,0.5))",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{
            background: ROLES[activeRole].color,
            transition: "all 0.8s ease-out",
          }}
        />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-cyan-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headlineVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={descriptionVariants}>
            <span
              className="inline-block text-sm font-semibold px-3 py-1 rounded-full border mb-4"
              style={{
                color: ROLES[activeRole].color,
                borderColor: ROLES[activeRole].color + "33",
                backgroundColor: ROLES[activeRole].color + "11",
              }}
            >
              INTELLIGENT ADAPTATION
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            variants={descriptionVariants}
          >
            One System,
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${ROLES[activeRole].color}, #06b6d4)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Infinite Optimizations
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-slate-400 max-w-2xl mx-auto"
            variants={descriptionVariants}
          >
            The system learns your role, understands your challenges, and automatically optimizes
            its responses. Not a tool built for everyone. A system that adapts to each of you.
          </motion.p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ROLES.map((role, index) => (
            <RoleCard
              key={role.id}
              role={role}
              isActive={activeRole === index}
              onClick={() => setActiveRole(index)}
              index={index}
            />
          ))}
        </div>

        {/* Active Role Details */}
        <motion.div
          key={activeRole}
          className="mt-16 pt-12 border-t border-slate-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Why This Matters</h3>
              <p className="text-slate-400 leading-relaxed">
                Generic automation tools treat all users the same. The system analyzes your workflows, understands your constraints, and delivers optimization that's unique to your role. This is why enterprises achieve 4.4x-6.2x ROI with Artifically.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Your Impact</h3>
              <ul className="space-y-3">
                {Object.entries(ROLES[activeRole].metrics).map(([key, value]) => (
                  <li key={key} className="flex items-center gap-3 text-slate-300">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ROLES[activeRole].color }}
                    />
                    <span>
                      <strong style={{ color: ROLES[activeRole].color }}>{value}</strong>{" "}
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
