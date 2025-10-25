"use client";

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
        backgroundColor: 'var(--brand-primary, #0066cc)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '0.25rem',
        fontWeight: 600,
        fontSize: '1rem',
        top: '1rem',
      }}
      onFocus={(e) => { e.currentTarget.style.left = '1rem'; }}
      onBlur={(e) => { e.currentTarget.style.left = '-9999px'; }}
    >
      Skip to main content
    </a>
  );
}
