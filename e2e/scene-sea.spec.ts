import { test, expect, type Locator, type Page } from '@playwright/test';
import { MIN_CONTRAST, worstContrast } from './contrast';
import pt from '../src/meta/dictionaries/pt';

// O Header, o Mar e os textos que ficam direto sobre ele acompanham a Cena.

const DAY_FRONT_WAVE = [121, 190, 217];

async function openHero(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(3500);
}

async function chooseNight(page: Page) {
  await page
    .getByRole('radiogroup', { name: pt.ui.sceneSwitch })
    .getByRole('radio', { name: pt.ui.sceneModes.noite })
    .click();
  await page.waitForTimeout(500);
}

const rgbOf = (css: string) => (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const distance = (a: number[], b: number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const frontWave = async (page: Page) =>
  rgbOf(
    await page
      .locator('#inicio svg[viewBox="0 0 1440 240"] path')
      .last()
      .evaluate(p => getComputedStyle(p).fill)
  );

// Cor mediana de uma faixa horizontal da tela (bolhas e brilhos pontuais não pesam).
async function bandColor(page: Page, y: number, height: number) {
  const width = page.viewportSize()!.width;
  const shot = await page.screenshot({
    clip: { x: width * 0.3, y, width: width * 0.4, height }
  });
  return page.evaluate(async (b64: string) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const channels: number[][] = [[], [], []];
    for (let i = 0; i < d.length; i += 4) for (let k = 0; k < 3; k++) channels[k].push(d[i + k]);
    return channels.map(values => values.sort((a, b) => a - b)[values.length >> 1]);
  }, shot.toString('base64'));
}

// Rola até o fim do Hero ficar no meio da tela e lê a cor logo acima e logo abaixo da emenda.
async function seam(page: Page) {
  const middle = page.viewportSize()!.height / 2;
  await page.evaluate(m => {
    const hero = document.getElementById('inicio')!;
    const bottom = hero.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: bottom - m, behavior: 'instant' });
  }, middle);
  await page.waitForTimeout(800);
  const bottom = await page
    .locator('#inicio')
    .evaluate(el => el.getBoundingClientRect().bottom);
  return {
    hero: await bandColor(page, bottom - 6, 4),
    sea: await bandColor(page, bottom + 2, 4)
  };
}

async function centered(page: Page, target: Locator) {
  await target.evaluate(el => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(1500); // entrada na água e flutuação
}

// Elementos que não acompanham a Cena: cartões, o card de estatísticas e os botões.
const UNCHANGED = [
  '#inicio [aria-label] li',
  '#sobre #social-buttons a',
  '#sobre ol li',
  '#projetos .swiper-slide-active p',
  '#experiencias li p',
  '#servicos p'
];

const styleOf = (page: Page) =>
  page.evaluate(
    selectors =>
      selectors.map(selector => {
        const el = document.querySelector(selector);
        if (!el) return [selector, null];
        const { color, backgroundColor } = getComputedStyle(el);
        return [selector, { color, backgroundColor }];
      }),
    UNCHANGED
  );

test.describe('Header sobre a Cena', () => {
  test('em noite o Header é legível sobre o Hero escuro e continua legível no Mar', async ({
    page
  }) => {
    await openHero(page);
    await chooseNight(page);
    const brand = page.locator('header a[href="#inicio"] > span');
    const navLink = page.locator('header nav a p').first();

    expect(await worstContrast(page, brand)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    expect(await worstContrast(page, navLink)).toBeGreaterThanOrEqual(MIN_CONTRAST);

    await page.locator('#sobre').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(await worstContrast(page, brand)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    expect(await worstContrast(page, navLink)).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });

  test('em dia o Header sobre o Hero segue escuro, como sempre', async ({ page }) => {
    await openHero(page);
    const color = await page
      .locator('header nav a p')
      .first()
      .evaluate(el => getComputedStyle(el).color);
    expect(color).toBe('rgb(0, 0, 0)');
  });

  test('com noite salva, o Header já é claro antes da hidratação', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('cena-modo', 'noite'));
    await page.route('**/_next/static/**/*.js', route => route.abort());
    await page.goto('/');
    const brand = page.locator('header a[href="#inicio"] > span');
    expect(await worstContrast(page, brand)).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });

  test('o menu móvel aberto sobre o Mar mantém o texto escuro no fundo claro', async ({
    page
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHero(page);
    await page.locator('#sobre').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: pt.ui.openMenu }).click();
    await page.waitForTimeout(400);
    const link = page.locator('#mobile-navigation a p').first();
    expect(await worstContrast(page, link)).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });
});

test.describe('emenda entre o Hero e o Mar', () => {
  test('em dia o Mar começa no azul claro de sempre, sem emenda', async ({ page }) => {
    await openHero(page);
    const { hero, sea } = await seam(page);
    expect(distance(hero, DAY_FRONT_WAVE)).toBeLessThan(20);
    expect(distance(sea, hero)).toBeLessThan(30);
  });

  test('em noite o Mar começa na cor da onda da frente, sem emenda', async ({ page }) => {
    await openHero(page);
    await chooseNight(page);
    const front = await frontWave(page);
    const { hero, sea } = await seam(page);
    expect(distance(hero, front)).toBeLessThan(20);
    expect(distance(sea, hero)).toBeLessThan(30);
  });

  test('o brilho do topo do Sobre segue a cor do topo do Mar', async ({ page }) => {
    await openHero(page);
    const glow = () =>
      page.locator('#sobre').evaluate(el => getComputedStyle(el, '::after').boxShadow);
    expect(await glow()).toContain('rgb(121, 190, 217)');

    await chooseNight(page);
    const front = await frontWave(page);
    expect(await glow()).toContain(`rgb(${front.join(', ')})`);
  });
});

test.describe('textos sobre o Mar em noite', () => {
  test.beforeEach(async ({ page }) => {
    await openHero(page);
    await chooseNight(page);
  });

  for (const [name, selector] of [
    ['rótulo do Sobre', '#sobre h3'],
    ['nome no Sobre', '#sobre h2'],
    ['bio do Sobre', '#left-about-area > p'],
    ['título de Projetos', '#projetos h2']
  ]) {
    test(`passa no contraste: ${name}`, async ({ page }) => {
      const target = page.locator(selector).first();
      await centered(page, target);
      expect(await worstContrast(page, target)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
  }
});

test('cartões, o card de estatísticas e os botões não mudam com a noite', async ({
  page
}) => {
  await openHero(page);
  for (const selector of UNCHANGED) await expect(page.locator(selector).first()).toBeAttached();
  const day = await styleOf(page);
  await chooseNight(page);
  await page.waitForTimeout(800);
  expect(await styleOf(page)).toEqual(day);
});
