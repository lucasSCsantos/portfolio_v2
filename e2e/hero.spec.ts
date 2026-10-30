import { test, expect, type Locator, type Page } from '@playwright/test';
import profile from '../src/meta/profile';
import content from '../src/meta/content';
import projects from '../src/meta/projects';
import { experienceYears } from '../src/meta/profile';

const MIN_CONTRAST = 4.5;

const SECTIONS = [
  ['#sobre', 'Sobre mim'],
  ['#projetos', 'Projetos'],
  ['#experiencias', 'Experiências'],
  ['#servicos', 'Serviços'],
  ['#habilidades', 'Habilidades'],
  ['#contato', 'Contato']
] as const;

const luminance = ([r, g, b]: number[]) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const parse = (css: string) =>
  (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);

// Espera as entradas animadas do Hero terminarem.
async function openHero(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(3500);
}

// Pior contraste entre o texto e o que realmente aparece atrás dele (fundo + vidro + onda).
async function worstContrast(page: Page, target: Locator) {
  // Mede só a área do texto, sem a borda nem os cantos arredondados do botão.
  const box = await target.evaluate(el => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const { x, y, width, height } = r.getBoundingClientRect();
    return { x, y, width, height };
  });
  const color = parse(await target.evaluate(el => getComputedStyle(el).color));
  const handle = await target.elementHandle();
  await handle!.evaluate(el => {
    const h = el as HTMLElement;
    // Sem transição, a cor some na hora e a captura não pega o meio do caminho.
    for (const n of [h, ...Array.from(h.querySelectorAll<HTMLElement>("*"))]) {
      n.style.setProperty('transition', 'none', 'important');
      n.style.setProperty('color', 'transparent', 'important');
    }
  });
  const shot = await page.screenshot({ clip: box });
  await handle!.evaluate(el => {
    const h = el as HTMLElement;
    for (const n of [h, ...Array.from(h.querySelectorAll<HTMLElement>("*"))]) {
      n.style.removeProperty('color');
      n.style.removeProperty('transition');
    }
  });
  const pixels = await page.evaluate(async (b64: string) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const out: number[][] = [];
    for (let i = 0; i < d.length; i += 4) out.push([d[i], d[i + 1], d[i + 2]]);
    return out;
  }, shot.toString('base64'));
  const textLum = luminance(color);
  const sorted = pixels
    .map(p => ({ p, l: luminance(p) }))
    .sort((a, b) => (textLum > 0.4 ? b.l - a.l : a.l - b.l));
  return ratio(color, sorted[Math.floor(pixels.length * 0.05)].p);
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
    expect(values).toContain(`+${experienceYears()} anos`);
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
