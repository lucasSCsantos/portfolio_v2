import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import skillGroups from '../../src/meta/skills';
import { MIN_CONTRAST, worstContrast } from '../contrast';

// A Tela de Habilidades da Versão para celular: as tecnologias numa grade de ícones com nome e as
// competências em lista, com a animação Lottie junto ao título e corais no pé.

const STORAGE_KEY = 'cena-modo';
// Todas, inclusive as que no desktop só aparecem no revezamento.
const SKILLS = skillGroups.flatMap(group => group.skills.map(({ name }) => name));

const skills = (page: Page) => page.locator('[data-tela="habilidades"]');
const grid = (page: Page, name = pt.content.work.title) => skills(page).getByRole('list', { name });

async function open(page: Page, path = '/', mode?: string) {
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route => route.fulfill({ status: 502, json: { error: 'clima indisponível' } }));
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
  await skills(page).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(skills(page).locator('#habilidades')).toBeInViewport();
}

for (const dict of [pt, en]) {
  test(`${dict.locale}: todas as habilidades e competências`, async ({ page }) => {
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    const copy = dict.content.work;
    await expect(skills(page).getByRole('heading', { name: copy.label })).toBeVisible();
    await expect(skills(page).getByText(copy.description)).toBeVisible();

    const items = grid(page, copy.title).getByRole('listitem');
    await expect(items).toHaveCount(SKILLS.length);
    for (let i = 0; i < SKILLS.length; i++) {
      await expect(items.nth(i)).toHaveText(SKILLS[i]);
      // O ícone é desenho: o nome já diz o que é.
      await expect(items.nth(i).locator('svg')).toHaveAttribute('aria-hidden', 'true');
    }

    const competencies = skills(page).getByRole('list', { name: copy.competenciesLabel }).getByRole('listitem');
    await expect(competencies).toHaveCount(copy.competencies.length);
    for (let i = 0; i < copy.competencies.length; i++) {
      await expect(competencies.nth(i)).toContainText(copy.competencies[i].title);
      await expect(competencies.nth(i)).toContainText(copy.competencies[i].text);
    }
  });
}

test('a grade cabe na tela, com ao menos três colunas e nomes inteiros', async ({ page }) => {
  await open(page);
  const { width } = page.viewportSize()!;
  const boxes = await grid(page)
    .getByRole('listitem')
    .evaluateAll(els => els.map(el => el.getBoundingClientRect()).map(({ left, right, top }) => ({ left, right, top: Math.round(top) })));
  for (const box of boxes) {
    expect(box.left).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(width);
  }
  expect(boxes.filter(box => box.top === boxes[0].top).length).toBeGreaterThanOrEqual(3);
  // Nenhum nome é cortado nem quebrado no meio da palavra.
  const clipped = await grid(page)
    .getByRole('listitem')
    .evaluateAll(els => els.filter(el => el.scrollWidth > el.clientWidth).map(el => el.textContent));
  expect(clipped).toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('texto corrido de 16px ou mais; nomes sob os ícones de 14px ou mais', async ({ page }) => {
  await open(page);
  const px = (selector: string) =>
    skills(page).locator(selector).evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  const competencies = await skills(page)
    .getByRole('list', { name: pt.content.work.competenciesLabel })
    .locator('li *')
    .evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  expect(competencies.length).toBeGreaterThan(0);
  for (const size of [...(await px('p')), ...competencies]) expect(size).toBeGreaterThanOrEqual(16);
  for (const size of await px('h2, h3, li')) expect(size).toBeGreaterThanOrEqual(14);
});

test('toques de 44px ou mais', async ({ page }) => {
  await open(page);
  for (const target of await skills(page).locator('a, button').all()) {
    const box = (await target.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe('contraste sobre o Mar', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(mode, async ({ page }) => {
      // Uma captura por texto, e a grade tem um nome por habilidade.
      test.setTimeout(90_000);
      await open(page, '/', mode);
      // Espera a entrada terminar: a medida é do texto já formado.
      await page.waitForTimeout(1200);
      const texts = skills(page).locator('h2, h3, p, li > strong, li > span');
      for (const text of await texts.all()) {
        const label = (await text.textContent())!.slice(0, 30);
        // A Tela é mais alta que o celular: a captura só pega o que está à vista.
        await text.scrollIntoViewIfNeeded();
        expect(await worstContrast(page, text), label).toBeGreaterThanOrEqual(MIN_CONTRAST);
      }
    });
  }
});

// Quadro do desenho num instante: o que muda de um para outro é a animação andando.
const frame = (page: Page, selector: string) =>
  skills(page).locator(selector).evaluate(el => el.innerHTML + getComputedStyle(el.querySelector('svg')!).transform);

test.describe('animações', () => {
  test('a Lottie fica pequena junto ao título e os corais no pé da Tela, em movimento', async ({ page }) => {
    await open(page);
    const lottie = skills(page).locator('[data-lottie] svg');
    await expect(lottie).toBeVisible();
    const title = (await skills(page).getByRole('heading', { name: pt.content.work.label }).boundingBox())!;
    const art = (await lottie.boundingBox())!;
    expect(art.width).toBeLessThanOrEqual(96);
    // Na mesma faixa do título.
    expect(art.y).toBeLessThan(title.y + title.height);
    expect(art.y + art.height).toBeGreaterThan(title.y);

    const reef = skills(page).locator('[data-corais]');
    await expect(reef).toBeVisible();
    const screen = (await skills(page).boundingBox())!;
    const foot = (await reef.boundingBox())!;
    expect(Math.abs(screen.y + screen.height - (foot.y + foot.height))).toBeLessThanOrEqual(1);
    const competencies = (await skills(page).getByRole('list', { name: pt.content.work.competenciesLabel }).boundingBox())!;
    expect(foot.y).toBeGreaterThanOrEqual(competencies.y + competencies.height);

    const before = await frame(page, '[data-lottie]');
    await page.waitForTimeout(400);
    expect(await frame(page, '[data-lottie]')).not.toBe(before);
    const sway = await reef.locator('svg').evaluateAll(els => els.map(el => getComputedStyle(el).animationName));
    expect(sway.some(name => name !== 'none')).toBe(true);
  });

  test('com movimento reduzido, tudo fica parado', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(skills(page).locator('[data-lottie] svg')).toBeVisible();
    const before = await frame(page, '[data-lottie]');
    await page.waitForTimeout(400);
    expect(await frame(page, '[data-lottie]')).toBe(before);
    const sway = await skills(page)
      .locator('[data-corais] svg')
      .evaluateAll(els => els.map(el => getComputedStyle(el).animationName));
    expect(sway.length).toBeGreaterThan(0);
    for (const name of sway) expect(name).toBe('none');
  });
});

test('em 320px e em paisagem, nada quebra', async ({ page }) => {
  for (const viewport of [{ width: 320, height: 640 }, { width: 800, height: 380 }]) {
    await page.setViewportSize(viewport);
    await open(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${viewport.width}px`).toBeLessThanOrEqual(0);
    const right = await skills(page)
      .locator('h2, h3, p, li')
      .evaluateAll(els => Math.max(...els.map(el => el.getBoundingClientRect().right)));
    expect(right, `${viewport.width}px`).toBeLessThanOrEqual(viewport.width);
  }
});
