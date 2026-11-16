import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import { SEA_LIFE, ZONES } from '../../src/app/components/Sea/life';

// A casca da Versão para celular: uma Tela por seção, o mergulho no Mar, os pontos da lateral e as bolhas.

const STORAGE_KEY = 'cena-modo';
const SCREENS = ['inicio', 'sobre', 'projetos', 'experiencias', 'servicos', 'habilidades', 'contato'];
const LABELS = [pt.ui.home, ...pt.navLinks.map(({ text }) => text)];

const screen = (page: Page, id: string) => page.locator(`[data-tela="${id}"]`);
const dots = (page: Page, name = pt.ui.screens) => page.getByRole('navigation', { name });

async function open(page: Page, path = '/', mode?: string) {
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route => route.fulfill({ status: 502, json: { error: 'clima indisponível' } }));
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
}

const topOf = (page: Page, id: string) =>
  screen(page, id).evaluate(el => Math.round(el.getBoundingClientRect().top) || 0);

test('as duas home chegam na Versão para celular', async ({ page }) => {
  for (const path of ['/', '/en']) {
    await page.goto(path);
    await expect(page.locator('[data-versao]')).toHaveAttribute('data-versao', 'celular');
  }
});

test('cada seção é uma Tela, na ordem da página, com o id do desktop e ao menos uma tela de altura', async ({ page }) => {
  await open(page);
  const telas = page.locator('[data-tela]');
  await expect(telas).toHaveCount(SCREENS.length);
  expect(await telas.evaluateAll(els => els.map(el => (el as HTMLElement).dataset.tela))).toEqual(SCREENS);
  const viewport = page.viewportSize()!.height;
  for (const id of SCREENS) {
    await expect(screen(page, id).locator(`#${id}`)).toHaveCount(1);
    const height = await screen(page, id).evaluate(el => el.getBoundingClientRect().height);
    expect(height, id).toBeGreaterThanOrEqual(viewport - 1);
  }
});

test('as Telas encaixam por proximidade', async ({ page }) => {
  await open(page);
  // `proximity` é o padrão: o valor computado o omite.
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toMatch(/^y( proximity)?$/);
  for (const id of SCREENS) {
    expect(await screen(page, id).evaluate(el => getComputedStyle(el).scrollSnapAlign), id).toBe('start');
  }
});

test('uma âncora leva à Tela certa', async ({ page }) => {
  await open(page, '/#experiencias');
  await expect.poll(() => topOf(page, 'experiencias')).toBe(0);
});

test.describe('pontos da lateral', () => {
  test('um por Tela, com o nome da seção e área de toque de 44px', async ({ page }) => {
    await open(page);
    const links = dots(page).getByRole('link');
    await expect(links).toHaveCount(SCREENS.length);
    for (let i = 0; i < SCREENS.length; i++) {
      const label = LABELS[i];
      const dot = dots(page).getByRole('link', { name: label, exact: true });
      await expect(dot).toHaveAttribute('href', `#${SCREENS[i]}`);
      const box = (await dot.boundingBox())!;
      expect(box.width, label).toBeGreaterThanOrEqual(44);
      expect(box.height, label).toBeGreaterThanOrEqual(44);
    }
    await expect(dots(page).getByRole('link', { name: pt.ui.home })).toHaveAttribute('aria-current', 'true');
  });

  test('o toque leva à Tela, marca o ponto e mostra o nome por um instante', async ({ page }) => {
    await open(page);
    const dot = dots(page).getByRole('link', { name: pt.navLinks[2].text });
    await dot.tap();
    await expect.poll(() => topOf(page, 'experiencias'), { timeout: 5000 }).toBe(0);
    await expect(dot).toHaveAttribute('aria-current', 'true');
    await expect(dots(page).locator('[aria-current="true"]')).toHaveCount(1);
    const name = dot.getByText(pt.navLinks[2].text);
    await expect(name).toBeVisible();
    await expect(name).toBeHidden({ timeout: 3000 });
  });

  test('em inglês, os nomes vêm do Dicionário inglês', async ({ page }) => {
    await open(page, '/en');
    await expect(dots(page, en.ui.screens).getByRole('link', { name: en.ui.home, exact: true })).toBeVisible();
    for (const { text } of en.navLinks) {
      await expect(dots(page, en.ui.screens).getByRole('link', { name: text, exact: true })).toHaveCount(1);
    }
  });
});

// O seletor de Idioma do Hero leva ao Hero do outro Idioma (ver hero.spec.ts); o da Tela de Contato
// (ticket 09) levará à mesma Tela, por âncora, como aqui.
test('o outro Idioma com âncora chega na mesma Tela', async ({ page }) => {
  await open(page, '/en#projetos');
  await expect(page.locator('[data-versao]')).toHaveAttribute('data-versao', 'celular');
  await expect.poll(() => topOf(page, 'projetos')).toBe(0);
});

// A cor de baixo do degradê de cada Tela do Mar.
const deepestColors = (page: Page) =>
  page.locator('[data-tela]:not([data-tela="inicio"])').evaluateAll(els =>
    els.map(el => {
      const colors = getComputedStyle(el).backgroundImage.match(/rgba?\([^)]+\)/g) ?? [];
      return colors[colors.length - 1];
    })
  );
const lum = (css: string) => {
  const [r, g, b] = (css.match(/[\d.]+/g) ?? []).map(Number);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

test.describe('o mergulho', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(`${mode}: o fundo das Telas escurece do raso ao fundo`, async ({ page }) => {
      await open(page, '/', mode);
      const colors = await deepestColors(page);
      expect(colors).toHaveLength(SCREENS.length - 1);
      const lums = colors.map(lum);
      lums.slice(1).forEach((value, i) => expect(value).toBeLessThanOrEqual(lums[i]));
      expect(lums[lums.length - 1]).toBeLessThan(lums[0]);
    });
  }

  test('o Mar acompanha a Cena', async ({ page }) => {
    await open(page, '/', 'dia');
    const day = await deepestColors(page);
    await page.getByRole('radio', { name: pt.ui.sceneModes.noite }).first().evaluate(el => (el as HTMLElement).click());
    await expect.poll(() => deepestColors(page)).not.toEqual(day);
    const night = await deepestColors(page);
    expect(lum(night[0])).toBeLessThan(lum(day[0]));
  });
});

test.describe('bolhas', () => {
  const bubbles = (page: Page) => page.locator('[data-bolhas] > *');

  test('sobem ao fundo durante o mergulho', async ({ page }) => {
    await open(page);
    await expect(bubbles(page).first()).toBeAttached();
    const first = bubbles(page).first();
    const before = await first.evaluate(el => el.getBoundingClientRect().top);
    await page.waitForTimeout(800);
    expect(await first.evaluate(el => el.getBoundingClientRect().top)).not.toBe(before);
    // Atrás do conteúdo: não capturam o toque.
    expect(await first.evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
  });

  test('param com movimento reduzido', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(bubbles(page)).toHaveCount(0);
  });
});

test.describe('vida marinha', () => {
  const animals = (page: Page) => page.locator('[data-vida-marinha] > *');
  // As zonas dos animais à vista (os fora da tela ficam sem `display`).
  const zonesInView = (page: Page) =>
    animals(page).evaluateAll(els =>
      els.filter(el => getComputedStyle(el).display !== 'none').map(el => (el as HTMLElement).dataset.zona)
    );

  test('o celular fica sem os animais extras, e nenhum nada sobre o Hero', async ({ page }) => {
    await open(page);
    await expect(animals(page)).toHaveCount(SEA_LIFE.filter(({ extra }) => !extra).length);
    await page.waitForTimeout(300);
    expect(await zonesInView(page)).toEqual([]);
  });

  test('do raso ao fundo, passam animais de todas as zonas, atrás do conteúdo', async ({ page }) => {
    await open(page);
    const seen = new Set<string | undefined>();
    const end = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    for (let step = 0; step <= 30; step++) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), (end * step) / 30);
      await page.waitForTimeout(100);
      (await zonesInView(page)).forEach(zone => seen.add(zone));
    }
    expect(Array.from(seen).sort()).toEqual(ZONES.map(({ name }) => name).sort());
    expect(await animals(page).first().evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
  });

  test('somem com movimento reduzido', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(animals(page)).toHaveCount(0);
  });
});

test('nada rola para o lado', async ({ page }) => {
  await open(page);
  for (const id of SCREENS) {
    await screen(page, id).scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, id).toBeLessThanOrEqual(0);
  }
});

test('o link de pular para o conteúdo continua funcionando', async ({ page }) => {
  await open(page);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: pt.ui.skipLink });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#conteudo')).toBeFocused();
});
