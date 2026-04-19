import type { AxeResults } from 'axe-core';
import { expect, type Page, test } from 'playwright/test';

import { assertNoAxeViolations, getAxeSource } from '../../config/a11y';

const axeSource = getAxeSource();
const AXE_RUNNING_ERROR = 'Axe is already running';
type AxeWindow = Window &
  typeof globalThis & {
    axe: {
      _running?: boolean;
      run: (context: Element, options?: unknown) => Promise<AxeResults>;
    };
  };

async function visitStory(page: Page, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  await page.locator('#storybook-root').waitFor();
}

async function ensureAxe(page: Page) {
  const hasAxe = await page.evaluate(() => Boolean((globalThis as Partial<AxeWindow>).axe));

  if (!hasAxe) {
    await page.addScriptTag({ content: axeSource });
  }
}

async function waitForAxeToBeIdle(page: Page) {
  await page.waitForFunction(() => !(globalThis as Partial<AxeWindow>).axe?._running);
}

async function runPageAxe(page: Page, selector = '#storybook-root') {
  await ensureAxe(page);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await waitForAxeToBeIdle(page);

    try {
      const results = await page.evaluate<AxeResults, string>((rootSelector) => {
        const root = document.querySelector(rootSelector) ?? document.body;
        const axeWindow = globalThis as AxeWindow;

        return axeWindow.axe.run(root, {
          rules: {
            'color-contrast': { enabled: false },
          },
        });
      }, selector);

      assertNoAxeViolations(results);
      return;
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes(AXE_RUNNING_ERROR) ||
        attempt === 2
      ) {
        throw error;
      }
    }
  }
}

test.describe('Storybook accessibility smoke tests', () => {
  test('scans key component and page stories with axe', async ({ page }) => {
    const storyIds = [
      'components-button--primary',
      'components-accordion--default',
      'pages-product-page--default',
    ];

    for (const storyId of storyIds) {
      await visitStory(page, storyId);
      await runPageAxe(page);
    }
  });

  test('keeps the modal story keyboard accessible', async ({ page }) => {
    await visitStory(page, 'components-modal--default');

    await page.getByRole('button', { name: 'Open modal' }).click();

    const dialog = page.getByRole('dialog', { name: 'My simple modal' });
    const closeButton = dialog.getByRole('button').first();

    await expect(dialog).toBeVisible();
    await expect(closeButton).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();

    await runPageAxe(page, 'body');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
