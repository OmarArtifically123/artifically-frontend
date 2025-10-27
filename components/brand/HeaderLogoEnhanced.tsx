"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import LogoWordmarkEnhanced from "@/components/ui/LogoWordmark.enhanced";
import { CSSProperties, MouseEvent } from "react";

export default function HeaderLogoEnhanced({ 
  onClick 
}: { 
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void 
}) {
  const { theme, isContrast } = useTheme();
  const { isMobile, isTablet } = useBreakpoint();

  // Determine logo variant based on theme
  const logoVariant = isContrast ? "contrast" : theme === "dark" ? "dark" : "light";

  // Determine size based on breakpoint
  const sizeStyles: CSSProperties = isMobile
    ? { width: "140px", height: "auto" }
    : isTablet
    ? { width: "180px", height: "auto" }
    : { width: "220px", height: "auto" };

  return (
    <Link
      href="/"
      aria-label="Artifically home"
      className="brand brand--interactive ai-brand-link"
      data-prefetch-route="/"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        transition: "opacity 0.2s ease",
      }}
    >
      <LogoWordmarkEnhanced
        variant={logoVariant}
        animated={false} // Disable animations in header for performance
        className="ai-brand"
        style={sizeStyles}
      />
    </Link>
  );
}

