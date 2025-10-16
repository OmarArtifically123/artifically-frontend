
import type { Page } from '@playwright/test';

export async function installVisualStability(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const originalMatchMedia = window.matchMedia?.bind(window);

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => {
        if (query.includes('prefers-reduced-motion')) {
          const listeners = new Set<(event: MediaQueryListEvent) => void>();
          const mql: MediaQueryList = {
            matches: true,
            media: query,
            onchange: null,
            addListener: (listener: (event: MediaQueryListEvent) => void) => {
              listeners.add(listener);
            },
            removeListener: (listener: (event: MediaQueryListEvent) => void) => {
              listeners.delete(listener);
            },
            addEventListener: (_eventName: string, listener: (event: MediaQueryListEvent) => void) => {
              listeners.add(listener);
            },
            removeEventListener: (_eventName: string, listener: (event: MediaQueryListEvent) => void) => {
              listeners.delete(listener);
            },
            dispatchEvent: () => false,
          } as MediaQueryList;
          return mql;
        }

        return originalMatchMedia ? originalMatchMedia(query) : ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        } as MediaQueryList);
      },
    });

    const style = document.createElement('style');
    style.id = 'playwright-visual-stability';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0ms !important;
        scroll-behavior: auto !important;
      }
      html {
        scroll-behavior: auto !important;
      }
    `;

    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.head?.appendChild(style);
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.body?.setAttribute('data-visual-test', 'true');
    });
  });
}