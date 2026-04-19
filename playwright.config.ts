import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './tests/a11y',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:6006',
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
        browserName: 'chromium',
      },
    },
  ],
});
