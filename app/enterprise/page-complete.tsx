"use client";

import { useEffect } from "react";
import HeroSection from "@/components/enterprise/HeroSection";
import PainAmplification from "@/components/enterprise/PainAmplification";
import ROICalculator from "@/components/enterprise/ROICalculator";
import { trackEnterpriseEvent, initScrollTracking } from "@/lib/enterprise-analytics";
import "./enterprise.css";

export default function EnterprisePage() {
  useEffect(() => {
    trackEnterpriseEvent('enterprise_view', {
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
    const cleanup = initScrollTracking();
    return cleanup;
  }, []);

  const scrollToROI = () => {
    document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrimaryCTA = (context: string) => {
    trackEnterpriseEvent('final_cta_click', { variant: context });
    window.location.href = '/contact?type=enterprise-architecture';
  };

  return (
    <>
      {/* Mobile Sticky CTA Bar */}
      <div className="mobile-sticky-bar">
        <button
          onClick={() => handlePrimaryCTA('mobile_sticky')}
          className="mobile-sticky-cta"
          aria-label="Book enterprise architecture call"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>Book Architecture Call</span>
        </button>
        <div className="mobile-trust-badge">SOC 2 • 99.98% SLA</div>
      </div>

      <div className="enterprise-conversion-page">
        {/* Section A: Hero + Trust Spine */}
        <HeroSection onSecondaryCTA={scrollToROI} />

        {/* Section B: Pain Amplification */}
        <PainAmplification onSeeCostReport={scrollToROI} />

        {/* Section C: Value Pyramid / Enterprise Control Tower */}
        <section className="value-pyramid-section" aria-labelledby="pyramid-title">
          <div className="section-container">
            <h2 id="pyramid-title" className="section-title">
              The Enterprise Control Tower for Governed Automation
            </h2>

            <div className="pyramid-layout">
              {/* Layer 1: Apex */}
              <div className="pyramid-apex">
                <h3 className="apex-headline">
                  Command, govern, and prove ROI — without slowing the business.
                </h3>
                <p className="apex-copy">
                  Centralize AI-driven workflows across regions, departments, and channels with built-in approval flows,
                  audit logging, encryption, and compliance evidence generation. Every stakeholder — CIO, CISO, COO, CFO —
                  sees the same source of truth for cost, risk, and impact.
                </p>

                <div className="apex-outcomes">
                  <strong>So you can:</strong>
                  <ul className="apex-list">
                    <li>Show cost takeout and payback before the board meeting.</li>
                    <li>Ship automation without creating shadow IT or audit gaps.</li>
                    <li>Roll out globally without waiting for internal dev bandwidth.</li>
                  </ul>
                </div>
              </div>

              {/* Layer 2: Pillars */}
              <div className="pyramid-pillars">
                <div className="pillar-card">
                  <div className="pillar-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="pillar-title">Compliance Sprint</h4>
                  <p className="pillar-description">
                    Pre-mapped policies, SOC 2 controls, ISO 27001 alignment, data residency options, and pre-filled
                    audit evidence — so security and legal clear you fast.
                  </p>
                </div>

                <div className="pillar-card">
                  <div className="pillar-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="pillar-title">Revenue / Ops Protection</h4>
                  <p className="pillar-description">
                    Predictive guardrails and SLA-backed automation so incidents don't take systems down and you don't lose revenue uptime.
                  </p>
                </div>

                <div className="pillar-card">
                  <div className="pillar-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="pillar-title">Global Delivery Pods</h4>
                  <p className="pillar-description">
                    24/5 follow-the-sun rollout pods that sit with your teams, tune automations, and drive adoption inside each department.
                  </p>
                </div>
              </div>

              {/* Layer 3: Foundation */}
              <div className="pyramid-foundation">
                <strong>Foundation:</strong> Identity & Access (SSO, RBAC) • Full Audit Trail • Encrypted Channels (Voice, WhatsApp, Web) • API Fabric & Certified Connectors • Executive Dashboards & Forecasting
              </div>
            </div>

            <div className="pyramid-cta">
              <button
                onClick={() => {
                  trackEnterpriseEvent('value_pyramid_cta_click');
                  window.location.href = '/resources/governance-playbook';
                }}
                className="cta-primary"
              >
                Explore the Governance Playbook →
              </button>
            </div>
          </div>
        </section>

        {/* Section D: Proof Architecture / Social Proof */}
        <section className="proof-section" aria-labelledby="proof-title">
          <div className="section-container">
            <div className="stat-ribbon">
              <div className="stat-ribbon-item">
                <strong>Trusted by 612 enterprise teams</strong> — including 8 of the Fortune 50
              </div>
              <div className="stat-ribbon-item">
                <strong>$2.3B+</strong> in automation value delivered
              </div>
              <div className="stat-ribbon-item">
                <strong>4.7/5</strong> G2 Enterprise Satisfaction
              </div>
            </div>

            <h2 id="proof-title" className="section-title">Trusted by Leading Enterprises</h2>

            <div className="case-studies">
              <div className="case-study-card">
                <div className="case-study-persona">CIO / Fortune 50 Financial Services</div>
                <div className="case-study-result">
                  <strong>61% cost reduction</strong> and zero audit findings in 10 weeks
                </div>
                <p className="case-study-quote">
                  "We eliminated manual approval bottlenecks across 47 departments while maintaining full compliance visibility.
                  The board saw immediate ROI."
                </p>
                <button
                  onClick={() => trackEnterpriseEvent('case_study_view', { persona: 'CIO' })}
                  className="case-study-cta"
                >
                  Watch 3-minute breakdown →
                </button>
              </div>

              <div className="case-study-card">
                <div className="case-study-persona">VP Operations / Global Retail Chain</div>
                <div className="case-study-result">
                  <strong>94.2% inventory accuracy,</strong> automated nightly, no new headcount
                </div>
                <p className="case-study-quote">
                  "We scaled from 200 to 2,000 locations without adding ops staff. The delivery pod trained our teams in real-time."
                </p>
                <button
                  onClick={() => trackEnterpriseEvent('case_study_view', { persona: 'COO' })}
                  className="case-study-cta"
                >
                  Watch 3-minute breakdown →
                </button>
              </div>

              <div className="case-study-card">
                <div className="case-study-persona">CISO / Healthcare Network</div>
                <div className="case-study-result">
                  <strong>Passed regulatory audit</strong> with AI-driven evidence packs; <strong>6.2x ROI</strong> in 10 weeks
                </div>
                <p className="case-study-quote">
                  "Pre-filled audit evidence and SOC 2 alignment meant we cleared security review in 9 days instead of 9 months."
                </p>
                <button
                  onClick={() => trackEnterpriseEvent('case_study_view', { persona: 'CISO' })}
                  className="case-study-cta"
                >
                  Watch 3-minute breakdown →
                </button>
              </div>
            </div>

            <div className="exec-tour-cta">
              <button
                onClick={() => {
                  trackEnterpriseEvent('executive_tour_click');
                  window.location.href = '/demo/executive-tour';
                }}
                className="cta-secondary"
              >
                Watch the 6-Minute Executive Tour →
              </button>
            </div>

            <div className="analyst-strip">
              <div className="analyst-item">Named a <strong>Gartner 'Cool Vendor'</strong> in Hyperautomation (2024)</div>
              <div className="analyst-item"><strong>Customer Success NPS: 73</strong></div>
              <div className="analyst-item"><strong>Renewal Rate: 96%</strong></div>
            </div>
          </div>
        </section>

        {/* Section F: ROI Calculator */}
        <ROICalculator />

        {/* Section H: Enterprise Assurance Layer */}
        <section className="assurance-section" aria-labelledby="assurance-title">
          <div className="section-container">
            <h2 id="assurance-title" className="section-title">
              Security, Compliance, and Data Sovereignty — Guaranteed
            </h2>

            <div className="assurance-grid">
              <div className="assurance-column">
                <h3 className="assurance-column-title">Compliance & Evidence</h3>
                <ul className="assurance-list">
                  <li>SOC 2 Type II, ISO 27001, GDPR, regional data residency options</li>
                  <li>Pre-filled SIG & CAIQ, pen test vault, audit-ready evidence packs</li>
                  <li>7-year audit log retention with tamper-proof trails</li>
                </ul>
                <button
                  onClick={() => {
                    trackEnterpriseEvent('assurance_layer_expand_security_docs', { download_requested: true });
                    window.location.href = '/resources/security-package';
                  }}
                  className="cta-tertiary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Request Security Package →
                </button>
              </div>

              <div className="assurance-column">
                <h3 className="assurance-column-title">Deployment & Isolation</h3>
                <ul className="assurance-list">
                  <li>Choose SaaS, VPC, or hardened on-prem builds</li>
                  <li>Customer-managed keys and segregated data planes</li>
                  <li>Dual-approver workflows stop rogue automations before they launch</li>
                </ul>
              </div>

              <div className="assurance-column">
                <h3 className="assurance-column-title">SLA & Guarantees</h3>
                <ul className="assurance-list">
                  <li><strong>99.98% SLA uptime</strong> with double-credit guarantee</li>
                  <li><strong>Deployment in 45 days</strong> or we fund additional services to close the gap</li>
                  <li><strong>24/7 named architect</strong> responds in &lt;15 minutes</li>
                </ul>
                <a href="/status" target="_blank" rel="noopener noreferrer" className="status-link">
                  View live status →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section G: Pricing / TCO Comparison */}
        <section className="pricing-comparison-section" aria-labelledby="pricing-title">
          <div className="section-container">
            <h2 id="pricing-title" className="section-title">
              Predictable Spend. Guaranteed Payback.
            </h2>

            <div className="comparison-grid">
              <div className="comparison-column">
                <h3 className="comparison-title">Status Quo (Manual Ops)</h3>
                <ul className="comparison-list negative">
                  <li>Redundant headcount to chase repetitive tickets</li>
                  <li>Audit prep = 280+ hours/month of manual evidence gathering</li>
                  <li>Compliance incidents average 9+/quarter</li>
                  <li>No centralized visibility for cost or risk</li>
                </ul>
              </div>

              <div className="comparison-column">
                <h3 className="comparison-title">Build In-House</h3>
                <ul className="comparison-list warning">
                  <li><strong>$6.8M+/year</strong> in engineering, security, and 24/7 support staffing</li>
                  <li><strong>12–18 month</strong> internal delivery timeline before first value</li>
                  <li>Ongoing maintenance sits on already overloaded teams</li>
                  <li>No compliance pre-mapping or audit evidence automation</li>
                </ul>
              </div>

              <div className="comparison-column highlight">
                <h3 className="comparison-title">Artifically Governed Automation</h3>
                <ul className="comparison-list positive">
                  <li><strong>Live in 45 days</strong> or we fund extra services to close the gap</li>
                  <li>Pre-filled compliance evidence, SOC 2, ISO 27001, GDPR-ready from day one</li>
                  <li>White-glove delivery pod, 24/5 follow-the-sun, guaranteed SLA 99.98%</li>
                  <li>Typical <strong>10-14 week payback</strong> with board-ready ROI tracking</li>
                </ul>
              </div>
            </div>

            <div className="pricing-ctas">
              <button onClick={scrollToROI} className="cta-secondary">
                Run Your ROI Scenario →
              </button>
              <button
                onClick={() => {
                  trackEnterpriseEvent('finance_cta_click');
                  window.location.href = '/contact?type=enterprise-proposal';
                }}
                className="cta-primary"
              >
                Request Enterprise Plus Proposal →
              </button>
            </div>
          </div>
        </section>

        {/* Section I: Final CTA with Urgency */}
        <section className="final-cta-section" aria-labelledby="final-cta-title">
          <div className="section-container">
            <h2 id="final-cta-title" className="final-cta-headline">
              Secure Your Q4 Deployment Window
            </h2>
            <p className="final-cta-subheadline">
              White-glove onboarding pods accept a limited number of enterprise rollouts per quarter to guarantee time-to-value.
            </p>

            <div className="final-stat-strip">
              <div className="final-stat">
                <div className="final-stat-value">98%</div>
                <div className="final-stat-label">of customers live in &lt;6 weeks</div>
              </div>
              <div className="final-stat">
                <div className="final-stat-value">NPS 73</div>
                <div className="final-stat-label">with named architect support</div>
              </div>
              <div className="final-stat">
                <div className="final-stat-value">96%</div>
                <div className="final-stat-label">renewal rate across enterprise accounts</div>
              </div>
            </div>

            <div className="final-cta-cluster">
              <button
                onClick={() => handlePrimaryCTA('Secure Deployment Slot')}
                className="cta-primary pulsing"
              >
                Secure Your Deployment Slot →
              </button>
              <button
                onClick={() => {
                  trackEnterpriseEvent('final_cta_click', { variant: 'Procurement Pack' });
                  window.location.href = '/resources/procurement-pack';
                }}
                className="cta-secondary"
              >
                Access Procurement Readiness Pack →
              </button>
              <button
                onClick={() => {
                  trackEnterpriseEvent('final_cta_click', { variant: 'Executive Tour' });
                  window.location.href = '/demo/executive-tour';
                }}
                className="cta-tertiary"
              >
                Watch the 6-Minute Executive Tour →
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
