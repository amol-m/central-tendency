import { test, expect } from '@playwright/test';

const cardValues = (demo) => demo.locator('.lineup-card').evaluateAll((els) => els.map((e) => Number(e.dataset.value)));

test('sorting six cards highlights the two middle values', async ({ page }) => {
  await page.goto('/#median');
  const demo = page.locator('[data-demo="lineup"]');
  await demo.locator('.lineup-count').selectOption('6');
  await demo.getByRole('button', { name: 'Sort' }).click();

  const values = await cardValues(demo);
  expect(values).toHaveLength(6);
  expect(values).toEqual([...values].sort((a, b) => a - b));
  const middle = await demo.locator('.lineup-card.middle').evaluateAll((els) => els.map((e) => Number(e.dataset.value)));
  expect(middle).toEqual([values[2], values[3]]);
  const expected = String(Math.round(((values[2] + values[3]) / 2) * 100) / 100);
  await expect(demo.locator('.lineup-result')).toContainText(`The median is (${values[2]} + ${values[3]}) ÷ 2 = ${expected}`);
});

test('odd count highlights one middle card', async ({ page }) => {
  await page.goto('/#median');
  const demo = page.locator('[data-demo="lineup"]');
  await demo.getByRole('button', { name: 'Sort' }).click();
  const values = await cardValues(demo);
  await expect(demo.locator('.lineup-card.middle')).toHaveCount(1);
  await expect(demo.locator('.lineup-result')).toContainText(`The median is ${values[3]}.`);
});

test('new numbers hides the result until sorted again', async ({ page }) => {
  await page.goto('/#median');
  const demo = page.locator('[data-demo="lineup"]');
  await demo.getByRole('button', { name: 'Sort' }).click();
  await demo.getByRole('button', { name: 'New numbers' }).click();
  await expect(demo.locator('.lineup-result')).toHaveText('Not sorted yet. Can you guess the median?');
  await expect(demo.locator('.lineup-card.middle')).toHaveCount(0);
  await expect(demo.getByRole('button', { name: 'Sort' })).toBeEnabled();
});
