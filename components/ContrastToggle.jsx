import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { Icon } from "./icons";

export default function ContrastToggle({ className = "", label = "Toggle high contrast" }) {
  const { highContrast, toggleContrast } = useTheme();
  const title = highContrast ? "Switch to standard contrast" : "Enable high-contrast mode";
  const iconName = useMemo(() => (highContrast ? "contrast" : "sparkles"), [highContrast]);

  return (
    <button
      type="button"
      className={`contrast-toggle ${className}`.trim()}
      onClick={toggleContrast}
      aria-label={label}
      aria-pressed={highContrast}
      title={title}
      data-active={highContrast}
    >
      <span className="contrast-toggle__track" aria-hidden="true">
        <span className="contrast-toggle__indicator" data-active={highContrast} />
      </span>
      <span className="contrast-toggle__icon" role="presentation">
        <Icon name={iconName} size={16} />
      </span>
    </button>
  );
}