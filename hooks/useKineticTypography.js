"use client";

import { useEffect } from "react";

function splitElement(element) {
  if (!element || element.dataset.kineticProcessed === "true") {
    return;
  }

  const text = element.textContent || "";
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized.length) {
    element.dataset.kineticProcessed = "true";
    return;
  }

  element.dataset.kineticOriginal = text;
  element.textContent = "";

  const fragment = document.createDocumentFragment();
  const variant = element.dataset.kinetic || "reveal";

  Array.from(normalized).forEach((character, index) => {
    const span = document.createElement("span");
    span.className = `kinetic-char kinetic-${variant}`;
    span.dataset.charIndex = String(index);
    span.style.setProperty("--char-index", String(index));
    span.textContent = character === " " ? "\u00a0" : character;
    fragment.appendChild(span);
  });

  element.appendChild(fragment);
  element.dataset.kineticProcessed = "true";
  element.setAttribute("data-kinetic-ready", "true");
}

function restoreElement(element) {
  if (!element || !element.dataset.kineticProcessed) {
    return;
  }

  const original = element.dataset.kineticOriginal;
  if (typeof original === "string") {
    element.textContent = original;
  }
  element.removeAttribute("data-kinetic-ready");
  delete element.dataset.kineticProcessed;
  delete element.dataset.kineticOriginal;
}

export default function useKineticTypography() {
  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }

    const elements = Array.from(document.querySelectorAll("[data-kinetic]"));
    elements.forEach(splitElement);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }
          if (node.matches?.("[data-kinetic]")) {
            splitElement(node);
          }
          node.querySelectorAll?.("[data-kinetic]").forEach((child) => splitElement(child));
        });
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.matches?.("[data-kinetic]") && node.dataset.kineticProcessed) {
            restoreElement(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document
        .querySelectorAll("[data-kinetic][data-kinetic-processed]")
        .forEach((element) => restoreElement(element));
    };
  }, []);
}