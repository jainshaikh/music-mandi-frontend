import { expect, test } from "@playwright/test";

// Regression coverage for the QA bug report fixes. Every API call is mocked,
// so no real emails are sent.
test.describe("Submit Music form", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/integrations/spotify-search**", (route) =>
      route.fulfill({ json: { artists: [] } }),
    );
  });

  test("BUG-11: a failed submission keeps everything the artist typed", async ({
    page,
  }) => {
    await page.route("**/api/integrations/artist-submit", (route) =>
      route.fulfill({
        status: 502,
        json: { error: "Could not submit right now. Please try again." },
      }),
    );
    await page.goto("/artists/submit");

    await page.fill('[name="fullName"]', "Ayesha Khan");
    await page.fill('[name="artistName"]', "Test Artist");
    await page.fill('[name="email"]', "ayesha@example.com");
    await page.fill('[name="phone"]', "+92 300 1234567");
    await page.fill('[name="city"]', "Lahore");
    await page.click('button[aria-haspopup="listbox"]');
    await page.locator('[role="listbox"] label', { hasText: "Rock" }).click();
    await page.fill('[name="musicLink"]', "https://open.spotify.com/track/x");
    await page.fill('[name="bio"]', "Rock from Lahore.");
    await page.click('#artistForm button[type="submit"]');

    await expect(page.locator('#artistForm [role="alert"]')).toHaveText(
      "Could not submit right now. Please try again.",
    );
    await expect(page.locator('[name="fullName"]')).toHaveValue("Ayesha Khan");
    await expect(page.locator('[name="bio"]')).toHaveValue("Rock from Lahore.");
  });

  test("BUG-01: genre options sit next to their checkbox without overflow", async ({
    page,
  }) => {
    await page.goto("/artists/submit");
    await page.click('button[aria-haspopup="listbox"]');
    const layout = await page.locator('[role="listbox"]').evaluate((menu) => {
      const checkbox = menu.querySelector('input[type="checkbox"]')!;
      return {
        checkboxWidth: checkbox.getBoundingClientRect().width,
        overflows: menu.scrollWidth > menu.clientWidth,
      };
    });
    expect(layout.checkboxWidth).toBeLessThan(30);
    expect(layout.overflows).toBe(false);
    await expect(
      page.locator('[role="listbox"] label', { hasText: "Classical" }),
    ).toBeVisible();
  });

  test("BUG-02: the Spotify link is only filled by a deliberate pick", async ({
    page,
  }) => {
    await page.route("**/api/integrations/spotify-search**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await route.fulfill({
        json: {
          artists: [
            {
              id: "1",
              name: "Young Stunners",
              genres: [],
              image: null,
              externalUrl: "https://open.spotify.com/artist/AAA",
            },
          ],
        },
      });
    });
    await page.goto("/artists/submit");
    const results = page.locator('[class*="artist-search-results"]');
    const spotify = page.locator('[name="spotify"]');

    // Moving on before the search answers must not pop the list open over
    // the Phone/Genre fields.
    await page.fill('[name="artistName"]', "Young Stunners");
    await page.click('[name="email"]');
    await page.waitForTimeout(1200);
    await expect(results).toHaveCount(0);
    await page.click('[name="phone"]');
    await expect(spotify).toHaveValue("");

    // A real pick fills it; editing the name afterwards clears it again.
    await page.fill('[name="artistName"]', "Young Stun");
    await results.locator("button", { hasText: "Young Stunners" }).click();
    await expect(spotify).toHaveValue("https://open.spotify.com/artist/AAA");
    await page.locator('[name="artistName"]').press("End");
    await page.keyboard.type("X");
    await expect(spotify).toHaveValue("");
  });

  test("BUG-11: files over the upload limit are stopped before sending", async ({
    page,
  }) => {
    let requests = 0;
    await page.route("**/api/integrations/artist-submit", (route) => {
      requests++;
      return route.fulfill({ json: { ok: true } });
    });
    await page.goto("/artists/submit");

    await page.setInputFiles("#files", {
      name: "big.wav",
      mimeType: "audio/wav",
      buffer: Buffer.alloc(5 * 1024 * 1024),
    });

    await expect(page.locator("#files ~ .error")).toBeVisible();
    expect(requests).toBe(0);
  });
});

test.describe("Create Campaign wizard", () => {
  test("BUG-08: step 4 can't be completed without an audio ad", async ({
    page,
  }) => {
    await page.goto("/tele-ads/create");
    await page.fill("#sellerName", "Eid Campaign");
    const continueButton = page
      .locator('#sellerCampaignForm button.btn.fill:has-text("Continue")')
      .first();
    for (let i = 0; i < 3; i++) await continueButton.click();

    await expect(page.locator("#sellerStrength")).toHaveText("Needs audio");
    await continueButton.click();
    await expect(
      page.getByText("Please upload your audio ad to continue."),
    ).toBeVisible();
    await expect(page.locator("#sellerAudioFile")).toBeAttached();

    await page.setInputFiles("#sellerAudioFile", {
      name: "ad.mp3",
      mimeType: "audio/mpeg",
      buffer: Buffer.alloc(100 * 1024),
    });
    await expect(page.locator("#sellerStrength")).not.toHaveText("Needs audio");
    await continueButton.click();
    await expect(page.locator("#sellerPolicy")).toBeVisible();
  });
});
