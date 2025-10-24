"use client";

import Link from "next/link";
import { useState } from "react";
import { space } from "@/styles/spacing";

interface RelatedArticleCardProps {
  href: string;
  title: string;
  description: string;
}

export default function RelatedArticleCard({
  href,
  title,
  description,
}: RelatedArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        className="glass"
        style={{
          padding: space("md"),
          borderRadius: "12px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: isHovered ? "rgba(148, 163, 184, 0.05)" : "",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            marginBottom: space("xs", 0.5),
            lineHeight: 1.4,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "var(--gray-400)",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {description.substring(0, 120)}...
        </p>
      </div>
    </Link>
  );
}
