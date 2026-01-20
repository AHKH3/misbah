import { test, expect } from '@playwright/test';

test('admin review flow', async ({ page }) => {
  // 1. Mock Admin Auth (Conceptual - depends on auth implementation)
  // In real test, we'd log in as admin
  // await page.goto('/login'); ...

  // 2. Navigate to Review Dashboard
  await page.goto('/admin/review');

  // 3. Expect to see the profile submitted in previous test (Test Teacher)
  // Note: This depends on DB state.
  await expect(page.locator('body')).toContainText('Test Teacher');

  // 4. Approve
  page.on('dialog', dialog => dialog.accept());
  await page.click('text=Approve & Activate');

  // 5. Verify removal from list
  await expect(page.locator('body')).not.toContainText('Test Teacher');
});
