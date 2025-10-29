"use client";

import { useInView } from "@/hooks/useInView";
import { Icon, type IconName } from "@/components/icons";

const STATS: Array<{ value: string; label: string; sublabel: string; icon: IconName }> = [
  { 
    value: "99.9%", 
    label: "Uptime", 
    sublabel: "Guaranteed SLA",
    icon: "zap" 
  },
  { 
    value: "< 2min", 
    label: "Response", 
    sublabel: "Average support time",
    icon: "headphones" 
  },
  { 
    value: "24/7", 
    label: "Available", 
    sublabel: "Global coverage",
    icon: "globe" 
  },
  { 
    value: "500+", 
    label: "Teams", 
    sublabel: "Across 20+ countries",
    icon: "users" 
  },
];

export default function PremiumStats() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section
      ref={ref}
      className={`premium-stats ${inView ? "premium-stats--visible" : ""}`}
      aria-label="Platform statistics"
    >
      <div className="stats-grid">
        {STATS.map((stat, idx) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ 
              animationDelay: `${idx * 0.1}s`,
              '--card-index': idx 
            } as React.CSSProperties}
          >
            <div className="stat-glow" />
            <div className="stat-icon-wrapper">
              <div className="stat-icon">
                <Icon name={stat.icon} size={32} aria-hidden />
              </div>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sublabel">{stat.sublabel}</div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .premium-stats {
          padding: 4rem 0;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-stats--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          padding: 3rem 2rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-card) 95%, var(--accent-primary) 5%),
            var(--bg-card)
          );
          backdrop-filter: blur(20px);
          border: 1px solid color-mix(in srgb, var(--border-default) 50%, transparent);
          border-radius: 28px;
          overflow: hidden;
          opacity: 0;
          animation: stat-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes stat-entrance {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .stat-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-primary);
          box-shadow: 
            0 20px 60px color-mix(in srgb, var(--accent-primary) 20%, transparent),
            0 0 0 1px color-mix(in srgb, var(--accent-primary) 30%, transparent);
        }

        .stat-card:hover .stat-glow {
          opacity: 1;
          transform: scale(1.5);
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .stat-glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(
            circle at center,
            color-mix(in srgb, var(--accent-primary) 30%, transparent) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .stat-icon-wrapper {
          position: relative;
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
          );
          border-radius: 24px;
          color: white;
          box-shadow: 
            0 8px 32px color-mix(in srgb, var(--accent-primary) 40%, transparent),
            inset 0 0 0 1px color-mix(in srgb, white 20%, transparent);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-value {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stat-sublabel {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .premium-stats {
            padding: 3rem 0;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }

          .stat-card {
            padding: 2rem 1.5rem;
          }

          .stat-icon {
            width: 64px;
            height: 64px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .premium-stats,
          .stat-card,
          .stat-glow,
          .stat-icon {
            animation: none !important;
            transition: none !important;
          }

          .stat-card:hover,
          .stat-card:hover .stat-icon {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}

