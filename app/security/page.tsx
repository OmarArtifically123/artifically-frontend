"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";

// Note: Metadata export removed since this is a client component
// Add metadata via layout or convert hero to server component if needed

export default function SecurityPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <main className="security-page">
      {/* 1. HERO SECTION */}
      <section className="security-hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-icon-wrapper">
            <Icon name="shield" size={72} aria-hidden="true" />
          </div>

          <h1 id="hero-title" className="headline">
            Enterprise Security & Compliance
          </h1>

          <p className="subheadline">
            Built with security-first architecture to protect your most sensitive operations.
            SOC 2 Type II certified, GDPR compliant, HIPAA ready with 99.98% uptime SLA.
          </p>

          <div className="cta-group">
            <Link href="/downloads/security-whitepaper.pdf" className="btn btn-primary btn-large">
              <Icon name="download" size={20} aria-hidden="true" />
              Download Security Whitepaper
            </Link>
            <Link href="/contact?type=security-assessment" className="btn btn-secondary btn-large">
              Request Security Assessment
            </Link>
          </div>

          {/* Trust badges above the fold */}
          <div className="trust-badges" role="list" aria-label="Compliance certifications">
            <div className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden="true" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden="true" />
              <span>ISO 27001</span>
            </div>
            <div className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden="true" />
              <span>GDPR Compliant</span>
            </div>
            <div className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden="true" />
              <span>HIPAA Ready</span>
            </div>
            <div className="trust-badge" role="listitem">
              <Icon name="shield" size={20} aria-hidden="true" />
              <span>99.98% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CERTIFICATIONS & COMPLIANCE GRID */}
      <section className="certifications-section" aria-labelledby="certifications-title">
        <div className="container">
          <div className="section-header">
            <h2 id="certifications-title" className="section-title">
              Certifications & Compliance
            </h2>
            <p className="section-subtitle">
              We maintain the highest standards of security and compliance to protect your data
              and meet regulatory requirements worldwide.
            </p>
          </div>

          <div className="certifications-grid">
            <article className="cert-card cert-soc2">
              <div className="cert-badge">SOC 2</div>
              <h3 className="cert-title">SOC 2 Type II</h3>
              <p className="cert-description">
                Independent third-party audit of security, availability, and confidentiality controls.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Last audited: September 2024
                </span>
                <Link href="/contact?type=soc2-report" className="cert-link">
                  Request Report <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="cert-card cert-iso">
              <div className="cert-badge">ISO</div>
              <h3 className="cert-title">ISO 27001:2022</h3>
              <p className="cert-description">
                International standard for information security management systems with annual surveillance audits.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Certified: March 2024
                </span>
                <Link href="/contact?type=iso-certificate" className="cert-link">
                  Request Certificate <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="cert-card cert-gdpr">
              <div className="cert-badge">GDPR</div>
              <h3 className="cert-title">GDPR Compliant</h3>
              <p className="cert-description">
                Full compliance with European General Data Protection Regulation including data residency and DPA.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Reviewed: October 2024
                </span>
                <Link href="/downloads/dpa-template.pdf" className="cert-link">
                  Download DPA <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="cert-card cert-hipaa">
              <div className="cert-badge">HIPAA</div>
              <h3 className="cert-title">HIPAA Compliant</h3>
              <p className="cert-description">
                HIPAA-ready infrastructure with Business Associate Agreement (BAA) for healthcare data processing.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Reviewed: August 2024
                </span>
                <Link href="/downloads/baa-template.pdf" className="cert-link">
                  Download BAA <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="cert-card cert-ccpa">
              <div className="cert-badge">CCPA</div>
              <h3 className="cert-title">CCPA Compliant</h3>
              <p className="cert-description">
                California Consumer Privacy Act compliance with consumer rights honored and data protection measures.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Reviewed: October 2024
                </span>
                <Link href="/privacy" className="cert-link">
                  View Privacy Policy <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="cert-card cert-pdpl">
              <div className="cert-badge">PDPL</div>
              <h3 className="cert-title">Saudi PDPL & UAE DPA</h3>
              <p className="cert-description">
                Compliance with Middle East data protection laws including data residency in Bahrain and UAE.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Reviewed: September 2024
                </span>
                <Link href="/contact?type=mena-compliance" className="cert-link">
                  Learn More <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="cert-card cert-pci">
              <div className="cert-badge">PCI</div>
              <h3 className="cert-title">PCI DSS Level 1</h3>
              <p className="cert-description">
                Payment Card Industry Data Security Standard compliance for secure payment data handling.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Certified: July 2024
                </span>
                <Link href="/contact?type=pci-aoc" className="cert-link">
                  Request AOC <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="cert-card cert-fedramp">
              <div className="cert-badge">FedRAMP</div>
              <h3 className="cert-title">FedRAMP Ready</h3>
              <p className="cert-description">
                Federal Risk and Authorization Management Program readiness for US government agencies.
              </p>
              <div className="cert-meta">
                <span className="cert-date">
                  <Icon name="calendar" size={16} aria-hidden="true" />
                  Assessment: Q4 2024
                </span>
                <Link href="/contact?type=fedramp" className="cert-link">
                  Contact Sales <Icon name="arrowRight" size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. DATA SECURITY & ENCRYPTION */}
      <section className="encryption-section" aria-labelledby="encryption-title">
        <div className="container">
          <div className="section-header">
            <h2 id="encryption-title" className="section-title">
              Data Security & Encryption
            </h2>
            <p className="section-subtitle">
              Military-grade encryption protects your data at every layer, from storage to transmission.
            </p>
          </div>

          <div className="encryption-grid">
            <div className="encryption-card">
              <div className="encryption-icon">
                <Icon name="lock" size={40} aria-hidden="true" />
              </div>
              <h3 className="encryption-title">Encryption at Rest</h3>
              <p className="encryption-description">
                <strong>AES-256 encryption</strong> for all data stored in databases, file systems, and backups.
                Industry-standard encryption ensures your data is unreadable without proper authorization.
              </p>
              <ul className="encryption-specs">
                <li>AES-256-GCM algorithm</li>
                <li>Separate encryption keys per tenant</li>
                <li>Field-level encryption for sensitive data (PII, credentials)</li>
              </ul>
            </div>

            <div className="encryption-card">
              <div className="encryption-icon">
                <Icon name="shield" size={40} aria-hidden="true" />
              </div>
              <h3 className="encryption-title">Encryption in Transit</h3>
              <p className="encryption-description">
                <strong>TLS 1.3</strong> for all data transmission with perfect forward secrecy.
                All communications encrypted end-to-end to protect against interception.
              </p>
              <ul className="encryption-specs">
                <li>TLS 1.3 with forward secrecy</li>
                <li>HTTPS enforced for all connections</li>
                <li>Certificate pinning for mobile apps</li>
              </ul>
            </div>

            <div className="encryption-card">
              <div className="encryption-icon">
                <Icon name="key" size={40} aria-hidden="true" />
              </div>
              <h3 className="encryption-title">Key Management</h3>
              <p className="encryption-description">
                <strong>Hardware Security Modules (HSM)</strong> for encryption key storage and rotation.
                Keys never stored in plain text with automatic rotation policies.
              </p>
              <ul className="encryption-specs">
                <li>FIPS 140-2 Level 3 certified HSMs</li>
                <li>Automatic key rotation every 90 days</li>
                <li>Customer-managed keys (BYOK) available</li>
              </ul>
            </div>

            <div className="encryption-card">
              <div className="encryption-icon">
                <Icon name="database" size={40} aria-hidden="true" />
              </div>
              <h3 className="encryption-title">Backup Encryption</h3>
              <p className="encryption-description">
                All backups encrypted with AES-256. Hourly incremental backups and daily full backups
                with geographic redundancy across multiple regions.
              </p>
              <ul className="encryption-specs">
                <li>Encrypted hourly incremental backups</li>
                <li>Encrypted daily full backups</li>
                <li>Multi-region backup redundancy</li>
              </ul>
            </div>

            <div className="encryption-card">
              <div className="encryption-icon">
                <Icon name="server" size={40} aria-hidden="true" />
              </div>
              <h3 className="encryption-title">Database Encryption</h3>
              <p className="encryption-description">
                Field-level encryption for sensitive data (PII, credentials, API keys) plus
                full-disk encryption at the storage layer for defense in depth.
              </p>
              <ul className="encryption-specs">
                <li>Column-level encryption for sensitive fields</li>
                <li>Transparent data encryption (TDE)</li>
                <li>Full-disk encryption on all volumes</li>
              </ul>
            </div>

            <div className="encryption-card">
              <div className="encryption-icon">
                <Icon name="shield" size={40} aria-hidden="true" />
              </div>
              <h3 className="encryption-title">Data Isolation</h3>
              <p className="encryption-description">
                Complete tenant separation. Your data never commingles with other customers.
                Dedicated schemas and separate encryption keys per tenant.
              </p>
              <ul className="encryption-specs">
                <li>Logical data isolation per tenant</li>
                <li>Separate encryption keys per customer</li>
                <li>Physical isolation available for Enterprise</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACCESS MANAGEMENT */}
      <section className="access-section" aria-labelledby="access-title">
        <div className="container">
          <div className="section-header">
            <h2 id="access-title" className="section-title">
              Access Management & Authentication
            </h2>
            <p className="section-subtitle">
              Enterprise-grade identity and access management with SSO, MFA, and granular permissions.
            </p>
          </div>

          <div className="access-grid">
            <div className="access-card">
              <div className="access-icon">
                <Icon name="users" size={32} aria-hidden="true" />
              </div>
              <h3 className="access-title">Single Sign-On (SSO)</h3>
              <p className="access-description">
                SAML 2.0, OAuth 2.0, and OpenID Connect support. Seamlessly integrate with your
                existing identity provider.
              </p>
              <ul className="access-features">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>SAML 2.0 authentication</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>OAuth 2.0 & OpenID Connect</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Okta, Azure AD, Google Workspace</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>OneLogin, Auth0, Ping Identity</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Custom SAML 2.0 providers</span>
                </li>
              </ul>
            </div>

            <div className="access-card">
              <div className="access-icon">
                <Icon name="shield" size={32} aria-hidden="true" />
              </div>
              <h3 className="access-title">Multi-Factor Authentication (MFA)</h3>
              <p className="access-description">
                Required for all users by default. Multiple authentication methods supported
                for maximum security.
              </p>
              <ul className="access-features">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Authenticator apps (Google, Microsoft, Authy)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>SMS and email verification</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Hardware security keys (YubiKey, FIDO2)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Biometric authentication (WebAuthn)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Enforced for privileged accounts</span>
                </li>
              </ul>
            </div>

            <div className="access-card">
              <div className="access-icon">
                <Icon name="shield" size={32} aria-hidden="true" />
              </div>
              <h3 className="access-title">Role-Based Access Control (RBAC)</h3>
              <p className="access-description">
                Granular permissions system. Control access at the workflow, automation, and data level
                with custom role creation.
              </p>
              <ul className="access-features">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Pre-built roles: Admin, Editor, Viewer</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Custom role creation with fine-grained permissions</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Team-based access isolation</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Attribute-based access control (ABAC)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Just-in-time (JIT) access provisioning</span>
                </li>
              </ul>
            </div>

            <div className="access-card">
              <div className="access-icon">
                <Icon name="users" size={32} aria-hidden="true" />
              </div>
              <h3 className="access-title">SCIM Provisioning</h3>
              <p className="access-description">
                Automated user lifecycle management. Provision and deprovision users directly
                from your identity provider with SCIM 2.0.
              </p>
              <ul className="access-features">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Automatic user creation and updates</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Instant deprovisioning on termination</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Group and role synchronization</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Attribute mapping and updates</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>SCIM 2.0 standard compliant</span>
                </li>
              </ul>
            </div>

            <div className="access-card">
              <div className="access-icon">
                <Icon name="clock" size={32} aria-hidden="true" />
              </div>
              <h3 className="access-title">Session Management</h3>
              <p className="access-description">
                Secure session handling with automatic timeout, device tracking, and remote
                session termination capability.
              </p>
              <ul className="access-features">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Configurable session timeout (default: 15 min)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Device and location tracking</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Remote session termination</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Concurrent session limits</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Suspicious activity detection</span>
                </li>
              </ul>
            </div>

            <div className="access-card">
              <div className="access-icon">
                <Icon name="globe" size={32} aria-hidden="true" />
              </div>
              <h3 className="access-title">IP Whitelisting & Geofencing</h3>
              <p className="access-description">
                Restrict access by IP address ranges or geographic locations. Additional layer
                of security for sensitive environments.
              </p>
              <ul className="access-features">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>IP address allowlisting</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>CIDR range support</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Geographic restrictions</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>VPN and proxy detection</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Per-user or per-team policies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INFRASTRUCTURE SECURITY */}
      <section className="infrastructure-section" aria-labelledby="infrastructure-title">
        <div className="container">
          <div className="section-header">
            <h2 id="infrastructure-title" className="section-title">
              Infrastructure Security
            </h2>
            <p className="section-subtitle">
              Built on world-class cloud infrastructure with multiple layers of security controls and 24/7 monitoring.
            </p>
          </div>

          <div className="infrastructure-list">
            <div className="infrastructure-item">
              <div className="infrastructure-icon">
                <Icon name="cloud" size={28} aria-hidden="true" />
              </div>
              <div className="infrastructure-content">
                <h3 className="infrastructure-title">Cloud Provider Security</h3>
                <p className="infrastructure-description">
                  Multi-cloud infrastructure hosted on <strong>AWS and Azure</strong> SOC 2 Type II certified
                  data centers with 99.99% uptime SLA. Automatic failover between regions with active-active
                  architecture for zero-downtime deployments.
                </p>
              </div>
            </div>

            <div className="infrastructure-item">
              <div className="infrastructure-icon">
                <Icon name="network" size={28} aria-hidden="true" />
              </div>
              <div className="infrastructure-content">
                <h3 className="infrastructure-title">Network Security</h3>
                <p className="infrastructure-description">
                  <strong>Virtual Private Cloud (VPC)</strong> isolation with subnet segregation, network ACLs,
                  and firewall rules. Zero-trust network architecture with micro-segmentation. All traffic
                  encrypted with TLS 1.3 and perfect forward secrecy.
                </p>
              </div>
            </div>

            <div className="infrastructure-item">
              <div className="infrastructure-icon">
                <Icon name="shield" size={28} aria-hidden="true" />
              </div>
              <div className="infrastructure-content">
                <h3 className="infrastructure-title">DDoS Protection</h3>
                <p className="infrastructure-description">
                  <strong>Cloudflare Enterprise</strong> with 100+ Tbps network capacity and automatic DDoS
                  mitigation at edge locations worldwide. Application-layer (L7) protection included with
                  WAF rules for common attack patterns (SQL injection, XSS, etc.).
                </p>
              </div>
            </div>

            <div className="infrastructure-item">
              <div className="infrastructure-icon">
                <Icon name="eye" size={28} aria-hidden="true" />
              </div>
              <div className="infrastructure-content">
                <h3 className="infrastructure-title">24/7 Security Operations Center (SOC)</h3>
                <p className="infrastructure-description">
                  Dedicated security team monitoring all systems around the clock with AI-powered threat
                  detection. Automated alerting to SOC with <strong>&lt;5 minute response time</strong> for
                  critical security events. Global coverage with follow-the-sun operations model.
                </p>
              </div>
            </div>

            <div className="infrastructure-item">
              <div className="infrastructure-icon">
                <Icon name="search" size={28} aria-hidden="true" />
              </div>
              <div className="infrastructure-content">
                <h3 className="infrastructure-title">Intrusion Detection & Prevention</h3>
                <p className="infrastructure-description">
                  Network-based and host-based intrusion detection systems (NIDS/HIDS) with real-time
                  monitoring. Behavioral analysis flags suspicious activity with automated response
                  capabilities including IP blocking and account suspension.
                </p>
              </div>
            </div>

            <div className="infrastructure-item">
              <div className="infrastructure-icon">
                <Icon name="target" size={28} aria-hidden="true" />
              </div>
              <div className="infrastructure-content">
                <h3 className="infrastructure-title">Vulnerability Management</h3>
                <p className="infrastructure-description">
                  <strong>Weekly automated vulnerability scans</strong> of all systems and applications.
                  Continuous dependency scanning for known CVEs with automatic patching for critical
                  vulnerabilities. Quarterly external penetration testing by certified ethical hackers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. APPLICATION SECURITY */}
      <section className="application-security-section" aria-labelledby="app-security-title">
        <div className="container">
          <div className="section-header">
            <h2 id="app-security-title" className="section-title">
              Application Security
            </h2>
            <p className="section-subtitle">
              Security built into every stage of the software development lifecycle with automated testing and validation.
            </p>
          </div>

          <div className="app-security-grid">
            <div className="app-security-card">
              <div className="app-security-icon">
                <Icon name="code" size={36} aria-hidden="true" />
              </div>
              <h3 className="app-security-title">Secure Development</h3>
              <p className="app-security-description">
                Secure coding practices enforced with automated code review and static analysis.
              </p>
              <ul className="app-security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Static Application Security Testing (SAST)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Dynamic Application Security Testing (DAST)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Software Composition Analysis (SCA)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Dependency vulnerability scanning</span>
                </li>
              </ul>
            </div>

            <div className="app-security-card">
              <div className="app-security-icon">
                <Icon name="target" size={36} aria-hidden="true" />
              </div>
              <h3 className="app-security-title">Penetration Testing</h3>
              <p className="app-security-description">
                Annual third-party penetration testing and continuous bug bounty program.
              </p>
              <ul className="app-security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Annual external penetration tests</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>HackerOne bug bounty program</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Red team exercises quarterly</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Remediation within 30 days</span>
                </li>
              </ul>
            </div>

            <div className="app-security-card">
              <div className="app-security-icon">
                <Icon name="shield" size={36} aria-hidden="true" />
              </div>
              <h3 className="app-security-title">OWASP Top 10 Mitigation</h3>
              <p className="app-security-description">
                Protection against all OWASP Top 10 vulnerabilities with defense in depth.
              </p>
              <ul className="app-security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>SQL injection prevention with parameterized queries</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>XSS protection with content security policy</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>CSRF tokens on all state-changing operations</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Input validation and output encoding</span>
                </li>
              </ul>
            </div>

            <div className="app-security-card">
              <div className="app-security-icon">
                <Icon name="code" size={36} aria-hidden="true" />
              </div>
              <h3 className="app-security-title">API Security</h3>
              <p className="app-security-description">
                Comprehensive API security with authentication, rate limiting, and monitoring.
              </p>
              <ul className="app-security-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>OAuth 2.0 and API key authentication</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Rate limiting and throttling</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Request/response validation</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>API gateway with WAF protection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DATA PRIVACY & RESIDENCY */}
      <section className="privacy-section" aria-labelledby="privacy-title">
        <div className="container">
          <div className="section-header">
            <h2 id="privacy-title" className="section-title">
              Data Privacy & Residency
            </h2>
            <p className="section-subtitle">
              Your data stays where you need it with full control over retention, export, and deletion policies.
            </p>
          </div>

          <div className="residency-header">
            <h3 className="residency-title">Regional Data Residency Options</h3>
            <p className="residency-subtitle">
              Choose where your data is stored to meet regulatory and compliance requirements
            </p>
          </div>

          <div className="residency-grid">
            <div className="residency-card">
              <div className="residency-icon">
                <Icon name="mapPin" size={28} aria-hidden="true" />
              </div>
              <h4 className="residency-region">North America</h4>
              <ul className="residency-locations">
                <li><strong>US East:</strong> AWS us-east-1 (Virginia)</li>
                <li><strong>US West:</strong> AWS us-west-2 (Oregon)</li>
                <li><strong>Canada:</strong> AWS ca-central-1 (Montreal)</li>
              </ul>
            </div>

            <div className="residency-card">
              <div className="residency-icon">
                <Icon name="mapPin" size={28} aria-hidden="true" />
              </div>
              <h4 className="residency-region">Europe</h4>
              <ul className="residency-locations">
                <li><strong>EU West:</strong> AWS eu-west-1 (Ireland)</li>
                <li><strong>EU Central:</strong> AWS eu-central-1 (Frankfurt)</li>
                <li><strong>UK:</strong> AWS eu-west-2 (London)</li>
              </ul>
            </div>

            <div className="residency-card">
              <div className="residency-icon">
                <Icon name="mapPin" size={28} aria-hidden="true" />
              </div>
              <h4 className="residency-region">Middle East</h4>
              <ul className="residency-locations">
                <li><strong>UAE:</strong> Azure UAE North (Dubai)</li>
                <li><strong>Saudi Arabia:</strong> Coming Q1 2025</li>
                <li><strong>Bahrain:</strong> AWS me-south-1</li>
              </ul>
            </div>

            <div className="residency-card">
              <div className="residency-icon">
                <Icon name="mapPin" size={28} aria-hidden="true" />
              </div>
              <h4 className="residency-region">Asia Pacific</h4>
              <ul className="residency-locations">
                <li><strong>Singapore:</strong> AWS ap-southeast-1</li>
                <li><strong>Japan:</strong> AWS ap-northeast-1 (Tokyo)</li>
                <li><strong>Australia:</strong> AWS ap-southeast-2 (Sydney)</li>
              </ul>
            </div>
          </div>

          <div className="privacy-policies">
            <div className="privacy-policy-card">
              <div className="privacy-policy-icon">
                <Icon name="clock" size={32} aria-hidden="true" />
              </div>
              <h3 className="privacy-policy-title">Data Retention</h3>
              <ul className="privacy-policy-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Configurable retention: 30 days to 7 years</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Automatic deletion after retention period</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Legal hold capability for litigation</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Audit logs retained for 7 years</span>
                </li>
              </ul>
            </div>

            <div className="privacy-policy-card">
              <div className="privacy-policy-icon">
                <Icon name="download" size={32} aria-hidden="true" />
              </div>
              <h3 className="privacy-policy-title">Right to Access & Export</h3>
              <ul className="privacy-policy-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Export data in machine-readable format (JSON, CSV)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>API access to all your data</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Bulk export tools available</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Data portability to other providers</span>
                </li>
              </ul>
            </div>

            <div className="privacy-policy-card">
              <div className="privacy-policy-icon">
                <Icon name="trash" size={32} aria-hidden="true" />
              </div>
              <h3 className="privacy-policy-title">Right to Erasure (GDPR Article 17)</h3>
              <ul className="privacy-policy-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>30-day grace period for recovery</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Permanent deletion with cryptographic erasure</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Deletion certification provided on request</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>All backups securely destroyed</span>
                </li>
              </ul>
            </div>

            <div className="privacy-policy-card">
              <div className="privacy-policy-icon">
                <Icon name="fileText" size={32} aria-hidden="true" />
              </div>
              <h3 className="privacy-policy-title">Data Processing Agreement (DPA)</h3>
              <ul className="privacy-policy-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>GDPR-compliant DPA template</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Standard Contractual Clauses (SCCs)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Sub-processor list maintained</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>
                    <Link href="/downloads/dpa-template.pdf" className="privacy-link">
                      Download DPA Template
                    </Link>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MONITORING & INCIDENT RESPONSE */}
      <section className="monitoring-section" aria-labelledby="monitoring-title">
        <div className="container">
          <div className="section-header">
            <h2 id="monitoring-title" className="section-title">
              Monitoring & Incident Response
            </h2>
            <p className="section-subtitle">
              24/7 security monitoring with documented incident response procedures and guaranteed response times.
            </p>
          </div>

          <div className="response-times">
            <div className="response-time-card critical">
              <div className="response-time-badge">Critical</div>
              <div className="response-time-value">&lt;15 min</div>
              <p className="response-time-description">
                Security incidents affecting data integrity or availability
              </p>
            </div>

            <div className="response-time-card high">
              <div className="response-time-badge">High</div>
              <div className="response-time-value">&lt;2 hours</div>
              <p className="response-time-description">
                Vulnerabilities with potential for immediate exploitation
              </p>
            </div>

            <div className="response-time-card medium">
              <div className="response-time-badge">Medium</div>
              <div className="response-time-value">&lt;8 hours</div>
              <p className="response-time-description">
                Security issues with mitigating controls in place
              </p>
            </div>

            <div className="response-time-card notification">
              <div className="response-time-badge">Customer Notification</div>
              <div className="response-time-value">&lt;24 hours</div>
              <p className="response-time-description">
                Notification for any security incident affecting customer data
              </p>
            </div>
          </div>

          <div className="monitoring-features">
            <div className="monitoring-feature">
              <div className="monitoring-feature-icon">
                <Icon name="activity" size={32} aria-hidden="true" />
              </div>
              <h3 className="monitoring-feature-title">24/7 Security Operations Center</h3>
              <p className="monitoring-feature-description">
                Dedicated security team monitoring all systems around the clock with global coverage.
                Follow-the-sun operations model ensures expert response at any time.
              </p>
            </div>

            <div className="monitoring-feature">
              <div className="monitoring-feature-icon">
                <Icon name="alertTriangle" size={32} aria-hidden="true" />
              </div>
              <h3 className="monitoring-feature-title">Threat Detection</h3>
              <p className="monitoring-feature-description">
                AI-powered threat detection with machine learning anomaly detection. Behavioral analysis
                flags suspicious activity instantly with automated response capabilities.
              </p>
            </div>

            <div className="monitoring-feature">
              <div className="monitoring-feature-icon">
                <Icon name="bell" size={32} aria-hidden="true" />
              </div>
              <h3 className="monitoring-feature-title">Automated Alerting</h3>
              <p className="monitoring-feature-description">
                Immediate alerts for security events via PagerDuty, Slack, and email. Configurable
                alert thresholds and escalation policies with on-call rotation.
              </p>
            </div>

            <div className="monitoring-feature">
              <div className="monitoring-feature-icon">
                <Icon name="fileText" size={32} aria-hidden="true" />
              </div>
              <h3 className="monitoring-feature-title">Incident Response Plan</h3>
              <p className="monitoring-feature-description">
                Documented incident response procedures with defined roles and responsibilities.
                Regular drills and tabletop exercises ensure team readiness.
              </p>
            </div>

            <div className="monitoring-feature">
              <div className="monitoring-feature-icon">
                <Icon name="globe" size={32} aria-hidden="true" />
              </div>
              <h3 className="monitoring-feature-title">Public Status Page</h3>
              <p className="monitoring-feature-description">
                Real-time system status at{" "}
                <a href="https://status.artifically.com" target="_blank" rel="noopener noreferrer" className="status-link">
                  status.artifically.com
                </a>
                . Subscribe for email, SMS, or Slack updates on incidents and maintenance.
              </p>
            </div>

            <div className="monitoring-feature">
              <div className="monitoring-feature-icon">
                <Icon name="mail" size={32} aria-hidden="true" />
              </div>
              <h3 className="monitoring-feature-title">Customer Communication</h3>
              <p className="monitoring-feature-description">
                Transparent communication during incidents with email and Slack notifications within
                30 minutes. Hourly updates until resolution with post-mortem reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. AUDIT LOGS & COMPLIANCE REPORTING */}
      <section className="audit-logs-section" aria-labelledby="audit-logs-title">
        <div className="container">
          <div className="section-header">
            <h2 id="audit-logs-title" className="section-title">
              Audit Logs & Compliance Reporting
            </h2>
            <p className="section-subtitle">
              Comprehensive audit trails with immutable logging and 7-year retention for compliance requirements.
            </p>
          </div>

          <div className="audit-features-grid">
            <div className="audit-feature-card">
              <div className="audit-feature-icon">
                <Icon name="fileText" size={36} aria-hidden="true" />
              </div>
              <h3 className="audit-feature-title">Immutable Audit Trails</h3>
              <p className="audit-feature-description">
                All user actions logged with cryptographic integrity verification. Logs cannot be
                modified or deleted, ensuring complete audit trail for compliance and forensics.
              </p>
              <ul className="audit-feature-list">
                <li>Tamper-proof logging with cryptographic hashing</li>
                <li>Timestamp accuracy to millisecond precision</li>
                <li>Chain-of-custody preservation</li>
              </ul>
            </div>

            <div className="audit-feature-card">
              <div className="audit-feature-icon">
                <Icon name="users" size={36} aria-hidden="true" />
              </div>
              <h3 className="audit-feature-title">User Activity Tracking</h3>
              <p className="audit-feature-description">
                Complete visibility into all user actions including logins, data access, modifications,
                and deletions with IP address, device, and location information.
              </p>
              <ul className="audit-feature-list">
                <li>Login/logout events with device fingerprinting</li>
                <li>Data access and modification tracking</li>
                <li>Permission and role changes logged</li>
              </ul>
            </div>

            <div className="audit-feature-card">
              <div className="audit-feature-icon">
                <Icon name="lock" size={36} aria-hidden="true" />
              </div>
              <h3 className="audit-feature-title">Access Logs</h3>
              <p className="audit-feature-description">
                Detailed access logs for all resources including API calls, file access, and database
                queries with success/failure status and authentication context.
              </p>
              <ul className="audit-feature-list">
                <li>API request/response logging</li>
                <li>Database query audit trail</li>
                <li>File and document access tracking</li>
              </ul>
            </div>

            <div className="audit-feature-card">
              <div className="audit-feature-icon">
                <Icon name="cog" size={36} aria-hidden="true" />
              </div>
              <h3 className="audit-feature-title">Change Management Logs</h3>
              <p className="audit-feature-description">
                All configuration changes tracked with before/after states, approver information,
                and rollback capability for rapid incident response.
              </p>
              <ul className="audit-feature-list">
                <li>System configuration changes logged</li>
                <li>User permission modifications tracked</li>
                <li>Workflow and automation changes recorded</li>
              </ul>
            </div>

            <div className="audit-feature-card">
              <div className="audit-feature-icon">
                <Icon name="download" size={36} aria-hidden="true" />
              </div>
              <h3 className="audit-feature-title">Export & Search Capability</h3>
              <p className="audit-feature-description">
                Export audit logs in standard formats (JSON, CSV, SIEM-compatible) with advanced
                search and filtering for compliance reporting and forensic analysis.
              </p>
              <ul className="audit-feature-list">
                <li>Real-time log export via API</li>
                <li>SIEM integration (Splunk, Datadog, etc.)</li>
                <li>Advanced search with date range filtering</li>
              </ul>
            </div>

            <div className="audit-feature-card">
              <div className="audit-feature-icon">
                <Icon name="clock" size={36} aria-hidden="true" />
              </div>
              <h3 className="audit-feature-title">7-Year Retention</h3>
              <p className="audit-feature-description">
                Audit logs retained for 7 years to meet compliance requirements (SOX, HIPAA, etc.)
                with secure archival and retrieval capabilities.
              </p>
              <ul className="audit-feature-list">
                <li>Encrypted long-term archival storage</li>
                <li>Compliant with SOX, HIPAA, PCI-DSS requirements</li>
                <li>Retrieval available within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. BUSINESS CONTINUITY & DISASTER RECOVERY */}
      <section className="bcdr-section" aria-labelledby="bcdr-title">
        <div className="container">
          <div className="section-header">
            <h2 id="bcdr-title" className="section-title">
              Business Continuity & Disaster Recovery
            </h2>
            <p className="section-subtitle">
              Enterprise-grade reliability with guaranteed uptime, rapid recovery, and multi-region redundancy.
            </p>
          </div>

          <div className="bcdr-stats">
            <div className="bcdr-stat">
              <div className="bcdr-stat-value">99.98%</div>
              <div className="bcdr-stat-label">Uptime SLA</div>
              <p className="bcdr-stat-description">
                Financially backed guarantee (43 min/year max downtime)
              </p>
            </div>

            <div className="bcdr-stat">
              <div className="bcdr-stat-value">&lt;4 hours</div>
              <div className="bcdr-stat-label">RTO</div>
              <p className="bcdr-stat-description">
                Recovery Time Objective - Maximum downtime target
              </p>
            </div>

            <div className="bcdr-stat">
              <div className="bcdr-stat-value">&lt;1 hour</div>
              <div className="bcdr-stat-label">RPO</div>
              <p className="bcdr-stat-description">
                Recovery Point Objective - Maximum data loss window
              </p>
            </div>

            <div className="bcdr-stat">
              <div className="bcdr-stat-value">3+ Regions</div>
              <div className="bcdr-stat-label">Redundancy</div>
              <p className="bcdr-stat-description">
                Multi-region failover with automatic geographic redundancy
              </p>
            </div>
          </div>

          <div className="bcdr-details">
            <div className="bcdr-detail-card">
              <h3 className="bcdr-detail-title">
                <Icon name="shield" size={24} aria-hidden="true" />
                Disaster Recovery Plan
              </h3>
              <ul className="bcdr-detail-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Automated failover to secondary region within 15 minutes</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Quarterly disaster recovery drills and testing</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Documented runbooks for all failure scenarios</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Cross-region database replication with continuous sync</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Hot standby infrastructure ready for instant activation</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Annual third-party DR audit and validation</span>
                </li>
              </ul>
            </div>

            <div className="bcdr-detail-card">
              <h3 className="bcdr-detail-title">
                <Icon name="database" size={24} aria-hidden="true" />
                Backup Strategy
              </h3>
              <ul className="bcdr-detail-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Hourly incremental backups (24/7)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Daily full backups with verification</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>30-day backup retention (configurable to 7 years)</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Geographic redundancy across 3+ regions</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Point-in-time recovery to any moment in retention period</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>All backups encrypted with AES-256</span>
                </li>
              </ul>
            </div>

            <div className="bcdr-detail-card">
              <h3 className="bcdr-detail-title">
                <Icon name="globe" size={24} aria-hidden="true" />
                Multi-Region Failover
              </h3>
              <ul className="bcdr-detail-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Active-active architecture in primary regions</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Hot standby in disaster recovery regions</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Automatic DNS failover with health checks</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Load balancing across multiple availability zones</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Zero data loss with synchronous replication</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Tested monthly with automated failover exercises</span>
                </li>
              </ul>
            </div>

            <div className="bcdr-detail-card">
              <h3 className="bcdr-detail-title">
                <Icon name="activity" size={24} aria-hidden="true" />
                High Availability
              </h3>
              <ul className="bcdr-detail-list">
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>N+2 redundancy for all critical components</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Auto-scaling based on load with capacity planning</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Zero-downtime deployments with blue-green strategy</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Database clustering with automatic failover</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>CDN edge caching for global performance</span>
                </li>
                <li>
                  <Icon name="check" size={16} aria-hidden="true" />
                  <span>Continuous health monitoring with auto-remediation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 11. SECURITY POLICIES & DOWNLOADS */}
      <section className="downloads-section" aria-labelledby="downloads-title">
        <div className="container">
          <div className="section-header">
            <h2 id="downloads-title" className="section-title">
              Security Policies & Documentation
            </h2>
            <p className="section-subtitle">
              Download comprehensive security documentation, compliance reports, and legal agreements.
            </p>
          </div>

          <div className="downloads-grid">
            <Link href="/downloads/security-whitepaper.pdf" className="download-card">
              <div className="download-icon">
                <Icon name="fileText" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Security Whitepaper</h3>
              <p className="download-description">
                Comprehensive security architecture overview, infrastructure details, and best practices.
              </p>
              <div className="download-meta">
                <span className="download-size">PDF, 2.4 MB</span>
                <span className="download-link">
                  Download <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/downloads/dpa-template.pdf" className="download-card">
              <div className="download-icon">
                <Icon name="fileText" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Data Processing Agreement</h3>
              <p className="download-description">
                GDPR-compliant DPA template with Standard Contractual Clauses ready for your legal team.
              </p>
              <div className="download-meta">
                <span className="download-size">PDF, 1.8 MB</span>
                <span className="download-link">
                  Download <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/downloads/baa-template.pdf" className="download-card">
              <div className="download-icon">
                <Icon name="fileText" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Business Associate Agreement</h3>
              <p className="download-description">
                HIPAA-compliant BAA for healthcare organizations processing protected health information (PHI).
              </p>
              <div className="download-meta">
                <span className="download-size">PDF, 1.2 MB</span>
                <span className="download-link">
                  Download <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/downloads/sla-agreement.pdf" className="download-card">
              <div className="download-icon">
                <Icon name="fileText" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Service Level Agreement</h3>
              <p className="download-description">
                Detailed SLA with 99.98% uptime guarantee, support response times, and financial credits.
              </p>
              <div className="download-meta">
                <span className="download-size">PDF, 980 KB</span>
                <span className="download-link">
                  Download <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/downloads/acceptable-use-policy.pdf" className="download-card">
              <div className="download-icon">
                <Icon name="fileText" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Acceptable Use Policy</h3>
              <p className="download-description">
                Terms of service and acceptable use policies governing platform usage and customer responsibilities.
              </p>
              <div className="download-meta">
                <span className="download-size">PDF, 720 KB</span>
                <span className="download-link">
                  Download <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/privacy" className="download-card">
              <div className="download-icon">
                <Icon name="fileText" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Privacy Policy</h3>
              <p className="download-description">
                Comprehensive privacy policy detailing data collection, processing, and your privacy rights.
              </p>
              <div className="download-meta">
                <span className="download-size">Web Page</span>
                <span className="download-link">
                  View Policy <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/downloads/incident-response-plan.pdf" className="download-card">
              <div className="download-icon">
                <Icon name="fileText" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Incident Response Plan</h3>
              <p className="download-description">
                Security incident response procedures, escalation paths, and customer notification policies.
              </p>
              <div className="download-meta">
                <span className="download-size">PDF, 1.5 MB</span>
                <span className="download-link">
                  Download <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/contact?type=soc2-report" className="download-card download-card-request">
              <div className="download-icon">
                <Icon name="shield" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">SOC 2 Type II Report</h3>
              <p className="download-description">
                Independent audit report available to qualified prospects under mutual NDA.
              </p>
              <div className="download-meta">
                <span className="download-size">Requires NDA</span>
                <span className="download-link">
                  Request Access <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/downloads/security-questionnaire.pdf" className="download-card">
              <div className="download-icon">
                <Icon name="clipboard" size={40} aria-hidden="true" />
              </div>
              <h3 className="download-title">Vendor Security Questionnaire</h3>
              <p className="download-description">
                Pre-filled vendor security questionnaire (VSQ) for procurement and security teams.
              </p>
              <div className="download-meta">
                <span className="download-size">PDF, 1.1 MB</span>
                <span className="download-link">
                  Download <Icon name="arrowRight" size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 12. SECURITY CONTACT & BUG BOUNTY */}
      <section className="security-contact-section" aria-labelledby="contact-title">
        <div className="container">
          <div className="section-header">
            <h2 id="contact-title" className="section-title">
              Security Contact & Responsible Disclosure
            </h2>
            <p className="section-subtitle">
              Report security vulnerabilities or contact our security team with questions.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <Icon name="mail" size={40} aria-hidden="true" />
              </div>
              <h3 className="contact-title">Security Team</h3>
              <p className="contact-description">
                For security questions, compliance documentation requests, or security assessment inquiries.
              </p>
              <a href="mailto:security@artifically.com" className="contact-email">
                security@artifically.com
              </a>
              <p className="contact-response-time">
                Response within 24 hours during business days
              </p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <Icon name="alertTriangle" size={40} aria-hidden="true" />
              </div>
              <h3 className="contact-title">Vulnerability Reporting</h3>
              <p className="contact-description">
                Found a security vulnerability? Please report it responsibly. We commit to responding
                within 24 hours.
              </p>
              <a href="mailto:security@artifically.com" className="contact-email">
                security@artifically.com
              </a>
              <p className="contact-response-time">
                PGP key available on request for encrypted communications
              </p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <Icon name="target" size={40} aria-hidden="true" />
              </div>
              <h3 className="contact-title">Bug Bounty Program</h3>
              <p className="contact-description">
                We partner with HackerOne for our bug bounty program. Rewards for valid security
                vulnerabilities up to $10,000.
              </p>
              <a
                href="https://hackerone.com/artifically"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                View Program Details <Icon name="arrowRight" size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="responsible-disclosure">
            <h3 className="disclosure-title">Responsible Disclosure Guidelines</h3>
            <div className="disclosure-content">
              <div className="disclosure-do">
                <h4 className="disclosure-subtitle">
                  <Icon name="check" size={20} aria-hidden="true" />
                  Please Do
                </h4>
                <ul className="disclosure-list">
                  <li>Report vulnerabilities via security@artifically.com</li>
                  <li>Provide detailed reproduction steps</li>
                  <li>Allow us reasonable time to fix before disclosure</li>
                  <li>Act in good faith to avoid privacy violations</li>
                  <li>Use test accounts, not real customer data</li>
                </ul>
              </div>

              <div className="disclosure-dont">
                <h4 className="disclosure-subtitle">
                  <Icon name="alertTriangle" size={20} aria-hidden="true" />
                  Please Don't
                </h4>
                <ul className="disclosure-list">
                  <li>Access or modify customer data</li>
                  <li>Perform testing that degrades service</li>
                  <li>Publicly disclose before we've fixed the issue</li>
                  <li>Violate privacy or destroy data</li>
                  <li>Use social engineering or phishing attacks</li>
                </ul>
              </div>
            </div>

            <p className="disclosure-commitment">
              <strong>Our Commitment:</strong> We will not pursue legal action against security researchers
              who follow these guidelines. Valid vulnerabilities will be acknowledged and researchers
              credited (with permission) in our security hall of fame.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="security-final-cta" aria-labelledby="final-cta-title">
        <div className="container">
          <div className="final-cta-icon">
            <Icon name="messageCircle" size={56} aria-hidden="true" />
          </div>

          <h2 id="final-cta-title" className="final-cta-title">
            Questions About Our Security Posture?
          </h2>

          <p className="final-cta-description">
            Our security team is available to answer any questions about our security architecture,
            compliance certifications, or data protection practices. Schedule a security review or
            request additional documentation.
          </p>

          <div className="final-cta-buttons">
            <Link href="/contact?type=security" className="btn btn-primary btn-large">
              <Icon name="mail" size={20} aria-hidden="true" />
              Contact Security Team
            </Link>
            <Link href="/demo" className="btn btn-secondary btn-large btn-white">
              <Icon name="calendar" size={20} aria-hidden="true" />
              Schedule Security Review
            </Link>
          </div>

          <div className="final-cta-emergency">
            <p className="emergency-text">
              <Icon name="alertTriangle" size={18} aria-hidden="true" />
              Security incidents or vulnerabilities? Report immediately to{" "}
              <a href="mailto:security@artifically.com" className="emergency-link">
                security@artifically.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .security-page {
          --color-primary: #2563eb;
          --color-primary-dark: #1d4ed8;
          --color-secondary: #7c3aed;
          --color-success: #059669;
          --color-warning: #d97706;
          --color-danger: #dc2626;
          --color-text: #1f2937;
          --color-text-light: #6b7280;
          --color-bg: #ffffff;
          --color-bg-light: #f9fafb;
          --color-bg-dark: #f3f4f6;
          --color-border: #e5e7eb;
          --spacing-unit: 8px;
          --border-radius: 12px;
          --border-radius-lg: 16px;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .security-page {
            --color-text: #f9fafb;
            --color-text-light: #d1d5db;
            --color-bg: #111827;
            --color-bg-light: #1f2937;
            --color-bg-dark: #374151;
            --color-border: #374151;
          }
        }

        /* Container */
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 calc(var(--spacing-unit) * 3);
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: calc(var(--spacing-unit) * 8);
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
          line-height: 1.2;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: var(--color-text-light);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* HERO SECTION */
        .security-hero {
          background: linear-gradient(135deg, #eff6ff 0%, #f9fafb 50%, #faf5ff 100%);
          padding: calc(var(--spacing-unit) * 15) 0 calc(var(--spacing-unit) * 10);
          text-align: center;
          border-bottom: 1px solid var(--color-border);
        }

        .hero-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: calc(var(--spacing-unit) * 4);
        }

        .hero-icon-wrapper :global(svg) {
          color: var(--color-primary);
          background: white;
          padding: calc(var(--spacing-unit) * 3);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .headline {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 3);
          line-height: 1.1;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subheadline {
          font-size: 1.5rem;
          color: var(--color-text-light);
          max-width: 900px;
          margin: 0 auto calc(var(--spacing-unit) * 6);
          line-height: 1.6;
        }

        .cta-group {
          display: flex;
          gap: calc(var(--spacing-unit) * 2);
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: calc(var(--spacing-unit) * 6);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 1.5);
          padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius);
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s ease;
          text-decoration: none;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .btn-large {
          padding: calc(var(--spacing-unit) * 2.5) calc(var(--spacing-unit) * 5);
          font-size: 1.125rem;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
          box-shadow: var(--shadow-md);
        }

        .btn-primary:hover {
          background: var(--color-primary-dark);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: white;
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        .btn-secondary:hover {
          background: #eff6ff;
        }

        .btn-white {
          background: white;
          color: var(--color-primary);
        }

        .btn-white:hover {
          background: #f9fafb;
        }

        .trust-badges {
          display: flex;
          gap: calc(var(--spacing-unit) * 3);
          justify-content: center;
          flex-wrap: wrap;
          padding-top: calc(var(--spacing-unit) * 4);
          border-top: 1px solid var(--color-border);
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 1);
          padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2.5);
          background: white;
          border-radius: calc(var(--border-radius) / 2);
          box-shadow: var(--shadow-sm);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--color-text);
        }

        .trust-badge :global(svg) {
          color: var(--color-success);
        }

        /* CERTIFICATIONS SECTION */
        .certifications-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg);
        }

        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: calc(var(--spacing-unit) * 3);
        }

        .cert-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 2px solid var(--color-border);
          transition: all 0.3s ease;
        }

        .cert-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .cert-badge {
          display: inline-block;
          padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 2);
          background: var(--color-primary);
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          border-radius: calc(var(--border-radius) / 2);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .cert-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .cert-description {
          color: var(--color-text-light);
          line-height: 1.6;
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .cert-meta {
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
          padding-top: calc(var(--spacing-unit) * 2);
          border-top: 1px solid var(--color-border);
        }

        .cert-date {
          display: flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 1);
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .cert-link {
          color: var(--color-primary);
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 0.5);
          transition: gap 0.2s ease;
        }

        .cert-link:hover {
          gap: calc(var(--spacing-unit) * 1);
        }

        /* ENCRYPTION SECTION */
        .encryption-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg-light);
        }

        .encryption-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
        }

        .encryption-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .encryption-card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
        }

        .encryption-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .encryption-icon :global(svg) {
          color: var(--color-primary);
        }

        .encryption-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .encryption-description {
          color: var(--color-text-light);
          line-height: 1.6;
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .encryption-specs {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .encryption-specs li {
          padding: calc(var(--spacing-unit) * 1) 0;
          color: var(--color-text-light);
          font-size: 0.875rem;
          padding-left: calc(var(--spacing-unit) * 2);
          position: relative;
        }

        .encryption-specs li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: 700;
        }

        /* ACCESS SECTION */
        .access-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg);
        }

        .access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
        }

        .access-card {
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          transition: all 0.3s ease;
        }

        .access-card:hover {
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }

        .access-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .access-icon :global(svg) {
          color: var(--color-primary);
        }

        .access-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .access-description {
          color: var(--color-text-light);
          line-height: 1.6;
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .access-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
        }

        .access-features li {
          display: flex;
          align-items: flex-start;
          gap: calc(var(--spacing-unit) * 1.5);
          color: var(--color-text-light);
          font-size: 0.9375rem;
        }

        .access-features li :global(svg) {
          color: var(--color-success);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* INFRASTRUCTURE SECTION */
        .infrastructure-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg-light);
        }

        .infrastructure-list {
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 3);
          max-width: 1000px;
          margin: 0 auto;
        }

        .infrastructure-item {
          display: flex;
          gap: calc(var(--spacing-unit) * 3);
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          transition: all 0.3s ease;
        }

        .infrastructure-item:hover {
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }

        .infrastructure-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
        }

        .infrastructure-icon :global(svg) {
          color: var(--color-primary);
        }

        .infrastructure-content {
          flex: 1;
        }

        .infrastructure-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 1.5);
        }

        .infrastructure-description {
          color: var(--color-text-light);
          line-height: 1.7;
        }

        /* APPLICATION SECURITY SECTION */
        .application-security-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg);
        }

        .app-security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
        }

        .app-security-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          transition: all 0.3s ease;
        }

        .app-security-card:hover {
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }

        .app-security-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .app-security-icon :global(svg) {
          color: var(--color-primary);
        }

        .app-security-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .app-security-description {
          color: var(--color-text-light);
          line-height: 1.6;
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .app-security-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
        }

        .app-security-list li {
          display: flex;
          align-items: flex-start;
          gap: calc(var(--spacing-unit) * 1.5);
          color: var(--color-text-light);
          font-size: 0.9375rem;
        }

        .app-security-list li :global(svg) {
          color: var(--color-success);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* PRIVACY SECTION */
        .privacy-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg-light);
        }

        .residency-header {
          text-align: center;
          margin-bottom: calc(var(--spacing-unit) * 6);
        }

        .residency-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .residency-subtitle {
          font-size: 1.125rem;
          color: var(--color-text-light);
          max-width: 700px;
          margin: 0 auto;
        }

        .residency-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: calc(var(--spacing-unit) * 3);
          margin-bottom: calc(var(--spacing-unit) * 8);
        }

        .residency-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          text-align: center;
        }

        .residency-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 50%;
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .residency-icon :global(svg) {
          color: var(--color-primary);
        }

        .residency-region {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .residency-locations {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
        }

        .residency-locations li {
          color: var(--color-text-light);
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        .privacy-policies {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
        }

        .privacy-policy-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }

        .privacy-policy-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .privacy-policy-icon :global(svg) {
          color: var(--color-primary);
        }

        .privacy-policy-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .privacy-policy-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
        }

        .privacy-policy-list li {
          display: flex;
          align-items: flex-start;
          gap: calc(var(--spacing-unit) * 1.5);
          color: var(--color-text-light);
          font-size: 0.9375rem;
        }

        .privacy-policy-list li :global(svg) {
          color: var(--color-success);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .privacy-link {
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: underline;
        }

        .privacy-link:hover {
          text-decoration: none;
        }

        /* MONITORING SECTION */
        .monitoring-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg);
        }

        .response-times {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: calc(var(--spacing-unit) * 3);
          margin-bottom: calc(var(--spacing-unit) * 10);
        }

        .response-time-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 2px solid var(--color-border);
          text-align: center;
          transition: all 0.3s ease;
        }

        .response-time-card.critical {
          border-color: var(--color-danger);
        }

        .response-time-card.high {
          border-color: var(--color-warning);
        }

        .response-time-card.medium {
          border-color: var(--color-primary);
        }

        .response-time-card.notification {
          border-color: var(--color-success);
        }

        .response-time-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .response-time-badge {
          display: inline-block;
          padding: calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5);
          background: var(--color-bg-light);
          border-radius: calc(var(--border-radius) / 2);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .response-time-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .response-time-description {
          color: var(--color-text-light);
          font-size: 0.9375rem;
          line-height: 1.5;
        }

        .monitoring-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
        }

        .monitoring-feature {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }

        .monitoring-feature-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .monitoring-feature-icon :global(svg) {
          color: var(--color-primary);
        }

        .monitoring-feature-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .monitoring-feature-description {
          color: var(--color-text-light);
          line-height: 1.6;
        }

        .status-link {
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: underline;
        }

        .status-link:hover {
          text-decoration: none;
        }

        /* AUDIT LOGS SECTION */
        .audit-logs-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg-light);
        }

        .audit-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
        }

        .audit-feature-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }

        .audit-feature-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .audit-feature-icon :global(svg) {
          color: var(--color-primary);
        }

        .audit-feature-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .audit-feature-description {
          color: var(--color-text-light);
          line-height: 1.6;
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .audit-feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
        }

        .audit-feature-list li {
          color: var(--color-text-light);
          font-size: 0.9375rem;
          padding-left: calc(var(--spacing-unit) * 2);
          position: relative;
        }

        .audit-feature-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: 700;
        }

        /* BCDR SECTION */
        .bcdr-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg);
        }

        .bcdr-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: calc(var(--spacing-unit) * 3);
          margin-bottom: calc(var(--spacing-unit) * 10);
        }

        .bcdr-stat {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 2px solid #bfdbfe;
          text-align: center;
        }

        .bcdr-stat-value {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: calc(var(--spacing-unit) * 1);
        }

        .bcdr-stat-label {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 1);
        }

        .bcdr-stat-description {
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .bcdr-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
        }

        .bcdr-detail-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }

        .bcdr-detail-title {
          display: flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 1.5);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .bcdr-detail-title :global(svg) {
          color: var(--color-primary);
        }

        .bcdr-detail-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
        }

        .bcdr-detail-list li {
          display: flex;
          align-items: flex-start;
          gap: calc(var(--spacing-unit) * 1.5);
          color: var(--color-text-light);
          font-size: 0.9375rem;
        }

        .bcdr-detail-list li :global(svg) {
          color: var(--color-success);
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* DOWNLOADS SECTION */
        .downloads-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg-light);
        }

        .downloads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: calc(var(--spacing-unit) * 3);
        }

        .download-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 2px solid var(--color-border);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .download-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .download-card-request {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #fbbf24;
        }

        .download-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 2);
          align-self: flex-start;
        }

        .download-icon :global(svg) {
          color: var(--color-primary);
        }

        .download-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .download-description {
          color: var(--color-text-light);
          line-height: 1.6;
          margin-bottom: calc(var(--spacing-unit) * 3);
          flex: 1;
        }

        .download-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: calc(var(--spacing-unit) * 2);
          border-top: 1px solid var(--color-border);
        }

        .download-size {
          font-size: 0.875rem;
          color: var(--color-text-light);
          font-weight: 500;
        }

        .download-link {
          color: var(--color-primary);
          font-weight: 600;
          font-size: 0.9375rem;
          display: inline-flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 0.5);
        }

        /* SECURITY CONTACT SECTION */
        .security-contact-section {
          padding: calc(var(--spacing-unit) * 12) 0;
          background: var(--color-bg);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
          margin-bottom: calc(var(--spacing-unit) * 8);
        }

        .contact-card {
          background: white;
          padding: calc(var(--spacing-unit) * 4);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          text-align: center;
        }

        .contact-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 2);
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: var(--border-radius);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .contact-icon :global(svg) {
          color: var(--color-primary);
        }

        .contact-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .contact-description {
          color: var(--color-text-light);
          line-height: 1.6;
          margin-bottom: calc(var(--spacing-unit) * 3);
        }

        .contact-email {
          display: inline-block;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-primary);
          text-decoration: none;
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .contact-email:hover {
          text-decoration: underline;
        }

        .contact-response-time {
          font-size: 0.875rem;
          color: var(--color-text-light);
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 0.5);
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: none;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .responsible-disclosure {
          background: white;
          padding: calc(var(--spacing-unit) * 6);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }

        .disclosure-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--color-text);
          text-align: center;
          margin-bottom: calc(var(--spacing-unit) * 4);
        }

        .disclosure-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: calc(var(--spacing-unit) * 4);
          margin-bottom: calc(var(--spacing-unit) * 4);
        }

        .disclosure-subtitle {
          display: flex;
          align-items: center;
          gap: calc(var(--spacing-unit) * 1);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: calc(var(--spacing-unit) * 2);
        }

        .disclosure-do .disclosure-subtitle :global(svg) {
          color: var(--color-success);
        }

        .disclosure-dont .disclosure-subtitle :global(svg) {
          color: var(--color-danger);
        }

        .disclosure-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: calc(var(--spacing-unit) * 1.5);
        }

        .disclosure-list li {
          color: var(--color-text-light);
          font-size: 0.9375rem;
          padding-left: calc(var(--spacing-unit) * 2);
          position: relative;
        }

        .disclosure-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: 700;
        }

        .disclosure-commitment {
          padding: calc(var(--spacing-unit) * 3);
          background: var(--color-bg-light);
          border-radius: var(--border-radius);
          color: var(--color-text-light);
          line-height: 1.7;
          text-align: center;
        }

        /* FINAL CTA SECTION */
        .security-final-cta {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          padding: calc(var(--spacing-unit) * 12) 0;
          text-align: center;
          color: white;
        }

        .final-cta-icon {
          display: inline-flex;
          padding: calc(var(--spacing-unit) * 3);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-lg);
          margin-bottom: calc(var(--spacing-unit) * 4);
        }

        .final-cta-icon :global(svg) {
          color: white;
        }

        .final-cta-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: calc(var(--spacing-unit) * 3);
          line-height: 1.2;
        }

        .final-cta-description {
          font-size: 1.25rem;
          max-width: 800px;
          margin: 0 auto calc(var(--spacing-unit) * 6);
          line-height: 1.6;
          opacity: 0.95;
        }

        .final-cta-buttons {
          display: flex;
          gap: calc(var(--spacing-unit) * 2);
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: calc(var(--spacing-unit) * 6);
        }

        .final-cta-emergency {
          padding-top: calc(var(--spacing-unit) * 4);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .emergency-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: calc(var(--spacing-unit) * 1);
          font-size: 1rem;
          opacity: 0.9;
        }

        .emergency-link {
          color: white;
          font-weight: 600;
          text-decoration: underline;
        }

        .emergency-link:hover {
          text-decoration: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .headline {
            font-size: 2.5rem;
          }

          .subheadline {
            font-size: 1.125rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-subtitle {
            font-size: 1rem;
          }

          .trust-badges {
            gap: calc(var(--spacing-unit) * 1.5);
          }

          .trust-badge {
            font-size: 0.75rem;
            padding: calc(var(--spacing-unit) * 1) calc(var(--spacing-unit) * 1.5);
          }

          .certifications-grid,
          .encryption-grid,
          .access-grid,
          .app-security-grid,
          .residency-grid,
          .privacy-policies,
          .monitoring-features,
          .audit-features-grid,
          .bcdr-details,
          .downloads-grid,
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .cta-group,
          .final-cta-buttons {
            flex-direction: column;
          }

          .btn-large {
            width: 100%;
          }

          .final-cta-title {
            font-size: 2rem;
          }

          .final-cta-description {
            font-size: 1rem;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .cert-card,
          .encryption-card,
          .access-card,
          .infrastructure-item,
          .app-security-card,
          .residency-card,
          .privacy-policy-card,
          .response-time-card,
          .monitoring-feature,
          .audit-feature-card,
          .bcdr-detail-card,
          .download-card,
          .contact-card,
          .responsible-disclosure {
            border-width: 2px;
          }
        }
      `}</style>
    </main>
  );
}
