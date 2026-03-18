import { test, expect } from '@playwright/test';

test('Debug - check what buttons exist', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(2000);

  // List all buttons
  const buttons = await page.locator('button').allTextContents();
  console.log('All buttons:', buttons);

  // Screenshot
  await page.screenshot({ path: 'test-results/debug.png' });

  // Get all visible text
  const bodyText = await page.locator('body').textContent();
  console.log('Page contains "ii":', bodyText?.includes('ii'));
  console.log('Page contains "Roots":', bodyText?.includes('Roots'));
  console.log('Page contains "Triads":', bodyText?.includes('Triads'));

  // Try to find C note
  const allText = await page.locator('*').allTextContents();
  const cNotes = allText.filter(t => t === 'C');
  console.log('Found C notes:', cNotes.length);
});
