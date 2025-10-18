export {};

declare global {
  interface Window {
    __SSR_SUCCESS__?: boolean;
    __SSR_THEME__?: string;
    __SSR_CONTRAST__?: string;
    __SSR_DEBUG__?: Record<string, unknown> | null;
  }
}