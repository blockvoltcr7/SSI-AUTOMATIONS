import { test, expect } from "@playwright/test";

test.describe("Learn Page", () => {
  test("should have a valid page title", async ({ page }) => {
    await page.goto("/learn");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Get the page title
    const title = await page.title();

    // Verify the title exists and is not empty
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
