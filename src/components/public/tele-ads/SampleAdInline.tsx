"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTeleAds } from "./TeleAdsContext";
import styles from "./SampleAdInline.module.css";

export default function SampleAdInline() {
  const { sampleVisible } = useTeleAds();
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(styles["sample-inline"], playing && styles.playing)}
      id="sampleInline"
      hidden={!sampleVisible}
    >
      <div className={styles["sample-avatar"]}>&#9834;</div>
      <div className={styles["sample-copy"]}>
        <span>Sample artist ad</span>
        <strong>
          &ldquo;Salam, my new single is live. Listen now and tap the link we
          just sent you.&rdquo;
        </strong>
        <div className={styles["sample-player"]}>
          <button
            id="samplePlay"
            onClick={() => setPlaying((p) => !p)}
            aria-label="Play sample ad"
          >
            {playing ? "Ⅱ" : "▶"}
          </button>
          <div className={styles["sample-wave"]}>
            {Array.from({ length: 9 }).map((_, i) => (
              <i key={`wave-${i}`}></i>
            ))}
          </div>
          <span>0:08</span>
        </div>
      </div>
    </div>
  );
}
