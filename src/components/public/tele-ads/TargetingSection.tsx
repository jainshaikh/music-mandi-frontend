"use client";

import { cn } from "@/lib/utils";
import { useTeleAds } from "./TeleAdsContext";
import styles from "./TargetingSection.module.css";

const CARDS = [
  {
    cls: "ac-region",
    label: "Region",
    value: "Pakistan",
    desc: "National, province, city or operator circle.",
  },
  {
    cls: "ac-age",
    label: "Demographic",
    value: "18 to 34",
    desc: "Age and gender controls shape who hears the message.",
  },
  {
    cls: "ac-device",
    label: "Device",
    value: "Smartphone",
    desc: "Handset tier plus prepaid or postpaid connection.",
  },
  {
    cls: "ac-behaviour",
    label: "Behaviour",
    value: "High data",
    desc: "Usage and call patterns refine the audience.",
  },
] as const;

export default function TargetingSection() {
  const { chips, chipLabels, toggleChip, estimateText } = useTeleAds();

  return (
    <section
      className={cn(styles["targeting-new"], styles["restored-targeting"])}
    >
      <div className={styles["targeting-copy"]}>
        <span className="route-kicker">Targeting</span>
        <h2>Build the audience from real telecom signals.</h2>
        <p>
          Select the dimensions that matter, then watch the estimated audience
          change as the brief becomes more specific.
        </p>
        <div className={styles["target-chipset"]}>
          {chipLabels.map((label, i) => (
            <button
              key={label}
              type="button"
              className={chips[i] ? styles.on : ""}
              onClick={() => toggleChip(i)}
              aria-pressed={chips[i]}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles["audience-lab"]}>
        <div className={styles["audience-center"]}>
          <span>ESTIMATED AUDIENCE</span>
          <b id="audiencePulse">{estimateText}</b>
          <span>LIVE PREVIEW</span>
        </div>
        {CARDS.map((c) => (
          <div
            className={cn(styles["audience-card"], styles[c.cls])}
            key={c.cls}
          >
            <small>{c.label}</small>
            <strong>{c.value}</strong>
            <span>{c.desc}</span>
          </div>
        ))}
        <i className={cn(styles["signal-dot"], styles.sd1)}></i>
        <i className={cn(styles["signal-dot"], styles.sd2)}></i>
        <i className={cn(styles["signal-dot"], styles.sd3)}></i>
        <i className={cn(styles["signal-dot"], styles.sd4)}></i>
      </div>
    </section>
  );
}
