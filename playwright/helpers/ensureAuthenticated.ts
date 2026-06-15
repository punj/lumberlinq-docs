import { Page, expect } from '@playwright/test';

export async function ensureAuthenticated(page: Page): Promise<void> {
    await expect(page).not.toHaveURL(/login/i, {
        timeout: 15000,
    });
}