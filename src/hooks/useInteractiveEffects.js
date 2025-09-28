import { useEffect } from "react";

function createRipple(event) {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  button.appendChild(ripple);
  ripple.addEventListener(
    "animationend",
    () => {
      ripple.remove();
    },
    { once: true }
  );
}

export default function useInteractiveEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const buttons = new Set();
    const cleanup = [];

    const initButton = (button) => {
      if (buttons.has(button)) return;
      buttons.add(button);

      const handleMove = (event) => {
        const rect = button.getBoundingClientRect();
        const strength = Number(button.dataset.magneticStrength || "1");
        const offsetX = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const offsetY = (event.clientY - rect.top - rect.height / 2) / rect.height;
        button.style.transform = `translate(${offsetX * 12 * strength}px, ${offsetY * 12 * strength}px)`;
      };

      const handleLeave = () => {
        button.style.transform = "translate(0, 0)";
      };

      const handleClick = (event) => {
        if (button.dataset.ripple === "true") {
          createRipple(event);
        }
      };

      button.addEventListener("pointermove", handleMove);
      button.addEventListener("pointerleave", handleLeave);
      button.addEventListener("click", handleClick);

      cleanup.push(() => {
        button.removeEventListener("pointermove", handleMove);
        button.removeEventListener("pointerleave", handleLeave);
        button.removeEventListener("click", handleClick);
      });
    };

    document
      .querySelectorAll("[data-magnetic]")
      .forEach((btn) => initButton(btn));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches && node.matches("[data-magnetic]")) {
            initButton(node);
          }
          node.querySelectorAll?.("[data-magnetic]").forEach((child) => initButton(child));
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup.forEach((fn) => fn());
    };
  }, []);
}