import type {
  Automation,
  PlatformTier,
  FAQItem,
  Testimonial,
  TrustBadge,
} from "./types-v2";

export const AUTOMATIONS: Automation[] = [
  {
    id: "ai_receptionist",
    name: "AI Receptionist",
    priceMonthly: 299,
    includedVolume: 1000,
    volumeUnit: "inbound interactions",
    roiStatement: "Cuts missed calls by 15% in first 30 days.",
    overageRate: 0.02,
    details: [
      "Handles voice calls in Arabic + English",
      "Routes to human agents when needed",
      "Books appointments, qualifies leads",
      "Integrates with CRM (HubSpot, Salesforce, Zoho)",
    ],
    channels: ["Voice"],
  },
  {
    id: "whatsapp_agent",
    name: "WhatsApp Agent",
    priceMonthly: 199,
    includedVolume: 1500,
    volumeUnit: "messages",
    roiStatement: "Reply in 12 seconds, even at 2am — reclaim 8 hours/week.",
    overageRate: 0.015,
    details: [
      "Auto-respond to WhatsApp Business messages",
      "Arabic + English conversational AI",
      "Send appointment reminders, follow-ups",
      "Integrates with WhatsApp Business API",
    ],
    channels: ["WhatsApp"],
  },
  {
    id: "web_chat_agent",
    name: "Web Chat Agent",
    priceMonthly: 149,
    includedVolume: 2000,
    volumeUnit: "chat sessions",
    roiStatement: "Cuts first-response time ~60% — convert more browsers to leads.",
    overageRate: 0.01,
    details: [
      "Embed on website, no code required",
      "Bilingual (Arabic + English)",
      "Lead capture + CRM sync",
      "Escalates to human chat when needed",
    ],
    channels: ["Web"],
  },
  {
    id: "voice_agent_outbound",
    name: "Voice Agent (Outbound)",
    priceMonthly: 349,
    includedVolume: 500,
    volumeUnit: "outbound calls",
    roiStatement: "Automate follow-ups, reminders, confirmations — save 12 hours/week.",
    overageRate: 0.4,
    details: [
      "Make outbound calls from your number",
      "Arabic + English voice synthesis",
      "Appointment reminders, payment follow-ups, surveys",
      "Logs call outcomes in CRM",
    ],
    channels: ["Voice"],
  },
  {
    id: "appointment_booker",
    name: "Appointment Booker",
    priceMonthly: 179,
    includedVolume: 1000,
    volumeUnit: "booking requests",
    roiStatement: "Eliminate double-bookings, reclaim front-desk time — handle 3x more bookings.",
    overageRate: 0.02,
    details: [
      "Syncs with Google Calendar, Outlook, Calendly",
      "Arabic + English booking flows",
      "SMS/WhatsApp/Email confirmations",
      "Reschedule/cancel automation",
    ],
    channels: ["Voice", "WhatsApp", "Web"],
  },
  {
    id: "lead_qualifier",
    name: "Lead Qualifier",
    priceMonthly: 129,
    includedVolume: 1500,
    volumeUnit: "leads",
    roiStatement: "Score and route leads in <60 seconds — sales focuses on high-intent only.",
    overageRate: 0.01,
    details: [
      "Ask qualifying questions via chat/voice/WhatsApp",
      "Lead scoring + routing rules",
      "CRM sync (tags, pipeline stage)",
      "Arabic + English support",
    ],
    channels: ["Voice", "WhatsApp", "Web"],
  },
];

export const PLATFORM_TIERS: PlatformTier[] = [
  {
    id: "scale",
    name: "Scale",
    positioningStatement: "Org-wide governance, 24/7 hotline, and department-level analytics.",
    priceMonthly: 849,
    priceAnnual: 699,
    badge: "Full governance & 24/7 hotline",
    isPriceAnchor: true,
    limits: {
      maxAutomations: "unlimited",
      includedInteractions: 100000,
      overageRate: 0.015,
    },
    support: {
      sla: "<1h response 24/7 hotline",
      description: "Dedicated success architect",
    },
    security: [
      "SSO (SAML, OAuth, Google, Microsoft)",
      "Full audit trail + retention policies",
      "Data residency options (Middle East, EU, US)",
      "SOC2 in progress, ISO27001 alignment",
    ],
    governance: [
      "Advanced RBAC (custom roles)",
      "Advanced approval routing (multi-stage)",
      "Department-level analytics + cost allocation",
      "Custom workflow guardrails",
    ],
    channels: ["Voice", "WhatsApp", "Web", "SMS"],
    languages: ["Arabic", "English", "Custom available"],
    ctaLabel: "Book white-glove rollout",
    ctaUrl: "/contact?tier=scale",
    ctaMicrocopy: "Dedicated squad walks you through setup. Typically live in 1 week.",
    features: {
      deployment: [
        "SSO (SAML, OAuth)",
        "Full audit trail + retention",
        "Data residency (ME, EU, US)",
        "White-glove rollout squad",
      ],
      volume: [
        "Unlimited automations",
        "100K interactions/mo included",
        "$0.015/event overage",
        "Burst credits for spikes",
      ],
      governance: [
        "Advanced RBAC",
        "Multi-stage approvals",
        "Dept-level analytics",
        "Custom guardrails",
      ],
      support: [
        "<1h response (24/7 hotline)",
        "Dedicated architect",
        "Video + live chat 24/7",
        "Quarterly business reviews",
      ],
      localization: [
        "Voice/WhatsApp/Web/SMS",
        "Arabic + English",
        "Custom languages available",
      ],
    },
  },
  {
    id: "growth",
    name: "Growth",
    positioningStatement: "Scale across teams with governance, priority support, and audit trails.",
    priceMonthly: 359,
    priceAnnual: 299,
    badge: "RECOMMENDED — Most popular for multi-location ops",
    isRecommended: true,
    limits: {
      maxAutomations: 5,
      includedInteractions: 10000,
      overageRate: 0.02,
    },
    support: {
      sla: "<2h priority response",
      description: "Success architect (onboarding + quarterly check-ins)",
    },
    security: [
      "SSO (Google, Microsoft)",
      "Full audit trail",
      "GDPR-ready + SOC2 alignment",
    ],
    governance: [
      "Role-based permissions (admin, user, viewer)",
      "Basic approval routing",
      "Team-level analytics",
    ],
    channels: ["Voice", "WhatsApp", "Web"],
    languages: ["Arabic", "English"],
    ctaLabel: "Build your bundle",
    ctaUrl: "#bundle-builder",
    ctaMicrocopy: "Most popular for multi-location operations. Upgrade/downgrade anytime.",
    features: {
      deployment: [
        "SSO (Google, Microsoft)",
        "Full audit trail",
        "GDPR + SOC2 alignment",
        "Priority deploy (24-72h w/ architect)",
      ],
      volume: [
        "Up to 5 automations",
        "10K interactions/mo included",
        "$0.02/event overage",
        "Auto-pause or auto-scale",
      ],
      governance: [
        "RBAC (admin, user, viewer)",
        "Basic approval routing",
        "Team-level analytics",
      ],
      support: [
        "<2h engineer response",
        "Success architect",
        "Live chat (business hours)",
      ],
      localization: [
        "Voice/WhatsApp/Web",
        "Arabic + English",
        "Multilingual AI",
      ],
    },
  },
  {
    id: "essentials",
    name: "Essentials",
    positioningStatement: "Validate ROI fast with one automation and basic support.",
    priceMonthly: 119,
    priceAnnual: 99,
    limits: {
      maxAutomations: 1,
      includedInteractions: 1000,
      overageRate: 0.025,
    },
    support: {
      sla: "Email next-business-day",
      description: "Knowledge base + community",
    },
    security: ["Standard TLS/SSL encryption", "GDPR-ready data handling"],
    governance: ["Single-user (1 admin)", "Basic analytics dashboard"],
    channels: ["Voice OR WhatsApp OR Web (choose 1)"],
    languages: ["Arabic", "English"],
    ctaLabel: "Start 3-day pilot",
    ctaUrl: "/signup?pilot=true&tier=essentials",
    ctaMicrocopy: "Test 1 automation with real data. No credit card.",
    features: {
      deployment: [
        "Standard TLS/SSL",
        "GDPR-ready",
        "Email support next-day",
        "Deploy in 24-48h",
      ],
      volume: [
        "1 automation",
        "1K interactions/mo included",
        "$0.025/event overage",
        "Auto-pause at cap (optional)",
      ],
      governance: [
        "Single admin",
        "Basic analytics (volume, resolution)",
      ],
      support: [
        "Email next-business-day",
        "Knowledge base",
        "Community forum",
      ],
      localization: [
        "Choose 1 channel",
        "Arabic + English",
      ],
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    positioningStatement: "Private deployment, data residency, custom SLAs, and procurement-ready contracts.",
    badge: "Private/VPC deployment available",
    limits: {
      maxAutomations: "unlimited",
      includedInteractions: Infinity,
      overageRate: 0, // Custom pricing
    },
    support: {
      sla: "<30min response 24/7",
      description: "Dedicated regional squad",
    },
    security: [
      "Private/VPC deployment",
      "Custom data residency (any region)",
      "Security review + pen-test support",
      "Custom SLAs (e.g., 99.95% uptime)",
      "SOC2, ISO27001, HIPAA alignment",
    ],
    governance: [
      "Custom RBAC",
      "Custom approval workflows",
      "7-year audit retention",
      "Region/dept segmentation",
    ],
    channels: ["Voice", "WhatsApp", "Web", "SMS", "Email"],
    languages: ["Arabic", "English", "Custom languages"],
    ctaLabel: "Talk to deployment lead",
    ctaUrl: "/contact?tier=enterprise",
    ctaMicrocopy: "Security + procurement typically wraps in 2–4 weeks. Let's start the conversation.",
    features: {
      deployment: [
        "Private/VPC deployment",
        "Custom data residency",
        "Security review + pen-test",
        "Custom SLAs",
        "Compliance (SOC2, ISO, HIPAA)",
      ],
      volume: [
        "Unlimited automations",
        "Unlimited interactions (or custom cap)",
        "Custom overage (volume discounts)",
        "Dedicated infrastructure",
      ],
      governance: [
        "Custom RBAC",
        "Custom workflows",
        "7-year audit retention",
        "Region/dept segmentation",
      ],
      support: [
        "<30min 24/7 response",
        "Dedicated regional squad",
        "Custom training + workshops",
        "Executive QBRs",
      ],
      localization: [
        "All channels + email",
        "Arabic/English + custom",
        "Custom integrations (SAP, Oracle)",
      ],
    },
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "change_plans",
    question: "Can I change plans later?",
    answer:
      "Yes. You can upgrade or downgrade your platform tier anytime. Upgrades are prorated instantly — you only pay the difference. Downgrades take effect at your next billing cycle. You can also add or remove automations anytime with no penalties.",
  },
  {
    id: "hit_limit",
    question: "What happens if I hit my monthly interaction limit?",
    answer:
      "You have two options (configurable in settings):\n\n1. **Auto-overage**: We charge $0.02/event (or your tier's overage rate) and keep everything running.\n2. **Auto-pause**: We pause new interactions and alert you. You can manually unpause or upgrade.\n\nYou'll get alerts at 80% and 95% of your limit so you're never surprised.",
  },
  {
    id: "pilot",
    question: "What is the 'pilot' and how does it work?",
    answer:
      "The pilot is a 3-day or 7-day guided deployment of 1–2 automations with capped volume (e.g., 300 interactions). It's NOT a fake sandbox — you're using production behavior with real data.\n\nYou'll work with a success architect to:\n- Pick 1–2 automations\n- Connect your channels (phone, WhatsApp, etc.)\n- Test real conversations\n- See real outcomes (missed calls, response time, etc.)\n\nAfter the pilot, you can convert to a paid plan or walk away. No credit card required to start.",
  },
  {
    id: "refunds",
    question: "Do you offer refunds?",
    answer:
      "Yes. If we miss our agreed SLA (uptime, response time, etc.) in your first 30 days, we'll refund that month. If you're not happy with the product itself, talk to your success architect — we'll work with you to fix it or part ways cleanly.",
  },
  {
    id: "go_live_speed",
    question: "How fast can I go live?",
    answer:
      "Most customers deploy in 24–72 hours. Essentials and Growth tiers can go live same day if you're ready. Scale tier typically launches within 1 week with white-glove rollout. Enterprise timelines depend on security review and compliance requirements (typically 2–4 weeks).",
  },
  {
    id: "support",
    question: "How does support work?",
    answer:
      "- **Essentials**: Email support, next-business-day response, knowledge base access\n- **Growth**: <2h engineer response (priority queue), success architect, live chat during business hours\n- **Scale**: <1h response on 24/7 hotline, dedicated architect, video + live chat 24/7, quarterly business reviews\n- **Enterprise**: <30min response 24/7, dedicated regional squad, custom training, executive QBRs",
  },
  {
    id: "compliance",
    question: "Are you compliant?",
    answer:
      "Yes. We're SOC2 in progress, GDPR-ready, with audit logging, data residency options, SSO, and approval routing built-in. Growth+ tiers include compliance alignment support. Enterprise tier supports custom compliance requirements (e.g., Saudi NDMO, UAE TDRA, HIPAA, ISO27001). Ask for our compliance one-pager.",
  },
  {
    id: "billing_multiple",
    question: "How do you bill multiple automations?",
    answer:
      "Each automation has its own price (e.g., AI Receptionist $299/mo), and you pay one shared platform tier fee (e.g., Growth $299/mo). Everything appears on one invoice. You can add or remove automations anytime and the invoice adjusts automatically.",
  },
  {
    id: "arabic",
    question: "Do you work in Arabic?",
    answer:
      "Yes. Arabic + English are fully supported in both the UI and human support. Our conversational AI is bilingual and handles Arabic dialects. This is a key differentiator vs. global platforms like Make, Zapier, or n8n — we're regionalized and deployment-led, not DIY.",
  },
  {
    id: "need_engineers",
    question: "Do I need engineers?",
    answer:
      "No. We deploy with you. You choose which automations you want, we connect your channels (phone numbers, WhatsApp Business API, website chat), and you're live. No coding required. For Enterprise custom integrations, we handle the technical work.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "clinic_riyadh",
    quote:
      "We cut missed calls by 15% in the first 30 days. Patients can actually reach us now, even during lunch rush.",
    author: "Dr. Hala S.",
    title: "Multi-Specialty Clinic",
    location: "Riyadh",
    metricBadge: "15% fewer missed calls",
  },
  {
    id: "real_estate_dubai",
    quote:
      "Our WhatsApp response time dropped from 4 hours to 12 seconds. Listings get inquiries at 2am and we're replying before the buyer moves on.",
    author: "Ahmed K.",
    title: "Real Estate Brokerage",
    location: "Dubai",
    metricBadge: "12-second avg response",
  },
  {
    id: "logistics_jeddah",
    quote:
      "We scaled to 4 channels without hiring a night shift. The voice agent handles Arabic and English calls equally well.",
    author: "Fatima R.",
    title: "Logistics Coordinator",
    location: "Jeddah",
    metricBadge: "4 channels, zero night shift",
  },
];

export const TRUST_BADGES: TrustBadge[] = [
  { id: "uptime", label: "99.9% uptime", icon: "check-circle" },
  { id: "gdpr", label: "GDPR-ready", icon: "shield" },
  { id: "soc2", label: "SOC2 in progress", icon: "lock" },
  { id: "audit_sso", label: "Audit log & SSO", icon: "file-text" },
  { id: "data_residency", label: "Data residency available", icon: "globe" },
  { id: "languages", label: "Arabic + English support", icon: "message-circle" },
  { id: "hotline", label: "24/7 hotline on Scale+", icon: "phone" },
  { id: "no_cc", label: "No credit card for pilot", icon: "credit-card-off" },
];
