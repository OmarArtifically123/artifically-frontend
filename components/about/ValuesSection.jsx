"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";

const values = [
  {
    icon: "🎯",
    title: "Relentless Focus",
    description:
      "We obsess over enterprise outcomes. Every feature, every decision is guided by the question: Does this help our customers win with AI? We stay laser-focused on delivering measurable impact, not complexity.",
  },
  {
    icon: "🛡️",
    title: "Trust by Default",
    description:
      "Security and compliance aren't afterthoughts—they're foundational. We operate with radical transparency about how data flows, who can access solutions, and how we protect your intellectual property. Trust is earned, never assumed.",
  },
  {
    icon: "🚀",
    title: "Velocity Mindset",
    description:
      "The AI landscape moves at lightning speed. We embrace rapid iteration, continuous learning, and bold experimentation. We move fast while maintaining the stability enterprises demand, because waiting is not an option.",
  },
  {
    icon: "🤝",
    title: "Ecosystem First",
    description:
      "We believe in the power of collaborative networks. Our platform is designed to strengthen the entire AI community—partners, developers, customers, and competitors alike. A rising tide lifts all boats.",
  },
  {
    icon: "✨",
    title: "Excellence Without Ego",
    description:
      "We celebrate great work from anywhere and anyone. We challenge each other's ideas while respecting each other's expertise. Ego has no place in the pursuit of solutions that change industries.",
  },
];

export default function ValuesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="section-shell values-section" aria-labelledby="values-title">
      <AnimatedSection>
        <article className="values-article">
          <div className="values-header">
            <h2 id="values-title" className="values-title">
              Our Values
            </h2>
            <p className="values-subtitle">
              These principles guide everything we do—from product decisions to how we treat each other and our community.
            </p>
          </div>

          <motion.div
            className="values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {values.map((value, index) => (
              <motion.div key={value.title} className="value-item" variants={itemVariants}>
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="values-cta">
            <h3 className="values-cta-title">Living Our Values</h3>
            <div className="values-cta-grid">
              <div className="cta-item">
                <h4>In Product</h4>
                <p>We build for outcomes, not features. Everything is designed with the end user's success in mind.</p>
              </div>
              <div className="cta-item">
                <h4>In Community</h4>
                <p>We contribute back through open conversations, knowledge sharing, and support for AI education.</p>
              </div>
              <div className="cta-item">
                <h4>In Culture</h4>
                <p>
                  We hire people who embody these values, invest in their growth, and create space for different perspectives.
                </p>
              </div>
            </div>
          </div>
        </article>
      </AnimatedSection>

      <style jsx>{`
        .values-section {
          padding: 2rem 1.5rem;
        }

        .values-article {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 3rem;
        }

        .values-header {
          display: grid;
          gap: 1rem;
          text-align: center;
        }

        .values-title {
          margin: 0;
          font-size: clamp(1.75rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.2;
          color: var(--text-primary, #ffffff);
        }

        .values-subtitle {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary, #d1d5db);
          max-width: 700px;
          margin: 0 auto;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .value-item {
          display: grid;
          gap: 1rem;
          padding: 2rem;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%);
          border: 1px solid rgba(139, 92, 246, 0.15);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .value-item::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .value-item:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
        }

        .value-item:hover::before {
          opacity: 1;
        }

        .value-icon {
          font-size: 2.5rem;
          line-height: 1;
        }

        .value-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary, #ffffff);
          position: relative;
          z-index: 1;
        }

        .value-description {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary, #d1d5db);
          position: relative;
          z-index: 1;
        }

        .values-cta {
          display: grid;
          gap: 2rem;
          padding: 2.5rem;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          margin-top: 2rem;
        }

        .values-cta-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #ffffff);
          text-align: center;
        }

        .values-cta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .cta-item {
          padding: 1.5rem;
          border-radius: 12px;
          background: rgba(30, 30, 30, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.15);
          transition: all 0.3s ease;
        }

        .cta-item:hover {
          background: rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
        }

        .cta-item h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary, #ffffff);
        }

        .cta-item p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-secondary, #d1d5db);
        }

        @media (min-width: 768px) {
          .values-section {
            padding: 4rem 2rem;
          }

          .values-article {
            gap: 4rem;
          }

          .values-grid {
            gap: 2.5rem;
          }

          .value-item {
            padding: 2.5rem;
          }

          .values-cta {
            padding: 3rem;
          }
        }

        @media (max-width: 767px) {
          .values-grid {
            grid-template-columns: 1fr;
          }

          .values-cta-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
