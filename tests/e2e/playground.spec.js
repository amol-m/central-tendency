import { test, expect } from '@playwright/test';
import { pointForValue, dotValues } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.locator('.dotplot').evaluate((svg) => svg.scrollIntoView({ block: 'center', behavior: 'instant' }));
});

const pg = (page) => page.locator('[data-demo="playground"]');

test('starts with the sample data and matching measures', async ({ page }) => {
  expect(await dotValues(page)).toEqual([2, 4, 4, 5, 10]);
  await expect(pg(page).locator('.pg-mean')).toHaveText('5');
  await expect(pg(page).locator('.pg-median')).toHaveText('4');
  await expect(pg(page).locator('.pg-mode')).toHaveText('4');
});

test('shows the working', async ({ page }) => {
  await expect(pg(page).locator('.pg-work-mean')).toContainText('25 ÷ 5 = 5');
  await expect(pg(page).locator('.pg-work-median .chip.middle')).toHaveText(['4']);
  await expect(pg(page).locator('.pg-work-mode')).toContainText('4 appears 2 times');
});

test('clicking the number line adds a value', async ({ page }) => {
  const p = await pointForValue(page, 12);
  await page.mouse.click(p.x, p.y - 60);
  expect(await dotValues(page)).toEqual([2, 4, 4, 5, 10, 12]);
  await expect(pg(page).locator('.pg-mean')).toHaveText('6.17');
  await expect(pg(page).locator('.pg-median')).toHaveText('4.5');
});

test('dragging a dot moves it and updates the measures while moving', async ({ page }) => {
  const from = await pointForValue(page, 2);
  const to = await pointForValue(page, 15);
  const dot = page.locator('.dot-group[data-value="2"] .dot');
  const box = await dot.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const mid = await pointForValue(page, 8);
  await page.mouse.move(mid.x, from.y - 20, { steps: 5 });
  await expect(pg(page).locator('.pg-mean')).toHaveText('6.2');
  await page.mouse.move(to.x, from.y - 20, { steps: 5 });
  await page.mouse.up();
  expect(await dotValues(page)).toEqual([4, 4, 5, 10, 15]);
  await expect(pg(page).locator('.pg-mean')).toHaveText('7.6');
  await expect(pg(page).locator('.pg-median')).toHaveText('5');
});

test('double-clicking a dot removes it', async ({ page }) => {
  const box = await page.locator('.dot-group[data-value="10"] .dot').boundingBox();
  await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2);
  expect(await dotValues(page)).toEqual([2, 4, 4, 5]);
  await expect(pg(page).locator('.pg-mean')).toHaveText('3.75');
});

test('Delete removes the selected dot, and Remove selected works too', async ({ page }) => {
  await page.locator('.dot-group[data-value="10"]').focus();
  await page.keyboard.press('Delete');
  expect(await dotValues(page)).toEqual([2, 4, 4, 5]);
  await page.locator('.dot-group[data-value="2"] .dot').click();
  await pg(page).getByRole('button', { name: 'Remove selected' }).click();
  expect(await dotValues(page)).toEqual([4, 4, 5]);
});

test('arrow keys move a focused dot by one', async ({ page }) => {
  await page.locator('.dot-group[data-value="10"]').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect(await dotValues(page)).toEqual([2, 4, 4, 5, 12]);
  await expect(page.locator('.dot-group[data-value="12"]')).toBeFocused();
  await expect(pg(page).locator('.pg-mean')).toHaveText('5.4');
});

test('clear shows the empty state', async ({ page }) => {
  await pg(page).getByRole('button', { name: 'Clear' }).click();
  expect(await dotValues(page)).toEqual([]);
  for (const cls of ['.pg-mean', '.pg-median', '.pg-mode']) {
    await expect(pg(page).locator(cls)).toHaveText('–');
  }
  await expect(pg(page).locator('.pg-work-mean')).toContainText('Add some values');
});

test('random and reset buttons replace the data', async ({ page }) => {
  await pg(page).getByRole('button', { name: 'Random data' }).click();
  const random = await dotValues(page);
  expect(random.length).toBeGreaterThanOrEqual(7);
  expect(random.every((v) => v >= 0 && v <= 20)).toBe(true);
  await pg(page).getByRole('button', { name: 'Reset' }).click();
  expect(await dotValues(page)).toEqual([2, 4, 4, 5, 10]);
});

test('cannot add more than 25 values', async ({ page }) => {
  await pg(page).getByRole('button', { name: 'Clear' }).click();
  // Spread the clicks out so stacks stay low and each click lands on empty space.
  for (let i = 0; i < 26; i++) {
    const p = await pointForValue(page, i % 21);
    await page.mouse.click(p.x, p.y - 110);
  }
  expect((await dotValues(page)).length).toBe(25);
  await expect(pg(page).locator('.pg-message')).toContainText('limit of 25');
});

test('results are announced in a polite live region', async ({ page }) => {
  await page.locator('.dot-group[data-value="10"]').focus();
  await page.keyboard.press('Delete');
  await expect(pg(page).locator('.pg-live[aria-live="polite"]')).toHaveText('Mean 3.75, median 4, mode 4.');
});
