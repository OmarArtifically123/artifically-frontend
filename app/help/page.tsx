import HelpCenterLanding from "@/components/help/HelpCenterLanding";

export const metadata = {
  title: "Help Center | Artifically",
  description:
    "Self-serve resources, guides, and documentation for Artifically. Find quick answers for operators, developers, and security teams.",
};

export default function HelpCenterRoute() {
  return <HelpCenterLanding />;
}