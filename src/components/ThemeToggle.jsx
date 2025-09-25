import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "", label = "Toggle theme" }) {
  const { darkMode, toggleTheme } = useTheme();

  const icon = useMemo(() => (darkMode ? "🌙" : "🌞"), [darkMode]);
  const title = darkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={darkMode}
      title={title}
      className={`theme-toggle ${className}`.trim()}
    >
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-indicator" data-dark={darkMode} />
      </span>
      <span className="toggle-icon" role="presentation">{icon}</span>
    </button>
  );
}