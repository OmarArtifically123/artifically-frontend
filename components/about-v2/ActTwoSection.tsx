'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import aboutData from '@/lib/about-data.json';

export default function ActTwoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { catalyst } = aboutData.founderStory;

  return (
    <section 
      ref={ref}
      className="act-two-section" 
      aria-labelledby="act-two-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="act-content"
        >
          <h2 id="act-two-heading" className="act-heading">
            The Catalyst
          </h2>
          
          <div className="act-body">
            <div className="catalyst-story">
              <div className="story-content">
                <div className="date-location">
                  <time dateTime="2021-03">{catalyst.date}</time>
                  <span className="separator">•</span>
                  <span className="location">{catalyst.place}</span>
                </div>
                
                <p className="catalyst-text">
                  {catalyst.decision}. The board wasn't happy—we were turning down guaranteed revenue in a pandemic. 
                  But we knew the enterprise AI market needed infrastructure, not more consultants. 
                  {catalyst.consequence}.
                </p>

                <blockquote className="founder-quote">
                  <p>"{catalyst.quote}"</p>
                  <cite>— {catalyst.speaker}</cite>
                </blockquote>

                <p className="catalyst-text">
                  That single decision changed everything. Instead of building one-off solutions for individual clients, 
                  we focused on the platform that could solve the deployment problem for every enterprise. The market 
                  validated our bet when our first customer chose us specifically for what consulting firms couldn't offer: 
                  repeatable, secure, compliant AI infrastructure.
                </p>
              </div>

              <div className="catalyst-visual">
                <div className="founder-photo-placeholder" role="img" aria-label="Sarah Chen, Co-founder & CEO in boardroom">
                  <div className="photo-frame">
                    <span>Founder Photo</span>
                    <small>Boardroom Decision</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="micro-cta">
              <Link 
                href="/about/operating-model" 
                className="micro-cta-link"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'micro_cta_click', {
                      cta_location: 'act_two',
                      cta_text: 'Our operating model'
                    });
                  }
                }}
              >
                Our operating model →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .act-two-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #16213e 0%, #0f0f0f 100%);
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
          margin: 0 0 3rem 0;
          text-align: center;
          color: #667eea;
        }

        .catalyst-story {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          align-items: start;
          margin-bottom: 3rem;
        }

        .date-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #8b5cf6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }

        .separator {
          color: #6b7280;
        }

        .catalyst-text {
          font-size: 1.125rem;
          line-height: 1.7;
          color: #d1d5db;
          margin: 0 0 2rem 0;
        }

        .founder-quote {
          margin: 2rem 0;
          padding: 2rem;
          background: rgba(139, 92, 246, 0.05);
          border-left: 4px solid #8b5cf6;
          border-radius: 0 8px 8px 0;
        }

        .founder-quote p {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #f3f4f6;
          margin: 0 0 1rem 0;
          font-style: italic;
        }

        .founder-quote cite {
          color: #8b5cf6;
          font-weight: 600;
          font-style: normal;
          font-size: 1rem;
        }

        .catalyst-visual {
          display: flex;
          justify-content: center;
          align-items: start;
          padding-top: 2rem;
        }

        .founder-photo-placeholder {
          width: 250px;
          height: 300px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .photo-frame {
          text-align: center;
          color: #8b5cf6;
        }

        .photo-frame span {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .photo-frame small {
          font-size: 0.75rem;
          color: #9ca3af;
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
          background: transparent;
          border: 2px solid #667eea;
          border-radius: 50px;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          min-height: 48px;
          font-size: 0.9rem;
        }

        .micro-cta-link:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .micro-cta-link:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .act-two-section {
            padding: 3rem 0;
          }

          .catalyst-story {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .catalyst-visual {
            order: -1;
            padding-top: 0;
          }

          .founder-photo-placeholder {
            width: 200px;
            height: 240px;
          }
        }
      `}</style>
    </section>
  );
}
