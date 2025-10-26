"use client";

import { useState, useMemo, useId } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";

export default function EnterprisePage() {
  const [roiEmployees, setRoiEmployees] = useState(250);
  const [roiSalary, setRoiSalary] = useState(75000);
  const [roiHours, setRoiHours] = useState(8);

  // ROI Calculator logic
  const roiResults = useMemo(() => {
    const annualCostPerEmployee = roiSalary;
    const hourlyRate = annualCostPerEmployee / 2080; // 52 weeks * 40 hours
    const weeklyHoursSaved = roiHours * roiEmployees;
    const annualHoursSaved = weeklyHoursSaved * 52;
    const annualSavings = annualHoursSaved * hourlyRate;

    // Enterprise pricing estimate
    const monthlyPrice = roiEmployees < 500 ? 5000 : roiEmployees < 1000 ? 8000 : roiEmployees * 12;
    const annualCost = monthlyPrice * 12;

    const roi = annualSavings / annualCost;
    const breakEvenMonths = Math.max(1, Math.round(12 / roi));
    const fteEquivalent = Math.round((weeklyHoursSaved / 40) * 10) / 10;

    return {
      annualSavings: Math.round(annualSavings),
      roi: Math.round(roi * 10) / 10,
      breakEvenMonths,
      fteEquivalent,
      monthlyPrice,
    };
  }, [roiEmployees, roiSalary, roiHours]);

  const employeesId = useId();
  const salaryId = useId();
  const hoursId = useId();

  return (
    <main className="enterprise-page">
      {/* HERO SECTION */}
      <section className="enterprise-hero" aria-labelledby="enterprise-hero-title">
        <div className="container">
          <span className="eyebrow">Enterprise-Grade AI Automation</span>
          <h1 id="enterprise-hero-title" className="headline">
            Built for Teams of 100 to 100,000
          </h1>
          <p className="subheadline">
            Enterprise-grade AI automation with the security, compliance, and scale your organization demands.
            Deploy in weeks, not months. SOC 2 Type II certified with 99.98% uptime SLA.
          </p>

          <div className="cta-group">
            <Link href="/contact?type=enterprise" className="btn btn-primary btn-large">
              Schedule Enterprise Demo
            </Link>
            <Link href="/security" className="btn btn-secondary btn-large">
              Download Security Whitepaper
            </Link>
          </div>

          {/* Trust signals above fold */}
          <div className="trust-row" role="list" aria-label="Compliance certifications">
            <span className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden />
              SOC 2 Type II
            </span>
            <span className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden />
              ISO 27001
            </span>
            <span className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden />
              GDPR Compliant
            </span>
            <span className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden />
              HIPAA Ready
            </span>
          </div>
        </div>
      </section>

      {/* ENTERPRISE VALUE PROPOSITION */}
      <section className="enterprise-value" aria-labelledby="value-title">
        <div className="container">
          <h2 id="value-title" className="section-title">Why Enterprise Teams Choose Artifically</h2>
          <p className="section-subtitle">
            Built from the ground up for enterprise scale, security, and compliance requirements
          </p>

          <div className="value-grid">
            <div className="value-card">
              <div className="value-icon">
                <Icon name="rocket" size={36} aria-hidden />
              </div>
              <h3 className="value-title">Scale</h3>
              <p className="value-description">
                Handle unlimited automations, users, and operations. Built to scale from 100 to 100,000 employees
                with multi-region deployment and dedicated infrastructure options.
              </p>
              <ul className="value-list">
                <li>Unlimited automations & API calls</li>
                <li>10,000+ concurrent executions</li>
                <li>Multi-region deployment (US, EU, MENA, APAC)</li>
              </ul>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Icon name="shield" size={36} aria-hidden />
              </div>
              <h3 className="value-title">Security</h3>
              <p className="value-description">
                Enterprise-grade security and compliance built for regulated industries. SOC 2 Type II, ISO 27001,
                GDPR, HIPAA ready with data residency options.
              </p>
              <ul className="value-list">
                <li>AES-256 encryption at rest, TLS 1.3 in transit</li>
                <li>SSO, SAML 2.0, SCIM provisioning</li>
                <li>7-year audit log retention</li>
              </ul>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Icon name="headphones" size={36} aria-hidden />
              </div>
              <h3 className="value-title">Support</h3>
              <p className="value-description">
                Dedicated success team, 24/7 support with {"<"}15min critical response SLA. Account manager,
                quarterly business reviews, and priority engineering support.
              </p>
              <ul className="value-list">
                <li>15-min critical, 2hr high, 8hr medium response</li>
                <li>Dedicated Slack channel with your team</li>
                <li>Quarterly business reviews & strategic planning</li>
              </ul>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Icon name="plug" size={36} aria-hidden />
              </div>
              <h3 className="value-title">Integration</h3>
              <p className="value-description">
                SSO, SAML, SCIM, RBAC, and API access. Integrate with your existing enterprise stack including
                Active Directory, Okta, Azure AD, and more.
              </p>
              <ul className="value-list">
                <li>SSO with SAML 2.0 & OAuth 2.0</li>
                <li>SCIM 2.0 user provisioning</li>
                <li>Granular RBAC & IP allowlisting</li>
              </ul>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Icon name="dollar" size={36} aria-hidden />
              </div>
              <h3 className="value-title">ROI</h3>
              <p className="value-description">
                Average 4.5x ROI within 8-12 weeks. Reduce operational costs by 60%+ while improving accuracy,
                speed, and employee satisfaction.
              </p>
              <ul className="value-list">
                <li>Average 4.5x ROI in 8-12 weeks</li>
                <li>60%+ reduction in manual work</li>
                <li>Typical breakeven in 2-3 months</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE FEATURES GRID */}
      <section className="enterprise-features" aria-labelledby="features-title">
        <div className="container">
          <h2 id="features-title" className="section-title">Enterprise Features</h2>
          <p className="section-subtitle">
            Everything you need for enterprise-grade AI automation at scale
          </p>

          <div className="features-grid">
            <div className="feature-category">
              <div className="category-header">
                <Icon name="lock" size={24} aria-hidden />
                <h3 className="category-title">Security & Access Control</h3>
              </div>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>SSO & SAML 2.0 authentication</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>SCIM 2.0 user provisioning</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Role-Based Access Control (RBAC)</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Multi-factor authentication (MFA)</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>IP allowlisting & geofencing</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>AES-256 encryption at rest</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>TLS 1.3 encryption in transit</span>
                </li>
              </ul>
            </div>

            <div className="feature-category">
              <div className="category-header">
                <Icon name="clipboardCheck" size={24} aria-hidden />
                <h3 className="category-title">Compliance & Audit</h3>
              </div>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>SOC 2 Type II certified</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>ISO 27001 certified</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>GDPR & CCPA compliant</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>HIPAA ready with BAA</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Audit logs (7-year retention)</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Compliance reporting dashboard</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Regional data residency (US, EU, MENA, APAC)</span>
                </li>
              </ul>
            </div>

            <div className="feature-category">
              <div className="category-header">
                <Icon name="headphones" size={24} aria-hidden />
                <h3 className="category-title">Support & SLA</h3>
              </div>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>99.98% uptime SLA (43 min/year max downtime)</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Critical: {"<"}15 minutes response time</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>High: {"<"}2 hours response time</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Medium: {"<"}8 hours response time</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Dedicated Slack channel</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Named account manager</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Quarterly business reviews</span>
                </li>
              </ul>
            </div>

            <div className="feature-category">
              <div className="category-header">
                <Icon name="zap" size={24} aria-hidden />
                <h3 className="category-title">Scale & Performance</h3>
              </div>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Unlimited automations & workflows</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Unlimited API calls</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>10,000+ concurrent executions</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Multi-region deployment</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Dedicated infrastructure options</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Custom SLA agreements</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Advanced analytics & reporting</span>
                </li>
              </ul>
            </div>

            <div className="feature-category">
              <div className="category-header">
                <Icon name="plug" size={24} aria-hidden />
                <h3 className="category-title">Integration & Customization</h3>
              </div>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Custom integrations included</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>REST API with rate limit overrides</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Webhooks & event streaming</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>White-label options</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Custom domain & branding</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Professional services & training</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Migration assistance from existing tools</span>
                </li>
              </ul>
            </div>

            <div className="feature-category">
              <div className="category-header">
                <Icon name="analytics" size={24} aria-hidden />
                <h3 className="category-title">Analytics & Reporting</h3>
              </div>
              <ul className="feature-list">
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Real-time performance dashboards</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Custom reporting & exports</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Usage analytics & insights</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>ROI tracking & attribution</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Team collaboration metrics</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Cost optimization recommendations</span>
                </li>
                <li className="feature-item">
                  <Icon name="check" size={18} aria-hidden />
                  <span>Executive summary reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE CASE STUDIES */}
      <section className="enterprise-case-studies" aria-labelledby="case-studies-title">
        <div className="container">
          <h2 id="case-studies-title" className="section-title">Trusted by Enterprise Teams Worldwide</h2>
          <p className="section-subtitle">
            Real results from Fortune 500 companies and industry leaders
          </p>

          <div className="case-study-grid">
            <article className="case-study-card">
              <div className="case-study-industry">Financial Services</div>
              <h3 className="case-study-title">Fortune 500 Financial Services Firm</h3>
              <p className="case-study-meta">5,000+ employees • Global operations • HIPAA compliant</p>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Challenge</h4>
                <p className="case-study-text">
                  Manual processing of loan applications taking 7-14 days with high error rates.
                  Required HIPAA compliance and needed to scale during peak seasons.
                </p>
              </div>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Solution</h4>
                <p className="case-study-text">
                  Deployed 127 automations covering document verification, credit checks, approval workflows,
                  and customer communications with full audit trail.
                </p>
              </div>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Results</h4>
                <ul className="metrics-list">
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>5.1x ROI</strong> achieved in 8 weeks</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>61% cost reduction</strong> in loan processing</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>35% faster</strong> application cycle time</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>127 automations</strong> deployed enterprise-wide</span>
                  </li>
                </ul>
              </div>
            </article>

            <article className="case-study-card">
              <div className="case-study-industry">Retail</div>
              <h3 className="case-study-title">Top 50 Global Retail Chain</h3>
              <p className="case-study-meta">200+ locations • $2B+ revenue • Multi-channel operations</p>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Challenge</h4>
                <p className="case-study-text">
                  Inventory management across 200+ locations with frequent stockouts and overstock.
                  Manual order processing causing delays and customer dissatisfaction.
                </p>
              </div>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Solution</h4>
                <p className="case-study-text">
                  Automated inventory tracking, predictive restocking, order processing, and supplier
                  communications across all locations with real-time synchronization.
                </p>
              </div>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Results</h4>
                <ul className="metrics-list">
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>4.4x ROI</strong> achieved in 6 weeks</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>94.2% inventory accuracy</strong> (up from 73%)</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>71% faster</strong> order processing</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>$2.1M annual savings</strong> in labor costs</span>
                  </li>
                </ul>
              </div>
            </article>

            <article className="case-study-card">
              <div className="case-study-industry">Healthcare</div>
              <h3 className="case-study-title">Fortune 500 Healthcare Provider Network</h3>
              <p className="case-study-meta">50+ facilities • 10,000+ staff • HIPAA-compliant operations</p>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Challenge</h4>
                <p className="case-study-text">
                  Patient scheduling conflicts, insurance verification delays, and administrative overhead
                  consuming 40% of staff time. Required strict HIPAA compliance.
                </p>
              </div>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Solution</h4>
                <p className="case-study-text">
                  Automated patient intake, insurance verification, appointment scheduling, follow-up
                  reminders, and billing with end-to-end HIPAA compliance and audit logging.
                </p>
              </div>

              <div className="case-study-section">
                <h4 className="case-study-section-title">Results</h4>
                <ul className="metrics-list">
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>6.2x ROI</strong> achieved in 10 weeks</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>23% improvement</strong> in patient outcomes</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>68% reduction</strong> in administrative time</span>
                  </li>
                  <li className="metric-item">
                    <Icon name="check" size={18} aria-hidden />
                    <span><strong>156 automations</strong> across 50+ facilities</span>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* SECURITY & COMPLIANCE SECTION */}
      <section className="enterprise-security" aria-labelledby="security-title">
        <div className="container">
          <h2 id="security-title" className="section-title">Enterprise-Grade Security & Compliance</h2>
          <p className="section-subtitle">
            Built for the most regulated industries with certifications, compliance, and security controls
          </p>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-header">
                <Icon name="shield" size={28} aria-hidden />
                <h3 className="security-title">Certifications</h3>
              </div>
              <ul className="security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>SOC 2 Type II</strong> - Independent audit of security controls</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>ISO 27001</strong> - Information security management certification</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>GDPR Compliant</strong> - EU data protection regulation</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>HIPAA Ready</strong> - Business Associate Agreement available</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>CCPA Compliant</strong> - California Consumer Privacy Act</span>
                </li>
              </ul>
            </div>

            <div className="security-card">
              <div className="security-header">
                <Icon name="globe" size={28} aria-hidden />
                <h3 className="security-title">Regional Compliance</h3>
              </div>
              <ul className="security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>Saudi PDPL</strong> - Personal Data Protection Law compliance</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>UAE DPA</strong> - Data Protection Authority compliance</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>UK GDPR</strong> - Post-Brexit data protection</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>APAC Standards</strong> - Regional compliance frameworks</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>Data Residency</strong> - US, EU, MENA, APAC regions</span>
                </li>
              </ul>
            </div>

            <div className="security-card">
              <div className="security-header">
                <Icon name="lock" size={28} aria-hidden />
                <h3 className="security-title">Data Encryption</h3>
              </div>
              <ul className="security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>AES-256</strong> encryption at rest for all data</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>TLS 1.3</strong> encryption in transit</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>Key Management</strong> - AWS KMS or customer-managed keys</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>Encrypted Backups</strong> - Daily automated encrypted backups</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>Secure Storage</strong> - Encrypted database and file storage</span>
                </li>
              </ul>
            </div>

            <div className="security-card">
              <div className="security-header">
                <Icon name="userCheck" size={28} aria-hidden />
                <h3 className="security-title">Access Controls</h3>
              </div>
              <ul className="security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>Multi-Factor Auth</strong> - Required for all users</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>SSO/SAML 2.0</strong> - Okta, Azure AD, Google, custom</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>RBAC</strong> - Granular role-based permissions</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>IP Allowlisting</strong> - Restrict access by IP/range</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden />
                  <span><strong>Session Management</strong> - Automatic timeout & controls</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="security-footer">
            <p className="security-footer-text">
              For detailed security documentation, penetration test results, and compliance reports:
            </p>
            <Link href="/security" className="btn btn-secondary">
              View Security Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="enterprise-roi" aria-labelledby="roi-title">
        <div className="container">
          <div className="roi-header">
            <h2 id="roi-title" className="section-title">Calculate Your ROI</h2>
            <p className="section-subtitle">
              Estimate your annual savings and return on investment with Artifically Enterprise
            </p>
          </div>

          <div className="roi-calculator">
            <div className="roi-inputs">
              <div className="roi-input-group">
                <label htmlFor={employeesId} className="roi-label">
                  Number of Employees
                </label>
                <div className="roi-slider-container">
                  <input
                    id={employeesId}
                    type="range"
                    min="100"
                    max="10000"
                    step="50"
                    value={roiEmployees}
                    onChange={(e) => setRoiEmployees(Number(e.target.value))}
                    className="roi-slider"
                    aria-valuemin={100}
                    aria-valuemax={10000}
                    aria-valuenow={roiEmployees}
                    aria-valuetext={`${roiEmployees.toLocaleString()} employees`}
                  />
                  <output htmlFor={employeesId} className="roi-output">
                    {roiEmployees.toLocaleString()}
                  </output>
                </div>
              </div>

              <div className="roi-input-group">
                <label htmlFor={salaryId} className="roi-label">
                  Average Salary (Annual)
                </label>
                <div className="roi-slider-container">
                  <input
                    id={salaryId}
                    type="range"
                    min="40000"
                    max="200000"
                    step="5000"
                    value={roiSalary}
                    onChange={(e) => setRoiSalary(Number(e.target.value))}
                    className="roi-slider"
                    aria-valuemin={40000}
                    aria-valuemax={200000}
                    aria-valuenow={roiSalary}
                    aria-valuetext={`$${roiSalary.toLocaleString()} per year`}
                  />
                  <output htmlFor={salaryId} className="roi-output">
                    ${roiSalary.toLocaleString()}
                  </output>
                </div>
              </div>

              <div className="roi-input-group">
                <label htmlFor={hoursId} className="roi-label">
                  Hours Spent on Manual Tasks (per week)
                </label>
                <div className="roi-slider-container">
                  <input
                    id={hoursId}
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={roiHours}
                    onChange={(e) => setRoiHours(Number(e.target.value))}
                    className="roi-slider"
                    aria-valuemin={1}
                    aria-valuemax={20}
                    aria-valuenow={roiHours}
                    aria-valuetext={`${roiHours} hours per week`}
                  />
                  <output htmlFor={hoursId} className="roi-output">
                    {roiHours} hrs
                  </output>
                </div>
              </div>
            </div>

            <div className="roi-results" aria-live="polite">
              <div className="roi-headline">
                <span className="roi-headline-amount">
                  ${roiResults.annualSavings.toLocaleString()}
                </span>
                <span className="roi-headline-label">Annual Savings</span>
              </div>

              <div className="roi-metrics">
                <div className="roi-metric">
                  <span className="roi-metric-value">{roiResults.roi}x</span>
                  <span className="roi-metric-label">Return on Investment</span>
                </div>
                <div className="roi-metric">
                  <span className="roi-metric-value">{roiResults.breakEvenMonths} mo</span>
                  <span className="roi-metric-label">Break-Even Timeline</span>
                </div>
                <div className="roi-metric">
                  <span className="roi-metric-value">{roiResults.fteEquivalent}</span>
                  <span className="roi-metric-label">FTE Equivalent Saved</span>
                </div>
              </div>

              <div className="roi-pricing-estimate">
                <p className="roi-pricing-text">
                  Estimated enterprise pricing: <strong>${roiResults.monthlyPrice.toLocaleString()}/month</strong>
                </p>
                <p className="roi-disclaimer">
                  *Based on industry averages. Actual results may vary. Custom pricing available for 500+ employees.
                </p>
              </div>

              <Link href="/contact?type=enterprise" className="btn btn-primary btn-full">
                Get Custom ROI Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION & ONBOARDING */}
      <section className="enterprise-implementation" aria-labelledby="implementation-title">
        <div className="container">
          <h2 id="implementation-title" className="section-title">White-Glove Implementation & Onboarding</h2>
          <p className="section-subtitle">
            From contract signature to full production deployment in 2-4 weeks
          </p>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-number">1</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-title">Week 1: Discovery & Planning</h3>
                <ul className="timeline-list">
                  <li>Kickoff meeting with your team and dedicated success architect</li>
                  <li>Technical discovery and requirements gathering</li>
                  <li>Security review and compliance alignment</li>
                  <li>Infrastructure setup and SSO configuration</li>
                  <li>Custom integration planning</li>
                </ul>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-number">2</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-title">Week 2: Configuration & Integration</h3>
                <ul className="timeline-list">
                  <li>Deploy dedicated infrastructure (if applicable)</li>
                  <li>Configure SSO, SAML, SCIM provisioning</li>
                  <li>Set up RBAC roles and permissions</li>
                  <li>Custom integration development</li>
                  <li>Data migration from existing tools (if needed)</li>
                </ul>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-number">3</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-title">Week 3: Training & Pilot</h3>
                <ul className="timeline-list">
                  <li>Admin training sessions for your IT team</li>
                  <li>End-user training for department leads</li>
                  <li>Deploy pilot automations with select teams</li>
                  <li>Monitor, iterate, and optimize based on feedback</li>
                  <li>Security and compliance verification</li>
                </ul>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-number">4</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-title">Week 4: Full Production Launch</h3>
                <ul className="timeline-list">
                  <li>Enterprise-wide rollout to all departments</li>
                  <li>Deploy production automations at scale</li>
                  <li>Enable 24/7 support and monitoring</li>
                  <li>Schedule first quarterly business review</li>
                  <li>Ongoing optimization and success planning</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="implementation-footer">
            <h3 className="implementation-footer-title">What&apos;s Included</h3>
            <div className="implementation-included">
              <div className="included-item">
                <Icon name="check" size={20} aria-hidden />
                <span>Dedicated implementation team assigned to your account</span>
              </div>
              <div className="included-item">
                <Icon name="check" size={20} aria-hidden />
                <span>Custom training sessions tailored to your workflows</span>
              </div>
              <div className="included-item">
                <Icon name="check" size={20} aria-hidden />
                <span>Integration support with your existing enterprise tools</span>
              </div>
              <div className="included-item">
                <Icon name="check" size={20} aria-hidden />
                <span>Migration assistance from legacy automation platforms</span>
              </div>
              <div className="included-item">
                <Icon name="check" size={20} aria-hidden />
                <span>Professional services for custom automation development</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT & SLA */}
      <section className="enterprise-support" aria-labelledby="support-title">
        <div className="container">
          <h2 id="support-title" className="section-title">24/7 Enterprise Support</h2>
          <p className="section-subtitle">
            World-class support with industry-leading SLAs and dedicated resources
          </p>

          <div className="support-grid">
            <div className="support-card">
              <h3 className="support-card-title">Response Times</h3>
              <ul className="support-list">
                <li className="support-item support-item--critical">
                  <div className="support-priority">
                    <Icon name="alertTriangle" size={20} aria-hidden />
                    <span className="support-priority-label">Critical</span>
                  </div>
                  <span className="support-time">&lt;15 minutes</span>
                  <p className="support-description">
                    Production down, security incident, data loss
                  </p>
                </li>
                <li className="support-item support-item--high">
                  <div className="support-priority">
                    <Icon name="alert" size={20} aria-hidden />
                    <span className="support-priority-label">High</span>
                  </div>
                  <span className="support-time">&lt;2 hours</span>
                  <p className="support-description">
                    Major feature not working, significant impact
                  </p>
                </li>
                <li className="support-item support-item--medium">
                  <div className="support-priority">
                    <Icon name="info" size={20} aria-hidden />
                    <span className="support-priority-label">Medium</span>
                  </div>
                  <span className="support-time">&lt;8 hours</span>
                  <p className="support-description">
                    Feature degraded, workaround available
                  </p>
                </li>
              </ul>
            </div>

            <div className="support-card">
              <h3 className="support-card-title">Support Channels</h3>
              <ul className="support-channels">
                <li className="support-channel">
                  <Icon name="message" size={24} aria-hidden />
                  <div className="support-channel-content">
                    <strong>Dedicated Slack Channel</strong>
                    <p>Direct access to your success team and engineering</p>
                  </div>
                </li>
                <li className="support-channel">
                  <Icon name="headphones" size={24} aria-hidden />
                  <div className="support-channel-content">
                    <strong>24/7 Phone Support</strong>
                    <p>Priority hotline for critical issues</p>
                  </div>
                </li>
                <li className="support-channel">
                  <Icon name="mail" size={24} aria-hidden />
                  <div className="support-channel-content">
                    <strong>Priority Email</strong>
                    <p>Dedicated support email with SLA guarantees</p>
                  </div>
                </li>
                <li className="support-channel">
                  <Icon name="users" size={24} aria-hidden />
                  <div className="support-channel-content">
                    <strong>Named Account Manager</strong>
                    <p>Single point of contact who knows your business</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="support-extras">
            <h3 className="support-extras-title">Additional Support Benefits</h3>
            <div className="support-extras-grid">
              <div className="support-extra">
                <Icon name="calendar" size={24} aria-hidden />
                <div>
                  <strong>Quarterly Business Reviews</strong>
                  <p>Strategic planning and optimization sessions</p>
                </div>
              </div>
              <div className="support-extra">
                <Icon name="analytics" size={24} aria-hidden />
                <div>
                  <strong>Proactive Monitoring</strong>
                  <p>We identify and resolve issues before you notice</p>
                </div>
              </div>
              <div className="support-extra">
                <Icon name="workflow" size={24} aria-hidden />
                <div>
                  <strong>Professional Services</strong>
                  <p>Custom automation development by our experts</p>
                </div>
              </div>
              <div className="support-extra">
                <Icon name="book" size={24} aria-hidden />
                <div>
                  <strong>Continuous Training</strong>
                  <p>Ongoing education for your team on new features</p>
                </div>
              </div>
            </div>
          </div>

          <div className="uptime-guarantee">
            <div className="uptime-badge">
              <span className="uptime-percentage">99.98%</span>
              <span className="uptime-label">Uptime SLA</span>
            </div>
            <div className="uptime-details">
              <p className="uptime-text">
                We guarantee 99.98% uptime, which means maximum 43 minutes of downtime per year.
                SLA credits automatically applied if we don&apos;t meet our commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="enterprise-pricing" aria-labelledby="pricing-title">
        <div className="container">
          <h2 id="pricing-title" className="section-title">Enterprise Pricing</h2>
          <p className="section-subtitle">
            Transparent, predictable pricing designed for enterprise budgets
          </p>

          <div className="pricing-tiers">
            <div className="pricing-tier">
              <div className="pricing-tier-header">
                <h3 className="pricing-tier-name">Enterprise</h3>
                <div className="pricing-tier-price">
                  <span className="pricing-amount">$5,000</span>
                  <span className="pricing-period">/month</span>
                </div>
                <p className="pricing-tier-description">For teams of 100-500 employees</p>
              </div>

              <div className="pricing-tier-features">
                <h4 className="pricing-features-title">Everything in Professional, plus:</h4>
                <ul className="pricing-features-list">
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Unlimited automations & users</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Dedicated success architect</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>99.98% uptime SLA with credits</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Priority support (15-min critical SLA)</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>SSO, SAML, SCIM provisioning</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Advanced RBAC & audit logs</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Custom integrations (3 included)</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Professional services credits</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Quarterly business reviews</span>
                  </li>
                </ul>
              </div>

              <Link href="/contact?type=enterprise" className="btn btn-primary btn-full">
                Contact Sales
              </Link>
            </div>

            <div className="pricing-tier pricing-tier--custom">
              <div className="pricing-tier-header">
                <h3 className="pricing-tier-name">Enterprise Plus</h3>
                <div className="pricing-tier-price">
                  <span className="pricing-amount">Custom</span>
                </div>
                <p className="pricing-tier-description">For teams of 500+ employees</p>
              </div>

              <div className="pricing-tier-features">
                <h4 className="pricing-features-title">Everything in Enterprise, plus:</h4>
                <ul className="pricing-features-list">
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Dedicated infrastructure / VPC</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Custom SLA agreements</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Regional data residency</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Unlimited custom integrations</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>White-label options</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Multi-region deployment</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Dedicated engineering team</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Volume discounts available</span>
                  </li>
                  <li>
                    <Icon name="check" size={18} aria-hidden />
                    <span>Professional services included</span>
                  </li>
                </ul>
              </div>

              <Link href="/contact?type=enterprise" className="btn btn-outline btn-full">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="pricing-footer">
            <p className="pricing-footer-text">
              All enterprise plans include annual contracts with flexible payment terms.
              Volume discounts available for 1,000+ employees.
            </p>
            <Link href="/pricing" className="pricing-footer-link">
              Compare all plans <Icon name="arrowRight" size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ - ENTERPRISE SPECIFIC */}
      <section className="enterprise-faq" aria-labelledby="faq-title">
        <div className="container">
          <h2 id="faq-title" className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Common questions from enterprise procurement and IT teams
          </p>

          <div className="faq-grid">
            <details className="faq-item">
              <summary className="faq-question">
                <span>What compliance certifications do you have?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  We maintain SOC 2 Type II, ISO 27001, GDPR, HIPAA (with BAA), and CCPA compliance.
                  We also comply with regional regulations including Saudi PDPL and UAE DPA.
                  All certifications are audited annually by independent third parties.
                  Audit reports available under NDA.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Can we host on-premise or in our VPC?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Yes. For Enterprise Plus customers, we offer dedicated infrastructure deployment
                  in your own VPC (AWS, Azure, GCP) or on-premise installation. This provides complete
                  data isolation while maintaining full platform functionality. Additional infrastructure
                  fees apply based on your requirements.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>What&apos;s your data residency policy?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  We support data residency in US (East, West), EU (Frankfurt, Ireland), Middle East
                  (UAE, Saudi Arabia), and APAC (Singapore, Tokyo). You choose your primary region during
                  setup, and all your data stays within that geographic boundary. We never move data
                  across regions without explicit consent.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>How do you handle GDPR/HIPAA/SOC 2?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  GDPR: We provide Data Processing Agreements (DPA), support data subject requests,
                  and maintain EU data residency. HIPAA: Business Associate Agreements (BAA) available,
                  with dedicated HIPAA-compliant infrastructure. SOC 2: Annual Type II audits covering
                  security, availability, and confidentiality. We provide audit reports under NDA to
                  customers.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>What&apos;s included in professional services?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Professional services include custom automation development, complex integration work,
                  data migration from legacy systems, custom training programs, and strategic consulting.
                  Enterprise plans include credits for professional services. Typical engagements: custom
                  API integrations, workflow optimization, team training, and automation audits.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>What&apos;s your typical implementation timeline?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Standard enterprise implementation: 2-4 weeks from contract signature to production.
                  Week 1: Discovery and setup. Week 2: Configuration and integration. Week 3: Training
                  and pilot. Week 4: Full production launch. Complex deployments with custom integrations,
                  data migrations, or dedicated infrastructure may take 6-8 weeks.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Do you offer custom SLAs?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Yes. Enterprise Plus customers can negotiate custom SLAs including uptime guarantees
                  beyond 99.98%, faster response times, dedicated support engineers, and custom penalty
                  structures. We work with your procurement team to meet your specific requirements.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>What&apos;s your disaster recovery plan?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  We maintain automated backups every 6 hours with 30-day retention. Point-in-time
                  recovery available for the last 7 days. Multi-region replication for disaster recovery
                  with RPO {"<"}1 hour and RTO {"<"}4 hours. Annual disaster recovery drills. Full DR
                  documentation available under NDA.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>Can we integrate with our existing tools?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Yes. We offer 500+ pre-built integrations and support custom integrations via REST API,
                  webhooks, and event streaming. Common integrations: Salesforce, SAP, Oracle, Microsoft
                  Dynamics, ServiceNow, Workday, and custom internal systems. Enterprise plans include
                  custom integration development.
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary className="faq-question">
                <span>What happens if we need to cancel?</span>
                <Icon name="chevronDown" size={20} aria-hidden className="faq-icon" />
              </summary>
              <div className="faq-answer">
                <p>
                  Enterprise contracts are annual with 90-day notice for non-renewal. We provide full
                  data export in standard formats (JSON, CSV, SQL) and migration assistance to your new
                  platform. No lock-in - you own your data and automation logic. We maintain data for
                  30 days post-cancellation for recovery if needed.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="enterprise-final-cta" aria-labelledby="final-cta-title">
        <div className="container">
          <div className="final-cta-content">
            <h2 id="final-cta-title" className="final-cta-title">
              Ready to Transform Your Enterprise Operations?
            </h2>
            <p className="final-cta-description">
              Join Fortune 500 companies using Artifically to automate complex workflows,
              reduce costs by 60%+, and achieve 4.5x ROI within 8-12 weeks.
            </p>

            <div className="final-cta-buttons">
              <Link href="/contact?type=enterprise" className="btn btn-primary btn-large">
                Schedule Enterprise Demo
              </Link>
              <Link href="/contact?type=sales" className="btn btn-secondary btn-large">
                Contact Sales Team
              </Link>
              <Link href="/security" className="btn btn-outline btn-large">
                Download Enterprise Overview PDF
              </Link>
            </div>

            <div className="final-cta-stats">
              <div className="final-cta-stat">
                <span className="final-cta-stat-value">2-4 weeks</span>
                <span className="final-cta-stat-label">Average implementation time</span>
              </div>
              <div className="final-cta-stat">
                <span className="final-cta-stat-value">4.5x ROI</span>
                <span className="final-cta-stat-label">Within 8-12 weeks</span>
              </div>
              <div className="final-cta-stat">
                <span className="final-cta-stat-value">99.98%</span>
                <span className="final-cta-stat-label">Uptime SLA</span>
              </div>
            </div>

            <p className="final-cta-note">
              All enterprise plans include white-glove onboarding, dedicated success architect,
              and 24/7 priority support. No credit card required for demo.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* GLOBAL STYLES */
        .enterprise-page {
          --color-primary: var(--accent-primary);
          --color-primary-hover: var(--accent-primary-hover);
          --color-success: var(--accent-success);
          --color-warning: #f59e0b;
          --color-error: #ef4444;
          --color-critical: #dc2626;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin: 0 0 0.75rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: var(--text-primary);
        }

        .section-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          color: var(--text-secondary);
          margin: 0 0 2.5rem;
          max-width: 800px;
        }

        /* BUTTONS */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 2px solid transparent;
          font-size: 1rem;
          line-height: 1.5;
        }

        .btn-primary {
          background: var(--color-primary);
          color: var(--text-inverse);
          border-color: var(--color-primary);
        }

        .btn-primary:hover {
          background: var(--color-primary-hover);
          border-color: var(--color-primary-hover);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .btn-secondary:hover {
          background: var(--bg-tertiary);
          border-color: var(--text-primary);
        }

        .btn-outline {
          background: transparent;
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .btn-outline:hover {
          background: var(--bg-secondary);
          border-color: var(--text-primary);
        }

        .btn-large {
          padding: 1.1rem 2rem;
          font-size: 1.1rem;
        }

        .btn-full {
          width: 100%;
        }

        .btn:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        /* HERO SECTION */
        .enterprise-hero {
          padding: clamp(3rem, 8vw, 6rem) 0 clamp(2rem, 6vw, 4rem);
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--bg-secondary) 80%, var(--accent-primary) 20%),
            var(--bg-secondary)
          );
          border-bottom: 1px solid var(--border-default);
        }

        .eyebrow {
          display: inline-block;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }

        .headline {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0 0 1.25rem;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }

        .subheadline {
          font-size: clamp(1.15rem, 2.5vw, 1.5rem);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 2.5rem;
          max-width: 900px;
        }

        .cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-default);
        }

        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        /* ENTERPRISE VALUE */
        .enterprise-value {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-primary);
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .value-card {
          padding: 2rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .value-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: color-mix(in srgb, var(--color-primary) 15%, transparent);
          border-radius: 16px;
          color: var(--color-primary);
        }

        .value-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .value-description {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .value-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .value-list li {
          padding-left: 1.5rem;
          position: relative;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .value-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--color-success);
          font-weight: 700;
        }

        /* ENTERPRISE FEATURES */
        .enterprise-features {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-secondary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .feature-category {
          padding: 2rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 18px;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-default);
        }

        .category-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--text-secondary);
        }

        .feature-item :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--color-success);
        }

        /* CASE STUDIES */
        .enterprise-case-studies {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-primary);
        }

        .case-study-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .case-study-card {
          padding: 2rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .case-study-industry {
          display: inline-block;
          align-self: flex-start;
          padding: 0.4rem 0.9rem;
          background: color-mix(in srgb, var(--color-primary) 15%, transparent);
          color: var(--color-primary);
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .case-study-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .case-study-meta {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .case-study-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .case-study-section-title {
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
          color: var(--text-secondary);
        }

        .case-study-text {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .metrics-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .metric-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--text-secondary);
        }

        .metric-item :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--color-success);
        }

        .metric-item strong {
          color: var(--text-primary);
        }

        /* SECURITY */
        .enterprise-security {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-secondary);
        }

        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .security-card {
          padding: 2rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 18px;
        }

        .security-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-default);
        }

        .security-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-primary);
        }

        .security-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .security-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .security-list :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--color-success);
        }

        .security-footer {
          text-align: center;
          padding: 2rem;
          background: var(--bg-tertiary);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .security-footer-text {
          margin: 0;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        /* ROI CALCULATOR */
        .enterprise-roi {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-primary);
        }

        .roi-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .roi-calculator {
          max-width: 900px;
          margin: 0 auto;
          padding: 2.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: 24px;
          box-shadow: 0 8px 32px color-mix(in srgb, var(--shadow-strong, #000) 15%, transparent);
        }

        .roi-inputs {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .roi-input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .roi-label {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .roi-slider-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .roi-slider {
          flex: 1;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-default);
          cursor: pointer;
        }

        .roi-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          border: 3px solid var(--bg-card);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .roi-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-primary);
          border: 3px solid var(--bg-card);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .roi-slider:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        .roi-output {
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--color-primary);
          min-width: 120px;
          text-align: right;
        }

        .roi-results {
          padding: 2rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-primary) 10%, transparent),
            color-mix(in srgb, var(--color-success) 10%, transparent)
          );
          border: 2px solid var(--border-strong);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .roi-headline {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }

        .roi-headline-amount {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: var(--color-success);
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .roi-headline-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .roi-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }

        .roi-metric {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
          padding: 1.25rem;
          background: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border-default);
        }

        .roi-metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .roi-metric-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .roi-pricing-estimate {
          padding: 1.5rem;
          background: var(--bg-card);
          border-radius: 12px;
          border: 1px solid var(--border-default);
          text-align: center;
        }

        .roi-pricing-text {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .roi-disclaimer {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-style: italic;
        }

        /* IMPLEMENTATION */
        .enterprise-implementation {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-secondary);
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .timeline-item {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          align-items: start;
        }

        .timeline-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: var(--color-primary);
          border-radius: 16px;
          flex-shrink: 0;
        }

        .timeline-number {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--text-inverse);
        }

        .timeline-item:not(:last-child) .timeline-marker::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 2rem;
          background: var(--border-strong);
        }

        .timeline-content {
          padding: 1.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 18px;
        }

        .timeline-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 1rem;
          color: var(--text-primary);
        }

        .timeline-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .timeline-list li {
          padding-left: 1.5rem;
          position: relative;
          color: var(--text-secondary);
        }

        .timeline-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: 700;
        }

        .implementation-footer {
          padding: 2rem;
          background: var(--bg-tertiary);
          border-radius: 18px;
        }

        .implementation-footer-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 1.5rem;
          color: var(--text-primary);
        }

        .implementation-included {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .included-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--text-secondary);
        }

        .included-item :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--color-success);
        }

        /* SUPPORT */
        .enterprise-support {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-primary);
        }

        .support-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .support-card {
          padding: 2rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 18px;
        }

        .support-card-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 1.5rem;
          color: var(--text-primary);
        }

        .support-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .support-item {
          padding: 1.25rem;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 2px solid var(--border-default);
        }

        .support-item--critical {
          border-color: var(--color-critical);
          background: color-mix(in srgb, var(--color-critical) 8%, transparent);
        }

        .support-item--high {
          border-color: var(--color-warning);
          background: color-mix(in srgb, var(--color-warning) 8%, transparent);
        }

        .support-item--medium {
          border-color: var(--color-primary);
          background: color-mix(in srgb, var(--color-primary) 8%, transparent);
        }

        .support-priority {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .support-time {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.5rem;
        }

        .support-description {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .support-channels {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .support-channel {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-default);
        }

        .support-channel :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--color-primary);
        }

        .support-channel-content {
          flex: 1;
        }

        .support-channel-content strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .support-channel-content p {
          margin: 0;
          color: var(--text-secondary);
        }

        .support-extras {
          margin-bottom: 3rem;
        }

        .support-extras-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 0 1.5rem;
          color: var(--text-primary);
        }

        .support-extras-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .support-extra {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 12px;
        }

        .support-extra :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--color-primary);
        }

        .support-extra strong {
          display: block;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .support-extra p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .uptime-guarantee {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          align-items: center;
          padding: 2rem;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-success) 15%, transparent),
            var(--bg-card)
          );
          border: 2px solid var(--color-success);
          border-radius: 18px;
        }

        .uptime-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: var(--bg-card);
          border-radius: 16px;
        }

        .uptime-percentage {
          font-size: 3rem;
          font-weight: 900;
          color: var(--color-success);
          line-height: 1;
        }

        .uptime-label {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .uptime-text {
          margin: 0;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* PRICING */
        .enterprise-pricing {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-secondary);
        }

        .pricing-tiers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .pricing-tier {
          padding: 2.5rem;
          background: var(--bg-card);
          border: 2px solid var(--border-default);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .pricing-tier--custom {
          border-color: var(--color-primary);
          box-shadow: 0 8px 32px color-mix(in srgb, var(--color-primary) 20%, transparent);
        }

        .pricing-tier-header {
          text-align: center;
        }

        .pricing-tier-name {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 1rem;
          color: var(--text-primary);
        }

        .pricing-tier-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .pricing-amount {
          font-size: 3.5rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1;
        }

        .pricing-period {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .pricing-tier-description {
          margin: 0;
          color: var(--text-secondary);
        }

        .pricing-tier-features {
          flex: 1;
        }

        .pricing-features-title {
          font-size: 1rem;
          font-weight: 800;
          margin: 0 0 1rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pricing-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pricing-features-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--text-secondary);
        }

        .pricing-features-list :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--color-success);
        }

        .pricing-footer {
          text-align: center;
          padding: 2rem;
          background: var(--bg-tertiary);
          border-radius: 18px;
        }

        .pricing-footer-text {
          margin: 0 0 1rem;
          color: var(--text-secondary);
        }

        .pricing-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary);
          font-weight: 700;
          text-decoration: none;
        }

        .pricing-footer-link:hover {
          text-decoration: underline;
        }

        /* FAQ */
        .enterprise-faq {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: var(--bg-primary);
        }

        .faq-grid {
          display: grid;
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-item {
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: 16px;
          overflow: hidden;
        }

        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          width: 100%;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: none;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
          text-align: left;
          cursor: pointer;
          list-style: none;
        }

        .faq-question::-webkit-details-marker {
          display: none;
        }

        .faq-question:hover {
          background: var(--bg-secondary);
        }

        .faq-icon {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .faq-item[open] .faq-icon {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 1.5rem 1.5rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .faq-answer p {
          margin: 0;
        }

        /* FINAL CTA */
        .enterprise-final-cta {
          padding: clamp(3rem, 8vw, 6rem) 0;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-primary) 15%, transparent),
            color-mix(in srgb, var(--color-success) 10%, transparent)
          );
          border-top: 1px solid var(--border-default);
        }

        .final-cta-content {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .final-cta-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          margin: 0 0 1.25rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .final-cta-description {
          font-size: clamp(1.1rem, 2.5vw, 1.35rem);
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0 0 2.5rem;
        }

        .final-cta-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .final-cta-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 2.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: 20px;
        }

        .final-cta-stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }

        .final-cta-stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--color-primary);
          line-height: 1;
        }

        .final-cta-stat-label {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .final-cta-note {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .value-grid,
          .features-grid,
          .case-study-grid,
          .security-grid,
          .support-grid,
          .pricing-tiers {
            grid-template-columns: 1fr;
          }

          .timeline-item {
            grid-template-columns: 1fr;
          }

          .timeline-marker {
            width: 48px;
            height: 48px;
          }

          .timeline-number {
            font-size: 1.5rem;
          }

          .uptime-guarantee {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .final-cta-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
