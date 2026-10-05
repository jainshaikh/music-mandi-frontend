import { expect, test } from "@playwright/test";

// Site-wide behaviour from the QA bug report.
test("BUG-05: wheel scrolling keeps working after client-side navigation", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.locator('a[href="/"]').first().click();
  await page.waitForURL("/");
  await page.locator("#tamasha-launch").waitFor({ state: "attached" });
  // Lenis re-measures the page on a 250ms debounce after it resizes. Before
  // the fix it never re-measured at all, however long you waited.
  await page.waitForTimeout(600);

  // A jump that bypasses smooth scrolling (scrollbar drag, Back/Forward
  // restore) used to leave Lenis clamped to the short page's height, so the
  // next wheel-down pulled the page back up.
  await page.evaluate(() =>
    window.scrollTo({ top: 4000, behavior: "instant" }),
  );
  await page.mouse.move(400, 300);
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(250);
  }
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(4000);
});

test("BUG-09: targeting cards don't overlap and filters only narrow the estimate", async ({
  page,
}) => {
  await page.goto("/tele-ads");
  const lab = page.locator('[class*="audience-lab"]');
  await lab.scrollIntoViewIfNeeded();

  const overlaps = await lab.evaluate((el) => {
    const rects = [...el.querySelectorAll('[class*="audience-card"]')].map(
      (card) => card.getBoundingClientRect(),
    );
    let count = 0;
    rects.forEach((a, i) =>
      rects.slice(i + 1).forEach((b) => {
        if (
          a.left < b.right &&
          b.left < a.right &&
          a.top < b.bottom &&
          b.top < a.bottom
        )
          count++;
      }),
    );
    return count;
  });
  expect(overlaps).toBe(0);

  const estimate = page.locator("#audiencePulse");
  const value = async () => parseFloat((await estimate.textContent()) ?? "");
  const chips = page.locator('[class*="target-chipset"] button');
  await expect(chips.filter({ hasText: "Pakistan" })).toBeDisabled();
  let previous = await value();
  // "All genders" starts on, so clicking it narrows to a single gender.
  for (const label of ["18 to 34", "All genders", "Smartphone", "High data"]) {
    await chips.filter({ hasText: label }).click();
    const next = await value();
    expect(next).toBeLessThan(previous);
    previous = next;
  }
});
