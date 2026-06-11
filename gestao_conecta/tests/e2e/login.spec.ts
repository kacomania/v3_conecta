import { test, expect } from '@playwright/test';

test('login page loads and has correct elements', async ({ page }) => {
  await page.goto('/login');

  // Verifica o título
  await expect(page.locator('h1')).toHaveText('Gestão Conecta');

  // Verifica se existem os inputs de email e password
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();

  // Verifica se o botão de submit existe
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toHaveText('Entrar no Portal');
});
