"use client";

import Link from "next/link";
import { useState, CSSProperties, ReactNode } from "react";

interface InteractiveButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  style?: CSSProperties;
}

export default function InteractiveButton({
  href,
  children,
  variant = "primary",
  style = {},
}: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: CSSProperties = {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s ease",
    ...style,
  };

  const variantStyle: CSSProperties =
    variant === "primary"
      ? {
          background: "var(--primary)",
          color: "white",
          opacity: isHovered ? 0.9 : 1,
        }
      : {
          background: isHovered
            ? "rgba(148, 163, 184, 0.1)"
            : "transparent",
          color: "var(--gray-100)",
          border: "1px solid rgba(148, 163, 184, 0.3)",
        };

  return (
    <Link
      href={href}
      style={{ ...baseStyle, ...variantStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
