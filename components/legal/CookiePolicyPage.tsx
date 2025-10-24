"use client";

import Link from "next/link";
import { space } from "@/styles/spacing";

export default function CookiePolicyPage() {
  const lastUpdated = "October 24, 2024";

  return (
    <main className="container" style={{ padding: `${space("2xl")} 0`, maxWidth: "900px" }}>
      <header style={{ marginBottom: space("xl"), paddingBottom: space("lg"), borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, marginBottom: space("sm"), lineHeight: 1.2 }}>
          Cookie Policy
        </h1>
        <p style={{ color: "var(--gray-400)", fontSize: "1rem" }}>
          Last Updated: {lastUpdated}
        </p>
      </header>

      <article style={{ color: "var(--gray-200)", lineHeight: 1.8, fontSize: "1.05rem" }}>
        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>What Are Cookies?</h2>
          <p style={{ marginBottom: 0 }}>
            Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, improve your experience, and provide analytics data. This policy explains how Artifically uses cookies and similar tracking technologies.
          </p>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>Types of Cookies We Use</h2>

          <div className="glass" style={{ padding: space("lg"), borderRadius: "14px", marginBottom: space("md") }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
              1. Strictly Necessary Cookies
            </h3>
            <p style={{ marginBottom: space("sm"), color: "var(--gray-300)" }}>
              <strong>Purpose:</strong> Essential for the website to function. Cannot be disabled.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Cookie Name</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>session_id</td>
                  <td style={{ padding: space("xs", 0.75) }}>Maintains your logged-in session</td>
                  <td style={{ padding: space("xs", 0.75) }}>Session</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>csrf_token</td>
                  <td style={{ padding: space("xs", 0.75) }}>Security protection against attacks</td>
                  <td style={{ padding: space("xs", 0.75) }}>Session</td>
                </tr>
                <tr>
                  <td style={{ padding: space("xs", 0.75) }}>cookie_consent</td>
                  <td style={{ padding: space("xs", 0.75) }}>Remembers your cookie preferences</td>
                  <td style={{ padding: space("xs", 0.75") }}>1 year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass" style={{ padding: space("lg"), borderRadius: "14px", marginBottom: space("md") }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
              2. Functional Cookies
            </h3>
            <p style={{ marginBottom: space("sm"), color: "var(--gray-300)" }}>
              <strong>Purpose:</strong> Remember your preferences and settings.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Cookie Name</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>theme_preference</td>
                  <td style={{ padding: space("xs", 0.75) }}>Remembers dark/light mode choice</td>
                  <td style={{ padding: space("xs", 0.75") }}>1 year</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>language</td>
                  <td style={{ padding: space("xs", 0.75) }}>Stores language preference</td>
                  <td style={{ padding: space("xs", 0.75") }}>1 year</td>
                </tr>
                <tr>
                  <td style={{ padding: space("xs", 0.75) }}>dashboard_layout</td>
                  <td style={{ padding: space("xs", 0.75") }}>Saves dashboard customizations</td>
                  <td style={{ padding: space("xs", 0.75") }}>6 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass" style={{ padding: space("lg"), borderRadius: "14px", marginBottom: space("md") }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
              3. Analytics Cookies
            </h3>
            <p style={{ marginBottom: space("sm"), color: "var(--gray-300)" }}>
              <strong>Purpose:</strong> Help us understand how visitors use our site.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Service</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>Google Analytics</td>
                  <td style={{ padding: space("xs", 0.75) }}>Website traffic and usage analytics</td>
                  <td style={{ padding: space("xs", 0.75") }}>2 years</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>Mixpanel</td>
                  <td style={{ padding: space("xs", 0.75") }}>Product usage and feature analytics</td>
                  <td style={{ padding: space("xs", 0.75") }}>1 year</td>
                </tr>
                <tr>
                  <td style={{ padding: space("xs", 0.75) }}>Hotjar</td>
                  <td style={{ padding: space("xs", 0.75") }}>Heatmaps and user behavior</td>
                  <td style={{ padding: space("xs", 0.75") }}>1 year</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="glass" style={{ padding: space("lg"), borderRadius: "14px", marginBottom: 0 }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: space("sm"), color: "var(--gray-100)" }}>
              4. Marketing Cookies
            </h3>
            <p style={{ marginBottom: space("sm"), color: "var(--gray-300)" }}>
              <strong>Purpose:</strong> Track your activity to deliver personalized ads.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.2)" }}>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Service</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: space("xs", 0.75) }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>Google Ads</td>
                  <td style={{ padding: space("xs", 0.75) }}>Ad targeting and conversion tracking</td>
                  <td style={{ padding: space("xs", 0.75") }}>90 days</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <td style={{ padding: space("xs", 0.75) }}>LinkedIn Insight</td>
                  <td style={{ padding: space("xs", 0.75") }}>B2B ad targeting</td>
                  <td style={{ padding: space("xs", 0.75") }}>180 days</td>
                </tr>
                <tr>
                  <td style={{ padding: space("xs", 0.75) }}>Facebook Pixel</td>
                  <td style={{ padding: space("xs", 0.75") }}>Social media ad optimization</td>
                  <td style={{ padding: space("xs", 0.75") }}>90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>Managing Cookies</h2>
          <p style={{ marginBottom: space("md") }}>
            You have several options to control cookies:
          </p>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            Browser Settings
          </h3>
          <p style={{ marginBottom: space("sm") }}>
            Most browsers allow you to:
          </p>
          <ul style={{ marginBottom: space("md"), paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>View cookies stored on your device</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Block third-party cookies</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Delete all cookies when closing the browser</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Block all cookies (may break site functionality)</li>
          </ul>

          <div style={{ display: "grid", gap: space("xs", 0.75), marginBottom: space("md") }}>
            <div><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</div>
            <div><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</div>
            <div><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</div>
            <div><strong>Edge:</strong> Settings → Cookies and Site Permissions</div>
          </div>

          <h3 style={{ fontSize: "1.3rem", marginTop: space("lg"), marginBottom: space("sm"), color: "var(--gray-100)" }}>
            Opt-Out Tools
          </h3>
          <ul style={{ marginBottom: 0, paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: "var(--primary)" }} target="_blank" rel="noopener noreferrer">Browser Add-on</a>
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Industry Opt-Outs:</strong> <a href="http://www.aboutads.info/choices/" style={{ color: "var(--primary)" }} target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a>
            </li>
            <li style={{ marginBottom: space("xs", 0.75) }}>
              <strong>Do Not Track:</strong> Enable in your browser settings (note: not all sites honor this)
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: space("xl") }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>Impact of Blocking Cookies</h2>
          <p style={{ marginBottom: space("sm") }}>
            Blocking certain cookies may affect your experience:
          </p>
          <ul style={{ marginBottom: 0, paddingLeft: space("md") }}>
            <li style={{ marginBottom: space("xs", 0.75) }}>You may need to log in repeatedly</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Preference settings may not be saved</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Some features may not work properly</li>
            <li style={{ marginBottom: space("xs", 0.75) }}>Personalized content may not be available</li>
          </ul>
        </section>

        <section style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: space("md"), color: "var(--gray-100)" }}>Questions?</h2>
          <p style={{ marginBottom: 0 }}>
            For questions about our use of cookies, contact us at <a href="mailto:privacy@artifically.com" style={{ color: "var(--primary)" }}>privacy@artifically.com</a>.
          </p>
        </section>
      </article>

      <div style={{ marginTop: space("xl"), paddingTop: space("lg"), borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
        <h3 style={{ fontSize: "1.3rem", marginBottom: space("md") }}>Related Documents</h3>
        <div style={{ display: "flex", gap: space("md"), flexWrap: "wrap" }}>
          <Link href="/privacy" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Terms of Service
          </Link>
          <Link href="/security" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
            Security & Compliance
          </Link>
        </div>
      </div>
    </main>
  );
}
