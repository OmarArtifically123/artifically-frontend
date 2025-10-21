"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

import { caseStudyLinks, industrySolutionLinks, teamSizeSolutionLinks } from "@/data/solutions";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useRovingFocus } from "@/hooks/useRovingFocus";

import { Icon } from "../icons";

type MenuState = "opening" | "open" | "closing" | "closed";

type SolutionsMegaMenuProps = {
  menuId: string;
  state: MenuState;
  onRequestClose: () => void;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, path: string) => void;
};

export default function SolutionsMegaMenu({ menuId, state, onRequestClose, onNavigate }: SolutionsMegaMenuProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = state === "opening" || state === "open";
  useFocusTrap(isActive, panelRef, { initialFocusRef: closeButtonRef, onEscape: onRequestClose });
  useRovingFocus(panelRef, { onEscape: onRequestClose });

  if (!mounted || state === "closed") {
    return null;
  }

  return createPortal(
    <div className="solutions-mega" data-state={state}>
      <div className="solutions-mega__backdrop" role="presentation" onClick={onRequestClose} />
      <div
        className="solutions-mega__panel"
        role="dialog"
        id={menuId}
        aria-modal="true"
        aria-labelledby="solutions-mega-heading"
        ref={panelRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="solutions-mega__close"
          onClick={onRequestClose}
          aria-label="Close solutions menu"
          ref={closeButtonRef}
        >
          <Icon name="close" size={18} strokeWidth={2} />
        </button>
        <div className="solutions-mega__content">
          <div className="solutions-mega__column solutions-mega__column--industries">
            <p id="solutions-mega-heading" className="solutions-mega__section-label">
              BY INDUSTRY
            </p>
            <div className="solutions-mega__industry-list">
              {industrySolutionLinks.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="solutions-mega__industry-link"
                  data-prefetch-route={entry.href}
                  onClick={(event) => {
                    onNavigate(event, entry.href);
                  }}
                >
                  <span className="solutions-mega__industry-icon">
                    <Icon name={entry.icon} size={18} strokeWidth={1.75} />
                  </span>
                  <span className="solutions-mega__industry-copy">
                    <span className="solutions-mega__industry-title">{entry.title}</span>
                    <span className="solutions-mega__industry-description">{entry.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="solutions-mega__column solutions-mega__column--team">
            <p className="solutions-mega__section-label">BY TEAM SIZE</p>
            <div className="solutions-mega__team-list">
              {teamSizeSolutionLinks.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="solutions-mega__team-card"
                  data-prefetch-route={entry.href}
                  onClick={(event) => {
                    onNavigate(event, entry.href);
                  }}
                >
                  <span className="solutions-mega__team-icon">
                    <Icon name={entry.icon} size={18} strokeWidth={1.75} />
                  </span>
                  <span className="solutions-mega__team-copy">
                    <span className="solutions-mega__team-title">{entry.title}</span>
                    <span className="solutions-mega__team-description">{entry.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="solutions-mega__column solutions-mega__column--cases">
            <p className="solutions-mega__section-label">SUCCESS STORIES</p>
            <div className="solutions-mega__case-list">
              {caseStudyLinks.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="solutions-mega__case-card"
                  data-prefetch-route={entry.href}
                  onClick={(event) => {
                    onNavigate(event, entry.href);
                  }}
                >
                  <div className="solutions-mega__case-header">
                    <span
                      className="solutions-mega__case-logo"
                      style={{ background: entry.theme }}
                      aria-hidden="true"
                    >
                      {entry.initials}
                    </span>
                    <div className="solutions-mega__case-meta">
                      <span className="solutions-mega__case-name">{entry.name}</span>
                      <span className="solutions-mega__case-quote">
                        “Reduced operational costs by 40% in first quarter”
                      </span>
                    </div>
                  </div>
                  <div className="solutions-mega__case-metrics">
                    <span className="solutions-mega__case-badge">40% cost reduction</span>
                    <span className="solutions-mega__case-badge">6 weeks to ROI</span>
                  </div>
                  <span className="solutions-mega__case-link">Read Full Story →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}