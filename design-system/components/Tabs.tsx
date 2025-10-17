import { useId, useState } from "react";
import { cn } from "../utils/cn";
import type { ReactNode } from "react";

export interface TabItem {
  id?: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function Tabs({ items, defaultActiveId, onChange, className, ariaLabel }: TabsProps) {
  const fallbackId = useId();
  const resolvedItems = items.map<Required<TabItem>>((item, index) => ({
    ...item,
    id: item.id ?? `${fallbackId}-${index}`,
  }));
  const [activeId, setActiveId] = useState<string>(
    defaultActiveId && resolvedItems.some((item) => item.id === defaultActiveId)
      ? defaultActiveId
      : resolvedItems[0]?.id ?? "",
  );

  return (
    <div className={cn("ads-tabs", className)}>
      <div className="ads-tabs__list" role="tablist" aria-label={ariaLabel}>
        {resolvedItems.map((item) => (
          <button
            key={item.id}
            className="ads-tabs__trigger"
            role="tab"
            id={item.id}
            type="button"
            data-active={item.id === activeId ? "true" : undefined}
            aria-selected={item.id === activeId}
            onClick={() => {
              setActiveId(item.id);
              onChange?.(item.id);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {resolvedItems.map((item) => (
        <div
          key={`${item.id}-panel`}
          role="tabpanel"
          hidden={item.id !== activeId}
          aria-labelledby={item.id}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}