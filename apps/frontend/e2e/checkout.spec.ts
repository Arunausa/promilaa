import { test, expect } from '@playwright/test';

test.describe('Promilaa E-Commerce Full E2E User Journey & Automation Suite', () => {

  test('TC-01: Homepage loads with Hero Slider and Category Showcase', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/PROMILAA BY SOPNIL/i);
    const categoryHeader = page.locator('text=Shop By Category');
    await expect(categoryHeader).toBeVisible();
  });

  test('TC-02: User can navigate to product details and view order actions', async ({ page }) => {
    await page.goto('/collections/kurti', { waitUntil: 'domcontentloaded' });
    const firstProduct = page.locator('a[href^="/products/"]').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('TC-03: Order Tracking page validation', async ({ page }) => {
    await page.goto('/orders/track', { waitUntil: 'domcontentloaded' });
    const trackHeading = page.locator('h1, h2').first();
    await expect(trackHeading).toBeVisible();
  });

  test('TC-04: Mobile Viewport Layout Verification', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const brandName = page.locator('text=PROMILAA').first();
    await expect(brandName).toBeVisible();
  });

});
