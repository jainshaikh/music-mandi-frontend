import { describe, expect, it } from "vitest";
import {
  AUDIENCE_FILTERS,
  BASE_AUDIENCE_MILLIONS,
  DEFAULT_SELECTION,
  estimateAudience,
  formatAudience,
} from "@/components/public/tele-ads/audienceEstimate";

const allSelections = () =>
  Array.from({ length: 2 ** AUDIENCE_FILTERS.length }, (_, mask) =>
    AUDIENCE_FILTERS.map((_, i) => Boolean(mask & (1 << i))),
  );

const withChip = (selection: boolean[], i: number, on: boolean) =>
  selection.map((v, j) => (j === i ? on : v));

const indexOf = (label: string) =>
  AUDIENCE_FILTERS.findIndex((f) => f.label === label);

describe("estimateAudience (QA BUG-09)", () => {
  it("locks Pakistan only", () => {
    expect(
      AUDIENCE_FILTERS.filter((f) => f.locked).map((f) => f.label),
    ).toEqual(["Pakistan"]);
  });

  it("lowers the estimate when 18 to 34, Smartphone or High data is switched on", () => {
    for (const selection of allSelections()) {
      for (const label of ["18 to 34", "Smartphone", "High data"]) {
        const i = indexOf(label);
        expect(estimateAudience(withChip(selection, i, true))).toBeLessThan(
          estimateAudience(withChip(selection, i, false)),
        );
      }
    }
  });

  it("never grows when any filter is switched on", () => {
    for (const selection of allSelections()) {
      AUDIENCE_FILTERS.forEach((_, i) => {
        expect(
          estimateAudience(withChip(selection, i, true)),
        ).toBeLessThanOrEqual(estimateAudience(withChip(selection, i, false)));
      });
    }
  });

  it("keeps the same audience whether All genders is on or off", () => {
    const i = indexOf("All genders");
    for (const selection of allSelections()) {
      expect(estimateAudience(withChip(selection, i, false))).toBe(
        estimateAudience(withChip(selection, i, true)),
      );
    }
  });

  it("gives the same value for the same selection", () => {
    const selection = [true, true, true, false, true];
    expect(estimateAudience(selection)).toBe(estimateAudience([...selection]));
  });

  it("shows the full 180M for Pakistan + All genders (the default)", () => {
    expect(BASE_AUDIENCE_MILLIONS).toBe(180);
    expect(formatAudience(estimateAudience(DEFAULT_SELECTION))).toBe("180.0M");
  });
});
