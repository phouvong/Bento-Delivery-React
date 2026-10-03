import { defineConfig, devices } from "@playwright/test";

/**
 * Point the run at a deployed environment with
 *   PLAYWRIGHT_BASE_URL=https://6ammart-react.6amtech.com yarn test:e2e
 * When the base URL is local, Playwright boots `yarn dev` itself and reuses an
 * already-running dev server if one is up.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(baseURL);

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    [process.env.CI ? "github" : "list"],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // The app is locale/direction aware; pin these so runs are reproducible.
    locale: "en-US",
    timezoneId: "Asia/Dhaka",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Run `npx playwright install firefox webkit` before enabling these.
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
    // { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: isLocal
    ? {
        command: "yarn dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      }
    : undefined,
});
