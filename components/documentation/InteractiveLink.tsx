"use client";

import Link from "next/link";
import { ReactNode, CSSProperties, useState } from "react";

interface InteractiveLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
}

export default function InteractiveLink({
  href,
  children,
  className = "",
  style = {},
  hoverStyle = {},
}: InteractiveLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      style={{
        ...style,
        ...(isHovered ? hoverStyle : {}),
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
