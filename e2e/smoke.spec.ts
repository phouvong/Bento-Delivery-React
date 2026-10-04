import { expect, test } from "@playwright/test";

/**
 * Baseline smoke checks. Keep these free of QA-environment data (zones, stores,
 * accounts) so they pass against any deployment — suite-specific cases belong in
 * their own spec files.
 */
test.describe("smoke", () => {
  test("landing page renders", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status(), "landing page should not error").toBeLessThan(400);
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("unknown route shows the 404 page, not a crash", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");

    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("text=/500|Internal Server Error/i")).toHaveCount(0);
  });

  test("no uncaught page errors on the landing page", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    expect(pageErrors, `uncaught errors: ${pageErrors.join(" | ")}`).toEqual([]);
  });
});
