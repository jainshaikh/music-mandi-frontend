// Cheap bot filter for the interim SendGrid-backed form routes — see
// docs/DECISIONS.md DEC-037. Not a replacement for a real CAPTCHA: it stops
// form-filler bots that put a value in every input, and scripts that POST
// straight to the API without ever loading our page.

// A visually hidden input people never see or fill. Bots that fill every
// field fill this one too.
export const HONEYPOT_FIELD = "website";

// Milliseconds between the form mounting and submit, measured entirely on the
// client so server/client clock skew can't cause false positives. A missing
// value means the request didn't come from our page.
export const ELAPSED_FIELD = "elapsedMs";

const MIN_ELAPSED_MS = 3000;

// Returns why a submission looks automated, or null if it looks human.
export function detectBot(honeypot: unknown, elapsedMs: unknown) {
  if (String(honeypot ?? "").trim() !== "") return "honeypot filled";
  const elapsed = Number(elapsedMs);
  if (!Number.isFinite(elapsed)) return "missing elapsed time";
  if (elapsed < MIN_ELAPSED_MS) return "submitted too fast";
  return null;
}
