"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";

function cx(baseClassName, additionalClassName) {
  if (!additionalClassName) {
    return baseClassName;
  }
  return `${baseClassName} ${additionalClassName}`;
}

function renderLogoContent(logo) {
  if (typeof logo === "string") {
    return logo;
  }

  if (logo && typeof logo === "object") {
    const { src, alt, label, name } = logo;
    if (src) {
      const resolvedAlt = alt || label || name || "Company logo";
      return (
        <Image
          src={src}
          alt={resolvedAlt}
          width={140}
          height={60}
          className="trusted-by__logo-img"
          loading="lazy"
          unoptimized
        />
      );
    }
    if (label || name) {
      return label || name;
    }
  }

  return String(logo ?? "");
}

export default function TrustedBy({ logos = [], className = "" }) {
  const { ref, inView } = useInView({ threshold: 0.8, triggerOnce: true });
  const skeletonCount = useMemo(() => (logos.length ? logos.length : 6), [logos.length]);
  const containerClassName = cx("trusted-by", className, inView && "trusted-by--visible");

  return (
    <div
      ref={ref}
      className={containerClassName}
      aria-label="Trusted by leading teams"
      data-visible={inView ? "true" : undefined}
    >
      <p className="trusted-by__eyebrow">TRUSTED BY TEAMS SHIPPING AI IN PRODUCTION</p>
      <div className="trusted-by__logos" role="list" aria-busy={!inView}>
        {inView
          ? logos.map((logo, index) => {
              const key =
                typeof logo === "string"
                  ? logo
                  : logo?.id || logo?.name || logo?.label || `trusted-logo-${index}`;

              return (
                <span
                  key={key}
                  role="listitem"
                  className="trusted-by__logo"
                  data-trusted-logo=""
                  style={{ "--trusted-index": index }}
                >
                  {renderLogoContent(logo)}
                </span>
              );
            })
          : Array.from({ length: skeletonCount }).map((_, index) => (
              <span
                key={`trusted-logo-skeleton-${index}`}
                role="presentation"
                aria-hidden="true"
                className="trusted-by__logo"
                style={{
                  "--trusted-index": index,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(148,163,184,0.08))",
                  color: "transparent",
                }}
              >
                •
              </span>
            ))}
      </div>
    </div>
  );
}