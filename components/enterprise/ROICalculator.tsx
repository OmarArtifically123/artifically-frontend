"use client";

import { useState, useMemo, useId } from "react";
import { trackEnterpriseEvent } from "@/lib/enterprise-analytics";

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    industry: 'financial_services',
    annualTransactions: 500000,
    costPerInteraction: 12,
    complianceIncidents: 9
  });

  const industryId = useId();
  const transactionsId = useId();
  const costId = useId();
  const incidentsId = useId();

  const results = useMemo(() => {
    const { annualTransactions, costPerInteraction, complianceIncidents } = inputs;
    
    const annualManualOpsCost = annualTransactions * costPerInteraction;
    const complianceRiskCost = complianceIncidents * 250000;
    const totalWaste = annualManualOpsCost + complianceRiskCost;
    const estimatedSavings = totalWaste * 0.70;
    
    const monthlyPrice = annualTransactions < 250000 ? 8000 :
                        annualTransactions < 1000000 ? 12000 : 18000;
    const annualCost = monthlyPrice * 12;
    
    const netSavings = estimatedSavings - annualCost;
    const roiMultiple = estimatedSavings / annualCost;
    const paybackWeeks = Math.max(1, Math.round((annualCost / estimatedSavings) * 52));
    
    return {
      estimatedSavings: Math.round(estimatedSavings),
      netSavings: Math.round(netSavings),
      roiMultiple: Math.round(roiMultiple * 10) / 10,
      paybackWeeks,
      monthlyPrice,
      annualCost
    };
  }, [inputs]);

  const handleInputChange = (field: string, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    trackEnterpriseEvent('roi_calculator_complete', {
      estimated_savings: results.estimatedSavings,
      payback_weeks: results.paybackWeeks,
      projected_roi_multiple: results.roiMultiple
    });
  };

  const handleDownload = () => {
    trackEnterpriseEvent('roi_calculator_download_business_case', {
      email_submitted: true,
      estimated_savings: results.estimatedSavings
    });
    alert('Board-ready business case download would open here (gated lead capture form)');
  };

  return (
    <section id="roi-calculator" className="roi-section" aria-labelledby="roi-title">
      <div className="roi-container">
        <h2 id="roi-title" className="section-title">Run Your ROI Scenario</h2>
        <p className="section-subtitle">
          See your estimated OpEx reduction, payback window, and projected ROI in seconds
        </p>
        
        <div className="roi-calculator">
          <div className="roi-inputs">
            <div className="roi-input-group">
              <label htmlFor={industryId} className="roi-label">Industry / Vertical</label>
              <select
                id={industryId}
                value={inputs.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="roi-select"
              >
                <option value="financial_services">Financial Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="government">Government</option>
                <option value="technology">Technology</option>
              </select>
            </div>
            
            <div className="roi-input-group">
              <label htmlFor={transactionsId} className="roi-label">
                Annual workflows handled manually
                <span className="roi-value-display">{inputs.annualTransactions.toLocaleString()}</span>
              </label>
              <input
                id={transactionsId}
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={inputs.annualTransactions}
                onChange={(e) => handleInputChange('annualTransactions', Number(e.target.value))}
                className="roi-slider"
              />
            </div>
            
            <div className="roi-input-group">
              <label htmlFor={costId} className="roi-label">
                Average cost per manual interaction ($)
                <span className="roi-value-display">${inputs.costPerInteraction}</span>
              </label>
              <input
                id={costId}
                type="range"
                min="5"
                max="50"
                step="1"
                value={inputs.costPerInteraction}
                onChange={(e) => handleInputChange('costPerInteraction', Number(e.target.value))}
                className="roi-slider"
              />
            </div>
            
            <div className="roi-input-group">
              <label htmlFor={incidentsId} className="roi-label">
                Compliance incidents per quarter
                <span className="roi-value-display">{inputs.complianceIncidents}</span>
              </label>
              <input
                id={incidentsId}
                type="range"
                min="0"
                max="30"
                step="1"
                value={inputs.complianceIncidents}
                onChange={(e) => handleInputChange('complianceIncidents', Number(e.target.value))}
                className="roi-slider"
              />
            </div>
          </div>
          
          <div className="roi-results">
            <div className="roi-result-card primary">
              <div className="roi-result-label">Estimated OpEx Reduction (12 months)</div>
              <div className="roi-result-value">${results.estimatedSavings.toLocaleString()}</div>
            </div>
            
            <div className="roi-result-card">
              <div className="roi-result-label">Payback Window</div>
              <div className="roi-result-value">{results.paybackWeeks} weeks</div>
            </div>
            
            <div className="roi-result-card">
              <div className="roi-result-label">Projected ROI</div>
              <div className="roi-result-value">{results.roiMultiple}×</div>
            </div>
            
            <div className="roi-result-card">
              <div className="roi-result-label">Net Savings (Year 1)</div>
              <div className="roi-result-value">${results.netSavings.toLocaleString()}</div>
            </div>
            
            <button onClick={handleDownload} className="cta-primary">
              Get Board-Ready Business Case PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
