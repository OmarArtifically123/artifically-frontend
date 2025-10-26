"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import useScrollProgress from "@/hooks/useScrollProgress";
import useReducedMotion from "@/hooks/useReducedMotion";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "value", label: "Value", href: "#value-proposition" },
  { id: "platform", label: "Platform", href: "#technology-architecture" },
  { id: "results", label: "Results", href: "#proven-at-scale" },
  { id: "security", label: "Security", href: "#security-fortress" },
  { id: "pricing", label: "Pricing", href: "#pricing" },
];

/**
 * Context-aware sticky navigation that appears after hero
 * Adapts based on scroll position and direction
 */
export default function SmartStickyNav() {
  const { scrollY, direction, isAtTop } = useScrollProgress();
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    // Show nav after scrolling past hero (assumed to be ~800px)
    setIsVisible(scrollY > 800 && !isAtTop);

    // Hide when scrolling down rapidly, show when scrolling up
    if (direction === "down" && scrollY > 1000) {
      setIsVisible(false);
    } else if (direction === "up" && scrollY > 800) {
      setIsVisible(true);
    }
  }, [scrollY, direction, isAtTop]);

  useEffect(() => {
    // Detect active section based on scroll position
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    navItems.forEach((item) => {
      const element = document.querySelector(item.href);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : 0.3,
            ease: "easeOut",
          }}
          className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 shadow-lg"
          role="navigation"
          aria-label="Section navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-white text-lg"
              >
                Artifically
              </motion.div>

              {/* Navigation Items */}
              <div className="flex items-center gap-1">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => handleNavClick(item.href)}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-slate-700/50 rounded-lg"
                          style={{ zIndex: -1 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}




