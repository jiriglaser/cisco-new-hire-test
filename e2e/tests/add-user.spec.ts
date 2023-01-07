import { test, expect } from '@playwright/test';

test('As a user I can view employee list and add a new employee.', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('Employee List'),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Add Employee' }).click();

  await page.getByPlaceholder('Name').type('Aaron Bach');
  await page.getByPlaceholder('Job title').type('Developer');
  await page.getByPlaceholder('Tenure').type('12');
  await page.getByRole('combobox', { name: 'Gender' }).press('ArrowDown');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(
    page.getByRole('row', { name: 'Aaron Bach Developer 12 Male' }),
  ).toBeVisible();
});
