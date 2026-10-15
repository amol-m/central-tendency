import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('/#mode'); });
const demo = (page) => page.locator('[data-demo="tally"]');
const vote = (page, fruit, n = 1) => Promise.all(Array.from({ length: n }, () => null)).then(async () => {
  for (let i = 0; i < n; i++) await demo(page).getByRole('button', { name: `Add a vote for ${fruit}` }).click();
});

test('one clear winner is the mode', async ({ page }) => {
  await vote(page, 'Banana', 3);
  await vote(page, 'Apple', 1);
  await expect(demo(page).locator('.tally-row.is-mode')).toHaveCount(1);
  await expect(demo(page).locator('.tally-row.is-mode')).toHaveAttribute('data-fruit', 'Banana');
  await expect(demo(page).locator('.tally-result')).toHaveText('Mode: Banana (3 votes).');
});

test('a tie marks both bars as modes', async ({ page }) => {
  await vote(page, 'Apple', 2);
  await vote(page, 'Grapes', 2);
  await vote(page, 'Orange', 1);
  await expect(demo(page).locator('.tally-row.is-mode')).toHaveCount(2);
  await expect(demo(page).locator('.tally-result')).toContainText('The modes are Apple and Grapes');
});

test('reset clears every count and the mode', async ({ page }) => {
  await vote(page, 'Apple', 2);
  await demo(page).getByRole('button', { name: 'Reset' }).click();
  await expect(demo(page).locator('.tally-count')).toHaveText(['0', '0', '0', '0', '0']);
  await expect(demo(page).locator('.tally-row.is-mode')).toHaveCount(0);
  await expect(demo(page).locator('.tally-result')).toHaveText('No votes yet, so there is no mode.');
});

test('survey adds 20 votes', async ({ page }) => {
  await demo(page).getByRole('button', { name: 'Survey 20 students' }).click();
  const counts = await demo(page).locator('.tally-count').allTextContents();
  expect(counts.reduce((a, c) => a + Number(c), 0)).toBe(20);
});
