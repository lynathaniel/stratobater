import { test, expect } from '@playwright/test';

test.describe('Modal Toggle Behavior - Bug Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fretboard-visualizer');
    await page.waitForTimeout(1000);
  });

  test('Bug 1 - Current selection cannot be toggled off when 2+ items visible', async ({ page }) => {
    // Open key selector modal with 'K'
    await page.keyboard.press('k');
    await page.waitForTimeout(500);

    // Switch to Edit Mode with Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    // Take snapshot for reference
    const snapshot1 = await page.accessibility.snapshot();
    console.log('Initial Edit Mode state:', JSON.stringify(snapshot1, null, 2));

    // Find the current key (e.g., "C" with "Current" label and blue background)
    const currentKeyItem = page.locator('div').filter({ hasText: 'C' }).filter({ hasText: 'Current' }).first();
    await expect(currentKeyItem).toBeVisible();

    // Check if the eye icon is disabled for the current key
    const visibilityButton = currentKeyItem.locator('button[aria-label*="Hide"], button[aria-label*="Show"]').first();
    const isDisabled = await visibilityButton.getAttribute('disabled');

    // Bug: Current selection's visibility button should NOT be disabled when 2+ items are visible
    // The current implementation has isVisibilityDisabled returning true for current items
    console.log('Current key visibility button disabled:', isDisabled);

    // Try to click the eye icon on the current key
    await visibilityButton.click();
    await page.waitForTimeout(300);

    // Verify current is still visible (BUG - should have toggled off when other items are visible)
    const currentKeyAfter = page.locator('div').filter({ hasText: 'C' }).filter({ hasText: 'Current' }).first();
    const opacity = await currentKeyAfter.evaluate(el => window.getComputedStyle(el).opacity);

    console.log('Current key opacity after click:', opacity);
    // Bug: opacity should be 0.5 if hidden, but it will likely stay at 1.0
  });

  test('Bug 2 - Shift+Enter bulk toggle not working correctly', async ({ page }) => {
    // Open key selector modal with 'K'
    await page.keyboard.press('k');
    await page.waitForTimeout(500);

    // Switch to Edit Mode with Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    // Navigate to a non-current key (e.g., "D") using arrow keys
    // First, ensure we're on current key, then move down
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown'); // Move to D
    await page.waitForTimeout(300);

    // Take snapshot before bulk toggle
    const snapshotBefore = await page.accessibility.snapshot();
    console.log('Before bulk toggle:', JSON.stringify(snapshotBefore, null, 2));

    // Press Shift+Enter for bulk toggle
    await page.keyboard.press('Shift+Enter');
    await page.waitForTimeout(500);

    // Take snapshot after bulk toggle
    const snapshotAfter = await page.accessibility.snapshot();
    console.log('After bulk toggle:', JSON.stringify(snapshotAfter, null, 2));

    // Check if the bulk actually happened
    // The expected behavior: all non-current items should match target's state
    // If there's a bug, this may not happen correctly
  });

  test('Bug 3 - No auto-reactive when all items are toggled off', async ({ page }) => {
    // Open key selector modal with 'K'
    await page.keyboard.press('k');
    await page.waitForTimeout(500);

    // Switch to Edit Mode with Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    // Get all key items
    const keyItems = page.locator('div').filter({ hasText: /^Current$/ }).all();
    const itemCount = (await keyItems.length);
    console.log('Total key items:', itemCount);

    // Try to toggle off items one by one (except current)
    // Navigate to first non-current item
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(300);

    // Press Enter to toggle off this item
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Continue toggling off items
    for (let i = 1; i < itemCount - 1; i++) {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
    }

    // Now only current should be visible
    // Try to toggle off the current (should be blocked by current implementation)
    await page.keyboard.press('ArrowUp'); // Navigate back to current
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Bug: The current should have toggled off temporarily, then auto-reactivated
    // Current implementation: stays visible (locked)
    const currentKey = page.locator('div').filter({ hasText: 'C' }).filter({ hasText: 'Current' }).first();
    const opacity = await currentKey.evaluate(el => window.getComputedStyle(el).opacity);

    console.log('Current key opacity after trying to toggle off when last visible:', opacity);
    // Bug: opacity will be 1.0 (still visible), expected behavior: visible after auto-reactivation
  });

  test('Manual verification - Click interactions', async ({ page }) => {
    // Open key selector modal with 'K'
    await page.keyboard.press('k');
    await page.waitForTimeout(500);

    // Switch to Edit Mode with Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    // Get the current key item
    const currentKeyItem = page.locator('div').filter({ hasText: 'C' }).filter({ hasText: 'Current' }).first();

    // Find the eye icon button
    const eyeButton = currentKeyItem.locator('button:has(svg)').first();

    // Check if button is disabled
    const isDisabled = await eyeButton.isDisabled();
    const title = await eyeButton.getAttribute('title');

    console.log('Eye button disabled:', isDisabled);
    console.log('Eye button title:', title);

    // Try clicking it multiple times
    for (let i = 0; i < 3; i++) {
      await eyeButton.click();
      await page.waitForTimeout(300);
      const hiddenItems = await page.locator('div[style*="opacity"]').all();
      console.log(`Attempt ${i + 1}: Items with opacity styling:`, hiddenItems.length);
    }
  });
});
