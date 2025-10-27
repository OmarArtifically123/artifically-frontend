"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  /**
   * Whether this image is above the fold (affects loading priority)
   */
  priority?: boolean;
  /**
   * Fallback color while loading
   */
  placeholderColor?: string;
  /**
   * Callback when image loads
   */
  onLoadComplete?: () => void;
}

/**
 * Optimized image component that:
 * 1. Prevents CLS by reserving space
 * 2. Uses native lazy loading for below-fold images
 * 3. Provides loading states
 * 4. Optimizes for LCP when priority is set
 */
export default function OptimizedImage({
  priority = false,
  placeholderColor = "transparent",
  onLoadComplete,
  className = "",
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundColor: isLoading ? placeholderColor : "transparent",
        transition: "background-color 0.3s ease",
      }}
    >
      <Image
        {...props}
        alt={alt}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        quality={85}
        onLoad={() => {
          setIsLoading(false);
          onLoadComplete?.();
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
          ...props.style,
        }}
      />
      {hasError && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.1)",
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}



