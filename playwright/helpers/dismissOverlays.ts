import { Page } from '@playwright/test';

export async function dismissOverlays(page: Page): Promise<void> {
    const acceptAll = page.getByRole('button', { name: /accept all/i });

    if (await acceptAll.isVisible().catch(() => false)) {
        await acceptAll.click();
    }

    const skip = page.getByRole('button', { name: /skip|close|got it/i });

    if (await skip.isVisible().catch(() => false)) {
        await skip.click();
    }
}