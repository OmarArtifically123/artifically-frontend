"use client";

import { cn } from "../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface BreadcrumbItem {
  id?: string;
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export function Breadcrumbs({ items, separator = "›", className, ...rest }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("ads-breadcrumbs", className)} {...rest}>
      {items.map((item, index) => {
        const key = item.id ?? `${index}-${String(item.label)}`;
        const isLast = index === items.length - 1;
        const content = item.href && !isLast ? (
          <a href={item.href} className="ads-label" style={{ color: "inherit", textDecoration: "none" }}>
            {item.label}
          </a>
        ) : (
          <span className="ads-label" style={{ color: "inherit" }}>
            {item.label}
          </span>
        );
        return (
          <span key={key} className="ads-breadcrumbs__item">
            {content}
            {!isLast ? <span aria-hidden>{separator}</span> : null}
          </span>
        );
      })}
    </nav>
  );
}