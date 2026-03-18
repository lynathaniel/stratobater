import { test, expect } from '@playwright/test';

test.describe('Fretboard bug - Roots/Triads highlighting', () => {
  test('Roots button highlights selected chord root, not tonic root', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /fretboard/i }).click();
    await page.waitForTimeout(2000);

    console.log('\n=== Testing Roots button with ii chord ===');

    // Ensure Roots button is ON (just check it exists)
    const rootsButton = page.getByRole('button', { name: /Roots/i });
    await expect(rootsButton).toBeVisible();

    // Click degree ii (use aria-label which is more specific)
    await page.getByRole('button', { name: 'Chord degree 2: ii-' }).click();
    await page.waitForTimeout(500);

    console.log('Click: ii');

    // The ii chord should highlight D notes (degree 2) in red
    // D is degree 2 in C Major
    // Find note circles - note names are displayed as text content with labelMode default
    const allNotes = page.locator('div.rounded-full');
    const cNotes = allNotes.filter({ hasText: 'C' });
    const dNotes = allNotes.filter({ hasText: 'D' });

    console.log('C note count:', await cNotes.count());
    console.log('D note count:', await dNotes.count());

    const dBgColor = await dNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const cBgColor = await cNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);

    console.log('D background color:', dBgColor);
    console.log('C background color:', cBgColor);

    // D should be red
    expect(dBgColor).toBe('oklch(0.637 0.237 25.331)'); // red-500 in OKLCH
    // C should NOT be red (it's tonic root, not ii root)
    expect(cBgColor).not.toBe('oklch(0.637 0.237 25.331)'); // not red-500

    console.log('✓ Roots button correctly highlights selected chord root, not tonic root');
  });

  test('Triads button highlights selected chord triad, not tonic triad', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /fretboard/i }).click();
    await page.waitForTimeout(2000);

    console.log('\n=== Testing Triads button with V chord ===');

    // Turn off Roots button (it's on by default and takes precedence)
    const rootsButton = page.getByRole('button', { name: /Roots/i });
    await rootsButton.click();
    await page.waitForTimeout(500);

    // Enable Triads button
    const triadsButton = page.getByRole('button', { name: /triads/i });
    await triadsButton.click();
    await page.waitForTimeout(500);

    console.log('Click: Triads');

    // Click degree V
    await page.getByRole('button', { name: 'Chord degree 5: V' }).click();
    await page.waitForTimeout(500);

    console.log('Click: V');

    // The V chord triad is G-B-D (degrees 5, 7, 2 => 2, 5, 7 = G, B, D)
    const allNotes = page.locator('div.rounded-full');
    const gNotes = allNotes.filter({ hasText: 'G' });
    const bNotes = allNotes.filter({ hasText: 'B' });
    const dNotes = allNotes.filter({ hasText: 'D' });
    const cNotes = allNotes.filter({ hasText: 'C' });
    const eNotes = allNotes.filter({ hasText: 'E' });

    const gBg = await gNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const bBg = await bNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const dBg = await dNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const cBg = await cNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const eBg = await eNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);

    console.log('G background color:', gBg);
    console.log('B background color:', bBg);
    console.log('D background color:', dBg);
    console.log('C background color:', cBg);
    console.log('E background color:', eBg);

    // All three should be blue (Triad highlighting)
    expect(gBg).toBe('oklch(0.623 0.214 259.815)'); // blue-500 in OKLCH
    expect(bBg).toBe('oklch(0.623 0.214 259.815)'); // blue-500
    expect(dBg).toBe('oklch(0.623 0.214 259.815)'); // blue-500

    // C and E should NOT be blue (they're not in the V chord triad)
    expect(cBg).not.toBe('oklch(0.623 0.214 259.815)'); // not blue-500
    expect(eBg).not.toBe('oklch(0.623 0.214 259.815)'); // not blue-500

    console.log('✓ Triads button correctly highlights selected chord triad, not tonic triad');
  });
});
