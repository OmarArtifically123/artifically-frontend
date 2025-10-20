import { ReactNode, Suspense } from "react";

import AppShellClient from "@/components/AppShellClient";
import AppShellHeader from "@/components/AppShellHeader";
import AppShellMain from "@/components/AppShellMain";
import AppShellVerificationBanner from "@/components/AppShellVerificationBanner";
import Footer from "@/components/Footer";
import RouteShell from "@/components/skeletons/RouteShell";
import RouteTransitionBoundary from "@/components/RouteTransitionBoundary";

function FooterSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        minHeight: 320,
        padding: "4rem 1.5rem",
        background: "linear-gradient(180deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 100%)",
        borderTop: "1px solid rgba(148, 163, 184, 0.18)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gap: "2.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "grid", gap: "0.85rem" }}>
            <div
              style={{
                width: "60%",
                height: "1.25rem",
                borderRadius: "0.65rem",
                background: "linear-gradient(120deg, rgba(148,163,184,0.28), rgba(148,163,184,0.12))",
                animation: "pulse 1.6s ease-in-out infinite",
              }}
            />
            {Array.from({ length: 4 }).map((_, lineIndex) => (
              <div
                key={lineIndex}
                style={{
                  height: "0.85rem",
                  borderRadius: "0.65rem",
                  width: `${70 - lineIndex * 10}%`,
                  background: "linear-gradient(120deg, rgba(148,163,184,0.24), rgba(148,163,184,0.08))",
                  animation: "pulse 1.6s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <AppShellClient>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <AppShellHeader />
      <AppShellVerificationBanner />
      <AppShellMain>
        <RouteTransitionBoundary>
          <Suspense fallback={<RouteShell rows={6} />}>{children}</Suspense>
        </RouteTransitionBoundary>
      </AppShellMain>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </AppShellClient>
  );
}