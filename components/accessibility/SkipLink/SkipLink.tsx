"use client";

import { useRef } from "react";
import styles from "./SkipLink.module.css";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * SkipLink - Accessible skip navigation link
 * WCAG 2.1 AAA - Bypass Blocks
 */
export function SkipLink({ href, children }: SkipLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      (target as HTMLElement).focus();
      (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={handleClick}
      className={styles.skipLink}
    >
      {children}
    </a>
  );
}

export default SkipLink;


