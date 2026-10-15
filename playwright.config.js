import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// Use a pre-installed Chromium when one is available, otherwise Playwright's own.
const localChromium = [process.env.PLAYWRIGHT_CHROMIUM_PATH, '/opt/pw-browsers/chromium']
  .find((p) => p && existsSync(p));

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8123',
    launchOptions: localChromium ? { executablePath: localChromium } : {},
  },
  webServer: {
    command: 'npx http-server . -p 8123 -c-1 -s',
    url: 'http://127.0.0.1:8123',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
