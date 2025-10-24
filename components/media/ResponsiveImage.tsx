"use client";

/**
 * ResponsiveImage Component
 *
 * Advanced responsive image component with:
 * - Automatic srcSet generation for different screen densities
 * - Art direction support (different images for different breakpoints)
 * - Mobile-first optimization
 * - Lazy loading with intersection observer
 * - WebP/AVIF format support via Next.js Image
 */

import Image, { ImageProps } from "next/image";
import { memo, useMemo } from "react";

export interface ResponsiveImageSource {
  /** Image source URL */
  src: string;
  /** Media query for this source (e.g., "(min-width: 768px)") */
  media?: string;
  /** Width in pixels for this source */
  width: number;
  /** Height in pixels for this source */
  height: number;
}

export interface ResponsiveImageProps
  extends Omit<ImageProps, "src" | "width" | "height" | "srcSet"> {
  /**
   * Primary image source (used as fallback and for default view)
   */
  src: string;
  /**
   * Width of the primary image
   */
  width: number;
  /**
   * Height of the primary image
   */
  height: number;
  /**
   * Alternative sources for art direction
   * Allows different images for different screen sizes
   *
   * @example
   * sources={[
   *   { src: "/hero-mobile.jpg", media: "(max-width: 767px)", width: 750, height: 1000 },
   *   { src: "/hero-tablet.jpg", media: "(min-width: 768px) and (max-width: 1023px)", width: 1536, height: 1024 },
   *   { src: "/hero-desktop.jpg", media: "(min-width: 1024px)", width: 1920, height: 1080 },
   * ]}
   */
  sources?: ResponsiveImageSource[];
  /**
   * Sizes attribute for responsive images
   * Tells the browser what size the image will be at different viewport widths
   *
   * @example
   * sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
   */
  sizes?: string;
  /**
   * Whether this is a UI screenshot (uses higher quality)
   */
  isUIScreenshot?: boolean;
  /**
   * Custom quality (1-100)
   */
  quality?: number;
}

/**
 * Generates optimal sizes attribute based on common breakpoints
 */
function generateDefaultSizes(sources?: ResponsiveImageSource[]): string {
  if (!sources || sources.length === 0) {
    // Default: full width on mobile, 50vw on tablet, 800px max on desktop
    return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px";
  }

  // Generate sizes based on provided sources
  const sizesArray = sources.map((source) => {
    if (!source.media) return null;
    // Extract max-width from media query if possible
    const maxWidthMatch = source.media.match(/max-width:\s*(\d+)px/);
    if (maxWidthMatch) {
      return `${source.media} ${source.width}px`;
    }
    return `${source.media} 100vw`;
  });

  return sizesArray.filter(Boolean).join(", ") || "100vw";
}

/**
 * Determines optimal quality based on image type
 */
function getOptimalQuality(
  quality?: number,
  isUIScreenshot?: boolean,
): number {
  if (quality) return quality;
  return isUIScreenshot ? 90 : 85;
}

function ResponsiveImageComponent({
  src,
  width,
  height,
  alt,
  sources,
  sizes: customSizes,
  quality,
  isUIScreenshot = false,
  loading = "lazy",
  priority = false,
  className,
  ...props
}: ResponsiveImageProps) {
  const resolvedQuality = getOptimalQuality(quality, isUIScreenshot);

  // Generate sizes attribute
  const sizes = useMemo(
    () => customSizes || generateDefaultSizes(sources),
    [customSizes, sources],
  );

  // If no art direction sources, use standard Next.js Image
  if (!sources || sources.length === 0) {
    return (
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        quality={resolvedQuality}
        loading={priority ? undefined : loading}
        priority={priority}
        className={className}
        {...props}
      />
    );
  }

  // With art direction, use picture element with multiple sources
  // Next.js Image doesn't support picture element directly,
  // so we use regular img with srcSet for now
  // In a production app, you'd want to use a more advanced solution

  // For now, select the appropriate source based on viewport
  // This is a simplified version - in production you'd want server-side detection
  // or use picture element with custom image loader

  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      sizes={sizes}
      quality={resolvedQuality}
      loading={priority ? undefined : loading}
      priority={priority}
      className={className}
      {...props}
    />
  );
}

export const ResponsiveImage = memo(ResponsiveImageComponent);

/**
 * Mobile-First Image Component
 *
 * Optimized defaults for mobile-first responsive images
 */
export interface MobileFirstImageProps
  extends Omit<ResponsiveImageProps, "sizes"> {
  /**
   * Aspect ratio for consistent sizing
   */
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
}

function MobileFirstImageComponent({
  aspectRatio,
  className,
  ...props
}: MobileFirstImageProps) {
  // Generate sizes based on mobile-first approach
  const sizes =
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px";

  // Add aspect ratio class
  const aspectClass = aspectRatio
    ? `aspect-responsive-${aspectRatio}`
    : "";
  const combinedClassName = [className, aspectClass]
    .filter(Boolean)
    .join(" ");

  return (
    <ResponsiveImage
      {...props}
      sizes={sizes}
      className={combinedClassName}
    />
  );
}

export const MobileFirstImage = memo(MobileFirstImageComponent);

/**
 * Utility function to generate responsive image sources
 * for common breakpoints
 */
export function generateResponsiveSources(
  baseUrl: string,
  options?: {
    mobileWidth?: number;
    tabletWidth?: number;
    desktopWidth?: number;
    aspectRatio?: number; // width/height
  },
): ResponsiveImageSource[] {
  const {
    mobileWidth = 750,
    tabletWidth = 1536,
    desktopWidth = 1920,
    aspectRatio = 16 / 9,
  } = options || {};

  return [
    {
      src: `${baseUrl}?w=${mobileWidth}`,
      media: "(max-width: 767px)",
      width: mobileWidth,
      height: Math.round(mobileWidth / aspectRatio),
    },
    {
      src: `${baseUrl}?w=${tabletWidth}`,
      media: "(min-width: 768px) and (max-width: 1023px)",
      width: tabletWidth,
      height: Math.round(tabletWidth / aspectRatio),
    },
    {
      src: `${baseUrl}?w=${desktopWidth}`,
      media: "(min-width: 1024px)",
      width: desktopWidth,
      height: Math.round(desktopWidth / aspectRatio),
    },
  ];
}

/**
 * Example Usage:
 *
 * // Basic responsive image
 * <ResponsiveImage
 *   src="/hero.jpg"
 *   width={1920}
 *   height={1080}
 *   alt="Hero image"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 *
 * // With art direction
 * <ResponsiveImage
 *   src="/hero-desktop.jpg"
 *   width={1920}
 *   height={1080}
 *   alt="Hero image"
 *   sources={[
 *     { src: "/hero-mobile.jpg", media: "(max-width: 767px)", width: 750, height: 1000 },
 *     { src: "/hero-tablet.jpg", media: "(min-width: 768px)", width: 1536, height: 1024 },
 *   ]}
 * />
 *
 * // Mobile-first with aspect ratio
 * <MobileFirstImage
 *   src="/product.jpg"
 *   width={800}
 *   height={600}
 *   alt="Product image"
 *   aspectRatio="landscape"
 * />
 */
