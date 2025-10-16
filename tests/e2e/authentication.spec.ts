import { expect, test } from '@playwright/test';

import { installVisualStability } from './utils';

test.describe('Authentication onboarding', () => {
  test('completes the multi-step signup flow and persists the session', async ({ page }) => {
    await installVisualStability(page);

    let capturedPayload: Record<string, unknown> | null = null;

    await page.route('**/auth/**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      if (url.pathname.endsWith('/auth/csrf-token') && request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ csrfToken: 'e2e-csrf-token' }),
        });
        return;
      }

      if (url.pathname.endsWith('/auth/signup') && request.method() === 'POST') {
        capturedPayload = request.postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'e2e-token',
            user: { id: 'user-001', email: capturedPayload?.email, verified: false },
            message: 'Account created',
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heroCta = page.locator('.page-hero .cta-primary');
    await heroCta.waitFor({ state: 'visible' });
    await heroCta.scrollIntoViewIfNeeded();
    await heroCta.click();

    const modal = page.locator('.modal');
    await modal.waitFor({ state: 'visible' });

    await page.getByPlaceholder('you@example.com').fill('newuser@example.com');
    await page.getByPlaceholder('Enter your password').fill('StrongPass!234');

    const continueButton = page.getByRole('button', { name: 'Continue' });
    await continueButton.waitFor({ state: 'visible' });
    await continueButton.click();

    const businessNameInput = page.getByPlaceholder('Enter your business name');
    await businessNameInput.waitFor({ state: 'visible' });
    await businessNameInput.fill('Artifically QA');
    await page.getByPlaceholder('+971 50 123 4567').fill('+1 555 0100');
    await page.getByPlaceholder('support@yourbusiness.com').fill('ops@artifically.test');
    await page.getByPlaceholder('https://yourbusiness.com').fill('https://artifically.test');

    const createAccountButton = page.getByRole('button', { name: 'Create Account' });
    const signupResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/auth/signup') && response.request().method() === 'POST',
    );

    const [signupResponse] = await Promise.all([signupResponsePromise, createAccountButton.click()]);

    expect(signupResponse.ok()).toBeTruthy();

    await page.waitForFunction(() => window.localStorage.getItem('token') === 'e2e-token', { timeout: 5000 });

    await expect(modal).not.toBeVisible();

    expect(capturedPayload).not.toBeNull();
    expect(capturedPayload).toMatchObject({
      email: 'newuser@example.com',
      businessName: 'Artifically QA',
      businessPhone: '+1 555 0100',
      businessEmail: 'ops@artifically.test',
      websiteUrl: 'https://artifically.test',
    });
  });
});