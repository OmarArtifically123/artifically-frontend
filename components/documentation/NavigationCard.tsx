"use client";

import Link from "next/link";
import { useState, CSSProperties } from "react";
import { space } from "@/styles/spacing";

interface NavigationCardProps {
  href: string;
  direction: "prev" | "next";
  title: string;
  showOpposite?: boolean;
  style?: CSSProperties;
}

export default function NavigationCard({
  href,
  direction,
  title,
  showOpposite = false,
  style = {},
}: NavigationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isPrev = direction === "prev";
  const label = isPrev ? "← Previous" : showOpposite ? "← Next" : "Next →";

  return (
    <Link
      href={href}
      style={{ textDecoration: "none", color: "inherit", ...style }}
    >
      <div
        className="glass"
        style={{
          padding: space("md"),
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: isHovered ? "rgba(148, 163, 184, 0.05)" : "",
          textAlign: showOpposite ? "right" : "left",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            fontSize: "0.85rem",
            color: "var(--gray-500)",
            marginBottom: space("xs", 0.5),
          }}
        >
          {label}
        </div>
        <div style={{ fontWeight: 600 }}>{title}</div>
      </div>
    </Link>
  );
}
