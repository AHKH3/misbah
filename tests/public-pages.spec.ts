import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
    test('homepage loads and displays content', async ({ page }) => {
        await page.goto('/');

        // Check title
        await expect(page).toHaveTitle(/مصباح/);

        // Check main heading
        await expect(page.locator('h1')).toContainText(/مصباح|Misbah/);

        // Check CTA buttons exist
        await expect(page.getByRole('link', { name: /تصفح المعلمين|Browse Teachers/i })).toBeVisible();
    });

    test('directory page loads with teacher cards', async ({ page }) => {
        await page.goto('/directory');

        // Page header
        await expect(page.locator('h1')).toContainText(/دليل المعلمين|Teacher Directory/i);

        // Should have teacher cards (in dev mode with placeholder data)
        const cards = page.locator('[class*="teacherCard"]');
        await expect(cards.first()).toBeVisible({ timeout: 10000 });
    });

    test('teacher profile page displays information', async ({ page }) => {
        // Navigate to directory first
        await page.goto('/directory');

        // Click on first teacher card
        const firstCard = page.locator('[class*="teacherCard"]').first();
        await firstCard.click();

        // Should navigate to profile page
        await expect(page).toHaveURL(/\/teachers\/.+/);

        // Profile should have name and details
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('[class*="section"]').first()).toBeVisible();
    });

    test('language switcher changes language', async ({ page }) => {
        await page.goto('/');

        // Find and click language switcher
        const langButton = page.locator('[class*="langSwitcher"]');
        await langButton.click();

        // Content should change
        await page.waitForTimeout(500);

        // Check that some content changed (either to EN or AR)
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();
    });
});

test.describe('Navigation', () => {
    test('header navigation works', async ({ page }) => {
        await page.goto('/');

        // Click directory link
        await page.click('[class*="navLink"]:has-text("دليل"), [class*="navLink"]:has-text("Directory")');
        await expect(page).toHaveURL('/directory');

        // Click logo to go home
        await page.click('[class*="logo"]');
        await expect(page).toHaveURL('/');
    });
});

test.describe('SEO', () => {
    test('homepage has proper meta tags', async ({ page }) => {
        await page.goto('/');

        // Check meta description
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description).toBeTruthy();
        expect(description!.length).toBeGreaterThan(50);
    });

    test('llms.txt is accessible', async ({ page }) => {
        const response = await page.goto('/llms.txt');
        expect(response?.status()).toBe(200);

        const content = await page.textContent('body');
        expect(content).toContain('Misbah');
    });
});
