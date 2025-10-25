import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Security & Compliance | Artifically',
  description: 'SOC 2 Type II certified, GDPR compliant, HIPAA ready. Enterprise security built in from day one.',
  openGraph: {
    title: 'Security & Compliance | Artifically',
    description: 'SOC 2 Type II certified, GDPR compliant, HIPAA ready. Enterprise security built in from day one.',
    type: 'website',
  },
};

export default function SecurityPage() {
  return (
    <main className="security-page">
      {/* 1. SECURITY HERO */}
      <section className="security-hero bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 border-b border-gray-200 dark:border-gray-700">
        <div className="container max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-2xl">
              <Icon name="shield" size={64} className="hero-icon text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Enterprise Security & Compliance Built In
          </h1>

          <p className="subheadline text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
            SOC 2 Type II certified, GDPR compliant, HIPAA ready.
            Your data is protected with bank-level security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/security-whitepaper.pdf"
              className="btn btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Download our comprehensive security whitepaper"
            >
              <Icon name="download" size={20} aria-hidden="true" />
              Download Security Whitepaper
            </Link>

            <Link
              href="/contact?type=security"
              className="btn btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Contact our security team"
            >
              <Icon name="mail" size={20} aria-hidden="true" />
              Contact Security Team
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CERTIFICATIONS & COMPLIANCE */}
      <section className="security-certifications py-20 bg-white dark:bg-gray-900" aria-labelledby="certifications-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="certifications-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Certifications & Compliance
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We maintain the highest standards of security and compliance to protect your data and meet regulatory requirements.
            </p>
          </div>

          <div className="cert-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <article className="cert-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-lg mb-4 text-lg">
                SOC 2
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">SOC 2 Type II</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Annual audits by independent third party. Report available to qualified prospects under NDA.
              </p>
            </article>

            <article className="cert-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-purple-200 dark:border-purple-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-purple-600 text-white font-bold rounded-lg mb-4 text-lg">
                ISO
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">ISO 27001</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Information security management system certified. Continuous compliance monitoring.
              </p>
            </article>

            <article className="cert-card bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-green-200 dark:border-green-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-green-600 text-white font-bold rounded-lg mb-4 text-lg">
                GDPR
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">GDPR Compliant</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                EU data residency available. Data processing agreement (DPA) ready to sign.
              </p>
            </article>

            <article className="cert-card bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-red-200 dark:border-red-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-lg mb-4 text-lg">
                HIPAA
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">HIPAA Ready</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Business associate agreement (BAA) available. PHI handling compliant.
              </p>
            </article>

            <article className="cert-card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-yellow-600 text-white font-bold rounded-lg mb-4 text-lg">
                CCPA
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">CCPA Compliant</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                California privacy law compliant. Consumer data rights honored.
              </p>
            </article>

            <article className="cert-card bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg mb-4 text-lg">
                PDPL
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Saudi PDPL & UAE DPA</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Middle East data protection laws compliant. Regional data residency available.
              </p>
            </article>

            <article className="cert-card bg-gradient-to-br from-pink-50 to-pink-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-pink-200 dark:border-pink-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-pink-600 text-white font-bold rounded-lg mb-4 text-lg">
                PCI
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">PCI DSS Level 1</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Payment card industry compliant for handling payment data securely.
              </p>
            </article>

            <article className="cert-card bg-gradient-to-br from-teal-50 to-teal-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-teal-200 dark:border-teal-900 hover:shadow-lg transition-shadow duration-200">
              <div className="cert-badge inline-block px-4 py-2 bg-teal-600 text-white font-bold rounded-lg mb-4 text-lg">
                FedRAMP
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">FedRAMP Ready</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Federal Risk and Authorization Management Program ready for government agencies.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 3. DATA SECURITY & ENCRYPTION */}
      <section className="security-encryption py-20 bg-gray-50 dark:bg-gray-800" aria-labelledby="encryption-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="encryption-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Data Security & Encryption
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Military-grade encryption protects your data at every layer, from storage to transmission.
            </p>
          </div>

          <div className="security-features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="feature bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon name="lock" size={32} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Encryption at Rest</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                AES-256 encryption for all data stored in databases and file systems. Industry-standard encryption ensures your data is unreadable without proper authorization.
              </p>
            </article>

            <article className="feature bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Icon name="shield" size={32} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Encryption in Transit</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                TLS 1.3 for all data transmission. Perfect forward secrecy enabled to protect past sessions from future compromise.
              </p>
            </article>

            <article className="feature bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Icon name="key" size={32} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Key Management</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Hardware security modules (HSM) for encryption key storage and rotation. Keys are never stored in plain text.
              </p>
            </article>

            <article className="feature bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Icon name="database" size={32} className="text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data Isolation</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Complete tenant separation. Your data never commingles with other customers. Dedicated schemas and encryption keys per tenant.
              </p>
            </article>

            <article className="feature bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Icon name="hardDrive" size={32} className="text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Backup Encryption</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                All backups encrypted with AES-256. Hourly incremental backups, daily full backups. Geographic redundancy across multiple regions.
              </p>
            </article>

            <article className="feature bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <Icon name="server" size={32} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Database Encryption</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Field-level encryption for sensitive data (PII, credentials, API keys) plus full-disk encryption at the storage layer.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4. ACCESS MANAGEMENT */}
      <section className="security-access py-20 bg-white dark:bg-gray-900" aria-labelledby="access-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="access-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Access Management & Authentication
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Enterprise-grade identity and access management with single sign-on, multi-factor authentication, and granular permissions.
            </p>
          </div>

          <div className="access-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="access-feature bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                <Icon name="users" size={24} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Single Sign-On (SSO)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                SAML 2.0, OAuth 2.0, OpenID Connect support. Seamlessly integrate with your existing identity provider.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Okta, Azure AD, Google Workspace</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>OneLogin, Auth0, Ping Identity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Custom SAML 2.0 providers</span>
                </li>
              </ul>
            </article>

            <article className="access-feature bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                <Icon name="fingerprint" size={24} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                Multi-Factor Authentication
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Required for all users by default. Multiple authentication methods supported for maximum security.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Authenticator apps (Google, Microsoft, Authy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>SMS and email verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Hardware security keys (YubiKey, FIDO2)</span>
                </li>
              </ul>
            </article>

            <article className="access-feature bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                <Icon name="userCheck" size={24} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                SCIM Provisioning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Automated user lifecycle management. Provision and deprovision users directly from your identity provider.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Automatic user creation and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Instant deprovisioning on termination</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Group and role synchronization</span>
                </li>
              </ul>
            </article>

            <article className="access-feature bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                <Icon name="shield" size={24} className="text-red-600 dark:text-red-400" aria-hidden="true" />
                Role-Based Access Control
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Granular permissions system. Control access at the workflow, agent, and data level.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Admin, Editor, Viewer default roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Custom role creation with fine-grained permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Team-based access isolation</span>
                </li>
              </ul>
            </article>

            <article className="access-feature bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                <Icon name="clock" size={24} className="text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                Session Management
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Secure session handling with automatic timeout and device tracking for audit compliance.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>15-minute timeout after inactivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Device and location tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>Remote session termination capability</span>
                </li>
              </ul>
            </article>

            <article className="access-feature bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                <Icon name="code" size={24} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                API Authentication
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Secure API access with OAuth 2.0, API keys, and comprehensive rate limiting.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>OAuth 2.0 with client credentials flow</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>API keys with automatic rotation policies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span>IP whitelisting and rate limiting</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 5. INFRASTRUCTURE SECURITY */}
      <section className="security-infrastructure py-20 bg-gray-50 dark:bg-gray-800" aria-labelledby="infrastructure-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="infrastructure-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Infrastructure Security
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Built on world-class infrastructure with multiple layers of security controls and monitoring.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <ul className="infra-list space-y-4" role="list">
              <li className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                  <Icon name="cloud" size={20} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <strong className="text-lg text-gray-900 dark:text-white">Cloud Hosting:</strong>
                  <span className="text-gray-700 dark:text-gray-300 ml-2">
                    Multi-cloud infrastructure on AWS and Azure SOC 2 Type II certified data centers with 99.99% uptime SLA. Automatic failover between regions.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                  <Icon name="network" size={20} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                </div>
                <div>
                  <strong className="text-lg text-gray-900 dark:text-white">Network Security:</strong>
                  <span className="text-gray-700 dark:text-gray-300 ml-2">
                    Virtual Private Cloud (VPC) isolation, subnet segregation, network ACLs, and firewall rules. Zero-trust network architecture with micro-segmentation.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                  <Icon name="shield" size={20} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
                <div>
                  <strong className="text-lg text-gray-900 dark:text-white">DDoS Protection:</strong>
                  <span className="text-gray-700 dark:text-gray-300 ml-2">
                    Cloudflare Enterprise with 100+ Tbps network capacity. Automatic DDoS mitigation at edge locations worldwide. Application-layer protection included.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg flex-shrink-0">
                  <Icon name="eye" size={20} className="text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div>
                  <strong className="text-lg text-gray-900 dark:text-white">Intrusion Detection:</strong>
                  <span className="text-gray-700 dark:text-gray-300 ml-2">
                    24/7 security monitoring with AI-powered threat detection. Automated alerting to security operations center (SOC) with &lt;5 minute response time.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex-shrink-0">
                  <Icon name="search" size={20} className="text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                </div>
                <div>
                  <strong className="text-lg text-gray-900 dark:text-white">Vulnerability Scanning:</strong>
                  <span className="text-gray-700 dark:text-gray-300 ml-2">
                    Weekly automated vulnerability scans of all systems and applications. Continuous dependency scanning for known CVEs with automatic patching.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex-shrink-0">
                  <Icon name="target" size={20} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                </div>
                <div>
                  <strong className="text-lg text-gray-900 dark:text-white">Penetration Testing:</strong>
                  <span className="text-gray-700 dark:text-gray-300 ml-2">
                    Annual third-party penetration testing by certified ethical hackers. Continuous bug bounty program with HackerOne for ongoing security validation.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. MONITORING & INCIDENT RESPONSE */}
      <section className="security-monitoring py-20 bg-white dark:bg-gray-900" aria-labelledby="monitoring-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="monitoring-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Monitoring & Incident Response
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Proactive threat detection and rapid incident response to keep your data safe 24/7.
            </p>
          </div>

          <div className="monitoring-features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="mon-feature text-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                  <Icon name="activity" size={32} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">24/7 Security Operations Center</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Dedicated security team monitoring all systems around the clock. Global coverage with follow-the-sun operations model.
              </p>
            </article>

            <article className="mon-feature text-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-2xl">
                  <Icon name="alertTriangle" size={32} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Real-Time Threat Detection</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                AI-powered threat detection with machine learning anomaly detection. Behavioral analysis flags suspicious activity instantly.
              </p>
            </article>

            <article className="mon-feature text-center bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-2xl">
                  <Icon name="bell" size={32} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Automated Alerting</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Immediate alerts for security events via PagerDuty, Slack, and email. Configurable alert thresholds and escalation policies.
              </p>
            </article>

            <article className="mon-feature text-center bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 dark:bg-red-900 rounded-2xl">
                  <Icon name="fileText" size={32} className="text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Incident Response Plan</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Documented incident response procedures. Critical incidents: &lt;15 minutes response time. High priority: &lt;1 hour.
              </p>
            </article>

            <article className="mon-feature text-center bg-gradient-to-br from-yellow-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-2xl">
                  <Icon name="externalLink" size={32} className="text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Public Status Page</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Real-time system status at <a href="https://status.artifically.com" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">status.artifically.com</a>. Subscribe for email, SMS, or Slack updates.
              </p>
            </article>

            <article className="mon-feature text-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-2xl">
                  <Icon name="mail" size={32} className="text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Incident Communication</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Transparent communication during incidents. Email and Slack notifications within 30 minutes with hourly updates until resolution.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 7. PRIVACY & DATA RESIDENCY */}
      <section className="security-privacy py-20 bg-gray-50 dark:bg-gray-800" aria-labelledby="privacy-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="privacy-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Privacy & Data Residency
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Your data stays where you need it, with full control over retention and deletion policies.
            </p>
          </div>

          <div className="privacy-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="privacy-card bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon name="globe" size={32} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Data Residency Options</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Choose where your data is stored to meet regulatory and compliance requirements:
              </p>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Icon name="mapPin" size={18} className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">United States:</strong>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">AWS us-east-1 (Virginia), us-west-2 (Oregon)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="mapPin" size={18} className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">European Union:</strong>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">AWS eu-west-1 (Ireland), eu-central-1 (Frankfurt)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="mapPin" size={18} className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Middle East:</strong>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">AWS me-south-1 (Bahrain), UAE North (Dubai)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="mapPin" size={18} className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Asia Pacific:</strong>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">AWS ap-southeast-1 (Singapore), ap-northeast-1 (Tokyo)</span>
                  </div>
                </li>
              </ul>
            </article>

            <article className="privacy-card bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Icon name="clock" size={32} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Data Retention</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Flexible retention policies to meet your compliance and business needs:
              </p>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Configurable retention: 30 days to 7 years</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Automatic deletion after retention period expires</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Legal hold capability for litigation support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Audit logs retained for compliance requirements</span>
                </li>
              </ul>
            </article>

            <article className="privacy-card bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Icon name="trash" size={32} className="text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Data Deletion</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Secure and verifiable data deletion processes:
              </p>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">30-day grace period for recovery after deletion request</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Permanent deletion with cryptographic erasure</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Deletion certification provided upon request</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">All backups securely destroyed per schedule</span>
                </li>
              </ul>
            </article>

            <article className="privacy-card bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Icon name="fileText" size={32} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Rights</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We honor all privacy rights under GDPR, CCPA, and other regulations:
              </p>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Right to access: Export your data in machine-readable format</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Right to portability: Transfer data to another provider</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Right to erasure: Delete all personal data on request</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Transparent privacy policy with plain-language explanations</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 8. BUSINESS CONTINUITY */}
      <section className="security-continuity py-20 bg-white dark:bg-gray-900" aria-labelledby="continuity-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="continuity-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Business Continuity & Disaster Recovery
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Enterprise-grade reliability with guaranteed uptime and rapid recovery capabilities.
            </p>
          </div>

          <div className="continuity-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="stat bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-900 text-center">
              <div className="stat-value text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">99.98%</div>
              <div className="stat-label text-gray-700 dark:text-gray-300 font-semibold">Uptime SLA (Enterprise)</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Financially backed guarantee</p>
            </div>

            <div className="stat bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border-2 border-purple-200 dark:border-purple-900 text-center">
              <div className="stat-value text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">&lt;4h</div>
              <div className="stat-label text-gray-700 dark:text-gray-300 font-semibold">Recovery Time Objective</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Maximum downtime target</p>
            </div>

            <div className="stat bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border-2 border-green-200 dark:border-green-900 text-center">
              <div className="stat-value text-5xl font-bold text-green-600 dark:text-green-400 mb-2">&lt;1h</div>
              <div className="stat-label text-gray-700 dark:text-gray-300 font-semibold">Recovery Point Objective</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Maximum data loss window</p>
            </div>

            <div className="stat bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border-2 border-red-200 dark:border-red-900 text-center">
              <div className="stat-value text-4xl font-bold text-red-600 dark:text-red-400 mb-2">Multi-Region</div>
              <div className="stat-label text-gray-700 dark:text-gray-300 font-semibold">Redundancy & Failover</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Automatic geographic failover</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Disaster Recovery Plan</h3>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Automated failover to secondary region within 15 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Quarterly disaster recovery drills and testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Documented runbooks for all failure scenarios</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Cross-region database replication with continuous sync</span>
                </li>
              </ul>
            </article>

            <article className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Backup Strategy</h3>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Hourly incremental backups, daily full backups</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">30-day backup retention, longer available on request</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Geographic redundancy across 3+ regions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" size={18} className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">Point-in-time recovery to any moment in last 30 days</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* 9. DOWNLOADS & RESOURCES */}
      <section className="security-downloads py-20 bg-gray-50 dark:bg-gray-800" aria-labelledby="downloads-heading">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 id="downloads-heading" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Downloads & Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Access our security documentation, compliance reports, and procurement resources.
            </p>
          </div>

          <div className="download-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/security-whitepaper.pdf"
              className="download-card group bg-white dark:bg-gray-900 p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-200"
              aria-label="Download security whitepaper"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Icon name="fileText" size={32} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Security Whitepaper</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Comprehensive security architecture overview and best practices (PDF, 2.4MB)
              </p>
              <span className="download-link text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Download PDF
                <Icon name="arrowRight" size={16} aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/dpa-template.pdf"
              className="download-card group bg-white dark:bg-gray-900 p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all duration-200"
              aria-label="Download data processing agreement"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Icon name="fileText" size={32} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Data Processing Agreement</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                GDPR-compliant DPA template ready for your legal team (PDF, 1.8MB)
              </p>
              <span className="download-link text-purple-600 dark:text-purple-400 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Download PDF
                <Icon name="arrowRight" size={16} aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/contact?type=soc2"
              className="download-card group bg-white dark:bg-gray-900 p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-xl transition-all duration-200"
              aria-label="Request SOC 2 report"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Icon name="shield" size={32} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">SOC 2 Type II Report</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Available to qualified prospects under mutual NDA
              </p>
              <span className="download-link text-green-600 dark:text-green-400 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Request Access
                <Icon name="arrowRight" size={16} aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/security-questionnaire.pdf"
              className="download-card group bg-white dark:bg-gray-900 p-8 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:shadow-xl transition-all duration-200"
              aria-label="Download vendor security questionnaire"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  <Icon name="clipboardCheck" size={32} className="text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Vendor Security Questionnaire</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Pre-filled VSQ for procurement teams (PDF, 1.2MB)
              </p>
              <span className="download-link text-red-600 dark:text-red-400 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Download PDF
                <Icon name="arrowRight" size={16} aria-hidden="true" />
              </span>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need additional documentation or custom security agreements?
            </p>
            <Link
              href="/contact?type=security"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Contact our security team
              <Icon name="arrowRight" size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="security-cta py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white" aria-labelledby="cta-heading">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Icon name="messageCircle" size={48} className="text-white" aria-hidden="true" />
            </div>
          </div>

          <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold mb-6">
            Questions About Our Security?
          </h2>

          <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Our security team is available to answer any questions about our security posture, compliance certifications, or data protection practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?type=security"
              className="btn btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              aria-label="Contact our security team"
            >
              <Icon name="mail" size={20} aria-hidden="true" />
              Contact Security Team
            </Link>

            <Link
              href="/demo"
              className="btn btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="Schedule a security review"
            >
              <Icon name="calendar" size={20} aria-hidden="true" />
              Schedule Security Review
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-4">
              Security incidents or vulnerabilities? Report them responsibly:
            </p>
            <a
              href="mailto:security@artifically.com"
              className="text-white font-semibold hover:underline inline-flex items-center gap-2"
            >
              <Icon name="alertTriangle" size={18} aria-hidden="true" />
              security@artifically.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
