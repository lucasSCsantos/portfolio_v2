import { test, expect, type Page } from '@playwright/test';

// As cores das três camadas de onda como sempre foram (de trás para a frente) e o fundo do Hero.
const DAY_WAVES = ['rgb(20, 98, 166)', 'rgb(57, 140, 191)', 'rgb(121, 190, 217)'];
const DAY_SKY = 'rgb(242, 242, 242)';

// O SVG das ondas é o único de proporção 1440×240 (os demais SVGs são ícones e o halo do avatar).
const waveFills = (page: Page, root: string) =>
  page
    .locator(`${root} svg[viewBox="0 0 1440 240"] path`)
    .evaluateAll(paths => paths.map(p => getComputedStyle(p).fill));

test.describe('Cena no Hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('em dia o Hero é o de sempre: céu liso e as três ondas com as cores de hoje', async ({
    page
  }) => {
    const hero = page.locator('#inicio');

    expect(await waveFills(page, '#inicio')).toEqual(DAY_WAVES);

    // Com a amplitude de sempre, as ondas não são esticadas nem achatadas.
    const verticalScales = await page
      .locator('#inicio svg[viewBox="0 0 1440 240"] path')
      .evaluateAll(paths =>
        paths.map(p => new DOMMatrix(getComputedStyle(p).transform).d)
      );
    expect(verticalScales).toEqual([1, 1, 1]);

    // O céu pode ser um gradiente, mas em dia todas as paradas são o mesmo cinza liso.
    const skyImage = await hero.evaluate(el => getComputedStyle(el).backgroundImage);
    const skyColors = skyImage.match(/rgb\([^)]*\)/g) ?? [];
    expect(skyColors.length).toBeGreaterThan(0);
    expect(skyColors.every(color => color === DAY_SKY)).toBe(true);
  });

  test('o Hero informa o Modo da Cena e a fase do dia', async ({ page }) => {
    const hero = page.locator('#inicio');
    await expect(hero).toHaveAttribute('data-cena-modo', 'dia');
    await expect(hero).toHaveAttribute('data-cena-fase', 'dia');
  });
});

test.describe('Página de Links', () => {
  test('continua com as ondas de sempre', async ({ page }) => {
    await page.goto('/links');
    expect(await waveFills(page, 'body')).toEqual(DAY_WAVES);
  });
});
