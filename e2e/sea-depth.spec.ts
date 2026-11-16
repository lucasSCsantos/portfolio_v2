import { test, expect } from '@playwright/test';
import { sceneFor, type SceneParams } from '../src/app/lib/scene';
import { seaAt, seaSpan } from '../src/app/lib/sea';
import { MIN_CONTRAST } from './contrast';

// A profundidade do Mar (0 = raso, 1 = fundo): a mesma regra pinta o Mar do desktop e as Telas do celular.

const channels = (color: string) =>
  color.startsWith('#')
    ? [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16))
    : (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const linear = (c: number) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
const luminance = (color: string) =>
  channels(color).reduce((sum, c, k) => sum + linear(c) * [0.2126, 0.7152, 0.0722][k], 0);
const contrast = (a: string, b: string) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};

const SCENES: [string, SceneParams][] = [
  ['dia', sceneFor({ mode: 'dia' })],
  ['noite', sceneFor({ mode: 'noite' })],
  ...[[3, 0], [5, 45], [7, 0], [12, 0], [17, 30], [18, 15], [21, 0]].map(
    ([h, m]): [string, SceneParams] => [
      `ao vivo ${h}h${m}`,
      sceneFor({ mode: 'ao-vivo', minutes: h * 60 + m })
    ]
  )
];

const DEPTHS = Array.from({ length: 21 }, (_, i) => i / 20);

test.describe('profundidade do Mar', () => {
  for (const [name, scene] of SCENES) {
    test(`${name}: o raso é a cor da onda da frente, sem emenda com a Cena`, () => {
      expect(channels(seaAt(0, scene).color)).toEqual(channels(scene.waves[2]));
    });

    test(`${name}: escurece do raso ao fundo`, () => {
      const lums = DEPTHS.map(depth => luminance(seaAt(depth, scene).color));
      lums.slice(1).forEach((lum, i) => expect(lum).toBeLessThanOrEqual(lums[i] + 1e-9));
    });

    test(`${name}: o texto direto sobre o Mar lê bem em qualquer profundidade`, () => {
      for (const depth of DEPTHS) {
        const { color, ink } = seaAt(depth, scene);
        expect(contrast(ink, color), `profundidade ${depth}`).toBeGreaterThanOrEqual(MIN_CONTRAST);
      }
    });

    test(`${name}: no raso, o tom do texto é o tom da Cena sobre o Mar`, () => {
      expect(seaAt(0, scene).tone).toBe(scene.seaTone);
    });
  }

  test('o fundo mistura as escalas de dia e de noite pelo `dark` da Cena', () => {
    expect(channels(seaAt(1, sceneFor({ mode: 'dia' })).color)).toEqual(channels('#010F22'));
    expect(channels(seaAt(1, sceneFor({ mode: 'noite' })).color)).toEqual(channels('#010812'));
  });

  test('fora de 0..1 a profundidade fica presa ao raso e ao fundo', () => {
    const day = sceneFor({ mode: 'dia' });
    expect(seaAt(-1, day)).toEqual(seaAt(0, day));
    expect(seaAt(2, day)).toEqual(seaAt(1, day));
  });

  // As Telas do celular: cada uma desce um sexto do Mar, do raso (Sobre) ao fundo (Contato).
  // O contraste do texto fica com o conteúdo de cada Tela: no dia, a Tela 2 cruza a troca de tom.
  for (const [name, scene] of SCENES) {
    test(`${name}: cada Tela vai da profundidade da anterior até a sua`, () => {
      for (let i = 0; i < 6; i++) {
        const { top, bottom } = seaSpan(i / 6, (i + 1) / 6, scene);
        expect(top).toBe(seaAt(i / 6, scene).color);
        expect(bottom).toBe(seaAt((i + 1) / 6, scene).color);
      }
    });
  }
});
