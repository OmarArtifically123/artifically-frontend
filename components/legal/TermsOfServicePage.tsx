"use client";

import Link from "next/link";
import { space } from "@/styles/spacing";

export default function TermsOfServicePage() {
  const lastUpdated = "October 24, 2024";

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, maxWidth: "900px" }}>
      <header style={{ marginBottom: space("xl"), paddingBottom: space("lg"), borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          Terms of Service
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1rem" }}>
          Last Updated: {lastUpdated}
        </p>
      </header>

      <article style={{ color: "var(--gray-200)", lineHeight: 1.8, fontSize: "1.05rem" }}>
        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: space("md") }}>
            By accessing or using Artifically's automation platform and services (the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Services.
          </p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>2. Account Registration</h2>
          <ul style={{ paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>You must provide accurate, current information</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>You are responsible for maintaining account security</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>You must be 16 years or older to use the Services</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>One account per person or organization</li>
          </ul>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>3. Subscription and Payments</h2>
          <p style={{ marginBottom: space("sm") }}><strong>Billing:</strong> Subscriptions are billed monthly or annually. Payment is due at the start of each billing cycle.</p>
          <p style={{ marginBottom: space("sm") }}><strong>Auto-Renewal:</strong> Subscriptions automatically renew unless canceled before the renewal date.</p>
          <p style={{ marginBottom: space("sm") }}><strong>Refunds:</strong> Refunds are provided on a case-by-case basis within 14 days of initial purchase.</p>
          <p style={{ marginBottom: 0 }}><strong>Price Changes:</strong> We may change pricing with 30 days notice. Changes apply to subsequent billing cycles.</p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>4. Acceptable Use</h2>
          <p style={{ marginBottom: space("sm") }}>You agree NOT to:</p>
          <ul style={{ paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>Violate laws or regulations</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Infringe on intellectual property rights</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Transmit malware, spam, or malicious code</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Attempt unauthorized access to our systems</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Interfere with or disrupt the Services</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Resell or redistribute the Services without authorization</li>
          </ul>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>5. Data and Privacy</h2>
          <p style={{ marginBottom: space("sm") }}><strong>Your Data:</strong> You retain all rights to data you input into the Services. We do not claim ownership.</p>
          <p style={{ marginBottom: space("sm") }}><strong>License:</strong> You grant us a limited license to process your data solely to provide the Services.</p>
          <p style={{ marginBottom: 0 }}>See our <Link href="/privacy" style={{ color: "var(--primary)" }}>Privacy Policy</Link> for details on data handling.</p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>6. Service Availability</h2>
          <p style={{ marginBottom: space("sm") }}><strong>Uptime SLA:</strong> We guarantee 99.9% monthly uptime for paid plans, excluding scheduled maintenance.</p>
          <p style={{ marginBottom: space("sm") }}><strong>Maintenance:</strong> We may perform scheduled maintenance with advance notice.</p>
          <p style={{ marginBottom: 0 }}><strong>Service Credits:</strong> SLA breaches entitle you to service credits as outlined in your subscription agreement.</p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>7. Intellectual Property</h2>
          <p style={{ marginBottom: space("sm") }}><strong>Our IP:</strong> All Services, software, trademarks, and content are owned by Artifically and protected by intellectual property laws.</p>
          <p style={{ marginBottom: 0 }}><strong>Feedback:</strong> Any suggestions or feedback you provide may be used by us without compensation or attribution.</p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>8. Termination</h2>
          <p style={{ marginBottom: space("sm") }}><strong>By You:</strong> Cancel anytime via account settings. Access continues until end of billing period.</p>
          <p style={{ marginBottom: space("sm") }}><strong>By Us:</strong> We may suspend or terminate accounts for Terms violations, non-payment, or at our discretion with notice.</p>
          <p style={{ marginBottom: 0 }}><strong>Effect:</strong> Upon termination, your access ends and data is deleted per our retention policy (typically 30 days).</p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>9. Disclaimers</h2>
          <p style={{ marginBottom: space("md"), fontWeight: 600 }}>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
          </p>
          <p style={{ marginBottom: 0 }}>
            We disclaim all warranties including merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee error-free, uninterrupted, or secure operation.
          </p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>10. Limitation of Liability</h2>
          <p style={{ marginBottom: space("md"), fontWeight: 600 }}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ARTIFICALLY SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
          </p>
          <p style={{ marginBottom: 0 }}>
            Our total liability for any claims shall not exceed the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>11. Indemnification</h2>
          <p style={{ marginBottom: 0 }}>
            You agree to indemnify and hold Artifically harmless from claims arising from your use of the Services, violation of these Terms, or infringement of third-party rights.
          </p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>12. Dispute Resolution</h2>
          <p style={{ marginBottom: space("sm") }}><strong>Governing Law:</strong> These Terms are governed by California law, excluding conflict of law provisions.</p>
          <p style={{ marginBottom: space("sm") }}><strong>Arbitration:</strong> Disputes shall be resolved through binding arbitration in San Francisco, CA, under AAA rules.</p>
          <p style={{ marginBottom: 0 }}><strong>Class Action Waiver:</strong> You agree to resolve disputes individually, not as part of a class action.</p>
        </section>

        <section style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>13. Contact</h2>
          <p style={{ marginBottom: space("md") }}>
            For questions about these Terms, contact us at <a href="mailto:legal@artifically.com" style={{ color: "var(--primary)" }}>legal@artifically.com</a>.
          </p>
        </section>
      </article>

      <div style={{ marginTop: space("xl"), paddingTop: space("lg"), borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
        <h3 style={{ fontSize: "1.3rem", marginBottom: space("md") }}>Related Documents</h3>
        <div style={{ display: "flex", gap: space("md"), flexWrap: "wrap" }}>
          <Link href="/privacy" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Privacy Policy
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
