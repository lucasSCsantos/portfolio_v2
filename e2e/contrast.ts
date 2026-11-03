import type { Locator, Page } from '@playwright/test';

export const MIN_CONTRAST = 4.5;

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

// Pior contraste entre o texto e o que realmente aparece atrás dele (fundo + vidro + onda).
export async function worstContrast(page: Page, target: Locator) {
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
