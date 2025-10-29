"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Icon, type IconName } from "@/components/icons";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metric?: {
    value: string;
    label: string;
  };
  rating: 5;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Al-Mansouri",
    role: "Operations Director",
    company: "TechCorp MENA",
    avatar: "👩‍💼",
    quote: "Artifically reduced our response time from 4 hours to 2 minutes. The bilingual support is perfect for our Arabic and English customers.",
    metric: {
      value: "97%",
      label: "Customer satisfaction",
    },
    rating: 5,
  },
  {
    id: "2",
    name: "Ahmed Hassan",
    role: "CEO",
    company: "GrowthStart",
    avatar: "👨‍💼",
    quote: "We went from 3 FTE handling calls to fully automated in under a week. The ROI was immediate and the team is incredible.",
    metric: {
      value: "$42K",
      label: "Saved monthly",
    },
    rating: 5,
  },
  {
    id: "3",
    name: "Fatima Noor",
    role: "CTO",
    company: "FinanceFlow",
    avatar: "👩‍💻",
    quote: "Security and compliance were our biggest concerns. The Enterprise plan's VPC deployment and audit trail made our procurement team happy.",
    metric: {
      value: "100%",
      label: "Compliance met",
    },
    rating: 5,
  },
  {
    id: "4",
    name: "Omar Khalid",
    role: "Head of Sales",
    company: "LeadGen Pro",
    avatar: "👨‍💼",
    quote: "Lead capture quality improved 3x. The AI qualification is better than our junior SDRs, and it works 24/7.",
    metric: {
      value: "3x",
      label: "Lead quality increase",
    },
    rating: 5,
  },
];

const STATS: Array<{ value: string; label: string; icon: IconName }> = [
  { value: "99.9%", label: "Uptime SLA", icon: "zap" },
  { value: "< 10min", label: "Average setup", icon: "clock" },
  { value: "24/7", label: "Human support", icon: "headphones" },
  { value: "500+", label: "Active customers", icon: "users" },
];

const LOGOS = [
  "Enterprise Co",
  "StartupXYZ",
  "TechGiant Inc",
  "Innovation Labs",
  "Global Services",
  "Digital Solutions",
];

export default function SocialProofSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleTestimonialChange = (index: number) => {
    setActiveTestimonial(index);
    setIsAutoPlaying(false);
  };

  return (
    <section
      ref={ref}
      className={`social-proof ${inView ? "social-proof--visible" : ""}`}
      aria-labelledby="social-proof-title"
    >
      {/* Header */}
      <header className="social-proof__header">
        <div className="section-badge">
          <Icon name="star" size={16} aria-hidden />
          <span>Trusted by 500+ teams</span>
        </div>
        <h2 id="social-proof-title">
          Loved by operations teams
          <br />
          across the Middle East
        </h2>
        <p className="section-subtitle">
          Real results from real customers. See how teams are transforming their operations
          with Artifically.
        </p>
      </header>

      {/* Stats grid */}
      <div className="stats-grid">
        {STATS.map((stat, idx) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="stat-icon">
              <Icon name={stat.icon} size={24} aria-hidden />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials carousel */}
      <div className="testimonials-section">
        <div className="testimonials-carousel">
          <div
            className="testimonials-track"
            style={{
              transform: `translateX(-${activeTestimonial * 100}%)`,
            }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-author">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon
                        key={i}
                        name="star"
                        size={16}
                        aria-hidden
                        className="rating-star"
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="testimonial-quote">
                  <span className="quote-mark">"</span>
                  {testimonial.quote}
                  <span className="quote-mark">"</span>
                </blockquote>

                {testimonial.metric && (
                  <div className="testimonial-metric">
                    <div className="metric-value">{testimonial.metric.value}</div>
                    <div className="metric-label">{testimonial.metric.label}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Carousel controls */}
        <div className="testimonial-controls">
          <button
            type="button"
            onClick={() => handleTestimonialChange((activeTestimonial - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="control-btn control-btn--prev"
            aria-label="Previous testimonial"
          >
            <Icon name="chevron-left" size={24} aria-hidden />
          </button>

          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTestimonialChange(idx)}
                className={`dot ${idx === activeTestimonial ? "dot--active" : ""}`}
                aria-label={`Go to testimonial ${idx + 1}`}
                aria-current={idx === activeTestimonial ? "true" : "false"}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleTestimonialChange((activeTestimonial + 1) % TESTIMONIALS.length)}
            className="control-btn control-btn--next"
            aria-label="Next testimonial"
          >
            <Icon name="chevron-right" size={24} aria-hidden />
          </button>
        </div>
      </div>

      {/* Client logos */}
      <div className="logos-section">
        <div className="logos-label">Trusted by leading organizations</div>
        <div className="logos-grid">
          {LOGOS.map((logo, idx) => (
            <div
              key={logo}
              className="logo-card"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .social-proof {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          padding: 4rem 0;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .social-proof--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .social-proof__header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }

        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-primary) 30%, transparent);
          border-radius: 999px;
          color: var(--accent-primary);
          font-weight: 700;
          font-size: 0.9rem;
        }

        .social-proof__header h2 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .section-subtitle {
          margin: 0;
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-card);
          border: 2px solid var(--border-default);
          border-radius: 18px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          animation: stat-entrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes stat-entrance {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
          box-shadow: 0 12px 30px color-mix(in srgb, var(--accent-primary) 15%, transparent);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border-radius: 12px;
          color: var(--accent-primary);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .testimonials-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .testimonials-carousel {
          overflow: hidden;
          border-radius: 24px;
        }

        .testimonials-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .testimonial-card {
          flex: 0 0 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 3rem;
          background: linear-gradient(
            135deg,
            var(--bg-card) 0%,
            color-mix(in srgb, var(--accent-primary) 5%, var(--bg-card)) 100%
          );
          border: 2px solid var(--border-default);
          border-radius: 24px;
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .testimonial-avatar {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          background: var(--bg-secondary);
          border: 2px solid var(--border-default);
          border-radius: 16px;
        }

        .testimonial-author {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .author-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .author-role {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .testimonial-rating {
          display: flex;
          gap: 0.25rem;
        }

        .rating-star {
          color: #FFB800;
        }

        .testimonial-quote {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.7;
          color: var(--text-primary);
          position: relative;
        }

        .quote-mark {
          font-size: 3rem;
          font-weight: 900;
          color: var(--accent-primary);
          opacity: 0.3;
          line-height: 1;
        }

        .testimonial-quote .quote-mark:first-child {
          margin-right: 0.5rem;
        }

        .testimonial-quote .quote-mark:last-child {
          margin-left: 0.5rem;
        }

        .testimonial-metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1.25rem;
          background: var(--bg-secondary);
          border-radius: 16px;
          border: 1px solid var(--border-default);
          align-self: flex-start;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 900;
          color: var(--accent-primary);
        }

        .metric-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 700;
        }

        .testimonial-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 2px solid var(--border-default);
          border-radius: 12px;
          background: var(--bg-card);
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          border-color: var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
          transform: scale(1.05);
        }

        .control-btn:active {
          transform: scale(0.95);
        }

        .control-btn:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        .testimonial-dots {
          display: flex;
          gap: 0.75rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--border-default);
          background: transparent;
          transition: all 0.3s ease;
        }

        .dot:hover {
          border-color: var(--accent-primary);
        }

        .dot--active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          width: 32px;
          border-radius: 999px;
        }

        .logos-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
          padding: 2rem 0;
        }

        .logos-label {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
        }

        .logos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          width: 100%;
          max-width: 900px;
        }

        .logo-card {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          font-weight: 700;
          color: var(--text-secondary);
          font-size: 0.85rem;
          opacity: 0;
          animation: logo-entrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.2s ease;
        }

        @keyframes logo-entrance {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-card:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .social-proof {
            gap: 2rem;
            padding: 2rem 0;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
          }

          .stat-card {
            padding: 1rem;
          }

          .testimonial-card {
            padding: 2rem 1.5rem;
          }

          .testimonial-quote {
            font-size: 1.1rem;
          }

          .testimonial-controls {
            gap: 1rem;
          }

          .logos-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .social-proof,
          .stat-card,
          .testimonials-track,
          .control-btn,
          .dot,
          .logo-card {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

