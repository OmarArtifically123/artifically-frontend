const FOCUSABLE_SELECTORS = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function isElementHidden(element: HTMLElement) {
  if (element.hidden) return true;
  const style = window.getComputedStyle(element);
  return style.display === "none" || style.visibility === "hidden";
}

export function isFocusableElement(element: HTMLElement | null): element is HTMLElement {
  if (!element) return false;
  if (element.tabIndex < 0 && !element.hasAttribute("contenteditable")) {
    const tag = element.tagName.toLowerCase();
    const focusableByDefault =
      tag === "a" ||
      tag === "area" ||
      tag === "input" ||
      tag === "button" ||
      tag === "select" ||
      tag === "textarea";
    if (!focusableByDefault) {
      return false;
    }
  }
  if ((element as HTMLButtonElement).disabled) {
    return false;
  }
  if (element.hasAttribute("aria-hidden") && element.getAttribute("aria-hidden") === "true") {
    return false;
  }
  if (typeof window !== "undefined" && isElementHidden(element)) {
    return false;
  }
  return true;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
  return elements.filter((element) => isFocusableElement(element));
}

export { FOCUSABLE_SELECTORS };