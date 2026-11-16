import { test, expect, type Locator, type Page } from '@playwright/test';
import { MIN_CONTRAST, worstContrast } from '../contrast';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import profile from '../../src/meta/profile';
import type { SceneMode } from '../../src/app/lib/scene';
import type { SceneWeather } from '../../src/app/lib/scene-weather';

// A Tela do Hero na Versão para celular: a Cena completa, os seletores no topo e os convites.

const STORAGE_KEY = 'cena-modo';
const MODES: SceneMode[] = ['dia', 'noite', 'ao-vivo'];

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
  fetchedAt: NOON
};

const hero = (page: Page) => page.locator('#inicio');
const sceneSwitch = (page: Page, name = pt.ui.sceneSwitch) => hero(page).getByRole('radiogroup', { name });
const layer = (page: Page, name: 'nuvens' | 'chuva' | 'estrelas') =>
  page.locator(`#inicio [data-cena-camada="${name}"]`);
const wavePaths = (page: Page) => page.locator('#inicio svg[viewBox="0 0 1440 240"] path');

type Options = { path?: string; mode?: SceneMode; at?: string; weather?: Partial<SceneWeather> | 'falha' };

// Abre a home num Modo, com o relógio e o clima que o teste pedir, e espera a Cena e as entradas.
async function open(page: Page, { path = '/', mode, at, weather = 'falha' }: Options = {}) {
  if (at) await page.clock.setFixedTime(new Date(at));
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route =>
    weather === 'falha'
      ? route.fulfill({ status: 502, json: { error: 'clima indisponível' } })
      : route.fulfill({ json: { ...CLEAR, ...weather } })
  );
  await page.goto(path);
  await expect(hero(page)).toHaveAttribute('data-cena-pronta', '');
  await page.waitForTimeout(1500);
}

const topOf = (page: Page, id: string) =>
  page.locator(`[data-tela="${id}"]`).evaluate(el => Math.round(el.getBoundingClientRect().top) || 0);

test.describe('Modos da Cena', () => {
  test('o seletor fica no topo do Hero, troca o Modo e a escolha é lembrada', async ({ page }) => {
    await open(page);
    await expect(hero(page)).toHaveAttribute('data-cena-modo', 'dia');
    await expect(sceneSwitch(page).getByRole('radio')).toHaveCount(3);
    const night = sceneSwitch(page).getByRole('radio', { name: pt.ui.sceneModes.noite });
    expect((await night.boundingBox())!.y).toBeLessThan(120);

    await night.tap();
    await expect(night).toBeChecked();
    await expect(hero(page)).toHaveAttribute('data-cena-modo', 'noite');
    await expect(hero(page)).toHaveAttribute('data-cena-fase', 'noite');
    await expect(layer(page, 'estrelas')).toBeVisible();
    expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe('noite');

    await page.reload();
    await expect(hero(page)).toHaveAttribute('data-cena-modo', 'noite');
  });

  test('não há o Header do desktop: os seletores são os do Hero', async ({ page }) => {
    await open(page);
    await expect(page.locator('header')).toHaveCount(0);
    // A Tela de Contato repete os seletores no fim do mergulho.
    await expect(hero(page).getByRole('radiogroup', { name: pt.ui.sceneSwitch })).toHaveCount(1);
    await expect(hero(page).getByRole('group', { name: pt.ui.languageSwitch })).toBeVisible();
  });

  for (const { name, at, phase } of [
    { name: 'madrugada', at: '2026-11-13T06:00:00Z', phase: 'noite' },
    { name: 'meio-dia', at: NOON, phase: 'dia' },
    { name: 'pôr do sol', at: '2026-11-13T20:30:00Z', phase: 'por-do-sol' }
  ]) {
    test(`ao vivo: ${name} em Salvador mostra a fase ${phase}`, async ({ page }) => {
      await open(page, { mode: 'ao-vivo', at });
      await expect(hero(page)).toHaveAttribute('data-cena-modo', 'ao-vivo');
      await expect(hero(page)).toHaveAttribute('data-cena-fase', phase);
    });
  }

  test('ao vivo: o clima traz nuvens e chuva', async ({ page }) => {
    await open(page, { mode: 'ao-vivo', at: NOON, weather: { cloudCover: 100, precipitation: 4 } });
    await expect(layer(page, 'nuvens')).toBeAttached();
    await expect(layer(page, 'chuva')).toBeAttached();
  });

  test('movimento reduzido: ondas paradas e sem chuva', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, { mode: 'ao-vivo', at: NOON, weather: { cloudCover: 100, precipitation: 4 } });
    await expect(layer(page, 'nuvens')).toBeAttached();
    await expect(layer(page, 'chuva')).toHaveCount(0);
    const xs = () => wavePaths(page).evaluateAll(paths => paths.map(p => Math.round(p.getBoundingClientRect().left)));
    const before = await xs();
    await page.waitForTimeout(1000);
    expect(await xs()).toEqual(before);
  });
});

test.describe('ondas', () => {
  // Cada camada cobre a tela de ponta a ponta: nenhuma borda do desenho aparece.
  const coverWidth = async (page: Page, label: string) => {
    const width = page.viewportSize()!.width;
    const boxes = await wavePaths(page).evaluateAll(paths =>
      paths.map(p => {
        const { left, right } = p.getBoundingClientRect();
        return { left, right };
      })
    );
    expect(boxes).toHaveLength(3);
    boxes.forEach(({ left, right }, i) => {
      expect(left, `${label}: camada ${i}, esquerda`).toBeLessThanOrEqual(0);
      expect(right, `${label}: camada ${i}, direita`).toBeGreaterThanOrEqual(width);
    });
  };

  for (const mode of MODES) {
    test(`${mode}: cobrem a largura durante o deslize e o parallax`, async ({ page }) => {
      await open(page, { mode, at: NIGHT, weather: { waveHeight: 2.8, windSpeed: 14 } });
      for (let i = 0; i < 4; i++) {
        await coverWidth(page, `quadro ${i}`);
        await page.waitForTimeout(700);
      }
      // Rolando até a beira do Hero, onde o parallax das ondas está mais longe do começo.
      await page.evaluate(() => {
        const { bottom } = document.getElementById('inicio')!.getBoundingClientRect();
        window.scrollTo({ top: bottom + window.scrollY - 80, behavior: 'instant' });
      });
      await page.waitForTimeout(300);
      await coverWidth(page, 'beira do Hero');
    });
  }
});

test.describe('selo e Aviso de sono', () => {
  const notice = (page: Page) => hero(page).getByText(pt.content.hero.sleepNotice, { exact: true });

  test('às 21h59 de Salvador, só o selo', async ({ page }) => {
    await open(page, { at: '2026-11-13T00:59:00Z' });
    await expect(hero(page).getByText(pt.profile.availability, { exact: true })).toBeVisible();
    await expect(notice(page)).toHaveCount(0);
  });

  test('às 22h de Salvador, o selo e o Aviso de sono', async ({ page }) => {
    await open(page, { at: '2026-11-13T01:00:00Z' });
    await expect(hero(page).getByText(pt.profile.availability, { exact: true })).toBeVisible();
    await expect(notice(page)).toBeVisible();
  });
});

test.describe('conteúdo e convites', () => {
  test('foto, saudação, título e proposta de valor', async ({ page }) => {
    await open(page);
    await expect(hero(page).getByRole('img', { name: new RegExp(profile.name) })).toBeVisible();
    await expect(hero(page).getByText(pt.content.hero.greeting)).toBeVisible();
    await expect(hero(page).getByRole('heading', { level: 1, name: profile.role })).toBeVisible();
    await expect(hero(page).getByText(pt.content.hero.valueProp)).toBeVisible();
  });

  test('"Entrar em contato" abre o WhatsApp com a mensagem', async ({ page }) => {
    await open(page);
    await expect(hero(page).getByRole('link', { name: pt.content.hero.cta })).toHaveAttribute(
      'href',
      `${profile.social.whatsapp}?text=${pt.profile.whatsappMessage}`
    );
  });

  test('"Ver projetos" leva à Tela de Projetos', async ({ page }) => {
    await open(page);
    await hero(page).getByRole('link', { name: pt.content.hero.secondaryCta }).tap();
    await expect.poll(() => topOf(page, 'projetos'), { timeout: 5000 }).toBe(0);
  });

  test('"Mergulhe" leva à Tela Sobre', async ({ page }) => {
    await open(page);
    await hero(page).getByRole('link', { name: pt.ui.dive }).tap();
    await expect.poll(() => topOf(page, 'sobre'), { timeout: 5000 }).toBe(0);
  });

  test('"Baixar currículo" baixa o currículo do Idioma', async ({ page }) => {
    await open(page);
    await expect(hero(page).getByRole('link', { name: pt.content.hero.resumeCta })).toHaveAttribute(
      'href',
      pt.profile.resumePath
    );
    await page.goto('/en');
    await expect(hero(page).getByRole('link', { name: en.content.hero.resumeCta })).toHaveAttribute(
      'href',
      en.profile.resumePath
    );
  });

  test('em inglês, os textos e os convites vêm do Dicionário inglês', async ({ page }) => {
    await open(page, { path: '/en' });
    await expect(hero(page).getByText(en.content.hero.greeting)).toBeVisible();
    await expect(hero(page).getByText(en.content.hero.valueProp)).toBeVisible();
    await expect(hero(page).getByRole('link', { name: en.content.hero.cta })).toHaveAttribute(
      'href',
      `${profile.social.whatsapp}?text=${en.profile.whatsappMessage}`
    );
    await expect(hero(page).getByRole('link', { name: en.ui.dive })).toBeVisible();
    await expect(sceneSwitch(page, en.ui.sceneSwitch)).toBeVisible();
  });

  test('o seletor de Idioma leva à Versão para celular no outro Idioma', async ({ page }) => {
    await open(page);
    await hero(page).getByRole('link', { name: 'English' }).tap();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('[data-versao]')).toHaveAttribute('data-versao', 'celular');
    await expect(hero(page).getByText(en.content.hero.greeting)).toBeVisible();
  });
});

// Textos do Hero que ficam direto sobre a Cena ou sobre o próprio fundo.
const texts = (page: Page): [string, Locator][] => [
  ['saudação', hero(page).getByText(pt.content.hero.greeting)],
  ['título', hero(page).getByRole('heading', { level: 1 })],
  ['proposta de valor', hero(page).getByText(pt.content.hero.valueProp)],
  ['selo', hero(page).getByText(pt.profile.availability, { exact: true })],
  ['contato', hero(page).getByRole('link', { name: pt.content.hero.cta })],
  ['projetos', hero(page).getByRole('link', { name: pt.content.hero.secondaryCta })],
  ['currículo', hero(page).getByRole('link', { name: pt.content.hero.resumeCta })],
  ['mergulhe', hero(page).getByRole('link', { name: pt.ui.dive })]
];

test.describe('contraste sobre a Cena', () => {
  // Oito medições por foto da tela: mais tempo que o padrão.
  test.describe.configure({ timeout: 90_000 });

  for (const { mode, at } of [
    { mode: 'dia', at: NIGHT },
    { mode: 'noite', at: NIGHT },
    { mode: 'ao-vivo', at: '2026-11-13T20:30:00Z' },
    { mode: 'ao-vivo', at: NIGHT }
  ] as const) {
    test(`${mode} às ${at.slice(11, 16)} UTC: todos os textos passam`, async ({ page }) => {
      await open(page, { mode, at });
      // O título é um gradiente recortado no texto: mede-se o texto contra o céu, sem o gradiente.
      await hero(page)
        .getByRole('heading', { level: 1 })
        .evaluate(el => el.style.setProperty('background-image', 'none', 'important'));
      for (const [label, target] of texts(page)) {
        expect(await worstContrast(page, target), label).toBeGreaterThanOrEqual(MIN_CONTRAST);
      }
      // Meia-noite em Salvador: o Aviso de sono também aparece.
      const notice = hero(page).getByText(pt.content.hero.sleepNotice, { exact: true });
      if (at === NIGHT) expect(await worstContrast(page, notice), 'aviso de sono').toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
  }
});

test.describe('medidas', () => {
  test('texto corrido de 16px, rótulos de 14px e toque de 44px', async ({ page }) => {
    await open(page, { at: '2026-11-13T01:00:00Z' });
    for (const [label, target] of texts(page)) {
      const size = await target.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
      expect(size, label).toBeGreaterThanOrEqual(label === 'selo' ? 14 : 16);
    }
    const notice = hero(page).getByText(pt.content.hero.sleepNotice, { exact: true });
    expect(await notice.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);

    const targets = hero(page).locator('a:visible, button:visible');
    expect(await targets.count()).toBeGreaterThanOrEqual(9);
    for (const target of await targets.all()) {
      const box = (await target.boundingBox())!;
      const name = (await target.getAttribute('aria-label')) ?? (await target.innerText());
      expect(box.width, name).toBeGreaterThanOrEqual(44);
      expect(box.height, name).toBeGreaterThanOrEqual(44);
    }
  });

  test('nenhum convite fica sob a área de toque dos pontos da lateral', async ({ page }) => {
    await open(page);
    const dots = await page
      .getByRole('navigation', { name: pt.ui.screens })
      .getByRole('link')
      .evaluateAll(links => links.map(link => link.getBoundingClientRect().toJSON()));
    // A saudação e o título são só texto: tocar perto deles não erra nada.
    for (const [label, target] of texts(page).slice(2)) {
      const box = (await target.boundingBox())!;
      for (const dot of dots) {
        const overlaps =
          box.x < dot.right && box.x + box.width > dot.left && box.y < dot.bottom && box.y + box.height > dot.top;
        expect(overlaps, label).toBe(false);
      }
    }
  });

  test('nada rola para o lado nem sai da tela', async ({ page }) => {
    await open(page, { at: '2026-11-13T01:00:00Z' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    const width = page.viewportSize()!.width;
    for (const [label, target] of texts(page)) {
      const box = (await target.boundingBox())!;
      expect(box.x, label).toBeGreaterThanOrEqual(16 - 1);
      expect(box.x + box.width, label).toBeLessThanOrEqual(width - 16 + 1);
    }
  });

  for (const [name, viewport] of [
    ['320px', { width: 320, height: 568 }],
    ['paisagem', { width: 844, height: 390 }]
  ] as const) {
    test(`em ${name}, nada quebra`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await open(page, { at: '2026-11-13T01:00:00Z' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      for (const [label, target] of texts(page)) {
        const box = (await target.boundingBox())!;
        expect(box.x, label).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width, label).toBeLessThanOrEqual(viewport.width);
      }
      // O título não quebra palavra: cada linha é uma palavra inteira.
      const lines = await hero(page)
        .getByRole('heading', { level: 1 })
        .evaluate(el => {
          const range = document.createRange();
          range.selectNodeContents(el);
          return new Set(Array.from(range.getClientRects()).map(r => Math.round(r.top))).size;
        });
      expect(lines).toBeLessThanOrEqual(profile.role.split(' ').length);
      const width = viewport.width;
      const waves = await wavePaths(page).evaluateAll(paths => paths.map(p => p.getBoundingClientRect().toJSON()));
      waves.forEach((box, i) => {
        expect(box.left, `onda ${i}`).toBeLessThanOrEqual(0);
        expect(box.right, `onda ${i}`).toBeGreaterThanOrEqual(width);
      });
    });
  }
});
