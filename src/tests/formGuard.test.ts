import { describe, expect, it } from "vitest";
import { detectBot } from "@/lib/formGuard";

describe("detectBot", () => {
  it("passes a human-looking submission", () => {
    expect(detectBot("", 8000)).toBeNull();
    expect(detectBot(null, 8000)).toBeNull();
  });

  it("flags a filled honeypot", () => {
    expect(detectBot("https://spam.example", 8000)).toBe("honeypot filled");
  });

  it("flags a direct API post with no elapsed time", () => {
    expect(detectBot(undefined, undefined)).toBe("missing elapsed time");
    expect(detectBot("", "abc")).toBe("missing elapsed time");
  });

  it("flags a submission faster than a person could type", () => {
    expect(detectBot("", 400)).toBe("submitted too fast");
    expect(detectBot("", null)).toBe("submitted too fast");
  });
});
