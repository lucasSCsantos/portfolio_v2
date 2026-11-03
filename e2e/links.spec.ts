import { test, expect, type Page } from '@playwright/test';
import profile from '../src/meta/profile';
import { MIN_CONTRAST, worstContrast } from './contrast';

const LABELS = [
  'WhatsApp',
  'Meu portfólio',
  'LinkedIn',
  'GitHub',
  'Instagram',
  'E-mail'
];

const MIN_TOUCH_TARGET = 44;

const VIEWPORTS = [
  { name: 'celular comum', width: 390, height: 844 },
  { name: 'celular pequeno', width: 360, height: 640 },
  { name: 'celular mínimo', width: 320, height: 480 },
  { name: 'celular deitado', width: 360, height: 320 },
  { name: 'desktop', width: 1440, height: 900 }
];

async function openLinks(page: Page) {
  await page.goto('/links');
  await page.waitForTimeout(3500);
}

test.describe('Página de Links', () => {
  test('lista os Links na ordem combinada, com o WhatsApp como Link principal', async ({
    page
  }) => {
    await openLinks(page);
    const links = page.locator('main ul a');

    await expect(links).toHaveText(LABELS);
    await expect(links.nth(0)).toHaveAttribute(
      'href',
      new RegExp(`^${profile.social.whatsapp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?text=`)
    );
    await expect(links.nth(0)).toHaveAttribute('target', '_blank');
    await expect(links.nth(1)).toHaveAttribute('href', '/');
    await expect(links.nth(2)).toHaveAttribute('href', profile.social.linkedin);
    await expect(links.nth(3)).toHaveAttribute('href', profile.social.github);
    await expect(links.nth(4)).toHaveAttribute('href', profile.social.instagram);
    await expect(links.nth(5)).toHaveAttribute(
      'href',
      new RegExp(`^mailto:${profile.email}`)
    );
  });

  test('mostra a disponibilidade abaixo do título quando há altura', async ({
    page
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openLinks(page);
    const availability = page.getByText(profile.availability);
    await expect(availability).toBeVisible();

    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    const pill = await availability.boundingBox();
    expect(pill!.y).toBeGreaterThanOrEqual(title!.y + title!.height);
  });

  test('os Links já estão todos visíveis 2 s depois de abrir', async ({ page }) => {
    await page.goto('/links');
    await page.waitForTimeout(2000);
    const items = page.locator('main ul li');
    await expect(items).toHaveCount(LABELS.length);
    for (let i = 0; i < LABELS.length; i++) {
      await expect(items.nth(i), LABELS[i]).toHaveCSS('opacity', '1', {
        timeout: 100
      });
    }
  });

  test('com movimento reduzido os Links aparecem de imediato', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/links');
    await page.waitForTimeout(300);
    const items = page.locator('main ul li');
    for (let i = 0; i < LABELS.length; i++) {
      await expect(items.nth(i), LABELS[i]).toHaveCSS('opacity', '1', {
        timeout: 100
      });
    }
  });

  // As viewports acima são pontos; o topo corta o que não cabe, então varre as alturas entre elas.
  // Em retrato o piso é 320×480; deitado (e no desktop) a página cabe até 320 de altura.
  const SWEEPS = [
    { width: 320, minHeight: 480 },
    { width: 360, minHeight: 480 },
    { width: 390, minHeight: 480 },
    { width: 640, minHeight: 320 },
    { width: 1440, minHeight: 320 }
  ];
  for (const { width, minHeight } of SWEEPS) {
    test(`nenhuma altura de ${minHeight} a 900 corta o título nem faz rolar em ${width} de largura`, async ({
      page
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/links');
      await page.waitForTimeout(3000);

      for (let height = 900; height >= minHeight; height -= 20) {
        await page.setViewportSize({ width, height });
        const state = await page.evaluate(() => {
          const rect = (selector: string) =>
            document.querySelector(selector)!.getBoundingClientRect();
          const title = rect('h1');
          const first = rect('main ul a');
          const last = Array.from(document.querySelectorAll('main ul a')).pop()!
            .getBoundingClientRect();
          return {
            scrollsY:
              document.documentElement.scrollHeight - window.innerHeight,
            titleTop: title.top,
            titleGap: first.top - title.bottom,
            lastGap: window.innerHeight - last.bottom
          };
        });
        const at = `${width}×${height}`;
        expect(state.scrollsY, `rola em ${at}`).toBeLessThanOrEqual(0);
        expect(state.titleTop, `título acima da tela em ${at}`).toBeGreaterThanOrEqual(0);
        expect(state.titleGap, `título sobre a lista em ${at}`).toBeGreaterThanOrEqual(0);
        expect(state.lastGap, `lista fora da tela em ${at}`).toBeGreaterThanOrEqual(0);
      }
    });
  }

  // O vidro branco é vazado de propósito: o texto e o ícone mostram o mar atrás (contraste baixo,
  // decisão do projeto). Só o Link principal, de texto sólido, segue o mínimo de 4,5:1.
  for (const { name, width, height } of VIEWPORTS) {
    test(`o Link principal tem contraste de 4,5:1 ou mais sobre o vidro em ${name}`, async ({
      page
    }) => {
      await page.setViewportSize({ width, height });
      await openLinks(page);
      const text = page.locator('main ul a').getByText('WhatsApp', { exact: true });
      expect(await worstContrast(page, text)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
  }

  test('o texto e o ícone dos Links de vidro branco são vazados; os do Link principal não', async ({
    page
  }) => {
    await openLinks(page);
    const clip = (label: string) =>
      page
        .locator('main ul a')
        .filter({ hasText: label })
        .evaluate(el => {
          const style = getComputedStyle(el);
          return {
            clip: style.backgroundClip,
            color: style.color,
            icons: el.querySelectorAll('span[style*="--icon"]').length
          };
        });

    for (const label of LABELS.slice(1)) {
      const link = await clip(label);
      expect(link.clip, label).toContain('text');
      expect(link.color, label).toBe('rgba(0, 0, 0, 0)');
      expect(link.icons, label).toBe(1);
    }

    const principal = await clip('WhatsApp');
    expect(principal.clip).not.toContain('text');
    expect(principal.icons).toBe(0);
  });

  for (const { name, width, height } of VIEWPORTS) {
    test(`sem rolagem e com todos os Links tocáveis em ${name} (${width}×${height})`, async ({
      page
    }) => {
      await page.setViewportSize({ width, height });
      await openLinks(page);

      const overflow = await page.evaluate(() => ({
        x: document.documentElement.scrollWidth - window.innerWidth,
        y: document.documentElement.scrollHeight - window.innerHeight
      }));
      expect(overflow.x).toBeLessThanOrEqual(0);
      expect(overflow.y).toBeLessThanOrEqual(0);

      const links = page.locator('main ul a');
      await expect(links).toHaveCount(LABELS.length);

      // O topo corta o que não cabe: o título tem de aparecer inteiro acima da lista.
      const title = await page.getByRole('heading', { level: 1 }).boundingBox();
      const first = await links.first().boundingBox();
      expect(title!.y).toBeGreaterThanOrEqual(0);
      expect(title!.y + title!.height).toBeLessThanOrEqual(first!.y);

      for (const label of LABELS) {
        const box = await links.filter({ hasText: label }).boundingBox();
        expect(box, label).not.toBeNull();
        expect(box!.height, `${label}: altura`).toBeGreaterThanOrEqual(
          MIN_TOUCH_TARGET
        );
        expect(box!.x, `${label}: esquerda`).toBeGreaterThanOrEqual(0);
        expect(box!.y, `${label}: topo`).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width, `${label}: direita`).toBeLessThanOrEqual(width);
        expect(box!.y + box!.height, `${label}: base`).toBeLessThanOrEqual(height);
      }
    });
  }
});
