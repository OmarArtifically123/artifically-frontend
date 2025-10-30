'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import aboutData from '@/lib/about-data.json';

export default function TimelineSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleTimelineView = (milestone: { title: string; date: string; type: string }, index: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timeline_card_view', {
        milestone_title: milestone.title,
        milestone_date: milestone.date,
        milestone_type: milestone.type,
        card_index: index
      });
    }
  };

  return (
    <section 
      ref={ref}
      className="timeline-section" 
      aria-labelledby="timeline-heading"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="timeline-header"
        >
          <h2 id="timeline-heading" className="timeline-heading">
            Impact Timeline
          </h2>
          <p className="timeline-description">
            Key milestones that shaped our platform and validated our approach.
          </p>
        </motion.div>

        <div className="timeline-container">
          <div className="timeline-line" aria-hidden="true"></div>
          
          {aboutData.milestones.map((milestone, index) => (
            <motion.div
              key={`${milestone.date}-${index}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1 * index, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              onViewportEnter={() => handleTimelineView(milestone, index)}
            >
              <div className="timeline-card">
                <div className="timeline-date">
                  <time dateTime={milestone.date}>{milestone.date}</time>
                  <span className={`milestone-type ${milestone.type}`}>
                    {milestone.type}
                  </span>
                </div>
                
                <h3 className="milestone-title">{milestone.title}</h3>
                <p className="milestone-description">{milestone.description}</p>
                
                <div className="milestone-impact">
                  <strong>Impact:</strong> {milestone.impact}
                </div>
              </div>
              
              <div className="timeline-connector" aria-hidden="true">
                <div className="timeline-dot"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .timeline-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .timeline-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .timeline-heading {
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          color: #8b5cf6;
        }

        .timeline-description {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .timeline-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
        }

        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, transparent 0%, #8b5cf6 20%, #8b5cf6 80%, transparent 100%);
          transform: translateX(-50%);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 3rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: center;
        }

        .timeline-item.right {
          grid-template-columns: auto 1fr;
        }

        .timeline-item.right .timeline-card {
          order: 2;
        }

        .timeline-item.right .timeline-connector {
          order: 1;
        }

        .timeline-card {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(107, 114, 128, 0.3);
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.3s ease;
          max-width: 400px;
        }

        .timeline-item.left .timeline-card {
          margin-left: auto;
        }

        .timeline-card:hover {
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
        }

        .timeline-date {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .timeline-date time {
          font-size: 0.875rem;
          font-weight: 600;
          color: #8b5cf6;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .milestone-type {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .milestone-type.foundation {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }

        .milestone-type.milestone {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
        }

        .milestone-type.customer {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
        }

        .milestone-type.funding {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
        }

        .milestone-type.certification {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }

        .milestone-type.recognition {
          background: rgba(168, 85, 247, 0.2);
          color: #c084fc;
        }

        .milestone-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 0.75rem 0;
          color: #f3f4f6;
        }

        .milestone-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #d1d5db;
          margin: 0 0 1rem 0;
        }

        .milestone-impact {
          font-size: 0.875rem;
          line-height: 1.5;
          color: #9ca3af;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          border-left: 3px solid #8b5cf6;
        }

        .milestone-impact strong {
          color: #8b5cf6;
        }

        .timeline-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
        }

        .timeline-dot {
          width: 16px;
          height: 16px;
          background: #8b5cf6;
          border-radius: 50%;
          border: 4px solid #1a1a2e;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .timeline-section {
            padding: 4rem 0;
          }

          .timeline-line {
            left: 30px;
          }

          .timeline-item,
          .timeline-item.right {
            grid-template-columns: auto 1fr;
            gap: 1rem;
          }

          .timeline-item.right .timeline-card {
            order: 1;
          }

          .timeline-item.right .timeline-connector {
            order: 1;
          }

          .timeline-card,
          .timeline-item.left .timeline-card {
            margin-left: 0;
            max-width: none;
          }

          .timeline-connector {
            width: 30px;
          }
        }
      `}</style>
    </section>
  );
}
