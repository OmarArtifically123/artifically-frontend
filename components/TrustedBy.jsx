"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const reveal = () => {
      section.classList.add("trusted-by--visible");
    };

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      reveal();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={cx("trusted-by", className)}
      aria-label="Trusted by leading teams"
    >
      <p className="trusted-by__eyebrow">TRUSTED BY TEAMS SHIPPING AI IN PRODUCTION</p>
      <div className="trusted-by__logos" role="list">
        {logos.map((logo, index) => {
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
        })}
      </div>
    </div>
  );
}
