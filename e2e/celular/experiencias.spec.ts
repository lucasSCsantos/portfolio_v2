import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import { fill } from '../../src/meta/dictionaries/types';
import { MIN_CONTRAST, worstContrast } from '../contrast';

// A Tela de Experiências da Versão para celular: uma lista que abre e fecha, e depois a formação e os idiomas.

const STORAGE_KEY = 'cena-modo';

const jobs = (page: Page) => page.locator('[data-tela="experiencias"]');
const summary = (page: Page, company: string) => jobs(page).getByRole('button', { name: new RegExp(`^${company}`) });

async function open(page: Page, path = '/', mode?: string) {
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route => route.fulfill({ status: 502, json: { error: 'clima indisponível' } }));
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
  await jobs(page).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(jobs(page).locator('#experiencias')).toBeInViewport();
}

test('a primeira Experiência começa aberta; abrir outra fecha a anterior; tocar de novo fecha', async ({ page }) => {
  await open(page);
  const [first, second] = pt.experiences;

  await expect(summary(page, first.company)).toHaveAttribute('aria-expanded', 'true');
  await expect(jobs(page).getByText(first.achievements[0])).toBeVisible();
  for (const { company } of pt.experiences.slice(1))
    await expect(summary(page, company)).toHaveAttribute('aria-expanded', 'false');
  await expect(jobs(page).getByText(second.achievements[0])).toBeHidden();

  await summary(page, second.company).tap();
  await expect(summary(page, second.company)).toHaveAttribute('aria-expanded', 'true');
  await expect(jobs(page).getByText(second.achievements[0])).toBeVisible();
  await expect(summary(page, first.company)).toHaveAttribute('aria-expanded', 'false');
  await expect(jobs(page).getByText(first.achievements[0])).toBeHidden();

  await summary(page, second.company).tap();
  await expect(summary(page, second.company)).toHaveAttribute('aria-expanded', 'false');
  await expect(jobs(page).getByText(second.achievements[0])).toBeHidden();
});

for (const dict of [pt, en]) {
  test(`${dict.locale}: todas as Experiências, a formação e os idiomas vêm do Dicionário`, async ({ page }) => {
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    await expect(jobs(page).getByRole('heading', { name: dict.content.jobs.label })).toBeVisible();
    await expect(jobs(page).getByText(dict.content.jobs.title)).toBeVisible();

    for (const job of dict.experiences) {
      const button = summary(page, job.company);
      for (const text of [job.role, job.period, job.kind, job.note].filter(Boolean))
        await expect(button).toContainText(text!);
      if ((await button.getAttribute('aria-expanded')) === 'false') await button.tap();
      const panel = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`);
      if (job.highlight) await expect(panel.getByText(job.highlight)).toBeVisible();
      const achievements = panel.getByRole('list', { name: dict.ui.achievements }).getByRole('listitem');
      await expect(achievements).toHaveText(job.achievements);
      const techs = panel.getByRole('list', { name: dict.ui.technologies }).getByRole('listitem');
      await expect(techs).toHaveText(job.techs);
      if (job.projectTitle)
        await expect(panel.getByRole('link', { name: job.projectTitle })).toHaveAttribute('href', '#projetos');
    }

    const education = jobs(page).getByRole('list', { name: dict.educationLabels.title });
    for (const item of dict.education)
      await expect(education).toContainText(`${item.title}${item.institution} · ${item.period}`);
    const languages = jobs(page).getByRole('list', { name: dict.educationLabels.languages });
    for (const lang of dict.languages)
      await expect(languages).toContainText(lang.name + fill(dict.ui.level, { level: lang.level }));
  });
}

test('a Tela, mais alta que o celular, rola livre sem o encaixe puxar no meio', async ({ page }) => {
  await open(page);
  const { top, height } = await jobs(page).evaluate(el => ({
    top: el.getBoundingClientRect().top + window.scrollY,
    height: el.getBoundingClientRect().height
  }));
  const viewport = page.viewportSize()!.height;
  expect(height).toBeGreaterThan(viewport);
  const middle = Math.round(top + (height - viewport) / 2);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), middle);
  await page.waitForTimeout(1000);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - middle)).toBeLessThanOrEqual(2);
});

test('texto corrido de 16px ou mais, e nada abaixo de 14px', async ({ page }) => {
  await open(page);
  const px = (selector: string) =>
    jobs(page).locator(selector).evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  // As realizações, o destaque, a frase do Projeto e os nomes da formação são texto corrido.
  for (const size of [...(await px('p:not(:first-child)')), ...(await px('ul ul:first-of-type > li')), ...(await px('h3 + ul strong'))])
    expect(size).toBeGreaterThanOrEqual(16);
  for (const size of await px('h2, h3, p, strong, small, span, li')) expect(size).toBeGreaterThanOrEqual(14);
});

test('toques de 44px ou mais, inclusive o link do Projeto', async ({ page }) => {
  await open(page);
  await summary(page, 'IASOS').tap();
  for (const target of await jobs(page).locator('a, button').filter({ visible: true }).all()) {
    const box = (await target.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe('contraste sobre o Mar', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(mode, async ({ page }) => {
      // Muitos textos para medir, um a um.
      test.setTimeout(90_000);
      await open(page, '/', mode);
      await summary(page, 'IASOS').tap();
      // Espera a entrada e a abertura terminarem: a medida é do texto já formado.
      await page.waitForTimeout(1200);
      const texts = jobs(page)
        .locator('h2, div > h3, p, strong, small, button > span > span, li li, h3 + ul li')
        .filter({ visible: true });
      for (const text of await texts.all()) {
        await text.scrollIntoViewIfNeeded();
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
    const right = await jobs(page)
      .locator('h2, h3, p, strong, li')
      .evaluateAll(els => Math.max(...els.map(el => el.getBoundingClientRect().right)));
    expect(right, `${viewport.width}px`).toBeLessThanOrEqual(viewport.width);
  }
});
