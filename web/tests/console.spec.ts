import { test, expect } from '@playwright/test';

test('Console logs and page state', async ({ page }) => {
  // Listen to console messages
  const messages: string[] = [];
  page.on('console', msg => {
    messages.push(`${msg.type()}: ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log('Page error:', error);
  });

  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('=== Console Messages ===');
  messages.forEach(msg => console.log(msg));

  // Check URL
  console.log('Current URL:', page.url());

  // Get HTML content
  const bodyHtml = await page.locator('body').innerHTML();
  console.log('Body HTML length:', bodyHtml.length);

  // Screenshot
  await page.screenshot({ path: 'test-results/console-state.png', fullPage: true });
});
