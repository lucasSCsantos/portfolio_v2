import { test, expect } from '@playwright/test';

// Qual versão da home chega a cada aparelho (ADR 0004): escolhida no servidor pelo User-Agent, na mesma URL.

const PHONES = {
  iPhone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  'Android de celular':
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  'Googlebot Smartphone':
    'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.126 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
};

const OTHERS = {
  // O iPadOS se apresenta como um Mac.
  iPad: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'iPad antigo':
    'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
  'tablet Android':
    'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  desktop:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  vazio: '',
  desconhecido: 'curl/8.7.1'
};

const versionOf = (html: string) => html.match(/data-versao="(\w+)"/)?.[1];

for (const path of ['/', '/en']) {
  test.describe(`${path}`, () => {
    for (const [name, userAgent] of Object.entries(PHONES)) {
      test(`${name} recebe a Versão para celular`, async ({ request }) => {
        const response = await request.get(path, { headers: { 'user-agent': userAgent }, maxRedirects: 0 });
        expect(response.status()).toBe(200);
        expect(versionOf(await response.text())).toBe('celular');
      });
    }

    for (const [name, userAgent] of Object.entries(OTHERS)) {
      test(`${name} recebe a Versão para desktop`, async ({ request }) => {
        const response = await request.get(path, { headers: { 'user-agent': userAgent }, maxRedirects: 0 });
        expect(response.status()).toBe(200);
        expect(versionOf(await response.text())).toBe('desktop');
      });
    }

    test('a resposta varia pelo User-Agent, sem cookie', async ({ request }) => {
      const response = await request.get(path, { headers: { 'user-agent': PHONES.iPhone } });
      const vary = (response.headers()['vary'] ?? '').toLowerCase().split(/,\s*/);
      expect(vary).toContain('user-agent');
      expect(response.headers()['set-cookie']).toBeUndefined();
    });

    test('canonical, hreflang e OG são os mesmos nas duas versões', async ({ request }) => {
      const head = async (userAgent: string) => {
        const html = await (await request.get(path, { headers: { 'user-agent': userAgent } })).text();
        return (html.match(/<link rel="(canonical|alternate)"[^>]*>|<meta property="og:[^>]*>/g) ?? []).sort();
      };
      const desktop = await head(OTHERS.desktop);
      expect(desktop.length).toBeGreaterThan(3);
      expect(await head(PHONES.iPhone)).toEqual(desktop);
    });
  });
}

test('a Página de Links é a mesma para qualquer User-Agent', async ({ request }) => {
  const body = async (userAgent: string) => {
    const html = await (await request.get('/links', { headers: { 'user-agent': userAgent } })).text();
    // Só o que é visível: o HTML carrega hashes de build iguais nos dois.
    return html.replace(/<script[\s\S]*?<\/script>/g, '');
  };
  const desktop = await body(OTHERS.desktop);
  expect(desktop).not.toContain('data-versao');
  expect(await body(PHONES.iPhone)).toBe(desktop);
});
