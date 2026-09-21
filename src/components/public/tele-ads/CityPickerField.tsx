"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PAKISTAN_CITIES } from "@/lib/pakistanCities";
import styles from "./CityPickerField.module.css";

type Props = {
  value: string[];
  onChange: (cities: string[]) => void;
};

// Searchable, province-grouped city multi-select. Selected cities render as
// removable badges below — cities from different provinces can be mixed
// freely, since a real campaign might target e.g. Lahore + Karachi + Quetta.
export default function CityPickerField({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const toggleCity = (city: string) => {
    onChange(
      value.includes(city) ? value.filter((c) => c !== city) : [...value, city],
    );
  };

  const removeCity = (city: string) => {
    onChange(value.filter((c) => c !== city));
  };

  const q = query.trim().toLowerCase();
  const filteredGroups = PAKISTAN_CITIES.map((group) => ({
    region: group.region,
    cities: q
      ? group.cities.filter((c) => c.toLowerCase().includes(q))
      : group.cities,
  })).filter((group) => group.cities.length > 0);

  return (
    <div
      className={cn("seller-field", styles["city-picker-field"])}
      ref={rootRef}
    >
      <label htmlFor="sellerCitySearch">Cities</label>
      <input
        id="sellerCitySearch"
        placeholder="Search a city…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open ? (
        <div className={styles["city-picker-menu"]}>
          {filteredGroups.length === 0 ? (
            <div className={styles["city-picker-empty"]}>
              No cities match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div className={styles["city-picker-group"]} key={group.region}>
                <span className={styles["city-picker-region"]}>
                  {group.region}
                </span>
                {group.cities.map((city) => (
                  <label className={styles["city-picker-option"]} key={city}>
                    <input
                      type="checkbox"
                      checked={value.includes(city)}
                      onChange={() => toggleCity(city)}
                    />
                    {city}
                  </label>
                ))}
              </div>
            ))
          )}
        </div>
      ) : null}
      {value.length > 0 ? (
        <div className={styles["city-picker-badges"]}>
          {value.map((city) => (
            <span className={styles["city-badge"]} key={city}>
              {city}
              <button
                type="button"
                aria-label={`Remove ${city}`}
                onClick={() => removeCity(city)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      ) : (
        <span className="helper">
          Search and select any number of cities across provinces.
        </span>
      )}
    </div>
  );
}
