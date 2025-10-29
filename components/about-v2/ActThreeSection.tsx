'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import aboutData from '@/lib/about-data.json';

export default function ActThreeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { certifications, sla } = aboutData.trustInventory;

  return (
    <section 
      ref={ref}
      className="act-three-section" 
      aria-labelledby="act-three-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="act-content"
        >
          <h2 id="act-three-heading" className="act-heading">
            The Transformation
          </h2>
          
          <div className="act-body">
            <p className="act-text">
              We built the system enterprises actually needed: security-first architecture, outcome-focused deployment, 
              and evidence-driven development. Every feature ships with audit trails. Every model includes explainability. 
              Every deployment tracks business KPIs from day one.
            </p>
            
            <p className="act-text">
              Our "evidence sprint" methodology turns the traditional AI development cycle inside out. Instead of 
              building for months then hoping for adoption, we prove business value in one week or kill the project. 
              This approach has prevented 12 failed initiatives and accelerated 31 successful deployments.
            </p>
            
            <p className="act-text">
              Governed rollouts mean no surprises in production. Staged deployments, automated rollbacks, and 
              real-time monitoring ensure enterprise AI behaves predictably at scale. Our customers deploy with 
              confidence because the platform eliminates the deployment gap.
            </p>

            {/* Trust Tiles */}
            <div className="trust-tiles" aria-label="Security certifications and SLA metrics">
              {certifications.map((cert, index) => (
                <div key={cert.name} className="trust-tile">
                  <div className="cert-status">
                    <span className={`status-indicator ${cert.status.toLowerCase().replace(' ', '-')}`}>
                      {cert.status === 'Certified' ? '✓' : '⏳'}
                    </span>
                    <h3>{cert.name}</h3>
                  </div>
                  {cert.url && (
                    <Link href={cert.url} className="cert-link">View Details</Link>
                  )}
                </div>
              ))}
              
              <div className="trust-tile sla-tile">
                <div className="cert-status">
                  <span className="status-indicator certified">✓</span>
                  <h3>SLA Metrics</h3>
                </div>
                <div className="sla-details">
                  <div>{sla.uptime} uptime</div>
                  <div>{sla.support} support</div>
                  <div>{sla.responseTime} response</div>
                </div>
              </div>
            </div>

            <div className="micro-cta">
              <Link 
                href="/solutions/deployment" 
                className="micro-cta-link"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'micro_cta_click', {
                      cta_location: 'act_three',
                      cta_text: 'See Deployment'
                    });
                  }
                }}
              >
                See Deployment →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .act-three-section {
          padding: 4rem 0;
          background: #0f0f0f;
          color: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .act-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .act-heading {
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 2rem 0;
          text-align: center;
          color: #8b5cf6;
        }

        .act-text {
          font-size: 1.125rem;
          line-height: 1.7;
          color: #d1d5db;
          margin: 0 0 1.5rem 0;
        }

        .trust-tiles {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 3rem 0;
        }

        .trust-tile {
          padding: 1.5rem;
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(107, 114, 128, 0.3);
          border-radius: 8px;
          text-align: center;
          transition: border-color 0.2s ease;
        }

        .trust-tile:hover {
          border-color: rgba(139, 92, 246, 0.5);
        }

        .cert-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .status-indicator {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .status-indicator.certified {
          background: #10b981;
          color: white;
        }

        .status-indicator.in-progress {
          background: #f59e0b;
          color: white;
        }

        .cert-status h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #f3f4f6;
        }

        .cert-link {
          color: #8b5cf6;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .cert-link:hover {
          color: #a78bfa;
        }

        .cert-link:focus {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        .sla-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #d1d5db;
        }

        .micro-cta {
          text-align: center;
          margin-top: 2rem;
        }

        .micro-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.3);
          border-radius: 8px;
          color: #e2e8f0;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 48px;
          font-size: 0.9rem;
          letter-spacing: 0.025em;
          backdrop-filter: blur(8px);
        }

        .micro-cta-link:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(100, 116, 139, 0.5);
          color: white;
          transform: translateY(-1px);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .micro-cta-link:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .act-three-section {
            padding: 3rem 0;
          }

          .trust-tiles {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
