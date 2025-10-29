"use client";

import { trackEnterpriseEvent } from "@/lib/enterprise-analytics";

interface HeroSectionProps {
  onSecondaryCTA: () => void;
}

export default function HeroSection({ onSecondaryCTA }: HeroSectionProps) {
  const handlePrimaryCTA = (context: string) => {
    trackEnterpriseEvent('hero_primary_cta_click', { context });
    window.location.href = '/contact?type=enterprise-architecture';
  };

  const handleTertiaryCTA = (asset: string) => {
    trackEnterpriseEvent('hero_tertiary_cta_click', { asset });
    window.location.href = `/resources/security-brief?download=true`;
  };

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-preheadline">
            Trusted by 600+ Fortune 2000 Ops, IT, and Security Teams
          </p>
          
          <h1 id="hero-title" className="hero-headline">
            Eliminate 70% of Manual Ops in 90 Days with Audit-Proof AI Automation
          </h1>
          
          <p className="hero-subheadline">
            Built for CIOs, COOs, and CISOs who need governed automation that survives every board 
            and regulator review — delivered with a dedicated deployment pod and a 99.98% SLA.
          </p>
          
          <div className="hero-proof-strip" role="list" aria-label="Key metrics">
            <div className="proof-item" role="listitem">
              <span className="proof-value">$2.3B+</span>
              <span className="proof-label">in automated value delivered</span>
            </div>
            <div className="proof-item" role="listitem">
              <span className="proof-value">98%</span>
              <span className="proof-label">of customers live in &lt;6 weeks</span>
            </div>
            <div className="proof-item" role="listitem">
              <span className="proof-value">4.7/5</span>
              <span className="proof-label">G2 Enterprise</span>
            </div>
            <div className="proof-item" role="listitem">
              <span className="proof-value">SOC 2, ISO 27001</span>
              <span className="proof-label">GDPR-ready</span>
            </div>
          </div>
          
          <div className="hero-logo-belt" role="list" aria-label="Customer categories">
            <div className="logo-category" role="listitem">Fortune 50 Financial Services</div>
            <div className="logo-category" role="listitem">Global Retail Chain</div>
            <div className="logo-category" role="listitem">Government Services</div>
            <div className="logo-category" role="listitem">Healthcare Network</div>
          </div>
          
          <div className="hero-cta-cluster" role="group" aria-label="Call to action options">
            <button
              onClick={() => handlePrimaryCTA('hero')}
              className="cta-primary"
            >
              Book Enterprise Architecture Call →
            </button>
            
            <button
              onClick={onSecondaryCTA}
              className="cta-secondary"
            >
              Run Your ROI Scenario
            </button>
            
            <button
              onClick={() => handleTertiaryCTA('security_brief')}
              className="cta-tertiary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Download Security Brief (SOC 2, ISO, Data Residency)
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="dashboard-mockup" role="img" aria-label="Executive dashboard showing cost savings, SLA uptime, and compliance">
            <div className="dashboard-header">
              <div className="dashboard-title">Executive Control Tower</div>
              <div className="dashboard-status">
                <span className="status-indicator live"></span>
                Live
              </div>
            </div>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-label">Cost Savings (YTD)</div>
                <div className="stat-value">$8.4M</div>
                <div className="stat-change positive">+127% vs manual</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">SLA Uptime</div>
                <div className="stat-value">99.99%</div>
                <div className="stat-change positive">Above guarantee</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Compliance Events</div>
                <div className="stat-value">0</div>
                <div className="stat-change positive">Zero audit findings</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Guardrails</div>
                <div className="stat-value">1,247</div>
                <div className="stat-change">Preventing incidents</div>
              </div>
            </div>
            <div className="compliance-stamps">
              <div className="compliance-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>SOC 2 Type II</span>
              </div>
              <div className="compliance-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>ISO 27001</span>
              </div>
              <div className="compliance-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
