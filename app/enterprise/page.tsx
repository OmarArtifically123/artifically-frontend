import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Enterprise AI Automation | Artifically',
  description: 'Enterprise-grade AI automation with security, compliance, and white-glove support for teams of 100 to 100,000.',
};

export default function EnterprisePage() {
  return (
    <main className="enterprise-page">
      {/* 1. ENTERPRISE HERO */}
      <section className="enterprise-hero">
        <div className="container">
          <span className="eyebrow">Built for Enterprise Scale</span>
          <h1 className="headline">Built for Teams of 100 to 100,000</h1>
          <p className="subheadline">
            Enterprise-grade AI automation with security, compliance, and white-glove support
            for the world&apos;s most demanding operations teams.
          </p>

          <div className="cta-group">
            <Link href="/contact?type=enterprise" className="btn btn-primary btn-large">
              Schedule Enterprise Demo
            </Link>
            <Link href="/security" className="btn btn-secondary btn-large">
              Download Security Whitepaper
            </Link>
          </div>

          {/* Trust signals */}
          <div className="trust-row">
            <span className="trust-badge">
              <Icon name="shield" size={20} />
              SOC 2 Type II
            </span>
            <span className="trust-badge">
              <Icon name="shield" size={20} />
              ISO 27001
            </span>
            <span className="trust-badge">
              <Icon name="shield" size={20} />
              GDPR Compliant
            </span>
            <span className="trust-badge">
              <Icon name="shield" size={20} />
              HIPAA Ready
            </span>
          </div>
        </div>
      </section>

      {/* 2. WHY ENTERPRISE TEAMS CHOOSE ARTIFICALLY */}
      <section className="enterprise-why">
        <div className="container">
          <h2 className="section-title">Why Enterprise Teams Choose Artifically</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="rocket" size={32} />
              </div>
              <h3 className="feature-title">Pre-Built vs Build-From-Scratch</h3>
              <p className="feature-description">
                Deploy in hours, not months. Save 6-12 months of engineering time with 200+ pre-built enterprise automations.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="shield" size={32} />
              </div>
              <h3 className="feature-title">Enterprise Security & Compliance</h3>
              <p className="feature-description">
                SOC 2 Type II, ISO 27001, GDPR, HIPAA ready. Not consumer tools—built for regulated industries.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="headphones" size={32} />
              </div>
              <h3 className="feature-title">Dedicated Support</h3>
              <p className="feature-description">
                15-minute critical response SLA. Dedicated success architect. Priority engineering support.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="zap" size={32} />
              </div>
              <h3 className="feature-title">Unlimited Scale</h3>
              <p className="feature-description">
                10,000+ concurrent automations supported. Multi-region deployment. 99.98% uptime SLA.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="users" size={32} />
              </div>
              <h3 className="feature-title">White-Glove Onboarding</h3>
              <p className="feature-description">
                Dedicated success architect. Custom integration support. Training for your teams.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="globe" size={32} />
              </div>
              <h3 className="feature-title">Global Compliance</h3>
              <p className="feature-description">
                Data residency in US, EU, Middle East, APAC. Saudi PDPL, UAE DPA compliant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENTERPRISE FEATURES GRID */}
      <section className="enterprise-features">
        <div className="container">
          <h2 className="section-title">Enterprise Features</h2>

          <div className="features-grid">
            {/* Security & Access */}
            <div className="feature-category">
              <h3 className="category-title">Security & Access</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>SSO & SAML 2.0</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>SCIM provisioning</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Role-based access control (RBAC)</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Multi-factor authentication</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>IP allowlisting</span>
                </li>
              </ul>
            </div>

            {/* Compliance & Audit */}
            <div className="feature-category">
              <h3 className="category-title">Compliance & Audit</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Audit logs (7-year retention)</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Compliance reporting</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Data residency options</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>GDPR data processing agreement</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>HIPAA business associate agreement</span>
                </li>
              </ul>
            </div>

            {/* Support & SLA */}
            <div className="feature-category">
              <h3 className="category-title">Support & SLA</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>99.98% uptime SLA</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>15-min critical response</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Dedicated Slack channel</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Priority engineering support</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Quarterly business reviews</span>
                </li>
              </ul>
            </div>

            {/* Scale & Performance */}
            <div className="feature-category">
              <h3 className="category-title">Scale & Performance</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Unlimited automations</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>10,000+ concurrent executions</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Multi-region deployment</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Dedicated infrastructure option</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={20} />
                  <span>Custom SLA agreements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENTERPRISE CASE STUDIES */}
      <section className="enterprise-case-studies">
        <div className="container">
          <h2 className="section-title">Trusted by Enterprise Teams</h2>

          <div className="case-study-grid">
            <article className="case-study-card">
              <div className="case-study-header">
                <h3 className="case-study-title">Leading Financial Services Firm</h3>
                <p className="case-study-description">
                  Global financial institution, 5,000+ employees, Fortune 500
                </p>
              </div>
              <div className="roi-highlight">5.1x ROI in 8 weeks</div>
              <ul className="metrics-list">
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>61% cost reduction</span>
                </li>
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>35% cycle time improvement</span>
                </li>
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>127 automations deployed</span>
                </li>
              </ul>
            </article>

            <article className="case-study-card">
              <div className="case-study-header">
                <h3 className="case-study-title">Top 50 Global Retailer</h3>
                <p className="case-study-description">
                  Multi-channel retail operation, 200+ locations, $2B+ revenue
                </p>
              </div>
              <div className="roi-highlight">4.4x ROI in 6 weeks</div>
              <ul className="metrics-list">
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>94.2% inventory accuracy</span>
                </li>
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>71% faster order processing</span>
                </li>
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>94 automations deployed</span>
                </li>
              </ul>
            </article>

            <article className="case-study-card">
              <div className="case-study-header">
                <h3 className="case-study-title">Fortune 500 Healthcare Provider</h3>
                <p className="case-study-description">
                  Healthcare provider network, 50+ facilities, HIPAA-compliant operations
                </p>
              </div>
              <div className="roi-highlight">6.2x ROI in 10 weeks</div>
              <ul className="metrics-list">
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>23% patient outcome improvement</span>
                </li>
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>68% admin time reduction</span>
                </li>
                <li className="metric-item">
                  <Icon name="check" size={18} />
                  <span>156 automations deployed</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 5. ENTERPRISE PRICING */}
      <section className="enterprise-pricing">
        <div className="container">
          <h2 className="section-title">Enterprise Pricing</h2>
          <p className="pricing-intro">Flexible pricing designed for enterprise scale</p>

          <div className="pricing-card-wrapper">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-plan-title">Enterprise Plan</h3>
                <div className="price-container">
                  <span className="price">Starting at $5,000</span>
                  <span className="price-period">/month</span>
                </div>
                <p className="price-details">For teams of 100-500 employees</p>
              </div>

              <ul className="pricing-features">
                <li className="pricing-feature">
                  <Icon name="check" size={20} />
                  <span>Unlimited automations</span>
                </li>
                <li className="pricing-feature">
                  <Icon name="check" size={20} />
                  <span>Dedicated success architect</span>
                </li>
                <li className="pricing-feature">
                  <Icon name="check" size={20} />
                  <span>Priority support (15-min SLA)</span>
                </li>
                <li className="pricing-feature">
                  <Icon name="check" size={20} />
                  <span>Custom integrations included</span>
                </li>
                <li className="pricing-feature">
                  <Icon name="check" size={20} />
                  <span>Professional services included</span>
                </li>
                <li className="pricing-feature">
                  <Icon name="check" size={20} />
                  <span>99.98% uptime SLA</span>
                </li>
                <li className="pricing-feature">
                  <Icon name="check" size={20} />
                  <span>Annual contract with volume discounts</span>
                </li>
              </ul>

              <div className="custom-pricing">
                <p className="custom-pricing-text">
                  <Icon name="sparkles" size={20} />
                  Custom pricing for 500+ employees
                </p>
              </div>

              <Link href="/contact?type=enterprise" className="btn btn-primary btn-full">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="enterprise-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Enterprise Operations?</h2>
            <p className="cta-description">
              Schedule a demo with our enterprise team to see how Artifically can automate your most complex workflows.
            </p>

            <Link href="/contact?type=enterprise" className="btn btn-primary btn-large">
              Schedule Enterprise Demo
            </Link>

            <p className="cta-note">
              Average enterprise deployment: 2-4 weeks. ROI realized within 8-12 weeks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
