"use client";

import { useState } from "react";

export default function AssistiveHint({ id, label = "Need guidance?", message, placement = "bottom" }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`assistive-hint assistive-hint--${placement}`}>
      <button
        type="button"
        aria-describedby={`${id}-tooltip`}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="assistive-hint__trigger"
      >
        <span aria-hidden="true">?</span>
        <span className="sr-only">{label}</span>
      </button>
      <div
        id={`${id}-tooltip`}
        role="tooltip"
        className="assistive-hint__tooltip"
        data-visible={visible || undefined}
      >
        {message}
      </div>
    </div>
  );
}