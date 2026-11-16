import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import { fill } from '../../src/meta/dictionaries/types';
import { MIN_CONTRAST, worstContrast } from '../contrast';

// A Tela de Projetos da Versão para celular: um Projeto por vez num paginador de tela cheia.

const STORAGE_KEY = 'cena-modo';
const total = pt.projects.length;

const tela = (page: Page) => page.locator('[data-tela="projetos"]');
const pager = (page: Page, name = pt.content.projects.label) => tela(page).getByRole('list', { name });
const pages = (page: Page, name?: string) => pager(page, name).getByRole('listitem').filter({ has: page.getByRole('heading') });
const pageOf = (page: Page, title: string, name?: string) =>
  pages(page, name).filter({ has: page.getByRole('heading', { name: title, exact: true }) });
const counter = (page: Page) => tela(page).locator('[data-contador]');
const previous = (page: Page) => tela(page).getByRole('button', { name: pt.ui.previousProject });
const next = (page: Page) => tela(page).getByRole('button', { name: pt.ui.nextProject });

async function open(page: Page, path = '/', mode?: string) {
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route => route.fulfill({ status: 502, json: { error: 'clima indisponível' } }));
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
  await tela(page).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(tela(page).locator('#projetos')).toBeInViewport();
}

// Leva o paginador a um Projeto como o deslize do dedo faria.
const swipeTo = (page: Page, index: number) =>
  pager(page).evaluate((el, i) => el.scrollTo({ left: i * el.clientWidth, behavior: 'instant' }), index);

for (const dict of [pt, en]) {
  test(`${dict.locale}: todos os Projetos, na ordem, com todos os campos`, async ({ page }) => {
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    const name = dict.content.projects.label;
    await expect(tela(page).getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(tela(page)).toContainText(dict.content.projects.title);

    await expect(pages(page, name)).toHaveCount(dict.projects.length);
    const titles = await pages(page, name).getByRole('heading').allTextContents();
    expect(titles).toEqual(dict.projects.map(({ title }) => title));

    for (const project of dict.projects) {
      const p = pageOf(page, project.title, name);
      await expect(p.locator('img')).toHaveCount(1);
      await expect(p).toContainText(dict.relationLabels[project.relation]);
      await expect(p).toContainText(project.year);
      await expect(p).toContainText(project.role);
      if (project.result) await expect(p).toContainText(project.result);
      await expect(p).toContainText(project.description);
      const techs = p.getByRole('list', { name: dict.ui.technologies }).getByRole('listitem');
      await expect(techs).toHaveText(project.technologies);

      const site = p.getByRole('link', { name: fill(dict.ui.viewSiteLabel, { title: project.title }) });
      await expect(site).toHaveCount(project.href ? 1 : 0);
      if (project.href) {
        await expect(site).toHaveAttribute('href', project.href);
        await expect(site).toHaveAttribute('target', '_blank');
      }
      await expect(p.getByText(dict.ui.offline, { exact: true })).toHaveCount(project.offline ? 1 : 0);
      await expect(p.getByRole('button', { name: fill(dict.ui.viewDemoLabel, { title: project.title }) })).toHaveCount(
        project.video ? 1 : 0
      );
    }
  });
}

test.describe('paginador', () => {
  test('um Projeto por vez, do tamanho do paginador', async ({ page }) => {
    await open(page);
    const width = await pager(page).evaluate(el => el.clientWidth);
    for (const box of await pages(page).evaluateAll(els => els.map(el => el.getBoundingClientRect().width))) {
      expect(Math.round(box)).toBe(width);
    }
    await expect(pages(page).first()).toBeInViewport({ ratio: 0.9 });
    await expect(pages(page).nth(1)).not.toBeInViewport();
  });

  test('os botões trocam de Projeto, o contador acompanha e nada passa das pontas', async ({ page }) => {
    await open(page);
    await expect(counter(page)).toHaveText(`1 / ${total}`);
    await expect(previous(page)).toBeDisabled();
    await expect(next(page)).toBeEnabled();

    await next(page).tap();
    await expect(counter(page)).toHaveText(`2 / ${total}`);
    await expect(pages(page).nth(1)).toBeInViewport({ ratio: 0.9 });
    await expect(previous(page)).toBeEnabled();

    await previous(page).tap();
    await expect(counter(page)).toHaveText(`1 / ${total}`);
    await expect(pages(page).first()).toBeInViewport({ ratio: 0.9 });

    for (let i = 2; i <= total; i++) {
      await next(page).tap();
      await expect(counter(page)).toHaveText(`${i} / ${total}`);
    }
    await expect(next(page)).toBeDisabled();
    await expect(pages(page).last()).toBeInViewport({ ratio: 0.9 });
  });

  test('o deslize troca de Projeto e o contador acompanha', async ({ page }) => {
    await open(page);
    await swipeTo(page, 3);
    await expect(counter(page)).toHaveText(`4 / ${total}`);
    await swipeTo(page, total - 1);
    await expect(counter(page)).toHaveText(`${total} / ${total}`);
    await expect(next(page)).toBeDisabled();
  });

  test('encaixa um Projeto por vez e desliza sem rolar a página', async ({ page }) => {
    await open(page);
    expect(await pager(page).evaluate(el => getComputedStyle(el).scrollSnapType)).toBe('x mandatory');
    expect(await pages(page).first().evaluate(el => getComputedStyle(el).scrollSnapAlign)).toBe('start');
    // Um paginador que rola tem de ser alcançável pelo teclado.
    await expect(pager(page)).toHaveAttribute('tabindex', '0');
    await swipeTo(page, total - 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('todas as páginas têm a mesma altura, antes e depois de "ler mais"', async ({ page }) => {
    await open(page);
    const heights = () => pages(page).evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().height)));
    expect(new Set(await heights()).size).toBe(1);
    await pages(page).first().getByRole('button', { name: pt.ui.readMore }).tap();
    expect(new Set(await heights()).size).toBe(1);
  });
});

test('"ler mais" abre a descrição na própria página e "ler menos" a recolhe', async ({ page }) => {
  await open(page);
  const p = pages(page).first();
  const description = p.getByText(pt.projects[0].description);
  const cut = () => description.evaluate(el => el.scrollHeight > el.clientHeight + 1);
  expect(await cut()).toBe(true);

  const more = p.getByRole('button', { name: pt.ui.readMore });
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  await more.tap();
  const less = p.getByRole('button', { name: pt.ui.readLess });
  await expect(less).toHaveAttribute('aria-expanded', 'true');
  expect(await cut()).toBe(false);
  await expect(counter(page)).toHaveText(`1 / ${total}`);

  await less.tap();
  await expect(p.getByRole('button', { name: pt.ui.readMore })).toHaveAttribute('aria-expanded', 'false');
  expect(await cut()).toBe(true);
});

test('"Ver demo" abre o Vídeo do projeto na vertical e ele fecha', async ({ page }) => {
  await open(page);
  const project = pt.projects.find(p => p.video?.vertical)!;
  await swipeTo(page, pt.projects.indexOf(project));
  const opener = pageOf(page, project.title).getByRole('button', { name: fill(pt.ui.viewDemoLabel, { title: project.title }) });
  await opener.tap();
  const dialog = page.getByRole('dialog', { name: fill(pt.ui.videoLabel, { title: project.title }) });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('video')).toHaveAttribute('src', project.video!.vertical!);
  await dialog.getByRole('button', { name: pt.ui.closeVideo }).tap();
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test.describe('animação junto ao título', () => {
  const lottie = (page: Page) => tela(page).locator('[data-lottie] svg');
  const frame = (page: Page) => lottie(page).evaluate(el => el.innerHTML);

  test('fica ao lado do título e se mexe', async ({ page }) => {
    await open(page);
    await expect(lottie(page)).toBeVisible();
    const title = (await tela(page).getByRole('heading', { name: pt.content.projects.label, exact: true }).boundingBox())!;
    const fish = (await lottie(page).boundingBox())!;
    // Pequena e na mesma faixa do título.
    expect(fish.width).toBeLessThanOrEqual(page.viewportSize()!.width / 2);
    expect(fish.y).toBeLessThan(title.y + title.height + 48);
    const before = await frame(page);
    await page.waitForTimeout(600);
    expect(await frame(page)).not.toBe(before);
  });

  test('para com movimento reduzido', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(lottie(page)).toBeVisible();
    const before = await frame(page);
    await page.waitForTimeout(600);
    expect(await frame(page)).toBe(before);
  });
});

test('texto corrido de 16px ou mais, e nada abaixo de 14px', async ({ page }) => {
  await open(page);
  const px = (selector: string) =>
    tela(page).locator(selector).evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  for (const size of await px('p')) expect(size).toBeGreaterThanOrEqual(16);
  for (const size of await px('h2, h3, dt, dd, li, span, a, button')) expect(size).toBeGreaterThanOrEqual(14);
});

test('toques de 44px ou mais', async ({ page }) => {
  await open(page);
  for (const target of await tela(page).locator('a, button').all()) {
    const box = (await target.boundingBox())!;
    const label = (await target.textContent()) ?? '';
    expect(box.width, label).toBeGreaterThanOrEqual(44);
    expect(box.height, label).toBeGreaterThanOrEqual(44);
  }
});

test.describe('contraste sobre o Mar', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(mode, async ({ page }) => {
      // Uma captura por texto medido.
      test.setTimeout(90_000);
      await open(page, '/', mode);
      await page.waitForTimeout(1200);
      const header = tela(page).locator('h2, [data-contador]');
      const current = pages(page).first().locator('h3, p, dt, dd, li, [data-relacao], [data-fora-do-ar]');
      for (const text of [...(await header.all()), ...(await current.all())]) {
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
    // O texto da página à mostra não sai dela pela direita.
    const right = await pages(page)
      .first()
      .locator('h3, p, dd, li, a, button')
      .evaluateAll(els => Math.max(...els.map(el => el.getBoundingClientRect().right)));
    expect(right, `${viewport.width}px`).toBeLessThanOrEqual(viewport.width);
    await next(page).tap();
    await expect(counter(page)).toHaveText(`2 / ${total}`);
  }
});
