"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./FaqAccordion.module.css";

export type FaqRow = { q: string; a: string };

/**
 * Reusable FAQ accordion used on the home page (and, later, the /tele-ads page).
 */
export default function FaqAccordion({
  items,
  firstOpen = false,
}: {
  items: FaqRow[];
  firstOpen?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    firstOpen ? 0 : null,
  );

  return (
    <div className={styles["faq-items"]}>
      {items.map((row, i) => (
        <div
          className={cn(styles["faq-item"], openIndex === i && styles.open)}
          key={row.q}
        >
          <button
            type="button"
            className={styles["faq-q"]}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            {row.q} <span>+</span>
          </button>
          <div className={styles["faq-a"]}>
            <p>{row.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
