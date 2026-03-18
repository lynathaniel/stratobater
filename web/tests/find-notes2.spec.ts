import { test } from '@playwright/test';

test('Find notes on fretboard', async ({ page }) => {
  await page.goto('/fretboard-visualizer');
  await page.waitForTimeout(2000);

  // Count elements
  const allDivs = await page.locator('div').count();
  const allButtons = await page.locator('button').count();
  const allCircles = await page.locator('div[class*="rounded"]').count();

  console.log('Total divs:', allDivs);
  console.log('Total buttons:', allButtons);
  console.log('Total circles:', allCircles);

  // Get button contents
  const buttonTexts = await page.locator('button').allTextContents();
  console.log('Button texts:', buttonTexts.join(', '));

  // Check for red/blue/yellow classes
  const redElements = await page.locator('div[class*="red"]').count();
  const blueElements = await page.locator('div[class*="blue"]').count();
  const yellowElements = await page.locator('div[class*="yellow"]').count();

  console.log('Red elements:', redElements);
  console.log('Blue elements:', blueElements);
  console.log('Yellow elements:', yellowElements);

  // Look for elements with musical note letters
  const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  for (const note of noteLetters) {
    const count = page.locator(`text="${note}"`).count();
    console.log(`Text "${note}":`, count);
  }

  // List first 10 divs with any text
  console.log('\nFirst 10 divs with text:');
  let divsWithText = 0;
  for (const div of await page.locator('div').all()) {
    const text = await div.textContent();
    if (text && text.trim() !== '' && text.trim().length < 10) {
      console.log(`Div with text="${text.trim()}"`);
      divsWithText++;
      if (divsWithText >= 10) break;
    }
  }
});
