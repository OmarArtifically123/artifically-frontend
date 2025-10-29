'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import aboutData from '@/lib/about-data.json';

export default function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const handleCardToggle = (index: number) => {
    const newExpanded = expandedCard === index ? null : index;
    setExpandedCard(newExpanded);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'values_card_view', {
        card_index: index,
        card_name: aboutData.values[index].name,
        expanded: newExpanded !== null
      });
    }
  };

  return (
    <section 
      ref={ref}
      className="values-section" 
      aria-labelledby="values-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="values-header"
        >
          <h2 id="values-heading" className="values-heading">
            Values in Action
          </h2>
          <p className="values-description">
            Our values aren't wall art—they're decision frameworks with proof points.
          </p>
        </motion.div>

        <div className="values-grid">
          {aboutData.values.map((value, index) => (
            <motion.div
              key={value.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1 * index, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={`value-card ${expandedCard === index ? 'expanded' : ''}`}
            >
              <button
                className="value-card-header"
                onClick={() => handleCardToggle(index)}
                aria-expanded={expandedCard === index}
                aria-controls={`value-content-${index}`}
              >
                <h3 className="value-name">{value.name}</h3>
                <p className="value-oneliner">{value.oneLiner}</p>
                <div className="expand-icon" aria-hidden="true">
                  {expandedCard === index ? '−' : '+'}
                </div>
              </button>

              <div
                id={`value-content-${index}`}
                className={`value-content ${expandedCard === index ? 'visible' : ''}`}
                aria-hidden={expandedCard !== index}
              >
                <div className="value-story">
                  <h4>The Story</h4>
                  <p>{value.story}</p>
                </div>

                <div className="value-antivalue">
                  <h4>Anti-Value</h4>
                  <p>{value.antiValue}</p>
                </div>

                <div className="value-decision">
                  <h4>Decision Rule</h4>
                  <p>{value.decisionRule}</p>
                </div>

                <div className="value-artifact">
                  <div className="artifact-placeholder" role="img" aria-label={`Proof artifact for ${value.name}`}>
                    Proof Artifact
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .values-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .values-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .values-heading {
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          color: #8b5cf6;
        }

        .values-description {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(107, 114, 128, 0.3);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
        }

        .value-card.expanded {
          border-color: #8b5cf6;
        }

        .value-card-header {
          width: 100%;
          padding: 2rem;
          background: transparent;
          border: none;
          color: inherit;
          text-align: left;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .value-card-header:focus {
          outline: 2px solid #667eea;
          outline-offset: -2px;
        }

        .value-card-header:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .value-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          color: #667eea;
        }

        .value-oneliner {
          font-size: 1rem;
          line-height: 1.5;
          color: #d1d5db;
          margin: 0;
          padding-right: 3rem;
        }

        .expand-icon {
          position: absolute;
          top: 2rem;
          right: 2rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 50%;
          font-size: 1.25rem;
          font-weight: 600;
          color: #667eea;
          transition: all 0.2s ease;
        }

        .value-card.expanded .expand-icon {
          background: #667eea;
          color: white;
          transform: rotate(180deg);
        }

        .value-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .value-content.visible {
          max-height: 800px;
        }

        .value-content > div {
          padding: 0 2rem 1.5rem;
        }

        .value-content h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .value-content p {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
        }

        .value-story {
          border-bottom: 1px solid rgba(107, 114, 128, 0.2);
        }

        .value-antivalue {
          border-bottom: 1px solid rgba(107, 114, 128, 0.2);
        }

        .value-decision {
          border-bottom: 1px solid rgba(107, 114, 128, 0.2);
        }

        .value-artifact {
          padding-bottom: 2rem !important;
        }

        .artifact-placeholder {
          width: 100%;
          height: 120px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          font-weight: 600;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .values-section {
            padding: 4rem 0;
          }

          .values-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .value-card-header {
            padding: 1.5rem;
          }

          .expand-icon {
            top: 1.5rem;
            right: 1.5rem;
          }

          .value-content > div {
            padding: 0 1.5rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
