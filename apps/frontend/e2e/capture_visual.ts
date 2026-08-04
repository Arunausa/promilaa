import { chromium } from '@playwright/test';
import path from 'path';

async function runVisualTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const artifactDir = '/Users/hasanmohammad/.gemini/antigravity-ide/brain/af3ced52-c692-47c1-8a5c-c0c160ccb699';
  const headerScreenshot = path.join(artifactDir, 'realtime_header_verification.png');
  const heroScreenshot = path.join(artifactDir, 'realtime_hero_verification.png');

  // Capture Header
  const header = page.locator('header');
  await header.screenshot({ path: headerScreenshot });
  console.log(`Captured header screenshot: ${headerScreenshot}`);

  // Capture Hero Section
  const hero = page.locator('section').first();
  await hero.screenshot({ path: heroScreenshot });
  console.log(`Captured hero screenshot: ${heroScreenshot}`);

  await browser.close();
}

runVisualTest().catch(console.error);
