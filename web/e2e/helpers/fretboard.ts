// web/e2e/helpers/fretboard.ts
import { Page, expect } from '@playwright/test';

export class FretboardHelpers {
  constructor(private page: Page) {}

  async setRoot(root: string) {
    await this.page.locator('#root-select').selectOption(root);
  }

  async getRoot(): Promise<string> {
    return await this.page.locator('#root-select').inputValue();
  }

  async setScale(scale: string) {
    await this.page.locator('#scale-select').selectOption(scale);
  }

  async getScale(): Promise<string> {
    return await this.page.locator('#scale-select').inputValue();
  }

  async toggleRoots() {
    await this.page.locator('#roots-toggle').click();
  }

  async toggleTriads() {
    await this.page.locator('#triads-toggle').click();
  }

  async setTuning(tuning: string[]) {
    await this.page.locator('#tuning-input').fill(tuning.join(','));
    await this.page.keyboard.press('Enter');
  }

  async assertFretboardNotes(expectedNotes: string[][]) {
    const frets = await this.page.locator('.fret').all();
    for (let stringIdx = 0; stringIdx < expectedNotes.length; stringIdx++) {
      const stringNotes = expectedNotes[stringIdx];
      for (let fretIdx = 0; fretIdx < stringNotes.length; fretIdx++) {
        const fret = frets[stringIdx * stringNotes.length + fretIdx];
        await expect(fret).toHaveAttribute('data-note', stringNotes[fretIdx]);
      }
    }
  }
}