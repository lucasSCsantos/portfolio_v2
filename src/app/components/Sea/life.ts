// A Vida marinha: que animal vive em que profundidade do Mar e onde cada um está na tela
// a cada instante. Uma regra só para o Mar do desktop e para o mergulho do celular. Módulo puro.

import { SHAPES, type CreatureKind } from './creatures';

export type Creature = {
  kind: CreatureKind;
  /** Profundidade do Mar (0 = raso, 1 = fundo) em que o animal cruza o meio da tela. */
  at: number;
  /** Largura do desenho, em px. */
  size: number;
  /** Nado próprio, em px/s: positivo vai para a direita, negativo para a esquerda. */
  speed: number;
  /** Quanto a rolagem o faz subir (distância: menor = mais longe, demora mais a passar). */
  parallax: number;
  opacity: number;
  /** Onde começa na travessia da tela, de 0 a 1. */
  phase: number;
  /** Sobe e desce da linha de nado, em px. */
  bob?: number;
  /** Cor do que brilha no animal (os do fundo, onde a luz não chega). */
  glow?: string;
  /** Animais extras não aparecem na Versão para celular. */
  extra?: boolean;
};

// As quatro zonas do Mar, do raso ao fundo: cada uma tem os seus animais.
export const ZONES = [
  { name: 'raso', from: 0 },
  { name: 'meia-água', from: 0.24 },
  { name: 'penumbra', from: 0.48 },
  { name: 'abismo', from: 0.72 }
] as const;

export type ZoneName = (typeof ZONES)[number]['name'];

export const zoneAt = (depth: number): ZoneName =>
  [...ZONES].reverse().find(({ from }) => depth >= from)?.name ?? ZONES[0].name;

const LURE = '#ffe9a3';
const BIOLUMINESCENCE = '#7df9ff';

export const SEA_LIFE: Creature[] = [
  // Raso: cardumes, tartaruga e peixes de recife, na água ainda clara.
  { kind: 'school', at: 0.03, size: 260, speed: 46, parallax: 0.9, opacity: 0.3, phase: 0.55, bob: 10 },
  { kind: 'turtle', at: 0.09, size: 190, speed: -22, parallax: 0.7, opacity: 0.3, phase: 0.3, bob: 14 },
  { kind: 'angelfish', at: 0.14, size: 70, speed: 18, parallax: 1, opacity: 0.32, phase: 0.2, bob: 8, extra: true },
  { kind: 'angelfish', at: 0.155, size: 54, speed: 20, parallax: 1, opacity: 0.28, phase: 0.12, bob: 8 },
  { kind: 'school', at: 0.2, size: 170, speed: -38, parallax: 0.55, opacity: 0.2, phase: 0.7, bob: 8, extra: true },

  // Meia-água: os nadadores de mar aberto.
  { kind: 'dolphin', at: 0.27, size: 230, speed: 74, parallax: 0.85, opacity: 0.28, phase: 0.4, bob: 22 },
  { kind: 'dolphin', at: 0.285, size: 180, speed: 70, parallax: 0.8, opacity: 0.22, phase: 0.28, bob: 22 },
  { kind: 'manta', at: 0.36, size: 280, speed: -26, parallax: 0.65, opacity: 0.24, phase: 0.45, bob: 16 },
  { kind: 'jellyfish', at: 0.43, size: 64, speed: 5, parallax: 1.05, opacity: 0.3, phase: 0.22, bob: 18 },
  { kind: 'jellyfish', at: 0.45, size: 44, speed: -4, parallax: 0.9, opacity: 0.24, phase: 0.2, bob: 14, extra: true },

  // Penumbra: os grandes, já quase sem luz.
  { kind: 'shark', at: 0.52, size: 320, speed: 40, parallax: 0.8, opacity: 0.22, phase: 0.35, bob: 8 },
  { kind: 'whale', at: 0.6, size: 620, speed: -14, parallax: 0.4, opacity: 0.13, phase: 0.35, bob: 12 },
  { kind: 'squid', at: 0.68, size: 170, speed: 34, parallax: 0.95, opacity: 0.22, phase: 0.5, bob: 10 },

  // Abismo: quem vive no escuro traz a própria luz.
  { kind: 'octopus', at: 0.76, size: 130, speed: -9, parallax: 0.9, opacity: 0.2, phase: 0.25, bob: 12 },
  { kind: 'lanternfish', at: 0.82, size: 220, speed: -30, parallax: 0.75, opacity: 0.26, phase: 0.6, bob: 8, glow: BIOLUMINESCENCE },
  { kind: 'jellyfish', at: 0.86, size: 86, speed: 4, parallax: 1, opacity: 0.34, phase: 0.75, bob: 16, glow: BIOLUMINESCENCE, extra: true },
  { kind: 'anglerfish', at: 0.91, size: 190, speed: 12, parallax: 0.85, opacity: 0.3, phase: 0.18, bob: 10, glow: LURE }
];

// No celular os animais são menores e mais lentos, na medida da tela estreita.
const PHONE_WIDTH = 600;
const PHONE_SCALE = 0.55;

const mod = (n: number, m: number) => ((n % m) + m) % m;

export type Water = {
  /** Profundidade do topo da tela no Mar: 0 no raso, 1 no fundo, negativa enquanto o Mar ainda não encostou no topo. */
  depth: number;
  /** Quanto se rola (px) do raso ao fundo. */
  span: number;
  /** Tamanho da tela, em px. */
  width: number;
  height: number;
  /** Segundos desde o começo. */
  time: number;
};

/**
 * Onde o animal está na tela: cruza a largura nadando (um pouco mais rápido quando a página rola)
 * e sobe conforme se desce, passando pelo meio da tela na sua profundidade.
 */
export function swim(creature: Creature, index: number, { depth, span, width, height, time }: Water) {
  const { kind, at, speed, parallax, phase, bob = 0 } = creature;
  const scale = width < PHONE_WIDTH ? PHONE_SCALE : 1;
  const w = creature.size * scale;
  const h = (w * SHAPES[kind].height) / SHAPES[kind].width;
  const seed = index * 2.399;

  const lane = width + w * 2;
  const travelled = mod(phase * lane + time * Math.abs(speed) * scale + depth * span * 0.08, lane);
  const x = speed > 0 ? travelled - w : width - travelled;

  const y =
    height / 2 - h / 2 + (at - depth) * span * parallax + Math.sin(time * 0.5 + seed) * bob * scale;

  // Só existe dentro da água: some acima da superfície (o topo do Mar na tela) e fora da tela.
  const surface = -depth * span;
  const visible = y + h > 0 && y < height && y >= surface && x + w > 0 && x < width;

  return { x, y, width: w, height: h, visible, facing: speed > 0 ? 1 : -1 };
}
