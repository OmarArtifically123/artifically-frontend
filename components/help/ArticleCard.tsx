"use client";

import Link from "next/link";
import { useState } from "react";
import { space } from "@/styles/spacing";

interface ArticleCardProps {
  href: string;
  title: string;
  description: string;
  readTime: string;
  views: number;
  helpful: number;
  notHelpful: number;
}

export default function ArticleCard({
  href,
  title,
  description,
  readTime,
  views,
  helpful,
  notHelpful,
}: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="glass"
        style={{
          padding: space("md", 1.25),
          borderRadius: "14px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          transform: isHovered ? "translateX(4px)" : "translateX(0)",
          background: isHovered ? "rgba(148, 163, 184, 0.05)" : "",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3
          style={{
            fontSize: "1.2rem",
            marginBottom: space("xs", 0.75),
            lineHeight: 1.4,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "var(--gray-300)",
            lineHeight: 1.6,
            marginBottom: space("sm"),
            fontSize: "0.95rem",
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: "flex",
            gap: space("md"),
            alignItems: "center",
            fontSize: "0.85rem",
            color: "var(--gray-400)",
          }}
        >
          <span>{readTime}</span>
          <span>•</span>
          <span>👁 {views.toLocaleString()} views</span>
          <span>•</span>
          <span>
            👍 {helpful} / 👎 {notHelpful}
          </span>
        </div>
      </article>
    </Link>
  );
}
