import { TESTIMONIALS } from "./pricing-data";

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section" aria-labelledby="testimonials-title">
      <h2 id="testimonials-title">Real outcomes from real operations</h2>
      
      <div className="testimonials-grid">
        {TESTIMONIALS.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-metric">{testimonial.metricBadge}</div>
            <blockquote className="testimonial-quote">
              "{testimonial.quote}"
            </blockquote>
            <div className="testimonial-author">
              — {testimonial.author}, {testimonial.title}, {testimonial.location}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .testimonials-section {
          padding: 4rem 2rem;
        }

        h2 {
          margin: 0 0 3rem;
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 900;
          text-align: center;
          color: #E5E7EB;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .testimonial-card {
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }

        .testimonial-metric {
          padding: 0.65rem 1.25rem;
          background: rgba(20, 184, 166, 0.2);
          border: 1px solid rgba(20, 184, 166, 0.4);
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 800;
          color: #14B8A6;
          display: inline-block;
          width: fit-content;
        }

        .testimonial-quote {
          margin: 0;
          font-size: 1.1rem;
          font-style: italic;
          line-height: 1.7;
          color: #E5E7EB;
        }

        .testimonial-author {
          font-size: 0.95rem;
          color: #9CA3AF;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .testimonials-section {
            padding: 3rem 1.5rem;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .testimonial-card {
            padding: 1.5rem;
          }

          .testimonial-quote {
            font-size: 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-card:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
