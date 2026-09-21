"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

const CHIP_LABELS = [
  "Pakistan",
  "18 to 34",
  "All genders",
  "Smartphone",
  "High data",
];
const BASE_ESTIMATE = 130;

type Ctx = {
  sampleVisible: boolean;
  showSample: () => void;
  chips: boolean[];
  chipLabels: string[];
  toggleChip: (i: number) => void;
  estimateText: string;
};

const TeleAdsCtx = createContext<Ctx | null>(null);

export function TeleAdsProvider({ children }: { children: ReactNode }) {
  const [sampleVisible, setSampleVisible] = useState(false);
  const [chips, setChips] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
  ]);
  const [interacted, setInteracted] = useState(false);

  const toggleChip = (i: number) => {
    setChips((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
    setInteracted(true);
  };

  const estimateText = useMemo(() => {
    if (!interacted) return `${BASE_ESTIMATE}M`;
    const active = chips.filter(Boolean).length;
    const stepPerFilter = (BASE_ESTIMATE - 3.6) / chips.length;
    const estimate = Math.max(3.6, BASE_ESTIMATE - active * stepPerFilter);
    return `${estimate.toFixed(1)}M`;
  }, [chips, interacted]);

  return (
    <TeleAdsCtx.Provider
      value={{
        sampleVisible,
        showSample: () => setSampleVisible(true),
        chips,
        chipLabels: CHIP_LABELS,
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
