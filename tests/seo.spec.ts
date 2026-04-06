
import { test, expect } from '@playwright/test';

test.describe('SEO & Static Pages', () => {
    test('for-teachers page loads', async ({ page }) => {
        const resp = await page.goto('/for-teachers');
        expect(resp?.status()).toBe(200);
        await expect(page).toHaveTitle(/للمعلمين | مصباح/);
    });

    test('contact page loads', async ({ page }) => {
        const resp = await page.goto('/contact');
        expect(resp?.status()).toBe(200);
        await expect(page).toHaveTitle(/تواصل معنا | مصباح/);
    });

    test('sitemap.xml is accessible', async ({ page }) => {
        const resp = await page.goto('/sitemap.xml');
        expect(resp?.status()).toBe(200);
        const text = await resp?.text();
        expect(text).toContain('<?xml');
        expect(text).toContain('<urlset');
        expect(text).toContain('https://misbah.site/for-teachers');
    });

    // We can't easily test dynamic teacher pages without knowing an ID, 
    // unless we mock or fetch from directory first.
    test('teacher profile has json-ld', async ({ page }) => {
        // Go to directory, click first profile if any
        await page.goto('/directory');
        const firstProfile = page.locator('a[href^="/teachers/"]').first();
        if (await firstProfile.isVisible()) {
            await firstProfile.click();
            await expect(page.locator('script[type="application/ld+json"]')).toBeVisible();
        }
    });
});
