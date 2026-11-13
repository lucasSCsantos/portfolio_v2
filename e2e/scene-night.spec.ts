import { test, expect, type Page } from '@playwright/test';
import { MIN_CONTRAST, worstContrast } from './contrast';
import pt from '../src/meta/dictionaries/pt';
import en from '../src/meta/dictionaries/en';

const STORAGE_KEY = 'cena-modo';
const DAY_WAVES = ['rgb(20, 98, 166)', 'rgb(57, 140, 191)', 'rgb(121, 190, 217)'];

// Espera as entradas animadas do Hero terminarem.
async function openHero(page: Page, path = '/') {
  await page.goto(path);
  await page.waitForTimeout(3500);
}

const rgbOf = (css: string) => (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const brightness = ([r, g, b]: number[]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const waveFills = (page: Page) =>
  page
    .locator('#inicio svg[viewBox="0 0 1440 240"] path')
    .evaluateAll(paths => paths.map(p => getComputedStyle(p).fill));

const skyColors = async (page: Page) => {
  const image = await page
    .locator('#inicio')
    .evaluate(el => getComputedStyle(el).backgroundImage);
  return image.match(/rgb\([^)]*\)/g) ?? [];
};

const storedMode = (page: Page) =>
  page.evaluate(key => localStorage.getItem(key), STORAGE_KEY);

const sceneSwitch = (page: Page, name = pt.ui.sceneSwitch) =>
  page.getByRole('radiogroup', { name });

test.describe('seletor do Modo da Cena', () => {
  test('a primeira visita é em dia e nada é guardado até o visitante escolher', async ({
    page
  }) => {
    await openHero(page);
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'dia');
    expect(await storedMode(page)).toBeNull();
    expect(await waveFills(page)).toEqual(DAY_WAVES);

    const group = sceneSwitch(page);
    await expect(group.getByRole('radio')).toHaveCount(2);
    await expect(group.getByRole('radio', { name: pt.ui.sceneModes.dia })).toBeChecked();
    await expect(group.getByRole('radio', { name: pt.ui.sceneModes.noite })).not.toBeChecked();
  });

  test('funciona só pelo teclado: setas movem a escolha, Enter e Espaço escolhem', async ({
    page
  }) => {
    await openHero(page);
    const day = sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes.dia });
    const night = sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes.noite });
    const hero = page.locator('#inicio');

    await day.focus();
    await page.keyboard.press('ArrowRight');
    await expect(night).toBeChecked();
    await expect(night).toBeFocused();
    await expect(hero).toHaveAttribute('data-cena-modo', 'noite');

    await page.keyboard.press('ArrowLeft');
    await expect(day).toBeChecked();
    await expect(hero).toHaveAttribute('data-cena-modo', 'dia');

    // Só a opção escolhida entra na ordem de tabulação; as outras se alcançam pelas setas.
    await expect(night).toHaveAttribute('tabindex', '-1');
    await night.focus();
    await page.keyboard.press('Enter');
    await expect(night).toBeChecked();

    await day.focus();
    await page.keyboard.press('Space');
    await expect(day).toBeChecked();
  });

  test('no inglês o grupo e as opções têm nome no idioma da página', async ({ page }) => {
    await openHero(page, '/en');
    const group = sceneSwitch(page, en.ui.sceneSwitch);
    await expect(group.getByRole('radio', { name: en.ui.sceneModes.dia })).toBeChecked();
    await expect(group.getByRole('radio', { name: en.ui.sceneModes.noite })).toBeVisible();
  });

  test('no celular o seletor fica dentro do menu móvel', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHero(page);

    await page.getByRole('button', { name: pt.ui.openMenu }).click();

    const menu = page.locator('#mobile-navigation');
    await expect(menu.getByRole('radiogroup', { name: pt.ui.sceneSwitch })).toBeVisible();
    // O seletor do cabeçalho largo não aparece no celular: só o do menu.
    await expect(page.locator('header').getByRole('radiogroup')).toHaveCount(1);
    await menu.getByRole('radio', { name: pt.ui.sceneModes.noite }).click();
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'noite');
  });

  test('no desktop o seletor fica no cabeçalho, ao lado do Idioma', async ({ page }) => {
    await openHero(page);
    const header = page.locator('header');
    await expect(header.getByRole('radiogroup', { name: pt.ui.sceneSwitch })).toBeVisible();
    await expect(header.getByRole('group', { name: pt.ui.languageSwitch })).toBeVisible();
  });
});

test.describe('Hero em noite', () => {
  test.beforeEach(async ({ page }) => {
    await openHero(page);
    await sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes.noite }).click();
    // Espera o crossfade de cerca de 600 ms terminar.
    await page.waitForTimeout(800);
  });

  test('o Hero informa o modo e a fase da noite', async ({ page }) => {
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'noite');
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-fase', 'noite');
  });

  test('o céu é um gradiente escuro, mais escuro no topo', async ({ page }) => {
    const colors = (await skyColors(page)).map(rgbOf);
    expect(colors).toHaveLength(3);
    expect(colors.every(color => brightness(color) < 60)).toBe(true);
    expect(brightness(colors[0])).toBeLessThan(brightness(colors[2]));
  });

  test('as ondas são escuras e mais altas que as de dia', async ({ page }) => {
    const fills = (await waveFills(page)).map(rgbOf);
    fills.forEach((fill, i) =>
      expect(brightness(fill)).toBeLessThan(brightness(rgbOf(DAY_WAVES[i])))
    );
    const scales = await page
      .locator('#inicio svg[viewBox="0 0 1440 240"] path')
      .evaluateAll(paths =>
        paths.map(p => new DOMMatrix(getComputedStyle(p).transform).d)
      );
    scales.forEach(scale => expect(scale).toBeGreaterThan(1));
  });

  test('há estrelas e lua, e os leitores de tela as ignoram', async ({ page }) => {
    const stars = page.locator('#inicio [data-cena-camada="estrelas"]');
    const moon = page.locator('#inicio [data-cena-camada="lua"]');
    await expect(stars).toBeVisible();
    await expect(moon).toBeVisible();
    await expect(stars).toHaveAttribute('aria-hidden', 'true');
    await expect(moon).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('#inicio svg[viewBox="0 0 1440 240"]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    expect(await stars.locator('span').count()).toBeGreaterThan(20);
  });

  test('a saudação e o título passam no contraste sobre o céu escuro', async ({ page }) => {
    const greeting = page.locator('#greeting-text');
    expect(await worstContrast(page, greeting)).toBeGreaterThanOrEqual(MIN_CONTRAST);

    const title = page.getByRole('heading', { level: 1 });
    // O título é um gradiente recortado no texto: mede-se o texto contra o céu, sem o gradiente.
    await title.evaluate(el => el.style.setProperty('background-image', 'none', 'important'));
    expect(await worstContrast(page, title)).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });

  test('voltar para dia devolve o Hero de sempre', async ({ page }) => {
    await sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes.dia }).click();
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'dia');
    await expect.poll(() => waveFills(page)).toEqual(DAY_WAVES);
    await expect(page.locator('#inicio [data-cena-camada="estrelas"]')).toHaveCount(0);
  });
});

test.describe('persistência', () => {
  test('a escolha sobrevive ao recarregamento e à troca PT ↔ EN', async ({ page }) => {
    await openHero(page);
    await sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes.noite }).click();
    expect(await storedMode(page)).toBe('noite');

    await page.reload();
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'noite');

    await page.getByRole('link', { name: 'English' }).first().click();
    await page.waitForURL('**/en**');
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'noite');
    await expect(
      sceneSwitch(page, en.ui.sceneSwitch).getByRole('radio', { name: en.ui.sceneModes.noite })
    ).toBeChecked();

    await page.getByRole('link', { name: 'Português' }).first().click();
    await page.waitForURL(url => !url.pathname.startsWith('/en'));
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'noite');
  });

  test('com noite salva, a primeira pintura já é escura (sem quadro claro antes)', async ({
    page
  }) => {
    await page.addInitScript(key => localStorage.setItem(key, 'noite'), STORAGE_KEY);
    // Sem o JavaScript da aplicação, a página fica no que foi pintado antes da hidratação.
    await page.route('**/_next/static/**/*.js', route => route.abort());
    await page.goto('/');

    await expect(page.locator('#inicio')).not.toHaveAttribute('data-cena-pronta', '');
    const colors = (await skyColors(page)).map(rgbOf);
    expect(colors.length).toBeGreaterThan(0);
    expect(colors.every(color => brightness(color) < 60)).toBe(true);
    (await waveFills(page)).map(rgbOf).forEach((fill, i) =>
      expect(brightness(fill)).toBeLessThan(brightness(rgbOf(DAY_WAVES[i])))
    );
    const textColor = await page
      .locator('#greeting-text')
      .evaluate(el => getComputedStyle(el).color);
    expect(brightness(rgbOf(textColor))).toBeGreaterThan(200);
  });

  test('sem escolha, o HTML antes da hidratação segue em dia', async ({ page }) => {
    await page.route('**/_next/static/**/*.js', route => route.abort());
    await page.goto('/');
    expect(await waveFills(page)).toEqual(DAY_WAVES);
  });
});

test.describe('sem chamadas de clima', () => {
  test('nem dia nem noite fazem chamada à rota de clima', async ({ page }) => {
    const calls: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/cena')) calls.push(request.url());
    });
    await openHero(page);
    await sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes.noite }).click();
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(1000);
    expect(calls).toEqual([]);
  });
});
