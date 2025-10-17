"use client";

import { useEffect } from "react";

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*?+-";

export default function useScrambleText(ref, target, options = {}) {
  const { characters = DEFAULT_CHARACTERS, minCycles = 10, maxCycles = 24 } = options;

  useEffect(() => {
    if (!ref?.current || typeof window === "undefined") return undefined;
    const element = ref.current;
    const host = element.closest("[data-scramble-host]");

    const from = element.textContent ?? "";
    const length = Math.max(from.length, target.length);
    const cycleSpan = Math.max(maxCycles, minCycles + 4);

    const queue = Array.from({ length }, (_, index) => {
      const start = Math.floor(Math.random() * minCycles);
      const end = start + Math.floor(Math.random() * (cycleSpan - minCycles) + minCycles);
      return {
        from: from[index] ?? "",
        to: target[index] ?? "",
        start,
        end,
      };
    });

    let frame = 0;
    let animationFrame;

    const enable = () => {
      element.setAttribute("data-scrambling", "true");
      if (host) host.setAttribute("data-scrambling", "true");
    };

    const disable = () => {
      element.setAttribute("data-scrambling", "false");
      if (host) host.setAttribute("data-scrambling", "false");
    };

    const update = () => {
      let output = "";
      let complete = 0;

      queue.forEach((item) => {
        if (frame >= item.end) {
          complete += 1;
          output += item.to;
        } else if (frame >= item.start) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          const glyph = characters[randomIndex] ?? "";
          const safeGlyph = glyph === "&" ? "&amp;" : glyph;
          output += `<span class="text-scramble-char">${safeGlyph}</span>`;
        } else {
          output += item.from;
        }
      });

      element.innerHTML = output;

      if (complete === queue.length) {
        element.textContent = target;
        disable();
        return;
      }

      frame += 1;
      animationFrame = window.requestAnimationFrame(update);
    };

    enable();
    animationFrame = window.requestAnimationFrame(update);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      element.textContent = target;
      disable();
    };
  }, [ref, target, characters, minCycles, maxCycles]);
}