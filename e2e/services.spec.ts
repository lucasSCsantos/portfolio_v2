import { test, expect } from '@playwright/test';
import services from '../src/meta/services';
import projects from '../src/meta/projects';
import experiences from '../src/meta/experiences';
import content from '../src/meta/content';
import profile, { experienceYears } from '../src/meta/profile';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('serviços', () => {
  test('existem quatro serviços', async ({ page }) => {
    await expect(page.locator('#servicos li h3')).toHaveCount(4);
    for (const { title } of services)
      await expect(page.locator('#servicos').getByRole('heading', { name: title })).toBeVisible();
  });

  test('o site não oferece mobile, iOS nem Android', async ({ page }) => {
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/mobile|\biOS\b|android/i);
  });

  test('cada serviço tem prova em Projeto ou Experiência existentes e botão próprio', async ({
    page
  }) => {
    const labels = new Set<string>();
    for (const service of services) {
      const known =
        service.proof.kind === 'projeto'
          ? projects.some(p => p.title === service.proof.name)
          : experiences.some(e => e.company === service.proof.name);
      expect(known, service.title).toBe(true);

      const card = page.locator('#servicos li', { hasText: service.title });
      await expect(card).toContainText(service.proof.name);
      await expect(card.getByRole('link', { name: service.proof.name })).toHaveAttribute(
        'href',
        service.proof.kind === 'projeto' ? '#projetos' : '#experiencias'
      );
      await expect(card.getByRole('link', { name: service.buttonLabel })).toBeVisible();
      labels.add(service.buttonLabel);
    }
    expect(labels.size).toBe(4);
  });
});

test.describe('sobre e competências', () => {
  test('a bio fala de planejar, liderar e entregar do zero, com o tempo calculado', async ({
    page
  }) => {
    const about = page.locator('#sobre');
    await expect(about).toContainText(/planej/i);
    await expect(about).toContainText(/lider/i);
    await expect(about).toContainText(/do zero/i);
    await expect(about).toContainText(`${experienceYears()} anos`);
    await expect(about).toContainText(String(profile.careerStartYear));
  });

  test('a bio é alinhada à esquerda', async ({ page }) => {
    const bio = page.locator('#sobre p', { hasText: /do zero/i }).first();
    expect(await bio.evaluate(el => getComputedStyle(el).textAlign)).toMatch(/left|start/);
  });

  test('a menção ao Ministério de Adolescentes é breve', async ({ page }) => {
    const bio = page.locator('#sobre p', { hasText: 'Ministério de Adolescentes' });
    await expect(bio).toHaveCount(1);
    expect(content.about.bio.length).toBeLessThanOrEqual(520);
  });

  test('a faixa de método tem as cinco etapas, em ordem', async ({ page }) => {
    const steps = page.locator('#sobre ol > li');
    await expect(steps).toHaveCount(5);
    for (let i = 0; i < 5; i++)
      await expect(steps.nth(i)).toContainText(content.about.method[i]);
  });

  test('as quatro competências aparecem em Habilidades', async ({ page }) => {
    const items = page.locator('#habilidades ul[aria-label="Competências"] > li');
    await expect(items).toHaveCount(4);
    for (const { title, text } of content.work.competencies) {
      const item = items.filter({ hasText: title });
      await expect(item).toContainText(text);
    }
  });
});
