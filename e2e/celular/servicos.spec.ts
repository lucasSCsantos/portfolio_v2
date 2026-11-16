import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import profile from '../../src/meta/profile';
import { MIN_CONTRAST, worstContrast } from '../contrast';

// A Tela de Serviços da Versão para celular: uma lista numerada, cada Serviço com a sua prova e o seu WhatsApp.

const STORAGE_KEY = 'cena-modo';

const services = (page: Page) => page.locator('[data-tela="servicos"]');
const list = (page: Page, name = pt.content.services.title) => services(page).getByRole('list', { name });

async function open(page: Page, path = '/', mode?: string) {
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route => route.fulfill({ status: 502, json: { error: 'clima indisponível' } }));
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
  await services(page).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(services(page).locator('#servicos')).toBeInViewport();
}

const topOf = (page: Page, id: string) =>
  page.locator(`[data-tela="${id}"]`).evaluate(el => Math.round(el.getBoundingClientRect().top) || 0);

for (const dict of [pt, en]) {
  test(`${dict.locale}: botões uniformes e contidos nos cards`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    await page.evaluate(() => document.fonts.ready);

    for (const viewport of [page.viewportSize()!, { width: 320, height: 640 }, { width: 800, height: 380 }]) {
      await page.setViewportSize(viewport);
      const sizes = await list(page, dict.content.services.title).getByRole('listitem').evaluateAll(cards =>
        cards.map(card => {
          const button = card.querySelector<HTMLAnchorElement>('a[href^="https://wa.me/"]')!;
          const bounds = button.getBoundingClientRect();
          const cardBounds = card.getBoundingClientRect();
          const style = getComputedStyle(card);
          return {
            width: bounds.width,
            height: bounds.height,
            left: bounds.left - cardBounds.left - parseFloat(style.paddingLeft) - parseFloat(style.borderLeftWidth),
            right: cardBounds.right - bounds.right - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth),
            fits: button.scrollWidth <= button.clientWidth && button.scrollHeight <= button.clientHeight
          };
        })
      );

      expect(sizes).toHaveLength(dict.services.length);
      for (const size of sizes) {
        expect(size.width, `${viewport.width}px`).toBeCloseTo(sizes[0].width, 0);
        expect(size.height, `${viewport.width}px`).toBeCloseTo(sizes[0].height, 0);
        expect(size.height).toBeGreaterThanOrEqual(48);
        expect(Math.abs(size.left)).toBeLessThan(1);
        expect(Math.abs(size.right)).toBeLessThan(1);
        expect(size.fits).toBe(true);
      }
    }
  });

  test(`${dict.locale}: cada Serviço com título, descrição, prova e botão, numa lista numerada`, async ({ page }) => {
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    const copy = dict.content.services;
    await expect(services(page).getByRole('heading', { name: copy.label })).toBeVisible();

    const items = list(page, copy.title).getByRole('listitem');
    await expect(items).toHaveCount(dict.services.length);
    expect(await list(page, copy.title).evaluate(el => el.tagName)).toBe('OL');
    for (let i = 0; i < dict.services.length; i++) {
      const service = dict.services[i];
      const item = items.nth(i);
      await expect(item.getByRole('heading', { name: service.title })).toBeVisible();
      await expect(item.getByText(service.text)).toBeVisible();
      await expect(item).toContainText(copy.proofLabel);
      await expect(item.getByRole('link', { name: service.proof.name })).toHaveAttribute('href', service.proof.href);
      await expect(item.getByRole('link', { name: service.buttonLabel })).toHaveAttribute(
        'href',
        `https://wa.me/${profile.whatsappNumber}?text=${service.message}`
      );
    }
  });
}

test('o link da prova leva à Tela do Projeto ou da Experiência', async ({ page }) => {
  for (const href of ['#projetos', '#experiencias']) {
    await open(page);
    const service = pt.services.find(({ proof }) => proof.href === href)!;
    await list(page).getByRole('link', { name: service.proof.name }).tap();
    await expect.poll(() => topOf(page, href.slice(1)), { timeout: 5000 }).toBe(0);
  }
});

test('o botão abre o WhatsApp numa nova aba', async ({ page }) => {
  await open(page);
  const button = list(page).getByRole('link', { name: pt.services[0].buttonLabel });
  await expect(button).toHaveAttribute('target', '_blank');
  await expect(button).toHaveAttribute('rel', /noopener/);
});

test.describe('animação', () => {
  test('a animação ocupa a largura da Tela, sem corais', async ({ page }) => {
    await open(page);
    const animation = services(page).locator('[data-lottie] svg');
    await expect(animation).toBeVisible();
    const box = (await animation.boundingBox())!;
    expect(box.x).toBeCloseTo(0, 0);
    expect(box.width).toBeCloseTo(page.viewportSize()!.width, 0);
    expect(await services(page).locator('[data-lottie]').evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');

    await expect(services(page).locator('[data-corais]')).toHaveCount(0);
  });

  test('com movimento reduzido, a animação não roda', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(services(page).locator('[data-corais]')).toHaveCount(0);
    await expect(services(page).locator('[data-lottie] svg')).toHaveCount(0);
  });
});

test('texto corrido de 16px ou mais, e nada abaixo de 14px', async ({ page }) => {
  await open(page);
  const px = (selector: string) =>
    services(page).locator(selector).evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  for (const size of await px('p')) expect(size).toBeGreaterThanOrEqual(16);
  for (const size of await px('h2, h3, a, span')) expect(size).toBeGreaterThanOrEqual(14);
});

test('toques de 44px ou mais', async ({ page }) => {
  await open(page);
  for (const target of await services(page).locator('a, button').all()) {
    const box = (await target.boundingBox())!;
    const label = (await target.textContent()) ?? '';
    expect(Math.round(box.width), label).toBeGreaterThanOrEqual(44);
    expect(Math.round(box.height), label).toBeGreaterThanOrEqual(44);
  }
});

test.describe('contraste sobre o Mar', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(mode, async ({ page }) => {
      // Uma captura por texto, e a Tela tem muitos: à noite cada uma demora mais.
      test.setTimeout(120_000);
      await open(page, '/', mode);
      // Espera a entrada terminar: a medida é do texto já formado.
      await page.waitForTimeout(1200);
      const texts = services(page).locator('h2, h3, p, li > span, li a');
      for (const text of await texts.all()) {
        await text.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
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
    // Nenhum texto nem botão sai da Tela pela direita.
    const right = await services(page)
      .locator('h2, h3, p, li a')
      .evaluateAll(els => Math.max(...els.map(el => el.getBoundingClientRect().right)));
    expect(right, `${viewport.width}px`).toBeLessThanOrEqual(viewport.width);
  }
});
