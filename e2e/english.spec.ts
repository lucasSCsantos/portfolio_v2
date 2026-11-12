import { test, expect, type Page } from '@playwright/test';
import profile from '../src/meta/profile';
import pt from '../src/meta/dictionaries/pt';
import en from '../src/meta/dictionaries/en';

// Toda a lista de chaves de um valor, com os índices de array.
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return [
      `${prefix}[${value.length}]`,
      ...value.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`))
    ];
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      keyPaths(item, prefix ? `${prefix}.${key}` : key)
    );
  }
  return [prefix];
}

test('o inglês tem as mesmas chaves do português', () => {
  // `skillKinds` é indexado pelo texto em português: as chaves não coincidem.
  const strip = ({ skillKinds, ...rest }: typeof pt) => rest;
  const sameShape = (a: typeof pt, b: typeof pt) =>
    expect(keyPaths(strip(a))).toEqual(keyPaths(strip(b)));
  sameShape(en, pt);
  expect(Object.keys(en.skillKinds)).toEqual(
    Object.values(pt.skillKinds).filter((kind, i, all) => all.indexOf(kind) === i)
  );
});

test('nenhum texto do inglês ficou igual ao português por esquecimento', () => {
  // Nomes próprios, marcas e siglas podem coincidir; texto corrido não.
  const prose = (dict: typeof pt) => [
    dict.content.hero.valueProp,
    dict.content.about.bio,
    dict.content.contact.description,
    dict.content.work.description,
    ...dict.services.map(s => s.text),
    ...dict.projects.map(p => p.description),
    ...dict.experiences.flatMap(e => e.achievements)
  ];
  prose(pt).forEach((text, i) => expect(prose(en)[i]).not.toBe(text));
});

async function meta(page: Page, selector: string) {
  return page.locator(`head ${selector}`).first().getAttribute('content');
}

test.describe('/en', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('declara o idioma e traz título, descrição e canonical em inglês', async ({
    page
  }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(`${profile.name} - ${en.profile.role}`);
    expect(await meta(page, 'meta[name="description"]')).toBe(
      en.seo.description
    );
    expect(await meta(page, 'meta[property="og:locale"]')).toBe('en_US');
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${profile.siteUrl}/en`
    );
  });

  test('aponta com hreflang para os dois idiomas e x-default', async ({
    page
  }) => {
    const alternate = (lang: string) =>
      page.locator(`head link[rel="alternate"][hreflang="${lang}"]`);
    await expect(alternate('en')).toHaveAttribute(
      'href',
      `${profile.siteUrl}/en`
    );
    await expect(alternate('pt-BR')).toHaveAttribute(
      'href',
      new RegExp(`^${profile.siteUrl}/?$`)
    );
    await expect(alternate('x-default')).toHaveAttribute(
      'href',
      new RegExp(`^${profile.siteUrl}/?$`)
    );
  });

  test('mostra o conteúdo em inglês', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: en.profile.role })
    ).toBeVisible();
    await expect(page.getByText(en.content.hero.valueProp)).toBeVisible();
    for (const { text, path } of en.navLinks) {
      await expect(
        page.locator(`nav a[href="${path}"]`).first()
      ).toHaveText(text);
    }
    await expect(page.getByText('Todos os direitos')).toHaveCount(0);
  });

  test('o currículo em inglês existe e é um PDF', async ({ page, request }) => {
    const href = await page
      .locator('a[download]')
      .first()
      .getAttribute('href');
    expect(href).toBe(en.profile.resumePath);
    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/pdf');
  });

  test('tem imagem de prévia própria', async ({ page, request }) => {
    const ogImage = await meta(page, 'meta[property="og:image"]');
    expect(ogImage).toContain('/en/');
    const response = await request.get(new URL(ogImage!).pathname);
    expect(response.ok()).toBe(true);
  });
});

test.describe('botão de idioma', () => {
  test('na home em português marca PT e leva à versão em inglês', async ({
    page
  }) => {
    await page.goto('/');
    const group = page.getByRole('group', { name: pt.ui.languageSwitch });
    await expect(group.getByRole('link', { name: 'Português' })).toHaveAttribute(
      'aria-current',
      'true'
    );
    await group.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('em inglês marca EN e volta ao português', async ({ page }) => {
    await page.goto('/en');
    const group = page.getByRole('group', { name: en.ui.languageSwitch });
    await expect(group.getByRole('link', { name: 'English' })).toHaveAttribute(
      'aria-current',
      'true'
    );
    await group.getByRole('link', { name: 'Português' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  });

  test('mantém a seção em que a pessoa está', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
    await page
      .locator('nav a[href="#projetos"]')
      .first()
      .click();
    await expect(
      page.locator('nav a[href="#projetos"][aria-current="true"]').first()
    ).toBeVisible();
    await page.getByRole('link', { name: 'English' }).first().click();
    await expect(page).toHaveURL(/\/en#projetos$/);
  });

  test('cabe e é clicável no celular', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    const link = page.getByRole('link', { name: 'English' });
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(360);
    expect(box!.height).toBeGreaterThanOrEqual(32);
    await link.click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test('a página de links continua só em português e sem o botão', async ({
    page
  }) => {
    await page.goto('/links');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('link', { name: 'English' })).toHaveCount(0);
  });
});

test('o sitemap lista os dois idiomas com alternates', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain(`<loc>${profile.siteUrl}/en</loc>`);
  expect(xml).toContain('hreflang="en"');
  expect(xml).toContain('hreflang="pt-BR"');
});
