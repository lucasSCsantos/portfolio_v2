import { test, expect, type Page } from '@playwright/test';
import { MIN_CONTRAST, worstContrast } from './contrast';
import pt from '../src/meta/dictionaries/pt';
import en from '../src/meta/dictionaries/en';

// O Modo `ao vivo` pela hora de Salvador (ainda sem clima).

const STORAGE_KEY = 'cena-modo';
const DAY_WAVES = ['rgb(20, 98, 166)', 'rgb(57, 140, 191)', 'rgb(121, 190, 217)'];

// Instantes em UTC; Salvador é UTC-3 o ano todo.
const REFERENCE_HOURS = [
  { name: 'madrugada', at: '2026-11-13T06:00:00Z', phase: 'noite', stars: true },
  { name: 'amanhecer', at: '2026-11-13T08:45:00Z', phase: 'amanhecer', stars: false },
  { name: 'meio-dia', at: '2026-11-13T15:00:00Z', phase: 'dia', stars: false },
  { name: 'pôr do sol', at: '2026-11-13T20:30:00Z', phase: 'por-do-sol', stars: false },
  { name: 'crepúsculo', at: '2026-11-13T21:15:00Z', phase: 'crepusculo', stars: true },
  { name: 'noite', at: '2026-11-14T00:00:00Z', phase: 'noite', stars: true }
] as const;

const sceneSwitch = (page: Page, name = pt.ui.sceneSwitch) =>
  page.getByRole('radiogroup', { name });

const hero = (page: Page) => page.locator('#inicio');

// Abre a home já em `ao vivo` e espera as entradas animadas do Hero.
async function openLive(page: Page, path = '/') {
  await page.addInitScript(key => localStorage.setItem(key, 'ao-vivo'), STORAGE_KEY);
  await page.goto(path);
  await page.waitForTimeout(3500);
}

const waveFills = (page: Page) =>
  page
    .locator('#inicio svg[viewBox="0 0 1440 240"] path')
    .evaluateAll(paths => paths.map(p => getComputedStyle(p).fill));

const rgbOf = (css: string) => (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const distance = (a: number[], b: number[]) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

test.describe('seletor com ao vivo', () => {
  test('a terceira opção é ao vivo, com nome nos dois Idiomas, e a escolha é lembrada', async ({
    page
  }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
    const live = sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes['ao-vivo'] });
    await expect(sceneSwitch(page).getByRole('radio')).toHaveCount(3);

    await live.click();
    await expect(live).toBeChecked();
    await expect(hero(page)).toHaveAttribute('data-cena-modo', 'ao-vivo');
    expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe('ao-vivo');

    await page.reload();
    await expect(hero(page)).toHaveAttribute('data-cena-modo', 'ao-vivo');

    await page.getByRole('link', { name: 'English' }).first().click();
    await page.waitForURL('**/en**');
    await expect(
      sceneSwitch(page, en.ui.sceneSwitch).getByRole('radio', { name: en.ui.sceneModes['ao-vivo'] })
    ).toBeChecked();
  });

  test('pelo teclado, a seta passa de noite para ao vivo e de ao vivo volta a dia', async ({
    page
  }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
    const radio = (mode: 'dia' | 'noite' | 'ao-vivo') =>
      sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes[mode] });

    await radio('noite').click();
    await page.keyboard.press('ArrowRight');
    await expect(radio('ao-vivo')).toBeChecked();
    await expect(radio('ao-vivo')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(radio('dia')).toBeChecked();
  });
});

// Dois fusos bem distantes de Salvador: o resultado não pode depender do fuso do navegador.
for (const timezoneId of ['Asia/Tokyo', 'America/Los_Angeles']) {
  test.describe(`ao vivo com o navegador em ${timezoneId}`, () => {
    test.use({ timezoneId });

    for (const { name, at, phase } of REFERENCE_HOURS) {
      test(`${name} em Salvador mostra a fase ${phase}`, async ({ page }) => {
        await page.clock.setFixedTime(new Date(at));
        await openLive(page);
        await expect(hero(page)).toHaveAttribute('data-cena-modo', 'ao-vivo');
        await expect(hero(page)).toHaveAttribute('data-cena-fase', phase);
      });
    }
  });
}

test.describe('ao vivo nas horas de referência', () => {
  for (const { name, at, stars } of REFERENCE_HOURS) {
    test.describe(name, () => {
      test.beforeEach(async ({ page }) => {
        await page.clock.setFixedTime(new Date(at));
        await openLive(page);
      });

      test('a saudação, o título e o Header passam no contraste com o céu', async ({ page }) => {
        // O tom segue o céu. Mesmo no `dia` de sempre, a crista da onda de trás passa atrás da base
        // do título, então as ondas ficam fora da medição.
        await page
          .locator('#inicio svg[viewBox="0 0 1440 240"]')
          .evaluate(el => el.style.setProperty('visibility', 'hidden'));
        expect(await worstContrast(page, page.locator('#greeting-text'))).toBeGreaterThanOrEqual(
          MIN_CONTRAST
        );
        const title = page.getByRole('heading', { level: 1 });
        // O título é um gradiente recortado no texto: mede-se o texto contra o céu, sem o gradiente.
        await title.evaluate(el => el.style.setProperty('background-image', 'none', 'important'));
        expect(await worstContrast(page, title)).toBeGreaterThanOrEqual(MIN_CONTRAST);

        for (const target of [
          page.locator('header a[href="#inicio"] > span'),
          page.locator('header nav a p').first()
        ])
          expect(await worstContrast(page, target)).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });

      test(stars ? 'há estrelas' : 'não há estrelas', async ({ page }) => {
        const layer = page.locator('#inicio [data-cena-camada="estrelas"]');
        if (stars) await expect(layer).toBeVisible();
        else await expect(layer).toHaveCount(0);
      });

      test('não há emenda entre o Hero e o Mar', async ({ page }) => {
        const front = rgbOf(
          await page
            .locator('#inicio svg[viewBox="0 0 1440 240"] path')
            .last()
            .evaluate(p => getComputedStyle(p).fill)
        );
        const middle = page.viewportSize()!.height / 2;
        await page.evaluate(m => {
          const bottom = document.getElementById('inicio')!.getBoundingClientRect().bottom;
          window.scrollTo({ top: bottom + window.scrollY - m, behavior: 'instant' });
        }, middle);
        await page.waitForTimeout(800);
        const bottom = await hero(page).evaluate(el => el.getBoundingClientRect().bottom);
        const width = page.viewportSize()!.width;
        const band = async (y: number) => {
          const shot = await page.screenshot({ clip: { x: width * 0.3, y, width: width * 0.4, height: 4 } });
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
        };
        const above = await band(bottom - 6);
        const below = await band(bottom + 2);
        expect(distance(above, front)).toBeLessThan(20);
        expect(distance(below, above)).toBeLessThan(30);
      });
    });
  }
});

test.describe('textos sobre o Mar em ao vivo', () => {
  for (const { name, at } of REFERENCE_HOURS.filter(({ name }) => ['madrugada', 'pôr do sol'].includes(name))) {
    for (const [label, selector] of [
      ['nome no Sobre', '#sobre h2'],
      ['bio do Sobre', '#left-about-area > p'],
      ['título de Projetos', '#projetos h2']
    ]) {
      test(`${name}: passa no contraste: ${label}`, async ({ page }) => {
        await page.clock.setFixedTime(new Date(at));
        await openLive(page);
        const target = page.locator(selector).first();
        await target.evaluate(el => el.scrollIntoView({ block: 'center' }));
        await page.waitForTimeout(1500); // entrada na água e flutuação
        expect(await worstContrast(page, target)).toBeGreaterThanOrEqual(MIN_CONTRAST);
      });
    }
  }
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

test.describe('o relógio da Cena', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(fakeVisibility);
    // 16h44 em Salvador: um minuto antes de o dia virar pôr do sol.
    await page.clock.install({ time: new Date('2026-11-13T19:44:00Z') });
    await openLive(page);
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'dia');
  });

  test('avança sozinho a cada minuto com a página aberta', async ({ page }) => {
    await page.clock.fastForward('01:00');
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'por-do-sol');
    await page.clock.fastForward('01:30:00');
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'crepusculo');
  });

  test('pausa com a aba oculta e se atualiza ao voltar', async ({ page }) => {
    await setHidden(page, true);
    await page.clock.fastForward('01:30:00');
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'dia');

    await setHidden(page, false);
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'crepusculo');
  });
});

test.describe('ao vivo sem rede e sem servidor', () => {
  test('o modo não chama a rota de clima nem nenhum outro servidor', async ({ page, baseURL }) => {
    const calls: string[] = [];
    page.on('request', request => calls.push(request.url()));
    await openLive(page);
    await page.waitForTimeout(1500);
    expect(calls.filter(url => url.includes('/api/') || !url.startsWith(baseURL!))).toEqual([]);
  });

  test('o HTML estático sai em dia, mesmo de noite em Salvador', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-13T06:00:00Z'));
    await page.addInitScript(key => localStorage.setItem(key, 'ao-vivo'), STORAGE_KEY);
    await page.route('**/_next/static/**/*.js', route => route.abort());
    await page.goto('/');
    expect(await waveFills(page)).toEqual(DAY_WAVES);
  });
});
