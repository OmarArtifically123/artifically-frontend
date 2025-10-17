"use client";

import { memo, useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

function normalizeParentProps(parentProps = {}) {
  if (!parentProps || typeof parentProps !== "object") {
    return {};
  }

  // Prevent overriding the internal ref used for virtualization scroll container
  const { ref: _ignoredRef, ...rest } = parentProps;
  return rest;
}

const SOURCE_SIZE_FALLBACK = 400;
const OVERSCAN_FALLBACK = 4;

const VirtualizedAutomationListComponent = ({
  items = [],
  estimateSize = SOURCE_SIZE_FALLBACK,
  overscan = OVERSCAN_FALLBACK,
  getKey,
  renderItem,
  parentProps,
}) => {
  const parentRef = useRef(null);
  const count = Array.isArray(items) ? items.length : 0;

  const resolveKey = useCallback(
    (item, index) => {
      if (typeof getKey === "function") {
        return getKey(item, index);
      }

      if (item && typeof item === "object") {
        if (item.key != null) return item.key;
        if (item.id != null) return item.id;
        if (item.item && typeof item.item === "object" && item.item.id != null) {
          return item.item.id;
        }
      }

      return index;
    },
    [getKey],
  );

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const resolvedParentProps = normalizeParentProps(parentProps);

  return (
    <div ref={parentRef} {...resolvedParentProps}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items?.[virtualRow.index];
          if (!item) return null;

          const key = resolveKey(item, virtualRow.index);
          const content = renderItem?.(item, virtualRow.index, virtualRow);
          if (!content) return null;

          return (
            <div
              key={key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

VirtualizedAutomationListComponent.displayName = "VirtualizedAutomationList";

export default memo(VirtualizedAutomationListComponent);