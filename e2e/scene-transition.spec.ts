import { test, expect, type Page } from '@playwright/test';
import pt from '../src/meta/dictionaries/pt';

const DAY_SKY = 'rgb(242, 242, 242)';
const NIGHT_SKY = ['rgb(2, 5, 15)', 'rgb(7, 20, 46)', 'rgb(13, 42, 82)'];
const NIGHT_WAVES = ['rgb(3, 26, 51)', 'rgb(7, 41, 77)', 'rgb(14, 58, 102)'];
const WAVES = '#inicio svg[viewBox="0 0 1440 240"]';

async function openHero(page: Page) {
  await page.goto('/');
  await page.waitForTimeout(3500);
}

type Frame = { at: number; sky: string[]; waves: string[] };

// Escolhe um modo e grava, quadro a quadro, as cores do céu e das ondas durante a troca.
const recordSwitch = (page: Page, label: string, ms = 1400) =>
  page.evaluate(
    ({ label, ms, waves }) =>
      new Promise<Frame[]>(resolve => {
        const hero = document.querySelector<HTMLElement>('#inicio')!;
        const paths = Array.from(document.querySelectorAll(`${waves} path`));
        const frames: Frame[] = [];
        const start = performance.now();
        const sample = () => {
          frames.push({
            at: performance.now() - start,
            sky: getComputedStyle(hero).backgroundImage.match(/rgb\([^)]*\)/g) ?? [],
            waves: paths.map(p => getComputedStyle(p).fill)
          });
          if (performance.now() - start < ms) requestAnimationFrame(sample);
          else resolve(frames);
        };
        document.querySelector<HTMLElement>(`[role="radio"][aria-label="${label}"]`)!.click();
        requestAnimationFrame(sample);
      }),
    { label, ms, waves: WAVES }
  );

const rgbOf = (css: string) => (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const brightness = ([r, g, b]: number[]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const isDay = (frame: Frame) => frame.sky.every(color => color === DAY_SKY);
const isNight = (frame: Frame) =>
  JSON.stringify(frame.sky) === JSON.stringify(NIGHT_SKY) &&
  JSON.stringify(frame.waves) === JSON.stringify(NIGHT_WAVES);

test.describe('troca de Modo da Cena', () => {
  test('dia → noite é um crossfade de cerca de 600 ms, sem quadro quebrado nem clarão', async ({
    page
  }) => {
    await openHero(page);
    const frames = await recordSwitch(page, pt.ui.sceneModes.noite);

    // Todo quadro tem um céu de três cores e três ondas, todas cores válidas.
    for (const frame of frames) {
      expect(frame.sky).toHaveLength(3);
      expect(frame.waves).toHaveLength(3);
      [...frame.sky, ...frame.waves].forEach(color =>
        rgbOf(color).forEach(channel => expect(channel).toBeGreaterThanOrEqual(0))
      );
    }

    // Há quadros no meio do caminho, e o céu só escurece: nenhum quadro volta a clarear.
    const between = frames.filter(frame => !isDay(frame) && !isNight(frame));
    // Poucos quadros bastam: com a máquina carregada o navegador pinta menos vezes.
    expect(between.length).toBeGreaterThanOrEqual(3);
    const skyTop = frames.map(frame => brightness(rgbOf(frame.sky[0])));
    skyTop.slice(1).forEach((value, i) => expect(value).toBeLessThanOrEqual(skyTop[i] + 0.5));

    // Termina na noite, perto dos 600 ms.
    expect(isNight(frames.at(-1)!)).toBe(true);
    const arrived = frames.find(isNight)!.at;
    expect(arrived).toBeGreaterThan(400);
    expect(arrived).toBeLessThan(1200);
  });

  test('noite → dia volta pelo mesmo caminho até o Hero de sempre', async ({ page }) => {
    await openHero(page);
    await recordSwitch(page, pt.ui.sceneModes.noite);
    const frames = await recordSwitch(page, pt.ui.sceneModes.dia);

    expect(frames.filter(frame => !isDay(frame) && !isNight(frame)).length).toBeGreaterThanOrEqual(3);
    expect(isDay(frames.at(-1)!)).toBe(true);
    await expect(page.locator('#inicio [data-cena-camada="estrelas"]')).toHaveCount(0);
  });
});

test.describe('com movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('a troca é imediata, mas o céu e as cores da noite chegam', async ({ page }) => {
    await openHero(page);
    const frames = await recordSwitch(page, pt.ui.sceneModes.noite, 400);

    expect(frames.every(frame => isDay(frame) || isNight(frame))).toBe(true);
    expect(isNight(frames.at(-1)!)).toBe(true);
    expect(frames.find(isNight)!.at).toBeLessThan(100);
  });

  test('as estrelas não cintilam e as ondas ficam paradas', async ({ page }) => {
    await openHero(page);
    await page.getByRole('radio', { name: pt.ui.sceneModes.noite }).first().click();

    const stars = page.locator('#inicio [data-cena-camada="estrelas"] span');
    expect(await stars.count()).toBeGreaterThan(20);
    const animations = await stars.evaluateAll(els =>
      els.map(el => getComputedStyle(el).animationName)
    );
    expect(new Set(animations)).toEqual(new Set(['none']));

    // Nenhuma camada desliza nem sobe e desce: as transformações não mudam com o tempo.
    const transforms = () =>
      page
        .locator(`${WAVES} g, ${WAVES} path`)
        .evaluateAll(els => els.map(el => getComputedStyle(el).transform));
    const before = await transforms();
    await page.waitForTimeout(1500);
    expect(await transforms()).toEqual(before);
  });

  test('a rolagem não move as ondas em paralaxe', async ({ page }) => {
    await openHero(page);
    const layers = () =>
      page
        .locator(`${WAVES} > g`)
        .evaluateAll(els => els.map(el => getComputedStyle(el).transform));
    const before = await layers();
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(500);
    expect(await layers()).toEqual(before);
  });
});

test('sem movimento reduzido, a rolagem continua movendo as ondas em paralaxe', async ({ page }) => {
  await openHero(page);
  const layers = () =>
    page
      .locator(`${WAVES} > g`)
      .evaluateAll(els => els.map(el => getComputedStyle(el).transform));
  const before = await layers();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(500);
  expect(await layers()).not.toEqual(before);
});
