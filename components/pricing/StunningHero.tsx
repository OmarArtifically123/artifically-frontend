"use client";

import { useState } from "react";

type Props = {
  onScrollToPlans: () => void;
};

export default function StunningHero({ onScrollToPlans }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="stunning-hero">
      <div className="stunning-hero__container">
        {/* Badge */}
        <div className="hero-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L10 6L15 7L11 11L12 16L8 13L4 16L5 11L1 7L6 6L8 1Z" fill="currentColor" />
          </svg>
          <span>Simple, transparent pricing</span>
        </div>

        {/* Main heading */}
        <h1 className="hero-title">
          Choose the perfect plan
          <br />
          <span className="hero-title__highlight">for your team</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Start free, scale as you grow. All plans include 14-day trial,
          <br className="hide-mobile" />
          24/7 support, and can be cancelled anytime.
        </p>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <button
            onClick={onScrollToPlans}
            className="hero-btn hero-btn--primary"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            View all plans
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 10H15M15 10L11 6M15 10L11 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <a href="/contact" className="hero-btn hero-btn--secondary">
            Talk to sales
          </a>
        </div>

        {/* Trust badges */}
        <div className="hero-trust">
          <div className="trust-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9 17L4 12L5.4 10.6L9 14.2L18.6 4.6L20 6L9 17Z"
                fill="#10b981"
              />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="trust-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#3b82f6" strokeWidth="2" fill="none" />
              <path d="M10 6V10L13 13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>14-day free trial</span>
          </div>
          <div className="trust-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L12 8L18 9L14 13L15 19L10 16L5 19L6 13L2 9L8 8L10 2Z"
                fill="#f59e0b"
              />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stunning-hero {
          position: relative;
          padding: 6rem 0 4rem;
          text-align: center;
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);
        }

        .stunning-hero__container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 0 2rem;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .hero-badge svg {
          color: #f59e0b;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #111827;
        }

        .hero-title__highlight {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          margin: 0;
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          line-height: 1.7;
          color: #6b7280;
          font-weight: 500;
        }

        .hide-mobile {
          display: inline;
        }

        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .hero-btn--primary {
          background: #6366f1;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .hero-btn--primary:hover {
          background: #5558e3;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .hero-btn--secondary {
          background: white;
          color: #111827;
          border: 1.5px solid #e5e7eb;
        }

        .hero-btn--secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .trust-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .stunning-hero {
            padding: 4rem 0 3rem;
          }

          .hero-actions {
            width: 100%;
          }

          .hero-btn {
            flex: 1;
            min-width: 140px;
          }

          .hero-trust {
            gap: 1rem;
          }

          .trust-item {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}

