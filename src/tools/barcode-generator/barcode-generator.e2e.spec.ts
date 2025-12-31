import { test, expect } from '@playwright/test';

test.describe('Tool - Barcode Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/barcode-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Barcode Generator - IT Tools');
  });

  test('Should render a barcode canvas', async ({ page }) => {
    // Wait for canvas to be present
    await expect(page.locator('canvas')).toBeVisible();

    // Check if canvas has non-zero size
    const box = await page.locator('canvas').boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('Should update when text changes', async ({ page }) => {
    const input = page.getByPlaceholder('Enter content...');
    await input.fill('New Text Content');
    // Allow some time for debounce/render
    await page.waitForTimeout(500);
    await expect(page.locator('canvas')).toBeVisible();
  });
});