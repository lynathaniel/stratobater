import { test, expect } from '@playwright/test';

test('Diagnose the highlighting bug', async ({ page }) => {
  await page.goto('/fretboard-visualizer');
  await page.waitForTimeout(1000);

  // Check initial button states
  const rootsButton = page.getByRole('button', { name: /roots/i });
  const rootsClass = await rootsButton.getAttribute('class');
  const rootsBg = await rootsButton.evaluate(el => getComputedStyle(el).backgroundColor);

  const triadsButton = page.getByRole('button', { name: /triads/i });
  const triadsClass = await triadsButton.getAttribute('class');
  const triadsBg = await triadsButton.evaluate(el => getComputedStyle(el).backgroundColor);

  const chordsButton = page.getByRole('button', { name: /chords/i });
  const chordsClass = await chordsButton.getAttribute('class');
  const chordsBg = await chordsButton.evaluate(el => getComputedStyle(el).backgroundColor);

  console.log('Initial state:');
  console.log('Roots:', { class: rootsClass, bg: rootsBg });
  console.log('Triads:', { class: triadsClass, bg: triadsBg });
  console.log('Chords:', { class: chordsClass, bg: chordsBg });

  // Also check what notes are highlighted
  const redNotes = await page.locator('div[style*="red"]').count();
  const blueNotes = await page.locator('div[style*="blue"]').count();
  const coloredNotes = await page.locator('div[style*="red"], div[style*="blue"], div[style*="yellow"]').count();

  console.log('Colored notes:', coloredNotes);
  console.log('Red notes:', redNotes);
  console.log('Blue notes:', blueNotes);

  // Count divs with specific background colors
  const redBgElements = await page.locator('div').filter({ hasText: 'red-500' }).count();
  const blueBgElements = await page.locator('div').filter({ hasText: 'blue-500' }).count();

  console.log('Elements with red-500:', redBgElements);
  console.log('Elements with blue-500:', blueBgElements);
});
