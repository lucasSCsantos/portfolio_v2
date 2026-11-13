import { test, expect, type Page } from '@playwright/test';
import { MIN_CONTRAST, worstContrast } from './contrast';
import pt from '../src/meta/dictionaries/pt';
import en from '../src/meta/dictionaries/en';
import type { SceneWeather } from '../src/app/lib/scene-weather';

// O clima de Salvador por cima do céu do `ao vivo`. A rota é sempre simulada: o navegador só conhece o contrato.

const STORAGE_KEY = 'cena-modo';

// Instantes em UTC; Salvador é UTC-3 o ano todo.
const NOON = '2026-11-13T15:00:00Z';
const NIGHT = '2026-11-14T03:00:00Z';

const CLEAR: SceneWeather = {
  sunrise: '2026-11-13T05:30:00-03:00',
  sunset: '2026-11-13T17:30:00-03:00',
  cloudCover: 0,
  precipitation: 0,
  windSpeed: 2,
  waveHeight: 0.5,
  fetchedAt: '2026-11-13T15:00:00.000Z'
};

const hero = (page: Page) => page.locator('#inicio');
const layer = (page: Page, name: 'nuvens' | 'chuva' | 'estrelas') =>
  page.locator(`#inicio [data-cena-camada="${name}"]`);
const sceneSwitch = (page: Page) => page.getByRole('radiogroup', { name: pt.ui.sceneSwitch });

// A rota de clima responde o que o teste pedir e conta as chamadas.
async function fakeWeather(page: Page, weather: Partial<SceneWeather> | 'falha') {
  const calls: string[] = [];
  await page.route('**/api/cena', route => {
    calls.push(route.request().url());
    return weather === 'falha'
      ? route.fulfill({ status: 502, json: { error: 'clima indisponível' } })
      : route.fulfill({ json: { ...CLEAR, ...weather } });
  });
  return calls;
}

// Abre a home já em `ao vivo` e espera as entradas animadas do Hero e o clima entrar.
async function openLive(page: Page, path = '/') {
  await page.addInitScript(key => localStorage.setItem(key, 'ao-vivo'), STORAGE_KEY);
  await page.goto(path);
  await page.waitForTimeout(3500);
}

async function liveAt(page: Page, at: string, weather: Partial<SceneWeather> | 'falha') {
  await page.clock.setFixedTime(new Date(at));
  const calls = await fakeWeather(page, weather);
  await openLive(page);
  return calls;
}

// Recarrega a página com outro clima na rota.
async function swapWeather(page: Page, weather: Partial<SceneWeather>) {
  await page.unrouteAll();
  await fakeWeather(page, weather);
  await page.reload();
  await page.waitForTimeout(3500);
}

const skyColors = (page: Page) =>
  hero(page).evaluate(el =>
    ['--sky-top', '--sky-middle', '--sky-bottom'].map(name => el.style.getPropertyValue(name))
  );

const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex: string) =>
  channels(hex).reduce((sum, channel, k) => sum + channel * [0.2126, 0.7152, 0.0722][k], 0);

test.describe('clima nublado', () => {
  test('aparecem nuvens e não aparecem gotas', async ({ page }) => {
    await liveAt(page, NOON, { cloudCover: 80 });
    await expect(layer(page, 'nuvens')).toBeVisible();
    await expect(layer(page, 'chuva')).toHaveCount(0);
  });

  test('as nuvens são decorativas: os leitores de tela as ignoram', async ({ page }) => {
    await liveAt(page, NOON, { cloudCover: 80, precipitation: 2 });
    await expect(layer(page, 'nuvens')).toHaveAttribute('aria-hidden', 'true');
    await expect(layer(page, 'chuva')).toHaveAttribute('aria-hidden', 'true');
  });

  test('com cobertura alta à noite, as estrelas diminuem', async ({ page }) => {
    const opacity = () => layer(page, 'estrelas').evaluate(el => Number(getComputedStyle(el).opacity));
    await liveAt(page, NIGHT, {});
    const clear = await opacity();

    await swapWeather(page, { cloudCover: 95 });
    expect(await opacity()).toBeLessThan(clear);
  });
});

test.describe('clima com chuva', () => {
  test('caem gotas e o céu fica mais cinza que o céu limpo da mesma hora', async ({ page }) => {
    await liveAt(page, NOON, {});
    const clear = await skyColors(page);
    await expect(layer(page, 'chuva')).toHaveCount(0);

    await swapWeather(page, { cloudCover: 100, precipitation: 3 });
    await expect(layer(page, 'chuva')).toBeVisible();
    (await skyColors(page)).forEach((color, i) => expect(luminance(color)).toBeLessThan(luminance(clear[i])));
  });

  test('a intensidade cresce com os mm/h', async ({ page }) => {
    const drops = () => layer(page, 'chuva').locator('span').count();
    await liveAt(page, NOON, { cloudCover: 100, precipitation: 0.5 });
    const drizzle = await drops();

    await swapWeather(page, { cloudCover: 100, precipitation: 4 });
    expect(drizzle).toBeGreaterThan(0);
    expect(await drops()).toBeGreaterThan(drizzle);
  });

  for (const [name, at] of [
    ['meio-dia', NOON],
    ['noite', NIGHT]
  ]) {
    test(`${name}: a saudação e o título continuam legíveis sob chuva`, async ({ page }) => {
      await liveAt(page, at, { cloudCover: 100, precipitation: 4 });
      // As gotas e as ondas passam por trás do texto e saem da medição: mede-se o texto contra o céu.
      await page
        .locator('#inicio svg[viewBox="0 0 1440 240"], #inicio [data-cena-camada="chuva"]')
        .evaluateAll(els => els.forEach(el => (el as HTMLElement).style.setProperty('visibility', 'hidden')));
      expect(await worstContrast(page, page.locator('#greeting-text'))).toBeGreaterThanOrEqual(MIN_CONTRAST);
      const title = page.getByRole('heading', { level: 1 });
      await title.evaluate(el => el.style.setProperty('background-image', 'none', 'important'));
      expect(await worstContrast(page, title)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
  }
});

test.describe('chuva com movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('não caem gotas, mas o céu segue nublado e escuro', async ({ page }) => {
    await liveAt(page, NOON, {});
    const clear = await skyColors(page);

    await swapWeather(page, { cloudCover: 100, precipitation: 4 });
    await expect(layer(page, 'chuva')).toHaveCount(0);
    await expect(layer(page, 'nuvens')).toBeVisible();
    (await skyColors(page)).forEach((color, i) => expect(luminance(color)).toBeLessThan(luminance(clear[i])));
  });
});

test.describe('sem clima', () => {
  test('se a rota falha, o céu segue a hora, sem nuvens nem chuva, e a página continua usável', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', error => errors.push(error));
    await liveAt(page, NOON, 'falha');

    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'dia');
    expect(await skyColors(page)).toEqual(['#f2f2f2', '#f2f2f2', '#f2f2f2']);
    await expect(layer(page, 'nuvens')).toHaveCount(0);
    await expect(layer(page, 'chuva')).toHaveCount(0);

    await page.locator('header nav a[href="#projetos"]').first().click();
    await expect(page.locator('#projetos')).toBeInViewport();
    expect(errors).toEqual([]);
  });

  test('se a rota devolve algo fora do contrato, vale o mesmo', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', error => errors.push(error));
    await page.clock.setFixedTime(new Date(NOON));
    await page.route('**/api/cena', route => route.fulfill({ json: { cloudCover: 'muitas' } }));
    await openLive(page);

    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'dia');
    await expect(layer(page, 'nuvens')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('enquanto o clima não chega, o céu já segue a hora', async ({ page }) => {
    await page.clock.setFixedTime(new Date(NIGHT));
    let release = () => {};
    const held = new Promise<void>(resolve => (release = resolve));
    await page.route('**/api/cena', async route => {
      await held;
      await route.fulfill({ json: { ...CLEAR, cloudCover: 90 } });
    });
    await openLive(page);

    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'noite');
    await expect(layer(page, 'estrelas')).toBeVisible();
    await expect(layer(page, 'nuvens')).toHaveCount(0);

    release();
    await expect(layer(page, 'nuvens')).toBeVisible();
  });

  test('ao voltar para ao vivo, o clima da entrada anterior não reaparece enquanto o novo carrega', async ({ page }) => {
    await page.clock.setFixedTime(new Date(NOON));
    let release = () => {};
    let calls = 0;
    await page.route('**/api/cena', async route => {
      // O primeiro pedido responde na hora; o segundo fica preso até o teste soltar.
      if (++calls > 1) await new Promise<void>(resolve => (release = resolve));
      await route.fulfill({ json: { ...CLEAR, cloudCover: 90 } });
    });
    await openLive(page);
    await expect(layer(page, 'nuvens')).toBeVisible();

    const radio = (mode: 'dia' | 'ao-vivo') => sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes[mode] });
    await radio('dia').click();
    await radio('ao-vivo').click();
    await expect.poll(() => calls).toBe(2);
    await page.waitForTimeout(1000);
    await expect(layer(page, 'nuvens')).toHaveCount(0);

    release();
    await expect(layer(page, 'nuvens')).toBeVisible();
  });
});

test.describe('nascer e pôr do sol do dia', () => {
  // 4h40 em Salvador: pela tabela (5h30) ainda é noite; com o sol nascendo às 4h57, já é amanhecer.
  const BEFORE_DAWN = '2026-11-13T07:40:00Z';

  test('vêm da rota e substituem a tabela fixa', async ({ page }) => {
    await liveAt(page, BEFORE_DAWN, {
      sunrise: '2026-11-13T04:57:00-03:00',
      sunset: '2026-11-13T17:38:00-03:00'
    });
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'amanhecer');
  });

  test('sem a rota, vale a tabela', async ({ page }) => {
    await liveAt(page, BEFORE_DAWN, 'falha');
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'noite');
  });
});

type Hideable = Window & { __hide: (hidden: boolean) => void };

// A aba fica oculta ou visível quando o teste pede, como o navegador faria ao trocar de aba.
function fakeVisibility() {
  let hidden = false;
  Object.defineProperty(Document.prototype, 'hidden', { get: () => hidden, configurable: true });
  Object.defineProperty(Document.prototype, 'visibilityState', {
    get: () => (hidden ? 'hidden' : 'visible'),
    configurable: true
  });
  (window as unknown as Hideable).__hide = value => {
    hidden = value;
    document.dispatchEvent(new Event('visibilitychange'));
  };
}

const setHidden = (page: Page, hidden: boolean) =>
  page.evaluate(value => (window as unknown as Hideable).__hide(value), hidden);

test.describe('quando o clima é pedido', () => {
  test('em ao vivo, uma vez por entrada no modo', async ({ page }) => {
    const calls = await fakeWeather(page, {});
    await page.goto('/');
    await page.waitForTimeout(3500);
    const radio = (mode: 'dia' | 'noite' | 'ao-vivo') =>
      sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes[mode] });

    await radio('noite').click();
    await page.waitForTimeout(500);
    expect(calls).toHaveLength(0);

    await radio('ao-vivo').click();
    await page.waitForTimeout(1500);
    expect(calls).toHaveLength(1);

    await radio('dia').click();
    await page.waitForTimeout(500);
    expect(calls).toHaveLength(1);

    await radio('ao-vivo').click();
    await page.waitForTimeout(1500);
    expect(calls).toHaveLength(2);
  });

  test('de novo a cada cerca de 20 min com a aba visível, e não com ela oculta', async ({ page }) => {
    await page.addInitScript(fakeVisibility);
    await page.clock.install({ time: new Date(NOON) });
    const calls = await fakeWeather(page, {});
    await openLive(page);
    expect(calls).toHaveLength(1);

    await page.clock.fastForward('19:00');
    expect(calls).toHaveLength(1);
    await page.clock.fastForward('01:30');
    await expect.poll(() => calls.length).toBe(2);

    await setHidden(page, true);
    await page.clock.fastForward('45:00');
    await page.waitForTimeout(500);
    expect(calls).toHaveLength(2);

    // Ao voltar, o pedido atrasado sai na hora.
    await setHidden(page, false);
    await expect.poll(() => calls.length).toBe(3);
  });
});

test.describe('atribuição no Rodapé', () => {
  for (const [path, dict] of [
    ['/', pt],
    ['/en', en]
  ] as const) {
    test(`${path}: mostra a fonte do clima, com link para a Open-Meteo`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toContainText(`${dict.content.footer.weatherCredit} Open-Meteo`);
      await expect(footer.getByRole('link', { name: 'Open-Meteo' })).toHaveAttribute(
        'href',
        /^https:\/\/open-meteo\.com\/?$/
      );
    });
  }
});
