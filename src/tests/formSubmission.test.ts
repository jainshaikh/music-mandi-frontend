import { describe, expect, it } from "vitest";
import {
  MAX_UPLOAD_LABEL,
  SUBMIT_FALLBACK_ERROR,
  submissionErrorMessage,
  totalFileBytes,
} from "@/lib/formSubmission";

describe("submissionErrorMessage", () => {
  it("explains the size limit for a platform 413 with a non-JSON body", async () => {
    const res = new Response("Request Entity Too Large", { status: 413 });
    expect(await submissionErrorMessage(res)).toContain(MAX_UPLOAD_LABEL);
  });

  it("passes through the route's own error message", async () => {
    const res = Response.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
    expect(await submissionErrorMessage(res)).toBe(
      "Please fill in all required fields.",
    );
  });

  it("falls back to a friendly message when the body isn't usable", async () => {
    const res = new Response("<html>Bad Gateway</html>", { status: 502 });
    expect(await submissionErrorMessage(res)).toBe(SUBMIT_FALLBACK_ERROR);
  });
});

describe("totalFileBytes", () => {
  it("sums file sizes", () => {
    const files = [new File(["abc"], "a.mp3"), new File(["de"], "b.mp3")];
    expect(totalFileBytes(files)).toBe(5);
  });
});
