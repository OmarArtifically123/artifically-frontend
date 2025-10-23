import React from 'react';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});

globalThis.window = window as unknown as typeof globalThis.window;
globalThis.document = window.document;
Object.defineProperty(globalThis, 'navigator', {
  value: window.navigator,
  configurable: true,
});
globalThis.HTMLElement = window.HTMLElement;
globalThis.MutationObserver = window.MutationObserver;
const fallbackRaf = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16);
const fallbackCancelRaf = (id: number) => clearTimeout(id);

globalThis.requestAnimationFrame = (window.requestAnimationFrame?.bind(window) ?? fallbackRaf) as typeof requestAnimationFrame;
globalThis.cancelAnimationFrame = (window.cancelAnimationFrame?.bind(window) ?? fallbackCancelRaf) as typeof cancelAnimationFrame;
window.requestAnimationFrame = globalThis.requestAnimationFrame;
window.cancelAnimationFrame = globalThis.cancelAnimationFrame;

if (!('IntersectionObserver' in globalThis)) {
  class MockIntersectionObserver {
    readonly root: Element | Document | null = null;

    readonly rootMargin = '0px';

    readonly thresholds = [0];

    constructor(private readonly callback: IntersectionObserverCallback) {}

    observe(target: Element) {
      this.callback?.([
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          time: Date.now(),
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
        } as IntersectionObserverEntry,
      ], this as unknown as IntersectionObserver);
    }

    unobserve() {}

    disconnect() {}

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  globalThis.IntersectionObserverEntry = window.IntersectionObserverEntry ?? (class {} as typeof IntersectionObserverEntry);
}

Object.assign(globalThis, { React });