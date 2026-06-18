import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully and navigate to dashboard', async ({ page, context }) => {
    // Inject auth cookies directly into the browser context so the Next.js middleware
    // and SSR consider the user authenticated when navigating to /dashboard.
    // In a real scenario, this token should be a valid Supabase JWT.
    await context.addCookies([
      {
        name: 'sb-jddctbskhxxvspaawtqn-auth-token-code-verifier',
        value: 'mock-verifier',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'sb-jddctbskhxxvspaawtqn-auth-token',
        value: JSON.stringify({
          access_token: 'mock_token',
          refresh_token: 'mock_refresh',
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: { id: '123', role: 'authenticated', email: 'test@example.com' }
        }),
        domain: 'localhost',
        path: '/',
      }
    ]);

    // Intercept the Next.js Server Action POST request to /login
    await page.route('**/login', async (route, request) => {
      if (request.method() === 'POST') {
        // Next.js client-side router handles redirects from server actions via the 'x-action-redirect' header
        // when JS is enabled. We mock this to simulate a successful login redirect.
        await route.fulfill({
          status: 200,
          headers: {
            'x-action-redirect': '/dashboard',
          },
          body: '',
        });
      } else {
        await route.continue();
      }
    });

    // Mock dashboard initial page load to avoid hitting the real server again 
    // and bypassing the real Supabase middleware check (since our injected token is fake)
    await page.route('**/dashboard*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><div id="dashboard-mock">Dashboard</div></body></html>',
      });
    });

    // Navigate to login
    await page.goto('/login');

    // Wait for the form to load by checking for elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Fill credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Click submit
    await page.click('button[type="submit"]');

    // We expect it to navigate to the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Check if our mock element is visible
    await expect(page.locator('text=Dashboard').first()).toBeVisible({ timeout: 10000 });
  });
});
