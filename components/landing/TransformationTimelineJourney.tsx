"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import useInViewState from "@/hooks/useInViewState";
import Timeline3DMilestone from "./components/Timeline3DMilestone";
import ROIGraphOverlay from "./components/ROIGraphOverlay";
import BranchingPath from "./components/BranchingPath";
import AchievementCelebration from "./components/AchievementCelebration";
import styles from "./TransformationTimelineJourney.module.css";

const PATH_OPTIONS = [
  {
    id: "startup",
    label: "Startup",
    description: "< 50 employees, rapid iteration",
    icon: "🚀",
    color: "#06b6d4",
  },
  {
    id: "midmarket",
    label: "Mid-Market",
    description: "50-500 employees, scaling operations",
    icon: "📈",
    color: "#8b5cf6",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "500+ employees, complex infrastructure",
    icon: "🏢",
    color: "#ec4899",
  },
];

const MILESTONES = {
  startup: [
    {
      day: 1,
      title: "Quick Setup",
      description: "Platform deployed and configured",
      icon: "⚡",
      color: "#06b6d4",
      metrics: [
        { label: "Setup Time", value: "2 hours" },
        { label: "Integrations", value: "5 connected" },
      ],
    },
    {
      day: 7,
      title: "First Automations",
      description: "Core workflows automated",
      icon: "🤖",
      color: "#06b6d4",
      metrics: [
        { label: "Flows Active", value: "12" },
        { label: "Time Saved", value: "8 hrs/wk" },
      ],
    },
    {
      day: 14,
      title: "Optimization Begins",
      description: "AI learns patterns, suggests improvements",
      icon: "🧠",
      color: "#06b6d4",
      metrics: [
        { label: "Automation", value: "45%" },
        { label: "Accuracy", value: "94%" },
      ],
    },
    {
      day: 30,
      title: "First ROI Milestone",
      description: "Positive ROI achieved",
      icon: "💰",
      color: "#10b981",
      metrics: [
        { label: "ROI", value: "2.1x" },
        { label: "Cost Saved", value: "$12K" },
      ],
    },
    {
      day: 60,
      title: "Scale & Expand",
      description: "Adding more workflows and integrations",
      icon: "📊",
      color: "#06b6d4",
      metrics: [
        { label: "Flows Active", value: "42" },
        { label: "ROI", value: "3.8x" },
      ],
    },
  ],
  midmarket: [
    {
      day: 1,
      title: "Enterprise Setup",
      description: "Full platform deployment with SSO",
      icon: "🔐",
      color: "#8b5cf6",
      metrics: [
        { label: "Setup Time", value: "1 day" },
        { label: "Users Onboarded", value: "150" },
      ],
    },
    {
      day: 10,
      title: "Department Rollout",
      description: "Multi-department automation begins",
      icon: "🏗️",
      color: "#8b5cf6",
      metrics: [
        { label: "Departments", value: "4" },
        { label: "Workflows", value: "28" },
      ],
    },
    {
      day: 21,
      title: "Cross-Function Integration",
      description: "Departments connected, data flowing",
      icon: "🔗",
      color: "#8b5cf6",
      metrics: [
        { label: "Integrations", value: "15" },
        { label: "Data Sync", value: "Real-time" },
      ],
    },
    {
      day: 42,
      title: "ROI Breakeven",
      description: "Investment recovered, pure profit begins",
      icon: "💎",
      color: "#10b981",
      metrics: [
        { label: "ROI", value: "3.2x" },
        { label: "Time Saved", value: "89 hrs/wk" },
      ],
    },
    {
      day: 60,
      title: "Optimization Phase",
      description: "AI-driven continuous improvement",
      icon: "🎯",
      color: "#8b5cf6",
      metrics: [
        { label: "Automation", value: "76%" },
        { label: "ROI", value: "5.1x" },
      ],
    },
  ],
  enterprise: [
    {
      day: 1,
      title: "Enterprise Deployment",
      description: "Multi-region setup with governance",
      icon: "🌍",
      color: "#ec4899",
      metrics: [
        { label: "Regions", value: "3" },
        { label: "Users", value: "1,200" },
      ],
    },
    {
      day: 14,
      title: "Pilot Success",
      description: "Initial departments showing results",
      icon: "✅",
      color: "#ec4899",
      metrics: [
        { label: "Pilot Depts", value: "6" },
        { label: "Success Rate", value: "98%" },
      ],
    },
    {
      day: 30,
      title: "Organization-Wide Rollout",
      description: "All departments integrated",
      icon: "🚀",
      color: "#ec4899",
      metrics: [
        { label: "Total Users", value: "1,200" },
        { label: "Workflows", value: "156" },
      ],
    },
    {
      day: 60,
      title: "Business Transformation",
      description: "Major process improvements visible",
      icon: "⚡",
      color: "#ec4899",
      metrics: [
        { label: "Automation", value: "87%" },
        { label: "ROI", value: "4.4x" },
      ],
    },
    {
      day: 90,
      title: "Strategic Advantage",
      description: "Competitive edge established",
      icon: "👑",
      color: "#f59e0b",
      metrics: [
        { label: "Cost Savings", value: "$1.2M" },
        { label: "ROI", value: "6.2x" },
      ],
    },
  ],
};

const ROI_DATA = {
  startup: [
    { day: 1, value: 0, label: "0x" },
    { day: 7, value: 0.8, label: "0.8x" },
    { day: 14, value: 1.5, label: "1.5x" },
    { day: 30, value: 2.1, label: "2.1x" },
    { day: 60, value: 3.8, label: "3.8x" },
  ],
  midmarket: [
    { day: 1, value: 0, label: "0x" },
    { day: 10, value: 1.2, label: "1.2x" },
    { day: 21, value: 2.4, label: "2.4x" },
    { day: 42, value: 3.2, label: "3.2x" },
    { day: 60, value: 5.1, label: "5.1x" },
  ],
  enterprise: [
    { day: 1, value: 0, label: "0x" },
    { day: 14, value: 1.5, label: "1.5x" },
    { day: 30, value: 2.8, label: "2.8x" },
    { day: 60, value: 4.4, label: "4.4x" },
    { day: 90, value: 6.2, label: "6.2x" },
  ],
};

/**
 * Transformation Timeline Journey - Interactive horizontal timeline
 */
export default function TransformationTimelineJourney() {
  const [selectedPath, setSelectedPath] = useState("midmarket");
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [achievement, setAchievement] = useState<{
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  } | null>(null);
  const containerRef = useRef(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInViewState(containerRef);

  const milestones = MILESTONES[selectedPath as keyof typeof MILESTONES];
  const roiData = ROI_DATA[selectedPath as keyof typeof ROI_DATA];
  const pathColor = PATH_OPTIONS.find((p) => p.id === selectedPath)?.color || "#8b5cf6";

  const handleMilestoneClick = (index: number) => {
    setActiveMilestone(index);
    
    // Show achievement celebration for major milestones
    const milestone = milestones[index];
    if (milestone.day === 30 || milestone.day === 42 || milestone.day === 60 || milestone.day === 90) {
      setAchievement({
        id: `milestone-${index}`,
        title: milestone.title,
        description: milestone.description,
        icon: milestone.icon,
        color: milestone.color,
      });
    }
  };

  const handlePathChange = (pathId: string) => {
    setSelectedPath(pathId);
    setActiveMilestone(0);
    
    // Scroll timeline back to start
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = 0;
    }
  };

  return (
    <section
      id="transformation-timeline"
      ref={containerRef}
      className={styles.section}
      aria-labelledby="timeline-title"
    >
      {/* Background effects */}
      <div className={styles.background}>
        <div
          className={styles.glowOrb}
          style={{ background: `radial-gradient(circle, ${pathColor}15, transparent 70%)` }}
        />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span className={styles.badge} style={{ color: pathColor }}>
            YOUR TRANSFORMATION JOURNEY
          </motion.span>

          <h2 id="timeline-title" className={styles.title}>
            From Day 1 to{" "}
            <span className={styles.titleGradient} style={{ color: pathColor }}>
              Transformation
            </span>
          </h2>

          <p className={styles.description}>
            See the proven path to success. Every milestone, every achievement, from setup to
            strategic advantage.
          </p>
        </motion.div>

        {/* Path Selector */}
        <BranchingPath
          options={PATH_OPTIONS}
          onSelect={handlePathChange}
          selectedPath={selectedPath}
        />

        {/* ROI Graph */}
        <div className="mt-12 mb-8">
          <ROIGraphOverlay data={roiData} color={pathColor} isActive={isInView} />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0" />

          {/* Scrollable timeline */}
          <div
            ref={timelineRef}
            className={styles.timelineScroll}
            onScroll={(e) => {
              const target = e.currentTarget;
              const scrollPercentage = target.scrollLeft / (target.scrollWidth - target.clientWidth);
              const milestoneIndex = Math.floor(scrollPercentage * milestones.length);
              if (milestoneIndex !== activeMilestone && milestoneIndex < milestones.length) {
                setActiveMilestone(milestoneIndex);
              }
            }}
          >
            <div className="flex items-start pb-8">
              {milestones.map((milestone, index) => (
                <Timeline3DMilestone
                  key={`${selectedPath}-${index}`}
                  milestone={milestone}
                  index={index}
                  isActive={activeMilestone === index}
                  onClick={() => handleMilestoneClick(index)}
                />
              ))}
            </div>
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {milestones.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveMilestone(index);
                  if (timelineRef.current) {
                    const scrollPosition = (index / milestones.length) * timelineRef.current.scrollWidth;
                    timelineRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
                  }
                }}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: activeMilestone === index ? pathColor : "#475569",
                  width: activeMilestone === index ? "1.5rem" : "0.5rem",
                }}
                aria-label={`Go to milestone ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className={styles.ctaButton}
            style={{
              backgroundColor: `${pathColor}20`,
              borderColor: `${pathColor}60`,
              color: pathColor,
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </div>

      {/* Achievement Celebration */}
      <AchievementCelebration
        achievement={achievement}
        onDismiss={() => setAchievement(null)}
      />
    </section>
  );
}




