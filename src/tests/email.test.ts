import { describe, expect, it } from "vitest";
import { describeSendGridError } from "@/lib/email";

describe("describeSendGridError", () => {
  it("surfaces SendGrid's status and reason instead of [Array]", () => {
    const error = Object.assign(new Error("Forbidden"), {
      code: 403,
      response: {
        body: {
          errors: [
            {
              message:
                "The from address does not match a verified Sender Identity.",
            },
          ],
        },
      },
    });
    const text = describeSendGridError(error);
    expect(text).toContain("status 403");
    expect(text).toContain("verified Sender Identity");
  });

  it("returns non-SendGrid errors unchanged", () => {
    const error = new TypeError("fetch failed");
    expect(describeSendGridError(error)).toBe(error);
  });
});
