
import { useEffect, useMemo, useRef, useState } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "details summary",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function HeroDemoModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const focusTrapRef = useRef({ first: null, last: null });
  const previousActiveElementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return undefined;
    }

    previousActiveElementRef.current = document.activeElement;
    setIsVisible(true);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const { first, last } = focusTrapRef.current;
        if (!first || !last) {
          return;
        }

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const handleFocusIn = (event) => {
      if (!dialogRef.current) return;
      if (dialogRef.current.contains(event.target)) {
        return;
      }
      focusTrapRef.current.first?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusin", handleFocusIn);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !dialogRef.current) {
      return;
    }

    const dialogNode = dialogRef.current;
    const updateFocusable = () => {
      const focusable = Array.from(dialogNode.querySelectorAll(FOCUSABLE_SELECTOR));
      focusTrapRef.current = {
        first: focusable[0] || dialogNode,
        last: focusable[focusable.length - 1] || focusable[0] || dialogNode,
      };
      requestAnimationFrame(() => {
        focusTrapRef.current.first?.focus({ preventScroll: true });
      });
    };

    updateFocusable();

    const observer = new MutationObserver(updateFocusable);
    observer.observe(dialogNode, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
      if (previousActiveElementRef.current?.focus) {
        previousActiveElementRef.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const overlayClassName = useMemo(() => {
    return `hero-demo-modal__overlay${open ? " is-open" : ""}${isVisible ? " is-visible" : ""}`;
  }, [open, isVisible]);

  if (!open) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={overlayClassName}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-demo-title"
      aria-describedby="hero-demo-description"
      onMouseDown={handleOverlayClick}
    >
      <div className="hero-demo-modal__content" ref={dialogRef}>
        <header className="hero-demo-modal__header">
          <div>
            <p className="hero-demo-modal__eyebrow">Product walkthrough</p>
            <h2 id="hero-demo-title">See Artifically automate a live support incident</h2>
          </div>
          <button type="button" className="hero-demo-modal__close" onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close demo</span>
          </button>
        </header>

        <p id="hero-demo-description" className="hero-demo-modal__lede">
          The demo includes captions and a full transcript. Use the keyboard controls listed below or press Escape to
          exit.
        </p>

        <div className="hero-demo-modal__media" role="group" aria-label="Demo player with transcript">
          <video
            className="hero-demo-modal__video"
            controls
            playsInline
            preload="metadata"
            poster="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80"
          >
            <source src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4" type="video/mp4" />
            <track
              default
              kind="captions"
              srcLang="en"
              label="English captions"
              src="https://gist.githubusercontent.com/anonymous/7c8f8fce6ce0b0f8d1c737e2c7a72c22/raw/hero-demo.vtt"
            />
            Your browser does not support the video tag. You can download the demo as an MP4 file using the link below.
          </video>
          <div className="hero-demo-modal__controls" role="note">
            <p>
              Tip: Press <kbd>Space</kbd> to play or pause, <kbd>←</kbd>/<kbd>→</kbd> to seek, and <kbd>M</kbd> to toggle
              mute.
            </p>
            <a
              href="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"
              target="_blank"
              rel="noreferrer"
              className="hero-demo-modal__download"
            >
              Download demo MP4
            </a>
          </div>
        </div>

        <details className="hero-demo-modal__transcript">
          <summary>Read full transcript</summary>
          <ol>
            <li>
              <strong>00:00 – Kick-off:</strong> The agent triages a P1 incident and assigns ownership with a single
              command.
            </li>
            <li>
              <strong>00:41 – AI actioning:</strong> Artifically suggests root-cause hypotheses and builds a mitigation
              runbook.
            </li>
            <li>
              <strong>01:22 – Customer update:</strong> A natural-language summary is generated and sent to the customer
              automatically.
            </li>
            <li>
              <strong>01:55 – ROI recap:</strong> Dashboard highlights show SLA adherence, agent time saved, and projected
              savings.
            </li>
          </ol>
        </details>
      </div>
    </div>
  );
}