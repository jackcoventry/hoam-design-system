import { expect, type Locator, type Page, test } from 'playwright/test';

const STORY_RENDER_TIMEOUT_MS = 10000;

async function visitStory(page: Page, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);

  await page
    .locator('#storybook-root')
    .waitFor({ state: 'visible', timeout: STORY_RENDER_TIMEOUT_MS });
}

async function expectNoHorizontalOverflow(locator: Locator) {
  const overflow = await locator.evaluate(
    (element) => element.scrollWidth > element.clientWidth + 1
  );

  expect(overflow).toBe(false);
}

test.describe('visual layout regression checks', () => {
  test('modal exposes one accessible close button and hides the backdrop from a11y', async ({
    page,
  }) => {
    await visitStory(page, 'components-modal--default');

    await page.getByRole('button', { name: 'Open modal' }).click();

    const dialog = page.getByRole('dialog', { name: 'My simple modal' });
    await expect(dialog).toBeVisible();

    await expect(page.getByRole('button', { name: 'Close dialog' })).toHaveCount(1);

    const backdrop = page.locator('[data-variant] > button[tabindex="-1"]');
    await expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  });

  test('search modal keeps the close button outside the search form panel', async ({ page }) => {
    await visitStory(page, 'components-navigation--default');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole('link', { name: 'Search' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await expect(page.getByRole('button', { name: 'Close dialog' })).toHaveCount(1);

    const layout = await page.evaluate(() => {
      const form = document.querySelector('form');
      const formPanel = form?.closest<HTMLElement>('[class]');
      const closeButton = document.querySelector<HTMLElement>('button[aria-label="Close dialog"]');

      if (!formPanel || !closeButton) return null;

      return {
        closeLeft: closeButton.getBoundingClientRect().left,
        formPanelRight: formPanel.getBoundingClientRect().right,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout?.closeLeft).toBeGreaterThan(layout?.formPanelRight ?? 0);
  });

  test('basket drawer scrolls vertically without narrow-width horizontal overflow', async ({
    page,
  }) => {
    await visitStory(page, 'components-navigation--default');

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole('link', { name: 'My Basket' }).click();
    await page.setViewportSize({ width: 390, height: 720 });

    const dialog = page.getByRole('dialog', { name: 'Your Basket' });
    await expect(dialog).toBeVisible();

    const body = dialog.locator('[class*="body"]').first();
    await expect
      .poll(async () =>
        body.evaluate((element) => ({
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
        }))
      )
      .toEqual(expect.objectContaining({ scrollHeight: expect.any(Number) }));

    const isScrollable = await body.evaluate(
      (element) => element.scrollHeight > element.clientHeight
    );
    expect(isScrollable).toBe(true);

    const rows = dialog.locator('tbody tr').filter({ visible: true });
    const rowCount = await rows.count();

    expect(rowCount).toBeGreaterThan(0);

    for (let index = 0; index < rowCount; index += 1) {
      await expectNoHorizontalOverflow(rows.nth(index));
    }
  });

  test('product tile long content stays within a narrow card', async ({ page }) => {
    await visitStory(page, 'components-producttile--long-content');

    const tile = page.locator('#storybook-root').locator('[class*="root"]').first();
    await expect(tile).toBeVisible();
    await expectNoHorizontalOverflow(tile);

    const textNodes = page.locator('h2, [class*="description"]');
    const textCount = await textNodes.count();

    expect(textCount).toBeGreaterThan(0);

    for (let index = 0; index < textCount; index += 1) {
      await expectNoHorizontalOverflow(textNodes.nth(index));
    }
  });
});
