"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../icons";
import type { IconName } from "../icons";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useRovingFocus } from "@/hooks/useRovingFocus";

type ResourcesColumn = {
  heading: string;
  links: Array<{
    path: string;
    label: string;
    description: string;
    icon: IconName;
  }>;
};

type MenuState = "opening" | "open" | "closing" | "closed";

type ResourcesMegaMenuProps = {
  label: string;
  state: MenuState;
  menuId: string;
  columns: ResourcesColumn[];
  onRequestClose: () => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, path: string) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export default function ResourcesMegaMenu({
  label,
  state,
  menuId,
  columns,
  onRequestClose,
  onNavigate,
  returnFocusRef,
}: ResourcesMegaMenuProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = state === "opening" || state === "open";
  useFocusTrap(isActive, panelRef, {
    initialFocusRef: closeButtonRef,
    onEscape: onRequestClose,
    returnFocusRef,
  });
  useRovingFocus(panelRef, { onEscape: onRequestClose });

  if (!mounted || state === "closed") {
    return null;
  }

  return createPortal(
    <div className="resources-mega" data-state={state}>
      <div className="resources-mega__backdrop" role="presentation" onClick={onRequestClose} />
      <div
        className="resources-mega__panel"
        role="dialog"
        id={menuId}
        aria-modal="true"
        aria-labelledby="resources-mega-heading"
        ref={panelRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="resources-mega__close"
          onClick={onRequestClose}
          aria-label="Close resources menu"
          ref={closeButtonRef}
        >
          <Icon name="close" size={18} strokeWidth={2} />
        </button>
        <div className="resources-mega__content">
          <header className="resources-mega__header">
            <p className="resources-mega__eyebrow">RESOURCE LIBRARY</p>
            <h2 id="resources-mega-heading" className="resources-mega__title">
              {label}
            </h2>
            <p className="resources-mega__subtitle">
              Guides, updates, and tools to help you get more from Artifically.
            </p>
          </header>
          <div className="resources-mega__columns" role="menu">
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
                      }}
                    >
                      <span className="resources-mega__icon" aria-hidden="true">
                        <Icon name={entry.icon} size={18} strokeWidth={2} />
                      </span>
                      <span className="resources-mega__copy">
                        <span className="resources-mega__title-text">{entry.label}</span>
                        <span className="resources-mega__description">{entry.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export type { ResourcesColumn };