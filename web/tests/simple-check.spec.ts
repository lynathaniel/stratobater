import { test } from '@playwright/test';

test('Simple check - page structure', async ({ page }) => {
  await page.goto('/fretboard-visualizer');
  await page.waitForTimeout(2000);

  // Check if page title indicates correct page
  const title = await page.title();

  // Count number of buttons present
  const buttonCount = await page.locator('button').allTextContents().length;

  // Get first 50 unique texts from the page
  const uniqueTexts: string[] = [];
  const allTexts = await page.locator('*').allTextContents();
  for (const text of allTexts) {
    const trimmed = text.trim();
    if (trimmed.length > 0 && trimmed.length < 20 && !uniqueTexts.includes(trimmed)) {
      uniqueTexts.push(trimmed);
    }
    if (uniqueTexts.length >= 50) break;
  }

  console.log('Page title:', title);
  console.log('Button count:', buttonCount);
  console.log('Unique short texts:', uniqueTexts.slice(0, 50));
});
