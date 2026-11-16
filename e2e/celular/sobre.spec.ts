import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import { fill } from '../../src/meta/dictionaries/types';
import profile from '../../src/meta/profile';
import { MIN_CONTRAST, worstContrast } from '../contrast';

// A Tela Sobre da Versão para celular: foto, bio, números de destaque e as etapas do método.

const STORAGE_KEY = 'cena-modo';

const about = (page: Page) => page.locator('[data-tela="sobre"]');
const steps = (page: Page, name = pt.content.about.methodLabel) =>
  about(page).getByRole('list', { name });

async function open(page: Page, path = '/', mode?: string) {
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route => route.fulfill({ status: 502, json: { error: 'clima indisponível' } }));
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
  await about(page).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(about(page).locator('#sobre')).toBeInViewport();
}

for (const dict of [pt, en]) {
  test(`${dict.locale}: bio, foto, números e etapas vêm do Dicionário`, async ({ page }) => {
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    const { about: copy, hero } = dict.content;
    await expect(about(page).getByRole('heading', { name: copy.label })).toBeVisible();
    await expect(about(page).getByText(copy.bio)).toBeVisible();
    await expect(about(page).getByRole('img', { name: fill(dict.ui.photoAlt, { name: profile.name }) })).toBeVisible();

    const stats = about(page).getByRole('list', { name: dict.ui.stats }).getByRole('listitem');
    await expect(stats).toHaveCount(hero.highlights.length);
    for (let i = 0; i < hero.highlights.length; i++) {
      await expect(stats.nth(i)).toContainText(hero.highlights[i].value);
      await expect(stats.nth(i)).toContainText(hero.highlights[i].label);
    }

    const items = steps(page, copy.methodLabel).getByRole('listitem');
    await expect(items).toHaveCount(copy.method.length);
    for (let i = 0; i < copy.method.length; i++) await expect(items.nth(i)).toContainText(copy.method[i]);
  });
}

test('os números ficam numa grade de duas colunas', async ({ page }) => {
  await open(page);
  const boxes = await about(page)
    .getByRole('list', { name: pt.ui.stats })
    .getByRole('listitem')
    .evaluateAll(els => els.map(el => el.getBoundingClientRect()).map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) })));
  expect(boxes).toHaveLength(4);
  expect(boxes[0].y).toBe(boxes[1].y);
  expect(boxes[2].y).toBe(boxes[3].y);
  expect(boxes[2].y).toBeGreaterThan(boxes[0].y);
  expect(boxes[0].x).toBe(boxes[2].x);
  expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
});

test('a faixa de etapas desliza para o lado sem rolar a página', async ({ page }) => {
  await open(page);
  const strip = steps(page);
  const { scrollWidth, clientWidth } = await strip.evaluate(el => ({ scrollWidth: el.scrollWidth, clientWidth: el.clientWidth }));
  // Em telas estreitas as etapas não cabem: a faixa rola por dentro.
  if (scrollWidth > clientWidth) {
    await strip.evaluate(el => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
    await expect(steps(page).getByRole('listitem').last()).toBeInViewport({ ratio: 1 });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  // Uma faixa que rola tem de ser alcançável pelo teclado.
  expect(await strip.getAttribute('tabindex')).toBe('0');
});

test('texto corrido de 16px ou mais, e nada abaixo de 14px', async ({ page }) => {
  await open(page);
  const px = (selector: string) =>
    about(page).locator(selector).evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  for (const size of [...(await px('p')), ...(await px('ol li'))]) expect(size).toBeGreaterThanOrEqual(16);
  for (const size of await px('h2, h3, strong, span, li')) expect(size).toBeGreaterThanOrEqual(14);
});

test('toques de 44px ou mais', async ({ page }) => {
  await open(page);
  for (const target of await about(page).locator('a, button').all()) {
    const box = (await target.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe('contraste sobre o Mar', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(mode, async ({ page }) => {
      // Uma captura por texto.
      test.setTimeout(120_000);
      await open(page, '/', mode);
      // Espera a entrada terminar: a medida é do texto já formado.
      await page.waitForTimeout(1200);
      const texts = about(page).locator('h2, h3, p, strong, ul li span, ol li');
      for (const text of await texts.all()) {
        // As etapas fora da tela estão mais adiante na faixa.
        await text.evaluate(el => el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' }));
        const label = (await text.textContent())!.slice(0, 30);
        expect(await worstContrast(page, text), label).toBeGreaterThanOrEqual(MIN_CONTRAST);
      }
    });
  }
});

test('em 320px e em paisagem, nada quebra', async ({ page }) => {
  for (const viewport of [{ width: 320, height: 640 }, { width: 800, height: 380 }]) {
    await page.setViewportSize(viewport);
    await open(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${viewport.width}px`).toBeLessThanOrEqual(0);
    // Nenhum texto sai da Tela pela direita.
    const right = await about(page)
      .locator('h2, h3, p, strong, ul li')
      .evaluateAll(els => Math.max(...els.map(el => el.getBoundingClientRect().right)));
    expect(right, `${viewport.width}px`).toBeLessThanOrEqual(viewport.width);
  }
});
