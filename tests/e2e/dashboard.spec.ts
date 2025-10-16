import { expect, test } from '@playwright/test';

import { installVisualStability } from './utils';

test.describe('Dashboard workspace', () => {
  test('drags an automation into the live preview drop zone', async ({ page }) => {
    await installVisualStability(page);

    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'dashboard-e2e-token');
    });

    await page.route('**/auth/**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      if (url.pathname.endsWith('/auth/me') && request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-001', email: 'ops@artifically.test', verified: true } }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.route('**/deployments', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          deployments: [
            {
              id: 'dep-001',
              name: 'Ops Guardian',
              status: 'active',
              roi: 3.4,
              throughput: 180,
              savings: 5200,
            },
          ],
        }),
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const dropZone = page.locator('[aria-labelledby="dashboard-dropzone-title"]');
    await dropZone.waitFor({ state: 'visible', timeout: 30000 });
    await expect(dropZone).toBeVisible();
    await expect(dropZone.locator('h3')).toHaveText('Ops Guardian');

    const supportCard = page.getByRole('button', { name: /Support Coach/ });
    await supportCard.dragTo(dropZone);

    await expect(dropZone.locator('h3')).toHaveText('Support Coach');
  });
});