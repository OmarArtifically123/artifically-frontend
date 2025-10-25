"use client";

import Link from "next/link";
import { useBreakpoint, usePrefersReducedMotion } from "@/hooks/useBreakpoint";
import { BrandLogo } from "./BrandLogo";
import { CSSProperties, MouseEvent } from "react";

export default function HeaderLogo({ onClick }: { onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const { isMobile, isTablet } = useBreakpoint();
  const reduceMotion = usePrefersReducedMotion();

  let variant: "icon" | "compact" | "full" = "full";
  if (isMobile) variant = "icon";
  else if (isTablet) variant = "compact";

  const sizeStyles: CSSProperties =
    variant === "icon"
      ? { width: 28, height: 28 }
      : variant === "compact"
      ? { height: 32, width: "auto" }
      : { height: 36, width: "auto" };

  return (
    <Link
      href="/"
      aria-label="Artifically home"
      className="brand brand--interactive ai-brand-link"
      data-prefetch-route="/"
      onClick={onClick}
    >
      <BrandLogo
        variant={variant}
        interactive={!reduceMotion}
        className="ai-brand"
        style={sizeStyles}
      />
    </Link>
  );
}

