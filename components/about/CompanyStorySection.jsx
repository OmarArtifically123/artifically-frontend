"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";

const milestones = [
  {
    year: "2025",
    title: "Foundation & Vision",
    description: "Launched Artifically with a singular vision: democratize access to enterprise-grade AI solutions.",
  },
  {
    year: "Q2 2025",
    title: "Marketplace Launch",
    description: "Released the first AI marketplace connecting enterprises with vetted AI tools and custom solutions.",
  },
  {
    year: "Q3 2025",
    title: "Strategic Partnerships",
    description: "Formed key partnerships with industry leaders to expand AI solution offerings and integration capabilities.",
  },
  {
    year: "Q4 2025",
    title: "Global Expansion",
    description: "Expanded platform presence across EMEA and APAC regions to serve enterprises worldwide.",
  },
  {
    year: "2026",
    title: "AI Innovation Lab",
    description: "Established dedicated research team focused on next-generation enterprise AI capabilities and use cases.",
  },
  {
    year: "Vision",
    title: "Becoming the Operating System for Enterprise AI",
    description:
      "Creating an ecosystem where any organization can discover, deploy, and manage AI at scale—transforming how enterprises compete in an AI-first world.",
  },
];

export default function CompanyStorySection() {
  return (
    <section className="section-shell" aria-labelledby="company-story-title">
      <AnimatedSection>
        <article className="company-story">
          <div className="company-story__header">
            <h2 id="company-story-title" className="company-story__title">
              Our Story & Milestones
            </h2>
            <p className="company-story__intro">
              Artifically was born from a bold observation: the world's best enterprises were struggling to navigate the
              AI explosion. We set out to solve that problem by building a marketplace that makes AI adoption seamless,
              secure, and strategic.
            </p>
          </div>

          <div className="company-story__timeline">
            {milestones.map((milestone, index) => (
              <motion.div
                key={`${milestone.year}-${index}`}
                className="timeline-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="timeline-item__marker" aria-hidden="true">
                  <div className="timeline-item__dot" />
                </div>
                <div className="timeline-item__content">
                  <h3 className="timeline-item__year">{milestone.year}</h3>
                  <h4 className="timeline-item__heading">{milestone.title}</h4>
                  <p className="timeline-item__description">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="company-story__cta-section">
            <h3 className="company-story__cta-title">Why We Exist</h3>
            <div className="company-story__values-grid">
              <div className="value-card">
                <h4>Democratization</h4>
                <p>Enterprise-grade AI shouldn't be exclusive. We make it accessible to organizations of all sizes.</p>
              </div>
              <div className="value-card">
                <h4>Trust & Security</h4>
                <p>Every solution on our platform is vetted. Your data and intellectual property remain protected.</p>
              </div>
              <div className="value-card">
                <h4>Speed to Value</h4>
                <p>Reduce time-to-deployment from months to weeks. Get results faster with our integrated solutions.</p>
              </div>
            </div>
          </div>
        </article>
      </AnimatedSection>

      <style jsx>{`
        .company-story {
          display: grid;
          gap: 3rem;
          padding: 2rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .company-story__header {
          display: grid;
          gap: 1rem;
          text-align: center;
        }

        .company-story__title {
          margin: 0;
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: var(--text-primary, #ffffff);
        }

        .company-story__intro {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary, #d1d5db);
          max-width: 700px;
          margin: 0 auto;
        }

        .company-story__timeline {
          display: grid;
          gap: 2rem;
          position: relative;
          padding: 2rem 0;
        }

        .company-story__timeline::before {
          content: "";
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(
            to bottom,
            rgba(139, 92, 246, 0.5) 0%,
            rgba(139, 92, 246, 0.2) 50%,
            transparent 100%
          );
        }

        .timeline-item {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .timeline-item__marker {
          display: flex;
          justify-content: center;
          padding-top: 0.25rem;
          flex-shrink: 0;
        }

        .timeline-item__dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-hot, #8b5cf6);
          border: 3px solid var(--bg-primary, #0a0a0a);
          box-shadow: 0 0 0 2px var(--accent-hot, #8b5cf6);
          transition: all 0.3s ease;
        }

        .timeline-item:hover .timeline-item__dot {
          transform: scale(1.2);
          box-shadow: 0 0 0 3px var(--accent-hot, #8b5cf6), 0 0 20px rgba(139, 92, 246, 0.5);
        }

        .timeline-item__content {
          display: grid;
          gap: 0.5rem;
          padding-top: 0.25rem;
        }

        .timeline-item__year {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--accent-hot, #8b5cf6);
        }

        .timeline-item__heading {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #ffffff);
        }

        .timeline-item__description {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--text-secondary, #d1d5db);
        }

        .company-story__cta-section {
          display: grid;
          gap: 2rem;
          padding: 2rem;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          margin-top: 2rem;
        }

        .company-story__cta-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #ffffff);
          text-align: center;
        }

        .company-story__values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .value-card {
          padding: 1.5rem;
          border-radius: 12px;
          background: rgba(30, 30, 30, 0.5);
          border: 1px solid rgba(139, 92, 246, 0.2);
          transition: all 0.3s ease;
        }

        .value-card:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.4);
          transform: translateY(-4px);
        }

        .value-card h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary, #ffffff);
        }

        .value-card p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--text-secondary, #d1d5db);
        }

        @media (min-width: 768px) {
          .company-story {
            padding: 4rem 2rem;
            gap: 4rem;
          }

          .company-story__timeline {
            padding: 3rem 0 3rem 2rem;
          }

          .company-story__timeline::before {
            left: 15px;
          }

          .company-story__cta-section {
            padding: 3rem;
          }
        }

        @media (max-width: 767px) {
          .company-story__timeline::before {
            left: 15px;
          }

          .timeline-item {
            gap: 1rem;
          }

          .company-story__values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
