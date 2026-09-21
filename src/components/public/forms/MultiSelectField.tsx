"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./MultiSelectField.module.css";

type MultiSelectFieldProps = {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  error?: string;
};

// A dropdown, checkbox-style stand-in for `<select multiple>` (which forces
// users to Ctrl/Cmd-click inside an always-open listbox). A hidden native
// select stays in sync with the same id/name/required attributes, so
// `validateForm()` and native FormData submission both keep working unchanged.
export default function MultiSelectField({
  label,
  name,
  options,
  required,
  error,
}: MultiSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const id = `field-${name}`;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const summary =
    selected.length === 0
      ? `Select ${label.toLowerCase()}`
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.length} selected`;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={styles["multi-select"]} ref={rootRef}>
        {/* Kept in sync, hidden but focusable, so validateForm()/FormData see a real <select multiple>. */}
        <select
          id={id}
          name={name}
          multiple
          required={required}
          value={selected}
          onChange={() => {}}
          onFocus={() => {
            setOpen(true);
            triggerRef.current?.focus();
          }}
          tabIndex={-1}
          aria-hidden="true"
          className={styles["multi-select-native"]}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          ref={triggerRef}
          className={cn(
            styles["multi-select-trigger"],
            selected.length === 0 && styles.placeholder,
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{summary}</span>
          <span className={styles["multi-select-caret"]} aria-hidden="true" />
        </button>
        {open ? (
          <ul
            className={styles["multi-select-menu"]}
            role="listbox"
            aria-multiselectable="true"
          >
            {options.map((option) => (
              <li key={option}>
                <label className={styles["multi-select-option"]}>
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {error ? <span className="error">{error}</span> : null}
    </div>
  );
}
