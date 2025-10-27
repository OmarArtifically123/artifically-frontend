"use client";

import { useEffect } from "react";

type ShortcutConfig = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  handler: (e: KeyboardEvent) => void;
  description?: string;
};

/**
 * useKeyboardShortcuts - Hook for keyboard shortcuts
 * Supports modifier keys (Ctrl, Alt, Shift)
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === e.ctrlKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === e.altKey;
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === e.shiftKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
          e.preventDefault();
          shortcut.handler(e);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

export default useKeyboardShortcuts;

