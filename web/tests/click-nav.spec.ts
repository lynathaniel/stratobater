import { test, expect } from '@playwright/test';

test('Click navigation to fretboard', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);

  console.log('Initial URL:', page.url());
  console.log('Initial title:', await page.title());

  // Find and click the Fretboard Visualizer link
  const fretboardLink = page.getByRole('link', { name: /fretboard/i });
  await fretboardLink.click();
  await page.waitForTimeout(2000);

  console.log('After click URL:', page.url());
  console.log('After click title:', await page.title());

  // Check if we're on the right page
  const pageUrl = page.url();
  console.log('Current URL:', pageUrl);

  const pageTitle = await page.title();
  const hasFretword = pageTitle.toLowerCase().includes('fretboard');
  console.log('Has "fretboard" in title:', hasFretword);

  // Check for Buttons
  const buttons = await page.locator('button').allTextContents();
  console.log('Button count:', buttons.length);
  console.log('Button text contents:', buttons.join(', '));
});
