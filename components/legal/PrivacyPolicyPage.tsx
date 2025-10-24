"use client";

import Link from "next/link";
import { space } from "@/styles/spacing";

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 24, 2024";

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, maxWidth: "900px" }}>
      {/* Header */}
      <header style={{ marginBottom: space("xl"), paddingBottom: space("lg"), borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1rem" }}>
          Last Updated: {lastUpdated}
        </p>
      </header>

      {/* Table of Contents */}
      <nav
        className="glass"
        style={{
          padding: space("lg"),
          borderRadius: "14px",
          marginBottom: space("xl"),
        }}
      >
        <h2 style={{ fontSize: "1.3rem", marginBottom: space("md") }}>Table of Contents</h2>
        <ol style={{ paddingLeft: space("md"), display: "grid", gap: space("xs", 0.75) }}>
          <li><a href="#introduction" style={{ color: "var(--primary)", textDecoration: "none" }}>Introduction</a></li>
          <li><a href="#information-collected" style={{ color: "var(--primary)", textDecoration: "none" }}>Information We Collect</a></li>
          <li><a href="#how-we-use" style={{ color: "var(--primary)", textDecoration: "none" }}>How We Use Your Information</a></li>
          <li><a href="#data-sharing" style={{ color: "var(--primary)", textDecoration: "none" }}>Data Sharing and Disclosure</a></li>
          <li><a href="#cookies" style={{ color: "var(--primary)", textDecoration: "none" }}>Cookies and Tracking</a></li>
          <li><a href="#data-retention" style={{ color: "var(--primary)", textDecoration: "none" }}>Data Retention</a></li>
          <li><a href="#your-rights" style={{ color: "var(--primary)", textDecoration: "none" }}>Your Privacy Rights</a></li>
          <li><a href="#data-security" style={{ color: "var(--primary)", textDecoration: "none" }}>Data Security</a></li>
          <li><a href="#international" style={{ color: "var(--primary)", textDecoration: "none" }}>International Data Transfers</a></li>
          <li><a href="#children" style={{ color: "var(--primary)", textDecoration: "none" }}>Children's Privacy</a></li>
          <li><a href="#changes" style={{ color: "var(--primary)", textDecoration: "none" }}>Changes to This Policy</a></li>
          <li><a href="#contact" style={{ color: "var(--primary)", textDecoration: "none" }}>Contact Us</a></li>
        </ol>
      </nav>

      {/* Content */}
      <article style={{ color: "var(--gray-200)", lineHeight: 1.8, fontSize: "1.05rem" }}>
        {/* Introduction */}
        <section id="introduction" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>1. Introduction</h2>
          <p style={{ marginBottom: space("md") }}>
            At Artifically, Inc. ("Artifically," "we," "us," or "our"), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our automation platform and related services (collectively, the "Services").
          </p>
          <p style={{ marginBottom: space("md") }}>
            By accessing or using our Services, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use the Services.
          </p>
        </section>

        {/* Information Collected */}
        <section id="information-collected" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>2. Information We Collect</h2>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            2.1 Information You Provide
          </h3>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Account Information:</strong> Name, email address, company name, phone number, and password when you create an account
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Billing Information:</strong> Payment card details, billing address, and tax identification numbers (processed securely through our payment processor)
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Workflow Data:</strong> Information you input into workflows, automations, and integrations
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Communications:</strong> Information you provide when contacting support or communicating with us
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Profile Information:</strong> Optional information such as job title, profile photo, and preferences
            </li>
          </ul>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            2.2 Information Automatically Collected
          </h3>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Usage Data:</strong> Pages viewed, features used, time spent, workflow execution metrics, API calls
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Device Information:</strong> IP address, browser type, operating system, device identifiers
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Log Data:</strong> Server logs, error reports, performance data, access times
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Cookies and Similar Technologies:</strong> See Section 5 for details
            </li>
          </ul>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            2.3 Information from Third Parties
          </h3>
          <ul style={{ marginBottom: 0, paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Integration Data:</strong> Information from third-party services you connect (e.g., Salesforce, Slack, Google Workspace)
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Authentication Providers:</strong> Basic profile information from SSO providers (e.g., Okta, Azure AD)
            </li>
          </ul>
        </section>

        {/* How We Use */}
        <section id="how-we-use" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>3. How We Use Your Information</h2>
          <p style={{ marginBottom: space("md") }}>
            We use collected information for the following purposes:
          </p>
          <ul style={{ marginBottom: 0, paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Service Delivery:</strong> Provide, operate, and maintain the Services, including workflow execution and automation
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Account Management:</strong> Create and manage your account, process payments, handle subscriptions
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Customer Support:</strong> Respond to inquiries, troubleshoot issues, provide technical assistance
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Product Improvement:</strong> Analyze usage patterns, develop new features, enhance user experience
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Security:</strong> Detect fraud, prevent abuse, ensure platform security
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Communications:</strong> Send transactional emails, product updates, security alerts
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Marketing:</strong> Send promotional materials (with your consent; opt-out available)
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Compliance:</strong> Meet legal obligations, enforce our Terms of Service
            </li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section id="data-sharing" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>4. Data Sharing and Disclosure</h2>
          <p style={{ marginBottom: space("md") }}>
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Service Providers:</strong> Third-party vendors who perform services on our behalf:
              <ul style={{ marginTop: space("xs", 0.5), paddingLeft: space("md") }}>
                <li>Amazon Web Services (cloud hosting)</li>
                <li>Stripe (payment processing)</li>
                <li>SendGrid (email delivery)</li>
                <li>Datadog (monitoring and analytics)</li>
              </ul>
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Legal Compliance:</strong> When required by law, subpoena, or legal process
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Protection of Rights:</strong> To protect our rights, property, safety, or that of others
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>With Your Consent:</strong> When you explicitly authorize us to share information
            </li>
          </ul>
        </section>

        {/* Cookies */}
        <section id="cookies" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>5. Cookies and Tracking Technologies</h2>
          <p style={{ marginBottom: space("md") }}>
            We use cookies, web beacons, and similar technologies to:
          </p>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>Maintain your logged-in session (essential cookies)</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Remember your preferences and settings</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Analyze site usage and improve performance (analytics cookies)</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Deliver personalized content and ads (marketing cookies)</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            For detailed information about our cookie practices, please see our <Link href="/cookies" style={{ color: "var(--primary)" }}>Cookie Policy</Link>. You can control cookies through your browser settings.
          </p>
        </section>

        {/* Data Retention */}
        <section id="data-retention" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>6. Data Retention</h2>
          <p style={{ marginBottom: space("md") }}>
            We retain your information for as long as necessary to:
          </p>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>Provide the Services (active account duration)</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Comply with legal obligations (varies by jurisdiction)</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Resolve disputes and enforce agreements</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            <strong>Account Deletion:</strong> When you delete your account, we delete your personal information within 30 days, except for information we must retain for legal or legitimate business purposes. Workflow execution logs are retained for 90 days for troubleshooting and audit purposes.
          </p>
        </section>

        {/* Your Rights */}
        <section id="your-rights" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>7. Your Privacy Rights</h2>
          <p style={{ marginBottom: space("md") }}>
            Depending on your location, you may have the following rights:
          </p>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Access:</strong> Request a copy of the personal information we hold about you
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Correction:</strong> Request correction of inaccurate or incomplete information
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Deletion:</strong> Request deletion of your personal information (subject to legal exceptions)
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Portability:</strong> Receive your data in a structured, machine-readable format
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Objection:</strong> Object to processing of your information for certain purposes
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Restriction:</strong> Request restriction of processing under certain circumstances
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Withdraw Consent:</strong> Withdraw previously given consent at any time
            </li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            To exercise these rights, contact us at <a href="mailto:privacy@artifically.com" style={{ color: "var(--primary)" }}>privacy@artifically.com</a> or use the self-service tools in your account settings.
          </p>
        </section>

        {/* Data Security */}
        <section id="data-security" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>8. Data Security</h2>
          <p style={{ marginBottom: space("md") }}>
            We implement industry-standard security measures to protect your information:
          </p>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>AES-256 encryption at rest</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>TLS 1.3 encryption in transit</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Regular security audits and penetration testing</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>SOC 2 Type II and ISO 27001 certifications</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Multi-factor authentication (MFA) for all accounts</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Role-based access controls</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            For more information, see our <Link href="/security" style={{ color: "var(--primary)" }}>Security page</Link>.
          </p>
        </section>

        {/* International */}
        <section id="international" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>9. International Data Transfers</h2>
          <p style={{ marginBottom: space("md") }}>
            Our Services are hosted in the United States. If you access our Services from outside the U.S., your information will be transferred to, stored, and processed in the U.S.
          </p>
          <p style={{ marginBottom: 0 }}>
            For users in the European Economic Area (EEA), UK, and Switzerland, we rely on Standard Contractual Clauses approved by the European Commission for data transfers. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
          </p>
        </section>

        {/* Children */}
        <section id="children" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>10. Children's Privacy</h2>
          <p style={{ marginBottom: 0 }}>
            Our Services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately at <a href="mailto:privacy@artifically.com" style={{ color: "var(--primary)" }}>privacy@artifically.com</a>.
          </p>
        </section>

        {/* Changes */}
        <section id="changes" style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>11. Changes to This Policy</h2>
          <p style={{ marginBottom: space("md") }}>
            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes by:
          </p>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>Posting the updated policy on this page</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Updating the "Last Updated" date</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Sending an email notification for significant changes</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            Your continued use of the Services after changes become effective constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>12. Contact Us</h2>
          <p style={{ marginBottom: space("md") }}>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <div
            className="glass"
            style={{
              padding: space("md"),
              borderRadius: "12px",
            }}
          >
            <p style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Email:</strong> <a href="mailto:privacy@artifically.com" style={{ color: "var(--primary)" }}>privacy@artifically.com</a>
            </p>
            <p style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Data Protection Officer:</strong> <a href="mailto:dpo@artifically.com" style={{ color: "var(--primary)" }}>dpo@artifically.com</a>
            </p>
            <p style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Mail:</strong> Artifically, Inc.<br />
              123 Market Street, Suite 400<br />
              San Francisco, CA 94103<br />
              United States
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Response Time:</strong> We aim to respond to all privacy requests within 30 days.
            </p>
          </div>
        </section>
      </article>

      {/* Related Links */}
      <div
        style={{
          marginTop: space("xl"),
          paddingTop: space("lg"),
          borderTop: "1px solid rgba(148, 163, 184, 0.2)",
        }}
      >
        <h3 style={{ fontSize: "1.3rem", marginBottom: space("md") }}>Related Documents</h3>
        <div style={{ display: "flex", gap: space("md"), flexWrap: "wrap" }}>
          <Link href="/terms" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Terms of Service
          </Link>
          <Link href="/cookies" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Cookie Policy
          </Link>
          <Link href="/security" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Security & Compliance
          </Link>
        </div>
      </div>
    </main>
  );
}
