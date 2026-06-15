import { Page } from '@playwright/test';

export async function handleLogoutDevices(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle').catch(() => { });

    if (page.url().includes('/confirm-logout-devices')) {
        await page.getByRole('button', { name: /yes/i }).click();
        await page.waitForLoadState('networkidle').catch(() => { });
    }
}