import { expect, test } from "@playwright/test";

// Guards the slow-connection fixes in DEC-038. On the ~100KB/s links many
// visitors have, every byte that competes with the HTML/CSS/JS costs seconds.
test.describe("home page load budget", () => {
  test("public theme renders before JavaScript runs", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.route(/\.mp4$/, (route) => route.abort());
    await page.goto("/");

    const body = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return {
        background: style.backgroundColor,
        font: style.fontFamily,
        cursor: style.cursor,
      };
    });
    expect(body.background).toBe("rgb(8, 12, 23)");
    expect(body.font).toContain("Arial");
    // The native cursor may only be hidden once CustomCursor is running.
    expect(body.cursor).toBe("auto");
    await context.close();
  });

  test("video waits for window load; below-the-fold video stays idle", async ({
    page,
  }) => {
    let loaded = false;
    const videoRequests: string[] = [];
    const beforeLoad: string[] = [];
    page.on("load", () => {
      loaded = true;
    });
    page.on("request", (request) => {
      if (!/\.mp4(\?|$)/.test(request.url())) return;
      videoRequests.push(request.url());
      if (!loaded) beforeLoad.push(request.url());
    });

    await page.goto("/");
    await expect(page.locator("#heroSlides img").first()).toHaveAttribute(
      "fetchpriority",
      "high",
    );
    await page.waitForTimeout(3000);

    expect(beforeLoad).toEqual([]);
    expect(videoRequests.some((url) => url.includes("release-track"))).toBe(
      true,
    );
    expect(videoRequests.some((url) => url.includes("tele-ads-calling"))).toBe(
      false,
    );
  });
});
