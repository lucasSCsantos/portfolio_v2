import { test, expect, type Page } from '@playwright/test';
import { SHAPES } from '../src/app/components/Sea/creatures';
import { SEA_LIFE, ZONES, swim, zoneAt, type Water } from '../src/app/components/Sea/life';

// A Vida marinha: animais diferentes em cada zona de profundidade do Mar, nadando conforme se desce.

const DESKTOP: Water = { depth: 0, span: 6000, width: 1280, height: 720, time: 0 };
const PHONE: Water = { ...DESKTOP, width: 390, height: 819 };

test.describe('quem vive em cada profundidade', () => {
  test('cada zona tem vários animais, e ao menos um que só vive nela', () => {
    for (const { name } of ZONES) {
      const here = new Set(SEA_LIFE.filter(({ at }) => zoneAt(at) === name).map(({ kind }) => kind));
      const elsewhere = new Set(SEA_LIFE.filter(({ at }) => zoneAt(at) !== name).map(({ kind }) => kind));
      expect(here.size, name).toBeGreaterThanOrEqual(3);
      expect(Array.from(here).some(kind => !elsewhere.has(kind)), name).toBe(true);
    }
  });

  test('todo desenho aparece em algum lugar do Mar', () => {
    const used = new Set(SEA_LIFE.map(({ kind }) => kind));
    expect(Object.keys(SHAPES).filter(kind => !used.has(kind as keyof typeof SHAPES))).toEqual([]);
  });

  test('quem brilha vive no abismo', () => {
    for (const { glow, at, kind } of SEA_LIFE) {
      if (glow) expect(zoneAt(at), kind).toBe('abismo');
    }
  });

  test('o celular fica com animais das quatro zonas, sem os extras', () => {
    const phone = SEA_LIFE.filter(({ extra }) => !extra);
    expect(phone.length).toBeLessThan(SEA_LIFE.length);
    expect(new Set(phone.map(({ at }) => zoneAt(at))).size).toBe(ZONES.length);
  });
});

test.describe('o nado', () => {
  test('na sua profundidade, o animal passa pelo meio da tela', () => {
    SEA_LIFE.forEach((creature, index) => {
      const { y, height } = swim(creature, index, { ...DESKTOP, depth: creature.at });
      expect(Math.abs(y + height / 2 - DESKTOP.height / 2), creature.kind).toBeLessThanOrEqual(creature.bob ?? 0);
    });
  });

  test('descer faz o animal subir na tela', () => {
    SEA_LIFE.forEach((creature, index) => {
      const above = swim(creature, index, { ...DESKTOP, depth: creature.at + 0.02 });
      const below = swim(creature, index, { ...DESKTOP, depth: creature.at - 0.02 });
      expect(above.y, creature.kind).toBeLessThan(below.y);
    });
  });

  test('com o tempo, atravessa a tela para o lado em que olha', () => {
    SEA_LIFE.forEach((creature, index) => {
      const water = { ...DESKTOP, depth: creature.at };
      const before = swim(creature, index, water);
      const after = swim(creature, index, { ...water, time: 1 });
      expect(Math.sign(after.x - before.x), creature.kind).toBe(before.facing);
    });
  });

  test('longe da sua profundidade, não está na tela', () => {
    SEA_LIFE.forEach((creature, index) => {
      for (const depth of [creature.at - 0.5, creature.at + 0.5]) {
        expect(swim(creature, index, { ...DESKTOP, depth }).visible, `${creature.kind} em ${depth}`).toBe(false);
      }
    });
  });

  test('ninguém aparece acima da superfície', () => {
    // O Mar ainda está entrando na tela: a superfície fica em `-depth * span` px.
    for (const water of [DESKTOP, PHONE]) {
      for (const depth of [-0.12, -0.08, -0.04, -0.01]) {
        for (let time = 0; time < 120; time += 7) {
          SEA_LIFE.forEach((creature, index) => {
            const { y, visible } = swim(creature, index, { ...water, depth, time });
            if (visible) expect(y, creature.kind).toBeGreaterThanOrEqual(-depth * water.span);
          });
        }
      }
    }
  });

  test('no celular os animais são menores', () => {
    SEA_LIFE.forEach((creature, index) => {
      expect(swim(creature, index, PHONE).width, creature.kind).toBeLessThan(creature.size);
      expect(swim(creature, index, PHONE).width, creature.kind).toBeLessThan(PHONE.width);
    });
  });
});

// Os animais à vista (os fora da tela ficam sem `display`).
const swimming = (page: Page) =>
  page.locator('[data-vida-marinha] > *').evaluateAll(els =>
    els
      .filter(el => getComputedStyle(el).display !== 'none')
      .map(el => ({ zone: (el as HTMLElement).dataset.zona!, top: el.getBoundingClientRect().top }))
  );

// Rola o Mar até a profundidade dada (0 = raso, 1 = fundo).
const diveTo = (page: Page, depth: number) =>
  page.evaluate(d => {
    const sea = document.querySelector('[data-vida-marinha]')!.parentElement!;
    const top = sea.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (sea.offsetHeight - window.innerHeight) * d, behavior: 'instant' });
  }, depth);

test.describe('na página', () => {
  test('cada profundidade mostra os animais da sua zona e das vizinhas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-vida-marinha] > *')).toHaveCount(SEA_LIFE.length);
    const names = ZONES.map(({ name }) => name);
    const seen = new Set<string>();

    for (let step = 0; step <= 20; step++) {
      const depth = step / 20;
      await diveTo(page, depth);
      await page.waitForTimeout(120);
      for (const { zone } of await swimming(page)) {
        seen.add(zone);
        const gap = Math.abs(names.indexOf(zone as (typeof names)[number]) - names.indexOf(zoneAt(depth)));
        expect(gap, `${zone} em ${depth}`).toBeLessThanOrEqual(1);
      }
    }
    expect(Array.from(seen).sort()).toEqual([...names].sort());
  });

  test('os animais ficam atrás do conteúdo e não capturam cliques', async ({ page }) => {
    await page.goto('/');
    const animals = page.locator('[data-vida-marinha] > *');
    await expect(animals.first()).toBeAttached();
    expect(await animals.evaluateAll(els => els.map(el => getComputedStyle(el).pointerEvents))).toEqual(
      SEA_LIFE.map(() => 'none')
    );
    await expect(page.locator('[data-vida-marinha]')).toHaveAttribute('aria-hidden', 'true');
  });

  test('ninguém nada sobre o Hero', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(await swimming(page)).toEqual([]);
  });

  test('com movimento reduzido, não há animais', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#inicio')).toBeVisible();
    await expect(page.locator('[data-vida-marinha] > *')).toHaveCount(0);
  });
});
