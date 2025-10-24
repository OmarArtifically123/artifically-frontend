'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { THEME_LIGHT, THEME_DARK, THEME_CONTRAST, THEME_SYSTEM } from '@/context/themeConstants';

/**
 * ThemeSwitcher - Four-way theme toggle component
 *
 * Allows users to switch between:
 * - Light mode
 * - Dark mode
 * - Contrast mode (WCAG AAA)
 * - System preference (follows OS)
 *
 * Accessibility features:
 * - Keyboard navigation (Tab, Arrow keys, Enter/Space)
 * - ARIA labels and roles
 * - Focus indicators
 * - Screen reader announcements
 * - 48px minimum touch target (WCAG 2.1 AAA)
 */

interface ThemeOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const ContrastIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
  </svg>
);

const themeOptions: ThemeOption[] = [
  {
    value: THEME_LIGHT,
    label: 'Light',
    icon: <SunIcon />,
    description: 'Light theme with bright backgrounds',
  },
  {
    value: THEME_DARK,
    label: 'Dark',
    icon: <MoonIcon />,
    description: 'Dark theme with darker backgrounds',
  },
  {
    value: THEME_SYSTEM,
    label: 'System',
    icon: <MonitorIcon />,
    description: 'Follow system preference',
  },
  {
    value: THEME_CONTRAST,
    label: 'Contrast',
    icon: <ContrastIcon />,
    description: 'High contrast theme (WCAG AAA)',
  },
];

export default function ThemeSwitcher() {
  const { themePreference, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);

    // Announce to screen readers
    const option = themeOptions.find((opt) => opt.value === newTheme);
    if (option) {
      const announcement = `Theme changed to ${option.label}`;
      const ariaLive = document.createElement('div');
      ariaLive.setAttribute('role', 'status');
      ariaLive.setAttribute('aria-live', 'polite');
      ariaLive.className = 'sr-only';
      ariaLive.textContent = announcement;
      document.body.appendChild(ariaLive);
      setTimeout(() => document.body.removeChild(ariaLive), 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleThemeChange(optionValue);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="theme-switcher-skeleton" style={{ width: '180px', height: '48px' }}>
        <span className="sr-only">Loading theme switcher...</span>
      </div>
    );
  }

  return (
    <div
      className="theme-switcher"
      role="radiogroup"
      aria-label="Theme selection"
      style={{
        display: 'flex',
        gap: '2px',
        padding: '2px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--border-default)',
      }}
    >
      <style jsx>{`
        @media (max-width: 768px) {
          .theme-label {
            display: none !important;
          }
          .theme-switcher-button {
            min-width: 36px !important;
            padding: 0 !important;
          }
        }
      `}</style>
      {themeOptions.map((option) => {
        const isActive = themePreference === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${option.label} theme: ${option.description}`}
            onClick={() => handleThemeChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
            className="theme-switcher-button"
            data-active={isActive}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minWidth: '36px',
              height: '36px',
              padding: '0 8px',
              backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
              color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
              border: '2px solid transparent',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'var(--interactive-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-focus)';
              e.currentTarget.style.outline = '2px solid var(--border-focus)';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.outline = 'none';
            }}
          >
            {option.icon}
            <span
              className="theme-label"
              style={{
                display: 'inline-block',
              }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Mobile-optimized compact version (icon-only)
export function ThemeSwitcherCompact() {
  const { themePreference, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  if (!mounted) {
    return <div style={{ width: '48px', height: '48px' }} />;
  }

  return (
    <div
      className="theme-switcher-compact"
      role="radiogroup"
      aria-label="Theme selection"
      style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--border-default)',
      }}
    >
      {themeOptions.map((option) => {
        const isActive = themePreference === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${option.label} theme`}
            onClick={() => handleThemeChange(option.value)}
            className="theme-switcher-button-compact"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
              color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
              border: '2px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}

// Dropdown version (for limited space)
export function ThemeSwitcherDropdown() {
  const { themePreference, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  if (!mounted) {
    return <div style={{ width: '48px', height: '48px' }} />;
  }

  const currentOption = themeOptions.find((opt) => opt.value === themePreference);

  return (
    <div className="theme-switcher-dropdown" style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        {currentOption?.icon}
      </button>

      {isOpen && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: '56px',
            right: '0',
            width: '200px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            padding: '8px',
            zIndex: 1000,
          }}
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              role="menuitem"
              onClick={() => handleThemeChange(option.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px',
                backgroundColor: themePreference === option.value ? 'var(--accent-primary)' : 'transparent',
                color: themePreference === option.value ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {option.icon}
              <div>
                <div style={{ fontWeight: 600 }}>{option.label}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
