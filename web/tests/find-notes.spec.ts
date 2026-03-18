import { test } from '@playwright/test';

test('Find notes on fretboard', async ({ page }) => {
  await page.goto('/fretboard-visualizer');
  await page.waitForTimeout(2000);

  // List all text content
  const allTextContent = await page.locator('*').allTextContents();
  const allTextString = allTextContent.join(' ');
  console.log('All text length:', allTextString.length);
  console.log('Has "C":', allTextString.includes('C '));
  console.log('Has "D":', allTextString.includes('D '));
  console.log('Has "E":', allTextString.includes('E '));
  console.log('Has "G":', allTextString.includes('G '));
  console.log('Has "A":', allTextString.includes('A '));
  console.log('Has "B":', allTextString.includes('B '));
  console.log('Has "F":', allTextString.includes('F '));

  // Look for individual note elements that might be styled
  const allDivs = await page.locator('div').all();
  console.log('Total divs:', allDivs.length);

  // List divs with common note-related classes or content
  console.log('\nSearching for note-like elements...');
  const noteSelectors = [
    '.w-8', '.h-8', '.rounded-full',
    'bg-red-', 'bg-blue-', 'bg-',
    'text-red-500', 'text-blue-500'
  ];

  for (const selector of noteSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`Found ${count} elements with "${selector}"`);
    }
  }

  // Look for any divs with single-letter content that could be notes
  const noteRegex = /^[A-G]$/;
  const allDivTexts = await page.locator('div').allTextContents();
  let singleLetterDivs = 0;
  for (let text of allDivs) {
    if (noteRegex.test(text.trim())) {
      singleLetterDivs++;
      if (singleLetterDivs <= 5) {
        console.log(`Note text found: "${text.trim()}"`);
      }
    }
  }
  console.log(`Found ${singleLetterDivs} divs with single letter note text`);
});
