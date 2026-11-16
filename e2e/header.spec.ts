import { test, expect } from '@playwright/test';

for (const path of ['/', '/en']) {
  test(`header sem quebra ou sobreposição em ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    for (const width of [
      1920, 1441, 1440, 1366, 1321, 1320, 1281, 1280, 1201, 1200, 1100, 1024,
      834, 390
    ]) {
      await page.setViewportSize({ width, height: 900 });
      const header = page.locator('header');
      await expect(header).toBeVisible();
      const layout = await header.evaluate(el => {
        const row = el.firstElementChild!;
        const brand = row.firstElementChild!.getBoundingClientRect();
        const actions = row.lastElementChild!.getBoundingClientRect();
        const wrapped = Array.from(el.querySelectorAll('nav:first-of-type p'))
          .filter(
            p =>
              p.getBoundingClientRect().height >
              parseFloat(getComputedStyle(p).lineHeight) + 1
          )
          .map(p => p.textContent);
        return {
          gap: actions.left - brand.right,
          right: actions.right,
          inset: parseFloat(getComputedStyle(row).paddingRight),
          viewport: document.documentElement.clientWidth,
          wrapped
        };
      });
      expect(layout.wrapped, `${width}px`).toEqual([]);
      expect(layout.gap, `${width}px`).toBeGreaterThanOrEqual(8);
      expect(layout.right, `${width}px`).toBeLessThanOrEqual(
        layout.viewport - layout.inset + 1
      );
      await expect(header.locator('nav').first()).toBeVisible({
        visible: width > 1200
      });
    }

    const toggle = page.locator(
      'header button[aria-controls="mobile-navigation"]'
    );
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-navigation')).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
}
