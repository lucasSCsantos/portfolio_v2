import { test, expect, type Page } from '@playwright/test';
import type { SceneMode } from '../src/app/lib/scene';
import type { SceneWeather } from '../src/app/lib/scene-weather';

// As ondas do Hero pelo mar e pelo vento de Salvador, no `ao vivo`. A rota é sempre simulada e o relógio
// da página anda só quando o teste manda, para comparar dois mares no mesmo instante da animação.

const STORAGE_KEY = 'cena-modo';
const NOON = '2026-11-13T15:00:00Z';

const CALM: SceneWeather = {
  sunrise: '2026-11-13T05:30:00-03:00',
  sunset: '2026-11-13T17:30:00-03:00',
  cloudCover: 0,
  precipitation: 0,
  windSpeed: 2,
  waveHeight: 0.5,
  fetchedAt: NOON
};
const ROUGH: Partial<SceneWeather> = { windSpeed: 14, waveHeight: 2.8 };

const wavePaths = (page: Page) => page.locator('#inicio svg[viewBox="0 0 1440 240"] path');

// Altura na tela, posição do topo e deslocamento lateral de cada camada, de trás para a frente.
const measure = (page: Page) =>
  wavePaths(page).evaluateAll(paths =>
    paths.map(path => {
      const box = path.getBoundingClientRect();
      return { height: box.height, top: box.top, x: new DOMMatrix(getComputedStyle(path).transform).e };
    })
  );

// Abre a home num modo, com o relógio parado ao meio-dia, e deixa a animação correr `ms` de relógio da página.
async function openAt(page: Page, mode: SceneMode, weather: Partial<SceneWeather> | 'falha', ms = 4000) {
  await page.clock.install({ time: new Date(NOON) });
  await page.clock.pauseAt(new Date('2026-11-13T15:00:01Z'));
  await page.route('**/api/cena', route =>
    weather === 'falha'
      ? route.fulfill({ status: 502, json: { error: 'clima indisponível' } })
      : route.fulfill({ json: { ...CALM, ...weather } })
  );
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  const answered = mode === 'ao-vivo' ? page.waitForResponse('**/api/cena') : null;
  await page.goto('/');
  await answered;
  // O clima chega com o relógio parado: os dois mares partem do mesmo quadro.
  await page.waitForTimeout(500);
  await page.clock.runFor(ms);
  return measure(page);
}

// Mais um trecho de relógio da página, para ver o que se moveu.
async function measureLater(page: Page) {
  await page.clock.runFor(1500);
  return measure(page);
}

test.describe('ondas pelo mar e pelo vento', () => {
  test('com mar calmo e pouco vento, as ondas ficam perto das de sempre', async ({ page, browser }) => {
    const calm = await openAt(page, 'ao-vivo', {});
    const dayPage = await browser.newPage();
    const day = await openAt(dayPage, 'dia', 'falha');
    calm.forEach((layer, i) => expect(Math.abs(layer.height / day[i].height - 1)).toBeLessThan(0.05));
    await dayPage.close();
  });

  test('com ondas altas e vento forte, as ondas ficam mais altas e deslizam mais rápido que no mar calmo', async ({
    page,
    browser
  }) => {
    const calm = await openAt(page, 'ao-vivo', {});
    const roughPage = await browser.newPage();
    const rough = await openAt(roughPage, 'ao-vivo', ROUGH);
    rough.forEach((layer, i) => {
      expect(layer.height).toBeGreaterThan(calm[i].height);
      // No mesmo instante, a onda mais rápida já andou mais do começo do deslize (negativo) rumo a zero.
      expect(layer.x).toBeGreaterThan(calm[i].x);
    });
    await roughPage.close();
  });

  test('o mar agitado balança as ondas, e o calmo não', async ({ page, browser }) => {
    const calm = [await openAt(page, 'ao-vivo', {}, 3000), await measureLater(page)];
    const roughPage = await browser.newPage();
    const rough = [await openAt(roughPage, 'ao-vivo', ROUGH, 3000), await measureLater(roughPage)];
    calm[0].forEach((layer, i) => expect(calm[1][i].top).toBeCloseTo(layer.top, 0));
    expect(rough[0].some((layer, i) => Math.abs(rough[1][i].top - layer.top) > 2)).toBe(true);
    await roughPage.close();
  });

  test('sem a altura da onda, a Cena funciona e as ondas respondem só ao vento', async ({ page, browser }) => {
    const breeze = await openAt(page, 'ao-vivo', { waveHeight: null, windSpeed: 1 });
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'ao-vivo');
    const windyPage = await browser.newPage();
    const windy = await openAt(windyPage, 'ao-vivo', { waveHeight: null, windSpeed: 14 });
    windy.forEach((layer, i) => {
      expect(layer.height).toBeGreaterThan(breeze[i].height);
      expect(layer.x).toBeGreaterThan(breeze[i].x);
    });
    await windyPage.close();
  });
});

test.describe('ondas agitadas com movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('mesmo com mar agitado, as ondas não deslizam nem balançam', async ({ page }) => {
    const first = await openAt(page, 'ao-vivo', ROUGH);
    const later = await measureLater(page);
    expect(later).toEqual(first);
  });
});
