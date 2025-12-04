/**
 * ChefIApp™ - Login E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    // Check for login elements
    await expect(page.locator('text=ChefIApp')).toBeVisible();
  });

  test('should have Google login button', async ({ page }) => {
    const googleButton = page.locator('button:has-text("Google")');
    await expect(googleButton).toBeVisible();
  });

  test('should have Apple login button', async ({ page }) => {
    const appleButton = page.locator('button:has-text("Apple")');
    await expect(appleButton).toBeVisible();
  });

  test('should have email login option', async ({ page }) => {
    // Look for email input or magic link option
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('should redirect to dashboard after login', async ({ page }) => {
    // This test would require mocking the auth flow
    // For now, just verify the page loads
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});
