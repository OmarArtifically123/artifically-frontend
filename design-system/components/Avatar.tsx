"use client";

import Image from "next/image";
import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: number;
  status?: "online" | "offline" | "busy" | "away";
}

const statusColor: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "#19db72",
  offline: "#94a3b8",
  busy: "#ef4444",
  away: "#f59e0b",
};

export function Avatar({ name, src, size = 40, status, className, style, ...rest }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "?";

  return (
    <div
      className={cn("ads-avatar", className)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        overflow: "hidden",
        background: "color-mix(in srgb, var(--ads-color-semantic-brand-primary, #1f7eff) 14%, transparent)",
        color: "var(--ads-color-semantic-brand-primary, #1f7eff)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        ...style,
      }}
      aria-label={name}
      {...rest}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          quality={85}
        />
      ) : (
        initials
      )}
      {status ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            border: "2px solid var(--ads-color-semantic-background-surface, #ffffff)",
            background: statusColor[status],
          }}
        />
      ) : null}
    </div>
  );
}