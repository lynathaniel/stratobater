import { test, expect } from '@playwright/test';

test('Check fretboard page structure', async ({ page }) => {
  await page.goto('/fretboard-visualizer');
  await page.waitForTimeout(2000);

  // Check for any buttons
  const buttons = await page.locator('button').all();
  console.log('Buttons found:', buttons.length);

  // Get all text content
  const bodyText = await page.locator('body').textContent();
  console.log('Page contains "Roots":', bodyText?.includes('Roots'));
  console.log('Page contains "Triads":', bodyText?.includes('Triads'));
  console.log('Page contains "Chords":', bodyText?.includes('Chords'));

  // List button content
  for (let i = 0; i < Math.min(10, buttons.length); i++) {
    const text = await buttons[i].textContent();
    const className = await buttons[i].getAttribute('class');
    console.log(`Button ${i}: text="${text}", class="${className}"`);
  }

  // Check for fretboard cells
  const fretCells = await page.locator('.fret-cell').count();
  console.log('Fret cells:', fretCells);

  // Check for any divs with musical notes
  const allDivs = await page.locator('div').all();
  console.log('Total divs:', allDivs.length);

  // Take screenshot
  await page.screenshot({ path: 'test-results/fretboard-page.png', fullPage: true });
});
