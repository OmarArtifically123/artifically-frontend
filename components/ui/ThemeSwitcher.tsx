'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { THEME_LIGHT, THEME_DARK, THEME_CONTRAST } from '@/context/themeConstants';

/**
 * Minimal Dropdown Theme Switcher - NO clutter, just an icon button
 *
 * Features:
 * - Single icon button (48x48px)
 * - Dropdown on click
 * - Three themes: Light, Dark, Contrast
 * - Fully accessible
 */

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ContrastIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
  </svg>
);

const themes = [
  { value: THEME_LIGHT, label: 'Light', icon: <SunIcon />, description: 'Light theme' },
  { value: THEME_DARK, label: 'Dark', icon: <MoonIcon />, description: 'Dark theme' },
  { value: THEME_CONTRAST, label: 'Contrast', icon: <ContrastIcon />, description: 'High contrast' },
];

export default function ThemeSwitcher() {
  const { themePreference, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    setIsOpen(false);
  };

  if (!mounted) {
    return <div style={{ width: '48px', height: '48px' }} />;
  }

  const currentTheme = themes.find((t) => t.value === themePreference) || themes[1];

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current theme: ${currentTheme.label}. Click to change theme.`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '48px',
          minHeight: '48px',
          padding: '12px',
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--interactive-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {currentTheme.icon}
      </button>

      {isOpen && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: '48px',
            right: '0',
            width: '180px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            padding: '8px',
            zIndex: 9999,
          }}
        >
          {themes.map((theme) => (
            <button
              key={theme.value}
              role="menuitem"
              onClick={() => handleThemeChange(theme.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                minHeight: '48px',
                padding: '12px',
                backgroundColor: themePreference === theme.value ? 'var(--accent-primary)' : 'transparent',
                color: themePreference === theme.value ? 'var(--text-inverse)' : 'var(--text-primary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: themePreference === theme.value ? 600 : 400,
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (themePreference !== theme.value) {
                  e.currentTarget.style.backgroundColor = 'var(--interactive-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (themePreference !== theme.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {theme.icon}
              <span>{theme.label}</span>
              {themePreference === theme.value && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  style={{ marginLeft: 'auto' }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
