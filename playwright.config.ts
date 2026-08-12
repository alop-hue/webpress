import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 180_000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
