"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="section-shell" aria-labelledby="about-hero-title">
      <article className="about-hero">
        <div className="about-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="about-hero__eyebrow">Our Mission</p>
          </motion.div>

          <motion.h1
            id="about-hero-title"
            className="about-hero__headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Building the World's Leading AI Enterprise Marketplace
          </motion.h1>

          <motion.p
            className="about-hero__subheadline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            We empower enterprises to discover, integrate, and scale AI solutions that transform operations. Artifically connects the world's best AI capabilities with organizations ready to lead their industries through intelligent automation.
          </motion.p>

          <motion.div
            className="about-hero__visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="about-hero__gradient-mesh"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
                width: "100%",
                height: "400px",
                borderRadius: "24px",
                filter: "blur(40px)",
                mixBlendMode: "screen",
              }}
            />
          </motion.div>
        </div>

        <style jsx>{`
          .about-hero {
            display: grid;
            gap: 3rem;
            padding: 2rem 1.5rem;
          }

          .about-hero__content {
            display: grid;
            gap: 1.5rem;
            max-width: 900px;
            margin: 0 auto;
          }

          .about-hero__eyebrow {
            margin: 0;
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--accent-hot, #8b5cf6);
          }

          .about-hero__headline {
            margin: 0;
            font-size: clamp(2rem, 8vw, 3.5rem);
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.02em;
            color: var(--text-primary, #ffffff);
          }

          .about-hero__subheadline {
            margin: 0;
            font-size: clamp(1rem, 2.5vw, 1.25rem);
            line-height: 1.6;
            color: var(--text-secondary, #d1d5db);
            max-width: 700px;
          }

          .about-hero__visual {
            margin-top: 2rem;
            width: 100%;
            height: 100%;
          }

          .about-hero__gradient-mesh {
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
          }

          @keyframes gradientShift {
            0% {
              transform: scale(1) translateX(0);
            }
            50% {
              transform: scale(1.05) translateX(10px);
            }
            100% {
              transform: scale(1) translateX(0);
            }
          }

          @media (min-width: 768px) {
            .about-hero {
              padding: 4rem 2rem;
              gap: 4rem;
            }

            .about-hero__content {
              gap: 2rem;
            }

            .about-hero__headline {
              font-size: clamp(2.5rem, 8vw, 3.5rem);
            }
          }

          @media (min-width: 1024px) {
            .about-hero {
              padding: 5rem 2rem;
            }

            .about-hero__visual {
              display: grid;
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </article>
    </section>
  );
}
