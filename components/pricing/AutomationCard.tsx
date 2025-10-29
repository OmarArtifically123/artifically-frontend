"use client";

import { useState } from "react";
import type { Automation } from "./types-v2";
import { trackPricingEvent } from "@/lib/pricing-analytics";

type Props = {
  automation: Automation;
  isSelected: boolean;
  onToggle: (automationId: string) => void;
};

export default function AutomationCard({ automation, isSelected, onToggle }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    onToggle(automation.id);
    trackPricingEvent(
      isSelected ? "bundle_remove_automation" : "bundle_add_automation",
      { automation_id: automation.id }
    );
  };

  const handleExpandDetails = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      trackPricingEvent("automation_details_expand", { automation_id: automation.id });
    }
  };

  return (
    <div className={`automation-card ${isSelected ? "automation-card-selected" : ""}`}>
      <div className="automation-card-header">
        <h3 className="automation-name">{automation.name}</h3>
        <div className="automation-price">from ${automation.priceMonthly}/mo</div>
      </div>

      <div className="automation-volume">
        {automation.includedVolume.toLocaleString()} {automation.volumeUnit}/mo included
      </div>

      <p className="automation-roi">{automation.roiStatement}</p>

      <button className={`automation-toggle-btn ${isSelected ? "selected" : ""}`} onClick={handleToggle} type="button">
        {isSelected ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M13 4L6 11L3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Remove from bundle
          </>
        ) : (
          "Add to bundle"
        )}
      </button>

      <button className="automation-details-toggle" onClick={handleExpandDetails} type="button" aria-expanded={isExpanded}>
        {isExpanded ? "Hide details" : "Show details"}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isExpanded && (
        <div className="automation-details">
          <ul className="details-list">
            {automation.details.map((detail, index) => (
              <li key={index}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M11 4L5.5 9.5L3 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {detail}
              </li>
            ))}
          </ul>
          <div className="overage-info">
            <strong>Overage:</strong> ${automation.overageRate}/event after {automation.includedVolume.toLocaleString()}{" "}
            {automation.volumeUnit}
          </div>
        </div>
      )}

      <style jsx>{`
        .automation-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .automation-card:hover {
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .automation-card-selected {
          border-color: rgba(20, 184, 166, 0.6);
          background: rgba(20, 184, 166, 0.05);
        }

        .automation-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .automation-name {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #E5E7EB;
          flex: 1;
          min-width: 0;
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .automation-price {
          font-size: 0.9rem;
          font-weight: 700;
          color: #3B82F6;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .automation-volume {
          font-size: 0.85rem;
          color: #9CA3AF;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .automation-roi {
          margin: 0;
          font-size: 0.95rem;
          font-style: italic;
          color: #6B7280;
          line-height: 1.5;
        }

        .automation-toggle-btn {
          padding: 0.85rem 1.5rem;
          background: transparent;
          border: 2px solid rgba(59, 130, 246, 0.4);
          border-radius: 12px;
          color: #3B82F6;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .automation-toggle-btn:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3B82F6;
          transform: scale(1.02);
        }

        .automation-toggle-btn.selected {
          background: #14B8A6;
          border-color: #14B8A6;
          color: white;
        }

        .automation-toggle-btn.selected:hover {
          background: #0D9488;
          border-color: #0D9488;
        }

        .automation-toggle-btn:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 2px;
        }

        .automation-details-toggle {
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #9CA3AF;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .automation-details-toggle:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #E5E7EB;
        }

        .automation-details-toggle:focus-visible {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }

        .automation-details {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .details-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .details-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #9CA3AF;
          line-height: 1.5;
        }

        .details-list li svg {
          flex-shrink: 0;
          margin-top: 0.25rem;
          color: #14B8A6;
        }

        .overage-info {
          padding: 0.75rem;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          font-size: 0.85rem;
          color: #9CA3AF;
        }

        .overage-info strong {
          color: #3B82F6;
        }

        @media (prefers-reduced-motion: reduce) {
          .automation-card:hover,
          .automation-toggle-btn:hover {
            transform: none;
          }

          .automation-details {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
