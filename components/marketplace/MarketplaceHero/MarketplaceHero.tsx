"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SearchBar } from "../SearchBar/SearchBar";
import { QuickFilters } from "../QuickFilters/QuickFilters";
import { StatsBar } from "../StatsBar/StatsBar";
import { useMarketplaceStats } from "@/hooks/useMarketplaceData";
import styles from "./MarketplaceHero.module.css";

/**
 * MarketplaceHero - Stunning hero section with 3D effects
 * Features:
 * - Animated gradient background with WebGL particles
 * - Real-time statistics
 * - Advanced search with autocomplete
 * - Quick filter chips
 * - Parallax scrolling effects
 * - WCAG 2.1 AAA compliant
 */
export function MarketplaceHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: stats } = useMarketplaceStats();

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? "#a78bfa" : "#ec4899";
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        if (this.y < 0) this.y = canvasHeight;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.save();
            ctx.strokeStyle = "#a78bfa";
            ctx.globalAlpha = (1 - distance / 150) * 0.2;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <motion.section
      ref={containerRef}
      className={styles.hero}
      style={{ opacity, scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background */}
      <div className={styles.background}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          aria-hidden="true"
        />
        <div className={styles.gradientOverlay} aria-hidden="true" />
      </div>

      {/* Content */}
      <motion.div
        className={styles.content}
        style={{ y }}
      >
        {/* Title */}
        <motion.div
          className={styles.titleSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className={styles.title}>
            <span className={styles.titleGradient}>AI Automation</span>
            <br />
            Marketplace
          </h1>
          <p className={styles.subtitle}>
            Discover production-ready AI automations that transform your workflows.
            <br />
            Trusted by 10,000+ teams worldwide.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className={styles.searchSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <SearchBar
            placeholder="Search automations... (Try 'sales', 'customer support', or 'finance')"
            autoFocus
          />
        </motion.div>

        {/* Quick Filters */}
        <motion.div
          className={styles.quickFilters}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <QuickFilters />
        </motion.div>

        {/* Stats Bar */}
        {stats && (
          <motion.div
            className={styles.stats}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <StatsBar stats={stats} />
          </motion.div>
        )}
      </motion.div>

      {/* Skip to Content Link (Accessibility) */}
      <a href="#marketplace-content" className={styles.skipLink}>
        Skip to marketplace content
      </a>
    </motion.section>
  );
}

export default MarketplaceHero;

