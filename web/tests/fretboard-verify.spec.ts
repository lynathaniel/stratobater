import { test, expect } from '@playwright/test';

test('Verify fretboard rendering with user interaction', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000);

  // Click anywhere to trigger any animations/renders
  await page.mouse.click(100, 100);
  await page.waitForTimeout(1000);

  // Check for fretboard notes - they should be in specific classes
  const fretCells = await page.locator('.fret-cell').count();
  console.log('Fret cells found:', fretCells);

  // Try to find circular elements (notes)
  const circularElements = await page.locator('div[class*="rounded"]').count();
  console.log('Rounded divs found:', circularElements);

  // Check for note content
  const allText = await page.locator('body').allTextContents();
  const allTextString = allText.join(' ');
  console.log('All text length:', allTextString.length);

  // Look for musical notes
  const hasNotes = /C\s|D\s|E\s|F\s|G\s|A\s|B\s/.test(allTextString);
  console.log('Has musical notes:', hasNotes);

  // List first 20 elements
  const allDivs = await page.locator('div').all();
  console.log('Total divs:', allDivs.length);

  for (let i = 0; i < Math.min(20, allDivs.length); i++) {
    const className = await allDivs[i].getAttribute('class');
    const text = await allDivs[i].textContent();
    console.log(`Div ${i}: class="${className}", text="${text || ''}"`);
  }

  // Screenshot
  await page.screenshot({ path: 'test-results/after-click.png', fullPage: true });
});
