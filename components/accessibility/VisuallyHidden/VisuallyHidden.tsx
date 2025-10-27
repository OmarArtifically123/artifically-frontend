/**
 * VisuallyHidden - Hide element visually but keep it accessible to screen readers
 * WCAG 2.1 AAA - Text Alternatives
 */

import { createElement, type ReactNode } from "react";
import styles from "./VisuallyHidden.module.css";

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function VisuallyHidden({ children, as = "span" }: VisuallyHiddenProps): JSX.Element {
  return createElement(as, { className: styles.visuallyHidden }, children);
}

export default VisuallyHidden;

