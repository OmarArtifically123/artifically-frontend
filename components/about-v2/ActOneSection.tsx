'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function ActOneSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="act-one-section" 
      aria-labelledby="act-one-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="act-content"
        >
          <h2 id="act-one-heading" className="act-heading">
            The World Before
          </h2>
          
          <div className="act-body">
            <p className="act-text">
              Enterprise AI in 2021 was theater. Boardrooms celebrated proof-of-concepts while production systems remained untouched. 
              The "messy middle" between pilot and production swallowed $47 billion in enterprise AI spending with 73% of projects 
              never seeing real users.
            </p>
            
            <p className="act-text">
              IT teams faced an impossible choice: move fast and break compliance, or move safely and never ship. 
              Data scientists built beautiful models that security teams refused to approve. Business leaders demanded 
              AI transformation while legal teams cited 847 different regulatory requirements.
            </p>
            
            <p className="act-text">
              The villain wasn't AI itself—it was AI theater. Companies optimized for demonstrations over deployments, 
              for PowerPoint metrics over production KPIs. Meanwhile, real businesses needed real solutions that worked 
              within real constraints.
            </p>

            {/* Messy Middle Diagram */}
            <div className="messy-middle-diagram" role="img" aria-label="The deployment gap between AI pilots and production">
              <div className="diagram-container">
                <div className="pilot-side">
                  <div className="pilot-box">
                    <h3>AI Pilot</h3>
                    <ul>
                      <li>2-4 weeks</li>
                      <li>Small dataset</li>
                      <li>Demo metrics</li>
                      <li>Research environment</li>
                    </ul>
                  </div>
                </div>
                
                <div className="gap-zone">
                  <div className="gap-arrow">
                    <span className="gap-text">The Deployment Gap</span>
                    <div className="obstacles">
                      <span>Security Review</span>
                      <span>Compliance Check</span>
                      <span>Infrastructure Setup</span>
                      <span>Change Management</span>
                      <span>Risk Assessment</span>
                    </div>
                  </div>
                </div>
                
                <div className="production-side">
                  <div className="production-box">
                    <h3>Production System</h3>
                    <ul>
                      <li>8-16 months</li>
                      <li>Enterprise scale</li>
                      <li>Business KPIs</li>
                      <li>Mission-critical uptime</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="micro-cta">
              <Link 
                href="/solutions/deployment" 
                className="micro-cta-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  fontWeight: '500',
                  minHeight: '48px',
                  fontSize: '0.9rem',
                  letterSpacing: '0.025em',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'micro_cta_click', {
                      cta_location: 'act_one',
                      cta_text: 'See how we ship to prod'
                    });
                  }
                }}
              >
                See how we ship to prod →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .act-one-section {
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
          max-width: 800px;
          margin: 0 auto;
        }

        .act-heading {
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 2rem 0;
          text-align: center;
          color: #667eea;
        }

        .act-text {
          font-size: 1.125rem;
          line-height: 1.7;
          color: #d1d5db;
          margin: 0 0 1.5rem 0;
        }

        .messy-middle-diagram {
          margin: 4rem 0;
          padding: 3rem;
          background: 
            linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.6) 100%);
          border-radius: 16px;
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }

        .diagram-container {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 1rem;
          align-items: center;
        }

        .pilot-box,
        .production-box {
          padding: 1.5rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          text-align: center;
        }

        .pilot-box h3,
        .production-box h3 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #8b5cf6;
        }

        .pilot-box ul,
        .production-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .pilot-box li,
        .production-box li {
          padding: 0.25rem 0;
          color: #d1d5db;
          font-size: 0.875rem;
        }

        .gap-zone {
          text-align: center;
          position: relative;
        }

        .gap-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .gap-text {
          font-weight: 600;
          color: #ef4444;
          font-size: 1.125rem;
        }

        .obstacles {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .obstacles span {
          padding: 0.25rem 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 4px;
          font-size: 0.75rem;
          color: #fca5a5;
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
          .act-one-section {
            padding: 3rem 0;
          }

          .diagram-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .gap-zone {
            order: 2;
          }

          .production-side {
            order: 3;
          }

          .obstacles {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
