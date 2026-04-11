import { test, expect } from '@playwright/test';

test('Wait for React hydration', async ({ page }) => {
  await page.goto('/fretboard-visualizer');

  // Wait for React to mount by waiting for root element
  await page.waitForSelector('#root', { timeout: 5000 });
  console.log('Root element found');

  // Wait a bit more for hydration
  await page.waitForTimeout(3000);

  // Check if the app has mounted properly
  const isReactMounted = await page.evaluate(() => {
    return window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== undefined ||
           document.querySelector('[data-reactroot]') !== null ||
           document.body.children.length > 10;
  });
  console.log('React mounted:', isReactMounted);

  // Check body children
  const bodyChildren = await page.evaluate(() => {
    return document.body.children.length;
  });
  console.log('Body children count:', bodyChildren);

  // List all body children
  const childInfo = await page.evaluate(() => {
    const children = Array.from(document.body.children);
    return children.map((child, i) => ({
      i,
      tag: child.tagName,
      class: child.className,
      text: child.textContent?.trim().substring(0, 50)
    }));
  });
  console.log('Body children:', JSON.stringify(childInfo, null, 2));

  // Check for wouter routing
  const location = await page.evaluate(() => {
    return window.location.pathname;
  });
  console.log('Current pathname:', location);

  // Screenshot
  await page.screenshot({ path: 'test-results/react-hydrate.png', fullPage: true });
});
