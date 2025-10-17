export {};

declare global {
  interface Window {
    __SSR_SUCCESS__?: boolean;
  }
}