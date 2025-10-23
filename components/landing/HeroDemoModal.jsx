"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function HeroDemoModal({ open, onClose, dialogId = "hero-demo-modal", returnFocusRef }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useFocusTrap(open, dialogRef, {
    initialFocusRef: closeButtonRef,
    onEscape: onClose,
    returnFocusRef,
  });

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="hero-demo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hero-demo-modal__overlay backdrop"
            onMouseDown={handleOverlayClick}
          />
          <motion.div
            key="hero-demo-modal"
            id={dialogId}
            ref={dialogRef}
            className="hero-demo-modal__content modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-demo-title"
            aria-describedby="hero-demo-description"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
        <header className="hero-demo-modal__header">
          <div>
            <p className="hero-demo-modal__eyebrow">Product walkthrough</p>
            <h2 id="hero-demo-title">See Artifically automate a live support incident</h2>
          </div>
          <button
            type="button"
            className="hero-demo-modal__close"
            onClick={onClose}
            ref={closeButtonRef}
          >
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
              src="/media/hero-demo.vtt"
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
      </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}