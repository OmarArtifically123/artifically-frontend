"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../utils/cn";
import type { InputHTMLAttributes } from "react";

export interface AutocompleteOption<T = string> {
  label: string;
  value: T;
  description?: string;
}

export interface AutocompleteProps<T = string>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string;
  helperText?: string;
  placeholder?: string;
  options: Array<AutocompleteOption<T>>;
  value?: AutocompleteOption<T> | null;
  onChange?: (option: AutocompleteOption<T> | null) => void;
  filter?: (option: AutocompleteOption<T>, query: string) => boolean;
}

export function Autocomplete<T = string>({
  label,
  helperText,
  placeholder = "Search…",
  options,
  value,
  onChange,
  filter,
  className,
  ...rest
}: AutocompleteProps<T>) {
  const inputId = useId();
  const helperId = useId();
  const [query, setQuery] = useState(value?.label ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const results = useMemo(() => {
    const predicate = filter
      ? filter
      : (option: AutocompleteOption<T>, term: string) => {
          const label = typeof option.label === "string" ? option.label.toLowerCase() : "";
          const normalizedTerm = typeof term === "string" ? term.toLowerCase() : "";
          return label.includes(normalizedTerm);
        };
    const trimmed = query.trim();
    if (!trimmed) {
      return options.slice(0, 8);
    }
    return options.filter((option) => predicate(option, trimmed)).slice(0, 8);
  }, [filter, options, query]);

  const handleSelect = (option: AutocompleteOption<T> | null) => {
    setQuery(option?.label ?? "");
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className={cn("ads-autocomplete", className)}>
      <label className="ads-input-group" htmlFor={inputId}>
        {label ? <span className="ads-label">{label}</span> : null}
        <input
          id={inputId}
          className="ads-field"
          role="combobox"
          aria-haspopup="listbox"
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-list`}
          aria-describedby={helperText ? helperId : undefined}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(results.length - 1, 0)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            } else if (event.key === "Enter") {
              event.preventDefault();
              const option = results[highlightedIndex];
              if (option) {
                handleSelect(option);
              }
            } else if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          {...rest}
        />
        {helperText ? (
          <span className="ads-helper-text" id={helperId}>
            {helperText}
          </span>
        ) : null}
      </label>
      {isOpen && results.length ? (
        <div className="ads-autocomplete__list" id={`${inputId}-list`} role="listbox">
          {results.map((option, index) => {
            const active = highlightedIndex === index;
            return (
              <div
                key={`${option.label}-${index}`}
                role="option"
                aria-selected={value?.value === option.value}
                className="ads-autocomplete__option"
                data-highlighted={active ? "true" : undefined}
                tabIndex={-1}
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(option);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <strong>{option.label}</strong>
                {option.description ? <p className="ads-helper-text">{option.description}</p> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}