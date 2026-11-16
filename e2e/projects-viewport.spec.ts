import { test, expect } from '@playwright/test';

for (const path of ['/', '/en']) {
  test(`Projetos cabe na altura da janela em ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await expect(page.locator('#projetos .swiper-slide')).toHaveCount(7);
    await page.evaluate(() => document.fonts.ready);
    for (const viewport of [
      { width: 1920, height: 1080 },
      { width: 1440, height: 900 },
      { width: 1366, height: 768 },
      { width: 1280, height: 720 },
      { width: 1024, height: 600 },
      { width: 834, height: 600 },
      { width: 800, height: 380 }
    ]) {
      await page.setViewportSize(viewport);
      await page.locator('#projetos').evaluate(el => el.scrollIntoView());
      const layout = await page.locator('#projetos').evaluate(el => {
        const section = el.getBoundingClientRect();
        return {
          height: section.height,
          cards: Array.from(el.querySelectorAll('.swiper-slide')).map(card => {
            const box = card.getBoundingClientRect();
            return {
              top: box.top - section.top,
              bottom: box.bottom - section.top
            };
          })
        };
      });
      expect(layout.height).toBeLessThanOrEqual(viewport.height + 1);
      for (const card of layout.cards) {
        expect(card.top).toBeGreaterThanOrEqual(72);
        expect(card.bottom, JSON.stringify(viewport)).toBeLessThanOrEqual(
          layout.height - 8
        );
      }
    }
  });
}
