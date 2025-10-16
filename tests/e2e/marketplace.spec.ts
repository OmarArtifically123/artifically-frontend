
import { expect, test } from '@playwright/test';

import { installVisualStability } from './utils';

test.describe('Marketplace exploration', () => {
  test('filters automations via search suggestions and opens quick view', async ({ page }) => {
    await installVisualStability(page);

    const automations = [
      {
        id: 'ops-guardian',
        name: 'Ops Guardian',
        description: 'Route incidents to the right squad and auto-generate postmortems.',
        category: 'Operations',
        tags: ['operations', 'incidents'],
      },
      {
        id: 'support-coach',
        name: 'Support Coach',
        description: 'Coach agents live with empathetic macros and churn signals.',
        category: 'Support',
        tags: ['support', 'customers'],
      },
    ];

    await page.route('**://api.artifically.com/marketplace**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ automations }),
      });
    });

    await page.goto('/marketplace');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('#automation-search');
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.click();
    await searchInput.fill('support');

    const suggestionList = page.getByRole('listbox', { name: 'Search suggestions' });
    await expect(suggestionList).toBeVisible();

    await page.getByRole('option', { name: /Support Coach/ }).click();
    await expect(searchInput).toHaveValue('Support Coach');

    const cards = page.locator('.automation-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toBeVisible();
    await expect(cards.first()).toContainText('Support Coach');

    await page.getByRole('button', { name: /Support Coach/ }).click({ force: true });

    const quickView = page.getByRole('dialog', { name: /Support Coach/ });
    await quickView.waitFor({ state: 'visible', timeout: 15000 });
    await expect(quickView).toBeVisible();
    await expect(quickView).toContainText('Launch Pilot');

    await quickView.getByRole('button', { name: 'Close' }).click();
    await expect(quickView).not.toBeVisible();
  });
});