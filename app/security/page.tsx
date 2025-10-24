import SecurityCompliancePage from "@/components/security/SecurityCompliancePage";

export const metadata = {
  title: "Security & Compliance | Artifically",
  description:
    "Enterprise-grade security, compliance certifications (SOC 2, ISO 27001, GDPR, HIPAA), and data protection built into every layer of the Artifically platform.",
};

export default function SecurityRoute() {
  return <SecurityCompliancePage />;
}