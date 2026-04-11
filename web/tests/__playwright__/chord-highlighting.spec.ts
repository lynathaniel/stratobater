import { test, expect, Locator, Page } from '@playwright/test';

test.describe('Chord Highlighting - Selected Chord vs Tonic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fretboard-visualizer');
    // Wait for fretboard to load
    await page.waitForTimeout(1000);
  });

  test('Initial state - degree I is selected, Roots button on', async ({ page }) => {
    // By default, degree I (tonic) is selected, and Roots is on
    // So C notes (tonic root) should be red
    // Find round elements with C text
    const cNotes = page.locator('div').filter({ hasText: /^C$/ });
    const firstC = cNotes.first();
    await expect(firstC).toBeVisible();

    const bgColor = await firstC.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    // C should be red (root of tonic when degree I selected)
    expect(bgColor).toBe('rgb(239, 68, 68)'); // red-500
  });

  test('Degree ii selected - Roots should highlight D, not C', async ({ page }) => {
    // Ensure Roots button is enabled
    const rootsButton = page.getByRole('button', { name: /roots/i });
    const rootsBg = await rootsButton.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    console.log('Roots button bg:', rootsBg);

    // Select degree ii
    await page.locator('button', { hasText: /^ii$/ }).click();
    await page.waitForTimeout(500);

    // ii chord root is D (degree 2 of C Major)
    // Find round elements with D text
    const dNotes = page.locator('div').filter({ hasText: /^D$/ });
    const firstD = dNotes.first();

    const dBgColor = await firstD.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    console.log('D note bg:', dBgColor);

    // D should be red (root of ii chord)
    expect(dBgColor).toBe('rgb(239, 68, 68)'); // red-500

    // C should NOT be red (C is tonic root, not ii root)
    const cNotes = page.locator('div').filter({ hasText: /^C$/ });
    const firstC = cNotes.first();

    const cBgColor = await firstC.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    console.log('C note bg:', cBgColor);

    // C should be neutral, not red
    expect(cBgColor).toBe('rgb(229, 231, 235)'); // neutral-200, NOT red-500
  });

  test('Degree V selected - Triads should highlight G-B-D, not C-E-G', async ({ page }) => {
    // Enable Triads button
    const triadsButton = page.getByRole('button', { name: /triads/i });
    await triadsButton.click();
    await page.waitForTimeout(500);

    // Select degree V
    await page.locator('button', { hasText: /^V$/ }).click();
    await page.waitForTimeout(500);

    // V chord triad is G-B-D (degrees 5, 7, 2 wrapped to 2, 5, 7 = G, B, D)
    const gNotes = page.locator('div').filter({ hasText: /^G$/ });
    const bNotes = page.locator('div').filter({ hasText: /^B$/ });
    const dNotes = page.locator('div').filter({ hasText: /^D$/ });

    // Get round elements for C and E as well
    const cNotes = page.locator('div').filter({ hasText: /^C$/ });
    const eNotes = page.locator('div').filter({ hasText: /^E$/ });

    const gBg = await gNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const bBg = await bNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const dBg = await dNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const cBg = await cNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);
    const eBg = await eNotes.first().evaluate(el => getComputedStyle(el).backgroundColor);

    console.log('G note bg:', gBg);
    console.log('B note bg:', bBg);
    console.log('D note bg:', dBg);
    console.log('C note bg:', cBg);
    console.log('E note bg:', eBg);

    // G (role 1) should be blue with Triads
    expect(gBg).toBe('rgb(59, 130, 246)'); // blue-500
    expect(bBg).toBe('rgb(59, 130, 246)'); // blue-500 (role 3)
    expect(dBg).toBe('rgb(59, 130, 246)'); // blue-500 (role 5)

    // Tonic triad C-E-G should NOT be blue (C and E)
    // Note: G IS in V chord, but C and E should be neutral
    expect(cBg).toBe('rgb(229, 231, 235)'); // neutral-200, NOT blue
    expect(eBg).toBe('rgb(229, 231, 235)'); // neutral-200, NOT blue
  });

  test('All degrees deselected (degree 1 selected) - tonic should be highlighted', async ({ page }) => {
    // Degree I is default, which IS the tonic
    // Let's verify tonic highlighting works when no other chord is selected

    // Ensure Roots button is enabled
    const cNotes = page.locator('div').filter({ hasText: /^C$/ });
    const firstC = cNotes.first();

    const cBg = await firstC.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    console.log('C note bg (default degree I):', cBg);

    // C should be red (degree I root = tonic root)
    expect(cBg).toBe('rgb(239, 68, 68)'); // red-500
  });
});
