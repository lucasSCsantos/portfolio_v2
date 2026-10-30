import { test, expect, type Page } from '@playwright/test';
import profile from '../src/meta/profile';

const FULL_NAME_HINTS = /Santana|Santos/;
const OLD_DOMAIN = /lucascristovam\.com/;

const normalize = (text: string | null) =>
  (text ?? '').replace(/\s+/g, ' ').trim();

// Textos de metadados que o visitante ou os buscadores veem.
async function metadataText(page: Page) {
  return page.evaluate(() => {
    const metas = Array.from(document.head.querySelectorAll('meta, link')).map(
      (el) => el.getAttribute('content') ?? el.getAttribute('href') ?? ''
    );
    return [document.title, ...metas].join('\n');
  });
}

test.describe('página principal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('o nome público é o mesmo em todo o site', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(profile.name));

    const header = normalize(await page.locator('header').first().innerText());
    expect(header).toContain(profile.name);

    const aboutTitle = page.locator('#sobre').getByRole('heading', {
      level: 2
    });
    await expect(aboutTitle).toHaveText(profile.name);

    const footer = normalize(await page.locator('footer').innerText());
    expect(footer).toContain(`© ${new Date().getFullYear()} ${profile.name}`);
  });

  test('o cargo é o mesmo no Hero e nos metadados', async ({ page }) => {
    // Hero: o cargo é o título principal (a unicidade do h1 é de outra ticket).
    const hero = page.getByRole('heading', { name: profile.role, level: 1 });
    await expect(hero).toHaveCount(1);

    const meta = await metadataText(page);
    expect(meta).toContain(profile.role);
    expect(meta).not.toMatch(/full stack/i);
  });

  test('nenhum texto visível nem metadado usa nomes ou domínio antigos', async ({
    page
  }) => {
    const visible = await page.locator('body').innerText();
    expect(visible).not.toMatch(FULL_NAME_HINTS);
    expect(visible).not.toMatch(OLD_DOMAIN);

    const meta = await metadataText(page);
    expect(meta).not.toMatch(FULL_NAME_HINTS);
    expect(meta).not.toMatch(OLD_DOMAIN);
  });

  test('a experiência declarada é calculada a partir do ano de início', async ({
    page
  }) => {
    const years = new Date().getFullYear() - profile.careerStartYear;
    await expect(page.locator('#sobre')).toContainText(`+${years} anos`);
  });

  test('o endereço canônico é o domínio publicado', async ({ page }) => {
    const og = await page
      .locator('meta[property="og:url"]')
      .getAttribute('content');
    expect(og).toBe(profile.siteUrl);
  });

  test('as imagens de foto vêm dos caminhos da identidade', async ({
    page
  }) => {
    const sources = await page
      .locator('img')
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src') ?? ''));
    const decoded = sources.map((src) =>
      decodeURIComponent(new URL(src, 'http://x').searchParams.get('url') ?? src)
    );
    expect(decoded).toContain(profile.photos.avatar);
    expect(decoded).toContain(profile.photos.about);
  });
});

test.describe('página de links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/links');
  });

  test('mostra o mesmo nome e o mesmo cargo do portfólio', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(profile.name));
    const body = normalize(await page.locator('body').innerText());
    expect(body).toContain(profile.name);
    expect(normalize(await page.getByRole('heading', { level: 1 }).innerText()))
      .toBe(profile.role);

    const meta = await metadataText(page);
    expect(meta).toContain(profile.role);
  });

  test('não usa nomes ou domínio antigos', async ({ page }) => {
    const text = (await page.locator('body').innerText()) + (await metadataText(page));
    expect(text).not.toMatch(FULL_NAME_HINTS);
    expect(text).not.toMatch(OLD_DOMAIN);
  });
});

test('o currículo provisório é um PDF servido pelo site', async ({ request }) => {
  const response = await request.get(profile.resumePath);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
});
