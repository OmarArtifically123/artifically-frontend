"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import LogoWordmarkEnhanced from "@/components/ui/LogoWordmark.enhanced";
import { CSSProperties } from "react";

export default function FooterLogoEnhanced() {
  const { theme, isContrast } = useTheme();

  // Determine logo variant based on theme
  const logoVariant = isContrast ? "contrast" : theme === "dark" ? "dark" : "light";

  const logoStyles: CSSProperties = {
    width: "280px",
    height: "auto",
    maxWidth: "100%",
  };

  return (
    <Link 
      href="/" 
      aria-label="Artifically home" 
      className="footer-brand-link"
      style={{
        display: "inline-block",
        transition: "opacity 0.2s ease",
      }}
    >
      <LogoWordmarkEnhanced
        variant={logoVariant}
        animated={false} // Disable animations in footer
        style={logoStyles}
      />
    </Link>
  );
}

