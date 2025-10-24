import DocumentationPage from "@/components/documentation/DocumentationPage";

export const metadata = {
  title: "Documentation | Artifically",
  description:
    "Complete technical documentation for Artifically. Tutorials, how-to guides, API reference, and core concepts for developers and operators.",
};

export default function DocsRoute() {
  return <DocumentationPage />;
}