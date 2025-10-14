import { memo, useCallback, useMemo, useState } from "react";

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

const SOURCE_FORMATS = [
  { type: "image/avif", extension: "avif" },
  { type: "image/webp", extension: "webp" },
];

const sanitizeSources = (sources = []) =>
  sources
    .filter(Boolean)
    .map((source) => {
      if (typeof source === "string") {
        return { srcSet: source };
      }
      return source;
    });

const parseImageSource = (value = "") => {
  if (typeof value !== "string" || value.length === 0) {
    return { basePath: "", extension: "", suffix: "" };
  }

  const queryIndex = value.search(/[?#]/);
  const path = queryIndex >= 0 ? value.slice(0, queryIndex) : value;
  const suffix = queryIndex >= 0 ? value.slice(queryIndex) : "";
  const match = path.match(/^(.*?)(?:\.([^.\\/]+))?$/);

  if (!match) {
    return { basePath: path, extension: "", suffix };
  }

  const [, basePath = "", extension = ""] = match;
  return { basePath, extension, suffix };
};

const OptimizedImageComponent = ({
  src,
  alt,
  sources = [],
  className,
  pictureClassName,
  loading = "lazy",
  decoding = "async",
  fallbackExtension = "jpg",
  ...props
}) => {
  const parsedSource = useMemo(() => parseImageSource(src), [src]);
  const normalizedSources = useMemo(() => {
    const sanitized = sanitizeSources(sources);
    if (sanitized.length > 0) {
      return sanitized;
    }

    if (!parsedSource.basePath) {
      return sanitized;
    }

    const fallbackExt = (parsedSource.extension || fallbackExtension || "jpg").toLowerCase();

    return SOURCE_FORMATS.filter(({ extension }) => extension !== fallbackExt).map(
      ({ type, extension }) => ({
        type,
        srcSet: `${parsedSource.basePath}.${extension}${parsedSource.suffix}`,
      }),
    );
  }, [fallbackExtension, parsedSource, sources]);

  const resolvedSrc = useMemo(() => {
    if (!parsedSource.basePath) {
      return src;
    }

    if (parsedSource.extension) {
      return src;
    }

    const extension = fallbackExtension || "jpg";
    return `${parsedSource.basePath}.${extension}${parsedSource.suffix}`;
  }, [fallbackExtension, parsedSource, src]);

  return (
    <picture className={pictureClassName}>
      {normalizedSources.map(({ srcSet, type, media, sizes }) => (
        <source key={`${type ?? ""}-${media ?? srcSet}`} srcSet={srcSet} type={type} media={media} sizes={sizes} />
      ))}
      <img src={resolvedSrc} alt={alt} className={className} loading={loading} decoding={decoding} {...props} />
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