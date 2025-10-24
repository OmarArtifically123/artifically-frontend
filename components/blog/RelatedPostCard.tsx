"use client";

import Link from "next/link";
import { useState } from "react";
import { space } from "@/styles/spacing";

interface RelatedPostCardProps {
  href: string;
  title: string;
  excerpt: string;
  readTime: string;
}

export default function RelatedPostCard({
  href,
  title,
  excerpt,
  readTime,
}: RelatedPostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="glass"
        style={{
          padding: space("md"),
          borderRadius: "14px",
          height: "100%",
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: isHovered ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            marginBottom: space("sm"),
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
          }}
        >
          {excerpt.substring(0, 120)}...
        </p>
        <div
          style={{
            marginTop: space("sm"),
            fontSize: "0.85rem",
            color: "var(--gray-500)",
          }}
        >
          {readTime}
        </div>
      </article>
    </Link>
  );
}
