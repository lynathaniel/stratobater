import { test, expect } from '@playwright/test';

test('Navigate to fretboard via link click', async ({ page }) => {
  // Start at landing page
  await page.goto('/');
  await page.waitForTimeout(1000);

  console.log('Initial URL:', page.url());

  // Click on the menu button
  const menuButton = page.getByRole('button', { name: 'Toggle menu' }).or(page.locator('button').first());
  await menuButton.click();
  await page.waitForTimeout(500);

  // Click on Fretboard Visualizer link (use first one in main area, not menu)
  const fretboardLink = page.locator('a[href="/fretboard-visualizer"]').first();
  await fretboardLink.click();
  await page.waitForTimeout(2000);

  console.log('URL after click:', page.url());

  // Check for fretboard elements
  const buttons = await page.locator('button').all();
  console.log('Buttons found:', buttons.length);

  // Check for C notes
  const bodyText = await page.locator('body').textContent();
  console.log('Contains "Roots":', bodyText?.includes('Roots'));
  console.log('Contains "C":', bodyText?.includes('C '));

  // Screenshot
  await page.screenshot({ path: 'test-results/fretboard-render.png', fullPage: true });
});
