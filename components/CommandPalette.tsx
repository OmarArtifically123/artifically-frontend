
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/icons/Icon";
import { useAppShell } from "@/context/AppShellContext";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { isFocusableElement } from "@/utils/focus";
import {
  getCommandPaletteItems,
  type CommandPaletteItem,
  type CommandPaletteSection,
} from "@/data/commandPaletteItems";

const HIGHLIGHT_COLOR = "#a78bfa";
const RECENT_STORAGE_KEY = "artifically:command-palette:recent";
const SECTION_ORDER: CommandPaletteSection[] = [
  "Automations",
  "Pages",
  "Documentation",
  "Actions",
];

type CommandPaletteOpenDetail = {
  trigger?: HTMLElement | null;
};

type PaletteResult = {
  item: CommandPaletteItem;
  score: number;
  titleHighlights: Set<number>;
  subtitleHighlights: Set<number>;
};

type ResultSection = {
  title: string;
  items: PaletteResult[];
};

function fuzzyMatchPositions(query: string, text: string): { score: number; positions: number[] } | null {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return null;
  }
  const haystack = text.toLowerCase();
  let queryIndex = 0;
  const positions: number[] = [];
  let score = 0;
  let streak = 0;

  for (let index = 0; index < haystack.length && queryIndex < needle.length; index += 1) {
    if (haystack[index] === needle[queryIndex]) {
      positions.push(index);
      score += 6 + streak * 2;
      streak += 1;
      queryIndex += 1;
    } else {
      streak = 0;
    }
  }

  if (queryIndex !== needle.length) {
    return null;
  }

  if (positions.length > 0) {
    const span = positions[positions.length - 1] - positions[0] + 1;
    const density = needle.length / Math.max(span, 1);
    score += density * 4;
    score += Math.max(0, 5 - positions[0] * 0.05);
  }

  return { score, positions };
}

function evaluateMatch(query: string, item: CommandPaletteItem): PaletteResult | null {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const titleMatch = fuzzyMatchPositions(trimmed, item.title);
  const subtitleMatch = fuzzyMatchPositions(trimmed, item.subtitle);

  let keywordScore = 0;
  if (item.keywords && item.keywords.length > 0) {
    const keywordMatch = fuzzyMatchPositions(trimmed, item.keywords.join(" "));
    if (keywordMatch) {
      keywordScore = keywordMatch.score * 0.5;
    }
  }

  if (!titleMatch && !subtitleMatch && keywordScore === 0) {
    return null;
  }

  const score =
    (titleMatch ? titleMatch.score * 3 : 0) +
    (subtitleMatch ? subtitleMatch.score * 2 : 0) +
    keywordScore;

  return {
    item,
    score,
    titleHighlights: new Set(titleMatch?.positions ?? []),
    subtitleHighlights: new Set(subtitleMatch?.positions ?? []),
  };
}

function renderHighlightedText(text: string, highlights: Set<number>): ReactNode {
  if (!text) {
    return null;
  }

  if (!highlights || highlights.size === 0) {
    return text;
  }

  const segments: ReactNode[] = [];
  let buffer = "";

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const isHighlighted = highlights.has(index);

    if (isHighlighted) {
      if (buffer) {
        segments.push(<span key={`text-${index}`}>{buffer}</span>);
        buffer = "";
      }
      segments.push(
        <span
          key={`highlight-${index}`}
          style={{ color: HIGHLIGHT_COLOR, fontWeight: 600, textDecoration: "underline" }}
        >
          {character}
        </span>,
      );
    } else {
      buffer += character;
    }
  }

  if (buffer) {
    segments.push(<span key="text-tail">{buffer}</span>);
  }

  return segments;
}

function groupDefaultSections(
  items: CommandPaletteItem[],
  excludeIds: Set<string>,
): ResultSection[] {
  const grouped: ResultSection[] = [];

  SECTION_ORDER.forEach((section) => {
    const sectionItems = items
      .filter((item) => item.section === section)
      .filter((item) => !excludeIds.has(item.id))
      .slice(0, 5)
      .map((item, index) => ({
        item,
        score: 100 - index,
        titleHighlights: new Set<number>(),
        subtitleHighlights: new Set<number>(),
      }));

    if (sectionItems.length > 0) {
      grouped.push({ title: section, items: sectionItems });
    }
  });

  return grouped;
}

export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { openAuth } = useAppShell();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsListId = useId();
  const items = useMemo<CommandPaletteItem[]>(() => getCommandPaletteItems(), []);
  const itemsById = useMemo<Map<string, CommandPaletteItem>>(
    () => new Map(items.map((item) => [item.id, item] as const)),
    [items],
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const trimmedQuery = query.trim();
  const triggerRestoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = window.localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentIds(parsed.filter((value) => typeof value === "string"));
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Unable to parse command palette recents", error);
      }
    }
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useFocusTrap(open, modalRef, {
    initialFocusRef: inputRef,
    onEscape: closePalette,
    returnFocusRef: triggerRestoreRef,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (tagName === "input" || tagName === "textarea" || target.isContentEditable) {
          return;
        }
      }

      const isMeta = event.metaKey || (event.ctrlKey && !event.metaKey);
      const isK = event.key.toLowerCase() === "k";

      if (isMeta && isK && !event.altKey && !event.shiftKey) {
        event.preventDefault();

        if (typeof document !== "undefined") {
          const activeElement = document.activeElement as HTMLElement | null;
          if (!open) {
            triggerRestoreRef.current = isFocusableElement(activeElement ?? null) ? activeElement : null;
          }
        }

        if (open) {
          closePalette();
        } else {
          setOpen(true);
        }

        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        closePalette();
      }
    };

    const handleOpenEvent = (event: Event) => {
      const detail = (event as CustomEvent<CommandPaletteOpenDetail>).detail;
      let trigger: HTMLElement | null = null;
      if (detail?.trigger && isFocusableElement(detail.trigger)) {
        trigger = detail.trigger;
      } else if (typeof document !== "undefined") {
        const activeElement = document.activeElement as HTMLElement | null;
        trigger = isFocusableElement(activeElement ?? null) ? activeElement : null;
      }

      if (open) {
        if (trigger) {
          triggerRestoreRef.current = trigger;
        }
        closePalette();
        return;
      }

      triggerRestoreRef.current = trigger;
      setOpen(true);
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("command-palette:open", handleOpenEvent as EventListener);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("command-palette:open", handleOpenEvent as EventListener);
    };
  }, [closePalette, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSelectedIndex(0);
  }, [open, pathname]);

  const recentItems = useMemo(() => {
    const collected: PaletteResult[] = [];
    recentIds.forEach((recentId) => {
      const item = itemsById.get(recentId);
      if (item) {
        collected.push({
          item,
          score: 200,
          titleHighlights: new Set<number>(),
          subtitleHighlights: new Set<number>(),
        });
      }
    });
    return collected;
  }, [itemsById, recentIds]);

  const sections = useMemo(() => {
    if (trimmedQuery === "") {
      const exclude = new Set(recentItems.map((recent) => recent.item.id));
      const defaults = groupDefaultSections(items, exclude);
      if (recentItems.length > 0) {
        return [
          { title: "Recent", items: recentItems },
          ...defaults,
        ];
      }
      return defaults;
    }

    const matches: PaletteResult[] = [];

    items.forEach((item: CommandPaletteItem) => {
      const evaluated = evaluateMatch(trimmedQuery, item);
      if (evaluated) {
        matches.push(evaluated);
      }
    });

    matches.sort((a, b) => b.score - a.score);

    const grouped = new Map<CommandPaletteSection | "Recent", PaletteResult[]>();

    matches.forEach((result) => {
      const existing = grouped.get(result.item.section);
      if (existing) {
        existing.push(result);
      } else {
        grouped.set(result.item.section, [result]);
      }
    });

    const ordered: ResultSection[] = [];

    SECTION_ORDER.forEach((section) => {
      const itemsForSection = grouped.get(section);
      if (itemsForSection && itemsForSection.length > 0) {
        ordered.push({ title: section, items: itemsForSection });
      }
    });

    return ordered;
  }, [items, recentItems, trimmedQuery]);

  const flattenedResults = useMemo(() => sections.flatMap((section) => section.items), [sections]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (trimmedQuery === "") {
      setSelectedIndex(0);
    } else if (flattenedResults.length > 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [flattenedResults.length, open, trimmedQuery]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (flattenedResults.length === 0) {
      setSelectedIndex(-1);
      return;
    }

    setSelectedIndex((previous) => {
      if (previous < 0 || previous >= flattenedResults.length) {
        return 0;
      }
      return previous;
    });
  }, [flattenedResults, open]);

  const selectedItem = selectedIndex >= 0 ? flattenedResults[selectedIndex]?.item : undefined;
  const getOptionId = useCallback(
    (itemId: string) => `${resultsListId}-option-${itemId}`,
    [resultsListId],
  );
  const activeDescendantId = selectedItem ? getOptionId(selectedItem.id) : undefined;

  const storeRecent = useCallback((itemId: string) => {
    setRecentIds((current) => {
      const next = [itemId, ...current.filter((value) => value !== itemId)].slice(0, 6);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
        } catch (error) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Unable to persist command palette recents", error);
          }
        }
      }
      return next;
    });
  }, []);

  const executeItem = useCallback(
    (item?: CommandPaletteItem) => {
      if (!item) {
        return;
      }

      closePalette();
      storeRecent(item.id);

      if (item.quickActionId === "start-trial") {
        openAuth("signup");
        return;
      }

      if (item.href) {
        router.push(item.href);
      }
    },
    [closePalette, openAuth, router, storeRecent],
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) {
        return;
      }

      if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
        if (flattenedResults.length === 0) {
          return;
        }
        event.preventDefault();
        setSelectedIndex((previous) => {
          const next = (previous + 1 + flattenedResults.length) % flattenedResults.length;
          return next;
        });
        return;
      }

      if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
        if (flattenedResults.length === 0) {
          return;
        }
        event.preventDefault();
        setSelectedIndex((previous) => {
          const next = (previous - 1 + flattenedResults.length) % flattenedResults.length;
          return next;
        });
        return;
      }

      if (event.key === "Home") {
        if (flattenedResults.length === 0) {
          return;
        }
        event.preventDefault();
        setSelectedIndex(0);
        return;
      }

      if (event.key === "End") {
        if (flattenedResults.length === 0) {
          return;
        }
        event.preventDefault();
        setSelectedIndex(flattenedResults.length - 1);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        executeItem(selectedItem);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closePalette();
      }
    },
    [closePalette, executeItem, flattenedResults.length, open, selectedItem],
  );

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closePalette();
      }
    },
    [closePalette],
  );

  const handleResultClick = useCallback(
    (result: PaletteResult) => {
      executeItem(result.item);
    },
    [executeItem],
  );

  const renderResultItem = useCallback(
    (result: PaletteResult, index: number) => {
      const { item, titleHighlights, subtitleHighlights } = result;
      const isSelected = index === selectedIndex;

      const iconBackgroundBySection: Record<CommandPaletteSection, string> = {
        Automations: "rgba(139, 92, 246, 0.18)",
        Pages: "rgba(59, 130, 246, 0.18)",
        Documentation: "rgba(45, 212, 191, 0.18)",
        Actions: "rgba(250, 204, 21, 0.18)",
      };

      const iconColorBySection: Record<CommandPaletteSection, string> = {
        Automations: "#c4b5fd",
        Pages: "#93c5fd",
        Documentation: "#5eead4",
        Actions: "#facc15",
      };

      return (
        <div
          key={item.id}
          id={getOptionId(item.id)}
          className={`command-palette__result ${isSelected ? "selected" : ""}`}
          onClick={() => handleResultClick(result)}
          onMouseEnter={() => setSelectedIndex(index)}
          onMouseDown={(event) => event.preventDefault()}
          role="option"
          aria-selected={isSelected}
          tabIndex={-1}
        >
          <span
            className="command-palette__result-icon"
            style={{
              background: iconBackgroundBySection[item.section],
              color: iconColorBySection[item.section],
            }}
          >
            <Icon name={item.icon} size={18} strokeWidth={2} />
          </span>
          <span className="command-palette__result-body">
            <span className="command-palette__result-title">{renderHighlightedText(item.title, titleHighlights)}</span>
            <span className="command-palette__result-subtitle">
              {renderHighlightedText(item.subtitle, subtitleHighlights)}
            </span>
          </span>
          {item.shortcut ? <span className="command-palette__result-shortcut">{item.shortcut}</span> : null}
        </div>
      );
    },
    [getOptionId, handleResultClick, selectedIndex],
  );

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="command-palette__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onClick={handleBackdropClick}
          role="presentation"
        >
          <div className="command-palette__modal-container">
            <motion.div
              className="command-palette__modal"
              initial={{ opacity: 0, scale: 0.96, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
              aria-describedby="command-palette-modal-description"
              ref={modalRef}
              tabIndex={-1}
            >
              <h2 id="command-palette-title" className="sr-only">
                Command palette
              </h2>
              <p id="command-palette-modal-description" className="sr-only">
                Search automations, documentation, and quick actions. Use the arrow keys to move through results, press
                Enter to run a command, and press Escape to close. Press Command+K on Mac or Control+K on Windows from
                anywhere to open this dialog.
              </p>
              <div className="command-palette__input-wrapper">
                <Icon name="search" size={20} strokeWidth={2} className="command-palette__input-icon" />
                <input
                  ref={inputRef}
                  className="command-palette__input"
                  type="text"
                  value={query}
                  placeholder="Search automations, docs, or type a command..."
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={open}
                  aria-controls={resultsListId}
                  aria-activedescendant={activeDescendantId}
                />
              </div>
              <div
                className="command-palette__results"
                role="listbox"
                id={resultsListId}
                aria-labelledby="command-palette-title"
              >
                {sections.length === 0 || flattenedResults.length === 0 ? (
                  <div className="command-palette__empty">No matches. Try a different keyword.</div>
                ) : (
                  (() => {
                    let runningIndex = 0;
                    return sections.map((section) => {
                      const sectionNodes = section.items.map((result) => {
                        const currentIndex = runningIndex;
                        runningIndex += 1;
                        return renderResultItem(result, currentIndex);
                      });
                      return (
                        <div key={section.title} className="command-palette__section">
                          <div className="command-palette__section-title">{section.title.toUpperCase()}</div>
                          {sectionNodes}
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            <footer className="command-palette__footer">
                <div className="command-palette__hint">
                  <span className="command-palette__hint-key">↑↓</span>
                  <span>Navigate</span>
                </div>
                <div className="command-palette__hint">
                  <span className="command-palette__hint-key">↵</span>
                  <span>Select</span>
                </div>
                <div className="command-palette__hint">
                  <span className="command-palette__hint-key">esc</span>
                  <span>Close</span>
                </div>
              </footer>
            </motion.div>
          </div>
          <style jsx global>{`
            .command-palette__overlay {
              position: fixed;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(8px);
              z-index: 10000;
              padding: 24px;
            }

            .command-palette__modal-container {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -40vh);
              width: min(640px, 100%);
              max-height: 560px;
          }

          .command-palette__modal {
              width: 100%;
              background: #1a1f35;
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 20px;
              box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7);
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }

            .command-palette__input-wrapper {
              position: relative;
              padding: 20px 24px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              background: transparent;
            }

            .command-palette__input-icon {
              position: absolute;
              left: 24px;
              top: 50%;
              transform: translateY(-50%);
              color: rgba(255, 255, 255, 0.5);
              pointer-events: none;
            }

            .command-palette__input {
              width: 100%;
              font-size: 17px;
              font-weight: 400;
              color: #ffffff;
              background: transparent;
              border: none;
              outline: none;
              padding: 0 0 0 36px;
              height: 28px;
            }

            .command-palette__input::placeholder {
              color: rgba(255, 255, 255, 0.4);
            }

            .command-palette__results {
              padding: 12px 8px;
              max-height: 450px;
              overflow-y: auto;
              flex: 1;
              scrollbar-width: thin;
              scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
            }

            .command-palette__results::-webkit-scrollbar {
              width: 6px;
            }

            .command-palette__results::-webkit-scrollbar-track {
              background: transparent;
            }

            .command-palette__results::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 999px;
            }

            .command-palette__section {
              padding: 0 8px 12px;
            }

            .command-palette__section-title {
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1px;
              color: rgba(255, 255, 255, 0.72);
              padding: 16px 8px 8px;
            }

            .command-palette__result {
              width: 100%;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 16px;
              border-radius: 10px;
              margin-bottom: 2px;
              cursor: pointer;
              background: transparent;
              border: 1px solid transparent;
              transition: background 0.2s ease, border 0.2s ease;
              color: inherit;
            }

            .command-palette__result:hover {
              background: rgba(255, 255, 255, 0.08);
            }

            .command-palette__result.selected {
              background: rgba(139, 92, 246, 0.2);
              border: 1px solid rgba(139, 92, 246, 0.5);
            }

            .command-palette__result-icon {
              width: 32px;
              height: 32px;
              border-radius: 999px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .command-palette__result-body {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 2px;
              flex: 1;
              min-width: 0;
            }

            .command-palette__result-title {
              font-size: 15px;
              font-weight: 500;
              color: #ffffff;
              display: inline-flex;
              flex-wrap: wrap;
              gap: 0;
            }

            .command-palette__result-subtitle {
              font-size: 13px;
              color: rgba(255, 255, 255, 0.5);
              display: inline-flex;
              flex-wrap: wrap;
              gap: 0;
            }

            .command-palette__result-shortcut {
              padding: 4px 8px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 6px;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.6);
            }

            .command-palette__empty {
              padding: 32px 16px;
              text-align: center;
              color: rgba(255, 255, 255, 0.6);
              font-size: 14px;
            }

            .command-palette__footer {
              padding: 12px 24px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              background: rgba(0, 0, 0, 0.2);
              display: flex;
              align-items: center;
              gap: 16px;
            }

            .command-palette__hint {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              font-size: 12px;
              color: rgba(255, 255, 255, 0.5);
            }

            .command-palette__hint-key {
              padding: 4px 8px;
              border-radius: 6px;
              background: rgba(255, 255, 255, 0.08);
              color: rgba(255, 255, 255, 0.6);
              font-weight: 500;
              font-size: 12px;
            }

            @media (max-width: 720px) {
              .command-palette__modal-container {
                width: 100%;
                transform: translate(-50%, -40vh);
              }
            }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}