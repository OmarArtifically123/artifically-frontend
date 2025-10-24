"use client";

import { ReactNode, CSSProperties } from "react";

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function InteractiveCard({
  children,
  className = "",
  style = {},
  onClick,
}: InteractiveCardProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = "rgba(148, 163, 184, 0.05)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = "";
  };

  return (
    <div
      className={className}
      style={{
        ...style,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
