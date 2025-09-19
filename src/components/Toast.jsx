import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500); // auto-dismiss after 3.5s
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const colors = {
    success: "var(--success)",
    error: "var(--danger)",
    warn: "var(--warning)",
    info: "var(--accent)",
  };

  return (
    <div
      className="toast"
      style={{ background: colors[type] || colors.success }}
    >
      {message}
    </div>
  );
}
