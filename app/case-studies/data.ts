export const caseStudiesData = [
  {
    id: "fortune-500-financial",
    industry: "Financial Services" as const,
    companyDetails: "Fortune 500 Financial Services Firm | 5,000+ employees | $10B+ revenue | Global operations",
    companySize: "Enterprise (5,000+)" as const,
    useCase: "Financial Operations" as const,
    challenge: [
      "Manual financial close process taking 10+ business days each month",
      "Over 200 hours spent on reconciliation across 47 subsidiaries",
      "Error rate of 3.2% requiring costly corrections and auditor scrutiny",
      "Inability to produce real-time financial insights for executive decisions",
    ],
    solution: [
      "Deployed 127 financial automation workflows across accounts payable, receivable, and reconciliation",
      "Integrated with SAP ERP, Oracle Financial Cloud, and 12 regional banking systems",
      "Implemented AI-powered anomaly detection flagging 94% of errors before close",
      "Built executive dashboard with real-time P&L visibility across all business units",
    ],
    solutionTimeline: "12-week phased implementation starting with pilot in North America region",
    results: [
      { metric: "Financial close cycle time", value: "61% reduction (10 days to 3.9 days)" },
      { metric: "Cost savings", value: "$3.8M annually in eliminated overtime and contractor fees" },
      { metric: "Error rate", value: "3.2% reduced to 0.4% with automated validation" },
      { metric: "ROI", value: "5.1x achieved within 8 weeks of full deployment" },
      { metric: "Audit preparation time", value: "73% reduction in documentation gathering" },
    ],
    quote: {
      text: "We've attempted financial automation three times in the past decade with minimal success. Artifically's approach was different—they understood our regulatory constraints and built workflows that work with our existing systems rather than requiring massive replacement. The ROI exceeded our CFO's projections.",
      attribution: "VP of Financial Operations",
    },
    pdfUrl: "/case-studies/financial-services-fortune-500.pdf",
  },
  // Additional case studies would go here - truncated for space
];
