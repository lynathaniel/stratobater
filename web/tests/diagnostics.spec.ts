import { test, expect } from '@playwright/test';

test('Diagnostics - find buttons with aria-label and text', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);

  // Try different selectors
  const buttonByRole = await page.getByRole('button').count();
  console.log('Buttons by role:', buttonByRole);

  // Try finding by text content
  const roots = await page.getByText('Roots').count();
  console.log('Roots buttons:', roots);

  const triads = await page.getByText('Triads').count();
  console.log('Triads buttons:', triads);

  const chords = await page.getByText('Chords').count();
  console.log('Chords buttons:', chords);

  // Check for Roman numerals
  const ii = await page.getByText('ii').count();
  console.log('ii buttons:', ii);

  const V = await page.getByText('V').count();
  console.log('V buttons:', V);

  // Get all elements on page
  const allElements = await page.locator('*').count();
  console.log('Total elements:', allElements);

  // Get all buttons directly
  const allButtons = await page.locator('button').all();
  console.log('All buttons found:', allButtons.length);
  for (let i = 0; i < Math.min(5, allButtons.length); i++) {
    const text = await allButtons[i].textContent();
    console.log(`Button ${i}:`, text || '(empty)');
  }

  // Look for C notes
  const cNotes = await page.getByText('C').all();
  console.log('C notes found:', cNotes.length);
  for (let i = 0; i < Math.min(3, cNotes.length); i++) {
    const text = await cNotes[i].textContent();
    console.log(`C note ${i}:`, text);
  }

  // Check body content
  const body = await page.locator('body').textContent();
  console.log('Body contains C:', body?.includes('C'));
  console.log('Body contains ii:', body?.includes('ii'));

  // Screenshot
  await page.screenshot({ path: 'test-results/diagnostics.png', fullPage: true });
});
