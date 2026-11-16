import { test, expect, type Page } from '@playwright/test';
import pt from '../../src/meta/dictionaries/pt';
import en from '../../src/meta/dictionaries/en';
import profile from '../../src/meta/profile';
import { MIN_CONTRAST, worstContrast } from '../contrast';

// A Tela de Contato da Versão para celular, a mais funda: o convite para falar com Lucas, os botões
// grandes de WhatsApp, e-mail e LinkedIn, os seletores de Modo e Idioma de novo e o Rodapé.

const STORAGE_KEY = 'cena-modo';

const screen = (page: Page) => page.locator('[data-tela="contato"]');
// O convite e os botões ficam na seção; o Rodapé, abaixo dela, na mesma Tela.
const contact = (page: Page) => screen(page).locator('#contato');
const footer = (page: Page) => screen(page).locator('footer');

async function open(page: Page, path = '/', mode?: string) {
  if (mode) await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, mode]);
  await page.route('**/api/cena', route => route.fulfill({ status: 502, json: { error: 'clima indisponível' } }));
  await page.goto(path);
  await expect(page.locator('#inicio')).toHaveAttribute('data-cena-pronta', '');
  await screen(page).evaluate(el => el.scrollIntoView({ behavior: 'instant' }));
  await expect(contact(page)).toBeInViewport();
}

const topOf = (page: Page, id: string) =>
  page.locator(`[data-tela="${id}"]`).evaluate(el => Math.round(el.getBoundingClientRect().top) || 0);

for (const dict of [pt, en]) {
  test(`${dict.locale}: todos os textos de Contato e Rodapé`, async ({ page }) => {
    await open(page, dict.locale === 'pt' ? '/' : '/en');
    const copy = dict.content.contact;
    await expect(contact(page).getByRole('heading', { name: copy.label })).toBeVisible();
    await expect(contact(page).getByText(copy.heading)).toBeVisible();
    await expect(contact(page).getByText(copy.description)).toBeVisible();
    const topics = contact(page).getByRole('list', { name: copy.heading }).getByRole('listitem');
    await expect(topics).toHaveText(copy.topics);

    await expect(contact(page).getByRole('link', { name: copy.buttonText })).toBeVisible();
    await expect(contact(page).getByRole('link', { name: copy.emailButtonText })).toBeVisible();
    await expect(contact(page).getByRole('button', { name: copy.copyEmailText })).toBeVisible();
    await expect(contact(page).getByRole('link', { name: copy.linkedinButtonText, exact: true })).toBeVisible();

    const year = new Date().getFullYear();
    await expect(footer(page)).toContainText(`© ${year} ${dict.content.footer.copyrightName}. ${dict.ui.rights}`);
    await expect(footer(page)).toContainText(dict.content.footer.weatherCredit);
  });
}

test('WhatsApp, e-mail e LinkedIn levam aonde devem', async ({ page }) => {
  await open(page);
  const copy = pt.content.contact;
  const whatsapp = contact(page).getByRole('link', { name: copy.buttonText });
  await expect(whatsapp).toHaveAttribute('href', `${profile.social.whatsapp}?text=${pt.profile.whatsappMessage}`);
  await expect(whatsapp).toHaveAttribute('target', '_blank');
  await expect(contact(page).getByRole('link', { name: copy.emailButtonText })).toHaveAttribute(
    'href',
    `mailto:${profile.email}?subject=${encodeURIComponent(pt.profile.emailSubject)}`
  );
  const linkedin = contact(page).getByRole('link', { name: copy.linkedinButtonText, exact: true });
  await expect(linkedin).toHaveAttribute('href', profile.social.linkedin);
  await expect(linkedin).toHaveAttribute('target', '_blank');
});

test('em inglês, o WhatsApp leva a mensagem e o e-mail o assunto do Idioma', async ({ page }) => {
  await open(page, '/en');
  const copy = en.content.contact;
  await expect(contact(page).getByRole('link', { name: copy.buttonText })).toHaveAttribute(
    'href',
    `${profile.social.whatsapp}?text=${en.profile.whatsappMessage}`
  );
  await expect(contact(page).getByRole('link', { name: copy.emailButtonText })).toHaveAttribute(
    'href',
    `mailto:${profile.email}?subject=${encodeURIComponent(en.profile.emailSubject)}`
  );
});

test('copiar endereço copia o e-mail e confirma', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await open(page);
  const copy = pt.content.contact;
  await contact(page).getByRole('button', { name: copy.copyEmailText }).tap();
  await expect(contact(page).getByRole('button', { name: copy.copiedEmailText })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);
  // A confirmação some sozinha.
  await expect(contact(page).getByRole('button', { name: copy.copyEmailText })).toBeVisible({ timeout: 4000 });
});

test.describe('seletores', () => {
  test('o de Modo troca a Cena como o do Hero, e a escolha vale para os dois', async ({ page }) => {
    await open(page);
    const night = contact(page)
      .getByRole('radiogroup', { name: pt.ui.sceneSwitch })
      .getByRole('radio', { name: pt.ui.sceneModes.noite });
    await night.tap();
    await expect(night).toBeChecked();
    await expect(page.locator('#inicio')).toHaveAttribute('data-cena-modo', 'noite');
    await expect(
      page.locator('#inicio').getByRole('radio', { name: pt.ui.sceneModes.noite })
    ).toBeChecked();
    expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe('noite');
  });

  test('o de Idioma leva à Tela de Contato no outro Idioma', async ({ page }) => {
    await open(page);
    await contact(page).getByRole('link', { name: 'English' }).tap();
    await expect(page).toHaveURL(/\/en#contato$/);
    await expect(page.locator('[data-versao]')).toHaveAttribute('data-versao', 'celular');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect.poll(() => topOf(page, 'contato')).toBeLessThanOrEqual(0);
    await expect(contact(page)).toBeInViewport();
  });
});

test('Rodapé com links sociais e o crédito da Open-Meteo', async ({ page }) => {
  await open(page);
  for (const [name, href] of [
    ['GitHub', profile.social.github],
    ['LinkedIn', profile.social.linkedin]
  ]) {
    const link = footer(page).getByRole('link', { name, exact: true });
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
  }
  const credit = footer(page).getByRole('link', { name: 'Open-Meteo' });
  await expect(credit).toHaveAttribute('href', 'https://open-meteo.com');
  // O Rodapé fecha a página: nada abaixo dele.
  const bottom = await footer(page).evaluate(el => el.getBoundingClientRect().bottom + window.scrollY);
  const page_ = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(Math.abs(page_ - bottom)).toBeLessThanOrEqual(1);
});

test('texto corrido de 16px ou mais; rótulos e legendas de 14px ou mais', async ({ page }) => {
  await open(page);
  const px = (selector: string) =>
    screen(page).locator(selector).evaluateAll(els => els.map(el => parseFloat(getComputedStyle(el).fontSize)));
  const body = await px('section p');
  expect(body.length).toBeGreaterThan(0);
  for (const size of body) expect(size).toBeGreaterThanOrEqual(16);
  for (const size of await px('h2, li, a, button, footer p')) expect(size).toBeGreaterThanOrEqual(14);
});

test('toques de 44px ou mais', async ({ page }) => {
  await open(page);
  const targets = await screen(page).locator('a, button').all();
  expect(targets.length).toBeGreaterThan(0);
  for (const target of targets) {
    const box = (await target.boundingBox())!;
    const label = (await target.getAttribute('aria-label')) ?? (await target.textContent());
    expect(box.width, label!).toBeGreaterThanOrEqual(44);
    expect(box.height, label!).toBeGreaterThanOrEqual(44);
  }
});

test('os botões de contato são grandes: ocupam a largura do conteúdo', async ({ page }) => {
  await open(page);
  const copy = pt.content.contact;
  const description = (await contact(page).getByText(copy.description).boundingBox())!;
  for (const name of [copy.buttonText, copy.emailButtonText, copy.linkedinButtonText]) {
    const box = (await contact(page).getByRole('link', { name, exact: true }).boundingBox())!;
    expect(box.width, name).toBeGreaterThanOrEqual(description.width - 1);
    expect(box.height, name).toBeGreaterThanOrEqual(52);
  }
});

test.describe('contraste sobre o Mar', () => {
  for (const mode of ['dia', 'noite', 'ao-vivo']) {
    test(mode, async ({ page }) => {
      test.setTimeout(90_000);
      await open(page, '/', mode);
      // Espera a entrada terminar: a medida é do texto já formado.
      await page.waitForTimeout(1200);
      const texts = screen(page).locator('h2, section p, section li, section a span, section button:not([role=radio]), footer p');
      for (const text of await texts.all()) {
        const label = (await text.textContent())!.slice(0, 30);
        await text.scrollIntoViewIfNeeded();
        expect(await worstContrast(page, text), label).toBeGreaterThanOrEqual(MIN_CONTRAST);
      }
    });
  }
});

// Quadro do fundo do mar num instante: o que muda de um para outro é a vida andando.
const frame = (page: Page) =>
  contact(page)
    .locator('[data-fundo-do-mar] svg')
    .evaluateAll(els => els.map(el => getComputedStyle(el).transform).join());

test.describe('vida no fundo do mar', () => {
  test('fica no pé da Tela, acima do Rodapé, em movimento', async ({ page }) => {
    await open(page);
    const seabed = contact(page).locator('[data-fundo-do-mar]');
    await expect(seabed).toBeVisible();
    await expect(seabed).toHaveAttribute('aria-hidden', 'true');
    const floor = (await seabed.boundingBox())!;
    const foot = (await footer(page).boundingBox())!;
    expect(Math.abs(floor.y + floor.height - foot.y)).toBeLessThanOrEqual(1);
    const buttons = (await contact(page).getByRole('button', { name: pt.content.contact.copyEmailText }).boundingBox())!;
    expect(floor.y + floor.height).toBeGreaterThan(buttons.y + buttons.height);

    const before = await frame(page);
    await page.waitForTimeout(500);
    expect(await frame(page)).not.toBe(before);
  });

  test('com movimento reduzido, fica parada', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(contact(page).locator('[data-fundo-do-mar]')).toBeVisible();
    const before = await frame(page);
    await page.waitForTimeout(500);
    expect(await frame(page)).toBe(before);
    const names = await contact(page)
      .locator('[data-fundo-do-mar] *')
      .evaluateAll(els => els.map(el => getComputedStyle(el).animationName));
    for (const name of names) expect(name).toBe('none');
  });
});

test('sem rolagem horizontal; em 320px e em paisagem, nada quebra', async ({ page }) => {
  for (const viewport of [page.viewportSize()!, { width: 320, height: 640 }, { width: 800, height: 380 }]) {
    await page.setViewportSize(viewport);
    await open(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${viewport.width}px`).toBeLessThanOrEqual(0);
    const right = await screen(page)
      .locator('h2, p, li, a, button')
      .evaluateAll(els => Math.max(...els.map(el => el.getBoundingClientRect().right)));
    expect(right, `${viewport.width}px`).toBeLessThanOrEqual(viewport.width);
  }
});
