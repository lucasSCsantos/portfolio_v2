import { test, expect, type Page } from '@playwright/test';
import profile from '../src/meta/profile';

const SECTIONS = [
  '#sobre',
  '#projetos',
  '#experiencias',
  '#servicos',
  '#habilidades',
  '#contato'
];

// Posição de todos os elementos da página: se nada se move, os dois retratos são iguais.
const snapshotRects = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll('body *')).map(el => {
      const { x, y, width, height } = el.getBoundingClientRect();
      return `${x},${y},${width},${height}`;
    })
  );

const activeSlide = (page: Page) =>
  page.locator('.swiper-slide-active').first().innerText();

test.describe('estrutura e nomes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('há um único título de nível 1, com o cargo, e as seções usam nível 2', async ({
    page
  }) => {
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(profile.role);

    for (const section of SECTIONS) {
      await expect(
        page.locator(section).getByRole('heading', { level: 2 }),
        `seção ${section}`
      ).toHaveCount(1);
    }
  });

  test('todo link ou botão visível tem nome acessível', async ({ page }) => {
    const controls = await page
      .locator('a[href], button, [role="button"]')
      .all();
    expect(controls.length).toBeGreaterThan(0);

    for (const control of controls) {
      if (!(await control.isVisible())) continue;
      await expect(control).toHaveAccessibleName(/\S/);
    }
  });

  test('os quatro ícones de rede do Sobre têm nome acessível', async ({
    page
  }) => {
    const about = page.locator('#sobre');
    for (const name of [/whatsapp/i, /linkedin/i, /instagram/i, /github/i]) {
      await expect(about.getByRole('link', { name })).toHaveCount(1);
    }
  });

  test('imagens decorativas têm alt vazio e fotos reais citam o nome público', async ({
    page
  }) => {
    const alts = await page
      .locator('img')
      .evaluateAll(imgs => imgs.map(img => img.getAttribute('alt')));
    expect(alts.length).toBeGreaterThan(0);

    for (const alt of alts) {
      expect(alt, 'toda imagem declara alt').not.toBeNull();
      if (alt !== '') expect(alt).toContain(profile.name);
    }
    // As fotos reais continuam descritas.
    expect(alts.filter(alt => alt?.includes(profile.name)).length).toBeGreaterThan(0);
  });
});

test.describe('teclado', () => {
  test('o link "pular para o conteúdo" é o primeiro foco e leva ao conteúdo principal', async ({
    page
  }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skip = page.getByRole('link', { name: /pular para o conteúdo/i });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#conteudo$/);
    await expect(page.locator('main')).toBeFocused();
  });

  test('o foco por teclado é visível em links e botões', async ({ page }) => {
    await page.goto('/');

    const seen = new Set<string>();
    for (let step = 0; step < 40; step++) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || !el.matches('a, button, [role="button"]')) return null;
        const style = getComputedStyle(el);
        return {
          id: `${el.tagName}:${el.textContent?.trim().slice(0, 30)}:${el.getAttribute('href')}`,
          outline: parseFloat(style.outlineWidth),
          outlineStyle: style.outlineStyle,
          ring: style.boxShadow !== 'none'
        };
      });
      if (!focus) continue;
      seen.add(focus.id);
      const visible =
        (focus.outlineStyle !== 'none' && focus.outline >= 2) || focus.ring;
      expect(visible, `sem indicador de foco em ${focus.id}`).toBe(true);
    }
    expect(seen.size).toBeGreaterThan(5);
  });
});

test.describe('rolagem sem spinner', () => {
  test('a rolagem não depende de JavaScript e não há spinner de carregamento', async ({
    browser
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    await expect(page.locator('body')).not.toHaveCSS('overflow-y', 'hidden');
    await page.mouse.move(400, 400);
    await page.mouse.wheel(0, 800);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);

    expect(await page.content()).not.toContain('@keyframes spin');
    await context.close();
  });
});

test.describe('reduzir movimento', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nada decorativo se move ao longo do tempo', async ({ page }) => {
    await page.goto('/');
    // Passa as entradas do Hero (a última termina em ~2,8s).
    await page.waitForTimeout(3500);

    for (const where of [0, 1500, 4000]) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), where);
      await page.waitForTimeout(600);
      const before = await snapshotRects(page);
      await page.waitForTimeout(2500);
      const after = await snapshotRects(page);
      expect(after, `rolagem em ${where}px`).toEqual(before);
    }
  });

  test('a Página de Links também fica parada', async ({ page }) => {
    await page.goto('/links');
    await page.waitForTimeout(3500);
    const before = await snapshotRects(page);
    await page.waitForTimeout(2500);
    expect(await snapshotRects(page)).toEqual(before);
  });

  test('o carrossel não avança sozinho', async ({ page }) => {
    await page.goto('/');
    await page.locator('.swiper-slide-active').first().waitFor({ state: 'attached' });
    const first = await activeSlide(page);
    await page.waitForTimeout(4500);
    expect(await activeSlide(page)).toBe(first);
  });
});

test.describe('movimento normal', () => {
  test('o carrossel avança sozinho', async ({ page }) => {
    await page.goto('/');
    await page.locator('.swiper-slide-active').first().waitFor({ state: 'attached' });
    const first = await activeSlide(page);
    await expect.poll(() => activeSlide(page), { timeout: 8000 }).not.toBe(first);
  });

  test('o carrossel pausa com o mouse em cima', async ({ page }) => {
    await page.goto('/');
    const swiper = page.locator('.swiper').first();
    await swiper.scrollIntoViewIfNeeded();
    await swiper.hover();
    const first = await activeSlide(page);
    await page.waitForTimeout(4500);
    expect(await activeSlide(page)).toBe(first);
  });

  test('o carrossel pausa quando algo dentro dele tem foco', async ({ page }) => {
    await page.goto('/');
    const control = page.locator('.swiper-slide-active button').first();
    await control.focus();
    await expect(control).toBeFocused();
    await page.mouse.move(0, 0);
    const first = await activeSlide(page);
    await page.waitForTimeout(4500);
    expect(await activeSlide(page)).toBe(first);
  });

  test('a decoração se move (controle do teste de reduzir movimento)', async ({
    page
  }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
    const before = await snapshotRects(page);
    await page.waitForTimeout(1500);
    expect(await snapshotRects(page)).not.toEqual(before);
  });
});
