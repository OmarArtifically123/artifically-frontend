'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import aboutData from '@/lib/about-data.json';

export default function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const ctaOptions = [
    {
      audience: 'Customers',
      headline: 'Ready to End AI Theater?',
      description: 'Deploy production AI that delivers measurable business outcomes in weeks, not quarters.',
      cta: 'Get a Demo',
      href: '/demo',
      primary: true,
      icon: '🚀'
    },
    {
      audience: 'Partners',
      headline: 'Build With Us',
      description: 'Join our partner ecosystem and help enterprises deploy AI that actually works.',
      cta: 'Become a Partner',
      href: '/partners',
      primary: false,
      icon: '🤝'
    },
    {
      audience: 'Advocates',
      headline: 'Stay Connected',
      description: 'Get insights on enterprise AI deployment, security, and outcome measurement.',
      cta: 'Subscribe',
      href: '/newsletter',
      primary: false,
      icon: '📧'
    }
  ];


  const handleCTAClick = (cta: string, audience: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      const eventName = audience.toLowerCase() === 'customers' ? 'demo_cta_click' : 
                       audience.toLowerCase() === 'partners' ? 'partner_cta_click' :
                       audience.toLowerCase() === 'careers' ? 'careers_cta_click' : 'subscribe_click';
      
      window.gtag('event', eventName, {
        cta_location: 'final_cta',
        audience: audience.toLowerCase(),
        cta_text: cta
      });
    }
  };

  return (
    <section 
      ref={ref}
      className="final-cta-section" 
      aria-labelledby="final-cta-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="cta-header"
        >
          <h2 id="final-cta-heading" className="cta-heading">
            If AI is the new OS, where's the installer?
          </h2>
          <p className="cta-description">
            Choose your path to production AI that delivers measurable outcomes.
          </p>
        </motion.div>

        <div className="cta-grid">
          {ctaOptions.map((option, index) => (
            <motion.div
              key={option.audience}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1 * index, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={`cta-card ${option.primary ? 'primary' : 'secondary'}`}
            >
              <div className="cta-icon" aria-hidden="true">
                {option.icon}
              </div>
              
              <div className="cta-content">
                <div className="cta-audience">{option.audience}</div>
                <h3 className="cta-card-headline">{option.headline}</h3>
                <p className="cta-card-description">{option.description}</p>
              </div>
              
              <Link 
                href={option.href}
                className={`cta-button ${option.primary ? 'btn-primary' : 'btn-secondary'}`}
                style={option.primary ? {
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  fontWeight: '500',
                  letterSpacing: '0.025em',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                } : {
                  padding: '1rem 2rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(71, 85, 105, 0.4)',
                  borderRadius: '8px',
                  fontWeight: '500',
                  letterSpacing: '0.025em',
                  backdropFilter: 'blur(8px)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => handleCTAClick(option.cta, option.audience)}
              >
                {option.cta}
              </Link>
            </motion.div>
          ))}
        </div>


        {/* Trust Center Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="trust-footer"
        >
          <Link 
            href={aboutData.aboutSettings.trustCenterUrl}
            className="trust-link"
            onClick={() => {
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'trust_center_click', {
                  click_location: 'final_cta'
                });
              }
            }}
          >
            View Trust Center & Security Documentation →
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .final-cta-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          color: white;
          position: relative;
        }

        .final-cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .cta-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .cta-heading {
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, #ffffff 0%, #8b5cf6 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cta-description {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .cta-card {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(107, 114, 128, 0.3);
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.3s ease;
          text-align: center;
        }

        .cta-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139, 92, 246, 0.5);
        }

        .cta-card.primary {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
        }

        .cta-card.primary:hover {
          border-color: #a78bfa;
          background: rgba(139, 92, 246, 0.1);
        }

        .cta-icon {
          font-size: 2rem;
          margin: 0 auto;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 50%;
        }

        .cta-audience {
          font-size: 0.875rem;
          font-weight: 600;
          color: #8b5cf6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cta-card-headline {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: #f3f4f6;
        }

        .cta-card-description {
          font-size: 1rem;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
          flex-grow: 1;
        }

        .cta-button {
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.125rem;
          transition: all 0.2s ease;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: auto;
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 8px;
          box-shadow: 
            0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
          font-weight: 500;
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
          background: rgba(15, 23, 42, 0.8);
          color: #e2e8f0;
          border: 1px solid rgba(71, 85, 105, 0.4);
          border-radius: 8px;
          font-weight: 500;
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


        .trust-footer {
          text-align: center;
        }

        .trust-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .trust-link:hover {
          color: #8b5cf6;
        }

        .trust-link:focus {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .final-cta-section {
            padding: 4rem 0;
          }

          .cta-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

        }
      `}</style>
    </section>
  );
}
