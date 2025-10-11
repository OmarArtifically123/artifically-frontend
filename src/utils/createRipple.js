export function createRipple(event, element) {
  if (!element || typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const rect = element.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "button__ripple";
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  element.appendChild(ripple);

  ripple.addEventListener(
    "animationend",
    () => {
      ripple.remove();
    },
    { once: true }
  );
}