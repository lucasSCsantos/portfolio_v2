// O Mar por profundidade (0 = raso, 1 = fundo): a cor da água e o tom do texto direto sobre ela.
// Uma regra só para o Mar do desktop e para o fundo das Telas do celular. Módulo puro.

import theme from '../styles/theme';
import { mixColor, mixColorLinear, toneOver, type SceneParams } from './scene';

// Do raso (cor da onda da frente da Cena) ao fundo do mar, atingido em 85% da descida:
// o Contato, no fim, já fica na água mais escura.
// Cada Cena tem a sua escala, sempre escurecendo a partir da onda da frente; entre as duas, a Cena mistura pelo `dark`.
const DEPTH_STOPS = [0, 0.18, 0.42, 0.66, 0.85];
const DEEPER_DAY = ['#2A74A6', '#085690', '#043A6B', '#010F22'];
const DEEPER_NIGHT = ['#0a3058', '#072545', '#041930', '#010812'];

// Textos que ficam direto sobre o Mar: escuros sobre a água clara, claros sobre a escura.
// O vidro é o fundo de uma peça sobre a água (uma etiqueta, um cartão): reforça o contraste com a tinta.
const TEXT_ON_SEA: Record<SceneParams['tone'], { ink: string; accent: string; glass: string }> = {
  light: { ink: theme.colors.text, accent: theme.colors.tertiary, glass: 'rgba(255, 255, 255, 0.3)' },
  dark: { ink: theme.colors.textLight, accent: theme.colors.primary, glass: 'rgba(0, 12, 32, 0.3)' }
};

type SeaScene = Pick<SceneParams, 'waves' | 'dark' | 'seaTone'>;

// A escala só muda quando muda a Cena; o Mar do desktop consulta a cada quadro da rolagem.
let depthScale: { surface: string; dark: number; colors: string[] } | undefined;

function colorsFor(surface: string, dark: number) {
  if (depthScale?.surface !== surface || depthScale.dark !== dark) {
    const deeper = DEEPER_DAY.map((day, i) => mixColor(day, DEEPER_NIGHT[i], dark));
    depthScale = { surface, dark, colors: [surface, ...deeper] };
  }
  return depthScale.colors;
}

function seaColor(depth: number, scene: SeaScene) {
  const colors = colorsFor(scene.waves[2], scene.dark);
  const last = DEPTH_STOPS.length - 1;
  if (!(depth > 0)) return colors[0];
  if (depth >= DEPTH_STOPS[last]) return colors[last];
  const i = DEPTH_STOPS.findIndex(stop => stop > depth) - 1;
  const t = (depth - DEPTH_STOPS[i]) / (DEPTH_STOPS[i + 1] - DEPTH_STOPS[i]);
  return mixColorLinear(colors[i], colors[i + 1], t);
}

// Um trecho do Mar entre duas profundidades (o fundo de uma Tela do celular), com o tom que lê bem nas duas pontas.
export function seaSpan(from: number, to: number, scene: SeaScene) {
  const top = seaColor(from, scene);
  const bottom = seaColor(to, scene);
  const tone = toneOver([top, bottom]);
  return { top, bottom, tone, ...TEXT_ON_SEA[tone] };
}

export function seaAt(depth: number, scene: SeaScene) {
  const color = seaColor(depth, scene);
  // No raso vale o tom da Cena sobre o Mar (que, na passagem entre Cenas, troca na metade);
  // mais fundo, o tom que lê melhor naquela água.
  const tone = depth > 0 ? toneOver([color]) : scene.seaTone;
  return { color, tone, ...TEXT_ON_SEA[tone] };
}
