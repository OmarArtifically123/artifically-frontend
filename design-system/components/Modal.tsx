"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import type { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
  footer,
  className,
  returnFocusRef,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalTarget = typeof document !== "undefined" ? document.body : null;
  const titleId = useId();
  const descriptionId = `${titleId}-description`;

  useFocusTrap(isOpen, dialogRef, { onEscape: onClose, returnFocusRef });

  useEffect(() => {
    if (!isOpen || !portalTarget) {
      return undefined;
    }
    const previousOverflow = portalTarget.style.overflow;
    portalTarget.style.overflow = "hidden";
    return () => {
      portalTarget.style.overflow = previousOverflow;
    };
  }, [isOpen, portalTarget]);

  if (!isOpen || !portalTarget) {
    return null;
  }

  return createPortal(
    <div
      className="ads-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn("ads-modal", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        ref={dialogRef}
        tabIndex={-1}
      >
        {title ? (
          <div>
            <h2 id={titleId} className="ads-heading">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="ads-text-subtle">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        <div>{children}</div>
        {footer ? (
          <footer className="ads-card__footer">{footer}</footer>
        ) : (
          <footer className="ads-card__footer">
            {secondaryAction ? (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button onClick={primaryAction.onClick} loading={primaryAction.loading}>
                {primaryAction.label}
              </Button>
            ) : null}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}