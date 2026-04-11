// web/e2e/fretboard.spec.ts
import { test, expect } from '@playwright/test';
import { FretboardHelpers } from '../helpers/fretboard';

test.describe('Fretboard', () => {
  let helpers: FretboardHelpers;

  // Launch browser and navigate to app before each test
  test.beforeEach(async ({ page }) => {
    helpers = new FretboardHelpers(page);
    await page.goto('/');
    await expect(page).toHaveTitle(/Stratobater/);
  });

  test('should render correct notes for C major', async ({ page }) => {
    // Set root to C and scale to major
    await helpers.setRoot('C');
    await helpers.setScale('major');

    // Assert fretboard notes match C major scale
    const expectedNotes = [
      ['E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
      ['B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F'],
      ['G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D'],
      ['D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E'],
      ['E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
    ];
    await helpers.assertFretboardNotes(expectedNotes);
  });

  test('should highlight roots and triads when toggled', async ({ page }) => {
    await helpers.setRoot('C');
    await helpers.setScale('major');

    // Toggle roots
    await helpers.toggleRoots();
    await expect(page.locator('.fret-root')).toHaveCount(6); // C notes

    // Toggle triads
    await helpers.toggleTriads();
    await expect(page.locator('.fret-triad')).toHaveCount(6); // C,E,G notes
  });

  test('should update when changing scale/key', async ({ page }) => {
    // Change to A minor
    await helpers.setRoot('A');
    await helpers.setScale('minor');
    await helpers.assertFretboardNotes([
      ['E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
      ['B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F'],
      ['G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D'],
      ['D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'],
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E'],
      ['E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'],
    ]);

    // Change to F# phrygian
    await helpers.setRoot('F#');
    await helpers.setScale('phrygian');
    await helpers.assertFretboardNotes([
      ['E', 'F', 'F#', 'G', 'A', 'A#', 'B', 'C', 'C#', 'D', 'E', 'F'],
      ['B', 'C', 'C#', 'D', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'C'],
      ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F#', 'G'],
      ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C#', 'D'],
      ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G#', 'A'],
      ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'E', 'F'],
    ]);
  });

  test('should respond to keyboard shortcuts', async ({ page }) => {
    // ArrowUp: Change root
    await page.keyboard.press('ArrowUp');
    await expect(await helpers.getRoot()).toBe('C#');

    // '[': Change scale
    await page.keyboard.press('[');
    await expect(await helpers.getScale()).toBe('minor');

    // 'R': Toggle roots
    await page.keyboard.press('R');
    await expect(page.locator('.fret-root')).toHaveCount(6);
  });

  test('should display static string labels', async ({ page }) => {
    const labels = await page.locator('.string-label').allTextContents();
    expect(labels).toEqual(['e', 'B', 'G', 'D', 'A', 'E']);
  });

  test('should handle custom tuning', async ({ page }) => {
    await helpers.setTuning(['D', 'A', 'D', 'G', 'A', 'D']);
    await helpers.setRoot('D');
    await helpers.setScale('major');

    await helpers.assertFretboardNotes([
      ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
      ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
      ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
      ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
      ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
      ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
    ]);
  });
});