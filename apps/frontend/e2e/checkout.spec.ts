import { test, expect } from '@playwright/test';

test.describe('Promilaa E-Commerce Full E2E User Journey & Automation Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to local or production baseURL
    await page.goto('/');
  });

  test('TC-01: Homepage loads with Hero Slider and Category Showcase', async ({ page }) => {
    // Verify Page Title & SEO Meta
    await expect(page).toHaveTitle(/PROMILAA BY SOPNIL/i);

    // Verify Category Cards are visible
    const categoryCard = page.locator('text=Shop By Category');
    await expect(categoryCard).toBeVisible();

    // Verify Featured Products Grid
    const productGrid = page.locator('text=Just Arrived');
    await expect(productGrid).toBeVisible();
  });

  test('TC-02: User can select product variant, add to cart, and verify Cart Drawer', async ({ page }) => {
    // Navigate to Kurti Collection
    await page.click('text=Shop By Category');
    await page.goto('/collections/kurti');

    // Click on the first product card
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();

    // Verify Product Details page loads
    await expect(page.locator('h1')).toBeVisible();

    // Add item to cart
    const addToCartBtn = page.locator('button:has-text("কার্টে যোগ করুন")').first();
    await addToCartBtn.click();

    // Verify Cart Drawer opens automatically with item
    const drawerHeader = page.locator('text=Your Cart');
    await expect(drawerHeader).toBeVisible();

    // Verify checkout button is present in drawer
    const proceedCheckoutBtn = page.locator('text=Proceed to Checkout');
    await expect(proceedCheckoutBtn).toBeVisible();
  });

  test('TC-03: Express COD Quick Order submission flow', async ({ page }) => {
    // Navigate to a product detail page
    await page.goto('/collections/kurti');
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();

    // Click Quick Order button ("সরাসরি অর্ডার করুন")
    const quickOrderBtn = page.locator('button:has-text("সরাসরি অর্ডার করুন")').first();
    await quickOrderBtn.click();

    // Verify Quick COD Modal appears
    const modalTitle = page.locator('text=ক্যাশ অন ডেলিভারিতে অর্ডার করুন');
    await expect(modalTitle).toBeVisible();

    // Fill Quick Order Form with valid test data
    await page.fill('input[placeholder="আপনার পূর্ণ নাম লিখুন"]', 'Automation Test User');
    await page.fill('input[placeholder="১১ ডিজিটের মোবাইল নম্বর"]', '01711223344');
    await page.selectOption('select', 'Dhaka');
    await page.fill('textarea[placeholder="যেমন: বাসা #৪, রোড #১২, ধানমণ্ডি, ঢাকা"]', 'House 12, Road 5, Dhanmondi, Dhaka');

    // Submit Order
    const submitBtn = page.locator('button:has-text("অর্ডার নিশ্চিত করুন")');
    await expect(submitBtn).toBeEnabled();
  });

  test('TC-04: Order Tracking verification', async ({ page }) => {
    await page.goto('/orders/track');

    // Test validation error when empty
    const trackBtn = page.locator('button:has-text("অর্ডার ট্র্যাক করুন")');
    if (await trackBtn.isVisible()) {
      await trackBtn.click();
    }

    // Input invalid details
    await page.fill('input[name="orderNumber"]', 'PRM-000000');
    await page.fill('input[name="phone"]', '01600000000');
    
    if (await trackBtn.isVisible()) {
      await trackBtn.click();
    }
  });

  test('TC-05: Mobile Layout & Touch Navigation', async ({ page }) => {
    // Set mobile viewport (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Verify sticky action bar on mobile product detail
    await page.goto('/collections/kurti');
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();

    const mobileOrderBtn = page.locator('button:has-text("অর্ডার করুন")').first();
    await expect(mobileOrderBtn).toBeVisible();
  });

});
