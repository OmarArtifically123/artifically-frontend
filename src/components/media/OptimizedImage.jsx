import { memo, useCallback, useMemo, useState } from "react";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const sanitizeSources = (sources = []) =>
  sources
    .filter(Boolean)
    .map((source) => {
      if (typeof source === "string") {
        return { srcSet: source };
      }
      return source;
    });

const OptimizedImageComponent = ({
  src,
  alt,
  sources = [],
  className,
  pictureClassName,
  loading = "lazy",
  decoding = "async",
  ...props
}) => {
  const normalizedSources = useMemo(() => sanitizeSources(sources), [sources]);

  return (
    <picture className={pictureClassName}>
      {normalizedSources.map(({ srcSet, type, media, sizes }) => (
        <source key={`${type ?? ""}-${media ?? srcSet}`} srcSet={srcSet} type={type} media={media} sizes={sizes} />
      ))}
      <img src={src} alt={alt} className={className} loading={loading} decoding={decoding} {...props} />
    </picture>
  );
};

OptimizedImageComponent.displayName = "OptimizedImage";

export const OptimizedImage = memo(OptimizedImageComponent);

const BlurImageComponent = ({
  src,
  blurDataURL,
  alt,
  sources = [],
  className,
  wrapperClassName,
  onLoad,
  loading = "lazy",
  decoding = "async",
  wrapperProps = {},
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(
    (event) => {
      setLoaded(true);
      onLoad?.(event);
    },
    [onLoad],
  );

  const imageClassName = useMemo(
    () => joinClasses("blur-image", loaded && "blur-image--loaded", className),
    [className, loaded],
  );
  const placeholderClassName = useMemo(
    () => joinClasses("blur-image__placeholder", loaded && "blur-image__placeholder--hidden"),
    [loaded],
  );

  return (
    <div className={joinClasses("blur-image-wrapper", wrapperClassName)} {...wrapperProps}>
      {blurDataURL ? (
        <img src={blurDataURL} alt="" aria-hidden="true" className={placeholderClassName} />
      ) : null}
      <OptimizedImage
        src={src}
        alt={alt}
        sources={sources}
        className={imageClassName}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

BlurImageComponent.displayName = "BlurImage";

export const BlurImage = memo(BlurImageComponent);

export default OptimizedImage;