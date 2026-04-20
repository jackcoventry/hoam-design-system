import { defineConfig } from 'playwright/test';

delete process.env.NO_COLOR;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:6006',
    viewport: { width: 1440, height: 1200 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run storybook:ci',
    port: 6006,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        colorScheme: 'light',
        browserName: 'chromium',
      },
    },
  ],
});
