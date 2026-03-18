import { test, expect } from '@playwright/test';

test('Direct navigation test', async ({ page, baseURL }) => {
  const fullUrl = `${baseURL}/fretboard-visualizer`;
  console.log('Navigating to:', fullUrl);

  await page.goto(fullUrl, { waitUntil: 'load' });
  console.log('Current URL after nav:', page.url());

  // Wait a bit for React to hydrate
  await page.waitForTimeout(2000);

  // Check body content
  const bodyText = await page.locator('body').textContent();
  console.log('Body text length:', bodyText?.length);
  console.log('Contains "Roots":', bodyText?.includes('Roots'));
  console.log('Contains "Fretboard":', bodyText?.includes('Fretboard') || bodyText?.includes('fretboard'));

  // Check for buttons
  const buttons = await page.locator('button').all();
  console.log('Buttons:', buttons.length);

  for (let i = 0; i < Math.min(5, buttons.length); i++) {
    const text = await buttons[i].textContent();
    console.log(`Button ${i}:`, text);
  }

  // Check all text on page
  const allTextContent = await page.locator('*').allTextContents();
  console.log('Number of text nodes:', allTextContent.length);
  console.log('First 10 text nodes:', allTextContent.slice(0, 10));

  // Screenshot
  await page.screenshot({ path: 'test-results/direct-nav.png', fullPage: true });
});
