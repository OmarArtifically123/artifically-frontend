import { cloneElement, useId, useState } from "react";
import { cn } from "../utils/cn";
import type { ReactElement, ReactNode } from "react";

export interface TooltipProps {
  label: ReactNode;
  children: ReactElement;
  className?: string;
}

export function Tooltip({ label, children, className }: TooltipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  const child = cloneElement(children, {
    "aria-describedby": [children.props["aria-describedby"], tooltipId].filter(Boolean).join(" ") || undefined,
  });

  return (
    <span
      className={cn("ads-tooltip", className)}
      data-open={open ? "true" : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {child}
      <span role="tooltip" id={tooltipId} className="ads-tooltip__bubble">
        {label}
      </span>
    </span>
  );
}