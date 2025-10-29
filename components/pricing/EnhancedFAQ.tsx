"use client";

import { useId, useMemo, useState } from "react";
import { Icon } from "@/components/icons";

type FAQItem = {
  question: string;
  answer: string;
  category: string;
  helpful?: boolean;
};

const FAQ_ITEMS: FAQItem[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "Do you run structured pilots?",
    answer: "Yes. Pilots mirror production, include success criteria, and the fee credits to rollout if you continue. We'll work with you to define clear success metrics and timeline.",
  },
  {
    category: "Getting Started",
    question: "How fast can we go live?",
    answer: "Starter launches in minutes with self-serve onboarding. Professional is live this week with a success architect guiding you. Enterprise includes white-glove rollout with security alignment, typically 2-4 weeks.",
  },
  {
    category: "Getting Started",
    question: "What happens after the free trial?",
    answer: "We do not lock you out. Workflows stay available, and you can upgrade when you are ready with zero hidden fees. Your data remains accessible and you can export it anytime.",
  },
  {
    category: "Getting Started",
    question: "Can I switch plans later?",
    answer: "Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately, and downgrades will apply at your next billing cycle. No penalties for changing plans.",
  },

  // Security & Compliance
  {
    category: "Security & Compliance",
    question: "How secure is Artifically?",
    answer: "We support isolation options, security reviews, and custom SLAs for enterprise. Our team helps you clear procurement and audit questions. We're SOC 2 Type II certified, GDPR compliant, and support regional data residency.",
  },
  {
    category: "Security & Compliance",
    question: "Where is my data stored?",
    answer: "Data is stored in your region of choice. We support Middle East, Europe, and US data centers. Enterprise customers can choose private VPC deployment for complete data isolation.",
  },
  {
    category: "Security & Compliance",
    question: "Do you support single sign-on (SSO)?",
    answer: "Yes, SSO is available on Professional and Enterprise plans. We support SAML 2.0, OAuth, and major identity providers including Okta, Azure AD, and Google Workspace.",
  },
  {
    category: "Security & Compliance",
    question: "Can I get a BAA for HIPAA compliance?",
    answer: "Yes, we provide Business Associate Agreements (BAA) for Enterprise customers who need HIPAA compliance. Contact our compliance team to discuss your specific requirements.",
  },

  // Pricing & Billing
  {
    category: "Pricing & Billing",
    question: "What counts as an 'event' in my plan?",
    answer: "An event is any inbound interaction - a phone call, WhatsApp message, web form submission, or email. Outbound automated messages don't count. We provide real-time usage tracking in your dashboard.",
  },
  {
    category: "Pricing & Billing",
    question: "What happens if I exceed my event limit?",
    answer: "You'll get notifications at 80% and 90% usage. Overages are billed at transparent rates: $0.15 per event for Starter, $0.10 for Professional. Or upgrade anytime for better rates and burst credits.",
  },
  {
    category: "Pricing & Billing",
    question: "Can I pay annually for a discount?",
    answer: "Yes! Annual billing saves you 20% compared to monthly. You can switch to annual billing anytime from your account settings, and we'll prorate your current month.",
  },
  {
    category: "Pricing & Billing",
    question: "Do you offer discounts for startups or nonprofits?",
    answer: "Yes! We offer 50% off for qualifying startups (< 2 years old, <$1M funding) and nonprofits. Apply through our startup/nonprofit program page with relevant documentation.",
  },

  // Features & Capabilities
  {
    category: "Features & Capabilities",
    question: "Does the AI support languages other than Arabic and English?",
    answer: "Currently we specialize in Arabic and English for the Middle East market. Additional languages can be added on Enterprise plans. We're actively developing support for French, Urdu, and Hindi.",
  },
  {
    category: "Features & Capabilities",
    question: "Can I customize the AI's responses and personality?",
    answer: "Yes! You can customize tone, personality, knowledge base, and response templates. Professional and Enterprise plans include advanced customization with our prompt engineering team's support.",
  },
  {
    category: "Features & Capabilities",
    question: "What integrations do you support?",
    answer: "We integrate with 50+ platforms including Salesforce, HubSpot, Slack, Microsoft Teams, WhatsApp Business API, Zapier, and Make. Enterprise customers can request custom integrations.",
  },
  {
    category: "Features & Capabilities",
    question: "Can I use my own phone numbers?",
    answer: "Yes, you can port existing numbers or we can provision new ones. We support local numbers across 40+ countries and toll-free numbers for major markets.",
  },

  // Support & Training
  {
    category: "Support & Training",
    question: "What kind of support do you offer?",
    answer: "Starter: Email support with same-day response. Professional: Priority engineer plus success architect. Enterprise: 24/7 hotline plus dedicated regional squad. All plans include comprehensive documentation and video tutorials.",
  },
  {
    category: "Support & Training",
    question: "Do you provide training for my team?",
    answer: "Yes! Professional plans include guided onboarding. Enterprise plans include white-glove training, customized workshops, and ongoing success architect support. We'll train your team to be power users.",
  },
  {
    category: "Support & Training",
    question: "Is there a community or user forum?",
    answer: "Yes! Join our customer Slack community with 500+ active members. Share best practices, get peer support, and connect directly with our product team. We also host monthly webinars and office hours.",
  },
];

export default function EnhancedFAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const baseId = useId();

  const categories = useMemo(() => {
    const cats = new Set(FAQ_ITEMS.map((item) => item.category));
    return ["all", ...Array.from(cats)];
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = FAQ_ITEMS;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const expandAll = () => {
    setOpenItems(new Set(filteredItems.map((_, idx) => idx)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <section className="enhanced-faq" aria-labelledby={`${baseId}-title`}>
      <header className="faq-header">
        <div className="faq-header__content">
          <div className="faq-badge">
            <Icon name="help-circle" size={16} aria-hidden />
            <span>FAQ</span>
          </div>
          <h2 id={`${baseId}-title`}>Answers to common questions</h2>
          <p className="faq-subtitle">
            Can't find what you're looking for? Our support team is here 24/7 to help.
          </p>
        </div>

        {/* Search and filters */}
        <div className="faq-controls">
          <div className="search-wrapper">
            <Icon name="search" size={20} aria-hidden className="search-icon" />
            <input
              type="search"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search frequently asked questions"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="search-clear"
                aria-label="Clear search"
              >
                <Icon name="x" size={16} aria-hidden />
              </button>
            )}
          </div>

          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill ${selectedCategory === category ? "category-pill--active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Questions" : category}
              </button>
            ))}
          </div>

          <div className="expand-controls">
            <button type="button" onClick={expandAll} className="expand-control-btn">
              <Icon name="chevrons-down" size={16} aria-hidden />
              Expand all
            </button>
            <button type="button" onClick={collapseAll} className="expand-control-btn">
              <Icon name="chevrons-up" size={16} aria-hidden />
              Collapse all
            </button>
          </div>
        </div>
      </header>

      {/* FAQ List */}
      {filteredItems.length > 0 ? (
        <ul className="faq-list">
          {filteredItems.map((item, index) => {
            const buttonId = `${baseId}-button-${index}`;
            const panelId = `${baseId}-panel-${index}`;
            const isOpen = openItems.has(index);

            return (
              <li key={`${item.category}-${index}`} className="faq-item">
                <button
                  type="button"
                  id={buttonId}
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(index)}
                >
                  <div className="question-content">
                    <Icon
                      name="message-circle"
                      size={20}
                      aria-hidden
                      className="question-icon"
                    />
                    <span className="question-text">{item.question}</span>
                  </div>
                  <div className={`question-toggle ${isOpen ? "question-toggle--open" : ""}`}>
                    <Icon name={isOpen ? "minus" : "plus"} size={20} aria-hidden />
                  </div>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={`faq-answer ${isOpen ? "faq-answer--open" : ""}`}
                >
                  <div className="answer-content">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="faq-empty">
          <Icon name="inbox" size={48} aria-hidden className="empty-icon" />
          <div className="empty-title">No questions found</div>
          <div className="empty-text">
            Try adjusting your search or browse all categories
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="empty-btn"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Contact support CTA */}
      <div className="faq-cta">
        <div className="faq-cta__content">
          <h3>Still have questions?</h3>
          <p>Our team is here to help you find the perfect solution for your needs.</p>
        </div>
        <div className="faq-cta__actions">
          <a href="/contact" className="faq-cta-btn faq-cta-btn--primary">
            <Icon name="message-square" size={18} aria-hidden />
            Contact support
          </a>
          <a href="/demo" className="faq-cta-btn faq-cta-btn--secondary">
            <Icon name="play-circle" size={18} aria-hidden />
            Book a demo
          </a>
        </div>
      </div>

      <style jsx>{`
        .enhanced-faq {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .faq-header {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .faq-header__content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          align-self: flex-start;
          padding: 0.5rem 1rem;
          background: color-mix(in srgb, var(--accent-primary) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-primary) 30%, transparent);
          border-radius: 999px;
          color: var(--accent-primary);
          font-weight: 700;
          font-size: 0.85rem;
        }

        .faq-header h2 {
          margin: 0;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .faq-subtitle {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 600px;
        }

        .faq-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-wrapper {
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 1rem 3.5rem 1rem 3.5rem;
          border: 2px solid var(--border-default);
          border-radius: 14px;
          background: var(--bg-card);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent-primary) 15%, transparent);
        }

        .search-clear {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          padding: 0.5rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .search-clear:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .category-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-pill {
          padding: 0.65rem 1.25rem;
          border: 2px solid var(--border-default);
          border-radius: 999px;
          background: var(--bg-card);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .category-pill:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        .category-pill--active {
          border-color: var(--accent-primary);
          background: var(--accent-primary);
          color: var(--text-inverse);
        }

        .expand-controls {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .expand-control-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-default);
          border-radius: 10px;
          background: transparent;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .expand-control-btn:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        .faq-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          border: 2px solid var(--border-default);
          border-radius: 18px;
          background: var(--bg-card);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 4px 16px color-mix(in srgb, var(--accent-primary) 10%, transparent);
        }

        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          width: 100%;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: 0;
          text-align: start;
          transition: background 0.2s ease;
        }

        .faq-question:hover {
          background: var(--bg-secondary);
        }

        .faq-question:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: -3px;
        }

        .question-content {
          flex: 1;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .question-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .question-text {
          font-weight: 800;
          font-size: 1.05rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .question-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .question-toggle--open {
          background: var(--accent-primary);
          color: var(--text-inverse);
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      padding 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-answer--open {
          max-height: 1000px;
        }

        .answer-content {
          padding: 0 1.5rem 1.5rem 4.5rem;
        }

        .answer-content p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1rem;
        }

        .faq-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem 2rem;
          text-align: center;
        }

        .empty-icon {
          color: var(--text-secondary);
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text-primary);
        }

        .empty-text {
          color: var(--text-secondary);
          max-width: 400px;
        }

        .empty-btn {
          margin-top: 1rem;
          padding: 0.85rem 1.75rem;
          border: 2px solid var(--accent-primary);
          border-radius: 12px;
          background: var(--accent-primary);
          color: var(--text-inverse);
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .empty-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent-primary) 30%, transparent);
        }

        .faq-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 2.5rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-primary) 10%, var(--bg-secondary)),
            var(--bg-secondary)
          );
          border: 2px solid var(--border-default);
          border-radius: 24px;
          flex-wrap: wrap;
        }

        .faq-cta__content {
          flex: 1;
          min-width: 250px;
        }

        .faq-cta__content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 900;
        }

        .faq-cta__content p {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .faq-cta__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .faq-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 800;
          text-decoration: none;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .faq-cta-btn--primary {
          background: var(--accent-primary);
          color: var(--text-inverse);
          border-color: var(--accent-primary);
        }

        .faq-cta-btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px color-mix(in srgb, var(--accent-primary) 30%, transparent);
        }

        .faq-cta-btn--secondary {
          background: transparent;
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .faq-cta-btn--secondary:hover {
          background: var(--bg-card);
          border-color: var(--accent-primary);
        }

        .faq-cta-btn:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .answer-content {
            padding: 0 1.5rem 1.5rem 1.5rem;
          }

          .faq-cta {
            flex-direction: column;
            align-items: flex-start;
            padding: 2rem 1.5rem;
          }

          .faq-cta__actions {
            width: 100%;
          }

          .faq-cta-btn {
            flex: 1;
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .search-input,
          .category-pill,
          .faq-item,
          .question-toggle,
          .faq-answer,
          .faq-cta-btn {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

