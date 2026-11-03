import { test, expect, type Page } from '@playwright/test';
import { MIN_CONTRAST, worstContrast } from './contrast';
import profile from '../src/meta/profile';
import content from '../src/meta/content';
import projects from '../src/meta/projects';

const SECTIONS = [
  ['#sobre', 'Sobre mim'],
  ['#projetos', 'Projetos'],
  ['#experiencias', 'Experiências'],
  ['#servicos', 'Serviços'],
  ['#habilidades', 'Habilidades'],
  ['#contato', 'Contato']
] as const;

// Espera as entradas animadas do Hero terminarem.
async function openHero(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(3500);
}

test.describe('Hero', () => {
  test.beforeEach(async ({ page }) => {
    await openHero(page);
  });

  test('mostra cargo, frase de valor, números, CTAs, currículo e disponibilidade', async ({
    page
  }) => {
    const hero = page.locator('#inicio');

    await expect(
      hero.getByRole('heading', { level: 1, name: profile.role })
    ).toBeVisible();
    await expect(hero.getByText(content.hero.valueProp)).toBeVisible();

    expect(content.hero.highlights).toHaveLength(4);
    for (const { value, label } of content.hero.highlights) {
      await expect(hero.getByText(value, { exact: true })).toBeVisible();
      await expect(hero.getByText(label, { exact: true })).toBeVisible();
    }

    await expect(
      hero.getByRole('button', { name: content.hero.cta })
    ).toBeVisible();
    await expect(
      hero.getByRole('button', { name: content.hero.secondaryCta })
    ).toBeVisible();
    await expect(
      hero.getByRole('link', { name: content.hero.resumeCta })
    ).toBeVisible();
    await expect(hero.getByText(profile.availability)).toBeVisible();
  });

  test('os números vêm dos valores de conteúdo e a latência não aparece', async ({
    page
  }) => {
    const values = content.hero.highlights.map(h => h.value).join(' ');
    expect(values).toContain(`Desde ${profile.careerStartYear}`);
    expect(content.hero.highlights.map(h => h.value)).toContain(
      String(projects.length)
    );
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/30\s?%/);
    expect(body).not.toMatch(/lat[eê]ncia/i);
  });

  test('o botão de currículo baixa o PDF provisório', async ({ page }) => {
    const link = page
      .locator('#inicio')
      .getByRole('link', { name: content.hero.resumeCta });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      link.click()
    ]);
    expect(download.suggestedFilename()).toBe(
      profile.resumePath.replace(/^\//, '')
    );
  });

  test('o CTA principal leva à Seção de Contato e o secundário aos Projetos', async ({
    page
  }) => {
    const hero = page.locator('#inicio');
    await hero.getByRole('button', { name: content.hero.cta }).click();
    await expect
      .poll(async () =>
        page.locator('#contato').evaluate(el => Math.abs(el.getBoundingClientRect().top))
      )
      .toBeLessThan(200);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await hero.getByRole('button', { name: content.hero.secondaryCta }).click();
    await expect
      .poll(async () =>
        page.locator('#projetos').evaluate(el => Math.abs(el.getBoundingClientRect().top))
      )
      .toBeLessThan(200);
  });

  test('os CTAs têm contraste de 4,5:1 ou mais sobre o fundo real', async ({
    page
  }) => {
    const hero = page.locator('#inicio');
    for (const target of [
      hero.getByRole('button', { name: content.hero.cta }),
      hero.getByRole('button', { name: content.hero.secondaryCta }),
      hero.getByRole('link', { name: content.hero.resumeCta })
    ]) {
      expect(await worstContrast(page, target)).toBeGreaterThanOrEqual(
        MIN_CONTRAST
      );
    }
  });

  test('o título não é cortado pela onda nem pela borda do Hero', async ({
    page
  }) => {
    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    const stats = await page
      .locator('#inicio')
      .getByText(content.hero.highlights[0].label, { exact: true })
      .boundingBox();
    const hero = await page.locator('#inicio').boundingBox();
    expect(title!.y).toBeGreaterThanOrEqual(hero!.y);
    expect(title!.y + title!.height).toBeLessThanOrEqual(stats!.y);
  });
});

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await openHero(page);
  });

  test('o logo mostra o nome público', async ({ page }) => {
    await expect(
      page.locator('header').getByRole('link', { name: profile.name })
    ).toBeVisible();
  });

  test('tem um CTA visível, também depois de rolar', async ({ page }) => {
    const cta = page
      .locator('header')
      .getByRole('link', { name: content.header.cta })
      .first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', profile.resumePath);

    await page.locator('#projetos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(cta).toBeInViewport();
  });

  for (const [selector, label] of SECTIONS) {
    test(`ao rolar até ${selector} o item "${label}" fica destacado`, async ({
      page
    }) => {
      await page.locator(selector).first().scrollIntoViewIfNeeded();
      await page.evaluate(sel => {
        const el = document.querySelector(sel)!;
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 40,
          behavior: 'instant'
        });
      }, selector);
      await page.waitForTimeout(600);

      const active = page.locator('header nav a[aria-current="true"]:visible');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveText(label);
    });
  }

  test('no topo nenhum item está destacado', async ({ page }) => {
    await expect(
      page.locator('header nav a[aria-current="true"]')
    ).toHaveCount(0);
  });
});
