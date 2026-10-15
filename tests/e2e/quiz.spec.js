import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('/#quiz'); });
const question = (page, n) => page.locator('.quiz-q').nth(n);

test('has at least five questions', async ({ page }) => {
  expect(await page.locator('.quiz-q').count()).toBeGreaterThanOrEqual(5);
});

test('a correct answer is marked, explained and scored', async ({ page }) => {
  await question(page, 0).getByRole('button', { name: '6', exact: true }).click();
  await expect(question(page, 0).getByRole('button', { name: '6', exact: true })).toHaveClass(/correct/);
  await expect(question(page, 0).locator('.quiz-feedback')).toContainText('Correct!');
  await expect(page.locator('.quiz-score')).toHaveText('Score: 1 / 1');
});

test('a wrong answer reveals the right one and does not score', async ({ page }) => {
  const q = question(page, 1);
  await q.getByRole('button', { name: '5.8' }).click();
  await expect(q.getByRole('button', { name: '5.8' })).toHaveClass(/wrong/);
  await expect(q.getByRole('button', { name: '5', exact: true })).toHaveClass(/correct/);
  await expect(q.locator('.quiz-feedback')).toContainText('The answer is 5.');
  await expect(page.locator('.quiz-score')).toHaveText('Score: 0 / 1');
});

test('answers lock and Try again restarts', async ({ page }) => {
  const q = question(page, 4);
  await q.getByRole('button', { name: 'Mode' }).click();
  for (const b of await q.locator('.quiz-option').all()) await expect(b).toBeDisabled();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.quiz-score')).toHaveText('Score: 0 / 0');
  await expect(question(page, 4).getByRole('button', { name: 'Mode' })).toBeEnabled();
});

test('finishing shows a final score', async ({ page }) => {
  const answers = ['6', '5', '7', '5', 'Mode', 'Median', 'Mean'];
  for (const [i, a] of answers.entries()) {
    await question(page, i).getByRole('button', { name: a, exact: true }).click();
  }
  await expect(page.locator('.quiz-final')).toContainText('You got 7 out of 7');
});
