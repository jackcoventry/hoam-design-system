import { expect, type Page, test } from 'playwright/test';

const visualStories = [
  'components-button--primary',
  'components-basket--default',
  'components-footer--default',
  'components-hero--single',
  'components-producttile--default',
  'pages-homepage--default',
  'pages-product-page--default',
  'pages-sign-in--default',
] as const;

async function visitStory(page: Page, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);

  const root = page.locator('#storybook-root');
  const errorSummary = page.getByText('The component failed to render properly');

  await Promise.race([
    root.waitFor({ state: 'visible', timeout: 10000 }),
    errorSummary.waitFor({ state: 'visible', timeout: 10000 }).then(async () => {
      const errorHeading = await page.getByRole('heading').first().textContent();
      throw new Error(
        `Story "${storyId}" failed to render in Storybook: ${errorHeading ?? 'Unknown error'}`
      );
    }),
  ]);
}

test.describe('Storybook visual regression', () => {
  for (const storyId of visualStories) {
    test(storyId, async ({ page }) => {
      await visitStory(page, storyId);

      await expect(page.locator('#storybook-root')).toHaveScreenshot(`${storyId}.png`, {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      });
    });
  }
});
