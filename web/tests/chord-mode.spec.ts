import { test, expect } from '@playwright/test';

test.describe('Chord Mode Colors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Chords button uses yellow when active', async ({ page }) => {
    const chordsButton = page.getByRole('button', { name: /chords/i });
    await chordsButton.click();

    // Check button has yellow background (approximate rgb values)
    const bgColor = await chordsButton.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBe('rgba(230, 165, 0, 0.2)'); // #E6A500 with 20% opacity
    await expect(chordsButton).toHaveText(/chords/i);

    // Roman numeral buttons should appear
    await expect(page.getByText(/^I$/)).toBeVisible();
  });

  test('Selected Roman numeral uses yellow', async ({ page }) => {
    await page.getByRole('button', { name: /chords/i }).click();
    await page.getByText(/^V$/).click();

    const romanButton = page.getByText(/^V$/);
    const bgColor = await romanButton.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBe('rgba(230, 165, 0, 0.3)'); // #E6A500 with 30% opacity
  });

  test('Selected extension uses yellow', async ({ page }) => {
    await page.getByRole('button', { name: /chords/i }).click();
    await page.getByText(/^V$/).click();

    const extension7th = page.getByRole('button', { name: '7th' });
    await extension7th.click();

    const bgColor = await extension7th.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBe('rgba(230, 165, 0, 0.2)'); // #E6A500 with 20% opacity
  });

  test('Chord root notes are red', async ({ page }) => {
    await page.getByRole('button', { name: /chords/i }).click();
    await page.getByText(/^V$/).click();

    // V chord root is G (degree 5 of C Major)
    // Find G notes on fretboard - they should have red background
    const gNotes = page.getByText('G').filter({ hasText: /^G$/ });
    const firstG = gNotes.first();
    await expect(firstG).toBeVisible();

    const bgColor = await firstG.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBe('rgb(239, 68, 68)'); // red-500
  });

  test('Chord triad tones are blue', async ({ page }) => {
    await page.getByRole('button', { name: /chords/i }).click();
    await page.getByText(/^V$/).click();

    // V chord triad is G-B-D
    // B and D notes should be blue
    const bNotes = page.getByText('B').filter({ hasText: /^B$/ });
    const dNotes = page.getByText('D').filter({ hasText: /^D$/ });

    const bBgColor = await bNotes.first().evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    const dBgColor = await dNotes.first().evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    expect(bBgColor).toBe('rgb(59, 130, 246)'); // blue-500
    expect(dBgColor).toBe('rgb(59, 130, 246)'); // blue-500
  });

  test('Extension notes are bright yellow with white text', async ({ page }) => {
    await page.getByRole('button', { name: /chords/i }).click();
    await page.getByText(/^V$/).click();
    await page.getByRole('button', { name: '7th' }).click();

    // V7 chord is G-B-D-F
    // F should be yellow with white text
    const fNotes = page.getByText('F').filter({ hasText: /^F$/ });
    const firstF = fNotes.first();

    const bgColor = await firstF.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );
    const textColor = await firstF.evaluate(el =>
      getComputedStyle(el).color
    );

    expect(bgColor).toBe('rgb(230, 165, 0)'); // #E6A500
    expect(textColor).toBe('rgb(255, 255, 255)'); // white text
  });

  test('Key root is unhighlighted in chord mode', async ({ page }) => {
    // Enable chord mode and select V chord
    await page.getByRole('button', { name: /chords/i }).click();
    await page.getByText(/^V$/).click();

    // C is key root but not chord root for V
    const cNotes = page.getByText('C').filter({ hasText: /^C$/ });
    const firstC = cNotes.first();

    // Should not be red (it's neutral or gray)
    const bgColor = await firstC.evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    // Should be neutral, not red
    expect(bgColor).toBe('rgb(229, 231, 235)'); // neutral-200
  });
});
