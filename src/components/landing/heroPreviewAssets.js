export const HERO_PREVIEW_IMAGE = "/images/hero-preview.jpg";
export const HERO_PREVIEW_DIMENSIONS = { width: 1920, height: 1080 };
export const HERO_PREVIEW_SIZES = "(max-width: 768px) 92vw, (max-width: 1280px) 60vw, 540px";
export const HERO_PREVIEW_SOURCES = [
  { type: "image/avif", srcSet: "/images/hero-preview.avif", sizes: HERO_PREVIEW_SIZES },
  { type: "image/webp", srcSet: "/images/hero-preview.webp", sizes: HERO_PREVIEW_SIZES },
];