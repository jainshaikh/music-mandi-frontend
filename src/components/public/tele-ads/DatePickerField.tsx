"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./DatePickerField.module.css";

type Props = {
  label: string;
  id: string;
  value: string; // yyyy-mm-dd
  onChange: (value: string) => void;
  min?: string; // yyyy-mm-dd
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISO(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

function formatDisplay(value: string): string {
  if (!value) return "";
  return parseISO(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Custom-styled calendar dropdown matching the seller builder's dark/pink
// theme — no Tailwind/shadcn dependency, since this project has neither and
// pulling either in just for a date field risks re-styling every other
// element site-wide.
export default function DatePickerField({
  label,
  id,
  value,
  onChange,
  min,
}: Props) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() =>
    (value ? parseISO(value) : new Date()).getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    (value ? parseISO(value) : new Date()).getMonth(),
  );
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const openCalendar = () => {
    const d = value ? parseISO(value) : new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setOpen(true);
  };

  const goPrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const selectDay = (day: number) => {
    onChange(toISO(new Date(viewYear, viewMonth, day)));
    setOpen(false);
  };

  const minDate = min ? parseISO(min) : null;
  const selectedDate = value ? parseISO(value) : null;
  const today = new Date();

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className={cn("seller-field", styles["date-picker-field"])}
      ref={rootRef}
    >
      <label htmlFor={id}>{label}</label>
      <button
        type="button"
        id={id}
        className={styles["date-picker-trigger"]}
        onClick={() => (open ? setOpen(false) : openCalendar())}
      >
        <span className={value ? undefined : styles.placeholder}>
          {value ? formatDisplay(value) : "Select date"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M3 9H21" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8 3V6M16 3V6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? (
        <div className={styles["date-picker-menu"]}>
          <div className={styles["date-picker-nav"]}>
            <button
              type="button"
              onClick={goPrevMonth}
              aria-label="Previous month"
            >
              &larr;
            </button>
            <b>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </b>
            <button type="button" onClick={goNextMonth} aria-label="Next month">
              &rarr;
            </button>
          </div>
          <div className={styles["date-picker-weekdays"]}>
            {WEEKDAY_LABELS.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
          <div className={styles["date-picker-grid"]}>
            {cells.map((day, i) => {
              if (day === null) return <span key={`blank-${i}`} />;
              const cellDate = new Date(viewYear, viewMonth, day);
              const disabled = minDate ? cellDate < minDate : false;
              const selected = selectedDate
                ? isSameDay(cellDate, selectedDate)
                : false;
              const isToday = isSameDay(cellDate, today);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    styles["date-picker-day"],
                    selected && styles.selected,
                    isToday && styles.today,
                  )}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
