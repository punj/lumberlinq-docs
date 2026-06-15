import { Page, Route } from '@playwright/test';

export async function login(page: Page): Promise<void> {
    await page.route(
        '**/challenges.cloudflare.com/**',
        (route: Route) => route.abort()
    );

    await page.goto('https://app-vps.rikexim.com');

    await page.fill('[formcontrolname=email]', process.env.LL_EMAIL!);
    await page.fill('[formcontrolname=password]', process.env.LL_PASSWORD!);

    await page.click('button[type=submit]');
}