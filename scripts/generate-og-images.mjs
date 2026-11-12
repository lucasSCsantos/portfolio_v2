// Gera as imagens de prévia (1200×630) em src/app a partir da identidade.
// Uso: node scripts/generate-og-images.mjs
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const profileSource = await readFile('src/meta/profile.ts', 'utf8');
const read = (key) => profileSource.match(new RegExp(`${key}: '([^']+)'`))[1];
const name = read('name');
const siteUrl = read('siteUrl');
// O cargo de cada idioma: o português vem da identidade, o inglês do dicionário.
const enSource = await readFile('src/meta/dictionaries/en.ts', 'utf8');
const roles = {
  pt: read('role'),
  en: enSource.match(/const role = '([^']+)'/)[1]
};
const avatar = await readFile('public/photos/avatar.jpeg');

const html = (tagline, role) => `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;display:flex;align-items:center;justify-content:space-between;
box-sizing:border-box;padding:0 96px;color:#fff;font-family:Poppins,Inter,Arial,sans-serif;
background:linear-gradient(160deg,#0063A3 0%,#002F5B 100%)">
  <div style="max-width:640px">
    <div style="font-size:36px;color:#79BED9">${tagline}</div>
    <div style="font-size:88px;font-weight:700;line-height:1.05;margin-top:16px">${name}</div>
    <div style="font-size:44px;margin-top:24px">${role}</div>
    <div style="font-size:28px;margin-top:40px;color:#79BED9">${siteUrl.replace('https://', '')}</div>
  </div>
  <img src="data:image/jpeg;base64,${avatar.toString('base64')}" width="380" height="380"
   style="border-radius:50%;object-fit:cover;border:8px solid #79BED9"/>
</div></body></html>`;

const targets = [
  ['src/app/opengraph-image.png', 'Portfólio', 'pt'],
  ['src/app/twitter-image.png', 'Portfólio', 'pt'],
  ['src/app/(pt)/links/opengraph-image.png', 'Links e contatos', 'pt'],
  ['src/app/(pt)/links/twitter-image.png', 'Links e contatos', 'pt'],
  ['src/app/(en)/en/opengraph-image.png', 'Portfolio', 'en'],
  ['src/app/(en)/en/twitter-image.png', 'Portfolio', 'en']
];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [file, tagline, locale] of targets) {
  await page.setContent(html(tagline, roles[locale]));
  await page.screenshot({ path: file });
  console.log('gerado', pathToFileURL(file).pathname);
}
await browser.close();
