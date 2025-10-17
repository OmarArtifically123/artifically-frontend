import { cn } from "../utils/cn";
import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  radius?: string;
}

export function Skeleton({ width = "100%", height = "1rem", radius, className, style, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn("ads-skeleton", className)}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
}