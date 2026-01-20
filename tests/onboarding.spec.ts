import { test, expect } from '@playwright/test';

test('teacher onboarding flow', async ({ page }) => {
  // 1. Navigate to onboarding
  await page.goto('/onboarding');

  // 2. Fill Profile Form
  await page.fill('input[name="full_name"]', 'Test Teacher');
  await page.check('input[value="Quran"]'); // Subject
  await page.check('input[value="Everyone"]'); // Audience
  await page.fill('textarea[name="experience_text"]', 'I have 10 years of experience teaching Quran online to students of all ages.');
  await page.selectOption('select[name="teaching_format"]', 'online');
  await page.fill('input[name="email"]', 'test@example.com');

  // 3. Submit Profile
  await page.click('button[type="submit"]');

  // 4. Expect Redirect to Payment
  await expect(page).toHaveURL(/\/onboarding\/payment/);
  await expect(page.locator('h1')).toContainText('Activate Your Profile');

  // 5. Upload Payment Proof
  // Create a dummy file in memory or use a buffer if strictly Node
  // Playwright setInputFiles accepts an object
  await page.setInputFiles('input[type="file"]', {
    name: 'proof.png',
    mimeType: 'image/png',
    buffer: Buffer.from('fake image content')
  });

  // 6. Submit Payment
  await page.click('button[type="submit"]');

  // 7. Expect Success
  await expect(page.locator('h1')).toContainText('Submission Received');
});
