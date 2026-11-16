import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import skillGroups from '../../src/meta/skills';
import { MIN_CONTRAST, worstContrast } from '../contrast';

// A Tela de Habilidades da Versão para celular: as tecnologias numa faixa infinita e as
// competências em lista, com a animação Lottie junto ao título.

const STORAGE_KEY = 'cena-modo';
// Todas, inclusive as que no desktop só aparecem no revezamento.
const SKILLS = skillGroups.flatMap(group =>
  group.skills.map(({ name }) => name)
);

const skills = (page: Page) => page.locator('[data-tela="habilidades"]');
const grid = (page: Page, name = pt.content.work.title) =>
  skills(page).getByRole('list', { name });

async function open(page: Page, path = '/', mode?: string) {
  if (mode)
    await page.addInitScript(
      ([key, value]) => localStorage.setItem(key, value),
      [STORAGE_KEY, mode]
    );
  await page.route('**/api/cena', route =>
    route.fulfill({ status: 502, json: { error: 'clima indisponível' } })
  );
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
  await skills(page).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(skills(page).locator('#habilidades')).toBeInViewport();
}

for (const dict of [pt, en]) {
  test(`${dict.locale}: todas as habilidades e competências`, async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    const copy = dict.content.work;
    await expect(
      skills(page).getByRole('heading', { name: copy.label })
    ).toBeVisible();
    await expect(skills(page).getByText(copy.description)).toBeVisible();

    const items = grid(page, copy.title).getByRole('listitem');
    await expect(items).toHaveCount(SKILLS.length);
    for (const name of SKILLS) {
      const item = items.filter({
        has: page.locator(`button[data-skill="${name}"]`)
      });
      await expect(item).toContainText(name);
      // O ícone é desenho: o nome já diz o que é.
      await expect(item.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    }

    const competencies = skills(page)
      .getByRole('list', { name: copy.competenciesLabel })
      .getByRole('listitem');
    await expect(competencies).toHaveCount(copy.competencies.length);
    for (let i = 0; i < copy.competencies.length; i++) {
      await expect(competencies.nth(i)).toContainText(
        copy.competencies[i].title
      );
      await expect(competencies.nth(i)).toContainText(
        copy.competencies[i].text
      );
    }
  });
}

test('a faixa tem quatro linhas alternadas, infinitas e cards quadrados', async ({
  page
}) => {
  await open(page);
  const boxes = await grid(page)
    .getByRole('listitem')
    .evaluateAll(els =>
      els
        .map(el => el.getBoundingClientRect())
        .map(({ width, height, top }) => ({
          width,
          height,
          top: Math.round(top)
        }))
    );
  for (const box of boxes) {
    expect(Math.abs(box.width - box.height)).toBeLessThan(1);
    expect(box.width).toBeCloseTo(88, 1);
  }
  expect(new Set(boxes.map(box => box.top)).size).toBe(4);
  await expect(grid(page)).toHaveCount(4);
  const offsets = await grid(page).evaluateAll(els =>
    els.map(el => {
      const row = el.parentElement!.parentElement!;
      return getComputedStyle(row).transform;
    })
  );
  expect(offsets[0]).toBe(offsets[2]);
  expect(offsets[1]).toBe(offsets[3]);
  expect(offsets[0]).not.toBe(offsets[1]);
  for (const row of await grid(page).all()) {
    const loop = await row.evaluate(el => {
      const track = el.parentElement!;
      const animation = track.getAnimations()[0];
      animation.pause();
      animation.currentTime = 0;
      const start = el.firstElementChild!.getBoundingClientRect().left;
      const duration = Number(animation.effect!.getTiming().duration);
      animation.currentTime = duration - 1;
      const end =
        track.lastElementChild!.firstElementChild!.getBoundingClientRect().left;
      return { start, end, duration: animation.effect!.getTiming().duration };
    });
    expect(Math.abs(loop.start - loop.end)).toBeLessThan(1);
    expect(Number(loop.duration)).toBeGreaterThan(0);
  }
  // Nenhum nome é cortado nem quebrado no meio da palavra.
  const clipped = await grid(page)
    .getByRole('listitem')
    .evaluateAll(els =>
      els
        .filter(el => el.scrollWidth > el.clientWidth + 1)
        .map(el => el.textContent)
    );
  expect(clipped).toEqual([]);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

for (const path of ['/', '/en']) {
  test(`o verso é vazado e os nomes cabem inteiros nos cards pequenos em ${path}`, async ({
    page
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, path);
    const list = grid(
      page,
      path === '/' ? pt.content.work.title : en.content.work.title
    );
    const problems = await list.getByRole('button').evaluateAll(els =>
      els.flatMap(el => {
        const back = el.firstElementChild!.lastElementChild as HTMLElement;
        const title = back.querySelector('strong')!;
        const range = document.createRange();
        range.selectNodeContents(title);
        const style = getComputedStyle(back);
        return style.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
          style.boxShadow !== 'none' ||
          range.getClientRects().length !== 1 ||
          title.scrollWidth > back.clientWidth + 1 ||
          back.querySelector('span')!.scrollWidth > back.clientWidth + 1 ||
          back.scrollHeight > back.clientHeight + 1
          ? [el.getAttribute('data-skill')]
          : [];
      })
    );
    expect(problems).toEqual([]);
  });
}

test('avança, pausa, revela o verso e continua', async ({ page }) => {
  await open(page);
  const track = grid(page).first().locator('..');
  const transform = () => track.evaluate(el => getComputedStyle(el).transform);
  const before = await transform();
  await page.waitForTimeout(300);
  expect(await transform()).not.toBe(before);
  await skills(page).getByRole('button', { name: pt.ui.pauseSkills }).tap();
  const stopped = await transform();
  await page.waitForTimeout(300);
  expect(await transform()).toBe(stopped);
  const card = grid(page).first().getByRole('button').nth(2);
  await card.tap();
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await skills(page).getByRole('button', { name: pt.ui.resumeSkills }).tap();
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  expect(
    await track.evaluate(el => getComputedStyle(el).animationPlayState)
  ).toBe('running');
});

test('as habilidades ficam fixas e os cards viram aleatoriamente a cada 2,5s', async ({
  page
}) => {
  await page.clock.install();
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await open(page);
  await page.clock.runFor(100);
  const first = grid(page).getByRole('button').first();
  const names = await grid(page)
    .getByRole('button')
    .evaluateAll(els => els.map(el => el.getAttribute('data-skill')));
  await expect(first).toHaveAttribute('data-skill', 'JavaScript');
  await page.clock.fastForward(2501);
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await page.clock.fastForward(2501);
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  expect(
    await grid(page)
      .getByRole('button')
      .evaluateAll(els => els.map(el => el.getAttribute('data-skill')))
  ).toEqual(names);
  await skills(page).getByRole('button', { name: pt.ui.pauseSkills }).tap();
  await page.clock.fastForward(5000);
  await expect(first).toHaveAttribute('aria-pressed', 'false');
});

test('os cards continuam interativos na segunda metade do ciclo', async ({
  page
}) => {
  await open(page);
  await skills(page).getByRole('button', { name: pt.ui.pauseSkills }).tap();
  await grid(page)
    .first()
    .locator('..')
    .evaluate(el => {
      const animation = el.getAnimations()[0];
      animation.currentTime =
        Number(animation.effect!.getTiming().duration) / 2;
    });
  const copy = skills(page)
    .locator('ul[aria-hidden="true"]')
    .first()
    .locator('button')
    .nth(1);
  await copy.tap();
  await expect(copy).toHaveAttribute('aria-pressed', 'true');
  await expect(grid(page).getByRole('button').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(copy).not.toBeFocused();
});

test('texto corrido de 16px ou mais; nomes sob os ícones de 14px ou mais', async ({
  page
}) => {
  await open(page);
  const px = (selector: string) =>
    skills(page)
      .locator(selector)
      .evaluateAll(els =>
        els.map(el => parseFloat(getComputedStyle(el).fontSize))
      );
  const competencies = await skills(page)
    .getByRole('list', { name: pt.content.work.competenciesLabel })
    .locator('li *')
    .evaluateAll(els =>
      els.map(el => parseFloat(getComputedStyle(el).fontSize))
    );
  expect(competencies.length).toBeGreaterThan(0);
  for (const size of [...(await px('p')), ...competencies])
    expect(size).toBeGreaterThanOrEqual(16);
  for (const size of await px('h2, h3, li'))
    expect(size).toBeGreaterThanOrEqual(14);
});

test('toques de 44px ou mais', async ({ page }) => {
  await open(page);
  for (const target of await skills(page).locator('a, button').all()) {
    const box = (await target.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe('contraste sobre o Mar', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(mode, async ({ page }) => {
      // Uma captura por texto, e a grade tem um nome por habilidade.
      test.setTimeout(90_000);
      await open(page, '/', mode);
      // Espera a entrada terminar: a medida é do texto já formado.
      await page.waitForTimeout(1200);
      const texts = skills(page).locator('h2, h3, p, li > strong, li > span');
      for (const text of await texts.all()) {
        const label = (await text.textContent())!.slice(0, 30);
        // A Tela é mais alta que o celular: a captura só pega o que está à vista.
        await text.scrollIntoViewIfNeeded();
        expect(await worstContrast(page, text), label).toBeGreaterThanOrEqual(
          MIN_CONTRAST
        );
      }
    });
  }
});

// Quadro do desenho num instante: o que muda de um para outro é a animação andando.
const frame = (page: Page, selector: string) =>
  skills(page)
    .locator(selector)
    .evaluate(
      el => el.innerHTML + getComputedStyle(el.querySelector('svg')!).transform
    );

test.describe('animações', () => {
  test('a Lottie fica pequena junto ao título, em movimento, sem corais na Tela', async ({
    page
  }) => {
    await open(page);
    const lottie = skills(page).locator('[data-lottie] svg');
    await expect(lottie).toBeVisible();
    const title = (await skills(page)
      .getByRole('heading', { name: pt.content.work.label })
      .boundingBox())!;
    const art = (await lottie.boundingBox())!;
    expect(art.width).toBeLessThanOrEqual(96);
    // Na mesma faixa do título.
    expect(art.y).toBeLessThan(title.y + title.height);
    expect(art.y + art.height).toBeGreaterThan(title.y);

    await expect(skills(page).locator('[data-corais]')).toHaveCount(0);

    const before = await frame(page, '[data-lottie]');
    await page.waitForTimeout(400);
    expect(await frame(page, '[data-lottie]')).not.toBe(before);
  });

  test('com movimento reduzido, tudo fica parado', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(skills(page).locator('[data-lottie] svg')).toBeVisible();
    const before = await frame(page, '[data-lottie]');
    await page.waitForTimeout(400);
    expect(await frame(page, '[data-lottie]')).toBe(before);
    await expect(skills(page).locator('[data-corais]')).toHaveCount(0);
    for (const row of await grid(page).all())
      expect(
        await row
          .locator('..')
          .evaluate(el => getComputedStyle(el).animationName)
      ).toBe('none');
    await expect(grid(page).getByRole('listitem')).toHaveCount(SKILLS.length);
  });
});

test('em 320px e em paisagem, nada quebra', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 640 },
    { width: 800, height: 380 }
  ]) {
    await page.setViewportSize(viewport);
    await open(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow, `${viewport.width}px`).toBeLessThanOrEqual(0);
    const right = await skills(page)
      .locator('h2, h3, p, [aria-labelledby="habilidades-competencias"] li')
      .evaluateAll(els =>
        Math.max(...els.map(el => el.getBoundingClientRect().right))
      );
    expect(right, `${viewport.width}px`).toBeLessThanOrEqual(viewport.width);
  }
});
