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

  it("changes the estimate when any chip except Pakistan is toggled", () => {
    for (const selection of allSelections()) {
      AUDIENCE_FILTERS.forEach((filter, i) => {
        if (filter.locked) return;
        expect(estimateAudience(withChip(selection, i, true))).not.toBe(
          estimateAudience(withChip(selection, i, false)),
        );
      });
    }
  });

  it("never grows when a narrowing filter is switched on", () => {
    for (const selection of allSelections()) {
      AUDIENCE_FILTERS.forEach((filter, i) => {
        if (filter.offFactor !== undefined) return;
        expect(
          estimateAudience(withChip(selection, i, true)),
        ).toBeLessThanOrEqual(estimateAudience(withChip(selection, i, false)));
      });
    }
  });

  it("narrows to one gender when All genders is switched off", () => {
    const i = indexOf("All genders");
    for (const selection of allSelections()) {
      expect(estimateAudience(withChip(selection, i, false))).toBeLessThan(
        estimateAudience(withChip(selection, i, true)),
      );
    }
  });

  it("gives the same value for the same selection", () => {
    const selection = [true, true, true, false, true];
    expect(estimateAudience(selection)).toBe(estimateAudience([...selection]));
  });

  it("starts at the base audience with the default selection", () => {
    expect(formatAudience(estimateAudience(DEFAULT_SELECTION))).toBe(
      formatAudience(BASE_AUDIENCE_MILLIONS),
    );
  });
});
