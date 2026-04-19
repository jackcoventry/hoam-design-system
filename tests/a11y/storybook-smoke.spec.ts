import type { AxeResults } from 'axe-core';
import { expect, type Page, test } from 'playwright/test';

import { assertNoAxeViolations, getAxeSource } from '../../config/a11y';

const axeSource = getAxeSource();
type AxeWindow = Window &
  typeof globalThis & {
    axe: {
      run: (context: Element, options?: unknown) => Promise<AxeResults>;
    };
  };

async function visitStory(page: Page, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  await page.locator('#storybook-root').waitFor();
}

async function runPageAxe(page: Page, selector = '#storybook-root') {
  await page.addScriptTag({ content: axeSource });

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
