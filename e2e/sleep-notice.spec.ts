import { test, expect, type Page } from '@playwright/test';
import { isSleepTime } from '../src/app/lib/scene';
import pt from '../src/meta/dictionaries/pt';
import en from '../src/meta/dictionaries/en';

test.describe('hora do Aviso de sono', () => {
  const cases: [string, number, boolean][] = [
    ['21h59', 21 * 60 + 59, false],
    ['22h00', 22 * 60, true],
    ['meia-noite', 0, true],
    ['04h59', 4 * 60 + 59, true],
    ['05h00', 5 * 60, false],
    ['meio-dia', 12 * 60, false]
  ];

  for (const [name, minutes, expected] of cases) {
    test(`${name} em Salvador ${expected ? 'é' : 'não é'} hora de dormir`, () => {
      expect(isSleepTime(minutes)).toBe(expected);
    });
  }
});

// Instantes em UTC; Salvador é UTC-3 o ano todo.
const AT = {
  '21:59': '2026-11-13T00:59:00Z',
  '22:00': '2026-11-13T01:00:00Z',
  '04:59': '2026-11-13T07:59:00Z',
  '05:00': '2026-11-13T08:00:00Z'
} as const;

// Abre a home com o relógio do navegador fixado e espera as entradas do Hero.
async function openAt(page: Page, time: keyof typeof AT, path = '/') {
  await page.clock.setFixedTime(new Date(AT[time]));
  await page.goto(path);
  await page.waitForTimeout(3500);
}

const notice = (page: Page, text = pt.content.hero.sleepNotice) =>
  page.locator('#inicio').getByText(text, { exact: true });

const badge = (page: Page) =>
  page.locator('#inicio').getByText(pt.profile.availability, { exact: true });

// Dois fusos bem distantes de Salvador: o resultado não pode depender do fuso do navegador.
for (const timezoneId of ['Asia/Tokyo', 'America/Los_Angeles']) {
  test.describe(`Aviso de sono com o navegador em ${timezoneId}`, () => {
    test.use({ timezoneId });

    for (const [time, visible] of [
      ['21:59', false],
      ['22:00', true],
      ['04:59', true],
      ['05:00', false]
    ] as const) {
      test(`às ${time} de Salvador o aviso ${visible ? 'aparece' : 'não aparece'}`, async ({
        page
      }) => {
        await openAt(page, time);
        if (visible) await expect(notice(page)).toBeVisible();
        else await expect(notice(page)).toHaveCount(0);
        await expect(badge(page)).toBeVisible();
      });
    }
  });
}

test.describe('Aviso de sono', () => {
  test('aparece em dia', async ({ page }) => {
    await openAt(page, '22:00');
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'dia');
    await expect(notice(page)).toBeVisible();
  });

  test('aparece também em noite', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('cena-modo', 'noite'));
    await openAt(page, '22:00');
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'noite');
    await expect(notice(page)).toBeVisible();
  });

  test('aparece em inglês com o texto do Dicionário inglês', async ({ page }) => {
    await openAt(page, '22:00', '/en');
    await expect(notice(page, en.content.hero.sleepNotice)).toBeVisible();
  });

  test('não muda o selo nem desloca o que vem abaixo', async ({ page }) => {
    const layout = async () => {
      const hero = page.locator('#inicio');
      const box = async (locator: ReturnType<Page['locator']>) => {
        const { x, y, width, height } = (await locator.boundingBox())!;
        return { x, y, width, height };
      };
      return {
        badge: await box(badge(page)),
        cta: await box(hero.getByRole('button', { name: pt.content.hero.cta })),
        stats: await box(hero.getByText(pt.content.hero.highlights[0].label, { exact: true }))
      };
    };

    await openAt(page, '21:59');
    const awake = await layout();
    const awakeBadge = await badge(page).evaluate(el => el.outerHTML);

    await openAt(page, '22:00');
    await expect(notice(page)).toBeVisible();
    expect(await layout()).toEqual(awake);
    expect(await badge(page).evaluate(el => el.outerHTML)).toBe(awakeBadge);
  });
});
