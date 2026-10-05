// Illustrative figures for the /tele-ads targeting demo, in the same spirit as
// the "Illustrative estimates only" note on /tele-ads/create — swap in real
// numbers once the backend provides them.
export const BASE_AUDIENCE_MILLIONS = 180;

export type AudienceFilter = {
  label: string;
  // Share of the audience left when the filter is on. 1 means it doesn't
  // narrow anything — "All genders" is still all 180M people.
  factor: number;
  defaultOn?: boolean;
  // Always on: the platform only sells Pakistani telecom inventory, so the
  // market itself can't be deselected.
  locked?: boolean;
};

export const AUDIENCE_FILTERS: readonly AudienceFilter[] = [
  { label: "Pakistan", factor: 1, locked: true },
  { label: "18 to 34", factor: 0.55 },
  { label: "All genders", factor: 1, defaultOn: true },
  { label: "Smartphone", factor: 0.62 },
  { label: "High data", factor: 0.4 },
];

export const DEFAULT_SELECTION = AUDIENCE_FILTERS.map((f) =>
  Boolean(f.locked || f.defaultOn),
);

// Deterministic and monotonic: the same selection always gives the same
// number, and turning a filter on can only shrink it (QA BUG-09).
export function estimateAudience(selected: readonly boolean[]) {
  return AUDIENCE_FILTERS.reduce(
    (audience, filter, i) =>
      selected[i] ? audience * filter.factor : audience,
    BASE_AUDIENCE_MILLIONS,
  );
}

export function formatAudience(millions: number) {
  return `${millions.toFixed(1)}M`;
}
