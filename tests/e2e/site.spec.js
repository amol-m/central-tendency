import { test, expect } from '@playwright/test';
import { pointForValue, dotValues } from './helpers.js';

test('navigation jumps to each section', async ({ page }) => {
  await page.goto('/');
  for (const [name, id] of [['Mean', 'mean'], ['Median', 'median'], ['Mode', 'mode'], ['Playground', 'playground'], ['Which one?', 'choosing'], ['Quiz', 'quiz'], ['Intro', 'intro']]) {
    await page.locator('.site-nav').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id} h2`)).toBeInViewport();
  }
});

test('no request leaves the local site and nothing errors', async ({ page }) => {
  const external = [];
  const errors = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://127.0.0.1:8123') && !r.url().startsWith('data:')) external.push(r.url()); });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });

  test('fits the screen with no horizontal scroll', async ({ page }) => {
    await page.goto('/');
    const [scrollWidth, innerWidth] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });

  test('tapping the playground adds a value', async ({ page }) => {
    await page.goto('/#playground');
    const p = await pointForValue(page, 15);
    await page.touchscreen.tap(p.x, p.y - 40);
    expect(await dotValues(page)).toEqual([2, 4, 4, 5, 10, 15]);
  });

  test('dots are big enough to touch', async ({ page }) => {
    await page.goto('/#playground');
    const box = await page.locator('.dot-group').first().boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(24);
  });
});

test.describe('in dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('uses a dark background with light text', async ({ page }) => {
    await page.goto('/');
    const [bg, fg] = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return [s.backgroundColor, s.color];
    });
    expect(bg).toBe('rgb(20, 22, 27)');
    expect(fg).toBe('rgb(236, 238, 242)');
  });
});
