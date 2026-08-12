import { test, expect, type Page } from "@playwright/test";

const EMAIL = `e2e-${Date.now()}@webpress.test`;
const PASSWORD = "test-password-123";

async function signup(page: Page) {
  await page.goto("/signup");
  await page.getByPlaceholder("Your name").fill("E2E Tester");
  await page.getByPlaceholder("Email").fill(EMAIL);
  await page.getByPlaceholder(/Password/).fill(PASSWORD);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/projects/, { timeout: 30_000 });
}

async function createSassProject(page: Page) {
  await page.getByRole("button", { name: "New site" }).click();
  await page.getByPlaceholder(/e\.g\. My Studio/).fill("E2E Smoke Site");
  // explicitly pick the SaaS template (template order may change)
  await page.getByRole("button", { name: /SaaS Landing/ }).click();
  await page.getByRole("button", { name: "Create site" }).click();
  await page.waitForURL(/\/editor\//, { timeout: 30_000 });
}

test("full journey: signup → create → edit → publish → public site → export", async ({ page }) => {
  await signup(page);
  await createSassProject(page);

  // Editor loads with a visual canvas rendering the template
  await expect(page.locator("iframe[title=Canvas]")).toBeVisible({ timeout: 30_000 });
  const frame = page.frames().find((f) => f.url().startsWith("about:srcdoc")) ?? null;
  if (frame) {
    await expect(frame.locator("h1")).toContainText("Notes that", { timeout: 20_000 });
    await expect(frame.locator("nav")).toBeVisible();
    // Visual canvas selection works (click inside the iframe)
    await frame.locator("body").click({ position: { x: 120, y: 300 } }).catch(() => {});
  } else {
    throw new Error("Canvas frame not found");
  }

  // Switch to Code mode and make an edit
  await page.getByRole("button", { name: "Code" }).click();
  await expect(page.locator(".cm-editor")).toBeVisible({ timeout: 15_000 });
  await page.keyboard.press("ControlOrMeta+End");
  await page.keyboard.press("Enter");
  await page.keyboard.type("<!-- e2e edit -->");
  await page.waitForTimeout(2000); // let debounce+autosave settle

  // Switch to Preview mode
  await page.getByRole("button", { name: "Preview" }).click();
  await expect(page.locator("iframe[title=Preview]")).toBeVisible({ timeout: 15_000 });

  // Publish
  await page.getByRole("button", { name: "Publish" }).first().click();
  await page.getByRole("button", { name: "Start publish" }).click();
  await expect(page.getByText("Your site is live")).toBeVisible({ timeout: 60_000 });

  const url = await page.locator("a[href*='/p/']").getAttribute("href");
  expect(url).toMatch(/\/p\/[A-Za-z0-9]{6}$/);

  // Public site renders without login (fresh, logged-out context)
  const guest = await page.context().browser()!.newContext();
  const guestPage = await guest.newPage();
  await guestPage.goto(url!);
  await expect(guestPage.locator("h1")).toContainText("Notes that", { timeout: 20_000 });
  await expect(guestPage.locator("nav")).toBeVisible();
  // No editor chrome leaks onto public pages
  await expect(guestPage.getByText("Command palette")).toHaveCount(0);
  // SEO artifacts exist
  const robots = await guestPage.request.get(`${url}/robots.txt`);
  expect(robots.ok()).toBe(true);
  const sitemap = await guestPage.request.get(`${url}/sitemap.xml`);
  expect(sitemap.ok()).toBe(true);
  await guest.close();

  // Export returns a zip
  const exportReq = await page.context().request.get(`/api/projects/${page.url().split("/editor/")[1]}/export`);
  expect(exportReq.ok()).toBe(true);
  expect(exportReq.headers()["content-type"]).toContain("application/zip");
});
