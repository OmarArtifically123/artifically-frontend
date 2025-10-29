'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ActFourSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="act-four-section" 
      aria-labelledby="act-four-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="act-content"
        >
          <h2 id="act-four-heading" className="act-heading">
            The Movement
          </h2>
          
          <div className="act-body">
            <p className="act-text">
              Today, Fortune 500 manufacturers deploy AI across 47 production sites in 12 days. Healthcare providers 
              run HIPAA-compliant AI on patient data with zero security incidents. Retailers predict and prevent 
              operational issues before they impact customers.
            </p>
            
            <p className="act-text">
              The movement from AI theater to AI outcomes is accelerating. Gartner named us a Visionary. Forbes 
              featured us as an AI Infrastructure company to watch. But the real validation comes from customers 
              who measure success in business KPIs, not demo metrics.
            </p>

            {/* Placeholder for logos, map, analyst badges */}
            <div className="movement-proof">
              <div className="proof-section">
                <h3>Trusted By</h3>
                <div className="logo-belt">
                  <div className="logo-placeholder">Fortune 500 Mfg</div>
                  <div className="logo-placeholder">Healthcare Tech</div>
                  <div className="logo-placeholder">Global Retailer</div>
                </div>
              </div>
              
              <div className="proof-section">
                <h3>Global Reach</h3>
                <div className="map-placeholder">
                  <span>Global deployment map</span>
                </div>
              </div>
              
              <div className="proof-section">
                <h3>Industry Recognition</h3>
                <div className="badge-row">
                  <div className="analyst-badge">Gartner Visionary</div>
                  <div className="analyst-badge">Forbes Featured</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .act-four-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
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

        .movement-proof {
          display: grid;
          gap: 3rem;
          margin-top: 3rem;
        }

        .proof-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #8b5cf6;
          margin-bottom: 1rem;
          text-align: center;
        }

        .logo-belt {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .logo-placeholder {
          padding: 1rem 1.5rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 6px;
          color: #8b5cf6;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .map-placeholder {
          height: 200px;
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(107, 114, 128, 0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .badge-row {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .analyst-badge {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .act-four-section {
            padding: 3rem 0;
          }

          .logo-belt {
            flex-direction: column;
            align-items: center;
          }

          .badge-row {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}
