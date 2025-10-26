"use client";

/**
 * WCAG 2.4.1 Level A - Bypass Blocks
 * Provides a skip link to bypass repeated navigation and jump to main content.
 * Visible on keyboard focus for screen reader and keyboard users.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 999999,
        padding: '1rem 1.5rem',
        backgroundColor: 'var(--accent-primary, #6366f1)',
        color: 'var(--text-inverse, #ffffff)',
        textDecoration: 'none',
        borderRadius: '0.5rem',
        fontWeight: 600,
        fontSize: '1rem',
        top: '1rem',
        outline: '3px solid var(--border-focus, #a78bfa)',
        outlineOffset: '2px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = '1rem';
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = '-9999px';
      }}
    >
      Skip to main content
    </a>
  );
}
