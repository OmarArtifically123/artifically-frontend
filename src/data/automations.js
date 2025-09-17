// Per-automation pricing (no “all-you-can-eat” subscription).
export const automations = [
  {
    id: "ai-receptionist",
    name: "AI Receptionist",
    description:
      "Answers calls/chats, books appointments, and routes leads. Multi-channel: web, WhatsApp, phone.",
    priceMonthly: 200, // USD/month
    requestLimit: 10000,
    icon: "📞",
    tags: ["Customer Service", "Bookings", "Leads"],
    category: "customer-support",
    placeholders: [
      "businessName",
      "businessPhone",
      "businessEmail",
      "websiteUrl",
      "workingHours",   // object { mon: "9-5", ... }
      "timezone",
      "bookingLink",
      "whatsappNumber",
      "industry",
      "brandTone",
      "language",
      "location"
    ]
  },
  {
    id: "lead-scorer",
    name: "Lead Scorer & Router",
    description:
      "Scores inbound leads and routes them to the right rep. CRM integration ready.",
    priceMonthly: 250,
    requestLimit: 50000,
    icon: "🎯",
    tags: ["Sales", "CRM", "Routing"],
    category: "sales",
    placeholders: [
      "businessName",
      "crmProvider",
      "leadScoreThreshold",
      "salesSlackChannel",
      "timezone",
      "language",
      "brandTone"
    ]
  },
  {
    id: "invoice-matcher",
    name: "Invoice Matcher",
    description:
      "OCR-powered invoice matching that flags discrepancies automatically.",
    priceMonthly: 180,
    requestLimit: 12000,
    icon: "📊",
    tags: ["Finance", "OCR", "Automation"],
    category: "finance",
    placeholders: [
      "businessName",
      "accountingPlatform",
      "apEmail",
      "currency",
      "vendorList",
      "language",
      "timezone"
    ]
  },
  {
    id: "review-responder",
    name: "Review Responder",
    description:
      "Monitors & replies to online reviews with on-brand responses.",
    priceMonthly: 120,
    requestLimit: 20000,
    icon: "⭐",
    tags: ["Marketing", "Brand", "Reputation"],
    category: "marketing",
    placeholders: [
      "businessName",
      "brandTone",
      "industry",
      "reviewPlatforms",
      "language"
    ]
  },
  {
    id: "trend-radar",
    name: "Daily Trend Radar",
    description:
      "Aggregates industry trends into an executive morning brief.",
    priceMonthly: 160,
    requestLimit: 15000,
    icon: "📡",
    tags: ["Analytics", "Intelligence"],
    category: "analytics",
    placeholders: [
      "businessName",
      "industry",
      "sources",
      "sendAtLocalTime",
      "language",
      "timezone",
      "emailsToNotify"
    ]
  },
  {
    id: "cart-recovery",
    name: "Cart Recovery Bot",
    description:
      "Personalized cart recovery emails/WhatsApp messages to boost revenue.",
    priceMonthly: 140,
    requestLimit: 30000,
    icon: "🛒",
    tags: ["E-commerce", "Messaging", "Revenue"],
    category: "ecommerce",
    placeholders: [
      "businessName",
      "ecommercePlatform",
      "brandTone",
      "discountCode",
      "language",
      "timezone",
      "whatsappNumber",
      "emailSender"
    ]
  }
];
