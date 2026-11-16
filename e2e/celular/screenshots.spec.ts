import { test, expect } from '@playwright/test';

// Screenshots da Versão para celular para aprovação humana (não é comparação de pixels), uma por Tela.
// Só roda quando pedido: SCREENSHOTS=<pasta> npm run test:e2e -- --project='celular-*' screenshots

const OUT = process.env.SCREENSHOTS;
const MODES = ['dia', 'noite', 'ao-vivo'];
const SCREENS = ['inicio', 'sobre', 'projetos', 'experiencias', 'servicos', 'habilidades', 'contato'];

test.skip(!OUT, 'defina SCREENSHOTS com a pasta de saída');

for (const mode of MODES) {
    test(mode, async ({ page }) => {
      const { width } = page.viewportSize()!;
      await page.addInitScript(value => localStorage.setItem('cena-modo', value), mode);
      await page.goto('/');
      await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
      // As seções entram animadas ao chegar nelas: cada Tela é fotografada depois de chegar.
      for (let i = 0; i < SCREENS.length; i++) {
        const id = SCREENS[i];
        await page.locator(`[data-tela="${id}"]`).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
        await page.waitForTimeout(i === 0 ? 3500 : 2000);
        await page.screenshot({ path: `${OUT}/${width}-${mode}-${i + 1}-${id}.png` });
      }
    });
}
