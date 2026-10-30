import { test, expect, type Page } from '@playwright/test';

const MIN_BODY_PX = 14;
const MIN_CONTRAST = 4.5;

// Elementos visíveis que têm texto próprio (não só descendentes).
const VISIBLE_TEXT = `
  Array.from(document.querySelectorAll('body *')).filter(el => {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) return false;
    const own = Array.from(el.childNodes).some(
      n => n.nodeType === 3 && n.textContent.trim().length > 0
    );
    if (!own) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return (
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      parseFloat(style.opacity) > 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  })
`;

async function loadAll(page: Page) {
  await page.goto('/');
  // Seções são carregadas sob demanda.
  await page.locator('footer').waitFor({ state: 'attached' });
  // Percorre a página para materializar as seções e terminar as entradas.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 80));
    }
    await new Promise(r => setTimeout(r, 1500));
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}

test.describe('fontes', () => {
  test('nenhuma fonte é declarada sem ser carregada', async ({ page }) => {
    await loadAll(page);
    const families = await page.evaluate(`(${VISIBLE_TEXT.trim()}).map(el => getComputedStyle(el).fontFamily)`) as string[];
    for (const family of families) {
      expect(family, 'família declarada').not.toMatch(/Montserrat|Geist/i);
    }
    const body = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(body).not.toMatch(/Montserrat/i);
  });

  test('só os pesos usados são baixados', async ({ page }) => {
    await loadAll(page);

    // Entradas animadas (opacidade 0) ainda não contam como texto visível: repete até assentar.
    await expect
      .poll(
        async () => {
          await page.evaluate(() => document.fonts.ready);
          const result = (await page.evaluate(`(() => {
            const els = ${VISIBLE_TEXT.trim()};
            const used = els.map(el => {
              const s = getComputedStyle(el);
              return s.fontFamily.split(',')[0].replace(/["']/g, '').trim() + '|' + s.fontWeight;
            });
            const loaded = Array.from(document.fonts)
              .filter(f => f.status === 'loaded')
              .map(f => f.family.replace(/["']/g, '') + '|' + f.weight);
            return { used, loaded };
          })()`)) as { used: string[]; loaded: string[] };

          // Poppins é estático: um arquivo por peso. Cada peso baixado tem de aparecer na página.
          return result.loaded
            .filter(f => /Poppins/i.test(f) && !/Fallback/i.test(f))
            .filter(f => {
              const weight = f.split('|')[1];
              return !result.used.some(
                u => /Poppins/i.test(u) && u.split('|')[1] === weight
              );
            });
        },
        { timeout: 10_000 }
      )
      .toEqual([]);
  });
});

test.describe('tamanho do texto', () => {
  for (const [label, width, height] of [
    ['desktop', 1440, 900],
    ['mobile', 390, 844]
  ] as const) {
    test(`nenhum texto visível tem menos de ${MIN_BODY_PX}px (${label})`, async ({
      page
    }) => {
      await page.setViewportSize({ width, height });
      await loadAll(page);
      const small = await page.evaluate(`(${VISIBLE_TEXT.trim()})
        .map(el => ({
          text: el.textContent.trim().slice(0, 40),
          px: parseFloat(getComputedStyle(el).fontSize)
        }))
        .filter(t => t.px < ${MIN_BODY_PX})`);
      expect(small).toEqual([]);
    });
  }
});

test.describe('alinhamento', () => {
  test('a bio do Sobre não é justificada', async ({ page }) => {
    await loadAll(page);
    const aligns = await page
      .locator('#sobre p')
      .evaluateAll(ps => ps.map(p => getComputedStyle(p).textAlign));
    expect(aligns.length).toBeGreaterThan(0);
    for (const align of aligns) expect(align).not.toBe('justify');
  });
});

test.describe('contraste', () => {
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

  test('o Rodapé tem contraste de 4,5:1 ou mais', async ({ page }) => {
    await loadAll(page);
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    const bg = parse(await footer.evaluate(el => getComputedStyle(el).backgroundColor));

    const colors = await footer.evaluate(el =>
      Array.from(el.querySelectorAll('p, a'))
        .filter(n => n.getBoundingClientRect().width > 0)
        .map(n => getComputedStyle(n).color)
    );
    expect(colors.length).toBeGreaterThan(0);
    for (const color of colors) {
      expect(ratio(parse(color), bg), `cor ${color}`).toBeGreaterThanOrEqual(
        MIN_CONTRAST
      );
    }
  });

  // Mede o pior pixel de fundo atrás de cada texto, tirando o texto da captura.
  async function worstContrast(page: Page, selector: string) {
    const target = page.locator(selector).first();
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // entrada na água e flutuação
    const box = await target.boundingBox();
    if (!box) throw new Error(`sem caixa: ${selector}`);
    const color = parse(await target.evaluate(el => getComputedStyle(el).color));

    const handle = await target.elementHandle();
    await handle!.evaluate(el => {
      const h = el as HTMLElement;
      h.dataset.prevColor = h.style.color;
      h.style.setProperty('color', 'transparent', 'important');
      h.style.setProperty('text-shadow', 'none', 'important');
    });
    const shot = await page.screenshot({ clip: box });
    await handle!.evaluate(el => {
      (el as HTMLElement).style.color = (el as HTMLElement).dataset.prevColor ?? '';
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

    // Ignora os 5% de pixels mais extremos (bordas antialiasing, brilhos pontuais).
    const lums = pixels.map(luminance);
    const textLum = luminance(color);
    const worst = pixels
      .map((p, i) => ({ p, l: lums[i] }))
      .sort((a, b) =>
        textLum > 0.4 ? b.l - a.l : a.l - b.l
      )[Math.floor(pixels.length * 0.05)].p;
    return ratio(color, worst);
  }

  for (const [name, selector] of [
    ['bio do Sobre (vidro sobre o mar)', '#sobre p'],
    ['título do Sobre', '#sobre h2'],
    ['descrição dos Projetos', '#projetos .swiper-slide-active p'],
    ['título das Experiências', '#experiencias h2'],
    ['serviços', '#servicos p'],
    ['habilidades', '#habilidades h2']
  ]) {
    test(`texto legível: ${name}`, async ({ page }) => {
      await loadAll(page);
      const exists = await page.locator(selector).count();
      test.skip(exists === 0, `sem ${selector}`);
      expect(await worstContrast(page, selector)).toBeGreaterThanOrEqual(
        MIN_CONTRAST
      );
    });
  }
});
