"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import {
  AUDIENCE_FILTERS,
  DEFAULT_SELECTION,
  estimateAudience,
  formatAudience,
} from "./audienceEstimate";

const CHIP_LABELS = AUDIENCE_FILTERS.map((f) => f.label);
const CHIP_LOCKED = AUDIENCE_FILTERS.map((f) => Boolean(f.locked));

type Ctx = {
  sampleVisible: boolean;
  showSample: () => void;
  chips: boolean[];
  chipLabels: string[];
  chipLocked: boolean[];
  toggleChip: (i: number) => void;
  estimateText: string;
};

const TeleAdsCtx = createContext<Ctx | null>(null);

export function TeleAdsProvider({ children }: { children: ReactNode }) {
  const [sampleVisible, setSampleVisible] = useState(false);
  const [chips, setChips] = useState<boolean[]>(DEFAULT_SELECTION);

  const toggleChip = (i: number) => {
    if (CHIP_LOCKED[i]) return;
    setChips((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const estimateText = useMemo(
    () => formatAudience(estimateAudience(chips)),
    [chips],
  );

  return (
    <TeleAdsCtx.Provider
      value={{
        sampleVisible,
        showSample: () => setSampleVisible(true),
        chips,
        chipLabels: CHIP_LABELS,
        chipLocked: CHIP_LOCKED,
        toggleChip,
        estimateText,
      }}
    >
      {children}
    </TeleAdsCtx.Provider>
  );
}

export function useTeleAds() {
  const ctx = useContext(TeleAdsCtx);
  if (!ctx) throw new Error("useTeleAds must be used inside TeleAdsProvider");
  return ctx;
}
