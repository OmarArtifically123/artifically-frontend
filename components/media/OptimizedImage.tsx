"use client";

import Image, { ImageProps } from "next/image";
import { memo, useMemo, useState } from "react";
import type { HTMLAttributes } from "react";

const DEFAULT_PHOTO_QUALITY = 85;
const DEFAULT_UI_QUALITY = 90;

type BaseOptimizedImageProps = Omit<
  ImageProps,
  | "loader"
  | "blurDataURL"
  | "placeholder"
  | "quality"
  | "fill"
> & {
  quality?: number;
  isUIScreenshot?: boolean;
  onLoadingComplete?: ImageProps["onLoadingComplete"];
};

type BlurImageProps = BaseOptimizedImageProps & {
  blurDataURL: string;
  wrapperClassName?: string;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
};

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function resolveQuality(quality: number | undefined, isUIScreenshot = false) {
  if (typeof quality === "number") {
    return quality;
  }
  return isUIScreenshot ? DEFAULT_UI_QUALITY : DEFAULT_PHOTO_QUALITY;
}

function OptimizedImageComponent({
  className,
  isUIScreenshot,
  quality,
  loading = "lazy",
  fetchPriority,
  alt,
  ...props
}: BaseOptimizedImageProps) {
  const resolvedQuality = resolveQuality(quality, isUIScreenshot);

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      quality={resolvedQuality}
    />
  );
}

const OptimizedImage = memo(OptimizedImageComponent);

function BlurImageComponent({
  blurDataURL,
  wrapperClassName,
  wrapperProps,
  className,
  isUIScreenshot,
  quality,
  loading = "lazy",
  fetchPriority,
  alt,
  ...props
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);

  const { className: wrapperPropClassName, ...restWrapperProps } = wrapperProps ?? {};

  const imageClassName = useMemo(
    () => joinClasses("blur-image", loaded && "blur-image--loaded", className),
    [className, loaded],
  );

  const wrapperMergedClass = useMemo(
    () =>
      joinClasses(
        "blur-image-wrapper",
        loaded && "blur-image-wrapper--loaded",
        wrapperClassName,
        wrapperPropClassName,
      ),
    [loaded, wrapperClassName, wrapperPropClassName],
  );

  const resolvedQuality = resolveQuality(quality, isUIScreenshot);

  return (
    <div className={wrapperMergedClass} {...restWrapperProps}>
      <Image
        {...props}
        alt={alt}
        className={imageClassName}
        blurDataURL={blurDataURL}
        placeholder="blur"
        quality={resolvedQuality}
        loading={loading}
        fetchPriority={fetchPriority}
        onLoadingComplete={(result) => {
          setLoaded(true);
          props.onLoadingComplete?.(result);
        }}
      />
    </div>
  );
}

const BlurImage = memo(BlurImageComponent);

export { BlurImage, OptimizedImage };
export default OptimizedImage;