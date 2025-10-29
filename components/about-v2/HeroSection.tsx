'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import aboutData from '@/lib/about-data.json';

export default function HeroSection() {
  const [hookVariant] = useState(aboutData.hookVariants[0]); // Origin hook
  const { trustStrip, primaryCTA, secondaryCTA } = aboutData.aboutSettings;

  // Track analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'about_view', {
        hook_variant: hookVariant.id,
        page_location: 'hero'
      });
    }
  }, [hookVariant.id]);

  return (
    <section 
      className="hero-section" 
      aria-labelledby="hero-headline"
      role="banner"
    >
      <div className="container">
        <div className="hero-content">
          {/* Hook Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hook-content"
          >
            <h1 id="hero-headline" className="hero-headline">
              {hookVariant.headline}
            </h1>
            <p className="hero-text">
              {hookVariant.text}
            </p>
          </motion.div>

          {/* Trust Micro-Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="trust-strip"
            aria-label="Trust indicators"
          >
            {trustStrip.map((item, index) => (
              <div key={index} className="trust-item">
                {item.type === 'stat' ? (
                  <>
                    <span className="trust-value" aria-label={`${item.value} ${item.label}`}>
                      {item.value}
                    </span>
                    <span className="trust-label">{item.label}</span>
                  </>
                ) : (
                  <Link 
                    href={item.url || '#'} 
                    className="trust-badge"
                    aria-label={`View ${item.name} certification`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hero-ctas"
          >
            <Link 
              href="/demo" 
              className="btn-primary"
              style={{
                padding: '0.875rem 2rem',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.95rem',
                minWidth: '48px',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                letterSpacing: '0.025em',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'demo_cta_click', {
                    cta_location: 'hero',
                    hook_variant: hookVariant.id
                  });
                }
              }}
            >
              {primaryCTA}
            </Link>
            <Link 
              href="/deployment" 
              className="btn-secondary"
              style={{
                padding: '0.875rem 2rem',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#e2e8f0',
                textDecoration: 'none',
                border: '1px solid rgba(71, 85, 105, 0.4)',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.95rem',
                minWidth: '48px',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.025em',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'secondary_cta_click', {
                    cta_location: 'hero', 
                    cta_text: secondaryCTA
                  });
                }
              }}
            >
              {secondaryCTA}
            </Link>
          </motion.div>

        </div>
      </div>

      <style jsx>{`
        .hero-section {
          padding: 6rem 0 4rem;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          color: white;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          display: grid;
          gap: 3rem;
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .hero-headline {
          font-size: clamp(2.5rem, 8vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
          background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-text {
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          line-height: 1.7;
          color: #d1d5db;
          margin: 0;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
        }

        .trust-strip {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          padding: 2rem 0;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .trust-value {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .trust-label {
          font-size: 0.875rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .trust-badge {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.3);
          border-radius: 8px;
          color: #e2e8f0;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.025em;
          backdrop-filter: blur(8px);
        }

        .trust-badge:hover {
          background: rgba(30, 41, 59, 0.8);
          color: white;
          border-color: rgba(100, 116, 139, 0.5);
          transform: translateY(-1px);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .trust-badge:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 48px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          box-shadow: 
            0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
          letter-spacing: 0.025em;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        .btn-primary:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .btn-secondary {
          padding: 0.875rem 2rem;
          background: rgba(15, 23, 42, 0.8);
          color: #e2e8f0;
          text-decoration: none;
          border: 1px solid rgba(71, 85, 105, 0.4);
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 48px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.025em;
          backdrop-filter: blur(8px);
        }

        .btn-secondary:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(100, 116, 139, 0.6);
          color: white;
          transform: translateY(-1px);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .btn-secondary:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }


        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 0 1.5rem;
          }

          .trust-strip {
            gap: 1rem;
            flex-direction: column;
            align-items: center;
          }

          .hero-ctas {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>
    </section>
  );
}
