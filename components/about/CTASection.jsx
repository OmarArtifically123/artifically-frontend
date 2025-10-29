"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";

export default function CTASection() {
  return (
    <section className="section-shell cta-section" aria-labelledby="cta-title">
      <AnimatedSection>
        <article className="cta-article">
          <div className="cta-background" aria-hidden="true" />

          <div className="cta-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 id="cta-title" className="cta-title">
                Ready to Shape the Future of Enterprise AI?
              </h2>
            </motion.div>

            <motion.p
              className="cta-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Whether you're an enterprise ready to transform operations or a technology partner looking to reach a global
              marketplace, we'd love to connect.
            </motion.p>

            <motion.div
              className="cta-buttons"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/demo" className="cta-button cta-button--primary">
                <span>Get a Demo</span>
              </Link>
              <Link href="/contact" className="cta-button cta-button--secondary">
                <span>Get in Touch</span>
              </Link>
            </motion.div>

            <motion.div
              className="cta-footnote"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p>Have questions? Check our FAQ or reach out to our team directly.</p>
              <p className="cta-footnote-links">
                <Link href="/faq">FAQ</Link>
                <span aria-hidden="true">•</span>
                <Link href="/support">Support</Link>
                <span aria-hidden="true">•</span>
                <Link href="/contact">Contact</Link>
              </p>
            </motion.div>
          </div>
        </article>
      </AnimatedSection>

      <style jsx>{`
        .cta-section {
          padding: 2rem 1.5rem;
        }

        .cta-article {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          display: grid;
          place-items: center;
          min-height: 500px;
          border-radius: 24px;
          overflow: hidden;
        }

        .cta-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%);
          border: 1px solid rgba(139, 92, 246, 0.25);
          z-index: 0;
        }

        .cta-background::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 30% 50%,
            rgba(139, 92, 246, 0.1) 0%,
            transparent 50%
          );
          animation: float 6s ease-in-out infinite;
        }

        .cta-background::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 70% 50%,
            rgba(59, 130, 246, 0.08) 0%,
            transparent 50%
          );
          animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        .cta-content {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 1.5rem;
          padding: 2rem;
          text-align: center;
        }

        .cta-title {
          margin: 0;
          font-size: clamp(1.75rem, 6vw, 2.75rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--text-primary, #ffffff);
        }

        .cta-subtitle {
          margin: 0;
          font-size: clamp(1rem, 2vw, 1.125rem);
          line-height: 1.6;
          color: var(--text-secondary, #d1d5db);
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
          width: 100%;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          cursor: pointer;
        }

        .cta-button--primary {
          background: linear-gradient(135deg, var(--accent-hot, #8b5cf6) 0%, #6d28d9 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
        }

        .cta-button--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
        }

        .cta-button--primary:active {
          transform: translateY(0);
        }

        .cta-button--secondary {
          background: rgba(139, 92, 246, 0.12);
          color: var(--text-primary, #ffffff);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .cta-button--secondary:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-2px);
        }

        .cta-button--secondary:active {
          transform: translateY(0);
        }

        .cta-footnote {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(139, 92, 246, 0.15);
          display: grid;
          gap: 0.75rem;
        }

        .cta-footnote p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary, #d1d5db);
          line-height: 1.5;
        }

        .cta-footnote-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-footnote-links a {
          color: var(--accent-hot, #8b5cf6);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
        }

        .cta-footnote-links a:hover {
          color: #7c3aed;
          border-bottom-color: rgba(139, 92, 246, 0.5);
        }

        .cta-footnote-links span {
          color: var(--text-secondary, #d1d5db);
        }

        @media (min-width: 640px) {
          .cta-content {
            padding: 3rem;
            gap: 2rem;
          }

          .cta-buttons {
            flex-direction: row;
            justify-content: center;
            max-width: none;
          }

          .cta-button {
            min-width: 180px;
          }
        }

        @media (min-width: 768px) {
          .cta-section {
            padding: 4rem 2rem;
          }

          .cta-content {
            padding: 4rem;
            gap: 2rem;
          }

          .cta-article {
            min-height: 550px;
          }
        }

        @media (max-width: 639px) {
          .cta-buttons {
            width: 100%;
          }

          .cta-button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
