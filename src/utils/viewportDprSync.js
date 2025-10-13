const MAX_DPR = 2;

const canvasKindCache = new WeakMap();
const has2dContext = new WeakSet();
const hasWebglContext = new WeakSet();
let started = false;
let mutationObserver;
let mutationScheduled = false;
let rafId = null;
let timeoutId = null;
let patched = false;

function clampDpr(value) {
  return Math.min(Math.max(value, 1), MAX_DPR);
}

function isFullViewportCanvas(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    return false;
  }

  const style = window.getComputedStyle(canvas);
  if (!style) {
    return false;
  }

  const isFixed = style.position === "fixed";
  if (!isFixed) {
    return false;
  }

  const insetAll = style.inset;
  if (insetAll && insetAll !== "auto") {
    return insetAll.split(" ").every((token) => token === "0px");
  }

  const edgesZero =
    style.top === "0px" &&
    style.right === "0px" &&
    style.bottom === "0px" &&
    style.left === "0px";

  return edgesZero;
}

function detectKind(canvas) {
  if (canvasKindCache.has(canvas)) {
    return canvasKindCache.get(canvas);
  }

  if (hasWebglContext.has(canvas)) {
    canvasKindCache.set(canvas, "webgl");
    return "webgl";
  }

  if (has2dContext.has(canvas)) {
    canvasKindCache.set(canvas, "2d");
    return "2d";
  }

  const datasetKind = canvas.dataset?.viewportDprKind;
  if (datasetKind === "webgl" || datasetKind === "2d") {
    canvasKindCache.set(canvas, datasetKind);
    return datasetKind;
  }

  if (
    canvas.__threeRenderer ||
    canvas.__renderer ||
    canvas.__gl ||
    canvas.dataset?.threeRenderer === "true"
  ) {
    canvasKindCache.set(canvas, "webgl");
    return "webgl";
  }

  const attrKind = canvas.getAttribute("data-canvas-kind");
  if (attrKind === "webgl" || attrKind === "2d") {
    canvasKindCache.set(canvas, attrKind);
    return attrKind;
  }

  const classList = canvas.classList;
  if (classList) {
    if (
      classList.contains("webgl") ||
      classList.contains("three-canvas") ||
      classList.contains("gl-canvas")
    ) {
      canvasKindCache.set(canvas, "webgl");
      return "webgl";
    }

    if (classList.contains("canvas-2d")) {
      canvasKindCache.set(canvas, "2d");
      return "2d";
    }
  }

  canvasKindCache.set(canvas, "other");
  return "other";
}

function getZoomAwareDpr() {
  const visualViewport = window.visualViewport;
  const zoomScale = visualViewport?.scale ? 1 / visualViewport.scale : 1;
  const dpr = (window.devicePixelRatio || 1) * zoomScale;
  return clampDpr(dpr);
}

function tune2d(canvas, dpr) {
  const cssWidth = canvas.clientWidth || window.innerWidth;
  const cssHeight = canvas.clientHeight || window.innerHeight;
  const targetWidth = Math.round(cssWidth * dpr);
  const targetHeight = Math.round(cssHeight * dpr);

  if (canvas.width !== targetWidth) {
    canvas.width = targetWidth;
  }
  if (canvas.height !== targetHeight) {
    canvas.height = targetHeight;
  }

  if (canvas.style.width !== `${cssWidth}px`) {
    canvas.style.width = `${cssWidth}px`;
  }
  if (canvas.style.height !== `${cssHeight}px`) {
    canvas.style.height = `${cssHeight}px`;
  }

  if (has2dContext.has(canvas)) {
    try {
      const context = canvas.getContext("2d");
      if (context && typeof context.setTransform === "function") {
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    } catch (error) {
      if (import.meta?.env?.DEV) {
        console.warn("viewportDprSync: failed to tune 2d canvas", error);
      }
    }
  }
}

function tuneWebgl(canvas, dpr) {
  const cssWidth = canvas.clientWidth || window.innerWidth;
  const cssHeight = canvas.clientHeight || window.innerHeight;

  const renderer =
    canvas.__threeRenderer ||
    canvas.__renderer ||
    canvas.__glRenderer ||
    window.__threeRenderer;

  if (renderer && typeof renderer.setPixelRatio === "function") {
    try {
      renderer.setPixelRatio(dpr);
      if (typeof renderer.setSize === "function") {
        renderer.setSize(cssWidth, cssHeight, false);
      }
      return;
    } catch (error) {
      if (import.meta?.env?.DEV) {
        console.warn("viewportDprSync: failed to update three renderer", error);
      }
    }
  }

  if (!hasWebglContext.has(canvas)) {
    return;
  }

  let context = null;
  try {
    context =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
  } catch (error) {
    if (import.meta?.env?.DEV) {
      console.warn("viewportDprSync: failed to access webgl context", error);
    }
  }

  const targetWidth = Math.round(cssWidth * dpr);
  const targetHeight = Math.round(cssHeight * dpr);

  if (canvas.width !== targetWidth) {
    canvas.width = targetWidth;
  }
  if (canvas.height !== targetHeight) {
    canvas.height = targetHeight;
  }

  if (canvas.style.width !== `${cssWidth}px`) {
    canvas.style.width = `${cssWidth}px`;
  }
  if (canvas.style.height !== `${cssHeight}px`) {
    canvas.style.height = `${cssHeight}px`;
  }

  if (context && typeof context.viewport === "function") {
    context.viewport(0, 0, canvas.width, canvas.height);
  }
}

function retuneAll() {
  if (typeof window === "undefined") {
    return;
  }

  mutationScheduled = false;

  const dpr = getZoomAwareDpr();
  const canvases = Array.from(document.querySelectorAll("canvas"));

  canvases.forEach((canvas) => {
    if (!isFullViewportCanvas(canvas)) {
      return;
    }

    const kind = detectKind(canvas);

    if (kind === "webgl") {
      tuneWebgl(canvas, dpr);
      return;
    }

    tune2d(canvas, dpr);
  });
}

function scheduleRetune() {
  if (!started || mutationScheduled) {
    return;
  }

  mutationScheduled = true;
  if (typeof requestAnimationFrame === "function") {
    rafId = requestAnimationFrame(() => {
      rafId = null;
      retuneAll();
    });
  } else {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      retuneAll();
    }, 16);
  }
}

function observeMutations() {
  if (typeof MutationObserver === "undefined") {
    return;
  }

  if (mutationObserver) {
    return;
  }

  mutationObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        scheduleRetune();
        return;
      }
    }
  });

  const target = document.body || document.documentElement;
  if (target) {
    mutationObserver.observe(target, { childList: true, subtree: true });
  }
}

function ensureContextPatch() {
  if (patched || typeof window === "undefined") {
    return;
  }

  const proto = window.HTMLCanvasElement?.prototype;
  if (!proto || typeof proto.getContext !== "function") {
    return;
  }

  const originalGetContext = proto.getContext;
  proto.getContext = function patchedGetContext(type, ...args) {
    const context = originalGetContext.call(this, type, ...args);

    if (context) {
      let kind = "other";
      if (typeof type === "string") {
        if (type === "2d") {
          kind = "2d";
          has2dContext.add(this);
        } else if (type.startsWith("webgl")) {
          kind = "webgl";
          hasWebglContext.add(this);
        }
      }

      if (kind !== "other") {
        canvasKindCache.set(this, kind);
        this.dataset.viewportDprKind = kind;
      }

      if (started) {
        scheduleRetune();
      }
    }

    return context;
  };

  patched = true;
}

export function startViewportDprSync() {
  if (typeof window === "undefined") {
    return;
  }

  if (started) {
    return;
  }
  started = true;

  ensureContextPatch();

  if (document?.body) {
    document.body.setAttribute("data-no-viewport-blur", "true");
  } else {
    window.addEventListener(
      "DOMContentLoaded",
      () => {
        document.body?.setAttribute("data-no-viewport-blur", "true");
      },
      { once: true },
    );
  }

  observeMutations();
  retuneAll();

  window.addEventListener("resize", scheduleRetune, { passive: true });
  window.addEventListener("orientationchange", scheduleRetune, { passive: true });

  const visualViewport = window.visualViewport;
  if (visualViewport) {
    visualViewport.addEventListener("resize", scheduleRetune, { passive: true });
    visualViewport.addEventListener("scroll", scheduleRetune, { passive: true });
  }

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => {
      retuneAll();
    });
  }

  timeoutId = setTimeout(() => {
    timeoutId = null;
    retuneAll();
  }, 50);
}

export function stopViewportDprSync() {
  if (!started) {
    return;
  }

  started = false;

  window.removeEventListener("resize", scheduleRetune);
  window.removeEventListener("orientationchange", scheduleRetune);

  const visualViewport = window.visualViewport;
  if (visualViewport) {
    visualViewport.removeEventListener("resize", scheduleRetune);
    visualViewport.removeEventListener("scroll", scheduleRetune);
  }

  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }

  if (rafId != null && typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (timeoutId != null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}