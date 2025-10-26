"use client";

import { CSSProperties } from "react";

interface SectionSkeletonProps {
  height?: string | number;
  variant?: "default" | "hero" | "grid" | "columns";
  className?: string;
}

/**
 * Skeleton component that reserves space to prevent CLS
 * Uses CSS animations for smooth loading states
 */
export default function SectionSkeleton({
  height = "600px",
  variant = "default",
  className = "",
}: SectionSkeletonProps) {
  const containerStyle: CSSProperties = {
    minHeight: typeof height === "number" ? `${height}px` : height,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    position: "relative",
    overflow: "hidden",
  };

  const shimmerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
    animation: "shimmer 2s infinite",
  };

  // Render different skeleton variants
  const renderContent = () => {
    switch (variant) {
      case "hero":
        return (
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              padding: "0 24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              alignItems: "center",
            }}
          >
            {/* Title skeleton */}
            <div
              style={{
                width: "80%",
                height: "60px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
              }}
            />
            {/* Subtitle skeleton */}
            <div
              style={{
                width: "60%",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.04)",
              }}
            />
            {/* CTA buttons skeleton */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  width: "140px",
                  height: "48px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
              <div
                style={{
                  width: "140px",
                  height: "48px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            </div>
          </div>
        );

      case "grid":
        return (
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              padding: "0 24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: "200px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            ))}
          </div>
        );

      case "columns":
        return (
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              padding: "0 24px",
              display: "flex",
              gap: "32px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "400px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
              }}
            />
            <div
              style={{
                flex: 1,
                height: "400px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
              }}
            />
          </div>
        );

      default:
        return (
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                height: "100%",
                minHeight: "400px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className={className} style={containerStyle} aria-hidden="true">
      {renderContent()}
      <div style={shimmerStyle} />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

