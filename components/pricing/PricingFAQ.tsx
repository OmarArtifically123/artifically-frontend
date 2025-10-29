"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "./pricing-data";
import { trackPricingEvent } from "@/lib/pricing-analytics";

export default function PricingFAQ() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleFaq = (faqId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(faqId)) {
        next.delete(faqId);
      } else {
        next.add(faqId);
        trackPricingEvent("faq_expand", { question_id: faqId });
      }
      return next;
    });
  };

  return (
    <section className="pricing-faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Questions we hear most (and our straight answers)</h2>
      
      <div className="faq-list">
        {FAQ_ITEMS.map((faq) => {
          const isExpanded = expandedIds.has(faq.id);
          return (
            <div key={faq.id} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isExpanded}
                aria-controls={`faq-answer-${faq.id}`}
                type="button"
              >
                <span>{faq.question}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="chevron"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <path
                    d="M5 8L10 13L15 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              {isExpanded && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="faq-answer"
                  role="region"
                >
                  {faq.answer.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .pricing-faq {
          padding: 4rem 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        h2 {
          margin: 0 0 2.5rem;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 900;
          text-align: center;
          color: #E5E7EB;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .faq-item:hover {
          border-color: rgba(59, 130, 246, 0.3);
        }

        .faq-question {
          width: 100%;
          padding: 1.5rem;
          background: transparent;
          border: none;
          color: #E5E7EB;
          font-size: 1.1rem;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          transition: background 0.2s ease;
        }

        .faq-question:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .faq-question:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: -3px;
        }

        .chevron {
          flex-shrink: 0;
          color: #3B82F6;
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          color: #9CA3AF;
          font-size: 1rem;
          line-height: 1.7;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-answer p {
          margin: 0 0 1rem;
        }

        .faq-answer p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .pricing-faq {
            padding: 3rem 1.5rem;
          }

          .faq-question {
            padding: 1.25rem;
            font-size: 1rem;
          }

          .faq-answer {
            padding: 0 1.25rem 1.25rem;
            font-size: 0.95rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-answer {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
