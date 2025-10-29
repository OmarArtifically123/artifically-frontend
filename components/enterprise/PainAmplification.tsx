"use client";

import { trackEnterpriseEvent } from "@/lib/enterprise-analytics";

interface PainAmplificationProps {
  onSeeCostReport: () => void;
}

export default function PainAmplification({ onSeeCostReport }: PainAmplificationProps) {
  const handleCTA = () => {
    trackEnterpriseEvent('pain_cta_click');
    onSeeCostReport();
  };

  return (
    <section className="pain-section" aria-labelledby="pain-title">
      <div className="pain-container">
        <h2 id="pain-title" className="pain-headline">
          Manual Enterprise Ops Are Your Biggest Hidden Tax
        </h2>
        
        <div className="pain-grid">
          <div className="pain-content">
            <p className="pain-copy">
              Every quarter you burn millions in repetitive workflows, expose compliance to avoidable risk, 
              and stall strategic launches. Typical global ops teams are still paying for human review loops, 
              manual approvals, and swivel-chair data entry — and those costs compound. Meanwhile, competitors 
              are already redeploying headcount toward AI-assisted work and reporting those savings to their boards.
            </p>
            
            <div className="pain-bullets">
              <div className="pain-bullet">
                <div className="pain-icon warning">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="pain-text">
                  <strong>$11.4M annual labor</strong> tied up in repetitive workflows that should be automated.
                </div>
              </div>
              
              <div className="pain-bullet">
                <div className="pain-icon warning">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="pain-text">
                  <strong>9+ compliance review incidents</strong> per quarter caused by manual checks and untracked approvals.
                </div>
              </div>
              
              <div className="pain-bullet">
                <div className="pain-icon warning">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="pain-text">
                  <strong>6–18 month procurement delays</strong> every time you rely on manual processes at scale.
                </div>
              </div>
            </div>
          </div>
          
          <div className="pain-visual">
            <div className="cost-timeline">
              <div className="timeline-title">Cost to Wait</div>
              <div className="timeline-item">
                <div className="timeline-period">1 Quarter Delay</div>
                <div className="timeline-cost">$2.85M wasted</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-period">2 Quarters Delay</div>
                <div className="timeline-cost">$5.7M wasted</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-period">4 Quarters Delay</div>
                <div className="timeline-cost">$11.4M wasted</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pain-cta-wrapper">
          <button onClick={handleCTA} className="cta-secondary cta-amber">
            See Your Risk Report →
          </button>
        </div>
      </div>
    </section>
  );
}
