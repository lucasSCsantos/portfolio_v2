import { test, expect, type Page } from '@playwright/test';
import profile from '../src/meta/profile';

const OLD_DOMAIN = /lucascristovam\.com/;

const meta = (page: Page, selector: string) =>
  page.locator(`head ${selector}`).first().getAttribute('content');

for (const path of ['/', '/links']) {
  test.describe(`metadados de ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('tem título, descrição e canonical do endereço real', async ({
      page
    }) => {
      await expect(page).toHaveTitle(
        new RegExp(`${profile.name} - ${profile.role}`)
      );
      expect(await meta(page, 'meta[name="description"]')).toContain(
        profile.name
      );
      const canonical = await page
        .locator('head link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical).toBe(`${profile.siteUrl}${path === '/' ? '' : path}`);
    });

    test('tem imagem Open Graph e cartão grande do Twitter, e a imagem responde', async ({
      page,
      request
    }) => {
      const ogImage = await meta(page, 'meta[property="og:image"]');
      expect(ogImage).toBeTruthy();
      expect(await meta(page, 'meta[property="og:image:width"]')).toBe('1200');
      expect(await meta(page, 'meta[property="og:image:height"]')).toBe('630');
      expect(await meta(page, 'meta[name="twitter:card"]')).toBe(
        'summary_large_image'
      );
      expect(await meta(page, 'meta[name="twitter:image"]')).toBeTruthy();

      const response = await request.get(new URL(ogImage!).pathname);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('image/png');
    });

    test('nenhum metadado referencia o domínio antigo', async ({ page }) => {
      const head = await page.evaluate(() => document.head.innerHTML);
      expect(head).not.toMatch(OLD_DOMAIN);
    });
  });
}

test('a prévia da página de links é diferente da principal', async ({
  page
}) => {
  await page.goto('/');
  const home = await meta(page, 'meta[property="og:image"]');
  await page.goto('/links');
  const links = await meta(page, 'meta[property="og:image"]');
  expect(links).not.toBe(home);
});

test('sitemap lista as páginas com a URL canônica', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  expect(xml).toContain(`<loc>${profile.siteUrl}</loc>`);
  expect(xml).toContain(`<loc>${profile.siteUrl}/links</loc>`);
  expect(xml).not.toMatch(OLD_DOMAIN);
});

test('robots permite indexar e aponta para o sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBe(true);
  const txt = await response.text();
  expect(txt).toMatch(/Allow:\s*\//);
  expect(txt).toContain(`Sitemap: ${profile.siteUrl}/sitemap.xml`);
});

test('dados estruturados são uma Pessoa válida', async ({ page }) => {
  await page.goto('/');
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .innerText();
  const data = JSON.parse(raw);
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe(profile.name);
  expect(data.alternateName).toBe(profile.fullName);
  expect(data.jobTitle).toBe(profile.role);
  expect(data.url).toBe(profile.siteUrl);
  expect(data.sameAs).toEqual(
    expect.arrayContaining([profile.social.github, profile.social.linkedin])
  );
});
