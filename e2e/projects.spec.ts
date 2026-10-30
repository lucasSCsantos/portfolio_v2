import { test, expect, type Page } from '@playwright/test';
import projects, { relationLabels } from '../src/meta/projects';

// O carrossel faz loop e duplica slides: os cards reais são os não duplicados.
const realCards = (page: Page) =>
  page.locator('#projetos .swiper-slide:not(.swiper-slide-duplicate)');

const card = (page: Page, title: string) =>
  realCards(page).filter({
    has: page.getByRole('heading', { name: title, exact: true })
  });

test.describe('seção de Projetos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(realCards(page)).toHaveCount(projects.length);
  });

  test('cada card mostra papel, tecnologias e relação', async ({ page }) => {
    for (const project of projects) {
      const c = card(page, project.title);
      await expect(c).toContainText(project.role);
      await expect(c).toContainText(relationLabels[project.relation]);
      for (const tech of project.technologies) {
        await expect(c.getByRole('listitem').filter({ hasText: tech })).toHaveCount(1);
      }
    }
  });

  test('os resultados aparecem em destaque quando existem', async ({ page }) => {
    for (const project of projects) {
      const c = card(page, project.title);
      if (project.result) await expect(c).toContainText(project.result);
    }
    await expect(card(page, 'Torcida Imperial')).toContainText('30 mil');
    await expect(card(page, 'Sistema de Gestão de Voluntários')).toContainText('530');
  });

  test('a etiqueta mostra apenas o ano', async ({ page }) => {
    await expect(page.locator('#projetos')).not.toContainText('Projeto Realizado');
    for (const project of projects) {
      const tag = card(page, project.title).locator('button', {
        hasText: project.year
      });
      await expect(tag).toHaveText(project.year);
    }
  });

  test('Torcida Imperial é iniciativa própria, não emprego', async ({ page }) => {
    const c = card(page, 'Torcida Imperial');
    await expect(c).toContainText('Iniciativa própria');
    await expect(c).not.toContainText(/fundador|empresa fundada/i);
  });

  test('Voluntários usa Airtable e não tem botão de link', async ({ page }) => {
    const c = card(page, 'Sistema de Gestão de Voluntários');
    await expect(c.getByRole('listitem').filter({ hasText: 'Airtable' })).toHaveCount(1);
    await expect(c.getByRole('button', { name: /ver (site|demo)/i })).toHaveCount(0);
  });

  test('links de demo são rotulados como demo e os de produção como site', async ({
    page
  }) => {
    for (const project of projects) {
      const c = card(page, project.title);
      if (project.linkKind === 'demo')
        await expect(c.getByRole('button', { name: /ver demo/i })).toHaveCount(1);
      if (project.linkKind === 'production')
        await expect(c.getByRole('button', { name: /ver site/i })).toHaveCount(1);
    }
  });

  test('descrições têm tamanho de leitura rápida', async () => {
    for (const project of projects)
      expect(project.description.length, project.title).toBeLessThanOrEqual(260);
  });

  test('o título da seção não chama os projetos de individuais', async ({ page }) => {
    await expect(page.locator('#projetos').getByRole('heading', { level: 2 })).not.toContainText(
      /individuais/i
    );
  });

  test('o Vídeo do projeto abre e fecha', async ({ page }) => {
    const opener = page.getByRole('button', { name: /Ver vídeo do projeto Mural ONDA/ }).first();
    await opener.scrollIntoViewIfNeeded();
    await opener.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});
