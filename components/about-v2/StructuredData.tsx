export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://artifically.com/about#aboutpage",
        "url": "https://artifically.com/about",
        "name": "From AI Pilots to Proof | About Artifically",
        "description": "End AI theater. Ship outcomes. Learn how Artifically turns enterprise AI pilots into production systems that deliver measurable business impact in weeks, not quarters.",
        "datePublished": "2024-01-01T00:00:00Z",
        "dateModified": new Date().toISOString(),
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://artifically.com/images/about/hero-og.png",
          "width": 1200,
          "height": 630
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://artifically.com"
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": "About",
              "item": "https://artifically.com/about"
            }
          ]
        },
        "isPartOf": {
          "@type": "WebSite",
          "name": "Artifically",
          "url": "https://artifically.com"
        },
        "author": {
          "@type": "Organization",
          "name": "Artifically"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://artifically.com#organization",
        "name": "Artifically",
        "legalName": "Artifically, Inc.",
        "url": "https://artifically.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://artifically.com/images/logo.png",
          "width": 400,
          "height": 100
        },
        "foundingDate": "2021-03-01",
        "description": "Enterprise AI infrastructure platform that turns pilots into production systems with security-first deployment, outcome tracking, and governed rollouts.",
        "slogan": "End AI Theater. Ship Outcomes.",
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "minValue": 10,
          "maxValue": 50
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "addressCountry": "US"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123",
            "contactType": "sales",
            "availableLanguage": "English"
          },
          {
            "@type": "ContactPoint",
            "email": "support@artifically.com",
            "contactType": "customer service",
            "availableLanguage": "English"
          }
        ],
        "sameAs": [
          "https://linkedin.com/company/artifically",
          "https://twitter.com/artifically",
          "https://github.com/artifically"
        ],
        "founder": [
          {
            "@type": "Person",
            "name": "Sarah Chen",
            "jobTitle": "Co-founder & CEO",
            "description": "Former Google Cloud ML platforms engineer focused on enterprise AI infrastructure",
            "sameAs": "https://linkedin.com/in/sarahchen"
          },
          {
            "@type": "Person", 
            "name": "Marcus Rodriguez",
            "jobTitle": "Co-founder & CTO",
            "description": "Former Stripe ML infrastructure architect specializing in production deployments",
            "sameAs": "https://linkedin.com/in/marcusrodriguez"
          }
        ],
        "knowsAbout": [
          "Artificial Intelligence",
          "Machine Learning",
          "Enterprise Software",
          "Security Compliance",
          "SOC 2",
          "AI Deployment",
          "Production Systems"
        ],
        "areaServed": {
          "@type": "Place",
          "name": "Global"
        },
        "serviceType": "AI Infrastructure Platform",
        "award": [
          "Gartner Magic Quadrant Visionary 2024",
          "Forbes AI Infrastructure Company to Watch 2023"
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
