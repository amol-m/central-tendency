import { test, expect } from '@playwright/test';

test('an outlier pulls the mean but barely moves the median', async ({ page }) => {
  await page.goto('/#choosing');
  const demo = page.locator('[data-demo="outlier"]');
  await expect(demo.locator('.ol-mean')).toHaveText('£5.33');
  await expect(demo.locator('.ol-median')).toHaveText('£5');

  await demo.locator('.ol-slider').fill('100');
  await expect(demo.locator('.ol-value')).toHaveText('100');
  await expect(demo.locator('.ol-mean')).toHaveText('£21.17');
  await expect(demo.locator('.ol-median')).toHaveText('£5.5');
  await expect(demo.locator('.ol-caption')).toContainText('outlier');
});

test('slider works with the keyboard', async ({ page }) => {
  await page.goto('/#choosing');
  const slider = page.locator('.ol-slider');
  await slider.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.ol-value')).toHaveText('100');
});
