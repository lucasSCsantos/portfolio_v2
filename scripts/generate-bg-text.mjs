// Gera as palavras decorativas em contorno (fundo das seções) em inglês, no mesmo
// tamanho e tamanho de letra das versões em português.
// Uso: node scripts/generate-bg-text.mjs
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

// Cada imagem em inglês copia a do português: mesma tela, mesma altura de letra,
// e a palavra fica do mesmo lado em que a seção a posiciona.
const targets = [
  { pt: 'about-bg-text.png', ptWord: 'Sobre', en: 'about-bg-text-en.png', word: 'About', align: 'right' },
  { pt: 'projects-bg-text.png', ptWord: 'Projetos', en: 'projects-bg-text-en.png', word: 'Projects', align: 'right' },
  { pt: 'services-bg-text.png', ptWord: 'Serviços', en: 'services-bg-text-en.png', word: 'Services', align: 'left' },
  { pt: 'habilidades.png', ptWord: 'Habilidades', en: 'habilidades-en.png', word: 'Skills', align: 'left' }
];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.setContent(`<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=block">`);
await page.evaluate(() => document.fonts.load('700 100px Montserrat'));

for (const target of targets) {
  const ptPng = await readFile(`public/${target.pt}`);
  const dims = ptPng.readUInt32BE(16) + 'x' + ptPng.readUInt32BE(20);
  const [width, height] = dims.split('x').map(Number);

  const png = await page.evaluate(
    async ({ width, height, ptWord, word, align }) => {
      const font = size => `700 ${size}px Montserrat`;
      const inkHeight = (text, size) => {
        const c = document.createElement('canvas').getContext('2d');
        c.font = font(size);
        const m = c.measureText(text);
        return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      };
      // Tamanho de letra em que a palavra em português ocupa a altura da imagem.
      const size = (100 * (height - 2)) / inkHeight(ptWord, 100);

      // O contorno sai da diferença entre a letra cheia e a letra "comida" por
      // dentro: a fonte tem contornos sobrepostos que o strokeText deixaria à mostra.
      const SCALE = 3;
      const EDGE = 2;
      const measure = text => {
        const c = document.createElement('canvas').getContext('2d');
        c.font = font(size);
        return c.measureText(text);
      };
      const m = measure(word);
      // Se a palavra em inglês for mais larga que a imagem, encolhe para caber.
      const fit = Math.min(1, (width - 2) / m.width);
      const drawSize = size * fit;
      const hi = document.createElement('canvas');
      hi.width = width * SCALE;
      hi.height = height * SCALE;
      const hctx = hi.getContext('2d', { willReadFrequently: true });
      hctx.font = font(drawSize * SCALE);
      const w = m.width * fit * SCALE;
      const x = align === 'right' ? hi.width - w - SCALE : SCALE;
      const y = SCALE + measure(ptWord).actualBoundingBoxAscent * SCALE;
      hctx.fillText(word, x, y);

      const { data } = hctx.getImageData(0, 0, hi.width, hi.height);
      const inside = (px, py) =>
        px >= 0 && py >= 0 && px < hi.width && py < hi.height &&
        data[(py * hi.width + px) * 4 + 3] > 127;
      const edge = hctx.createImageData(hi.width, hi.height);
      for (let py = 0; py < hi.height; py++) {
        for (let px = 0; px < hi.width; px++) {
          if (!inside(px, py)) continue;
          let border = false;
          for (let d = 1; d <= EDGE && !border; d++) {
            border = !inside(px - d, py) || !inside(px + d, py) ||
              !inside(px, py - d) || !inside(px, py + d);
          }
          if (border) {
            const i = (py * hi.width + px) * 4;
            edge.data.set([255, 255, 255, 255], i);
          }
        }
      }
      hctx.clearRect(0, 0, hi.width, hi.height);
      hctx.putImageData(edge, 0, 0);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(hi, 0, 0, width, height);
      return canvas.toDataURL('image/png').split(',')[1];
    },
    { width, height, ptWord: target.ptWord, word: target.word, align: target.align }
  );

  const { writeFile } = await import('node:fs/promises');
  await writeFile(`public/${target.en}`, Buffer.from(png, 'base64'));
  console.log('gerado', target.en, `${width}x${height}`);
}
await browser.close();
