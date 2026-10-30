import { test, expect } from '@playwright/test';

const ROLE = 'Desenvolvedor Full Stack';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('experiências', () => {
  test('mostra as quatro experiências, da mais recente para a mais antiga', async ({
    page
  }) => {
    const items = page.locator('#experiencias ol > li');
    await expect(items).toHaveCount(4);

    const companies = ['Kempetro', 'Agricompany', 'IASOS', 'Eattasty'];
    const periods = [
      'Jul 2026 – atual',
      'Jan 2024 – Dez 2025',
      'Jun 2022 – Jul 2023',
      'Mar 2022 – Jan 2024'
    ];
    for (let i = 0; i < 4; i++) {
      const text = await items.nth(i).innerText();
      expect(text).toContain(companies[i]);
      expect(text).toContain(periods[i]);
      expect(text).toContain(ROLE);
    }
  });

  test('a IASOS é freelance em paralelo à Eattasty e a Torcida Imperial não é experiência', async ({
    page
  }) => {
    const iasos = page.locator('#experiencias ol > li', { hasText: 'IASOS' });
    await expect(iasos).toContainText('Freelance');
    await expect(iasos).toContainText('em paralelo à Eattasty');
    await expect(page.locator('#experiencias ol')).not.toContainText(
      'Torcida Imperial'
    );
  });

  test('cada experiência tem de 2 a 4 realizações e etiquetas de tecnologia', async ({
    page
  }) => {
    const items = page.locator('#experiencias ol > li');
    for (let i = 0; i < 4; i++) {
      const item = items.nth(i);
      const achievements = await item
        .locator('ul[aria-label="Realizações"] > li')
        .count();
      expect(achievements).toBeGreaterThanOrEqual(2);
      expect(achievements).toBeLessThanOrEqual(4);
      const techs = await item
        .locator('ul[aria-label="Tecnologias"] > li')
        .count();
      expect(techs).toBeGreaterThan(0);
    }
  });

  test('o texto das experiências tem contraste mínimo de 4,5:1', async ({
    page
  }) => {
    const ratios = await page.evaluate(() => {
      const lum = ([r, g, b]: number[]) => {
        const f = (c: number) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const parse = (css: string) =>
        (css.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      return Array.from(
        document.querySelectorAll<HTMLElement>('#experiencias ol > li')
      ).map(li => {
        // O texto fica sobre o painel sólido do próprio item, sem imagem.
        const panel = parse(getComputedStyle(li).backgroundColor);
        const text = parse(getComputedStyle(li.querySelector('p')!).color);
        const [hi, lo] = [lum(text), lum(panel)].sort((a, b) => b - a);
        return (hi + 0.05) / (lo + 0.05);
      });
    });
    for (const r of ratios) expect(r).toBeGreaterThanOrEqual(4.5);
  });

  test('a formação mostra a graduação em andamento e o inglês B2', async ({
    page
  }) => {
    const section = page.locator('#experiencias');
    await expect(section).toContainText('Engenharia de Computação');
    await expect(section).toContainText('Em andamento');
    await expect(section).toContainText('Desenvolvimento Web Full-Stack');
    await expect(section).toContainText('Inglês');
    await expect(section).toContainText('B2');
  });
});

test.describe('habilidades', () => {
  test('não tem Angular nem Tailwind e tem o que está nos currículos', async ({
    page
  }) => {
    const text = await page.locator('#habilidades').innerText();
    expect(text).not.toMatch(/Angular|Tailwind/i);
    for (const name of [
      'Node.js',
      'NestJS',
      'Prisma',
      'Docker',
      'AWS',
      'Jest',
      'Cypress',
      'Scrum',
      'Kanban',
      'Jira',
      'Linear',
      'Airtable'
    ]) {
      expect(text).toContain(name);
    }
  });
});

test.describe('habilidades interativas', () => {
  test('passar o mouse em um quadrado vira o card e revela o nome', async ({
    page
  }) => {
    const card = page.locator('#habilidades li').first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const box = (await card.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    // Nada pode estar por cima do quadrado interceptando o mouse.
    const covered = await page.evaluate(
      ([px, py]) =>
        !document.elementFromPoint(px, py)?.closest('#habilidades li'),
      [x, y]
    );
    expect(covered).toBe(false);

    await page.mouse.move(x, y);
    await page.waitForTimeout(900);
    const flipped = await card.evaluate(el => {
      const inner = el.firstElementChild as HTMLElement;
      return getComputedStyle(inner).transform;
    });
    // rotateY(180deg): o primeiro termo da matriz inverte para -1.
    expect(flipped).toMatch(/^matrix3d\(-1/);
  });

  test('mostra 25 habilidades e as troca aleatoriamente com o tempo', async ({
    page
  }) => {
    const names = () =>
      page
        .locator('#habilidades li strong')
        .allInnerTexts()
        .then(list => list.sort());
    const before = await names();
    expect(before).toHaveLength(25);

    // Fora do card sob o mouse, o revezamento troca uma habilidade por outra.
    await page.mouse.move(0, 0);
    await expect
      .poll(async () => (await names()).join(), { timeout: 20_000 })
      .not.toBe(before.join());
    expect(await names()).toHaveLength(25);
  });
});
