"use client";

import Link from "next/link";
import { type MouseEvent } from "react";

import { Icon } from "../icons";
import type { IconName } from "../icons";

type ResourcesColumn = {
  heading: string;
  links: Array<{
    path: string;
    label: string;
    description: string;
    icon: IconName;
  }>;
};

type ResourcesMegaMenuProps = {
  label: string;
  isActive: boolean;
  columns: ResourcesColumn[];
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, path: string) => void;
};

export default function ResourcesMegaMenu({
  label,
  isActive,
  columns,
  onNavigate,
}: ResourcesMegaMenuProps) {
  return (
    <details className="resources-mega" data-enhanced>
      <summary
        className={["nav-trigger", isActive ? "nav-trigger--active" : ""]
          .filter(Boolean)
          .join(" ")}
        aria-haspopup="menu"
      >
        <span>{label}</span>
        <Icon name="chevronDown" size={16} aria-hidden="true" />
      </summary>
      <div className="resources-mega__panel" role="menu">
        {columns.map((column) => (
          <div className="resources-mega__column" key={`${label}-${column.heading}`}>
            <p className="resources-mega__heading">{column.heading}</p>
            <div className="resources-mega__links">
              {column.links.map((entry) => (
                <Link
                  key={entry.path + entry.label}
                  href={entry.path}
                  role="menuitem"
                  className="resources-mega__link"
                  data-prefetch-route={entry.path}
                  onClick={(event) => {
                    onNavigate(event, entry.path);
                    const rootDetails = event.currentTarget.closest("details");
                    if (rootDetails) {
                      rootDetails.removeAttribute("open");
                    }
                  }}
                >
                  <span className="resources-mega__icon" aria-hidden="true">
                    <Icon name={entry.icon} size={18} strokeWidth={2} />
                  </span>
                  <span className="resources-mega__copy">
                    <span className="resources-mega__title">{entry.label}</span>
                    <span className="resources-mega__description">{entry.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

export type { ResourcesColumn };