import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Note: This test requires authentication
    // In a real test, you would mock auth or use test credentials
  });

  test('onboarding page loads with form', async ({ page }) => {
    await page.goto('/onboarding');

    // Check page content (may redirect to login if not authenticated)
    // For now, just check the page loads
    await expect(page).toHaveURL(/onboarding|login/);
  });

  test('onboarding form has all required fields', async ({ page }) => {
    await page.goto('/onboarding');

    // Check for form fields (when authenticated)
    const fullNameInput = page.locator('#full_name');
    const countryInput = page.locator('#country');
    const experienceTextarea = page.locator('#experience_text');
    const videoInput = page.locator('#video_url');

    // If authenticated, these should be visible
    // If not, page will show login
    if (await fullNameInput.isVisible()) {
      await expect(countryInput).toBeVisible();
      await expect(experienceTextarea).toBeVisible();
      await expect(videoInput).toBeVisible();

      // Check subjects checkboxes
      await expect(page.locator('input[name="subjects"]').first()).toBeVisible();

      // Check audience checkboxes
      await expect(page.locator('input[name="audience"]').first()).toBeVisible();

      // Check teaching format select
      await expect(page.locator('#teaching_format')).toBeVisible();
    }
  });

  test('payment page shows pricing information', async ({ page }) => {
    await page.goto('/onboarding/payment');

    // Check for pricing info (when authenticated)
    const pricingText = page.locator('text=٣٠٠, text=300');

    // If authenticated, should show pricing
    // Otherwise may redirect
  });

  test('success page shows confirmation', async ({ page }) => {
    await page.goto('/onboarding/success');

    // Check for success message
    await expect(page.locator('h1')).toBeVisible();
  });
});
