import { test, expect } from '@playwright/test';
import profile from '../src/meta/profile';
import content from '../src/meta/content';

const CLICHES = [
  /tecnologias mais modernas/i,
  /solu[çc][õo]es inovadoras/i,
  /tecnologia de ponta/i,
  /apaixonad[oa] por tecnologia/i,
  /sempre em busca/i,
  /alta qualidade/i
];

// Nomes próprios e marcas que mantêm a maiúscula no meio de uma frase.
const PROPER = new Set([
  'WhatsApp',
  'LinkedIn',
  'Lucas',
  'Cristovam',
  'Kempetro',
  'IASOS',
  'Eattasty',
  'Agricompany',
  'GitHub',
  'Instagram'
]);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Seção de Contato', () => {
  test('mostra disponibilidade, localização e currículo', async ({ page }) => {
    const contact = page.locator('#contato');
    await expect(contact.getByText(profile.availability)).toBeVisible();
    await expect(contact.getByText(profile.location)).toBeVisible();
    const resume = contact.getByRole('link', { name: content.contact.resumeButtonText });
    await expect(resume).toHaveAttribute('href', profile.resumePath);
    await expect(resume).toHaveAttribute('download', '');
  });

  test('o currículo baixa o PDF', async ({ page }) => {
    const link = page
      .locator('#contato')
      .getByRole('link', { name: content.contact.resumeButtonText });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      link.click()
    ]);
    expect(download.suggestedFilename()).toBe(profile.resumePath.replace(/^\//, ''));
  });

  test('WhatsApp, e-mail e LinkedIn funcionam', async ({ page }) => {
    const contact = page.locator('#contato');
    // O Contato é carregado sob demanda: espera a hidratação antes de clicar.
    await page.waitForLoadState('networkidle');
    // O navegador de teste não abre janelas novas: registra o endereço pedido.
    await page.evaluate(() => {
      (window as unknown as { opened: string[] }).opened = [];
      window.open = (url?: string | URL) => {
        (window as unknown as { opened: string[] }).opened.push(String(url));
        return null;
      };
    });
    await contact.getByRole('button', { name: content.contact.buttonText }).click();
    const opened = await page.evaluate(
      () => (window as unknown as { opened: string[] }).opened
    );
    expect(opened).toHaveLength(1);
    expect(opened[0]).toContain(`wa.me/${profile.whatsappNumber}`);

    await expect(
      contact.getByRole('link', { name: content.contact.emailButtonText })
    ).toHaveAttribute('href', new RegExp(`^mailto:${profile.email}`));
    await expect(
      contact.getByRole('link', { name: content.contact.linkedinButtonText })
    ).toHaveAttribute('href', profile.social.linkedin);
  });
});

test.describe('voz do site', () => {
  test('nenhum texto contém clichê', async ({ page }) => {
    const text = await page.locator('body').innerText();
    for (const cliche of CLICHES) expect(text).not.toMatch(cliche);
    const source = JSON.stringify(content);
    for (const cliche of CLICHES) expect(source).not.toMatch(cliche);
  });

  test('rótulo e título de cada seção não se repetem', async () => {
    for (const key of ['projects', 'jobs', 'services', 'work'] as const) {
      const { label, title } = content[key];
      expect(title.toLowerCase(), key).not.toContain(label.toLowerCase());
    }
  });

  test('títulos de seção e botões seguem a capitalização em frase', async ({
    page
  }) => {
    const texts = await page.evaluate(() => {
      const clean = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
      const headings = Array.from(
        document.querySelectorAll('main section h2, main section h3')
      ).map(el => clean(el.textContent));
      const actions = Array.from(
        document.querySelectorAll('main section button, main section a[download], header a[download]')
      ).map(el => clean(el.textContent));
      return [...headings, ...actions];
    });
    expect(texts.length).toBeGreaterThan(10);
    // A primeira palavra e a que abre uma nova frase podem ser maiúsculas.
    const offenders = texts.filter(t => {
      const words = t.split(' ').filter(w => /[A-Za-zÀ-ÿ]/.test(w));
      return words.some(
        (w, i) =>
          i > 0 &&
          !/[?.!:]$/.test(words[i - 1]) &&
          /^[A-ZÀ-Ý]/.test(w) &&
          !PROPER.has(w.replace(/[?.!,]$/, ''))
      );
    });
    expect(offenders).toEqual([]);
  });
});
