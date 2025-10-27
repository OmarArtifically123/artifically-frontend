/**
 * Custom image loader with optimization
 * Handles responsive images, blur-up placeholders, and lazy loading
 */

export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Custom image loader for Next.js Image component
 * Optimizes images based on width and quality
 */
export function customImageLoader({ src, width, quality = 75 }: ImageLoaderProps): string {
  // If external URL, return as-is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Build optimized URL based on width and quality
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", String(width));
  params.set("q", String(quality));

  return `/_next/image?${params.toString()}`;
}

/**
 * Generate blur data URL for placeholder
 */
export function generateBlurDataURL(color1: string = "#a78bfa", color2: string = "#ec4899"): string {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>
      <defs>
        <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop stop-color='${color1}' offset='0%'/>
          <stop stop-color='${color2}' offset='100%'/>
        </linearGradient>
      </defs>
      <rect width='40' height='40' fill='url(#g)' rx='4'/>
    </svg>
  `.trim();

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get responsive image sizes
 */
export function getResponsiveSizes(variant: "card" | "hero" | "thumbnail" = "card"): string {
  switch (variant) {
    case "hero":
      return "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px";
    case "thumbnail":
      return "(max-width: 768px) 100px, 150px";
    case "card":
    default:
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  }
}

export default customImageLoader;


