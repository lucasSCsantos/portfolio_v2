import { test, expect } from '@playwright/test';
import skillGroups from '../src/meta/skills';

test('desktop mantém o revezamento e pausa no card em foco', async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/');
  const cards = page.locator('#habilidades li[tabindex="0"]');
  await expect(cards).toHaveCount(skillGroups.flatMap(group => group.skills).filter(skill => !skill.rotating).length);
  const first = cards.first();
  await expect(first).toContainText('JavaScript');
  await page.clock.runFor(2501);
  await expect(first).toContainText('HTML');
  await first.focus();
  await page.clock.runFor(5000);
  await expect(first).toContainText('HTML');
});
